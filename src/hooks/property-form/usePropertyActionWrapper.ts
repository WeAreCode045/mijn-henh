
import { useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

export function usePropertyActionWrapper(isArchived: boolean) {
  const { toast } = useToast();
  
  // Modification wrapper to handle archived status
  const wrapMethod = useCallback((method: Function) => {
    return (...args: any[]) => {
      if (isArchived) {
        toast({
          title: "Action blocked",
          description: "This property is archived. Unarchive it first to make changes.",
          variant: "destructive",
        });
        return Promise.resolve();
      }
      return method(...args);
    };
  }, [isArchived, toast]);

  return { wrapMethod };
}
