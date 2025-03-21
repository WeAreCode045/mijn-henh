
import { usePropertyExistenceChecker } from "./usePropertyExistenceChecker";
import { usePropertyDatabaseStorage } from "./usePropertyDatabaseStorage";
import { usePropertyMediaDownloader } from "./usePropertyMediaDownloader";

export function usePropertyStorageService() {
  const { checkExistingProperty } = usePropertyExistenceChecker();
  const { storeProperty } = usePropertyDatabaseStorage();
  const { downloadAndUploadImage, processImages } = usePropertyMediaDownloader();

  return {
    checkExistingProperty,
    storeProperty,
    downloadAndUploadImage,
    processImages
  };
}
