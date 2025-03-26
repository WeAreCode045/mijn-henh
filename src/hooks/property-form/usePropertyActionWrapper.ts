
import { useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

export function usePropertyActionWrapper(isArchived: boolean) {
  const { toast } = useToast();
  
  // Modification wrapper to handle archived status
  const wrapMethod = useCallback((method: (...args: any[]) => Promise<any> | void) => {
    return (...args: any[]): Promise<any> => {
      if (isArchived) {
        toast({
          title: "Action blocked",
          description: "This property is archived. Unarchive it first to make changes.",
          variant: "destructive",
        });
        return Promise.resolve();
      }
      
      // Ensure we always return a Promise
      const result = method(...args);
      if (result instanceof Promise) {
        return result;
      } else {
        return Promise.resolve(result);
      }
    };
  }, [isArchived, toast]);

  return { wrapMethod };
}
