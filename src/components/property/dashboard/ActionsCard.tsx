
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ActionsCardProps {
  onDelete?: () => Promise<void>;
  onEdit?: () => void;
  onCreate?: () => void;
  onSave?: () => void;
  onWebView?: () => void;
  title?: string;
  description?: string;
  id?: string;
  isDeleting?: boolean;
  showDelete?: boolean;
  showEdit?: boolean;
  showCreate?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function ActionsCard({
  onDelete,
  onEdit,
  onCreate,
  onSave,
  onWebView,
  title = "Actions",
  description = "Manage this property",
  id,
  isDeleting = false,
  showDelete = true,
  showEdit = true,
  showCreate = false,
  createdAt,
  updatedAt,
}: ActionsCardProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete();
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        {showEdit && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onEdit}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}

        {onSave && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onSave}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Save
          </Button>
        )}

        {onWebView && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onWebView}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Web View
          </Button>
        )}

        {showCreate && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onCreate}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New
          </Button>
        )}

        {showDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  property {id && `with ID ${id}`} and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
}
