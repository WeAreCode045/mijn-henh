
export interface TodoItem {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  property_id: string | null;
  assigned_to_id: string | null;
  notify_at: string | null;
  notification_sent?: boolean;
  created_at: string;
  updated_at: string;
  sort_order: number;
  property?: {
    id: string;
    title: string;
  } | null;
  assigned_to?: {
    id: string;
    full_name: string;
  } | null;
}
