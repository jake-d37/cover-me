// PdfParser.tsx
import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import PdfJsWorker from 'pdfjs-dist/build/pdf.worker?worker';

function PdfParser({ handleFile, limit, handleLocalStorage }: 
{ 
  handleFile: (file: File|undefined) => void, 
  limit: number|undefined, 
  handleLocalStorage: (file: File|undefined) => void, 
}) {

  const [text, setText] = useState('');

  useEffect(() => {
    // Use Vite-generated worker instance
    pdfjsLib.GlobalWorkerOptions.workerPort = new PdfJsWorker();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    //save pdf to local storage
    //

    //set pdf as resume globally
    handleFile(file);

    //extract text from pdf
    const extractedText = await getStringFromPdf(file, limit);
    setText(extractedText);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{text}</pre>
    </div>
  );
};

export default PdfParser;

export async function getStringFromPdf(file: File|undefined, limit: number|undefined): Promise<string> {
  //ensure pdf
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a PDF.');
      return "";
    }

    //set resume as string with file
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let content = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      //ensure it doesn't go over 'limit' number of characters
      if (limit && content.length >= limit) break;

      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      const pageText = textContent.items.map((item: any) => item.str).join(' ') + '\n';

      // Add only up to the remaining characters
      if (limit) {
        const remainingChars = limit - content.length;
        content += pageText.slice(0, remainingChars);
      } else {
        content += pageText;
      }
    }

    return content;
}