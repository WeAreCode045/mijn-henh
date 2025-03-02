
import { useState } from "react";

export function usePropertyWebViewDialog() {
  const [webViewOpen, setWebViewOpen] = useState(false);
  
  const handleWebView = () => {
    setWebViewOpen(true);
  };

  return {
    webViewOpen,
    setWebViewOpen,
    handleWebView
  };
}
