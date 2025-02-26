
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const FloorplansSection = ({ property, settings, styles }: {
  property: PropertyData;
  settings: AgencySettings;
  styles: any;
}) => (
  <Page size="A4" style={styles.page}>
    <Header settings={settings} styles={styles} />
    <Text style={styles.sectionTitle}>Floorplans</Text>
    <View style={styles.imageGrid}>
      {(property.floorplans || []).map((plan, index) => (
        <Image key={index} src={plan} style={styles.gridImage} />
      ))}
    </View>
    <Footer settings={settings} styles={styles} />
  </Page>
);
