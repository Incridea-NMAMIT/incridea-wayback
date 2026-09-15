import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

/**
 * Hook that uses IntersectionObserver API to detect when an element comes into view
 * @param ref - Reference to the element to observe
 * @param options - Intersection observer options
 * @returns { isInView, ref } - Whether element is in view and the ref to attach
 */
export const useInView = (
  ref: RefObject<HTMLElement | null>,
  options: UseInViewOptions = {}
) => {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Create the Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once loaded, we can stop observing
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: options.threshold ?? 0.1,
      rootMargin: options.rootMargin ?? '50px',
      root: options.root ?? null,
    });

    observer.observe(ref.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref, options]);

  return { isInView };
};
