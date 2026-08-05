"use client";

import { useEffect, useRef, useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  /**
   * Root margin for the IntersectionObserver, e.g. "200px" to preload
   * images slightly before they enter the viewport.
   */
  rootMargin?: string;
  placeholderClassName?: string;
  onError?: () => void;
}

/**
 * Loads an image only when it approaches the viewport using an
 * IntersectionObserver, with an explicit `decoding="async"` hint and
 * native `loading="lazy"` fallback.
 */
export default function LazyImage({
  src,
  alt,
  className,
  rootMargin = "200px",
  placeholderClassName,
  onError,
}: LazyImageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(id);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={placeholderClassName}>
      {inView ? (
        // eslint-disable-next-line @next/next/no-img-element -- lazy-loaded remote artwork from the Spotify CDN, not next/image compatible
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={onError}
          className={className}
        />
      ) : (
        <div aria-hidden="true" className={className} />
      )}
    </div>
  );
}
