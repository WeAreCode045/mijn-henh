
import React, { useCallback, useState, useEffect } from "react";
import debounce from "lodash.debounce";

interface PropertySpecsProps {
  formData: { price: string; object_id: string };
  onFieldChange: (field: string, value: string) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function PropertySpecs({
  formData,
  onFieldChange,
  setPendingChanges,
}: PropertySpecsProps) {
  const [localPrice, setLocalPrice] = useState(formData.price || "");
  const [localObjectId, setLocalObjectId] = useState(formData.object_id || "");

  // Update local state when formData changes
  useEffect(() => {
    if (formData?.price !== undefined) {
      setLocalPrice(formData.price);
    }
    if (formData?.object_id !== undefined) {
      setLocalObjectId(formData.object_id);
    }
  }, [formData.price, formData.object_id]);

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
    setLocalPrice(value); // Update local state immediately
    debouncedOnFieldChange("price", value); // Debounce the actual update
  };

  const handleObjectIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalObjectId(value); // Update local state immediately
    debouncedOnFieldChange("object_id", value); // Debounce the actual update
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Price</label>
        <input
          value={localPrice}
          onChange={handlePriceChange}
          placeholder="Enter price"
          className="w-full border rounded-md p-2"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Object ID</label>
        <input
          value={localObjectId}
          onChange={handleObjectIdChange}
          placeholder="Enter object ID"
          className="w-full border rounded-md p-2"
        />
      </div>
    </div>
  );
}
