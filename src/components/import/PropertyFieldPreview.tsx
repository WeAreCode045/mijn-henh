
interface PropertyFieldPreviewProps {
  xmlData: any[];
  fieldMappings: Record<string, string>;
}

export function PropertyFieldPreview({ xmlData, fieldMappings }: PropertyFieldPreviewProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Preview (First Property)</h3>
      {xmlData.length > 0 && (
        <div className="border rounded p-4 text-sm">
          {Object.entries(fieldMappings)
            .filter(([_, xmlField]) => xmlField && xmlData[0][xmlField])
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
        </div>
      )}
    </div>
  );
}
