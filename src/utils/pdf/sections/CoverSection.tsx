
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
  
  // Get featured images (from featuredImages or from images with is_featured_image=true)
  let displayImages: string[] = [];
  
  if (property.featuredImages && property.featuredImages.length > 0) {
    displayImages = property.featuredImages;
  } else if (property.images) {
    // Filter images with is_featured_image=true
    displayImages = property.images
      .filter(img => img.is_featured_image)
      .map(img => img.url);
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
