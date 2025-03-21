
import JSZip from 'jszip';
import { supabase } from "@/integrations/supabase/client";

export const processZipFile = async (buffer: ArrayBuffer, filename: string) => {
  try {
    // Upload ZIP to storage
    const zipPath = `imports/${filename}`;
    const { error: uploadError } = await supabase.storage
      .from('xml_imports')
      .upload(zipPath, buffer, {
        contentType: 'application/zip',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Failed to upload ZIP file: ${uploadError.message}`);
    }

    // Process ZIP
    const zip = new JSZip();
    const contents = await zip.loadAsync(buffer);
    
    const xmlFiles = [];
    const xmlUploads = [];

    // Extract and process XML files
    for (const [path, file] of Object.entries(contents.files)) {
      if (path.endsWith('.xml') && !file.dir) {
        console.log('Found XML file:', path);
        const xmlContent = await file.async('uint8array');
        const xmlFilename = `imports/${filename.replace('.zip', '')}/${path}`;
        
        // Upload XML file to storage
        const { error: xmlUploadError } = await supabase.storage
          .from('xml_imports')
          .upload(xmlFilename, xmlContent, {
            contentType: 'application/xml',
            upsert: true
          });

        if (xmlUploadError) {
          console.error(`Failed to upload XML file ${path}:`, xmlUploadError);
          continue;
        }

        xmlUploads.push(xmlFilename);
        const decoder = new TextDecoder();
        xmlFiles.push(decoder.decode(xmlContent));
      }
    }
    
    if (xmlFiles.length === 0) {
      throw new Error('No XML files found in ZIP archive');
    }

    console.log(`Found and processed ${xmlFiles.length} XML files`);
    return { xmlFiles, uploadedFiles: { zip: zipPath, xmlFiles: xmlUploads } };
  } catch (error) {
    console.error('Error processing ZIP:', error);
    throw error;
  }
};
