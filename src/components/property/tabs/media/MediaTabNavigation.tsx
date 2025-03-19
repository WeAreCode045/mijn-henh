
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, LayoutIcon, VideoIcon } from "lucide-react";

interface MediaTabNavigationProps {
  currentTab: string;
}

export function MediaTabNavigation({ currentTab }: MediaTabNavigationProps) {
  return (
    <TabsList className="mb-6">
      <TabsTrigger value="images" className="flex gap-2">
        <ImageIcon className="h-4 w-4" />
        Images
      </TabsTrigger>
      <TabsTrigger value="floorplans" className="flex gap-2">
        <LayoutIcon className="h-4 w-4" />
        Floorplans
      </TabsTrigger>
      <TabsTrigger value="virtual-tours" className="flex gap-2">
        <VideoIcon className="h-4 w-4" />
        Virtual Tours
      </TabsTrigger>
    </TabsList>
  );
}
