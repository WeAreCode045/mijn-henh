import React, { useCallback } from "react";
import debounce from "lodash.debounce";

interface PropertySpecsProps {
  formData: { price: string; objectId: string };
  onFieldChange: (field: string, value: string) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function PropertySpecs({
  formData,
  onFieldChange,
  setPendingChanges,
}: PropertySpecsProps) {
  const debouncedOnFieldChange = useCallback(
    debounce((field: string, value: string) => {
      onFieldChange(field, value);
      if (setPendingChanges) setPendingChanges(true);
    }, 300),
    [onFieldChange, setPendingChanges]
  );

  React.useEffect(() => {
    return () => {
      debouncedOnFieldChange.cancel();
    };
  }, [debouncedOnFieldChange]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedOnFieldChange("price", value);
  };

  const handleObjectIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedOnFieldChange("objectId", value);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Price</label>
        <input
          defaultValue={formData.price} // Use defaultValue to avoid cursor jumping
          onChange={handlePriceChange}
          placeholder="Enter price"
          className="w-full border rounded-md p-2"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Object ID</label>
        <input
          defaultValue={formData.objectId} // Use defaultValue to avoid cursor jumping
          onChange={handleObjectIdChange}
          placeholder="Enter object ID"
          className="w-full border rounded-md p-2"
        />
      </div>
    </div>
  );
}
