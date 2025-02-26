import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings } from "@/types/agency";
import JSZip from 'jszip';

interface XmlImportSettingsProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function XmlImportSettings({ settings, onChange }: XmlImportSettingsProps) {
  const { toast } = useToast();

  const findValue = (possiblePaths: string[], element: Element): string => {
    for (const path of possiblePaths) {
      const value = path.split("/").reduce((current: Element | null, tag: string) => {
        if (!current) return null;
        const elements = current.getElementsByTagName(tag);
        return elements.length > 0 ? elements[0] : null;
      }, element)?.textContent?.trim();
      
      if (value) return value;
    }
    return "";
  };

  const downloadAndStoreImage = async (url: string): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const functionUrl = `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/download-image`;

      console.log('Downloading image from URL:', url);

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ imageUrl: url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to download image: ${errorData.error || response.statusText}`);
      }

      const { publicUrl, error } = await response.json();
      if (error) throw new Error(error);

      console.log('Successfully downloaded and stored image:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error downloading/storing image:', error);
      return null;
    }
  };

  const processXmlContent = async (xmlText: string) => {
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
              console.log(`Processing attachment with URL: ${urlElement.textContent}`);
              const imageUrl = await downloadAndStoreImage(urlElement.textContent);
              
              if (imageUrl) {
                images.push(imageUrl);
                if (!featuredImage) featuredImage = imageUrl;
              }
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
          features: [],
          images,
          floorplans: [],
          featuredImage,
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

  const processZipFile = async (buffer: ArrayBuffer, filename: string) => {
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a ZIP file",
        variant: "destructive",
      });
      return;
    }

    if (!file.name.endsWith('.zip')) {
      toast({
        title: "Error",
        description: "Only ZIP files are supported",
        variant: "destructive",
      });
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const { xmlFiles, uploadedFiles } = await processZipFile(buffer, file.name);
      console.log('Uploaded files:', uploadedFiles);
      
      let totalImported = 0;
      let totalUpdated = 0;
      let totalErrors = 0;

      // Process each XML file from the ZIP
      for (const xmlContent of xmlFiles) {
        const { imported, updated, errors } = await processXmlContent(xmlContent);
        totalImported += imported;
        totalUpdated += updated;
        totalErrors += errors;
      }

      const successMessage = [
        totalImported > 0 ? `${totalImported} properties imported` : '',
        totalUpdated > 0 ? `${totalUpdated} properties updated` : '',
        totalErrors > 0 ? `${totalErrors} errors` : ''
      ].filter(Boolean).join(', ');

      if (totalImported > 0 || totalUpdated > 0) {
        toast({
          title: "Success",
          description: successMessage,
        });
      } else {
        toast({
          title: "Warning",
          description: totalErrors > 0 
            ? `No properties were processed successfully. ${successMessage}`
            : "No properties were found to import.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import properties",
        variant: "destructive",
      });
    }
  };

  const importProperties = async () => {
    try {
      if (!settings.xmlImportUrl) {
        toast({
          title: "Error",
          description: "Please provide a ZIP file URL",
          variant: "destructive",
        });
        return;
      }

      if (!settings.xmlImportUrl.endsWith('.zip')) {
        toast({
          title: "Error",
          description: "Only ZIP files are supported",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(settings.xmlImportUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch ZIP file');
      }

      const buffer = await response.arrayBuffer();
      const filename = settings.xmlImportUrl.split('/').pop() || 
        `download_${new Date().toISOString()}.zip`;

      const { xmlFiles, uploadedFiles } = await processZipFile(buffer, filename);
      console.log('Uploaded files:', uploadedFiles);
      
      let totalImported = 0;
      let totalUpdated = 0;
      let totalErrors = 0;

      // Process each XML file from the ZIP
      for (const xmlContent of xmlFiles) {
        const { imported, updated, errors } = await processXmlContent(xmlContent);
        totalImported += imported;
        totalUpdated += updated;
        totalErrors += errors;
      }

      const successMessage = [
        totalImported > 0 ? `${totalImported} properties imported` : '',
        totalUpdated > 0 ? `${totalUpdated} properties updated` : '',
        totalErrors > 0 ? `${totalErrors} errors` : ''
      ].filter(Boolean).join(', ');

      if (totalImported > 0 || totalUpdated > 0) {
        toast({
          title: "Success",
          description: successMessage,
        });
      } else {
        toast({
          title: "Warning",
          description: totalErrors > 0 
            ? `No properties were processed successfully. ${successMessage}`
            : "No properties were found to import.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import properties. Make sure the ZIP file URL is accessible.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">ZIP Import Settings</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="xmlImportUrl">ZIP File URL</Label>
          <Input
            id="xmlImportUrl"
            name="xmlImportUrl"
            value={settings.xmlImportUrl || ""}
            onChange={onChange}
            placeholder="https://example.com/properties.zip"
          />
          <Button onClick={importProperties} type="button" className="w-full">
            Import from URL
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipFileUpload">Upload ZIP File</Label>
          <Input
            id="zipFileUpload"
            type="file"
            accept=".zip"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
