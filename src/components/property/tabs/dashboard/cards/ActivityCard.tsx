
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityCardProps {
  propertyId: string;
}

export function ActivityCard({ propertyId }: ActivityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500 italic">
          No recent activity to display.
        </div>
      </CardContent>
    </Card>
  );
}
