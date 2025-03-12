
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyNote } from "@/hooks/usePropertyNotes";
import { Trash2 } from "lucide-react";

interface NoteDialogProps {
  note?: PropertyNote;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (title: string, content: string) => void;
  onDelete?: (id: string) => void;
  isReadOnly?: boolean;
}

export function NoteDialog({
  note,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isReadOnly = false,
}: NoteDialogProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  const handleSave = () => {
    if (onSave && title.trim() && content.trim()) {
      onSave(title, content);
      onClose();
    }
  };

  const handleDelete = () => {
    if (note && onDelete) {
      onDelete(note.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isReadOnly
              ? note?.title || "View Note"
              : note
              ? "Edit Note"
              : "Add New Note"}
          </DialogTitle>
          <DialogDescription>
            {isReadOnly
              ? "View the details of this note."
              : "Fill in the information for your note."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isReadOnly ? (
            <>
              <h3 className="font-medium text-lg">{note?.title}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {note?.content}
              </p>
              {note?.created_at && (
                <p className="text-sm text-muted-foreground mt-4">
                  Created: {new Date(note.created_at).toLocaleString()}
                </p>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-4"
                  placeholder="Note title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="col-span-4"
                  placeholder="Note content"
                  rows={6}
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter className="flex justify-between items-center">
          {note && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              {isReadOnly ? "Close" : "Cancel"}
            </Button>
            {!isReadOnly && (
              <Button type="submit" onClick={handleSave}>
                Save
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
