
import { useState } from 'react';
import { PropertyTechnicalItem } from '@/types/property';

export function usePropertyTechnicalData() {
  const [technicalItems, setTechnicalItems] = useState<PropertyTechnicalItem[]>([]);

  const addTechnicalItem = () => {
    setTechnicalItems(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: '',
        size: '',
        description: '',
        floorplanId: null,
        columns: 2 // Default column value
      }
    ]);
  };

  const updateTechnicalItem = (id: string, field: keyof PropertyTechnicalItem, value: any) => {
    setTechnicalItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeTechnicalItem = (id: string) => {
    setTechnicalItems(prev => prev.filter(item => item.id !== id));
  };

  return {
    technicalItems,
    addTechnicalItem,
    updateTechnicalItem,
    removeTechnicalItem
  };
}
