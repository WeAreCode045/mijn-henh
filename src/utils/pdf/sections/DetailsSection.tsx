
import { Page, View, Text } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const DetailsSection = ({ property, settings, styles }: {
  property: PropertyData;
  settings: AgencySettings;
  styles: any;
}) => (
  <Page size="A4" style={styles.page}>
    <Header settings={settings} styles={styles} />
    <View style={styles.keyInfoGrid}>
      <View style={styles.keyInfoBox}>
        <Text style={styles.keyInfoLabel}>Living Area</Text>
        <Text style={styles.keyInfoValue}>{property.livingArea} m²</Text>
      </View>
      <View style={styles.keyInfoBox}>
        <Text style={styles.keyInfoLabel}>Plot Size</Text>
        <Text style={styles.keyInfoValue}>{property.sqft} m²</Text>
      </View>
      <View style={styles.keyInfoBox}>
        <Text style={styles.keyInfoLabel}>Bedrooms</Text>
        <Text style={styles.keyInfoValue}>{property.bedrooms}</Text>
      </View>
      <View style={styles.keyInfoBox}>
        <Text style={styles.keyInfoLabel}>Bathrooms</Text>
        <Text style={styles.keyInfoValue}>{property.bathrooms}</Text>
      </View>
      <View style={styles.keyInfoBox}>
        <Text style={styles.keyInfoLabel}>Build Year</Text>
        <Text style={styles.keyInfoValue}>{property.buildYear}</Text>
      </View>
      <View style={styles.keyInfoBox}>
        <Text style={styles.keyInfoLabel}>Energy Label</Text>
        <Text style={styles.keyInfoValue}>{property.energyLabel || 'N/A'}</Text>
      </View>
    </View>
    <View style={styles.descriptionBlock}>
      <Text style={styles.text}>{property.description}</Text>
    </View>
    <Footer settings={settings} styles={styles} />
  </Page>
);
