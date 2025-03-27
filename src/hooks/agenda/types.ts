
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export interface UseAgendaReturn {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  addAgendaItem: (
    title: string, 
    description: string | null, 
    eventDate: string, 
    eventTime: string,
    endDate: string | null,
    endTime: string | null,
    additionalUsers: string[],
    propertyId?: string | null
  ) => Promise<void>;
  deleteAgendaItem: (agendaItemId: string) => Promise<void>;
  updateAgendaItem: (
    agendaItemId: string, 
    title: string, 
    description: string | null, 
    eventDate: string, 
    eventTime: string,
    endDate: string | null,
    endTime: string | null,
    additionalUsers: string[],
    propertyId?: string | null
  ) => Promise<void>;
  refreshAgendaItems: () => Promise<void>;
}
