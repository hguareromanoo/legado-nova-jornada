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
      document_recommendations: {
        Row: {
          is_mandatory: boolean | null
          name: string
          profile_id: string
          reason: string | null
          recommendation_id: string
        }
        Insert: {
          is_mandatory?: boolean | null
          name: string
          profile_id: string
          reason?: string | null
          recommendation_id?: string
        }
        Update: {
          is_mandatory?: boolean | null
          name?: string
          profile_id?: string
          reason?: string | null
          recommendation_id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      user_status: "active" | "pending" | "inactive" | "blocked"
      user_type: "client" | "consultant" | "admin"
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
      user_status: ["active", "pending", "inactive", "blocked"],
      user_type: ["client", "consultant", "admin"],
    },
  },
} as const
