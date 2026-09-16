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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      availability_exceptions: {
        Row: {
          created_at: string
          date: string
          end_time: string | null
          id: string
          is_unavailable: boolean
          reason: string | null
          start_time: string | null
        }
        Insert: {
          created_at?: string
          date: string
          end_time?: string | null
          id?: string
          is_unavailable?: boolean
          reason?: string | null
          start_time?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string | null
          id?: string
          is_unavailable?: boolean
          reason?: string | null
          start_time?: string | null
        }
        Relationships: []
      }
      availability_rules: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          session_id: string | null
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          session_id?: string | null
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          session_id?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_rules_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_history: {
        Row: {
          booking_id: string | null
          changed_by: string | null
          created_at: string
          id: string
          new_payment_status: string | null
          new_status: string | null
          old_payment_status: string | null
          old_status: string | null
          reason: string | null
        }
        Insert: {
          booking_id?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_payment_status?: string | null
          new_status?: string | null
          old_payment_status?: string | null
          old_status?: string | null
          reason?: string | null
        }
        Update: {
          booking_id?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_payment_status?: string | null
          new_status?: string | null
          old_payment_status?: string | null
          old_status?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_history_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          admin_notes: string | null
          appointment_date: string
          booking_reference: string
          cancel_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          client_id: string
          client_notes: string | null
          created_at: string
          end_time: string
          id: string
          payment_method_note: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          session_id: string
          slot_count: number
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          appointment_date: string
          booking_reference: string
          cancel_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_id: string
          client_notes?: string | null
          created_at?: string
          end_time: string
          id?: string
          payment_method_note?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          session_id: string
          slot_count?: number
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          appointment_date?: string
          booking_reference?: string
          cancel_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_id?: string
          client_notes?: string | null
          created_at?: string
          end_time?: string
          id?: string
          payment_method_note?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          session_id?: string
          slot_count?: number
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_settings: {
        Row: {
          advance_booking_days: number
          booking_buffer_minutes: number
          cancellation_notice_hours: number
          clinic_address: string
          clinic_email: string
          clinic_name: string
          clinic_phone: string
          clinic_tagline: string | null
          created_at: string
          currency: string
          currency_symbol: string
          email_notifications_enabled: boolean
          id: string
          slot_interval_minutes: number
          sms_notifications_enabled: boolean
          timezone: string
          updated_at: string
        }
        Insert: {
          advance_booking_days?: number
          booking_buffer_minutes?: number
          cancellation_notice_hours?: number
          clinic_address?: string
          clinic_email?: string
          clinic_name?: string
          clinic_phone?: string
          clinic_tagline?: string | null
          created_at?: string
          currency?: string
          currency_symbol?: string
          email_notifications_enabled?: boolean
          id?: string
          slot_interval_minutes?: number
          sms_notifications_enabled?: boolean
          timezone?: string
          updated_at?: string
        }
        Update: {
          advance_booking_days?: number
          booking_buffer_minutes?: number
          cancellation_notice_hours?: number
          clinic_address?: string
          clinic_email?: string
          clinic_name?: string
          clinic_phone?: string
          clinic_tagline?: string | null
          created_at?: string
          currency?: string
          currency_symbol?: string
          email_notifications_enabled?: boolean
          id?: string
          slot_interval_minutes?: number
          sms_notifications_enabled?: boolean
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      clinical_treatment_records: {
        Row: {
          after_photo_url: string | null
          aftercare_instructions_sent: boolean | null
          before_photo_url: string | null
          booking_id: string | null
          client_id: string | null
          clinical_notes: string | null
          created_at: string
          id: string
          practitioner_id: string | null
          updated_at: string
        }
        Insert: {
          after_photo_url?: string | null
          aftercare_instructions_sent?: boolean | null
          before_photo_url?: string | null
          booking_id?: string | null
          client_id?: string | null
          clinical_notes?: string | null
          created_at?: string
          id?: string
          practitioner_id?: string | null
          updated_at?: string
        }
        Update: {
          after_photo_url?: string | null
          aftercare_instructions_sent?: boolean | null
          before_photo_url?: string | null
          booking_id?: string | null
          client_id?: string | null
          clinical_notes?: string | null
          created_at?: string
          id?: string
          practitioner_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_treatment_records_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_treatment_records_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_treatment_records_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          avatar_url: string | null
          ban_reason: string | null
          banned_at: string | null
          banned_by: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          id: string
          last_name: string | null
          medical_allergies: string | null
          phone: string | null
          postal_code: string | null
          role: Database["public"]["Enums"]["user_role"]
          state: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          avatar_url?: string | null
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          medical_allergies?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          avatar_url?: string | null
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          medical_allergies?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_banned_by_fkey"
            columns: ["banned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_history: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          change_summary: string | null
          changed_by: string | null
          created_at: string
          diff_snapshot: Json | null
          id: string
          session_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          change_summary?: string | null
          changed_by?: string | null
          created_at?: string
          diff_snapshot?: Json | null
          id?: string
          session_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          change_summary?: string | null
          changed_by?: string | null
          created_at?: string
          diff_snapshot?: Json | null
          id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_types: {
        Row: {
          buffer_minutes: number
          capacity: number | null
          created_at: string
          default_duration_minutes: number
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          buffer_minutes?: number
          capacity?: number | null
          created_at?: string
          default_duration_minutes?: number
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          buffer_minutes?: number
          capacity?: number | null
          created_at?: string
          default_duration_minutes?: number
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          active_from: string | null
          active_until: string | null
          benefits: string[] | null
          cancel_reason: string | null
          cancelled_at: string | null
          created_at: string
          currency: string
          description: string | null
          duration_minutes: number
          id: string
          image_url: string | null
          is_ongoing: boolean
          location: string | null
          max_slots: number
          pricing: number
          session_type_id: string | null
          slug: string
          status: Database["public"]["Enums"]["session_status"]
          title: string
          updated_at: string
        }
        Insert: {
          active_from?: string | null
          active_until?: string | null
          benefits?: string[] | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          image_url?: string | null
          is_ongoing?: boolean
          location?: string | null
          max_slots?: number
          pricing?: number
          session_type_id?: string | null
          slug: string
          status?: Database["public"]["Enums"]["session_status"]
          title: string
          updated_at?: string
        }
        Update: {
          active_from?: string | null
          active_until?: string | null
          benefits?: string[] | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          image_url?: string | null
          is_ongoing?: boolean
          location?: string | null
          max_slots?: number
          pricing?: number
          session_type_id?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["session_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_session_type_id_fkey"
            columns: ["session_type_id"]
            isOneToOne: false
            referencedRelation: "session_types"
            referencedColumns: ["id"]
          },
        ]
      }
      user_login_history: {
        Row: {
          auth_method: string | null
          created_at: string
          id: string
          ip_address: string | null
          status: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          auth_method?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          status: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          auth_method?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          status?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_login_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_role: string | null
          new_status: string | null
          old_role: string | null
          old_status: string | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: string | null
          new_status?: string | null
          old_role?: string | null
          old_status?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: string | null
          new_status?: string | null
          old_role?: string | null
          old_status?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_status_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      audit_action: "created" | "updated" | "archived" | "cancelled"
      booking_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled_by_client"
        | "cancelled_by_admin"
        | "no_show"
      payment_status:
        | "pending_in_person"
        | "paid_in_person"
        | "waived"
        | "refunded_in_person"
      session_status: "draft" | "active" | "archived" | "cancelled"
      user_role: "user" | "client" | "admin"
      user_status: "active" | "suspended" | "banned" | "rejected"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      audit_action: ["created", "updated", "archived", "cancelled"],
      booking_status: [
        "pending",
        "confirmed",
        "completed",
        "cancelled_by_client",
        "cancelled_by_admin",
        "no_show",
      ],
      payment_status: [
        "pending_in_person",
        "paid_in_person",
        "waived",
        "refunded_in_person",
      ],
      session_status: ["draft", "active", "archived", "cancelled"],
      user_role: ["user", "client", "admin"],
      user_status: ["active", "suspended", "banned", "rejected"],
    },
  },
} as const


export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]
export type UserRole = Database["public"]["Enums"]["user_role"]
export type UserStatus = Database["public"]["Enums"]["user_status"]
