import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Home, Mail } from "lucide-react";
import { AgendaDialog } from "@/components/dashboard/AgendaDialog";
import { useAgenda } from "@/hooks/useAgenda";
import { useToast } from "@/components/ui/use-toast";

export function QuickActions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const [isAgendaDialogOpen, setIsAgendaDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Get the addAgendaItem function from useAgenda to handle the save
  const { addAgendaItem } = useAgenda(propertyId || undefined);
  
  const handleSaveAgendaItem = async (data: any) => {
    try {
      console.log("QuickActions - Saving agenda item:", data);
      
      // Determine the final property ID
      // If the dialog provides a property_id that's not the placeholder, use it
      // Otherwise, use the propertyId from URL params
      // If both are missing, the server-side handler will find a default property
      const finalPropertyId = (data.property_id && data.property_id !== '00000000-0000-0000-0000-000000000000') 
        ? data.property_id 
        : propertyId || null;
      
      await addAgendaItem(
        data.title,
        data.description,
        data.event_date,
        data.event_time,
        data.end_date,
        data.end_time,
        data.additional_users || [],
        finalPropertyId
      );
    } catch (error) {
      console.error('Error in QuickActions when saving agenda item:', error);
      toast({
        title: "Error",
        description: "Failed to create agenda item. Please try adding a property first.",
        variant: "destructive",
      });
      throw error; // Re-throw to be handled by the dialog
    }
  };
  
  return (
    <Card className="h-full bg-transparent border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 justify-start h-auto py-3 text-white bg-white/10 border-white/20 hover:bg-white/20"
            onClick={() => setIsAgendaDialogOpen(true)}
          >
            <Calendar className="h-4 w-4" />
            <span>New Agenda</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 justify-start h-auto py-3 text-white bg-white/10 border-white/20 hover:bg-white/20"
            onClick={() => navigate('/property/new')}
          >
            <Home className="h-4 w-4" />
            <span>New Property</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 justify-start h-auto py-3 text-white bg-white/10 border-white/20 hover:bg-white/20"
            onClick={() => {
              // This will need to be connected to a notes functionality
              // For now, let's navigate to dashboard with a state param
              navigate('/', { state: { openNotes: true } });
            }}
          >
            <FileText className="h-4 w-4" />
            <span>New Note</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 justify-start h-auto py-3 text-white bg-white/10 border-white/20 hover:bg-white/20"
            onClick={() => {
              // This will need to be connected to an email functionality
              // For now, let's navigate to settings
              navigate('/settings', { state: { openEmailTab: true } });
            }}
          >
            <Mail className="h-4 w-4" />
            <span>Send Email</span>
          </Button>
        </div>
      </CardContent>
      
      {isAgendaDialogOpen && (
        <AgendaDialog 
          isOpen={isAgendaDialogOpen} 
          onClose={() => setIsAgendaDialogOpen(false)}
          onSave={handleSaveAgendaItem}
          mode="add"
          item={null}
          propertyId={propertyId || undefined}
        />
      )}
    </Card>
  );
}
