
import { supabase } from "@/integrations/supabase/client";
import { findValue } from "@/utils/xmlImport/xmlUtils";

export const processXmlContent = async (xmlText: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  
  // Get all RealEstateProperty elements
  const properties = xmlDoc.getElementsByTagName('RealEstateProperty');
  
  if (!properties || properties.length === 0) {
    console.warn('No properties found in XML file');
    return { imported: 0, updated: 0, errors: 0 };
  }

  console.log(`Found ${properties.length} RealEstateProperty elements`);

  let imported = 0;
  let updated = 0;
  let errors = 0;

  const propertiesArray = Array.from(properties);

  for (const property of propertiesArray) {
    try {
      const objectId = findValue([
        "PropertyInfo/PublicReferenceNumber",
        "PublicReferenceNumber",
        "ReferenceNumber",
        "ID"
      ], property);

      if (!objectId) {
        console.warn('Property has no object ID, skipping...');
        errors++;
        continue;
      }

      // Process attachments
      const attachmentsElement = property.getElementsByTagName('Attachments')[0];
      if (!attachmentsElement) {
        console.log(`No Attachments element found for property ${objectId}`);
        continue;
      }

      const attachments = attachmentsElement.getElementsByTagName('Attachment');
      const images: string[] = [];
      let featuredImage: string | null = null;

      if (attachments.length > 0) {
        console.log(`Processing ${attachments.length} attachments for property ${objectId}`);
        
        for (const attachment of Array.from(attachments)) {
          const urlElement = attachment.getElementsByTagName('URLNormalizedFile')[0];
          
          if (urlElement?.textContent) {
            console.log(`Found attachment with URL: ${urlElement.textContent}`);
            images.push(urlElement.textContent);
            if (!featuredImage) featuredImage = urlElement.textContent;
          }
        }
      }

      const propertyData = {
        object_id: objectId,
        title: findValue([
          "Location/Address/AddressLine1/Translation",
          "Address/Street",
          "Title",
          "PropertyTitle",
          "Name"
        ], property),
        price: findValue([
          "Financials/PurchasePrice",
          "Price",
          "SalePrice",
          "ListPrice"
        ], property),
        address: findValue([
          "LocationDetails/GeoAddressDetails/FormattedAddress",
          "Location/Address/AddressLine1/Translation",
          "Address/FullAddress",
          "Address"
        ], property),
        bedrooms: findValue([
          "Counts/CountOfBedrooms",
          "Bedrooms",
          "BedroomCount",
          "NumberOfBedrooms"
        ], property),
        bathrooms: findValue([
          "Counts/CountOfBathrooms",
          "Bathrooms",
          "BathroomCount",
          "NumberOfBathrooms"
        ], property),
        sqft: findValue([
          "AreaTotals/EffectiveArea",
          "Area",
          "TotalArea",
          "LotSize"
        ], property),
        livingArea: findValue([
          "AreaTotals/LivingArea",
          "LivingArea",
          "FloorArea",
          "InteriorArea"
        ], property),
        buildYear: findValue([
          "Construction/ConstructionYearFrom",
          "YearBuilt",
          "ConstructionYear",
          "BuildYear"
        ], property),
        garages: findValue([
          "Counts/CountOfGarages",
          "Garages",
          "GarageCount",
          "NumberOfGarages"
        ], property),
        description: findValue([
          "Descriptions/AdText/Translation",
          "Description",
          "PropertyDescription",
          "Details"
        ], property),
        propertyType: findValue([
          "Type/PropertyTypes/PropertyType",
          "PropertyType",
          "TypeOfProperty"
        ], property),
        features: [],
        images,
        floorplans: [],
        featured_image: featuredImage,
        gridImages: [],
        energyLabel: findValue([
          "EnergyRating",
          "EnergyLabel",
          "EnergyClass"
        ], property)
      };

      console.log(`Processed property ${objectId}:`, {
        imagesCount: images.length,
        hasFeaturedImage: !!featuredImage
      });

      const { data: existingProperty } = await supabase
        .from('properties')
        .select('id')
        .eq('object_id', objectId)
        .maybeSingle();

      if (existingProperty) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('object_id', objectId);
        
        if (updateError) throw updateError;
        updated++;
      } else {
        const { error: insertError } = await supabase
          .from('properties')
          .insert(propertyData);
        
        if (insertError) throw insertError;
        imported++;
      }
    } catch (error) {
      console.error('Error processing property:', error);
      errors++;
    }
  }

  return { imported, updated, errors };
};
