
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const LocationSection = ({ property, settings, styles }: {
  property: PropertyData;
  settings: AgencySettings;
  styles: any;
}) => (
  <Page size="A4" style={styles.page}>
    <Header settings={settings} styles={styles} />
    <Text style={styles.sectionTitle}>Location</Text>
    <Text style={[styles.text, styles.descriptionBlock]}>
      {property.location_description}
    </Text>
    <View style={styles.imageGrid}>
      {Object.entries(
        (property.nearby_places || []).reduce((acc: Record<string, any[]>, place) => {
          if (!acc[place.type]) acc[place.type] = [];
          if (acc[place.type].length < 2) acc[place.type].push(place);
          return acc;
        }, {})
      ).map(([type, places], index) => (
        <View key={type} style={styles.categoryBlock}>
          <Text style={styles.categoryTitle}>{type.replace('_', ' ').toUpperCase()}</Text>
          {places.map((place: any, placeIndex: number) => (
            <Text key={placeIndex} style={styles.placeItem}>
              {place.name} ({place.vicinity})
            </Text>
          ))}
        </View>
      ))}
    </View>
    {property.map_image && (
      <Image src={property.map_image} style={[styles.fullWidthImage, { marginTop: 20 }]} />
    )}
    <Footer settings={settings} styles={styles} />
  </Page>
);
