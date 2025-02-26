
import { View, Text } from '@react-pdf/renderer';
import { AgencySettings } from '@/types/agency';

export const Footer = ({ settings, styles }: { settings: AgencySettings; styles: any }) => (
  <View style={styles.footer}>
    <Text>{`${settings.name} - ${settings.address} - ${settings.phone} - ${settings.email}`}</Text>
  </View>
);
