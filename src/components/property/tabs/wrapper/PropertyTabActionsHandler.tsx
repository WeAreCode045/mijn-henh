
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { useState } from "react";

interface PropertyTabActionsHandlerProps {
  propertyId: string;
  children: (props: {
    webViewOpen: boolean;
    setWebViewOpen: (open: boolean) => void;
    handleGeneratePDF: () => void;
    handleOpenWebView: (e?: React.MouseEvent) => void;
  }) => React.ReactNode;
}

export function PropertyTabActionsHandler({ propertyId, children }: PropertyTabActionsHandlerProps) {
  const [webViewOpen, setWebViewOpen] = useState(false);
  const { handleGeneratePDF } = usePropertyActions(propertyId);

  // Web view functions
  const handleOpenWebView = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setWebViewOpen(true);
  };

  return children({
    webViewOpen,
    setWebViewOpen,
    handleGeneratePDF,
    handleOpenWebView
  });
}
