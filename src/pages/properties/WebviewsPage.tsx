
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, ExternalLink, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface PropertyWebview {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

const WebviewsPage = () => {
  const [properties, setProperties] = useState<PropertyWebview[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, status, created_at')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          const formattedData = data.map(property => ({
            id: property.id,
            title: property.title || 'Untitled Property',
            status: property.status || 'Draft',
            createdAt: property.created_at
          }));
          
          setProperties(formattedData);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Error",
          description: "Failed to load properties",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [toast]);

  const handleShare = async (propertyId: string, platform: string) => {
    const shareUrl = `${window.location.origin}/share/${propertyId}`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`);
        break;
      case 'email':
        window.location.href = `mailto:?subject=Check out this property&body=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct sharing API, but we can copy the link
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "Share this link on Instagram",
        });
        break;
      case 'copy':
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "The share link has been copied to your clipboard",
        });
        break;
    }
  };

  const openWebview = (propertyId: string, newTab: boolean) => {
    const webviewUrl = `/share/${propertyId}`;
    if (newTab) {
      window.open(webviewUrl, '_blank');
    } else {
      navigate(webviewUrl);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Property Webviews</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No properties found</p>
            <Button onClick={() => navigate('/properties')}>Create a property</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id}>
              <CardHeader>
                <CardTitle className="truncate">{property.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    property.status === 'Published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleShare(property.id, 'whatsapp')}>
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(property.id, 'email')}>
                        Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(property.id, 'instagram')}>
                        Instagram
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(property.id, 'copy')}>
                        Copy Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openWebview(property.id, true)}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      New Tab
                    </Button>
                    <Button variant="default" size="sm" onClick={() => openWebview(property.id, false)}>
                      <Globe className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebviewsPage;
