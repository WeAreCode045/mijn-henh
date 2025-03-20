
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PropertyDetailsCard } from './cards/PropertyDetailsCard';
import { NotesCard } from './cards/NotesCard';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarIcon, ClipboardCheck, FileText, FileUp, Settings, Users } from "lucide-react";
import { format } from 'date-fns';
import { ActivityCard } from './cards/ActivityCard';
import { SubmissionsCard } from './SubmissionsCard';

interface PropertyDashboardTabProps {
  id: string;
  title: string;
  objectId?: string;
  agentId?: string;
  createdAt?: string;
  updatedAt?: string;
  agentInfo?: { id: string; name: string } | null;
  isUpdating: boolean;
  onSave: () => void;
  onDelete: () => Promise<void>;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleSaveAgent: (agentId: string) => Promise<void>;
  handleGeneratePDF: () => void;
  handleWebView: (e: React.MouseEvent) => void;
}

export function PropertyDashboardTab({
  id,
  title,
  objectId,
  agentId,
  createdAt,
  updatedAt,
  agentInfo,
  isUpdating,
  onSave,
  onDelete,
  handleSaveObjectId,
  handleSaveAgent,
  handleGeneratePDF,
  handleWebView,
}: PropertyDashboardTabProps) {
  const [currentObjectId, setCurrentObjectId] = React.useState(objectId || '');
  const [currentAgentId, setCurrentAgentId] = React.useState(agentId || '');
  const [settingsTab, setSettingsTab] = React.useState('general');

  const saveObjectId = async () => {
    await handleSaveObjectId(currentObjectId);
  };

  const saveAgent = async () => {
    await handleSaveAgent(currentAgentId);
  };

  // Wrapper function to match the expected type
  const generatePDF = () => {
    handleGeneratePDF();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generatePDF}>
            <FileText className="mr-2 h-4 w-4" /> Generate PDF
          </Button>
          <Button variant="outline" onClick={handleWebView}>
            <FileUp className="mr-2 h-4 w-4" /> Web View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left column - Property Details */}
        <div className="space-y-4">
          <PropertyDetailsCard id={id} title={title} objectId={objectId} />
          <ActivityCard 
            createdAt={createdAt ? format(new Date(createdAt), 'dd MMM yyyy HH:mm') : 'Unknown'} 
            updatedAt={updatedAt ? format(new Date(updatedAt), 'dd MMM yyyy HH:mm') : 'Unknown'} 
          />
        </div>

        {/* Middle column - Notes, Agenda */}
        <div className="space-y-4">
          <NotesCard propertyId={id} />
        </div>

        {/* Right column - Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Settings</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={settingsTab} onValueChange={setSettingsTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="agent">Agent</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="objectId">Object ID</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="objectId" 
                        value={currentObjectId} 
                        onChange={e => setCurrentObjectId(e.target.value)} 
                        placeholder="e.g. 12345"
                      />
                      <Button onClick={saveObjectId} disabled={isUpdating}>Save</Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="agent" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="agentId">Assigned Agent</Label>
                      {agentInfo && (
                        <Badge variant="outline" className="gap-1">
                          <Users className="h-3 w-3" /> {agentInfo.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Select value={currentAgentId} onValueChange={setCurrentAgentId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an agent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Agents</SelectLabel>
                            <SelectItem value="">None</SelectItem>
                            <SelectItem value={currentAgentId || ""}>
                              {agentInfo?.name || "Current Agent"}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button onClick={saveAgent} disabled={isUpdating}>Save</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Danger Zone</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">Delete Property</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the property
                      and remove all data associated with it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete()}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
