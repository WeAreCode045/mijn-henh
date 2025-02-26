
import { View, Text, Image } from '@react-pdf/renderer';
import { AgencySettings } from '@/types/agency';

export const Header = ({ settings, styles }: { settings: AgencySettings; styles: any }) => (
  <View style={styles.header}>
    {settings.logoUrl && (
      <Image src={settings.logoUrl} style={styles.headerLogo} />
    )}
    <View style={{ flex: 1 }}>
      <Text style={styles.text}>{settings.name || ''}</Text>
      <Text style={styles.text}>{settings.phone || ''}</Text>
    </View>
  </View>
);
