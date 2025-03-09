
import React from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, HomeIcon, MapPinIcon, UserIcon, FileIcon, EyeIcon } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

interface DashboardTabContentProps {
  property: PropertyData;
}

export function DashboardTabContent({ property }: DashboardTabContentProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Property Dashboard</h2>
      
      {/* Property Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HomeIcon className="h-5 w-5 mr-2" />
            Property Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg">{property.title}</h3>
              <p className="text-muted-foreground">{property.address}</p>
              <div className="mt-2">
                <p className="font-semibold">Price: <span className="font-normal">{property.price}</span></p>
                <p className="font-semibold">ID: <span className="font-normal">{property.id}</span></p>
                {property.object_id && <p className="font-semibold">Object ID: <span className="font-normal">{property.object_id}</span></p>}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="font-semibold">Bedrooms</p>
                  <p>{property.bedrooms || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold">Bathrooms</p>
                  <p>{property.bathrooms || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold">Size</p>
                  <p>{property.sqft || "N/A"} sqft</p>
                </div>
                <div>
                  <p className="font-semibold">Year Built</p>
                  <p>{property.buildYear || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Dates & Activity Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Dates & Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold">Created</p>
              <p>{property.created_at ? formatDate(property.created_at) : "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Last Updated</p>
              <p>{property.updated_at ? formatDate(property.updated_at) : "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p className="text-green-600 font-medium">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Agent Information */}
      {property.agent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Agent Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {property.agent.photoUrl ? (
                <img 
                  src={property.agent.photoUrl} 
                  alt={property.agent.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <UserIcon className="h-8 w-8 text-gray-500" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{property.agent.name}</h3>
                {property.agent.email && <p>Email: {property.agent.email}</p>}
                {property.agent.phone && <p>Phone: {property.agent.phone}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Media Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileIcon className="h-5 w-5 mr-2" />
            Media Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="font-semibold">Images</p>
              <p>{property.images ? property.images.length : 0}</p>
            </div>
            <div>
              <p className="font-semibold">Floorplans</p>
              <p>{property.floorplans ? property.floorplans.length : 0}</p>
            </div>
            <div>
              <p className="font-semibold">Areas</p>
              <p>{property.areas ? property.areas.length : 0}</p>
            </div>
            <div>
              <p className="font-semibold">Features</p>
              <p>{property.features ? property.features.length : 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <EyeIcon className="h-5 w-5 mr-2" />
            External Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {property.virtualTourUrl && (
              <div>
                <p className="font-semibold">Virtual Tour</p>
                <a href={property.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Virtual Tour
                </a>
              </div>
            )}
            {property.youtubeUrl && (
              <div>
                <p className="font-semibold">YouTube Video</p>
                <a href={property.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Watch Video
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
