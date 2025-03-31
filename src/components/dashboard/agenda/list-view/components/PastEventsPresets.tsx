
import { Button } from "@/components/ui/button";

interface PastEventsPresetsProps {
  onPresetClick: (preset: string) => void;
  visible: boolean;
}

export function PastEventsPresets({ onPresetClick, visible }: PastEventsPresetsProps) {
  if (!visible) return null;
  
  return (
    <div className="border rounded-lg p-3">
      <h3 className="text-sm font-medium mb-2">Past Events:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetClick("yesterday")}
        >
          Yesterday
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetClick("lastWeek")}
        >
          Last Week
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetClick("lastMonth")}
        >
          Last Month
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPresetClick("last30Days")}
        >
          Last 30 Days
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
          onClick={() => onPresetClick("past")}
        >
          All Past
        </Button>
      </div>
    </div>
  );
}
