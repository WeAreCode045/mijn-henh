import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";

interface PropertyDetailsSectionProps {
  price: string;
  objectId: string;
  isEditing: boolean;
  setPrice: (price: string) => void;
  setObjectId: (objectId: string) => void;
}

export function PropertyDetailsSection({
  price,
  objectId,
  isEditing,
  setPrice,
  setObjectId,
}: PropertyDetailsSectionProps) {
  // Debounced handlers
  const debouncedSetPrice = useMemo(
    () => debounce((value: string) => setPrice(value), 300),
    [setPrice]
  );

  const debouncedSetObjectId = useMemo(
    () => debounce((value: string) => setObjectId(value), 300),
    [setObjectId]
  );

  useEffect(() => {
    return () => {
      debouncedSetPrice.cancel();
      debouncedSetObjectId.cancel();
    };
  }, [debouncedSetPrice, debouncedSetObjectId]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSetPrice(value);
  };

  const handleObjectIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSetObjectId(value);
  };

  return (
    <>
      {isEditing ? (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Price</label>
            <Input
              defaultValue={price} // Use defaultValue to avoid cursor jumping
              onChange={handlePriceChange}
              placeholder="Set price"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Object ID</label>
            <Input
              defaultValue={objectId} // Use defaultValue to avoid cursor jumping
              onChange={handleObjectIdChange}
              placeholder="Set object ID"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-semibold mb-1">Price</p>
            <p>{price || "Not specified"}</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Object ID</p>
            <p className="truncate">{objectId || ""}</p>
          </div>
        </div>
      )}
    </>
  );
}
