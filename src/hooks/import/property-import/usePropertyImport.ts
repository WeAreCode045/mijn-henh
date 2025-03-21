import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyImportActions } from "./usePropertyImportActions";

interface UsePropertyImportProps {
  xmlData: any[];
  fieldMappings: Record<string, string>;
}

export function usePropertyImport({ 
  xmlData,
  fieldMappings 
}: UsePropertyImportProps) {
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  
  const { 
    importSelectedProperties, 
    replaceMediaDialogOpen, 
    currentImportItem,
    setReplaceMediaDialogOpen
  } = usePropertyImportActions({
    xmlData,
    fieldMappings,
    setIsImporting,
    toast
  });

  const togglePropertySelection = (id: number) => {
    setSelectedProperties(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(propId => propId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
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
    try {
      await importSelectedProperties(selectedProperties);
    } finally {
      setIsImporting(false);
    }
  };

  return {
    selectedProperties,
    togglePropertySelection,
    selectAllProperties,
    importProperties,
    isImporting,
    replaceMediaDialogOpen,
    currentImportItem,
    setReplaceMediaDialogOpen
  };
}
