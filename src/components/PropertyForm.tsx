
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyTabSelector } from '@/components/property/tabs/PropertyTabSelector';
import { PropertyFormManager } from '@/components/property/tabs/wrapper/PropertyFormManager';
import { initialFormData } from '@/hooks/property-form/initialFormData';
import { PropertyData } from '@/types/property';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

export function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('content');
  
  // Create an empty property data structure with required fields for PropertyData
  const emptyProperty: PropertyData = {
    ...initialFormData,
    id: id || '',
    title: '',
    price: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    livingArea: '',
    buildYear: '',
    garages: '',
    energyLabel: '',
    hasGarden: false,
    description: ''
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">
          {id ? 'Edit Property' : 'New Property'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PropertyTabSelector
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <div className="mt-4">
          <PropertyFormManager property={emptyProperty}>
            {(formProps) => (
              <div className="mt-4">
                {/* Content will be rendered by PropertyTabSelector */}
                <div>
                  {/* Tab content will be added by the tab selector */}
                </div>
              </div>
            )}
          </PropertyFormManager>
        </div>
      </CardContent>
    </Card>
  );
}
