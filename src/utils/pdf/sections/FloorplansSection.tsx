
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PropertyData, PropertyFloorplan } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const FloorplansSection = ({ property, settings, styles }: {
  property: PropertyData;
  settings: AgencySettings;
  styles: any;
}) => {
  // Extract the floorplan URLs from the floorplans array
  const floorplanUrls = property.floorplans.map(plan => 
    typeof plan === 'string' ? plan : plan.url
  );

  return (
    <Page size="A4" style={styles.page}>
      <Header settings={settings} styles={styles} />
      <Text style={styles.sectionTitle}>Floorplans</Text>
      <View style={styles.imageGrid}>
        {floorplanUrls.map((url, index) => (
          <Image key={index} src={url} style={styles.gridImage} />
        ))}
      </View>
      <Footer settings={settings} styles={styles} />
    </Page>
  );
};
