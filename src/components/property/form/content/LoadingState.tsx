
import React from "react";

export function LoadingState() {
  return (
    <div className="py-4 flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
