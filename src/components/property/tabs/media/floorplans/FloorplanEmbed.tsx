
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FloorplanEmbedProps {
  script: string;
}

export function FloorplanEmbed({ script }: FloorplanEmbedProps) {
  if (!script) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            No floorplan embed script provided
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-6">
        <div
          className="w-full aspect-video"
          dangerouslySetInnerHTML={{ __html: script }}
        />
      </CardContent>
    </Card>
  );
}
