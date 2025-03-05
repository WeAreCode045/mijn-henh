
import React from 'react';
import { GripVertical, Plus } from 'lucide-react';
import { Button } from '../../ui/button';

interface SectionHeaderProps {
  title: string;
  attributes: any;
  listeners: any;
  onAddContainer: () => void;
}

export function SectionHeader({
  title,
  attributes,
  listeners,
  onAddContainer,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          className="cursor-move p-1 hover:bg-gray-100 rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-gray-500" />
        </button>
        <span className="text-sm font-medium">{title}</span>
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
  );
}
