
import React from 'react';
import { Grid } from 'lucide-react';
import { Input } from '../../ui/input';
import { ContentElement } from '../types/templateTypes';
import { ElementItem } from './ElementItem';

interface ContainerColumnProps {
  columnIndex: number;
  container: {
    id: string;
    columnWidths: number[];
    elements: ContentElement[];
  };
  onDragOver: (e: React.DragEvent, containerId: string, columnIndex: number) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, containerId: string, columnIndex: number) => void;
  onColumnWidthChange: (containerId: string, columnIndex: number, width: number) => void;
}

export function ContainerColumn({
  columnIndex,
  container,
  onDragOver,
  onDragLeave,
  onDrop,
  onColumnWidthChange,
}: ContainerColumnProps) {
  return (
    <div key={columnIndex} className="space-y-2">
      <div
        className="bg-gray-50 rounded-md p-2 min-h-[100px] relative"
        onDragOver={(e) => onDragOver(e, container.id, columnIndex)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, container.id, columnIndex)}
      >
        {container.elements
          .filter(element => element.columnIndex === columnIndex)
          .map((element) => (
            <ElementItem key={element.id} element={element} />
          ))}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
          <Grid className="h-6 w-6" />
        </div>
      </div>
      <Input
        type="number"
        min="1"
        max="12"
        value={container.columnWidths[columnIndex]}
        onChange={(e) => onColumnWidthChange(
          container.id,
          columnIndex,
          parseInt(e.target.value)
        )}
        className="w-20"
        placeholder="Width"
      />
    </div>
  );
}
