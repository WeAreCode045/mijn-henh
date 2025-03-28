
const extractXmlValue = (property: Element, path: string): string => {
  try {
    // Split the path and navigate through the XML structure
    const segments = path.split('/').filter(s => s.trim() !== '');
    let currentElement: Element | null = property;
    
    for (const segment of segments) {
      if (!currentElement) return "";
      
      // Handle attribute selectors (e.g., @Language)
      if (segment.startsWith('@')) {
        const attrName = segment.substring(1);
        return currentElement.getAttribute(attrName) || "";
      }
      
      // Handle array indices (e.g., PropertyType[3])
      if (segment.includes('[') && segment.includes(']')) {
        const baseName = segment.substring(0, segment.indexOf('['));
        const index = parseInt(segment.substring(segment.indexOf('[') + 1, segment.indexOf(']'))) - 1;
        
        const elements = currentElement.getElementsByTagName(baseName);
        if (elements.length > index) {
          currentElement = elements[index];
        } else {
          currentElement = null;
        }
        continue;
      }
      
      // Get child elements
      const elements = currentElement.getElementsByTagName(segment);
      if (elements.length === 0) {
        currentElement = null;
      } else {
        currentElement = elements[0];
      }
    }
    
    return currentElement ? currentElement.textContent?.trim() || "" : "";
  } catch (error) {
    console.error("Error extracting value from path:", path, error);
    return "";
  }
};

export const processXmlProperties = (properties: Element[]) => {
  // Create a structured representation of the XML data
  return properties.map((prop, index) => {
    // Define the specific XML paths for our property data
    const addressPath = "LocationDetails/GeoAddressDetails/FormattedAddress";
    const pricePath = "Financials/PurchasePrice";
    const descriptionPath = "Descriptions/AdText/Translation";
    const buildYearPath = "Construction/ConstructionYearFrom";
    const lotSizePath = "Dimensions/Land/Area";
    const livingAreaPath = "AreaTotals/EffectiveArea";
    const bedroomsPath = "Counts/CountOfBedrooms";
    const bathroomsPath = "Counts/CountOfBathrooms";
    const energyClassPath = "ClimatControl/EnergyCertificate/EnergyClass";
    const propertyIdPath = "PropertyInfo/PublicReferenceNumber";
    const statusPath = "PropertyInfo/Status";
    const propertyTypePath = "Type/PropertyTypes/PropertyType[3]";
    
    // Extract data using the correct paths
    const address = extractXmlValue(prop, addressPath);
    const price = extractXmlValue(prop, pricePath);
    const description = extractXmlValue(prop, descriptionPath);
    const buildYear = extractXmlValue(prop, buildYearPath);
    const lotSize = extractXmlValue(prop, lotSizePath);
    const livingArea = extractXmlValue(prop, livingAreaPath);
    const bedrooms = extractXmlValue(prop, bedroomsPath);
    const bathrooms = extractXmlValue(prop, bathroomsPath);
    const energyClass = extractXmlValue(prop, energyClassPath);
    const propertyId = extractXmlValue(prop, propertyIdPath);
    const status = extractXmlValue(prop, statusPath);
    const propertyType = extractXmlValue(prop, propertyTypePath);
    
    // Extract attachments (images, floorplans, and videos)
    const attachments = prop.querySelectorAll("Attachments Attachment");
    const images: string[] = [];
    const floorplans: string[] = [];
    let virtualTour: string | null = null;
    let youtubeUrl: string | null = null;
    
    attachments.forEach(attachment => {
      const url = attachment.querySelector("URLNormalizedFile")?.textContent || "";
      const type = attachment.querySelector("Type")?.textContent || "";
      
      if (url) {
        if (type.toLowerCase().includes("floorplan")) {
          floorplans.push(url);
        } else if (type.toLowerCase().includes("video")) {
          // Check if it's a virtual tour from zien24
          if (url.toLowerCase().includes("zien24")) {
            virtualTour = url;
          } 
          // Check if it's a YouTube video
          else if (url.toLowerCase().includes("youtube") || url.toLowerCase().includes("youtu.be")) {
            youtubeUrl = url;
          }
        } else {
          images.push(url);
        }
      }
    });
    
    // Process backups if the specific paths don't work
    const extractValue = (tagName: string) => {
      const element = prop.getElementsByTagName(tagName)[0];
      return element ? element.textContent : "";
    };
    
    return {
      id: index,
      title: address || extractValue("title") || extractValue("Title"),
      price: price || extractValue("price") || extractValue("Price"),
      address: address || extractValue("address") || extractValue("Address") || extractValue("location") || extractValue("Location"),
      bedrooms: bedrooms || extractValue("bedrooms") || extractValue("Bedrooms") || extractValue("beds") || extractValue("Beds"),
      bathrooms: bathrooms || extractValue("bathrooms") || extractValue("Bathrooms") || extractValue("baths") || extractValue("Baths"),
      description: description || extractValue("description") || extractValue("Description"),
      sqft: lotSize || extractValue("sqft") || extractValue("Sqft") || extractValue("size") || extractValue("Size"),
      livingArea: livingArea || extractValue("livingArea") || extractValue("LivingArea"),
      buildYear: buildYear || extractValue("buildYear") || extractValue("BuildYear") || extractValue("YearBuilt"),
      garages: extractValue("garages") || extractValue("Garages"),
      energyLabel: energyClass || extractValue("energyLabel") || extractValue("EnergyLabel"),
      propertyId: propertyId || extractValue("id") || extractValue("ID") || extractValue("PublicReferenceNumber") || String(index),
      status: status || extractValue("status") || extractValue("Status"),
      propertyType: propertyType || extractValue("propertyType") || extractValue("PropertyType"),
      images: images,
      floorplans: floorplans,
      virtualTour: virtualTour,
      youtubeUrl: youtubeUrl,
      originalXml: prop,
    };
  });
};
