
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgendaItem } from "@/hooks/useAgenda";
import { usePropertiesSelect } from "@/hooks/usePropertiesSelect";
import { useAgentSelect } from "@/hooks/useAgentSelect";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  onSave: (data: Omit<AgendaItem, "id" | "created_at" | "updated_at">) => Promise<void>;
  item?: AgendaItem | null;
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
  const [endTime, setEndTime] = useState<string | null>(null);
  const [hasEndTime, setHasEndTime] = useState(false);
  const [tillDate, setTillDate] = useState<Date | undefined>(undefined);
  const [hasMultipleDays, setHasMultipleDays] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [invitedUsers, setInvitedUsers] = useState<string[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const { properties, isLoading: isPropertiesLoading } = usePropertiesSelect();
  const { agents, isLoading: isAgentsLoading } = useAgentSelect();

  useEffect(() => {
    if (item && mode === "edit") {
      setTitle(item.title);
      setDescription(item.description || "");
      setDate(item.event_date ? new Date(item.event_date) : undefined);
      setTime(item.event_time ? item.event_time.substring(0, 5) : "09:00");
      
      // Set end time if it exists
      if (item.end_time) {
        setEndTime(item.end_time.substring(0, 5));
        setHasEndTime(true);
      } else {
        setEndTime(null);
        setHasEndTime(false);
      }
      
      // Set till date if it exists
      if (item.till_date) {
        setTillDate(new Date(item.till_date));
        setHasMultipleDays(true);
      } else {
        setTillDate(undefined);
        setHasMultipleDays(false);
      }
      
      setSelectedPropertyId(item.property_id || null);
      setInvitedUsers(item.invited_users || null);
    } else {
      setTitle("");
      setDescription("");
      setDate(new Date());
      setTime("09:00");
      setEndTime(null);
      setHasEndTime(false);
      setTillDate(undefined);
      setHasMultipleDays(false);
      setSelectedPropertyId(null);
      setInvitedUsers(null);
    }
  }, [item, mode, isOpen]);

  const handleSave = async () => {
    if (!title || !date) return;

    setIsSaving(true);
    try {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const formattedTillDate = tillDate && hasMultipleDays ? format(tillDate, "yyyy-MM-dd") : null;
      
      await onSave({
        title,
        description,
        event_date: formattedDate,
        event_time: time,
        end_time: hasEndTime ? endTime : null,
        till_date: formattedTillDate,
        property_id: selectedPropertyId,
        invited_users: invitedUsers
      });
      onClose();
    } catch (error) {
      console.error("Error saving agenda item:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAgentChange = (agentId: string, checked: boolean) => {
    setInvitedUsers(prev => {
      if (!prev) prev = [];
      if (checked) {
        return [...prev, agentId];
      } else {
        return prev.filter(id => id !== agentId);
      }
    });
  };

  // Ensure we have a safe value for the property id
  const safeSelectedPropertyId = selectedPropertyId || "none";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
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
            <div className="text-right">
              <Checkbox 
                id="multiple-days" 
                checked={hasMultipleDays} 
                onCheckedChange={(checked) => setHasMultipleDays(checked as boolean)}
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor="multiple-days" className="ml-2">
                Multiple days event
              </Label>
            </div>
          </div>

          {hasMultipleDays && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="till-date" className="text-right">
                Till Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !tillDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tillDate ? format(tillDate, "PPP") : <span>Pick end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={tillDate}
                    onSelect={setTillDate}
                    initialFocus
                    className="pointer-events-auto"
                    disabled={(current) => {
                      // Disable dates before the start date
                      return date ? current < date : false;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Start Time
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
            <div className="text-right">
              <Checkbox 
                id="has-end-time" 
                checked={hasEndTime} 
                onCheckedChange={(checked) => setHasEndTime(checked as boolean)}
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor="has-end-time" className="ml-2">
                Set end time
              </Label>
            </div>
          </div>

          {hasEndTime && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-time" className="text-right">
                End Time
              </Label>
              <Input
                id="end-time"
                type="time"
                value={endTime || ""}
                onChange={(e) => setEndTime(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}

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
              rows={3}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">
              Invite Agents
            </Label>
            <div className="col-span-3 space-y-2">
              {isAgentsLoading ? (
                <div>Loading agents...</div>
              ) : agents.length === 0 ? (
                <div className="text-sm text-muted-foreground">No agents available</div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`agent-${agent.id}`} 
                        checked={invitedUsers?.includes(agent.id) || false}
                        onCheckedChange={(checked) => handleAgentChange(agent.id, checked as boolean)}
                      />
                      <Label htmlFor={`agent-${agent.id}`} className="text-sm">
                        {agent.full_name || agent.email}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
