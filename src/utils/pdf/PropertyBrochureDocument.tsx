
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import React from 'react';

interface PropertyBrochureDocumentProps {
  property: PropertyData;
  settings: AgencySettings;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: 'contain',
  },
  propertyTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    marginBottom: 30,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featuredImage: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    objectFit: 'cover',
    borderRadius: 5,
  },
  description: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 20,
  },
  columnContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
  specItem: {
    flexDirection: 'row',
    marginBottom: 10,
    fontSize: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  detailBox: {
    width: '33%',
    padding: 10,
    fontSize: 12,
  },
  detailValue: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  featureItem: {
    marginBottom: 5,
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  agentInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  agentContact: {
    marginLeft: 10,
    fontSize: 10,
  },
  agentName: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 5,
  },
});

export const PropertyBrochureDocument = ({ property, settings }: PropertyBrochureDocumentProps) => {
  // Determine the primary color for accents, with fallback
  const primaryColor = settings?.primary_color || '#40497A';
  const secondaryColor = settings?.secondary_color || '#E2E8F0';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{settings?.name || 'Real Estate'}</Text>
          {settings?.logo_url && (
            <Image src={settings.logo_url} style={styles.logo} />
          )}
        </View>

        {/* Property title and address */}
        <Text style={styles.propertyTitle}>{property.title}</Text>
        <Text style={styles.address}>{property.address}</Text>

        {/* Featured Image */}
        {property.featuredImage && (
          <Image src={property.featuredImage} style={styles.featuredImage} />
        )}

        {/* Property details */}
        <View style={styles.section}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailBox}>
              <Text>Bedrooms</Text>
              <Text style={styles.detailValue}>{property.bedrooms || '-'}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text>Bathrooms</Text>
              <Text style={styles.detailValue}>{property.bathrooms || '-'}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text>Size</Text>
              <Text style={styles.detailValue}>{property.sqft || '-'} sqft</Text>
            </View>
            <View style={styles.detailBox}>
              <Text>Year Built</Text>
              <Text style={styles.detailValue}>{property.buildYear || '-'}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text>Energy Label</Text>
              <Text style={styles.detailValue}>{property.energyLabel || '-'}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text>Garages</Text>
              <Text style={styles.detailValue}>{property.garages || '-'}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.columnContainer}>
            <View style={styles.column}>
              {property.features?.slice(0, 5).map((feature, index) => (
                <Text key={`feature-${index}`} style={styles.featureItem}>
                  • {typeof feature === 'string' ? feature : feature.description}
                </Text>
              ))}
            </View>
            <View style={styles.column}>
              {property.features?.slice(5, 10).map((feature, index) => (
                <Text key={`feature-${index + 5}`} style={styles.featureItem}>
                  • {typeof feature === 'string' ? feature : feature.description}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Agent information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.agentInfo}>
            <View style={styles.agentContact}>
              <Text style={styles.agentName}>{property.agent?.name || settings?.name || 'Agent'}</Text>
              <Text>{settings?.phone || ''}</Text>
              <Text>{settings?.email || ''}</Text>
              <Text>{settings?.address || ''}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>© {new Date().getFullYear()} {settings?.name || 'Real Estate Agency'}</Text>
        </View>
      </Page>
    </Document>
  );
};
