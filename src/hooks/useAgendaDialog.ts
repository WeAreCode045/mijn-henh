
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { useAuth } from "@/providers/AuthProvider";
import { useUsers } from "@/hooks/useUsers";

export function useAgendaDialog(
  item?: AgendaItem | null,
  mode: "add" | "edit" = "add"
) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | null>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [additionalUsers, setAdditionalUsers] = useState<string[]>([]);
  const { user } = useAuth();
  const { users } = useUsers();

  // Transform users into a format suitable for selection
  const availableUsers = users
    ? users
        .filter(u => u.id !== user?.id) // Filter out the current user
        .map(u => ({
          id: u.id,
          name: u.full_name || u.email || `User ${u.id.substring(0, 8)}`
        }))
    : [];

  useEffect(() => {
    if (item && mode === "edit") {
      setTitle(item.title);
      setDescription(item.description || "");
      setDate(item.event_date ? new Date(item.event_date) : undefined);
      setTime(item.event_time ? item.event_time.substring(0, 5) : "09:00");
      setSelectedPropertyId(item.property_id || null);
      setAdditionalUsers(item.additional_users || []);
    } else {
      setTitle("");
      setDescription("");
      setDate(new Date());
      setTime("09:00");
      setAdditionalUsers([]);
      // Don't reset the selectedPropertyId here to preserve context
      // propertyId should be set by the parent component if needed
    }
  }, [item, mode]);

  const handleSave = async (onSave: (data: Omit<AgendaItem, "id" | "created_at" | "updated_at">) => Promise<void>) => {
    if (!title || !date || !user?.id) return false;

    setIsSaving(true);
    try {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      
      // Use a placeholder property ID if none is provided to satisfy the not-null constraint
      const safePropertyId = selectedPropertyId || '00000000-0000-0000-0000-000000000000';
      
      console.log("Saving agenda item with propertyId:", safePropertyId);
      
      await onSave({
        title,
        description,
        event_date: formattedDate,
        event_time: time,
        property_id: safePropertyId,
        agent_id: user.id,
        end_date: null,
        end_time: null,
        additional_users: additionalUsers
      });
      return true;
    } catch (error) {
      console.error("Error saving agenda item:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    date,
    setDate,
    time,
    setTime,
    selectedPropertyId,
    setSelectedPropertyId,
    additionalUsers,
    setAdditionalUsers,
    availableUsers,
    isSaving,
    handleSave
  };
}
