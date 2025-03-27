
import React from "react";
import { Spinner } from "@/components/ui/spinner";

export function PropertyFormLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner className="h-8 w-8 border-2" />
    </div>
  );
}
