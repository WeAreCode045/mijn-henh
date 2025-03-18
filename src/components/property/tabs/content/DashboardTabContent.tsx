
import React from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, FileText, Trash2, Edit } from "lucide-react";

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
            <div className="space-y-4">
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
                <p>{property.price ? `€${property.price}` : 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium">Type:</span>
                <p>{property.propertyType || property.property_type || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium">Features:</span>
                <p>{property.bedrooms || '0'} bedrooms, {property.bathrooms || '0'} bathrooms, {property.sqft || '0'} m²</p>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`/property/${property.id}/content`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Property Details
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Agent Information</CardTitle>
          </CardHeader>
          <CardContent>
            {property.agent ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {property.agent.photoUrl && (
                    <img 
                      src={property.agent.photoUrl} 
                      alt={property.agent.name} 
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{property.agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{property.agent.email}</p>
                  </div>
                </div>
                {property.agent.phone && (
                  <div>
                    <span className="font-medium">Phone:</span>
                    <p>{property.agent.phone}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No agent assigned to this property.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent activity found.</p>
        </CardContent>
      </Card>
    </div>
  );
}
