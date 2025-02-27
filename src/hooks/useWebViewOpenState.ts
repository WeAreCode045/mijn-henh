
import { useState } from "react";

export function useWebViewOpenState() {
  const [isWebViewOpen, setIsWebViewOpen] = useState(false);
  
  const openWebView = () => setIsWebViewOpen(true);
  const closeWebView = () => setIsWebViewOpen(false);
  
  return {
    isWebViewOpen,
    openWebView,
    closeWebView,
    setIsWebViewOpen
  };
}
