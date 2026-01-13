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
        const result = await Tesseract.recognize(file, "kor+eng", {
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
