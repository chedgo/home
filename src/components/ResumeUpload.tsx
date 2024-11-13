import '@/utils/promisePolyfill';
import { useState } from 'react';
import pdfToText from 'react-pdftotext';

interface ResumeUploadProps {
  value: string;
  onChange: (text: string) => void;
}

export function ResumeUpload({ value, onChange }: ResumeUploadProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  function extractText(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    setPdfLoading(true);
    setPdfError(null);
    
    pdfToText(file)
      .then((text) => {
        onChange(text);
        setPdfLoading(false);
      })
      .catch((error) => {
        console.error('Failed to extract text from pdf:', error);
        setPdfError('Failed to read PDF. Please make sure it\'s a valid PDF file.');
        setPdfLoading(false);
      });
  }

  return (
    <div>
      <div>please paste in your resume here, or upload a PDF:</div>
      <div className="relative">
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={extractText} 
          disabled={pdfLoading}
          className={pdfLoading ? 'opacity-50 cursor-not-allowed' : ''}
        />
        {pdfLoading && <span className="ml-2">Loading PDF...</span>}
        {pdfError && <div className="text-red-500 text-sm mt-1">{pdfError}</div>}
      </div>
      <div>
        <textarea
          className="border-primary/50 border-2 focus:border-primary focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
} 