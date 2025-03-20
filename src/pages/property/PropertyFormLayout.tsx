
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
  actionButtons?: ReactNode; // Add new prop for action buttons
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
  isSubmitting,
  actionButtons
}: PropertyFormLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PropertyFormHeader 
          title={title} 
          propertyId={propertyData.id} 
          objectId={propertyData.object_id} 
        />

        {/* Add action buttons above the tabs */}
        {actionButtons && (
          <div className="mt-4 mb-2">
            {actionButtons}
          </div>
        )}

        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
