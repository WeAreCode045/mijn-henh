
import React from "react";

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = "Step not found. Please try refreshing the page." }: ErrorStateProps) {
  return (
    <div className="p-4 border border-red-300 bg-red-50 rounded-md">
      <p className="text-red-500">Error: {message}</p>
    </div>
  );
}
