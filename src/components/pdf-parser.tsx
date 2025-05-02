// PdfParser.tsx
import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import PdfJsWorker from 'pdfjs-dist/build/pdf.worker?worker';

const PdfParser: React.FC = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    // Use Vite-generated worker instance
    pdfjsLib.GlobalWorkerOptions.workerPort = new PdfJsWorker();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a PDF.');
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let content = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      content += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }

    setText(content);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{text}</pre>
    </div>
  );
};

export default PdfParser;
