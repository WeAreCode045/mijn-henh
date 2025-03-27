
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
  property_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  created_at: string;
}
