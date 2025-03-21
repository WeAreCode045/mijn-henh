
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface PropertySelectionTableProps {
  xmlData: any[];
  selectedProperties: number[];
  togglePropertySelection: (id: number) => void;
  selectAllProperties: () => void;
  importProperties: () => void;
  isImporting: boolean;
}

export function PropertySelectionTable({
  xmlData,
  selectedProperties,
  togglePropertySelection,
  selectAllProperties,
  importProperties,
  isImporting
}: PropertySelectionTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Properties to Import</h2>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAllProperties}
            >
              {selectedProperties.length === xmlData.length ? "Deselect All" : "Select All"}
            </Button>
            <Button 
              onClick={importProperties} 
              disabled={isImporting || selectedProperties.length === 0}
            >
              {isImporting ? "Importing..." : `Import ${selectedProperties.length} Properties`}
            </Button>
          </div>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Select</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Bedrooms</TableHead>
            <TableHead>Bathrooms</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="w-24">Images</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {xmlData.map((property) => (
            <TableRow key={property.id}>
              <TableCell>
                <input 
                  type="checkbox"
                  checked={selectedProperties.includes(property.id)}
                  onChange={() => togglePropertySelection(property.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </TableCell>
              <TableCell>{property.title}</TableCell>
              <TableCell>{property.price}</TableCell>
              <TableCell>{property.bedrooms}</TableCell>
              <TableCell>{property.bathrooms}</TableCell>
              <TableCell>{property.address}</TableCell>
              <TableCell>
                {(property.images?.length || 0) + (property.floorplans?.length || 0)} files
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
