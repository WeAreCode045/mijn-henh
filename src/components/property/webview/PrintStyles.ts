
export function getPrintStylesContent() {
  return `
    @media print {
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
      }
      
      .webview-container-main {
        border: none !important;
        box-shadow: none !important;
        background: white !important;
      }
      
      .webview-sticky-header, 
      .webview-sticky-footer, 
      .non-printable {
        display: none !important;
      }
      
      .webview-section {
        page-break-inside: avoid;
        margin-bottom: 15mm;
      }
      
      /* Make images fit better on printed page */
      img {
        max-width: 100% !important;
        height: auto !important;
      }
      
      /* Ensure text is readable */
      p, li, td, th {
        font-size: 11pt !important;
        line-height: 1.4 !important;
        color: black !important;
      }
      
      h1, h2, h3, h4 {
        color: black !important;
      }
      
      /* Ensure tables fit on page */
      table {
        width: 100% !important;
        border-collapse: collapse !important;
      }
      
      /* Add page breaks before main sections */
      .page-break-before {
        page-break-before: always !important;
      }
      
      /* Prevent page breaks inside elements */
      .no-page-break {
        page-break-inside: avoid !important;
      }
    }
  `;
}
