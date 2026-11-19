'use client';

import React, { useState } from 'react';
import { ImageOff, Sparkles } from 'lucide-react';

interface BatikImageProps {
  id: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function BatikImage({ id, alt, className = '' }: BatikImageProps) {
  // Candidate paths in order
  const candidates = [
    `./gambar/${id}.svg`,
    `/gambar/${id}.svg`,
    `./gambar/${id.replace(/^Batik_/, '')}.svg`,
    `/img/${id}.svg`,
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
      <div className={`flex flex-col items-center justify-center bg-[#EFE8DC] text-[#7A6451] p-4 text-center border border-[#D9CEBC] ${className}`}>
        <div className="w-10 h-10 rounded-full bg-[#E4D7C4] flex items-center justify-center text-[#99732B] mb-2">
          <Sparkles className="w-5 h-5 opacity-70" />
        </div>
        <span className="text-[11px] font-semibold tracking-wide text-[#5C4533] uppercase line-clamp-1">{alt}</span>
        <span className="text-[9px] text-[#8C7663] mt-0.5">Motif Tradisional</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#F2ECE1] ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#EFE8DC] via-[#FAF6EE] to-[#EFE8DC] animate-pulse z-10" />
      )}
      <img
        src={candidates[currentIndex]}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
}
