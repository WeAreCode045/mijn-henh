
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Home, Mail, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AgendaDialog } from "@/components/dashboard/AgendaDialog";

export function QuickActions() {
  const navigate = useNavigate();
  const [isAgendaDialogOpen, setIsAgendaDialogOpen] = useState(false);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 justify-start h-auto py-3"
            onClick={() => setIsAgendaDialogOpen(true)}
          >
            <Calendar className="h-4 w-4" />
            <span>New Agenda</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 justify-start h-auto py-3"
            onClick={() => navigate('/property/new')}
          >
            <Home className="h-4 w-4" />
            <span>New Property</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 justify-start h-auto py-3"
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
            className="flex items-center gap-2 justify-start h-auto py-3"
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
      
      <Dialog open={isAgendaDialogOpen} onOpenChange={setIsAgendaDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>New Agenda Item</DialogTitle>
          </DialogHeader>
          <AgendaDialog onSave={() => setIsAgendaDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
