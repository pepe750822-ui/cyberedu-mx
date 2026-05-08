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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ai_agent_tasks: {
        Row: {
          completed_at: string | null
          context: Json | null
          created_at: string
          error_msg: string | null
          id: string
          memory: Json | null
          priority: Database["public"]["Enums"]["agent_task_priority"]
          prompt: string
          result: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["agent_task_status"]
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          context?: Json | null
          created_at?: string
          error_msg?: string | null
          id?: string
          memory?: Json | null
          priority?: Database["public"]["Enums"]["agent_task_priority"]
          prompt: string
          result?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["agent_task_status"]
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          context?: Json | null
          created_at?: string
          error_msg?: string | null
          id?: string
          memory?: Json | null
          priority?: Database["public"]["Enums"]["agent_task_priority"]
          prompt?: string
          result?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["agent_task_status"]
          user_id?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          type: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          type?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          type?: string | null
        }
        Relationships: []
      }
      daily_usage: {
        Row: {
          count: number
          date: string
          id: string
          user_id: string
        }
        Insert: {
          count?: number
          date: string
          id?: string
          user_id: string
        }
        Update: {
          count?: number
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          back: string
          created_at: string | null
          difficulty: string | null
          front: string
          id: string
          tags: string[] | null
          updated_at: string | null
          video_id: string
        }
        Insert: {
          back: string
          created_at?: string | null
          difficulty?: string | null
          front: string
          id?: string
          tags?: string[] | null
          updated_at?: string | null
          video_id: string
        }
        Update: {
          back?: string
          created_at?: string | null
          difficulty?: string | null
          front?: string
          id?: string
          tags?: string[] | null
          updated_at?: string | null
          video_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          area_of_interest: string[] | null
          avatar_url: string | null
          created_at: string
          daily_questions_count: number | null
          email: string | null
          id: string
          is_premium: boolean | null
          last_daily_free: string | null
          marketing_opt_in: boolean | null
          name: string | null
          newsletter_opt_in: boolean | null
          onboarding_completed: boolean | null
          provider: string | null
          subscription_status: string | null
          tokens: number | null
          trial_started_at: string | null
          trial_used: boolean | null
          updated_at: string
          weekly_reminders: boolean | null
        }
        Insert: {
          area_of_interest?: string[] | null
          avatar_url?: string | null
          created_at?: string
          daily_questions_count?: number | null
          email?: string | null
          id: string
          is_premium?: boolean | null
          last_daily_free?: string | null
          marketing_opt_in?: boolean | null
          name?: string | null
          newsletter_opt_in?: boolean | null
          onboarding_completed?: boolean | null
          provider?: string | null
          subscription_status?: string | null
          tokens?: number | null
          trial_started_at?: string | null
          trial_used?: boolean | null
          updated_at?: string
          weekly_reminders?: boolean | null
        }
        Update: {
          area_of_interest?: string[] | null
          avatar_url?: string | null
          created_at?: string
          daily_questions_count?: number | null
          email?: string | null
          id?: string
          is_premium?: boolean | null
          last_daily_free?: string | null
          marketing_opt_in?: boolean | null
          name?: string | null
          newsletter_opt_in?: boolean | null
          onboarding_completed?: boolean | null
          provider?: string | null
          subscription_status?: string | null
          tokens?: number | null
          trial_started_at?: string | null
          trial_used?: boolean | null
          updated_at?: string
          weekly_reminders?: boolean | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          subscription: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          subscription: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          subscription?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          created_at: string | null
          id: string
          questions: Json
          title: string | null
          updated_at: string | null
          video_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          questions: Json
          title?: string | null
          updated_at?: string | null
          video_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          questions?: Json
          title?: string | null
          updated_at?: string | null
          video_id?: string
        }
        Relationships: []
      }
      simulador_results: {
        Row: {
          aciertos: number | null
          banco: string | null
          created_at: string | null
          escuela_meta: string | null
          fecha: string | null
          id: string
          modo: string | null
          porcentaje: number | null
          puntaje_meta: number | null
          resultados_por_area: Json | null
          total_preguntas: number | null
          user_id: string | null
        }
        Insert: {
          aciertos?: number | null
          banco?: string | null
          created_at?: string | null
          escuela_meta?: string | null
          fecha?: string | null
          id?: string
          modo?: string | null
          porcentaje?: number | null
          puntaje_meta?: number | null
          resultados_por_area?: Json | null
          total_preguntas?: number | null
          user_id?: string | null
        }
        Update: {
          aciertos?: number | null
          banco?: string | null
          created_at?: string | null
          escuela_meta?: string | null
          fecha?: string | null
          id?: string
          modo?: string | null
          porcentaje?: number | null
          puntaje_meta?: number | null
          resultados_por_area?: Json | null
          total_preguntas?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sim_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_broadcast_log: {
        Row: {
          chat_id: string
          id: string
          message_preview: string | null
          message_type: string
          sent_at: string
          success: boolean
        }
        Insert: {
          chat_id: string
          id?: string
          message_preview?: string | null
          message_type: string
          sent_at?: string
          success?: boolean
        }
        Update: {
          chat_id?: string
          id?: string
          message_preview?: string | null
          message_type?: string
          sent_at?: string
          success?: boolean
        }
        Relationships: []
      }
      telegram_guest_usage: {
        Row: {
          chat_id: string
          id: string
          questions_count: number | null
          usage_date: string | null
        }
        Insert: {
          chat_id: string
          id?: string
          questions_count?: number | null
          usage_date?: string | null
        }
        Update: {
          chat_id?: string
          id?: string
          questions_count?: number | null
          usage_date?: string | null
        }
        Relationships: []
      }
      telegram_leads: {
        Row: {
          chat_id: string
          created_at: string | null
          first_name: string | null
          id: string
          last_message: string | null
          messages_count: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          chat_id: string
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_message?: string | null
          messages_count?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          chat_id?: string
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_message?: string | null
          messages_count?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      telegram_sequences: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          scheduled_at: string
          sent_at: string | null
          sequence_type: string
          step: number
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          scheduled_at: string
          sent_at?: string | null
          sequence_type: string
          step?: number
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          scheduled_at?: string
          sent_at?: string | null
          sequence_type?: string
          step?: number
        }
        Relationships: []
      }
      telegram_users: {
        Row: {
          blocked: boolean | null
          chat_id: string
          created_at: string | null
          first_name: string | null
          id: string
          last_user_message_at: string | null
          linked_at: string | null
          linking_code: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          blocked?: boolean | null
          chat_id: string
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_user_message_at?: string | null
          linked_at?: string | null
          linking_code?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          blocked?: boolean | null
          chat_id?: string
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_user_message_at?: string | null
          linked_at?: string | null
          linking_code?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telegram_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_leads: {
        Row: {
          created_at: string | null
          id: string
          last_message: string | null
          messages_count: number | null
          phone_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message?: string | null
          messages_count?: number | null
          phone_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message?: string | null
          messages_count?: number | null
          phone_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      agent_task_priority: "alta" | "media" | "baja"
      agent_task_status: "queued" | "running" | "done" | "error"
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      agent_task_priority: ["alta", "media", "baja"],
      agent_task_status: ["queued", "running", "done", "error"],
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
