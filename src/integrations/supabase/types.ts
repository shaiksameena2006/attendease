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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance_records: {
        Row: {
          face_verified: boolean | null
          id: string
          marked_at: string
          marked_by: string | null
          proximity_verified: boolean | null
          session_id: string
          status: string
          student_id: string
          verification_method: string | null
        }
        Insert: {
          face_verified?: boolean | null
          id?: string
          marked_at?: string
          marked_by?: string | null
          proximity_verified?: boolean | null
          session_id: string
          status?: string
          student_id: string
          verification_method?: string | null
        }
        Update: {
          face_verified?: boolean | null
          id?: string
          marked_at?: string
          marked_by?: string | null
          proximity_verified?: boolean | null
          session_id?: string
          status?: string
          student_id?: string
          verification_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "attendance_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_sessions: {
        Row: {
          class_id: string
          created_at: string
          created_by: string
          end_time: string | null
          id: string
          session_date: string
          start_time: string
          status: string
          timetable_entry_id: string | null
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          created_by: string
          end_time?: string | null
          id?: string
          session_date: string
          start_time: string
          status?: string
          timetable_entry_id?: string | null
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          created_by?: string
          end_time?: string | null
          id?: string
          session_date?: string
          start_time?: string
          status?: string
          timetable_entry_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_sessions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_timetable_entry_id_fkey"
            columns: ["timetable_entry_id"]
            isOneToOne: false
            referencedRelation: "timetable_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      bus_drivers: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          license_number: string
          phone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          license_number: string
          phone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          license_number?: string
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bus_passes: {
        Row: {
          created_at: string
          id: string
          pass_number: string
          qr_code: string
          route_id: string
          status: string
          updated_at: string
          user_id: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          created_at?: string
          id?: string
          pass_number: string
          qr_code: string
          route_id: string
          status?: string
          updated_at?: string
          user_id: string
          valid_from: string
          valid_until: string
        }
        Update: {
          created_at?: string
          id?: string
          pass_number?: string
          qr_code?: string
          route_id?: string
          status?: string
          updated_at?: string
          user_id?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "bus_passes_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "bus_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      bus_routes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          route_name: string
          route_number: string
          stops: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          route_name: string
          route_number: string
          stops?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          route_name?: string
          route_number?: string
          stops?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      bus_tracking: {
        Row: {
          bus_id: string
          id: string
          latitude: number
          longitude: number
          speed: number | null
          timestamp: string
        }
        Insert: {
          bus_id: string
          id?: string
          latitude: number
          longitude: number
          speed?: number | null
          timestamp?: string
        }
        Update: {
          bus_id?: string
          id?: string
          latitude?: number
          longitude?: number
          speed?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "bus_tracking_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["id"]
          },
        ]
      }
      buses: {
        Row: {
          bus_number: string
          capacity: number
          created_at: string
          id: string
          is_active: boolean
          registration_number: string | null
          route_id: string | null
          updated_at: string
        }
        Insert: {
          bus_number: string
          capacity: number
          created_at?: string
          id?: string
          is_active?: boolean
          registration_number?: string | null
          route_id?: string | null
          updated_at?: string
        }
        Update: {
          bus_number?: string
          capacity?: number
          created_at?: string
          id?: string
          is_active?: boolean
          registration_number?: string | null
          route_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "buses_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "bus_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      certificate_templates: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          template_data: Json | null
          template_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          template_data?: Json | null
          template_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          template_data?: Json | null
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          certificate_url: string | null
          created_at: string
          description: string | null
          event_id: string | null
          id: string
          issued_at: string
          issued_by: string
          qr_code: string
          template_id: string | null
          title: string
          user_id: string
          verification_status: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          issued_at?: string
          issued_by: string
          qr_code: string
          template_id?: string | null
          title: string
          user_id: string
          verification_status?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          issued_at?: string
          issued_by?: string
          qr_code?: string
          template_id?: string | null
          title?: string
          user_id?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "certificate_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      class_enrollments: {
        Row: {
          class_id: string
          enrolled_at: string
          id: string
          student_id: string
        }
        Insert: {
          class_id: string
          enrolled_at?: string
          id?: string
          student_id: string
        }
        Update: {
          class_id?: string
          enrolled_at?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year: string
          created_at: string
          faculty_id: string
          id: string
          section: string | null
          semester: number
          subject_id: string
          updated_at: string
          year: number
        }
        Insert: {
          academic_year: string
          created_at?: string
          faculty_id: string
          id?: string
          section?: string | null
          semester: number
          subject_id: string
          updated_at?: string
          year: number
        }
        Update: {
          academic_year?: string
          created_at?: string
          faculty_id?: string
          id?: string
          section?: string | null
          semester?: number
          subject_id?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "classes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      club_memberships: {
        Row: {
          club_id: string
          id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          club_id: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          club_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_memberships_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          faculty_coordinator: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          faculty_coordinator?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          faculty_coordinator?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      co_po_mappings: {
        Row: {
          correlation_level: number | null
          course_outcome_id: string
          created_at: string
          id: string
          program_outcome_id: string
        }
        Insert: {
          correlation_level?: number | null
          course_outcome_id: string
          created_at?: string
          id?: string
          program_outcome_id: string
        }
        Update: {
          correlation_level?: number | null
          course_outcome_id?: string
          created_at?: string
          id?: string
          program_outcome_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "co_po_mappings_course_outcome_id_fkey"
            columns: ["course_outcome_id"]
            isOneToOne: false
            referencedRelation: "course_outcomes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "co_po_mappings_program_outcome_id_fkey"
            columns: ["program_outcome_id"]
            isOneToOne: false
            referencedRelation: "program_outcomes"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          conversation_type: string
          created_at: string
          created_by: string
          id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          conversation_type?: string
          created_at?: string
          created_by: string
          id?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          conversation_type?: string
          created_at?: string
          created_by?: string
          id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      course_outcomes: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: string
          outcome_code: string
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id?: string
          outcome_code: string
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          outcome_code?: string
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_outcomes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendance: {
        Row: {
          checked_in_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          checked_in_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          checked_in_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          status: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          status?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          category: string | null
          club_id: string | null
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          event_type: string | null
          id: string
          image_url: string | null
          is_published: boolean
          location: string | null
          requires_registration: boolean
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          category?: string | null
          club_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          location?: string | null
          requires_registration?: boolean
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          category?: string | null
          club_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          location?: string | null
          requires_registration?: boolean
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      face_recognition: {
        Row: {
          enrolled_at: string
          face_encoding: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          enrolled_at?: string
          face_encoding: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          enrolled_at?: string
          face_encoding?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      house_memberships: {
        Row: {
          house_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          house_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          house_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "house_memberships_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      house_points: {
        Row: {
          awarded_by: string | null
          created_at: string
          house_id: string
          id: string
          points: number
          reason: string
          user_id: string
        }
        Insert: {
          awarded_by?: string | null
          created_at?: string
          house_id: string
          id?: string
          points: number
          reason: string
          user_id: string
        }
        Update: {
          awarded_by?: string | null
          created_at?: string
          house_id?: string
          id?: string
          points?: number
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "house_points_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      houses: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
          total_points: number
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          total_points?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          total_points?: number
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_url: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          branch: string | null
          contact: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string | null
          id: string
          interests: string[] | null
          skills: string[] | null
          updated_at: string
          year: number | null
        }
        Insert: {
          avatar_url?: string | null
          branch?: string | null
          contact?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name?: string | null
          id: string
          interests?: string[] | null
          skills?: string[] | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          avatar_url?: string | null
          branch?: string | null
          contact?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string | null
          id?: string
          interests?: string[] | null
          skills?: string[] | null
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      program_outcomes: {
        Row: {
          created_at: string
          department: string | null
          description: string
          id: string
          outcome_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description: string
          id?: string
          outcome_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description?: string
          id?: string
          outcome_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          building: string | null
          capacity: number | null
          created_at: string
          id: string
          room_number: string
          room_type: string | null
        }
        Insert: {
          building?: string | null
          capacity?: number | null
          created_at?: string
          id?: string
          room_number: string
          room_type?: string | null
        }
        Update: {
          building?: string | null
          capacity?: number | null
          created_at?: string
          id?: string
          room_number?: string
          room_type?: string | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          credits: number | null
          department: string | null
          description: string | null
          id: string
          name: string
          semester: number | null
          updated_at: string
          year: number | null
        }
        Insert: {
          code: string
          created_at?: string
          credits?: number | null
          department?: string | null
          description?: string | null
          id?: string
          name: string
          semester?: number | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          credits?: number | null
          department?: string | null
          description?: string | null
          id?: string
          name?: string
          semester?: number | null
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      timetable_entries: {
        Row: {
          class_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          room_id: string | null
          start_time: string
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          room_id?: string | null
          start_time: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          room_id?: string | null
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timetable_entries_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          approved: boolean
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      app_role: "student" | "faculty" | "admin"
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
      app_role: ["student", "faculty", "admin"],
    },
  },
} as const
