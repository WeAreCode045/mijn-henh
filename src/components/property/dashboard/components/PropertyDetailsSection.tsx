
import { Input } from "@/components/ui/input";

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
  setObjectId 
}: PropertyDetailsSectionProps) {
  return (
    <>
      {isEditing ? (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Price</label>
            <Input 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Set price"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Object ID</label>
            <Input 
              value={objectId}
              onChange={(e) => setObjectId(e.target.value)}
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
