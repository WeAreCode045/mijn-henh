
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function usePropertyDeletion() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const deleteProperty = useCallback(async (propertyId: string): Promise<boolean> => {
    if (!propertyId) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return false;
    }

    try {
      // 1. First, get all images associated with the property
      const { data: propertyImages, error: imagesError } = await supabase
        .from('property_images')
        .select('id, url')
        .eq('property_id', propertyId);

      if (imagesError) {
        console.error("Error fetching property images:", imagesError);
        // Continue with deletion even if we can't fetch images
      }

      // 2. Delete files from storage if URLs are from Supabase storage
      if (propertyImages && propertyImages.length > 0) {
        console.log(`Deleting ${propertyImages.length} files from storage for property ${propertyId}`);
        
        for (const image of propertyImages) {
          if (image.url && image.url.includes('storage/v1')) {
            try {
              // Extract path from URL
              const urlObj = new URL(image.url);
              const pathParts = urlObj.pathname.split('/');
              const bucketIndex = pathParts.findIndex(part => part === 'object');
              
              if (bucketIndex !== -1 && bucketIndex < pathParts.length - 2) {
                const bucket = pathParts[bucketIndex + 1];
                const path = pathParts.slice(bucketIndex + 2).join('/');
                
                console.log(`Deleting file from storage: bucket=${bucket}, path=${path}`);
                await supabase.storage
                  .from(bucket)
                  .remove([path]);
              }
            } catch (error) {
              console.error("Error removing file from storage:", error);
              // Continue with next file even if this one fails
            }
          }
        }
      }

      // 3. Delete all related data in specific order to respect foreign key constraints
      // Start with tables that reference the property

      // Delete property images records
      const { error: deleteImagesError } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId);

      if (deleteImagesError) {
        console.error("Error deleting property images:", deleteImagesError);
      }

      // Delete property notes
      const { error: deleteNotesError } = await supabase
        .from('property_notes')
        .delete()
        .eq('property_id', propertyId);

      if (deleteNotesError) {
        console.error("Error deleting property notes:", deleteNotesError);
      }

      // Delete property agenda items
      const { error: deleteAgendaError } = await supabase
        .from('property_agenda_items')
        .delete()
        .eq('property_id', propertyId);

      if (deleteAgendaError) {
        console.error("Error deleting property agenda items:", deleteAgendaError);
      }

      // Delete property edit logs
      const { error: deleteLogsError } = await supabase
        .from('property_edit_logs')
        .delete()
        .eq('property_id', propertyId);

      if (deleteLogsError) {
        console.error("Error deleting property edit logs:", deleteLogsError);
      }

      // Get submission IDs to delete replies
      const { data: submissions, error: submissionsError } = await supabase
        .from('property_contact_submissions')
        .select('id')
        .eq('property_id', propertyId);

      if (!submissionsError && submissions && submissions.length > 0) {
        const submissionIds = submissions.map(sub => sub.id);
        
        // Delete submission replies
        const { error: deleteRepliesError } = await supabase
          .from('property_submission_replies')
          .delete()
          .in('submission_id', submissionIds);

        if (deleteRepliesError) {
          console.error("Error deleting submission replies:", deleteRepliesError);
        }
      }

      // Delete property contact submissions
      const { error: deleteSubmissionsError } = await supabase
        .from('property_contact_submissions')
        .delete()
        .eq('property_id', propertyId);

      if (deleteSubmissionsError) {
        console.error("Error deleting property contact submissions:", deleteSubmissionsError);
      }

      // Delete property web views
      const { error: deleteViewsError } = await supabase
        .from('property_web_views')
        .delete()
        .eq('property_id', propertyId);

      if (deleteViewsError) {
        console.error("Error deleting property web views:", deleteViewsError);
      }

      // 4. Finally, delete the property itself
      const { error: deletePropertyError } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (deletePropertyError) {
        throw deletePropertyError;
      }

      toast({
        title: "Success",
        description: "Property and all related data successfully deleted",
      });

      // Navigate to the properties list
      navigate('/properties');
      return true;
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property completely",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, navigate]);

  return { deleteProperty };
}
