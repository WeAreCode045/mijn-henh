
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export interface UsePropertyAgendaReturn {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  fetchAgendaItems: (propertyId?: string) => Promise<void>;
  addAgendaItem: (
    title: string, 
    description: string | null, 
    date: string, 
    time: string,
    endDate: string | null,
    endTime: string | null,
    additionalUsers: string[],
    propertyId?: string | null
  ) => Promise<AgendaItem | null>;
  updateAgendaItem: (
    id: string, 
    title: string, 
    description: string | null, 
    date: string, 
    time: string,
    endDate: string | null,
    endTime: string | null,
    additionalUsers: string[]
  ) => Promise<any | null>;
  deleteAgendaItem: (id: string) => Promise<boolean>;
}
