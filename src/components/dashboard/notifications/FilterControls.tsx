
import { NotificationType } from "./NotificationTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface FilterControlsProps {
  filterType: NotificationType | 'all';
  setFilterType: (type: NotificationType | 'all') => void;
  sortOrder: 'newest' | 'oldest';
  setSortOrder: (order: 'newest' | 'oldest') => void;
  getTypeCount: (type: NotificationType | 'all') => number;
}

export function FilterControls({ 
  filterType, 
  setFilterType, 
  sortOrder, 
  setSortOrder, 
  getTypeCount 
}: FilterControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Type Filter Dropdown */}
      <Select 
        value={filterType} 
        onValueChange={(value) => setFilterType(value as NotificationType | 'all')}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Filter by Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types ({getTypeCount('all')})</SelectItem>
          <SelectItem value="todo">Tasks ({getTypeCount('todo')})</SelectItem>
          <SelectItem value="agenda">Events ({getTypeCount('agenda')})</SelectItem>
          <SelectItem value="assignment">Assignments ({getTypeCount('assignment')})</SelectItem>
          <SelectItem value="change">Updates ({getTypeCount('change')})</SelectItem>
          <SelectItem value="communication">Messages ({getTypeCount('communication')})</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Sort Order Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            {sortOrder === 'newest' ? 'Newest' : 'Oldest'} <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSortOrder('newest')}>
            Newest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
            Oldest First
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
