import React from 'react';

type Photo = {
  url: string;
  caption: string;
};

type Props = {
  photos: Photo[];
};

const PhotoAlbum = ({ photos }: Props) => {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center space-x-4 mb-12">
          <div className="text-red-600">
            <span className="sr-only">Album</span>
          </div>
          <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Kỷ niệm Bách Khoa</h3>
        </div>
        <div className="flex space-x-6 overflow-x-auto pb-12 scrollbar-hide snap-x">
          {photos.map((photo, index) => (
            <div key={index} className="snap-center shrink-0 w-[300px] md:w-[450px] group">
              <div className="relative overflow-hidden rounded-3xl bg-slate-100 aspect-[4/5] shadow-xl transition-transform duration-500 group-hover:-rotate-2">
                <img src={photo.url} alt={photo.caption} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                  <p className="text-white text-xl font-bold">{photo.caption}</p>
                  <div className="h-1 w-12 bg-red-600 mt-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoAlbum;
