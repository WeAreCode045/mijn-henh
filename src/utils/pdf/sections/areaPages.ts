
import { PropertyArea, PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { Page, View, Text, Image } from "@react-pdf/renderer";

/**
 * Creates PDF pages for an area with a dynamic layout based on the area's column setting
 */
export const createAreaPages = ({
  area,
  styles,
  settings,
  pageIndex = 0,
}: {
  area: PropertyArea;
  styles: any;
  settings: AgencySettings;
  pageIndex?: number;
}) => {
  // Determine number of columns (default to 2 if not specified)
  const columns = area.columns || 2;
  
  // Get area images
  const areaImages = area.images || [];
  
  // Calculate images per page based on columns (3 rows of images)
  const imagesPerPage = columns * 3;
  
  // Calculate total pages needed
  const totalImages = areaImages.length;
  const totalPages = Math.max(1, Math.ceil(totalImages / imagesPerPage));
  
  // Generate array of pages for this area
  return Array.from({ length: totalPages }).map((_, pageIdx) => {
    const isFirstPage = pageIdx === 0;
    const startIdx = pageIdx * imagesPerPage;
    const endIdx = Math.min(startIdx + imagesPerPage, totalImages);
    const pageImages = areaImages.slice(startIdx, endIdx);
    
    return (
      <Page key={`area-${area.id}-page-${pageIdx}`} size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {settings.logoUrl && (
            <Image src={settings.logoUrl} style={styles.logo} />
          )}
          <Text style={styles.pageNumber}>{pageIndex + pageIdx + 1}</Text>
        </View>
        
        {/* Area Title and Description (only on first page) */}
        {isFirstPage && (
          <View style={styles.areaHeader}>
            <Text style={styles.areaTitle}>{area.title}</Text>
            {area.description && (
              <Text style={styles.areaDescription}>{area.description}</Text>
            )}
          </View>
        )}
        
        {/* Images Grid */}
        <View style={{
          ...styles.imageGrid,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: columns > 1 ? 'space-between' : 'flex-start'
        }}>
          {pageImages.map((image, imgIdx) => {
            const imageUrl = typeof image === 'string' ? image : image.url;
            if (!imageUrl) return null;
            
            return (
              <Image
                key={`image-${imgIdx}`}
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
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{settings.name || 'Property Brochure'}</Text>
        </View>
      </Page>
    );
  });
};
