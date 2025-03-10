
import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../types/templateTypes';
import { ContainerHeader } from './ContainerHeader';
import { ContainerColumn } from './ContainerColumn';

interface SectionContainerProps {
  container: Container;
  selectedContainerId: string | null;
  onContainerClick: (containerId: string) => void;
  onColumnChange: (containerId: string, columns: number) => void;
  onDeleteContainer: (containerId: string) => void;
  onDragOver: (e: React.DragEvent, containerId: string, columnIndex: number) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, containerId: string, columnIndex: number) => void;
  onColumnWidthChange: (containerId: string, columnIndex: number, width: number) => void;
}

export function SectionContainer({
  container,
  selectedContainerId,
  onContainerClick,
  onColumnChange,
  onDeleteContainer,
  onDragOver,
  onDragLeave,
  onDrop,
  onColumnWidthChange,
}: SectionContainerProps) {
  return (
    <div
      key={container.id}
      className={cn(
        "border rounded-md p-4",
        selectedContainerId === container.id && "border-primary"
      )}
      onClick={() => onContainerClick(container.id)}
    >
      <ContainerHeader
        container={container}
        onColumnChange={onColumnChange}
        onDeleteContainer={onDeleteContainer}
      />

      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: container.columnWidths.map(w => `${w}fr`).join(' ')
        }}
      >
        {Array.from({ length: container.columns }).map((_, columnIndex) => (
          <ContainerColumn
            key={columnIndex}
            columnIndex={columnIndex}
            container={container}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onColumnWidthChange={onColumnWidthChange}
          />
        ))}
      </div>
    </div>
  );
}
