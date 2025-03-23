
import React from 'react';
import { PropertyData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, ExternalLink, Edit, UserCheck } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface DashboardTabContentProps {
  property: PropertyData;
  onDelete?: () => Promise<void>;
  onGeneratePDF?: () => void;
  onWebView?: () => void;
  onEditObjectId?: (objectId: string) => Promise<void>;
  onAssignAgent?: (agentId: string) => Promise<void>;
  agentInfo?: { id: string; name: string } | null;
}

export function DashboardTabContent({ 
  property,
  onDelete,
  onGeneratePDF,
  onWebView,
  onEditObjectId,
  onAssignAgent,
  agentInfo
}: DashboardTabContentProps) {
  const [objectId, setObjectId] = useState(property.object_id || '');
  const [agentId, setAgentId] = useState(agentInfo?.id || '');
  
  const handleSaveObjectId = async () => {
    if (onEditObjectId) {
      await onEditObjectId(objectId);
    }
  };
  
  const handleSaveAgent = async () => {
    if (onAssignAgent) {
      await onAssignAgent(agentId);
    }
  };

  // Function to safely format price
  const formatPrice = (price: string | number | undefined): string => {
    if (price === undefined || price === null || price === '') {
      return 'No price';
    }
    
    try {
      // Convert string to number if needed
      const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
      if (isNaN(numericPrice)) {
        return 'No price';
      }
      
      return new Intl.NumberFormat('nl-NL', { 
        style: 'currency', 
        currency: 'EUR',
        maximumFractionDigits: 0
      }).format(numericPrice);
    } catch (error) {
      console.error('Error formatting price:', error);
      return 'No price';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Property Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {onGeneratePDF && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  type="button"
                  onClick={onGeneratePDF}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate PDF
                </Button>
              )}
              
              {onWebView && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  type="button"
                  onClick={onWebView}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview Web View
                </Button>
              )}
              
              {onEditObjectId && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start" type="button">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Property ID
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Property ID</DialogTitle>
                      <DialogDescription>
                        This ID is used for sharing the property via URL.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="objectId">Property ID</Label>
                        <Input 
                          id="objectId" 
                          value={objectId} 
                          onChange={(e) => setObjectId(e.target.value)}
                          placeholder="Enter a unique ID for this property"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                      </DialogClose>
                      <Button type="button" onClick={handleSaveObjectId}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              
              {onAssignAgent && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start" type="button">
                      <UserCheck className="mr-2 h-4 w-4" />
                      {agentInfo ? 'Change Agent' : 'Assign Agent'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{agentInfo ? 'Change Agent' : 'Assign Agent'}</DialogTitle>
                      <DialogDescription>
                        Assign an agent to this property.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="agentId">Agent ID</Label>
                        <Input 
                          id="agentId" 
                          value={agentId} 
                          onChange={(e) => setAgentId(e.target.value)}
                          placeholder="Enter the agent's ID"
                        />
                      </div>
                      {agentInfo && (
                        <div className="text-sm">
                          Current agent: <span className="font-medium">{agentInfo.name}</span>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                      </DialogClose>
                      <Button type="button" onClick={handleSaveAgent}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              
              <Separator />
              
              {onDelete && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full justify-start" type="button">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Property
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Property</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this property? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                      </DialogClose>
                      <Button type="button" variant="destructive" onClick={onDelete}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Property Information</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Title</div>
                <div>{property.title || 'No title'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Type</div>
                <div>{property.propertyType || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div>{property.status || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Address</div>
                <div>{property.address || 'No address'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Price</div>
                <div>{formatPrice(property.price)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
