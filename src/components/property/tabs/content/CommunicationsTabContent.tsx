
import React from 'react';
import { PropertyData } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CommunicationsTabContentProps {
  property: PropertyData;
  propertyId?: string; // For compatibility with older code
}

export function CommunicationsTabContent({ property, propertyId }: CommunicationsTabContentProps) {
  // Use property.id if available, otherwise use propertyId
  const id = property?.id || propertyId;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Communications features will be available soon.</p>
          {id && (
            <p className="text-sm text-muted-foreground mt-2">
              Property ID: {id}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
