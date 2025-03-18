import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/utils/imageUrlHelpers";
import { useState, useEffect } from "react";
import { getOrCreateWebViewUrl } from "@/utils/webViewUtils";
import { PropertyQROverlay } from "./PropertyQROverlay";
import { supabase } from "@/integrations/supabase/client";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { PropertySubmissionsDialog } from "./PropertySubmissionsDialog";
import { PropertyData } from "@/types/property";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface PropertyCardProps {
  property: PropertyData;
  onDelete: (id: string) => void;
}

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export const PropertyCard = ({
  property,
  onDelete,
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { settings } = useAgencySettings();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchWebViewUrl = async () => {
      const objectId = property.object_id || `temp-${property.id}-${Date.now()}`;
      const url = await getOrCreateWebViewUrl(property.id, objectId);
      if (url) {
        setWebViewUrl(url);
      }
    };
    
    fetchWebViewUrl();
    fetchSubmissions();

    const channel = supabase
      .channel('property_submissions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'property_contact_submissions',
          filter: `property_id=eq.${property.id}`,
        },
        () => {
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [property.id]);

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from('property_contact_submissions')
      .select('*')
      .eq('property_id', property.id)
      .order('created_at', { ascending: false });

    if (data) {
      setSubmissions(data);
      setUnreadCount(data.filter(s => !s.is_read).length);
    }
  };

  const markAsRead = async (submissionId: string) => {
    await supabase
      .from('property_contact_submissions')
      .update({ is_read: true })
      .eq('id', submissionId);
    
    fetchSubmissions();
  };

  const handleCardClick = () => {
    navigate(`/property/${property.id}/dashboard`);
  };

  // Get the main display image (featured image first, then first regular image)
  const displayImage = property.featuredImage || 
                      (property.images?.length > 0 ? getImageUrl(property.images[0]) : '/placeholder.svg');

  return (
    <>
      <Card key={property.id} className="p-6 space-y-6 relative group cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCardClick}>
        <div className="relative">
          <img
            src={displayImage}
            alt={property.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          {webViewUrl && (
            <PropertyQROverlay
              webViewUrl={webViewUrl}
              showQR={showQR}
              onMouseEnter={() => setShowQR(true)}
              onMouseLeave={() => setShowQR(false)}
            />
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
          <p className="text-lg font-medium">{property.price}</p>
          {unreadCount > 0 && (
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount} new {unreadCount === 1 ? 'message' : 'messages'}
            </div>
          )}
        </div>
      </Card>

      <PropertySubmissionsDialog
        open={showSubmissions}
        onOpenChange={setShowSubmissions}
        propertyTitle={property.title}
        submissions={submissions}
        onMarkAsRead={markAsRead}
      />
    </>
  );
};
