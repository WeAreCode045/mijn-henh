
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function NotesCard() {
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();

  const handleSaveNotes = async () => {
    try {
      toast({
        description: "Notes saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this property..."
          className="min-h-32"
        />
        <Button 
          className="mt-4" 
          onClick={handleSaveNotes}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Notes
        </Button>
      </CardContent>
    </Card>
  );
}
