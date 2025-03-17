
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PropertyTabSelectorProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function PropertyTabSelector({ activeTab, onTabChange }: PropertyTabSelectorProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
