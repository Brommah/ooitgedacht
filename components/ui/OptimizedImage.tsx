import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  /** Enable lazy loading (default: true) */
  lazy?: boolean;
  /** Placeholder to show while loading */
  placeholder?: 'blur' | 'skeleton' | 'none';
  /** Blur hash or data URL for blur placeholder */
  blurDataUrl?: string;
  /** Custom srcSet for responsive images */
  srcSet?: string;
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** Priority loading (above the fold images) */
  priority?: boolean;
  /** Object fit style */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Object position */
  objectPosition?: string;
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: () => void;
}

/**
 * Optimized Image component with lazy loading,
 * placeholder support, and responsive images.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  lazy = true,
  placeholder = 'skeleton',
  blurDataUrl,
  srcSet,
  sizes,
  priority = false,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !lazy) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading slightly before in view
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate srcSet for different screen sizes if not provided
  const generateSrcSet = () => {
    if (srcSet) return srcSet;
    if (!src.startsWith('/generated/')) return undefined;
    
    // For local generated images, we could generate different sizes
    // For now, just return the original
    return undefined;
  };

  const imageStyles: React.CSSProperties = {
    objectFit,
    objectPosition,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    overflow: 'hidden',
  };

  return (
    <div style={containerStyles} className={className} ref={imgRef}>
      {/* Placeholder */}
      {!isLoaded && placeholder !== 'none' && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundColor: placeholder === 'skeleton' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : undefined,
            backgroundImage: placeholder === 'blur' && blurDataUrl 
              ? `url(${blurDataUrl})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: placeholder === 'blur' ? 'blur(20px)' : undefined,
          }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
          <span className="text-white/40 text-sm">Failed to load</span>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          srcSet={generateSrcSet()}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyles}
          className="w-full h-full"
        />
      )}
    </div>
  );
};

/**
 * Simple lazy image component for basic use cases
 */
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    className={className}
  />
);

export default OptimizedImage;




