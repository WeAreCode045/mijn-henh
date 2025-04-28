
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentSignature } from '@/types/document';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/providers/AuthProvider';

export function useDocuments(propertyId?: string, isGlobal = false) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    data: documents,
    isLoading,
    error
  } = useQuery({
    queryKey: ['documents', propertyId, isGlobal],
    queryFn: async () => {
      let query = supabase
        .from('documents')
        .select(`
          *,
          creator:creator_id(id, first_name, last_name, email),
          signatures:document_signatures(
            *,
            user:user_id(id, full_name, email)
          )
        `)
        .order('created_at', { ascending: false });

      if (isGlobal) {
        query = query.eq('is_global', true);
      } else if (propertyId) {
        query = query.eq('property_id', propertyId);
      } else {
        return [];
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }

      // Transform data to match Document interface
      return data.map((doc: any): Document => {
        // Process creator data
        const creatorFirstName = doc.creator?.first_name || '';
        const creatorLastName = doc.creator?.last_name || '';
        const creatorFullName = `${creatorFirstName} ${creatorLastName}`.trim();
        
        // Process signatures
        const signatures = doc.signatures?.map((sig: any): DocumentSignature => {
          return {
            id: sig.id,
            document_id: sig.document_id,
            user_id: sig.user_id,
            status: sig.status,
            signature_data: sig.signature_data,
            created_at: sig.created_at,
            updated_at: sig.updated_at,
            user: sig.user ? {
              id: sig.user.id,
              full_name: sig.user.full_name,
              email: sig.user.email
            } : undefined
          };
        }) || [];

        return {
          id: doc.id,
          property_id: doc.property_id,
          creator_id: doc.creator_id,
          title: doc.title,
          description: doc.description,
          file_url: doc.file_url,
          document_type: doc.document_type,
          is_global: doc.is_global,
          requires_signature: doc.requires_signature,
          created_at: doc.created_at,
          updated_at: doc.updated_at,
          creator: doc.creator ? {
            id: doc.creator.id,
            full_name: creatorFullName || undefined,
            email: doc.creator.email || undefined
          } : undefined,
          signatures: signatures
        };
      });
    },
    enabled: isGlobal || !!propertyId,
  });

  const uploadDocument = async (file: File, document: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'file_url'>) => {
    try {
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `documents/${document.property_id || 'global'}/${timestamp}-${file.name}`;
      
      // Track upload progress manually
      let progressHandler: ((progress: number) => void) | null = null;
      
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the file
      const { data: publicURLData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Create document record
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...document,
          file_url: publicURLData.publicUrl,
          creator_id: user?.id
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      // If document requires signatures, create signature records
      if (document.requires_signature && document.property_id) {
        // Get participants for this property
        const { data: participants } = await supabase
          .from('property_participants')
          .select('user_id, role')
          .eq('property_id', document.property_id);

        if (participants?.length) {
          // Create signature records for each relevant participant
          const signatureRecords = participants
            .filter(p => {
              // Logic to determine who needs to sign this document
              // For now, assuming all participants need to sign
              return true;
            })
            .map(p => ({
              document_id: data.id,
              user_id: p.user_id,
              status: 'pending'
            }));

          if (signatureRecords.length) {
            await supabase
              .from('document_signatures')
              .insert(signatureRecords);
          }
        }
      }

      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    } finally {
      setUploadProgress(0);
    }
  };

  const uploadDocumentMutation = useMutation({
    mutationFn: async ({ 
      file, 
      document 
    }: { 
      file: File; 
      document: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'file_url'>;
    }) => {
      return uploadDocument(file, document);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['documents', propertyId, isGlobal] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload document',
        variant: 'destructive',
      });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const { data: document } = await supabase
        .from('documents')
        .select('file_url')
        .eq('id', documentId)
        .single();

      if (document?.file_url) {
        // Extract file path from URL
        const fileUrl = new URL(document.file_url);
        const filePath = fileUrl.pathname.split('/').slice(2).join('/');

        // Delete file from storage
        await supabase.storage
          .from('documents')
          .remove([filePath]);
      }

      // Delete document record
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        console.error('Error deleting document:', error);
        throw error;
      }

      return documentId;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['documents', propertyId, isGlobal] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
    },
  });

  const signDocumentMutation = useMutation({
    mutationFn: async ({ 
      signatureId, 
      status, 
      signatureData 
    }: { 
      signatureId: string; 
      status: 'signed' | 'declined';
      signatureData?: string;
    }) => {
      const { data, error } = await supabase
        .from('document_signatures')
        .update({ 
          status, 
          signature_data: signatureData,
          updated_at: new Date().toISOString()
        })
        .eq('id', signatureId)
        .select('*')
        .single();

      if (error) {
        console.error('Error signing document:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Document signed successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['documents', propertyId, isGlobal] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to sign document',
        variant: 'destructive',
      });
    },
  });

  const getUserPendingSignatures = () => {
    if (!user?.id || !documents) return [];
    
    return documents
      .filter(doc => doc.requires_signature)
      .flatMap(doc => 
        (doc.signatures || []).filter(
          sig => sig.user_id === user.id && sig.status === 'pending'
        )
      );
  };

  return {
    documents,
    isLoading,
    error,
    uploadProgress,
    uploadDocument: uploadDocumentMutation.mutate,
    deleteDocument: deleteDocumentMutation.mutate,
    signDocument: signDocumentMutation.mutate,
    pendingSignatures: getUserPendingSignatures(),
  };
}
