
interface PropertyFieldPreviewProps {
  xmlData: any[];
  fieldMappings: Record<string, string>;
  includedFields: Record<string, boolean>;
}

export function PropertyFieldPreview({ xmlData, fieldMappings, includedFields }: PropertyFieldPreviewProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Preview (First Property)</h3>
      {xmlData.length > 0 && (
        <div className="border rounded p-4 text-sm">
          {Object.entries(fieldMappings)
            .filter(([propertyField, xmlField]) => 
              xmlField && 
              xmlField !== "not_mapped" && 
              xmlData[0][xmlField] &&
              includedFields[propertyField] !== false
            )
            .map(([propertyField, xmlField]) => (
              <div key={propertyField} className="mb-2">
                <strong>{propertyField}:</strong> {xmlData[0][xmlField]}
              </div>
            ))}
          {xmlData[0].images && xmlData[0].images.length > 0 && (
            <div className="mb-2">
              <strong>Images:</strong> {xmlData[0].images.length} images available
            </div>
          )}
          {xmlData[0].floorplans && xmlData[0].floorplans.length > 0 && (
            <div className="mb-2">
              <strong>Floorplans:</strong> {xmlData[0].floorplans.length} floorplans available
            </div>
          )}
          {xmlData[0].virtualTour && (
            <div className="mb-2">
              <strong>Virtual Tour:</strong> Available
            </div>
          )}
          {xmlData[0].youtubeUrl && (
            <div className="mb-2">
              <strong>YouTube Video:</strong> Available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
