
export const getPrintStyles = () => `
  @media print {
    @page {
      size: A4 portrait;
      margin: 1cm;
    }
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .dialog-content {
      height: auto !important;
      overflow: visible !important;
      max-height: none !important;
      position: relative !important;
      display: block !important;
    }
    .dialog-content > * {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 20mm;
    }
    button, .no-print {
      display: none !important;
    }
    .brochure-cover-section {
      page-break-after: always;
    }
    .brochure-description-section {
      page-break-after: always;
    }
    .brochure-photos-section {
      page-break-after: always;
    }
    .brochure-floorplans-section {
      page-break-after: always;
    }
    .brochure-contact-section {
      page-break-after: avoid;
    }
    img {
      display: block !important;
      max-width: 100% !important;
      height: auto !important;
      page-break-inside: avoid;
    }
    .grid {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 10mm !important;
    }
    [style*="aspect-ratio"] {
      aspect-ratio: unset !important;
      height: auto !important;
    }
    .absolute {
      position: relative !important;
    }
    .relative {
      position: relative !important;
    }
  }
`;
