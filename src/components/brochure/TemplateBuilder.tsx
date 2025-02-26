
import React from 'react';
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableSection } from './SortableSection';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Grid, Layout, Columns, Type, GripVertical, Map, Phone, Image } from 'lucide-react';
import type { Template } from '@/pages/Templates';

export interface ContentElement {
  id: string;
  type: 'keyInfo' | 'features' | 'description' | 'images' | 'text' | 'header' | 'global';
  title: string;
  columnIndex?: number;
}

export interface Container {
  id: string;
  columns: number;
  columnWidths: number[];
  elements: ContentElement[];
}

export interface SectionDesign {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  containers: Container[];
}

export interface Section {
  id: string;
  type: 'cover' | 'details' | 'floorplans' | 'location' | 'areas' | 'contact';
  title: string;
  design: SectionDesign;
}

const globalElements: ContentElement[] = [
  { id: 'gh1', type: 'global', title: 'Header' },
  { id: 'gf1', type: 'global', title: 'Footer' },
  { id: 'gp1', type: 'global', title: 'Price' },
  { id: 'gt1', type: 'global', title: 'Property Title' },
  { id: 'gi1', type: 'global', title: 'Featured Image' }
];

const defaultContentElements: Record<string, ContentElement[]> = {
  details: [
    { id: 'ke1', type: 'keyInfo', title: 'Key Information' },
    { id: 'fe1', type: 'features', title: 'Features' },
    { id: 'de1', type: 'description', title: 'Description' }
  ],
  cover: [
    { id: 'hi1', type: 'header', title: 'Header' },
    { id: 'im1', type: 'images', title: 'Images' }
  ],
  floorplans: [
    { id: 'fp1', type: 'images', title: 'Floorplan Images' },
    { id: 'fd1', type: 'text', title: 'Floorplan Description' }
  ],
  location: [
    { id: 'mp1', type: 'images', title: 'Map' },
    { id: 'ld1', type: 'text', title: 'Location Description' },
    { id: 'np1', type: 'text', title: 'Nearby Places' }
  ],
  areas: [
    { id: 'ai1', type: 'images', title: 'Area Images' },
    { id: 'ad1', type: 'text', title: 'Area Description' }
  ],
  contact: [
    { id: 'cf1', type: 'text', title: 'Contact Form' },
    { id: 'ci1', type: 'images', title: 'Agent Image' },
    { id: 'cd1', type: 'text', title: 'Contact Details' }
  ]
};

const defaultSections: Section[] = [
  { 
    id: '1', 
    type: 'cover', 
    title: 'Cover Page', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '2', 
    type: 'details', 
    title: 'Property Details', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '3', 
    type: 'floorplans', 
    title: 'Floorplans', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '4', 
    type: 'location', 
    title: 'Location', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '5', 
    type: 'areas', 
    title: 'Areas', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '6', 
    type: 'contact', 
    title: 'Contact', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  }
];

export function TemplateBuilder({ template }: { template: Template | null }) {
  const [sections, setSections] = React.useState<Section[]>(
    template?.sections || defaultSections
  );
  const [templateName, setTemplateName] = React.useState(template?.name || '');
  const [description, setDescription] = React.useState(template?.description || '');
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddContainer = (sectionId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              design: {
                ...section.design,
                containers: [
                  ...(section.design.containers || []),
                  {
                    id: crypto.randomUUID(),
                    columns: 1,
                    columnWidths: [1],
                    elements: []
                  }
                ]
              }
            }
          : section
      )
    );
  };

  const handleUpdateContainer = (sectionId: string, containerId: string, updates: Partial<Container>) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              design: {
                ...section.design,
                containers: section.design.containers.map(container =>
                  container.id === containerId
                    ? { ...container, ...updates }
                    : container
                )
              }
            }
          : section
      )
    );
  };

  const handleDeleteContainer = (sectionId: string, containerId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              design: {
                ...section.design,
                containers: section.design.containers.filter(container => 
                  container.id !== containerId
                )
              }
            }
          : section
      )
    );
  };

  const saveTemplate = async () => {
    if (!templateName) {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save templates",
          variant: "destructive",
        });
        return;
      }

      // Convert sections to a JSON-compatible format
      const sectionsJson = sections.map(section => ({
        ...section,
        design: {
          ...section.design,
          containers: section.design.containers.map(container => ({
            ...container,
            elements: container.elements.map(element => ({
              ...element
            }))
          }))
        }
      })) as Json;

      const templateData = {
        name: templateName,
        description: description || null,
        sections: sectionsJson,
        created_by: user.id
      };

      const { error } = await supabase
        .from('brochure_templates')
        .upsert({
          ...(template?.id ? { id: template.id } : {}),
          ...templateData
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template saved successfully",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter template description"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Arrange Sections</h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sections} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {sections.map((section) => (
                  <div 
                    key={section.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedSectionId(section.id)}
                  >
                    <SortableSection 
                      section={section} 
                      isSelected={selectedSectionId === section.id}
                      onAddContainer={() => handleAddContainer(section.id)}
                      onUpdateContainer={(containerId, updates) => 
                        handleUpdateContainer(section.id, containerId, updates)
                      }
                      onDeleteContainer={(containerId) => 
                        handleDeleteContainer(section.id, containerId)
                      }
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <Button onClick={saveTemplate} className="w-full">
          {template ? 'Update Template' : 'Save Template'}
        </Button>
      </div>

      <div className="space-y-4">
        {selectedSectionId && (
          <>
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
                  {defaultContentElements[sections.find(s => s.id === selectedSectionId)?.type || 'cover'].map((element) => (
                    <div
                      key={element.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', element.id);
                      }}
                      className="flex items-center gap-2 p-3 bg-white rounded-md border shadow-sm cursor-move hover:border-primary"
                    >
                      {element.type === 'keyInfo' && <Grid className="h-4 w-4" />}
                      {element.type === 'features' && <Layout className="h-4 w-4" />}
                      {element.type === 'description' && <Type className="h-4 w-4" />}
                      {element.type === 'images' && <Image className="h-4 w-4" />}
                      {element.type === 'text' && <Type className="h-4 w-4" />}
                      <span className="text-sm font-medium">{element.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
