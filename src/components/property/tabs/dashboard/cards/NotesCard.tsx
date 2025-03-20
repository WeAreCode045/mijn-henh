
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { usePropertyNotes, PropertyNote } from "@/hooks/usePropertyNotes";

export function NotesCard() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id || "";
  const { notes, isLoading, addNote, deleteNote } = usePropertyNotes(propertyId);
  
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddNote = async () => {
    if (title.trim() && content.trim()) {
      await addNote(title, content);
      setTitle("");
      setContent("");
      setIsAddNoteOpen(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      await deleteNote(noteId);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Notes</CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsAddNoteOpen(true)} 
          title="Add Note"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No notes available
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold">{note.title}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleDelete(note.id)}
                      title="Delete Note"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {format(new Date(note.created_at), "MMM d, yyyy 'at' HH:mm")}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="note-title" className="text-sm font-medium">Title</label>
              <Input
                id="note-title"
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="note-content" className="text-sm font-medium">Content</label>
              <Textarea
                id="note-content"
                placeholder="Note content"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNoteOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
