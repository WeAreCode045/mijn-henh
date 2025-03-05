
import React from 'react';
import { Layout, Grid, Type, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ContentElement } from './types/templateTypes';
import { globalElements, defaultContentElements } from './constants/templateDefaults';

interface ElementsPanelProps {
  selectedSectionId: string | null;
  sectionType: string;
}

export function ElementsPanel({ selectedSectionId, sectionType }: ElementsPanelProps) {
  if (!selectedSectionId) return null;

  const renderElementIcon = (element: ContentElement) => {
    switch (element.type) {
      case 'keyInfo':
        return <Grid className="h-4 w-4" />;
      case 'features':
        return <Layout className="h-4 w-4" />;
      case 'description':
      case 'text':
        return <Type className="h-4 w-4" />;
      case 'images':
        return <Image className="h-4 w-4" />;
      default:
        return <Layout className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Global Elements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {globalElements.map((element) => (
              <div
                key={element.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', element.id);
                }}
                className="flex items-center gap-2 p-3 bg-white rounded-md border shadow-sm cursor-move hover:border-primary"
              >
                <Layout className="h-4 w-4" />
                <span className="text-sm font-medium">{element.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Content Elements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {defaultContentElements[sectionType || 'cover'].map((element) => (
              <div
                key={element.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', element.id);
                }}
                className="flex items-center gap-2 p-3 bg-white rounded-md border shadow-sm cursor-move hover:border-primary"
              >
                {renderElementIcon(element)}
                <span className="text-sm font-medium">{element.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
