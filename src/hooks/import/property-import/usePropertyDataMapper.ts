
export function usePropertyDataMapper() {
  const mapPropertyData = (property: any, fieldMappings: Record<string, string>) => {
    const propertyData: Record<string, any> = {};
    
    Object.entries(fieldMappings).forEach(([propertyField, xmlField]) => {
      if (xmlField && property[xmlField] !== undefined) {
        propertyData[propertyField] = property[xmlField];
      }
    });
    
    return propertyData;
  };

  return {
    mapPropertyData
  };
}
