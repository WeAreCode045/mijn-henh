
import React from 'react';
import { ContentElement } from '../types/templateTypes';

interface ElementItemProps {
  element: ContentElement;
}

export function ElementItem({ element }: ElementItemProps) {
  return (
    <div
      key={element.id}
      className="bg-white p-2 mb-2 rounded border shadow-sm"
    >
      {element.title}
    </div>
  );
}
