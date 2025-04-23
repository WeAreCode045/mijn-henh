
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { usePropertyData } from "./webview/hooks/usePropertyData";
import { WebViewLoading } from "./webview/WebViewLoading";
import { WebViewError } from "./webview/WebViewError";
import { WebViewLayout } from "./webview/layout/WebViewLayout";
import { useWebViewBackground } from "./webview/hooks/useWebViewBackground";
import { WebViewSectionContent } from "./webview/components/WebViewSectionContent";

interface PropertyWebViewProps {
  property?: PropertyData;
  isAdminView?: boolean;
}

export function PropertyWebView({ property, isAdminView = false }: PropertyWebViewProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useAgencySettings();
  const [currentPage, setCurrentPage] = useState(0);
  
  // Fetch property data if not provided
  const { propertyData, isLoading, error } = usePropertyData(id, property);
  
  // Set webview background
  useWebViewBackground(settings);

  if (isLoading) return <WebViewLoading />;
  if (error || !propertyData) return <WebViewError error={error} />;

  return (
    <WebViewLayout
      property={propertyData}
      settings={settings}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      <WebViewSectionContent 
        property={propertyData}
        settings={settings}
        currentPage={currentPage}
        showHeader={false}
      />
    </WebViewLayout>
  );
}
