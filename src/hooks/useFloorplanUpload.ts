
// This file should be deleted and we should use usePropertyFloorplans.ts instead
// Let's create an empty implementation here for backward compatibility
export function useFloorplanUpload() {
  console.warn("useFloorplanUpload is deprecated. Use usePropertyFloorplans instead.");
  
  const handleFloorplanUpload = async () => {
    console.warn("This function is deprecated. Use usePropertyFloorplans instead.");
  };
  
  return { handleFloorplanUpload };
}
