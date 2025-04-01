
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TabFilterProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  unreadCount: number;
}

export function TabFilter({ activeTab, onTabChange, unreadCount }: TabFilterProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unread">
          Unread
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="read">Read</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
