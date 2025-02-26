
import { Page, View, Text } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const ContactSection = ({ property, settings, styles }: {
  property: PropertyData;
  settings: AgencySettings;
  styles: any;
}) => (
  <Page size="A4" style={styles.page}>
    <Header settings={settings} styles={styles} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={styles.contactBlock}>
        <Text style={styles.contactTitle}>Agency Information</Text>
        <Text style={styles.contactInfo}>{settings.name}</Text>
        <Text style={styles.contactInfo}>{settings.address}</Text>
        <Text style={styles.contactInfo}>{settings.phone}</Text>
        <Text style={styles.contactInfo}>{settings.email}</Text>
      </View>
      <View style={styles.contactBlock}>
        <Text style={styles.contactTitle}>Agent Information</Text>
        <Text style={styles.contactInfo}>Your dedicated agent</Text>
      </View>
    </View>
    <Footer settings={settings} styles={styles} />
  </Page>
);
