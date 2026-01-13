"use client";

import { useState } from "react";
import { performOCR } from "../utils/ocr";
import FileUploader from "../components/FileUploader";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setExtractedText(""); // Reset text on new file
    setProgress(0);
  };

  const handleExtract = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const text = await performOCR(file, (p) => setProgress(p));
      setExtractedText(text);
    } catch (error) {
      console.error(error);
      alert("Failed to extract text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 font-sans">
      <header className="bg-white dark:bg-zinc-950 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            PPA OCR Service
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Upload */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
              <h2 className="text-lg font-semibold mb-4">Upload Application</h2>
              <FileUploader onFileSelect={handleFileSelect} />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleExtract}
                  disabled={!file || isProcessing}
                  className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all ${!file || isProcessing
                    ? "bg-gray-300 dark:bg-zinc-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95"
                    }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing... {Math.round(progress * 100)}%
                    </span>
                  ) : (
                    "Extract Text"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 h-full min-h-[400px]">
              <h2 className="text-lg font-semibold mb-4">Extraction Results</h2>
              {extractedText ? (
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg overflow-auto whitespace-pre-wrap text-sm font-mono border border-gray-200 dark:border-zinc-800">
                    {extractedText}
                  </pre>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-lg">
                  <svg
                    className="w-12 h-12 mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>Results will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
