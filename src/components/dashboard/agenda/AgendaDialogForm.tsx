
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePropertiesSelect } from "@/hooks/usePropertiesSelect";

interface AgendaDialogFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string | null;
  setDescription: (value: string | null) => void;
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
  time: string;
  setTime: (value: string) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (value: string | null) => void;
}

export function AgendaDialogForm({
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
  time,
  setTime,
  selectedPropertyId,
  setSelectedPropertyId
}: AgendaDialogFormProps) {
  const { properties, isLoading: isPropertiesLoading } = usePropertiesSelect();
  
  // Ensure we have a safe value for the property id
  const safeSelectedPropertyId = selectedPropertyId || "none";

  return (
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
                value={property.id || `property-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`}
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
  );
}
