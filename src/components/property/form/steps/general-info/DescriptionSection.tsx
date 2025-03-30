import React, { useCallback, useMemo } from "react";
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
  const debouncedOnFieldChange = useMemo(
    () =>
      debounce((field: string, value: string) => {
        onFieldChange(field, value);
        if (setPendingChanges) setPendingChanges(true);
      }, 300),
    [onFieldChange, setPendingChanges]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    debouncedOnFieldChange("description", value);
  };

  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Description</label>
      <textarea
        defaultValue={formData.description} // Use defaultValue to avoid cursor jumping
        onChange={handleChange}
        placeholder="Enter property description"
        className="w-full border rounded-md p-2"
      />
    </div>
  );
}
