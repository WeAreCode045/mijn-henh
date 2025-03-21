
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { XmlData } from "@/hooks/import/useXmlFileUpload";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface PropertySelectionTableProps {
  properties: XmlData[];
  selectedProperties: number[];
  togglePropertySelection: (id: number) => void;
  selectAllProperties: () => void;
  importProperties?: () => Promise<void>;
  isImporting?: boolean;
}

export function PropertySelectionTable({
  properties,
  selectedProperties,
  togglePropertySelection,
  selectAllProperties,
  importProperties,
  isImporting,
}: PropertySelectionTableProps) {
  const allSelected = properties.length > 0 && selectedProperties.length === properties.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Select Properties to Import</h3>
        <Button 
          variant="outline" 
          onClick={selectAllProperties}
        >
          {allSelected ? "Unselect All" : "Select All"}
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Bedrooms</TableHead>
              <TableHead>Bathrooms</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow 
                key={property.id}
                className={property.existsInDatabase ? "bg-yellow-50" : ""}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedProperties.includes(property.id as number)}
                    onCheckedChange={() => togglePropertySelection(property.id as number)}
                  />
                </TableCell>
                <TableCell className="font-medium flex items-center gap-2">
                  {property.title}
                  {property.existsInDatabase && (
                    <span className="inline-flex items-center" title="This property already exists in the database">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </span>
                  )}
                </TableCell>
                <TableCell>{property.price}</TableCell>
                <TableCell>{property.bedrooms}</TableCell>
                <TableCell>{property.bathrooms}</TableCell>
                <TableCell className="text-right">
                  {property.existsInDatabase ? (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Already Exists
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      New
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {importProperties && (
        <div className="flex justify-end mt-4">
          <Button 
            onClick={importProperties} 
            disabled={selectedProperties.length === 0 || isImporting}
          >
            {isImporting ? "Importing..." : "Import Selected Properties"}
          </Button>
        </div>
      )}
    </div>
  );
}
