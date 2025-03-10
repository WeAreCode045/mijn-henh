
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
    const columns = area.columns || 2; // Default to 2 columns
    const imagesPerPage = columns * 3; // 3 rows of configurable columns
    const totalPages = Math.ceil((area.imageIds?.length || 0) / imagesPerPage);
    
    return Array.from({ length: totalPages }).map((_, pageIndex) => {
      return (
        <Page key={`${index}-${pageIndex}`} size="A4" style={styles.page}>
          <Header settings={settings} styles={styles} />
          {pageIndex === 0 && (
            <>
              <Text style={styles.sectionTitle}>{area.title}</Text>
              <Text style={[styles.text, { marginBottom: 20 }]}>{area.description}</Text>
            </>
          )}
          <View style={{
            ...styles.imageGrid,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: columns > 1 ? 'space-between' : 'flex-start'
          }}>
            {(area.imageIds || [])
              .slice(pageIndex * imagesPerPage, (pageIndex + 1) * imagesPerPage)
              .map((imageId, imgIndex) => {
                const imageUrl = property.images.find(img => img.id === imageId)?.url;
                if (!imageUrl) return null;

                return (
                  <Image
                    key={imgIndex}
                    src={imageUrl}
                    style={{
                      ...styles.areaGridImage,
                      width: `${100 / columns - 2}%`,
                      margin: '1%'
                    }}
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
