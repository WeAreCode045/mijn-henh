
import { Button } from "@/components/ui/button";

interface UpcomingEventsPresetsProps {
  onPresetClick: (preset: string) => void;
  visible: boolean;
}

export function UpcomingEventsPresets({ onPresetClick, visible }: UpcomingEventsPresetsProps) {
  if (!visible) return null;
  
  return (
    <div className="border rounded-lg p-3">
      <h3 className="text-sm font-medium mb-2">Upcoming Events:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetClick("tomorrow")}
        >
          Tomorrow
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetClick("thisWeek")}
        >
          This Week
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetClick("nextWeek")}
        >
          Next Week
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetClick("thisMonth")}
        >
          This Month
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetClick("next30Days")}
        >
          Next 30 Days
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetClick("upcoming")}
        >
          All Upcoming
        </Button>
      </div>
    </div>
  );
}
