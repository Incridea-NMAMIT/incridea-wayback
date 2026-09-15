import React, { type ImgHTMLAttributes, useState, useRef, useEffect } from 'react';
import { useInView } from '../hooks/useInView';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  placeholder?: string;
  blur?: boolean;
  className?: string;
  containerClassName?: string;
  rootMargin?: string;
  threshold?: number;
  eager?: boolean;
}

/**
 * LazyImage component that defers loading images until they come into view
 * Uses IntersectionObserver API for optimal performance
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  blur = true,
  className = '',
  containerClassName = '',
  rootMargin = '50px',
  threshold = 0.1,
  eager = false,
  ...imgProps
}) => {
  const [isLoaded, setIsLoaded] = useState(eager);
  const [imageSrc, setImageSrc] = useState<string | undefined>(eager ? src : placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isInView } = useInView(containerRef as React.RefObject<HTMLElement>, {
    threshold,
    rootMargin,
  });

  useEffect(() => {
    // If eager loading is enabled, skip the IntersectionObserver check
    if (eager) {
      setImageSrc(src);
      setIsLoaded(true);
      return;
    }

    if (!isInView) return;

    const imageElement = imgRef.current;
    if (!imageElement) return;

    // Create a new Image object to preload the image
    const img = new Image();

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };

    img.onerror = () => {
      // Keep the placeholder or src on error
      setImageSrc(src);
      setIsLoaded(true);
    };

    img.src = src;
  }, [isInView, src, eager]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${containerClassName}`}
    >
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`
          transition-opacity duration-500 ease-in-out
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${blur && !isLoaded ? 'blur-sm' : 'blur-none'}
          ${className}
        `}
        loading="lazy"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
        {...imgProps}
      />
    </div>
  );
};

export default LazyImage;
