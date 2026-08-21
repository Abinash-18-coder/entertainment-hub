import { useState } from 'react';
import { User, Film } from 'lucide-react';

export default function ImageWithFallback({
  src,
  alt,
  type = 'poster', // 'poster' | 'backdrop' | 'person'
  className = '',
  aspectRatio = 'aspect-[2/3]'
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If no source provided or image fails to load, display clean placeholder
  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-900 border border-brand-border text-brand-subtle ${aspectRatio} ${className}`}
      >
        {type === 'person' ? (
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <User className="h-8 w-8 text-slate-600 mb-1" />
            <span className="text-[10px] text-slate-500 font-medium">No Photo</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <Film className="h-10 w-10 text-slate-600 mb-1" />
            <span className="text-[11px] text-slate-500 font-medium">No Image</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${aspectRatio} ${className}`}>
      {/* Loading Skeleton underneath while image downloads */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}