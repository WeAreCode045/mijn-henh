
export interface AgendaItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAgendaItem: AgendaItem | null;
  onDelete?: () => void;
  onEdit?: (e: React.MouseEvent) => void;
}

export interface AgendaAddEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  additionalUsers: string[];
  setAdditionalUsers: (users: string[]) => void;
  availableUsers: { id: string; name: string }[];
  mode: "add" | "edit";
}

export interface DateRangeSelectorProps {
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
}

export interface AgendaItemListProps {
  filteredAgendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
}

export type DateRange = "today" | "tomorrow" | "thisWeek" | "thisMonth" | "all";

export interface AgendaItem {
  id: string;
  property_id: string | null;
  agent_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  end_date: string | null;
  end_time: string | null;
  additional_users: string[];
  created_at: string;
  updated_at?: string;
  property?: {
    id: string;
    title: string;
  } | null;
}
