export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      collection_links: {
        Row: {
          allow_video: boolean | null
          collect_email: boolean | null
          created_at: string | null
          custom_message: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          require_rating: boolean | null
          slug: string | null
          submissions_count: number | null
          url: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          allow_video?: boolean | null
          collect_email?: boolean | null
          created_at?: string | null
          custom_message?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          require_rating?: boolean | null
          slug?: string | null
          submissions_count?: number | null
          url: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          allow_video?: boolean | null
          collect_email?: boolean | null
          created_at?: string | null
          custom_message?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          require_rating?: boolean | null
          slug?: string | null
          submissions_count?: number | null
          url?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_email: string | null
          client_name: string
          collection_link_id: string | null
          content: string
          created_at: string | null
          id: string
          rating: number | null
          source: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          client_email?: string | null
          client_name: string
          collection_link_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          rating?: number | null
          source?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          client_email?: string | null
          client_name?: string
          collection_link_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          source?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_testimonials_collection_link"
            columns: ["collection_link_id"]
            isOneToOne: false
            referencedRelation: "collection_links"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      widget_previews: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          preview_data: Json
          preview_url: string
          updated_at: string | null
          user_id: string | null
          widget_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          preview_data: Json
          preview_url: string
          updated_at?: string | null
          user_id?: string | null
          widget_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          preview_data?: Json
          preview_url?: string
          updated_at?: string | null
          user_id?: string | null
          widget_id?: string
        }
        Relationships: []
      }
      widgets: {
        Row: {
          clicks_count: number | null
          created_at: string | null
          embed_code: string
          id: string
          is_active: boolean | null
          settings: Json
          updated_at: string | null
          user_id: string
          views_count: number | null
          widget_name: string
          widget_type: string
        }
        Insert: {
          clicks_count?: number | null
          created_at?: string | null
          embed_code: string
          id?: string
          is_active?: boolean | null
          settings?: Json
          updated_at?: string | null
          user_id: string
          views_count?: number | null
          widget_name: string
          widget_type: string
        }
        Update: {
          clicks_count?: number | null
          created_at?: string | null
          embed_code?: string
          id?: string
          is_active?: boolean | null
          settings?: Json
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
          widget_name?: string
          widget_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "widgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_widget_clicks: {
        Args: { widget_id: string }
        Returns: undefined
      }
      increment_widget_views: {
        Args: { widget_id: string }
        Returns: undefined
      }
      validate_slug: {
        Args: { slug_input: string }
        Returns: boolean
      }
      validate_username: {
        Args: { username_input: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
