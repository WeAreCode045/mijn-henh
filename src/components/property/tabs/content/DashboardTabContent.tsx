
import React from "react";
import { PropertyData } from "@/types/property";

export interface DashboardTabContentProps {
  property: PropertyData;
  onDelete: () => Promise<void>;
  onSave: () => void;
  onWebView: (e: React.MouseEvent) => void;
  handleSaveAgent: (agentId: string) => Promise<void>;
}

export function DashboardTabContent({
  property,
  onDelete,
  onSave,
  onWebView,
  handleSaveAgent
}: DashboardTabContentProps) {
  return (
    <div className="space-y-6">
      {/* Dashboard content */}
      <p>Dashboard content for property: {property.title}</p>
    </div>
  );
}
