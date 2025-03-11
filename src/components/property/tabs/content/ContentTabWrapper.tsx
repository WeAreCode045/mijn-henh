
import { ReactNode } from 'react';
import { PropertyFormData } from '@/types/property';

export interface ContentTabWrapperProps {
  formData: PropertyFormData;
  handlers: {
    onFieldChange: (field: keyof PropertyFormData, value: any) => void;
    onAddFeature: () => void;
    onRemoveFeature: (id: string) => void;
    onUpdateFeature: (id: string, description: string) => void;
    onAddArea: () => void;
    onRemoveArea: (id: string) => void;
    onUpdateArea: (id: string, field: string, value: any) => void;
    currentStep: number;
    handleStepClick: (step: number) => void;
    handleNext: () => void;
    handlePrevious: () => void;
    onSubmit: () => void;
    isUploading?: boolean;
    onFetchLocationData?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    setPendingChanges?: (pending: boolean) => void;
    // And any other handlers needed
  };
  children?: ReactNode;
}

export function ContentTabWrapper({ formData, handlers, children }: ContentTabWrapperProps) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}
