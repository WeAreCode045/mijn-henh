
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmails } from "./useEmails";
import { EmailList } from "./EmailList";
import { EmailDetail } from "./EmailDetail";
import { useNavigate } from "react-router-dom";

export function EmailsSection() {
  const [activeTab, setActiveTab] = useState("inbox");
  const navigate = useNavigate();
  const { 
    emails, 
    isLoading, 
    error, 
    selectedEmail, 
    setSelectedEmail, 
    hasNylasConfig 
  } = useEmails();

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Email Communications</CardTitle>
        <Tabs defaultValue="inbox" className="w-[400px]" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {!hasNylasConfig ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nylas API Not Configured</AlertTitle>
              <AlertDescription>
                You need to configure your Nylas API in settings to use this feature.
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate("/settings")}>Configure Nylas API</Button>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="overflow-auto pr-1">
              <EmailList 
                emails={emails} 
                isLoading={isLoading} 
                selectedEmail={selectedEmail} 
                setSelectedEmail={setSelectedEmail} 
              />
            </div>
            <div>
              <EmailDetail email={selectedEmail} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
