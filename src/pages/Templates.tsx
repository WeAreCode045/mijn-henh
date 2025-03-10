
import { TemplateBuilder } from "@/components/brochure/TemplateBuilder";
import { TemplateList } from "@/components/brochure/TemplateList";
import { DndContext } from '@dnd-kit/core';
import { useState } from "react";

export interface Template {
  id: string;
  name: string;
  description: string | null;
  sections: any;
  created_at: string;
}

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-estate-800 mb-12">Brochure Templates</h1>
        
        <TemplateList onEdit={setSelectedTemplate} />
        
        <DndContext>
          {/* Pass the full template object */}
          <TemplateBuilder template={selectedTemplate} />
        </DndContext>
      </div>
    </div>
  );
}
