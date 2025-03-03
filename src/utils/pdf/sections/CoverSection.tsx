
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';

export const CoverSection = ({ property, settings, styles }: { 
  property: PropertyData; 
  settings: AgencySettings; 
  styles: any; 
}) => {
  // Get the main image (featured image or first grid image or first regular image)
  const mainImage = property.featuredImage || 
                   (property.gridImages?.length > 0 ? property.gridImages[0] : null) || 
                   (property.images?.length > 0 ? property.images[0].url : null);
  
  // Slice the grid images to a maximum of 4
  const gridImages = (property.gridImages || []).slice(0, 4);
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.coverHeader}>
        {settings.logoUrl && (
          <Image src={settings.logoUrl} style={styles.coverLogo} />
        )}
        <Text style={styles.handwrittenText}>Wordt dit uw droomhuis?</Text>
      </View>

      {mainImage && (
        <Image 
          src={mainImage} 
          style={styles.fullWidthImage} 
        />
      )}

      {gridImages.length > 0 && (
        <View style={styles.imageGrid}>
          {gridImages.map((url, index) => (
            <Image key={index} src={url} style={styles.gridImage} />
          ))}
        </View>
      )}

      <View style={styles.coverFooter}>
        <Text style={styles.coverTitle}>
          {property.title || 'Untitled Property'}
        </Text>
        <Text style={styles.coverPrice}>
          {property.price || ''}
        </Text>
      </View>
    </Page>
  );
};
