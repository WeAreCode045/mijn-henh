
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyImportActions } from "./usePropertyImportActions";

export function usePropertyImport({ xmlData, fieldMappings }: { 
  xmlData: any[];
  fieldMappings: Record<string, string>;
}) {
  const [isImporting, setIsImporting] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const { toast } = useToast();
  
  const { importSelectedProperties } = usePropertyImportActions({
    xmlData,
    fieldMappings,
    setIsImporting,
    toast
  });

  const togglePropertySelection = (id: number) => {
    setSelectedProperties(prev => 
      prev.includes(id) 
        ? prev.filter(propId => propId !== id) 
        : [...prev, id]
    );
  };

  const selectAllProperties = () => {
    if (selectedProperties.length === xmlData.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(xmlData.map(property => property.id));
    }
  };

  const importProperties = async () => {
    if (selectedProperties.length === 0) {
      toast({
        title: "No properties selected",
        description: "Please select at least one property to import.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    await importSelectedProperties(selectedProperties);
    setIsImporting(false);
  };

  return {
    isImporting,
    selectedProperties,
    togglePropertySelection,
    selectAllProperties,
    importProperties
  };
}
