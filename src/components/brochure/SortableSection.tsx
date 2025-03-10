
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Grid, Plus, Trash2 } from 'lucide-react';
import type { Section, Container, ContentElement } from './TemplateBuilder';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';

interface SortableSectionProps {
  section: Section;
  isSelected?: boolean;
  onAddContainer?: () => void;
  onUpdateContainer?: (containerId: string, updates: Partial<Container>) => void;
  onDeleteContainer?: (containerId: string) => void;
}

export function SortableSection({ 
  section, 
  isSelected, 
  onAddContainer,
  onUpdateContainer,
  onDeleteContainer
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDragOver = (e: React.DragEvent, containerId: string, columnIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-gray-100');
  };

  const handleDrop = (e: React.DragEvent, containerId: string, columnIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');
    const elementId = e.dataTransfer.getData('text/plain');
    
    const container = section.design.containers.find(c => c.id === containerId);
    if (!container) return;

    const newElement: ContentElement = {
      id: elementId,
      type: 'text',
      title: 'New Element',
      columnIndex
    };

    onUpdateContainer?.(containerId, {
      elements: [...container.elements, newElement]
    });
  };

  const handleColumnChange = (containerId: string, columns: number) => {
    const container = section.design.containers.find(c => c.id === containerId);
    if (!container) return;

    const newColumnWidths = Array(columns).fill(1);
    onUpdateContainer?.(containerId, {
      columns,
      columnWidths: newColumnWidths
    });
  };

  const handleColumnWidthChange = (containerId: string, columnIndex: number, width: number) => {
    const container = section.design.containers.find(c => c.id === containerId);
    if (!container) return;

    const newColumnWidths = [...container.columnWidths];
    newColumnWidths[columnIndex] = width;
    onUpdateContainer?.(containerId, {
      columnWidths: newColumnWidths
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "space-y-4 p-4 bg-white rounded-md border shadow-sm transition-colors",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="cursor-move p-1 hover:bg-gray-100 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-gray-500" />
          </button>
          <span className="text-sm font-medium">{section.title}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddContainer}
          className="text-gray-500 hover:text-gray-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Container
        </Button>
      </div>

      <div className="space-y-4">
        {section.design.containers.map((container) => (
          <div
            key={container.id}
            className={cn(
              "border rounded-md p-4",
              selectedContainerId === container.id && "border-primary"
            )}
            onClick={() => setSelectedContainerId(container.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <Select
                value={container.columns.toString()}
                onValueChange={(value) => handleColumnChange(container.id, parseInt(value))}
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
                onClick={() => onDeleteContainer?.(container.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div 
              className="grid gap-4"
              style={{
                gridTemplateColumns: container.columnWidths.map(w => `${w}fr`).join(' ')
              }}
            >
              {Array.from({ length: container.columns }).map((_, columnIndex) => (
                <div key={columnIndex} className="space-y-2">
                  <div
                    className="bg-gray-50 rounded-md p-2 min-h-[100px] relative"
                    onDragOver={(e) => handleDragOver(e, container.id, columnIndex)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, container.id, columnIndex)}
                  >
                    {container.elements
                      .filter(element => element.columnIndex === columnIndex)
                      .map((element) => (
                        <div
                          key={element.id}
                          className="bg-white p-2 mb-2 rounded border shadow-sm"
                        >
                          {element.title}
                        </div>
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
                    onChange={(e) => handleColumnWidthChange(
                      container.id,
                      columnIndex,
                      parseInt(e.target.value)
                    )}
                    className="w-20"
                    placeholder="Width"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
