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
          asset_id: number
          asset_type: Database["public"]["Enums"]["asset_type"]
          description: string
          estimated_value: number | null
          location: string | null
          notes: string | null
          ownership: string | null
          profile_id: string
        }
        Insert: {
          asset_id?: number
          asset_type: Database["public"]["Enums"]["asset_type"]
          description: string
          estimated_value?: number | null
          location?: string | null
          notes?: string | null
          ownership?: string | null
          profile_id: string
        }
        Update: {
          asset_id?: number
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
          completion_score_assets: number | null
          completion_score_family: number | null
          completion_score_goals: number | null
          completion_score_overall: number | null
          completion_score_personal: number | null
          created_at: string | null
          notes: string | null
          profile_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completion_score_assets?: number | null
          completion_score_family?: number | null
          completion_score_goals?: number | null
          completion_score_overall?: number | null
          completion_score_personal?: number | null
          created_at?: string | null
          notes?: string | null
          profile_id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completion_score_assets?: number | null
          completion_score_family?: number | null
          completion_score_goals?: number | null
          completion_score_overall?: number | null
          completion_score_personal?: number | null
          created_at?: string | null
          notes?: string | null
          profile_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      concerns: {
        Row: {
          concern_id: number
          description: string
          priority: number | null
          profile_id: string
        }
        Insert: {
          concern_id?: number
          description: string
          priority?: number | null
          profile_id: string
        }
        Update: {
          concern_id?: number
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
      consultant_clients: {
        Row: {
          assignment_date: string | null
          client_id: string
          consultant_id: string
          last_interaction: string | null
          notes: string | null
          relation_id: number
          relationship_status: string | null
        }
        Insert: {
          assignment_date?: string | null
          client_id: string
          consultant_id: string
          last_interaction?: string | null
          notes?: string | null
          relation_id?: number
          relationship_status?: string | null
        }
        Update: {
          assignment_date?: string | null
          client_id?: string
          consultant_id?: string
          last_interaction?: string | null
          notes?: string | null
          relation_id?: number
          relationship_status?: string | null
        }
        Relationships: []
      }
      consultation_appointments: {
        Row: {
          appointment_id: number
          appointment_type: string
          client_id: string
          consultant_id: string
          duration_minutes: number | null
          meeting_link: string | null
          notes: string | null
          scheduled_datetime: string
          status: string | null
        }
        Insert: {
          appointment_id?: number
          appointment_type: string
          client_id: string
          consultant_id: string
          duration_minutes?: number | null
          meeting_link?: string | null
          notes?: string | null
          scheduled_datetime: string
          status?: string | null
        }
        Update: {
          appointment_id?: number
          appointment_type?: string
          client_id?: string
          consultant_id?: string
          duration_minutes?: number | null
          meeting_link?: string | null
          notes?: string | null
          scheduled_datetime?: string
          status?: string | null
        }
        Relationships: []
      }
      conversation_messages: {
        Row: {
          content: string
          extracted_entities: Json | null
          message_id: string
          role: string
          session_id: string
          timestamp: string | null
        }
        Insert: {
          content: string
          extracted_entities?: Json | null
          message_id?: string
          role: string
          session_id: string
          timestamp?: string | null
        }
        Update: {
          content?: string
          extracted_entities?: Json | null
          message_id?: string
          role?: string
          session_id?: string
          timestamp?: string | null
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
          confidence_score: number | null
          data_id: number
          data_type: string
          document_id: number
          extracted_data: Json
          extraction_date: string | null
          verification_date: string | null
          verified_by: string | null
        }
        Insert: {
          confidence_score?: number | null
          data_id?: number
          data_type: string
          document_id: number
          extracted_data: Json
          extraction_date?: string | null
          verification_date?: string | null
          verified_by?: string | null
        }
        Update: {
          confidence_score?: number | null
          data_id?: number
          data_type?: string
          document_id?: number
          extracted_data?: Json
          extraction_date?: string | null
          verification_date?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_data_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["document_id"]
          },
        ]
      }
      document_recommendations: {
        Row: {
          is_mandatory: boolean | null
          name: string
          profile_id: string
          reason: string | null
          recommendation_id: number
        }
        Insert: {
          is_mandatory?: boolean | null
          name: string
          profile_id: string
          reason?: string | null
          recommendation_id?: number
        }
        Update: {
          is_mandatory?: boolean | null
          name?: string
          profile_id?: string
          reason?: string | null
          recommendation_id?: number
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
      document_searchable_content: {
        Row: {
          chunk_index: number
          content_chunk: string
          content_id: number
          created_at: string | null
          document_id: number
          keywords: string[] | null
          metadata: Json | null
        }
        Insert: {
          chunk_index: number
          content_chunk: string
          content_id?: number
          created_at?: string | null
          document_id: number
          keywords?: string[] | null
          metadata?: Json | null
        }
        Update: {
          chunk_index?: number
          content_chunk?: string
          content_id?: number
          created_at?: string | null
          document_id?: number
          keywords?: string[] | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_searchable_content_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["document_id"]
          },
        ]
      }
      documents: {
        Row: {
          document_id: number
          document_name: string
          document_type: string
          file_path: string
          is_verified: boolean | null
          metadata: Json | null
          processing_notes: string | null
          status: string | null
          upload_date: string | null
          user_id: string
        }
        Insert: {
          document_id?: number
          document_name: string
          document_type: string
          file_path: string
          is_verified?: boolean | null
          metadata?: Json | null
          processing_notes?: string | null
          status?: string | null
          upload_date?: string | null
          user_id: string
        }
        Update: {
          document_id?: number
          document_name?: string
          document_type?: string
          file_path?: string
          is_verified?: boolean | null
          metadata?: Json | null
          processing_notes?: string | null
          status?: string | null
          upload_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          age: number | null
          is_dependent: boolean | null
          member_id: number
          name: string
          profile_id: string
          relation: string
        }
        Insert: {
          age?: number | null
          is_dependent?: boolean | null
          member_id?: number
          name: string
          profile_id: string
          relation: string
        }
        Update: {
          age?: number | null
          is_dependent?: boolean | null
          member_id?: number
          name?: string
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
          goal_id: number
          goal_type: Database["public"]["Enums"]["goal_type"]
          priority: number | null
          profile_id: string
        }
        Insert: {
          description: string
          goal_id?: number
          goal_type: Database["public"]["Enums"]["goal_type"]
          priority?: number | null
          profile_id: string
        }
        Update: {
          description?: string
          goal_id?: number
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
      holding_structures: {
        Row: {
          approved_by_user: boolean | null
          corporate_form: string
          created_at: string | null
          estimated_costs: Json | null
          governance_model: string | null
          implementation_status: string | null
          recommended_capital: number | null
          structure_id: number
          structure_type: string
          tax_regime: string | null
          user_id: string
        }
        Insert: {
          approved_by_user?: boolean | null
          corporate_form: string
          created_at?: string | null
          estimated_costs?: Json | null
          governance_model?: string | null
          implementation_status?: string | null
          recommended_capital?: number | null
          structure_id?: number
          structure_type: string
          tax_regime?: string | null
          user_id: string
        }
        Update: {
          approved_by_user?: boolean | null
          corporate_form?: string
          created_at?: string | null
          estimated_costs?: Json | null
          governance_model?: string | null
          implementation_status?: string | null
          recommended_capital?: number | null
          structure_id?: number
          structure_type?: string
          tax_regime?: string | null
          user_id?: string
        }
        Relationships: []
      }
      personal_info: {
        Row: {
          age: number | null
          marital_status:
            | Database["public"]["Enums"]["marital_status_type"]
            | null
          name: string
          personal_info_id: number
          profession: string | null
          profile_id: string
        }
        Insert: {
          age?: number | null
          marital_status?:
            | Database["public"]["Enums"]["marital_status_type"]
            | null
          name: string
          personal_info_id?: number
          profession?: string | null
          profile_id: string
        }
        Update: {
          age?: number | null
          marital_status?:
            | Database["public"]["Enums"]["marital_status_type"]
            | null
          name?: string
          personal_info_id?: number
          profession?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_info_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      roadmap_items: {
        Row: {
          deadline: string | null
          dependency_item_id: number | null
          description: string
          document_type: string
          instructions: string | null
          is_required: boolean | null
          priority: number | null
          roadmap_item_id: number
          status: string | null
          user_id: string
        }
        Insert: {
          deadline?: string | null
          dependency_item_id?: number | null
          description: string
          document_type: string
          instructions?: string | null
          is_required?: boolean | null
          priority?: number | null
          roadmap_item_id?: number
          status?: string | null
          user_id: string
        }
        Update: {
          deadline?: string | null
          dependency_item_id?: number | null
          description?: string
          document_type?: string
          instructions?: string | null
          is_required?: boolean | null
          priority?: number | null
          roadmap_item_id?: number
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_items_dependency_item_id_fkey"
            columns: ["dependency_item_id"]
            isOneToOne: false
            referencedRelation: "roadmap_items"
            referencedColumns: ["roadmap_item_id"]
          },
        ]
      }
      sessions: {
        Row: {
          completion_percentage: number | null
          created_at: string | null
          current_step: string | null
          is_active: boolean | null
          is_complete: boolean | null
          last_page: string | null
          profile_id: string | null
          session_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string | null
          current_step?: string | null
          is_active?: boolean | null
          is_complete?: boolean | null
          last_page?: string | null
          profile_id?: string | null
          session_id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string | null
          current_step?: string | null
          is_active?: boolean | null
          is_complete?: boolean | null
          last_page?: string | null
          profile_id?: string | null
          session_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_client_profile: {
        Args: {
          user_id: string
          first_name: string
          last_name: string
          phone: string
          marital_status: Database["public"]["Enums"]["marital_status_type"]
          age: number
          profession: string
        }
        Returns: string
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
        | "real_estate"
        | "company"
        | "financial_investment"
        | "vehicle"
        | "other"
      goal_type:
        | "tax_optimization"
        | "succession_planning"
        | "asset_protection"
        | "family_governance"
        | "business_structuring"
        | "other"
      marital_status_type:
        | "single"
        | "married"
        | "divorced"
        | "widowed"
        | "separated"
        | "stable_union"
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
        "real_estate",
        "company",
        "financial_investment",
        "vehicle",
        "other",
      ],
      goal_type: [
        "tax_optimization",
        "succession_planning",
        "asset_protection",
        "family_governance",
        "business_structuring",
        "other",
      ],
      marital_status_type: [
        "single",
        "married",
        "divorced",
        "widowed",
        "separated",
        "stable_union",
      ],
      user_status: ["active", "pending", "inactive", "blocked"],
      user_type: ["client", "consultant", "admin"],
    },
  },
} as const
