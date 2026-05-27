import { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function ImageWithFallback({ src, alt, ...props }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${props.className}`}
      >
        <span className="text-gray-400 text-xs">Imagen no disponible</span>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}
