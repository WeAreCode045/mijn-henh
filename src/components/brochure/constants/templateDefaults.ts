
import { ContentElement, Section } from "../types/templateTypes";

export const globalElements: ContentElement[] = [
  { id: 'gh1', type: 'global', title: 'Header' },
  { id: 'gf1', type: 'global', title: 'Footer' },
  { id: 'gp1', type: 'global', title: 'Price' },
  { id: 'gt1', type: 'global', title: 'Property Title' },
  { id: 'gi1', type: 'global', title: 'Featured Image' }
];

export const defaultContentElements: Record<string, ContentElement[]> = {
  details: [
    { id: 'ke1', type: 'keyInfo', title: 'Key Information' },
    { id: 'fe1', type: 'features', title: 'Features' },
    { id: 'de1', type: 'description', title: 'Description' }
  ],
  cover: [
    { id: 'hi1', type: 'header', title: 'Header' },
    { id: 'im1', type: 'images', title: 'Images' }
  ],
  floorplans: [
    { id: 'fp1', type: 'images', title: 'Floorplan Images' },
    { id: 'fd1', type: 'text', title: 'Floorplan Description' }
  ],
  location: [
    { id: 'mp1', type: 'images', title: 'Map' },
    { id: 'ld1', type: 'text', title: 'Location Description' },
    { id: 'np1', type: 'text', title: 'Nearby Places' }
  ],
  areas: [
    { id: 'ai1', type: 'images', title: 'Area Images' },
    { id: 'ad1', type: 'text', title: 'Area Description' }
  ],
  contact: [
    { id: 'cf1', type: 'text', title: 'Contact Form' },
    { id: 'ci1', type: 'images', title: 'Agent Image' },
    { id: 'cd1', type: 'text', title: 'Contact Details' }
  ]
};

export const defaultSections: Section[] = [
  { 
    id: '1', 
    type: 'cover', 
    title: 'Cover Page', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '2', 
    type: 'details', 
    title: 'Property Details', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '3', 
    type: 'floorplans', 
    title: 'Floorplans', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '4', 
    type: 'location', 
    title: 'Location', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '5', 
    type: 'areas', 
    title: 'Areas', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  },
  { 
    id: '6', 
    type: 'contact', 
    title: 'Contact', 
    design: { 
      padding: '2rem',
      containers: [] 
    } 
  }
];
