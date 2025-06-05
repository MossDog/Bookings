import React, { useState } from 'react';

// Only use images from the GalleryPlaceholders folder
const images = [
  'src/Images/GalleryPlaceholders/Aang.png',
  'src/Images/GalleryPlaceholders/Catto.jpg',
  'src/Images/GalleryPlaceholders/Grub.webp',
  'src/Images/GalleryPlaceholders/Sobbing.webp',
];

// Repeat images to fill a grid of 40
const gridImages = Array.from({ length: 40 }, (_, i) => images[i % images.length]);

const GalleryWidget: React.FC = () => {
  const [popupImg, setPopupImg] = useState<string | null>(null);

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      {/* Popup overlay */}
      {popupImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setPopupImg(null)}>
          <img
            src={popupImg}
            alt="Popup"
            className="max-w-[90vw] max-h-[90vh] rounded-lg border-4 border-white shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {gridImages.map((img, idx) => (
          <div key={idx} className="relative w-full pt-[100%] cursor-pointer" onClick={() => setPopupImg(img)}>
            <img
              src={img}
              alt={`Gallery image ${idx + 1}`}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg border"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryWidget;
