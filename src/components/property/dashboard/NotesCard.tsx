
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePropertyNotes, PropertyNote } from "@/hooks/usePropertyNotes";
import { NoteDialog } from "./NoteDialog";
import { formatDate } from "@/utils/dateUtils";

interface NotesCardProps {
  propertyId: string;
}

export function NotesCard({ propertyId }: NotesCardProps) {
  const { notes, isLoading, addNote, deleteNote } = usePropertyNotes(propertyId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<PropertyNote | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleAddNote = (title: string, content: string) => {
    addNote(title, content);
    setIsAddDialogOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    setIsViewDialogOpen(false);
  };

  const handleNoteClick = (note: PropertyNote) => {
    setSelectedNote(note);
    setIsViewDialogOpen(true);
  };

  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddDialogOpen(true);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Notes</CardTitle>
        <Button 
          onClick={handleAddButtonClick} 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 rounded-full"
          type="button"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add note</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>No notes yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              type="button"
              onClick={handleAddButtonClick}
            >
              Add your first note
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors"
                onClick={() => handleNoteClick(note)}
              >
                <h3 className="font-medium text-sm truncate">{note.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(note.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add Note Dialog */}
      <NoteDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddNote}
      />

      {/* View Note Dialog */}
      {selectedNote && (
        <NoteDialog
          note={selectedNote}
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          onDelete={handleDeleteNote}
          isReadOnly={true}
        />
      )}
    </Card>
  );
}
