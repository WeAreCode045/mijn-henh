import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgendaItem } from "@/hooks/useAgenda";
import { usePropertiesSelect } from "@/hooks/usePropertiesSelect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgendaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    description: string | null,
    date: string,
    time: string,
    propertyId?: string | null
  ) => Promise<void>;
  item?: AgendaItem;
  mode: "add" | "edit";
}

export function AgendaDialog({
  isOpen,
  onClose,
  onSave,
  item,
  mode,
}: AgendaDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | null>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { properties, isLoading: isPropertiesLoading } = usePropertiesSelect();

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
  }, [item, mode, isOpen]);

  const handleSave = async () => {
    if (!title || !date) return;

    setIsSaving(true);
    try {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      await onSave(
        title,
        description,
        formattedDate,
        time,
        selectedPropertyId
      );
      onClose();
    } catch (error) {
      console.error("Error saving agenda item:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const safeSelectedPropertyId = selectedPropertyId || "none";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New" : "Edit"} Agenda Item
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new agenda item for your calendar."
              : "Update the details of this agenda item."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="property" className="text-right">
              Property
            </Label>
            <Select
              value={safeSelectedPropertyId}
              onValueChange={(value) => setSelectedPropertyId(value === "none" ? null : value)}
              defaultValue="none"
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="No property (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No property</SelectItem>
                {properties.map((property) => (
                  <SelectItem 
                    key={property.id} 
                    value={property.id || `property_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`}
                  >
                    {property.title || `Property ${property.id.substring(0, 8)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : mode === "add" ? "Add" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
