
import { useState, useRef, useEffect } from "react";

export function useAutoSaveState() {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    setIsSaving,
    lastSaved,
    setLastSaved,
    pendingChanges,
    setPendingChanges,
    timeoutRef
  };
}
