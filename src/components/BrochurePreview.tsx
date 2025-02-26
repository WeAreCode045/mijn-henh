import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

import { Button } from "@/components/ui/button";
import type { PropertyData } from '@/types/property';
import type { AgencySettings } from '@/types/agency';

interface BrochurePreviewProps {
  property: PropertyData;
  settings: AgencySettings;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
    marginBottom: 20,
  },
  details: {
    fontSize: 12,
    marginBottom: 10,
  },
});

const CoverPage = ({ property, settings, images }: { property: PropertyData, settings: AgencySettings, images: string[] }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.section}>
      <Text style={styles.title}>{property.title}</Text>
      {images.length > 0 && (
        <Image style={styles.coverImage} src={images[0]} />
      )}
      <Text style={styles.details}>Price: {property.price}</Text>
      <Text style={styles.details}>Address: {property.address}</Text>
    </View>
  </Page>
);

export function BrochurePreview({ property, settings }: BrochurePreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    pdf.text(`Property: ${property.title}`, 10, 10);

    const blob = pdf.output('blob');
    saveAs(blob, `${property.title}.pdf`);

    setIsGenerating(false);
  };

  const propertyImageUrls = property.images.map(img => img.url);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-end p-4">
        <Button onClick={handleGeneratePDF} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate PDF'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <CoverPage
          property={property}
          settings={settings}
          images={propertyImageUrls}
        />
      </div>
    </div>
  );
}
