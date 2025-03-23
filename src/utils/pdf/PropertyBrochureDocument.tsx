
import { Document } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';

interface PropertyBrochureDocumentProps {
  property: PropertyData;
  settings: AgencySettings;
}

export const PropertyBrochureDocument = ({ property, settings }: PropertyBrochureDocumentProps) => {
  // Empty component as PDF functionality will be rebuilt differently
  return <Document />;
};
