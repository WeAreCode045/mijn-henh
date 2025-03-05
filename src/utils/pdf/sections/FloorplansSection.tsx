
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const FloorplansSection = ({ property, settings, styles }: {
  property: PropertyData;
  settings: AgencySettings;
  styles: any;
}) => {
  // Extract and parse floorplans
  const parseFloorplans = (): any[] => {
    if (!property.floorplans || !Array.isArray(property.floorplans) || property.floorplans.length === 0) {
      return [];
    }
    
    return property.floorplans.map(plan => {
      if (typeof plan === 'string') {
        try {
          // If it's a stringified JSON object, try to parse it
          return JSON.parse(plan);
        } catch (e) {
          // If parsing fails, assume it's a direct URL string
          return { id: crypto.randomUUID(), url: plan, title: 'Floorplan' };
        }
      } else if (plan && typeof plan === 'object') {
        // If it's already an object
        return {
          id: plan.id || crypto.randomUUID(),
          url: plan.url || '',
          title: plan.title || 'Floorplan'
        };
      }
      
      // Fallback for invalid data
      return { id: crypto.randomUUID(), url: '', title: 'Floorplan' };
    }).filter(plan => plan.url); // Filter out items without URLs
  };

  const floorplans = parseFloorplans();
  
  // Don't render the section if there are no floorplans
  if (floorplans.length === 0) {
    return null;
  }

  return (
    <Page size="A4" style={styles.page}>
      <Header settings={settings} styles={styles} />
      <Text style={styles.sectionTitle}>Floorplans</Text>
      <View style={styles.imageGrid}>
        {floorplans.map((floorplan, index) => (
          <View key={floorplan.id || index} style={styles.gridItem}>
            <Image src={floorplan.url} style={styles.gridImage} />
            {floorplan.title && (
              <Text style={styles.imageCaption}>{floorplan.title}</Text>
            )}
          </View>
        ))}
      </View>
      <Footer settings={settings} styles={styles} />
    </Page>
  );
};
