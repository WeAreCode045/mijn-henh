
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableSection } from './SortableSection';
import { useToast } from '../ui/use-toast';
import { Template, Section, Container } from './types/templateTypes';
import { defaultSections } from './constants/templateDefaults';
import { TemplateForm } from './TemplateForm';
import { ElementsPanel } from './ElementsPanel';
import { saveTemplate, updateSectionContainers } from './utils/templateUtils';

export type { ContentElement, Container, SectionDesign, Section } from './types/templateTypes';

export function TemplateBuilder({ template }: { template: Template | null }) {
  const [sections, setSections] = useState<Section[]>(
    template?.sections || defaultSections
  );
  const [templateName, setTemplateName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
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
      updateSectionContainers(prevSections, sectionId, 'add')
    );
  };

  const handleUpdateContainer = (sectionId: string, containerId: string, updates: Partial<Container>) => {
    setSections(prevSections => 
      updateSectionContainers(prevSections, sectionId, 'update', containerId, updates)
    );
  };

  const handleDeleteContainer = (sectionId: string, containerId: string) => {
    setSections(prevSections => 
      updateSectionContainers(prevSections, sectionId, 'delete', containerId)
    );
  };

  const handleSaveTemplate = async () => {
    const success = await saveTemplate(
      template?.id,
      templateName,
      description,
      sections
    );
    
    if (success) {
      window.location.reload();
    }
  };

  const selectedSectionType = sections.find(s => s.id === selectedSectionId)?.type || 'cover';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <TemplateForm
          templateName={templateName}
          setTemplateName={setTemplateName}
          description={description}
          setDescription={setDescription}
          onSave={handleSaveTemplate}
          template={template}
        />

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
      </div>

      <div className="space-y-4">
        <ElementsPanel 
          selectedSectionId={selectedSectionId} 
          sectionType={selectedSectionType} 
        />
      </div>
    </div>
  );
}
