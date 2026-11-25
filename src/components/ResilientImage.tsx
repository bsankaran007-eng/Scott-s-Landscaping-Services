import { useState } from 'react';
import { Trees } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  priority?: boolean;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  priority = false,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#ECF6EC] via-[#F4EBD9] to-[#E1EBE1] text-[#164E24] p-6 text-center ${className}`}
      >
        <Trees className="w-8 h-8 mb-2 text-[#164E24]/70" aria-hidden="true" />
        <span className="text-sm font-semibold tracking-tight text-[#1B241E]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
