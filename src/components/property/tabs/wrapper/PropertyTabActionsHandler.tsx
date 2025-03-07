
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
  const { handleGeneratePDF, handleWebView } = usePropertyActions(propertyId);

  // Web view functions - now opens in new tab instead of dialog
  const handleOpenWebView = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    // Use the direct navigation function instead of opening the dialog
    handleWebView(e);
  };

  return children({
    webViewOpen,
    setWebViewOpen,
    handleGeneratePDF,
    handleOpenWebView
  });
}
