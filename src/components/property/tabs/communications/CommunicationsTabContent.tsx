
import React from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Communications</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Property Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No communications for this property yet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
