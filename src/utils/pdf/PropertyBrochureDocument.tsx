
import { Document } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';

interface PropertyBrochureDocumentProps {
  property: PropertyData;
  settings: AgencySettings;
}

export const PropertyBrochureDocument = ({ property, settings }: PropertyBrochureDocumentProps) => {
  // Placeholder for the rebuilt PDF functionality
  return (
    <Document>
      {/* PDF content will be rebuilt later */}
    </Document>
  );
};
