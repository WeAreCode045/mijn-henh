
export interface ContentElement {
  id: string;
  type: 'keyInfo' | 'features' | 'description' | 'images' | 'text' | 'header' | 'global';
  title: string;
  columnIndex?: number;
}

export interface Container {
  id: string;
  columns: number;
  columnWidths: number[];
  elements: ContentElement[];
}

export interface SectionDesign {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  containers: Container[];
}

export interface Section {
  id: string;
  type: 'cover' | 'details' | 'floorplans' | 'location' | 'areas' | 'contact';
  title: string;
  design: SectionDesign;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  sections: Section[];
  created_at: string;
}
