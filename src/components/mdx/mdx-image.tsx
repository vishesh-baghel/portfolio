import Image from 'next/image';
import React from 'react';

interface MDXImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export function MDXImage({ src, alt, width, height }: MDXImageProps) {
  // If width and height are provided, use them
  if (width && height) {
    return (
      <div className="my-8 rounded-lg border border-border overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
        />
      </div>
    );
  }

  // Otherwise, use a responsive container
  return (
    <div className="my-8 rounded-lg border border-border overflow-hidden">
      <img src={src} alt={alt} className="w-full h-auto" />
    </div>
  );
}
