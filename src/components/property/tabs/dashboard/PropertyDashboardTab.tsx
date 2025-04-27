
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyDetailsCard } from "./cards/PropertyDetailsCard";
import { PropertyStatsCard } from "../../dashboard/PropertyStatsCard";
import { SubmissionsCard } from "../../dashboard/SubmissionsCard";

interface PropertyDashboardTabProps {
  formData: PropertyFormData;
  propertyId: string;
  onDelete?: () => Promise<void>;
}

export function PropertyDashboardTab({
  formData,
  propertyId,
  onDelete,
}: PropertyDashboardTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Property Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Details Card */}
        <PropertyDetailsCard property={formData} />

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              {onDelete && (
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  className="w-full"
                >
                  Delete Property
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Property Stats Card */}
        <PropertyStatsCard property={formData} />

        {/* Recent Submissions Card */}
        <SubmissionsCard propertyId={propertyId} />
      </div>
    </div>
  );
}
