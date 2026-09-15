import { useEffect, useState } from 'react';

/**
 * Hook to preload images before rendering
 * @param imageUrls Array of image URLs to preload
 * @returns Object with loading state and error state
 */
export const useImagePreload = (imageUrls: string[]) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (imageUrls.length === 0) {
            setImagesLoaded(true);
            return;
        }

        let loadedCount = 0;
        const totalImages = imageUrls.length;
        const imageElements: HTMLImageElement[] = [];

        const handleImageLoad = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                setImagesLoaded(true);
            }
        };

        const handleImageError = (url: string) => {
            setError(`Failed to load image: ${url}`);
            // Still mark as loaded to prevent infinite loading
            loadedCount++;
            if (loadedCount === totalImages) {
                setImagesLoaded(true);
            }
        };

        imageUrls.forEach(url => {
            const img = new Image();
            img.onload = handleImageLoad;
            img.onerror = () => handleImageError(url);
            img.src = url;
            imageElements.push(img);
        });

        return () => {
            // Cleanup: remove event listeners
            imageElements.forEach(img => {
                img.onload = null;
                img.onerror = null;
            });
        };
    }, [imageUrls]);

    return { imagesLoaded, error };
};