import Tesseract from "tesseract.js";

/**
 * Performs OCR on a given image file using Tesseract.js.
 * @param file The image file to process.
 * @param onProgress Optional callback for progress updates (0-1).
 * @returns A promise that resolves to the extracted text.
 */
export const performOCR = async (
    file: File,
    onProgress?: (progress: number) => void
): Promise<string> => {
    try {
        // 1. Preprocess image: Resize and handle rotation via Canvas
        const processedImage = await preprocessImage(file);

        // 2. Run OCR on processed image
        const result = await Tesseract.recognize(processedImage, "kor+eng", {
            logger: (m) => {
                if (m.status === "recognizing text" && onProgress) {
                    onProgress(m.progress);
                }
            },
        });
        return result.data.text;
    } catch (error) {
        console.error("OCR Error:", error);
        throw new Error("Failed to extract text from image.");
    }
};

const preprocessImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(new Error("Failed to create canvas context"));
                return;
            }

            // Max dimension to prevent memory issues on mobile
            const MAX_DIMENSION = 2000;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_DIMENSION) {
                    height *= MAX_DIMENSION / width;
                    width = MAX_DIMENSION;
                }
            } else {
                if (height > MAX_DIMENSION) {
                    width *= MAX_DIMENSION / height;
                    height = MAX_DIMENSION;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Drawing to canvas automatically handles EXIF orientation in modern browsers
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to grayscale to improve OCR accuracy
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg; // R
                data[i + 1] = avg; // G
                data[i + 2] = avg; // B
            }
            ctx.putImageData(imageData, 0, 0);

            resolve(canvas.toDataURL("image/jpeg"));
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};
