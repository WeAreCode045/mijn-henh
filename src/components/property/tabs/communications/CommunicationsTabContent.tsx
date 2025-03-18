
import React, { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon, MailIcon, PhoneIcon, UserIcon, CalendarIcon, CheckIcon, XIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFetchSubmissions } from "./hooks/useFetchSubmissions";
import { formatDate } from "@/utils/dateUtils";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { submissions, isLoading, refetch } = useFetchSubmissions(property.id);

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: isRead })
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh the submissions list
      refetch();
    } catch (error) {
      console.error('Error updating contact submission:', error);
    }
  };

  const filterContactsByTab = () => {
    switch (activeTab) {
      case 'unread':
        return submissions.filter(contact => !contact.is_read);
      case 'read':
        return submissions.filter(contact => contact.is_read);
      default:
        return submissions;
    }
  };

  const filteredContacts = filterContactsByTab();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Communications</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {submissions.filter(c => !c.is_read).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {submissions.filter(c => !c.is_read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">Loading contact submissions...</p>
          </CardContent>
        </Card>
      ) : filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <MessageCircleIcon className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">No contact submissions yet</h3>
              <p className="text-muted-foreground">
                When potential clients submit inquiries about this property, they'll appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredContacts.map(contact => (
            <Card key={contact.id} className={contact.is_read ? "" : "border-l-4 border-l-blue-500"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <Badge className="ml-3" variant={
                      contact.inquiry_type === 'viewing' ? "default" : 
                      contact.inquiry_type === 'question' ? "secondary" : "outline"
                    }>
                      {contact.inquiry_type.charAt(0).toUpperCase() + contact.inquiry_type.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => markAsRead(contact.id, !contact.is_read)}
                    >
                      {contact.is_read ? (
                        <XIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <CheckIcon className="h-4 w-4 mr-1" />
                      )}
                      {contact.is_read ? 'Mark Unread' : 'Mark Read'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {formatDate(contact.created_at)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 bg-muted p-4 rounded-md">
                  <h4 className="font-semibold mb-2">Message:</h4>
                  <p className="whitespace-pre-line">{contact.message}</p>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${contact.email}?subject=RE: Inquiry about ${property.title}`}>
                      <MailIcon className="h-4 w-4 mr-2" />
                      Reply by Email
                    </a>
                  </Button>
                  {contact.phone && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${contact.phone}`}>
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
