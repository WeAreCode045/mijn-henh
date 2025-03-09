
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';

export const CoverSection = ({ property, settings, styles }: { 
  property: PropertyData; 
  settings: AgencySettings; 
  styles: any; 
}) => {
  // Get the main image (from property images where is_main=true or first image)
  const mainImage = property.images.find(img => img.is_main)?.url || 
                   (property.images.length > 0 ? property.images[0].url : null);
  
  // Get featured images (from images with is_featured_image=true)
  let displayImages: string[] = property.images
    .filter(img => img.is_featured_image)
    .map(img => img.url);
  
  // For backward compatibility
  if (displayImages.length === 0 && property.featuredImages && property.featuredImages.length > 0) {
    displayImages = property.featuredImages;
  }
  
  // Limit to max 4 images
  displayImages = displayImages.slice(0, 4);
  
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
