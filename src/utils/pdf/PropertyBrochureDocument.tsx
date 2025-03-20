
import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';

interface PropertyBrochureDocumentProps {
  property: PropertyData;
  settings?: any;
}

export function PropertyBrochureDocument({ property, settings }: PropertyBrochureDocumentProps) {
  const styles = {
    page: {
      padding: '40px',
      fontSize: '12pt',
      fontFamily: 'Helvetica',
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24pt',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    section: {
      marginBottom: '20px',
    },
    image: {
      width: '100%',
      height: '300px',
      objectFit: 'cover' as const,
      marginBottom: '20px',
      borderRadius: '5px',
    },
    details: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      marginBottom: '20px',
    },
    detail: {
      width: '33%',
      marginBottom: '10px',
    },
    detailLabel: {
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    footer: {
      marginTop: '20px',
      fontSize: '10pt',
      color: '#666',
      textAlign: 'center' as const,
    },
  };

  // Get the featured image URL or use the first image
  const featuredImageUrl = property.featuredImage || 
    (property.images && property.images.length > 0 ? 
      (typeof property.images[0] === 'string' ? property.images[0] : property.images[0].url) : 
      null);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{property.title}</Text>
            <Text>{property.address}</Text>
          </View>
          <View>
            <Text style={{ fontSize: '18pt', fontWeight: 'bold' }}>{property.price}</Text>
          </View>
        </View>

        {featuredImageUrl && (
          <View>
            <Image src={featuredImageUrl} style={styles.image} />
          </View>
        )}

        <View style={styles.details}>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Bedrooms</Text>
            <Text>{property.bedrooms}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Bathrooms</Text>
            <Text>{property.bathrooms}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Living Area</Text>
            <Text>{property.livingArea}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Total Area</Text>
            <Text>{property.sqft}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Build Year</Text>
            <Text>{property.buildYear}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Energy Label</Text>
            <Text>{property.energyLabel}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: '16pt', fontWeight: 'bold', marginBottom: '10px' }}>Description</Text>
          <Text>{property.description}</Text>
        </View>

        {property.features && property.features.length > 0 && (
          <View style={styles.section}>
            <Text style={{ fontSize: '16pt', fontWeight: 'bold', marginBottom: '10px' }}>Features</Text>
            {property.features.map((feature, index) => (
              <Text key={index}>• {feature.description}</Text>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text>
            {settings?.name || 'Real Estate Agency'} • {settings?.phone || ''} • {settings?.email || ''}
          </Text>
          <Text>{settings?.address || ''}</Text>
        </View>
      </Page>
    </Document>
  );
}
