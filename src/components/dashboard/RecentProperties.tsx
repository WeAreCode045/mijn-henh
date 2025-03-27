
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyCard } from "@/components/property/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface RecentPropertiesProps {
  fullWidth?: boolean;
  showAddButton?: boolean;
}

export function RecentProperties({ fullWidth = false, showAddButton = true }: RecentPropertiesProps) {
  const { properties, isLoading, handleDelete } = useProperties();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Properties</CardTitle>
        {showAddButton && (
          <Button size="sm" asChild>
            <Link to="/property/new">
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[150px] w-full" />
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center bg-muted/30 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">No properties yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first property to get started.
            </p>
            <Button asChild>
              <Link to="/property/new">
                <Plus className="h-4 w-4 mr-1" />
                Create Property
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.slice(0, 5).map((property) => (
              <div key={property.id} className="border rounded-md p-4 hover:bg-muted/25 transition-colors">
                <Link 
                  to={`/property/${property.id}/dashboard`}
                  className="group"
                >
                  <h3 className="font-medium text-lg group-hover:text-primary">{property.title}</h3>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">{property.address}</span>
                    <span className="font-medium">{property.price}</span>
                  </div>
                </Link>
              </div>
            ))}
            {properties.length > 5 && (
              <div className="text-center mt-2">
                <Button variant="link" asChild>
                  <Link to="/properties">View all properties</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
