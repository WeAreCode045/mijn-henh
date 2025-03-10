
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';

export const CoverSection = ({ property, settings, styles }: { 
  property: PropertyData; 
  settings: AgencySettings; 
  styles: any; 
}) => {
  // Get the main image (main image or first featured image or first regular image)
  const mainImage = property.featuredImage || 
                   (property.featuredImages?.length > 0 ? property.featuredImages[0] : null) || 
                   (property.images?.length > 0 ? property.images[0].url : null);
  
  // Support both featuredImages, coverImages and gridImages (for backward compatibility)
  // First try featuredImages, then fallback to coverImages, then to gridImages if both are empty
  const featuredImagesToUse = (property.featuredImages && property.featuredImages.length > 0) 
    ? property.featuredImages 
    : (property.coverImages && property.coverImages.length > 0)
      ? property.coverImages
      : (property.gridImages || []);
  
  // Slice the featured images to a maximum of 4
  const displayImages = featuredImagesToUse.slice(0, 4);
  
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

      {displayImages.length > 0 && (
        <View style={styles.imageGrid}>
          {displayImages.map((url, index) => (
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
