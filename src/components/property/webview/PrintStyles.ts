
export const getPrintStyles = () => (
  <style type="text/css" dangerouslySetInnerHTML={{
    __html: `
      @media print {
        body {
          font-family: 'Arial', sans-serif;
          color: #333;
          line-height: 1.5;
        }
        
        h1 {
          font-size: 24pt;
          margin-bottom: 10pt;
        }
        
        h2 {
          font-size: 18pt;
          margin-bottom: 8pt;
        }
        
        p {
          font-size: 12pt;
          margin-bottom: 8pt;
        }
        
        img {
          max-width: 100%;
          height: auto;
        }
        
        .page-break {
          page-break-after: always;
        }
        
        .no-print {
          display: none !important;
        }
        
        a {
          text-decoration: none;
          color: #333;
        }
        
        button, .form-container, nav, footer {
          display: none !important;
        }
      }
    `
  }} />
);

export const PrintStyles = getPrintStyles;
