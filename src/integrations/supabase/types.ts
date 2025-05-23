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
      assets: {
        Row: {
          asset_id: string
          asset_type: Database["public"]["Enums"]["asset_type"]
          description: string
          estimated_value: number | null
          location: string | null
          notes: string | null
          ownership: string | null
          profile_id: string
        }
        Insert: {
          asset_id?: string
          asset_type: Database["public"]["Enums"]["asset_type"]
          description: string
          estimated_value?: number | null
          location?: string | null
          notes?: string | null
          ownership?: string | null
          profile_id: string
        }
        Update: {
          asset_id?: string
          asset_type?: Database["public"]["Enums"]["asset_type"]
          description?: string
          estimated_value?: number | null
          location?: string | null
          notes?: string | null
          ownership?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          completion_score_assets: number
          completion_score_family: number
          completion_score_goals: number
          completion_score_overall: number
          completion_score_personal: number
          created_at: string
          notes: string | null
          profile_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_score_assets?: number
          completion_score_family?: number
          completion_score_goals?: number
          completion_score_overall?: number
          completion_score_personal?: number
          created_at?: string
          notes?: string | null
          profile_id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_score_assets?: number
          completion_score_family?: number
          completion_score_goals?: number
          completion_score_overall?: number
          completion_score_personal?: number
          created_at?: string
          notes?: string | null
          profile_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          city: string | null
          created_at: string
          email: string | null
          growth_rate: number
          id: string
          last_update: string
          name: string
          phone: string | null
          status: string
          total_patrimony: number
        }
        Insert: {
          city?: string | null
          created_at?: string
          email?: string | null
          growth_rate?: number
          id?: string
          last_update?: string
          name: string
          phone?: string | null
          status?: string
          total_patrimony?: number
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string | null
          growth_rate?: number
          id?: string
          last_update?: string
          name?: string
          phone?: string | null
          status?: string
          total_patrimony?: number
        }
        Relationships: []
      }
      concerns: {
        Row: {
          concern_id: string
          description: string
          priority: number | null
          profile_id: string
        }
        Insert: {
          concern_id?: string
          description: string
          priority?: number | null
          profile_id: string
        }
        Update: {
          concern_id?: string
          description?: string
          priority?: number | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "concerns_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          content: string
          extracted_entities: Json | null
          message_id: string
          role: string
          session_id: string
          timestamp: string
        }
        Insert: {
          content: string
          extracted_entities?: Json | null
          message_id?: string
          role: string
          session_id: string
          timestamp?: string
        }
        Update: {
          content?: string
          extracted_entities?: Json | null
          message_id?: string
          role?: string
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      document_data: {
        Row: {
          created_at: string | null
          data_id: string
          data_key: string
          data_value: string
          profile_id: string
          recommendation_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_id?: string
          data_key: string
          data_value: string
          profile_id: string
          recommendation_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_id?: string
          data_key?: string
          data_value?: string
          profile_id?: string
          recommendation_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_data_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "document_data_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "document_recommendations"
            referencedColumns: ["recommendation_id"]
          },
        ]
      }
      document_recommendations: {
        Row: {
          alternatives: string[] | null
          category: Database["public"]["Enums"]["document_category_type"]
          created_at: string
          depends_on: string[] | null
          description: string
          document_key: string
          estimated_cost: string | null
          group_id: string | null
          how_to_obtain: string | null
          is_mandatory: boolean
          item_description: string | null
          item_index: number | null
          item_type: string | null
          name: string
          priority: number
          processing_time: string | null
          profile_id: string
          reason: string | null
          recommendation_id: string
          related_to: string | null
          updated_at: string
        }
        Insert: {
          alternatives?: string[] | null
          category: Database["public"]["Enums"]["document_category_type"]
          created_at?: string
          depends_on?: string[] | null
          description: string
          document_key: string
          estimated_cost?: string | null
          group_id?: string | null
          how_to_obtain?: string | null
          is_mandatory?: boolean
          item_description?: string | null
          item_index?: number | null
          item_type?: string | null
          name: string
          priority?: number
          processing_time?: string | null
          profile_id: string
          reason?: string | null
          recommendation_id?: string
          related_to?: string | null
          updated_at?: string
        }
        Update: {
          alternatives?: string[] | null
          category?: Database["public"]["Enums"]["document_category_type"]
          created_at?: string
          depends_on?: string[] | null
          description?: string
          document_key?: string
          estimated_cost?: string | null
          group_id?: string | null
          how_to_obtain?: string | null
          is_mandatory?: boolean
          item_description?: string | null
          item_index?: number | null
          item_type?: string | null
          name?: string
          priority?: number
          processing_time?: string | null
          profile_id?: string
          reason?: string | null
          recommendation_id?: string
          related_to?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_recommendations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      document_roadmap: {
        Row: {
          category: string
          created_at: string
          description: string
          document_key: string
          estimated_cost: string | null
          group_id: string | null
          how_to_obtain: string | null
          id: string
          is_mandatory: boolean
          item_description: string | null
          item_index: number | null
          item_type: string | null
          name: string
          priority: number
          processing_time: string | null
          reason: string | null
          recommendation_id: string
          related_to: string | null
          sent: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          document_key: string
          estimated_cost?: string | null
          group_id?: string | null
          how_to_obtain?: string | null
          id?: string
          is_mandatory?: boolean
          item_description?: string | null
          item_index?: number | null
          item_type?: string | null
          name: string
          priority?: number
          processing_time?: string | null
          reason?: string | null
          recommendation_id: string
          related_to?: string | null
          sent?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          document_key?: string
          estimated_cost?: string | null
          group_id?: string | null
          how_to_obtain?: string | null
          id?: string
          is_mandatory?: boolean
          item_description?: string | null
          item_index?: number | null
          item_type?: string | null
          name?: string
          priority?: number
          processing_time?: string | null
          reason?: string | null
          recommendation_id?: string
          related_to?: string | null
          sent?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          bucket_name: string
          created_at: string | null
          document_id: string
          document_key: string | null
          file_data: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          object_key: string
          recommendation_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bucket_name: string
          created_at?: string | null
          document_id?: string
          document_key?: string | null
          file_data?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          object_key: string
          recommendation_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bucket_name?: string
          created_at?: string | null
          document_id?: string
          document_key?: string | null
          file_data?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          object_key?: string
          recommendation_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "document_recommendations"
            referencedColumns: ["recommendation_id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          age: number | null
          is_dependent: boolean | null
          member_id: string
          name: string | null
          profile_id: string
          relation: string
        }
        Insert: {
          age?: number | null
          is_dependent?: boolean | null
          member_id?: string
          name?: string | null
          profile_id: string
          relation: string
        }
        Update: {
          age?: number | null
          is_dependent?: boolean | null
          member_id?: string
          name?: string | null
          profile_id?: string
          relation?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      goals: {
        Row: {
          description: string
          goal_id: string
          goal_type: Database["public"]["Enums"]["goal_type"]
          priority: number | null
          profile_id: string
        }
        Insert: {
          description: string
          goal_id?: string
          goal_type: Database["public"]["Enums"]["goal_type"]
          priority?: number | null
          profile_id: string
        }
        Update: {
          description?: string
          goal_id?: string
          goal_type?: Database["public"]["Enums"]["goal_type"]
          priority?: number | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      personal_info: {
        Row: {
          age: number | null
          marital_status:
            | Database["public"]["Enums"]["marital_status_type"]
            | null
          name: string | null
          personal_info_id: string
          profession: string | null
          profile_id: string
        }
        Insert: {
          age?: number | null
          marital_status?:
            | Database["public"]["Enums"]["marital_status_type"]
            | null
          name?: string | null
          personal_info_id?: string
          profession?: string | null
          profile_id: string
        }
        Update: {
          age?: number | null
          marital_status?:
            | Database["public"]["Enums"]["marital_status_type"]
            | null
          name?: string | null
          personal_info_id?: string
          profession?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_info_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "client_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      sessions: {
        Row: {
          completion_percentage: number
          created_at: string
          current_step: string | null
          is_active: boolean
          is_complete: boolean
          last_page: string | null
          profile_id: string
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_percentage?: number
          created_at?: string
          current_step?: string | null
          is_active?: boolean
          is_complete?: boolean
          last_page?: string | null
          profile_id: string
          session_id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_percentage?: number
          created_at?: string
          current_step?: string | null
          is_active?: boolean
          is_complete?: boolean
          last_page?: string | null
          profile_id?: string
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_document_data_grouped_by_document_key: {
        Args: { p_profile_id: string }
        Returns: {
          document_key: string
          data: Json
        }[]
      }
      search_documents_text: {
        Args: { query_text: string; user_id: string; limit_count?: number }
        Returns: {
          document_id: number
          content_chunk: string
          rank: number
          metadata: Json
        }[]
      }
    }
    Enums: {
      asset_type:
        | "imóvel"
        | "empresa"
        | "investimento financeiro"
        | "propriedade rural"
        | "outro"
      document_category_type:
        | "pessoal"
        | "familiar"
        | "imovel"
        | "veiculo"
        | "empresa"
        | "financeiro"
        | "juridico"
        | "tributario"
        | "rural"
      goal_type:
        | "sucessão familiar"
        | "otimização fiscal"
        | "proteção patrimonial"
        | "governança familiar"
        | "outro"
      marital_status_type:
        | "solteiro"
        | "casado"
        | "divorciado"
        | "viúvo"
        | "união estável"
        | "outro"
      user_role: "consultant" | "client"
      user_status: "active" | "pending" | "inactive" | "blocked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      asset_type: [
        "imóvel",
        "empresa",
        "investimento financeiro",
        "propriedade rural",
        "outro",
      ],
      document_category_type: [
        "pessoal",
        "familiar",
        "imovel",
        "veiculo",
        "empresa",
        "financeiro",
        "juridico",
        "tributario",
        "rural",
      ],
      goal_type: [
        "sucessão familiar",
        "otimização fiscal",
        "proteção patrimonial",
        "governança familiar",
        "outro",
      ],
      marital_status_type: [
        "solteiro",
        "casado",
        "divorciado",
        "viúvo",
        "união estável",
        "outro",
      ],
      user_role: ["consultant", "client"],
      user_status: ["active", "pending", "inactive", "blocked"],
    },
  },
} as const
