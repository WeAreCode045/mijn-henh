export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agency_settings: {
        Row: {
          address: string | null
          agents: Json | null
          created_at: string
          description_background_url: string | null
          email: string | null
          facebook_url: string | null
          google_maps_api_key: string | null
          icon_bathrooms: string | null
          icon_bedrooms: string | null
          icon_build_year: string | null
          icon_energy_class: string | null
          icon_garages: string | null
          icon_living_space: string | null
          icon_sqft: string | null
          id: string
          instagram_url: string | null
          logo_url: string | null
          name: string
          openai_api_key: string | null
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          smtp_from_email: string | null
          smtp_from_name: string | null
          smtp_host: string | null
          smtp_password: string | null
          smtp_port: string | null
          smtp_secure: boolean | null
          smtp_username: string | null
          updated_at: string
          xml_import_url: string | null
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          agents?: Json | null
          created_at?: string
          description_background_url?: string | null
          email?: string | null
          facebook_url?: string | null
          google_maps_api_key?: string | null
          icon_bathrooms?: string | null
          icon_bedrooms?: string | null
          icon_build_year?: string | null
          icon_energy_class?: string | null
          icon_garages?: string | null
          icon_living_space?: string | null
          icon_sqft?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          name: string
          openai_api_key?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          smtp_from_email?: string | null
          smtp_from_name?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: string | null
          smtp_secure?: boolean | null
          smtp_username?: string | null
          updated_at?: string
          xml_import_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          agents?: Json | null
          created_at?: string
          description_background_url?: string | null
          email?: string | null
          facebook_url?: string | null
          google_maps_api_key?: string | null
          icon_bathrooms?: string | null
          icon_bedrooms?: string | null
          icon_build_year?: string | null
          icon_energy_class?: string | null
          icon_garages?: string | null
          icon_living_space?: string | null
          icon_sqft?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          name?: string
          openai_api_key?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          smtp_from_email?: string | null
          smtp_from_name?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: string | null
          smtp_secure?: boolean | null
          smtp_username?: string | null
          updated_at?: string
          xml_import_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      brochure_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          sections: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          sections: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          sections?: Json
          updated_at?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          property_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          property_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          property_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agent_photo: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          agent_photo?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          agent_photo?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          agent: string | null
          agent_id: string | null
          areaPhotos: string[] | null
          areas: Json[] | null
          bathrooms: string | null
          bedrooms: string | null
          buildYear: string | null
          created_at: string
          description: string | null
          energyLabel: string | null
          features: Json | null
          floorplanEmbedScript: string | null
          garages: string | null
          hasGarden: boolean | null
          id: string
          images: Json[] | null
          latitude: number | null
          livingArea: string | null
          location_description: string | null
          longitude: number | null
          map_image: string | null
          nearby_places: Json | null
          notes: string | null
          object_id: string | null
          price: string | null
          sqft: string | null
          technicalItems: Json | null
          template_id: string | null
          title: string | null
          updated_at: string
          virtualTourUrl: string | null
          youtubeUrl: string | null
        }
        Insert: {
          address?: string | null
          agent?: string | null
          agent_id?: string | null
          areaPhotos?: string[] | null
          areas?: Json[] | null
          bathrooms?: string | null
          bedrooms?: string | null
          buildYear?: string | null
          created_at?: string
          description?: string | null
          energyLabel?: string | null
          features?: Json | null
          floorplanEmbedScript?: string | null
          garages?: string | null
          hasGarden?: boolean | null
          id?: string
          images?: Json[] | null
          latitude?: number | null
          livingArea?: string | null
          location_description?: string | null
          longitude?: number | null
          map_image?: string | null
          nearby_places?: Json | null
          notes?: string | null
          object_id?: string | null
          price?: string | null
          sqft?: string | null
          technicalItems?: Json | null
          template_id?: string | null
          title?: string | null
          updated_at?: string
          virtualTourUrl?: string | null
          youtubeUrl?: string | null
        }
        Update: {
          address?: string | null
          agent?: string | null
          agent_id?: string | null
          areaPhotos?: string[] | null
          areas?: Json[] | null
          bathrooms?: string | null
          bedrooms?: string | null
          buildYear?: string | null
          created_at?: string
          description?: string | null
          energyLabel?: string | null
          features?: Json | null
          floorplanEmbedScript?: string | null
          garages?: string | null
          hasGarden?: boolean | null
          id?: string
          images?: Json[] | null
          latitude?: number | null
          livingArea?: string | null
          location_description?: string | null
          longitude?: number | null
          map_image?: string | null
          nearby_places?: Json | null
          notes?: string | null
          object_id?: string | null
          price?: string | null
          sqft?: string | null
          technicalItems?: Json | null
          template_id?: string | null
          title?: string | null
          updated_at?: string
          virtualTourUrl?: string | null
          youtubeUrl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_contact_submissions: {
        Row: {
          agent_id: string | null
          created_at: string | null
          email: string
          id: string
          inquiry_type: string
          is_read: boolean | null
          message: string | null
          name: string
          phone: string
          property_id: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          inquiry_type: string
          is_read?: boolean | null
          message?: string | null
          name: string
          phone: string
          property_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          inquiry_type?: string
          is_read?: boolean | null
          message?: string | null
          name?: string
          phone?: string
          property_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_contact_submissions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_contact_submissions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          area: string | null
          created_at: string
          id: string
          is_featured_image: boolean | null
          is_main: boolean | null
          property_id: string | null
          sort_order: number | null
          type: string | null
          url: string
        }
        Insert: {
          area?: string | null
          created_at?: string
          id?: string
          is_featured_image?: boolean | null
          is_main?: boolean | null
          property_id?: string | null
          sort_order?: number | null
          type?: string | null
          url: string
        }
        Update: {
          area?: string | null
          created_at?: string
          id?: string
          is_featured_image?: boolean | null
          is_main?: boolean | null
          property_id?: string | null
          sort_order?: number | null
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_web_views: {
        Row: {
          created_at: string | null
          id: string
          object_id: string | null
          property_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          object_id?: string | null
          property_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          object_id?: string | null
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_web_views_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["object_id"]
          },
          {
            foreignKeyName: "property_web_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "agent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
