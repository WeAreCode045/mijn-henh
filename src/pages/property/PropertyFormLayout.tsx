
import { ReactNode } from "react";
import { PropertyData } from "@/types/property";
import { Settings } from "@/types/settings";

// Import our header component
import { PropertyFormHeader } from "./components/PropertyFormHeader";

interface PropertyFormLayoutProps {
  children: ReactNode;
  title: string;
  propertyData: PropertyData;
  settings: Settings | null | undefined;
  isAdmin: boolean;
  agents: any[];
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
  onDeleteProperty: () => Promise<void>;
  onSaveProperty: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  images: string[]; // This expects string[] not PropertyImage[]
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
  isSubmitting?: boolean;
}

export function PropertyFormLayout({
  children,
  title,
  propertyData,
  settings,
  isAdmin,
  agents,
  selectedAgent,
  onAgentSelect,
  onDeleteProperty,
  onSaveProperty,
  onImageUpload,
  onRemoveImage,
  images,
  agentInfo,
  templateInfo,
  isSubmitting
}: PropertyFormLayoutProps) {
  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PropertyFormHeader 
          title={title} 
          propertyId={propertyData.id} 
          objectId={propertyData.object_id} 
        />

        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
