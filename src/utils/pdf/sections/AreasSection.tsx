
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const AreasSection = ({ property, settings, styles }: {
  property: PropertyData;
  settings: AgencySettings;
  styles: any;
}) => {
  return property.areas.map((area, index) => {
    console.log(`Processing area ${area.title} with ${area.imageIds?.length} images`);
    const imagesPerPage = 6; // 2 rows of 3 images
    const totalPages = Math.ceil((area.imageIds?.length || 0) / imagesPerPage);
    
    return Array.from({ length: totalPages }).map((_, pageIndex) => {
      console.log(`Creating page ${pageIndex + 1} of ${totalPages} for area ${area.title}`);
      return (
        <Page key={`${index}-${pageIndex}`} size="A4" style={styles.page}>
          <Header settings={settings} styles={styles} />
          {pageIndex === 0 && (
            <>
              <Text style={styles.sectionTitle}>{area.title}</Text>
              <Text style={[styles.text, { marginBottom: 20 }]}>{area.description}</Text>
            </>
          )}
          <View style={styles.imageGrid}>
            {(area.imageIds || [])
              .slice(pageIndex * imagesPerPage, (pageIndex + 1) * imagesPerPage)
              .map((imageId, imgIndex) => {
                const imageUrl = property.images.find(img => img.id === imageId)?.url;
                console.log(`Processing image ${imgIndex + 1} with URL:`, imageUrl);
                if (!imageUrl) return null;

                return (
                  <Image
                    key={imgIndex}
                    src={imageUrl}
                    style={styles.areaGridImage}
                  />
                );
              })}
          </View>
          <Footer settings={settings} styles={styles} />
        </Page>
      );
    });
  }).flat();
};
