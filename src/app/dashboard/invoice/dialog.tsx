import { useState } from "react";
import { Stock } from "../stock/dataColumns";
import Invoice, { rowsSelected } from "./invoice";
import ReactDOMServer from "react-dom/server"
import { Button } from "@/components/ui/button";

export default function InvoiceDialog({selectedRows}: rowsSelected){
    const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    setLoading(true);
    // const htmlContent = '<h1>Hello, this is a PDF!</h1><p>This is the content of the PDF document.</p>';
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
        <Invoice selectedRows={selectedRows} />
      );

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
        link.download = 'invoice.pdf';
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
        <div className="bg-muted p-6 rounded-md">
      <Button onClick={generatePdf} disabled={loading}>
        {loading ? 'Generating PDF...' : 'Generate PDF'}
      </Button>
    </div>
        <Invoice selectedRows={selectedRows as unknown as Stock[]}/>
      </div>
    )
}