
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import type { Section, Container, ContentElement } from './types/templateTypes';
import { SectionHeader } from './section/SectionHeader';
import { SectionContainer } from './section/SectionContainer';

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
      <SectionHeader
        title={section.title}
        attributes={attributes}
        listeners={listeners}
        onAddContainer={onAddContainer || (() => {})}
      />

      <div className="space-y-4">
        {section.design.containers.map((container) => (
          <SectionContainer
            key={container.id}
            container={container}
            selectedContainerId={selectedContainerId}
            onContainerClick={setSelectedContainerId}
            onColumnChange={handleColumnChange}
            onDeleteContainer={onDeleteContainer || (() => {})}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onColumnWidthChange={handleColumnWidthChange}
          />
        ))}
      </div>
    </div>
  );
}
