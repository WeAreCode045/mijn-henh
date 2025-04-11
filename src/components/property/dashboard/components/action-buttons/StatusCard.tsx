
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusSelector } from "../StatusSelector";
import { supabase } from "@/integrations/supabase/client";

interface StatusCardProps {
  propertyId: string;
}

export function StatusCard({ propertyId }: StatusCardProps) {
  const handleStatusChange = async (status: string): Promise<void> => {
    if (!propertyId) return;
    
    const { error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', propertyId);
      
    if (error) {
      throw error;
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Status</CardTitle>
      </CardHeader>
      <CardContent>
        <StatusSelector 
          propertyId={propertyId} 
          initialStatus={"draft"} 
          onStatusChange={handleStatusChange}
        />
      </CardContent>
    </Card>
  );
}
