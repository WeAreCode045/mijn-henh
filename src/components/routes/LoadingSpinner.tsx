
import React from "react";
import { Spinner } from "@/components/ui/spinner";

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="h-8 w-8 border-2" />
    </div>
  );
}
