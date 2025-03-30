
import React, { useCallback, useMemo, useState, useEffect } from "react";
import debounce from "lodash.debounce";

interface DescriptionSectionProps {
  formData: { description: string };
  onFieldChange: (field: string, value: string) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function DescriptionSection({
  formData,
  onFieldChange,
  setPendingChanges,
}: DescriptionSectionProps) {
  const [localDescription, setLocalDescription] = useState(formData.description || "");

  // Update local state when formData changes
  useEffect(() => {
    if (formData?.description !== undefined) {
      setLocalDescription(formData.description);
    }
  }, [formData.description]);

  const debouncedOnFieldChange = useMemo(
    () =>
      debounce((field: string, value: string) => {
        onFieldChange(field, value);
        if (setPendingChanges) setPendingChanges(true);
      }, 300),
    [onFieldChange, setPendingChanges]
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedOnFieldChange.cancel();
    };
  }, [debouncedOnFieldChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalDescription(value); // Update local state immediately
    debouncedOnFieldChange("description", value); // Debounce the actual update
  };

  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Description</label>
      <textarea
        value={localDescription}
        onChange={handleChange}
        placeholder="Enter property description"
        className="w-full border rounded-md p-2 min-h-[150px]"
      />
    </div>
  );
}
