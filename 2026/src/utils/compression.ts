/**
 * Compresses an image file to valid WebP format under a specified size limit.
 * @param file The original image file
 * @param maxSizeMB The maximum size in MB (default 1MB)
 * @returns A Promise that resolves to the compressed File
 */
export async function compressImage(file: File, maxSizeMB: number = 1): Promise<File> {
    // If already smaller than limit, return original
    if (file.size <= maxSizeMB * 1024 * 1024) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Scale down if too large (optional, but helps validation)
                const MAX_DIMENSION = 1920;
                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    if (width > height) {
                        height = (height / width) * MAX_DIMENSION;
                        width = MAX_DIMENSION;
                    } else {
                        width = (width / height) * MAX_DIMENSION;
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error("Failed to get canvas context"));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);

                // Attempt compression
                let quality = 0.9;

                const tryCompress = () => {
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error("Canvas to Blob failed"));
                                return;
                            }

                            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.1) {
                                // Found valid size or reached min quality
                                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                                    type: "image/webp",
                                    lastModified: Date.now(),
                                });
                                resolve(compressedFile);
                            } else {
                                // Reduce quality and try again
                                quality -= 0.1;
                                tryCompress();
                            }
                        },
                        "image/webp",
                        quality
                    );
                };

                tryCompress();
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}
