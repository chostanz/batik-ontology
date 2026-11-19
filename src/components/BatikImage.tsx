import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import imageManifest from '@/lib/imageManifest.json';

interface BatikImageProps {
  id: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

const manifest = imageManifest as Record<string, string>;

export function BatikImage({ id, alt, className = '' }: BatikImageProps) {
  const fileName = manifest[id] || `${id}.jpg`;

  // Candidate paths in order (real photographic image first, then svg fallback)
  const candidates = [
    `./gambar/${fileName}`,
    `/gambar/${fileName}`,
    `./gambar/${id}.svg`,
    `/gambar/${id}.svg`,
    `./gambar/${id}.jpg`,
    `./gambar/${id}.webp`,
    `./gambar/${id}.png`,
    `/img/${fileName}`,
    `/img/${id}`,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFE8DC] text-[#7A6451] p-4 text-center border border-[#D9CEBC] rounded-xl ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-[#E4D7C4] flex items-center justify-center text-[#99732B] mb-2 shadow-inner">
          <Sparkles className="w-5 h-5 opacity-70" />
        </div>
        <span className="text-[11px] font-semibold tracking-wide text-[#5C4533] uppercase line-clamp-1">
          {alt}
        </span>
        <span className="text-[9px] text-[#8C7663] mt-0.5">Motif Tradisional</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#FAF6EE] rounded-xl ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#EFE8DC] via-[#FAF6EE] to-[#EFE8DC] animate-pulse z-10" />
      )}
      <img
        src={candidates[currentIndex]}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className="w-full h-full object-cover object-center transition-all duration-500"
      />
    </div>
  );
}
