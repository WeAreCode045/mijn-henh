
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { Page, View, Text, Image } from "@react-pdf/renderer";

export const createCoverPage = ({
  property,
  settings,
  styles,
}: {
  property: PropertyData;
  settings: AgencySettings;
  styles: any;
}) => {
  // Get the main image (from property images where is_main=true or first image)
  const mainImage = property.images.find(img => img.is_main)?.url || 
                   (property.images.length > 0 ? property.images[0].url : null);
  
  // Get featured images (from images with is_featured_image=true)
  const gridImages = property.images
    .filter(img => img.is_featured_image)
    .map(img => img.url);
  
  // Limit to max 4 images
  const displayGridImages = gridImages.slice(0, 4);
  
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.coverHeader}>
        {settings.logoUrl && (
          <Image src={settings.logoUrl} style={styles.coverLogo} />
        )}
        <Text style={styles.coverTagline}>Uw droomhuis?</Text>
      </View>
      
      {/* Main Image */}
      {mainImage && (
        <View style={styles.mainImageContainer}>
          <Image src={mainImage} style={styles.mainImage} />
        </View>
      )}
      
      {/* Grid Images */}
      {displayGridImages.length > 0 && (
        <View style={styles.gridContainer}>
          {displayGridImages.map((imageUrl, index) => (
            <Image key={`grid-${index}`} src={imageUrl} style={styles.gridImage} />
          ))}
        </View>
      )}
      
      {/* Footer */}
      <View style={styles.coverFooter}>
        <Text style={styles.propertyTitle}>{property.title || 'Untitled Property'}</Text>
        <Text style={styles.propertyPrice}>{property.price || ''}</Text>
      </View>
    </Page>
  );
};
