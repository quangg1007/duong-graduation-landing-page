import React, { useMemo, useState } from "react";

type Props = {
  onBack: () => void;
};

const UploadPage = ({ onBack }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setResultUrl(null);
    setError(null);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setError("Vui lòng chọn ảnh trước khi gửi.");
      return;
    }

    setUploading(true);
    setError(null);
    setResultUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const response = await fetch("/.netlify/functions/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Upload response status:", response);

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Upload thất bại: ${response.status} ${body}`);
      }

      const data = await response.json();
      setResultUrl(data.url ?? null);
    } catch (uploadError) {
      console.error(uploadError);
      setError("Không thể upload ảnh. Hãy thử lại sau.");
    } finally {
      setUploading(false);
    }
  };

  const previewStyle = useMemo(
    () => ({
      backgroundImage: preview ? `url(${preview})` : undefined,
    }),
    [preview],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
        >
          Back to invitation
        </button>

        <div className="rounded-[2rem] border border-red-100 bg-white p-10 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Upload ảnh chúc mừng</h1>
          <p className="text-slate-600 mb-8">
            Chọn ảnh và gửi lên để mình lưu trữ trong album kỷ niệm tốt nghiệp nhé.
          </p>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Chọn ảnh</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800"
              />
            </div>

            {preview && (
              <div className="rounded-3xl border border-slate-200 overflow-hidden bg-slate-100">
                <div
                  className="h-72 bg-cover bg-center"
                  style={previewStyle}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-6 py-3 text-white font-bold shadow-lg transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {uploading ? "Đang upload..." : "Upload ảnh"}
            </button>

            {resultUrl && (
              <div className="rounded-3xl border border-green-100 bg-green-50 p-4 text-sm text-green-800">
                Ảnh đã được upload thành công! Xem tại:
                <a href={resultUrl} target="_blank" rel="noreferrer" className="ml-1 font-semibold underline text-green-900">
                  {resultUrl}
                </a>
              </div>
            )}
            {error && (
              <div className="rounded-3xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
