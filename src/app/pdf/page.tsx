'use client';

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);


  const generatePdf = async () => {
    setLoading(true);
    const htmlContent = '<h1>Hello, this is a PDF!</h1><p>This is the content of the PDF document.</p>';

    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlContent }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'generated.pdf';
        link.click();
      } else {
        console.error('Error generating PDF:', response.statusText);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generatePdf} disabled={loading}>
        {loading ? 'Generating PDF...' : 'Generate PDF'}
      </button>
    </div>
  );
}
