import { google } from "googleapis";
import formidable from "formidable";
import fs from "fs";
import os from "os";
import { Readable } from "stream";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ['https://www.googleapis.com/auth/drive'],
});

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const contentType = event.headers?.['content-type'] || event.headers?.['Content-Type'];
  if (!contentType?.includes('multipart/form-data')) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Expected multipart/form-data upload' }),
    };
  }

  const buffer = Buffer.from(event.body || '', event.isBase64Encoded ? 'base64' : 'latin1');
  const req = new Readable();
  req.push(buffer);
  req.push(null);
  req.headers = event.headers;
  req.method = event.httpMethod;
  req.url = event.path || '/upload';

  const form = formidable({
    multiples: false,
    keepExtensions: true,
    uploadDir: os.tmpdir(),
  });

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Upload parse error', err);
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ error: 'Error parsing upload' }),
        });
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ error: 'No file provided' }),
        });
      }

      const filepath = file.filepath || file.filePath || file.path;
      const filename = file.originalFilename || file.newFilename || 'upload';
      const mimeType = file.mimetype || 'application/octet-stream';
      const driveFolderId = process.env.DRIVE_FOLDER_ID?.trim();

      console.log('Parsed upload file object:', {
        originalFilename: file.originalFilename,
        newFilename: file.newFilename,
        filename,
        mimeType,
        filepath,
        size: file.size,
      });
      console.log('Drive folder id:', driveFolderId);

      if (!filepath) {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ error: 'No valid temp file path from upload', file }),
        });
      }

      if (!driveFolderId) {
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Missing or empty DRIVE_FOLDER_ID' }),
        });
      }

      try {
        fs.accessSync(filepath, fs.constants.R_OK);
      } catch (accessError) {
        console.error('Uploaded temp file is not readable', { filepath, accessError });
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Uploaded temp file is not readable', filepath }),
        });
      }

      try {
        const authClient = await auth.getClient();
        const drive = google.drive({ version: 'v3', auth: authClient });

        const res = await drive.files.create({
          requestBody: {
            name: filename,
            mimeType,
            parents: [driveFolderId],
          },
          media: {
            mimeType,
            body: fs.createReadStream(filepath),
          },
          supportsAllDrives: true,
        });

        console.log('Drive create response:', res.data);

        if (!res.data?.id) {
          return resolve({
            statusCode: 500,
            body: JSON.stringify({ error: 'Drive file upload response missing file id', details: res.data }),
          });
        }

        const fileId = res.data.id;
        await drive.permissions.create({
          fileId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
          supportsAllDrives: true,
        });

        const url = `https://drive.google.com/uc?id=${fileId}`;

        resolve({
          statusCode: 200,
          body: JSON.stringify({ url, fileId }),
        });
      } catch (uploadError) {
        console.error('Drive upload error', uploadError);
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to upload file to Drive' }),
        });
      }
    });
  });
};
