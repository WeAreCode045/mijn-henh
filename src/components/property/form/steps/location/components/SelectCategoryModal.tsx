
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SelectCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => Promise<any>;
  isLoading: boolean;
}

export function SelectCategoryModal({
  isOpen,
  onClose,
  onSelect,
  isLoading
}: SelectCategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Category</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Loading places...</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">This feature is currently being rebuilt.</p>
              <Button onClick={() => onClose()}>Close</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
