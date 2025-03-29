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
          global_features: Json | null
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
          global_features?: Json | null
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
          global_features?: Json | null
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
      profiles: {
        Row: {
          avatar_url: string | null
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
          avatar_url?: string | null
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
          avatar_url?: string | null
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
          agent_id: string | null
          archived: boolean
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
          generalInfo: Json | null
          hasGarden: boolean | null
          id: string
          latitude: number | null
          livingArea: string | null
          location_description: string | null
          longitude: number | null
          map_image: string | null
          metadata: Json | null
          nearby_cities: Json | null
          nearby_places: Json | null
          notes: string | null
          object_id: string | null
          price: string | null
          propertyType: string | null
          shortDescription: string | null
          sqft: string | null
          status: string | null
          title: string | null
          updated_at: string
          virtualTourUrl: string | null
          youtubeUrl: string | null
        }
        Insert: {
          address?: string | null
          agent_id?: string | null
          archived?: boolean
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
          generalInfo?: Json | null
          hasGarden?: boolean | null
          id?: string
          latitude?: number | null
          livingArea?: string | null
          location_description?: string | null
          longitude?: number | null
          map_image?: string | null
          metadata?: Json | null
          nearby_cities?: Json | null
          nearby_places?: Json | null
          notes?: string | null
          object_id?: string | null
          price?: string | null
          propertyType?: string | null
          shortDescription?: string | null
          sqft?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          virtualTourUrl?: string | null
          youtubeUrl?: string | null
        }
        Update: {
          address?: string | null
          agent_id?: string | null
          archived?: boolean
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
          generalInfo?: Json | null
          hasGarden?: boolean | null
          id?: string
          latitude?: number | null
          livingArea?: string | null
          location_description?: string | null
          longitude?: number | null
          map_image?: string | null
          metadata?: Json | null
          nearby_cities?: Json | null
          nearby_places?: Json | null
          notes?: string | null
          object_id?: string | null
          price?: string | null
          propertyType?: string | null
          shortDescription?: string | null
          sqft?: string | null
          status?: string | null
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
      property_agenda_items: {
        Row: {
          additional_users: Json | null
          agent_id: string
          created_at: string
          description: string | null
          end_date: string | null
          end_time: string | null
          event_date: string
          event_time: string
          id: string
          property_id: string
          title: string
          updated_at: string
        }
        Insert: {
          additional_users?: Json | null
          agent_id: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          event_date: string
          event_time: string
          id?: string
          property_id: string
          title: string
          updated_at?: string
        }
        Update: {
          additional_users?: Json | null
          agent_id?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          event_date?: string
          event_time?: string
          id?: string
          property_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_agenda_items_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_agenda_items_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
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
      property_edit_logs: {
        Row: {
          created_at: string
          field_name: string
          id: string
          new_value: string | null
          old_value: string | null
          property_id: string
          user_id: string
          user_name: string | null
        }
        Insert: {
          created_at?: string
          field_name: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          property_id: string
          user_id: string
          user_name?: string | null
        }
        Update: {
          created_at?: string
          field_name?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          property_id?: string
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_edit_logs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_features: {
        Row: {
          created_at: string
          description: string
          id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
        }
        Relationships: []
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
      property_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          property_id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          property_id: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          property_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_notes_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_submission_replies: {
        Row: {
          agent_id: string | null
          created_at: string
          id: string
          reply_text: string
          submission_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          id?: string
          reply_text: string
          submission_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          id?: string
          reply_text?: string
          submission_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_submission_replies_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "property_contact_submissions"
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
      todo_items: {
        Row: {
          assigned_to_id: string | null
          completed: boolean
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          notification_sent: boolean | null
          notify_at: string | null
          property_id: string | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to_id?: string | null
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notification_sent?: boolean | null
          notify_at?: string | null
          property_id?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to_id?: string | null
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notification_sent?: boolean | null
          notify_at?: string | null
          property_id?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_items_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_items_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
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
