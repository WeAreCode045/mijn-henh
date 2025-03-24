
import React from "react";

interface WebviewSectionTitleProps {
  title: string;
}

export function WebviewSectionTitle({ title }: WebviewSectionTitleProps) {
  return (
    <h2 className="text-2xl font-bold text-estate-800">{title}</h2>
  );
}
