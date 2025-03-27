
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { useAuth } from "@/providers/AuthProvider";

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
  const { user } = useAuth();

  useEffect(() => {
    if (item && mode === "edit") {
      setTitle(item.title);
      setDescription(item.description || "");
      setDate(item.event_date ? new Date(item.event_date) : undefined);
      setTime(item.event_time ? item.event_time.substring(0, 5) : "09:00");
      setSelectedPropertyId(item.property_id || null);
    } else {
      setTitle("");
      setDescription("");
      setDate(new Date());
      setTime("09:00");
      setSelectedPropertyId(null);
    }
  }, [item, mode]);

  const handleSave = async (onSave: (data: Omit<AgendaItem, "id" | "created_at" | "updated_at">) => Promise<void>) => {
    if (!title || !date || !user?.id) return false;

    setIsSaving(true);
    try {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      await onSave({
        title,
        description,
        event_date: formattedDate,
        event_time: time,
        property_id: selectedPropertyId,
        agent_id: user.id,
        end_date: null,
        end_time: null,
        additional_users: []
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
    isSaving,
    handleSave
  };
}
