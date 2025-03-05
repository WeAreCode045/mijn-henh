
import { Document } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { Section } from '@/components/brochure/TemplateBuilder';
import { createStyles } from './styles/pdfStyles';
import { CoverSection } from './sections/CoverSection';
import { DetailsSection } from './sections/DetailsSection';
import { AreasSection } from './sections/AreasSection';
import { LocationSection } from './sections/LocationSection';
import { ContactSection } from './sections/ContactSection';

interface PropertyBrochureDocumentProps {
  property: PropertyData;
  settings: AgencySettings;
  template?: Section[];
}

export const PropertyBrochureDocument = ({ property, settings, template }: PropertyBrochureDocumentProps) => {
  const styles = createStyles(settings);

  const defaultSections: Section[] = [
    { id: 'cover', type: 'cover', title: 'Cover Page', design: { padding: '2rem', containers: [] } },
    { id: 'details', type: 'details', title: 'Property Details', design: { padding: '2rem', containers: [] } },
    { id: 'location', type: 'location', title: 'Location', design: { padding: '2rem', containers: [] } },
    { id: 'areas', type: 'areas', title: 'Areas', design: { padding: '2rem', containers: [] } },
    { id: 'contact', type: 'contact', title: 'Contact', design: { padding: '2rem', containers: [] } }
  ];

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'cover':
        return <CoverSection property={property} settings={settings} styles={styles} />;
      case 'details':
        return <DetailsSection property={property} settings={settings} styles={styles} />;
      case 'areas':
        return <AreasSection property={property} settings={settings} styles={styles} />;
      case 'location':
        return <LocationSection property={property} settings={settings} styles={styles} />;
      case 'contact':
        return <ContactSection property={property} settings={settings} styles={styles} />;
      default:
        return null;
    }
  };

  const sections = template || defaultSections;
  
  return (
    <Document>
      {sections.map((section) => renderSection(section))}
    </Document>
  );
};
