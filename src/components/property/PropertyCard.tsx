
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getOrCreateWebViewUrl } from "@/utils/webViewUtils";
import { PropertyQROverlay } from "./PropertyQROverlay";
import { supabase } from "@/integrations/supabase/client";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { PropertySubmissionsDialog } from "./PropertySubmissionsDialog";
import { PropertyData } from "@/types/property";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Submission } from "@/types/submission";
import { Badge } from "@/components/ui/badge";
import { PropertyCardActions } from "./PropertyCardActions";

interface PropertyCardProps {
  property: PropertyData;
  onDelete: (id: string) => void;
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
      .eq(property.id)
      .order('created_at', { ascending: false });

    if (data) {
      const formattedSubmissions: Submission[] = data.map(item => ({
        id: item.id,
        property_id: item.property_id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        message: item.message || "",
        inquiry_type: item.inquiry_type,
        is_read: !!item.is_read,
        created_at: item.created_at,
        updated_at: item.updated_at,
        agent_id: item.agent_id,
      }));
      
      setSubmissions(formattedSubmissions);
      setUnreadCount(formattedSubmissions.filter(s => !s.is_read).length);
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
                      (property.images?.length > 0 ? property.images[0].url : '/placeholder.svg');

  // Get the agent name safely (handle both full_name and name properties)
  const agentName = property.agent ? (property.agent.full_name || property.agent.name || 'Unnamed Agent') : null;

  return (
    
      <Card key={property.id} className="p-6 space-y-6 relative group cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCardClick}>
        <div className="relative">
          <img
            src={displayImage}
            alt={property.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          {agentName && (
              <Badge variant="outline" className="absolute top-2 right-5 ml-2 text-xs bg-white">
                {agentName}
              </Badge>
          )}
          {webViewUrl && (
            <PropertyQROverlay
              webViewUrl={webViewUrl}
              showQR={showQR}
              onMouseEnter={() => setShowQR(true)}
              onMouseLeave={() => setShowQR(false)}
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-stretch items-start">
            <h3 className="text-sm/4 font-bold mb-1 line-clamp-2">{property.title}</h3>
          </div>
          <div className="flex justify-start items-start gap-y-5">

          <p className="text-sm font-bold">€{property.price},-</p>
            </div>
          <div className="mt-3">
            <PropertyCardActions 
              property={property}
              settings={settings}
              onDelete={onDelete}
              unreadCount={unreadCount}
              onShowSubmissions={() => setShowSubmissions(true)}
            />
          </div>
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
