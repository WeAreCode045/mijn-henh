
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface ContainerHeaderProps {
  container: {
    id: string;
    columns: number;
  };
  onColumnChange: (containerId: string, columns: number) => void;
  onDeleteContainer: (containerId: string) => void;
}

export function ContainerHeader({
  container,
  onColumnChange,
  onDeleteContainer,
}: ContainerHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Select
        value={container.columns.toString()}
        onValueChange={(value) => onColumnChange(container.id, parseInt(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select columns" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 Column</SelectItem>
          <SelectItem value="2">2 Columns</SelectItem>
          <SelectItem value="3">3 Columns</SelectItem>
          <SelectItem value="4">4 Columns</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDeleteContainer(container.id)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
