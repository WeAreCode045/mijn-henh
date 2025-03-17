
import React from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, FileText, Trash2 } from "lucide-react";

interface DashboardTabContentProps {
  property: PropertyData;
  onDelete?: () => Promise<void>;
  onWebView?: (e?: React.MouseEvent) => void;
  handleSaveAgent?: (agentId: string) => void;
}

export function DashboardTabContent({ 
  property, 
  onDelete,
  onWebView,
  handleSaveAgent
}: DashboardTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Property Dashboard</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onWebView}
            className="flex items-center gap-1"
          >
            <ArrowUpRight className="h-4 w-4" />
            <span>Preview</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            <span>PDF</span>
          </Button>
          
          {onDelete && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onDelete}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Property ID:</span>
                <p className="text-sm font-mono">{property.id}</p>
              </div>
              <div>
                <span className="font-medium">Title:</span>
                <p>{property.title || 'Untitled Property'}</p>
              </div>
              <div>
                <span className="font-medium">Address:</span>
                <p>{property.address || 'No address specified'}</p>
              </div>
              <div>
                <span className="font-medium">Price:</span>
                <p>{property.price ? `$${property.price}` : 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity found.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
