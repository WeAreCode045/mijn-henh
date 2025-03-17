
import { useState } from 'react';

export function usePropertyAutoSave() {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);

  // Stub functions that don't actually save
  const autosaveData = async () => {
    console.log("Autosave functionality has been disabled");
    return true;
  };

  return {
    autosaveData,
    isSaving,
    lastSaved,
    pendingChanges,
    setPendingChanges,
    setLastSaved
  };
}
