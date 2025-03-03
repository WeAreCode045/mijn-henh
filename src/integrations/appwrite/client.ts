
import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Appwrite configuration
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1'; // Replace with your Appwrite endpoint
const APPWRITE_PROJECT_ID = 'your-project-id'; // Replace with your Appwrite project ID

// Initialize the Appwrite client
export const appwriteClient = new Client();

appwriteClient
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize Appwrite services
export const appwriteAccount = new Account(appwriteClient);
export const appwriteDatabases = new Databases(appwriteClient);
export const appwriteStorage = new Storage(appwriteClient);
export const appwriteFunctions = new Functions(appwriteClient);

// Database configuration
export const DATABASE_ID = 'your-database-id'; // Replace with your Appwrite database ID

// Collections configuration (equivalent to Supabase tables)
export const COLLECTIONS = {
  PROPERTIES: 'properties',
  PROFILES: 'profiles',
  PROPERTY_IMAGES: 'property_images',
  AGENCY_SETTINGS: 'agency_settings',
  PROPERTY_CONTACT_SUBMISSIONS: 'property_contact_submissions'
};

// Storage buckets configuration
export const BUCKETS = {
  PROPERTIES: 'properties',
  AGENCY: 'agency'
};
