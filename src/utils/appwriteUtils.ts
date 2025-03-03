
import { ID, Query } from 'appwrite';
import { appwriteDatabases, DATABASE_ID, COLLECTIONS, appwriteStorage, BUCKETS } from '@/integrations/appwrite/client';

// Helper function to fetch a single document
export async function getDocument(collection: string, documentId: string) {
  try {
    const document = await appwriteDatabases.getDocument(
      DATABASE_ID,
      collection,
      documentId
    );
    return { data: document, error: null };
  } catch (error) {
    console.error(`Error fetching document from ${collection}:`, error);
    return { data: null, error };
  }
}

// Helper function to fetch documents with query
export async function getDocuments(collection: string, queries: string[] = []) {
  try {
    const documents = await appwriteDatabases.listDocuments(
      DATABASE_ID,
      collection,
      queries
    );
    return { data: documents.documents, error: null };
  } catch (error) {
    console.error(`Error fetching documents from ${collection}:`, error);
    return { data: [], error };
  }
}

// Helper function to create a document
export async function createDocument(collection: string, data: any, documentId?: string) {
  try {
    const document = await appwriteDatabases.createDocument(
      DATABASE_ID,
      collection,
      documentId || ID.unique(),
      data
    );
    return { data: document, error: null };
  } catch (error) {
    console.error(`Error creating document in ${collection}:`, error);
    return { data: null, error };
  }
}

// Helper function to update a document
export async function updateDocument(collection: string, documentId: string, data: any) {
  try {
    const document = await appwriteDatabases.updateDocument(
      DATABASE_ID,
      collection,
      documentId,
      data
    );
    return { data: document, error: null };
  } catch (error) {
    console.error(`Error updating document in ${collection}:`, error);
    return { data: null, error };
  }
}

// Helper function to delete a document
export async function deleteDocument(collection: string, documentId: string) {
  try {
    await appwriteDatabases.deleteDocument(
      DATABASE_ID,
      collection,
      documentId
    );
    return { error: null };
  } catch (error) {
    console.error(`Error deleting document from ${collection}:`, error);
    return { error };
  }
}

// Helper for file upload
export async function uploadFile(bucketId: string, file: File, permissions: string[] = ['role:all']) {
  try {
    const result = await appwriteStorage.createFile(
      bucketId,
      ID.unique(),
      file,
      permissions
    );
    
    // Get the file URL
    const fileUrl = appwriteStorage.getFileView(bucketId, result.$id);
    
    return { data: { id: result.$id, url: fileUrl }, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { data: null, error };
  }
}

// Helper for file deletion
export async function deleteFile(bucketId: string, fileId: string) {
  try {
    await appwriteStorage.deleteFile(bucketId, fileId);
    return { error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { error };
  }
}
