
import { Button } from "@/components/ui/button";
import { Inbox, RefreshCw, Settings } from "lucide-react";

interface EmailHeaderProps {
  fetchEmails: () => void;
  isLoading: boolean;
  isConfigured: boolean;
}

export const EmailHeader = ({ fetchEmails, isLoading, isConfigured }: EmailHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center">
        <Inbox className="mr-2 h-5 w-5" />
        Email Inbox
      </h2>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = "/settings"}
        >
          <Settings className="h-4 w-4 mr-2" />
          IMAP Settings
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchEmails}
          disabled={isLoading || !isConfigured}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
};
