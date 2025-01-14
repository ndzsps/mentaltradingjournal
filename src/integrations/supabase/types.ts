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
      backtesting_sessions: {
        Row: {
          after_url: string | null
          before_url: string | null
          created_at: string
          daily_url: string | null
          description: string | null
          direction: string | null
          end_date: string
          entry_date: string | null
          entry_price: number | null
          exit_price: number | null
          fees: number | null
          four_hour_url: string | null
          id: string
          instrument: string | null
          leverage: number | null
          market_type: string
          name: string
          one_hour_url: string | null
          playbook_id: string | null
          pnl: number | null
          quantity: number | null
          refined_entry_url: string | null
          setup: string | null
          start_balance: number
          start_date: string
          stop_loss: number | null
          symbol: string
          take_profit: number | null
          updated_at: string
          user_id: string
          weekly_url: string | null
        }
        Insert: {
          after_url?: string | null
          before_url?: string | null
          created_at?: string
          daily_url?: string | null
          description?: string | null
          direction?: string | null
          end_date: string
          entry_date?: string | null
          entry_price?: number | null
          exit_price?: number | null
          fees?: number | null
          four_hour_url?: string | null
          id?: string
          instrument?: string | null
          leverage?: number | null
          market_type: string
          name: string
          one_hour_url?: string | null
          playbook_id?: string | null
          pnl?: number | null
          quantity?: number | null
          refined_entry_url?: string | null
          setup?: string | null
          start_balance: number
          start_date: string
          stop_loss?: number | null
          symbol: string
          take_profit?: number | null
          updated_at?: string
          user_id: string
          weekly_url?: string | null
        }
        Update: {
          after_url?: string | null
          before_url?: string | null
          created_at?: string
          daily_url?: string | null
          description?: string | null
          direction?: string | null
          end_date?: string
          entry_date?: string | null
          entry_price?: number | null
          exit_price?: number | null
          fees?: number | null
          four_hour_url?: string | null
          id?: string
          instrument?: string | null
          leverage?: number | null
          market_type?: string
          name?: string
          one_hour_url?: string | null
          playbook_id?: string | null
          pnl?: number | null
          quantity?: number | null
          refined_entry_url?: string | null
          setup?: string | null
          start_balance?: number
          start_date?: string
          stop_loss?: number | null
          symbol?: string
          take_profit?: number | null
          updated_at?: string
          user_id?: string
          weekly_url?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          created_at: string
          emotion: string
          emotion_detail: string
          followed_rules: string[] | null
          id: string
          market_conditions: string | null
          mistakes: string[] | null
          notes: string
          outcome: string | null
          post_submission_notes: string | null
          pre_trading_activities: string[] | null
          session_type: string
          trades: Json[] | null
          trading_rules_notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emotion: string
          emotion_detail: string
          followed_rules?: string[] | null
          id?: string
          market_conditions?: string | null
          mistakes?: string[] | null
          notes: string
          outcome?: string | null
          post_submission_notes?: string | null
          pre_trading_activities?: string[] | null
          session_type: string
          trades?: Json[] | null
          trading_rules_notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          emotion?: string
          emotion_detail?: string
          followed_rules?: string[] | null
          id?: string
          market_conditions?: string | null
          mistakes?: string[] | null
          notes?: string
          outcome?: string | null
          post_submission_notes?: string | null
          pre_trading_activities?: string[] | null
          session_type?: string
          trades?: Json[] | null
          trading_rules_notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      progress_stats: {
        Row: {
          created_at: string
          daily_streak: number
          id: string
          last_activity: string | null
          level: number
          level_progress: number
          post_session_streak: number
          pre_session_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_streak?: number
          id?: string
          last_activity?: string | null
          level?: number
          level_progress?: number
          post_session_streak?: number
          pre_session_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_streak?: number
          id?: string
          last_activity?: string | null
          level?: number
          level_progress?: number
          post_session_streak?: number
          pre_session_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trading_blueprints: {
        Row: {
          created_at: string
          daily_url: string | null
          description: string | null
          emoji: string | null
          entry_rules: string[] | null
          exit_rules: string[] | null
          four_hour_url: string | null
          id: string
          name: string
          one_hour_url: string | null
          refined_entry_url: string | null
          risk_management: string[] | null
          rules: string[] | null
          setup_criteria: string[] | null
          updated_at: string
          user_id: string
          weekly_url: string | null
        }
        Insert: {
          created_at?: string
          daily_url?: string | null
          description?: string | null
          emoji?: string | null
          entry_rules?: string[] | null
          exit_rules?: string[] | null
          four_hour_url?: string | null
          id?: string
          name: string
          one_hour_url?: string | null
          refined_entry_url?: string | null
          risk_management?: string[] | null
          rules?: string[] | null
          setup_criteria?: string[] | null
          updated_at?: string
          user_id: string
          weekly_url?: string | null
        }
        Update: {
          created_at?: string
          daily_url?: string | null
          description?: string | null
          emoji?: string | null
          entry_rules?: string[] | null
          exit_rules?: string[] | null
          four_hour_url?: string | null
          id?: string
          name?: string
          one_hour_url?: string | null
          refined_entry_url?: string | null
          risk_management?: string[] | null
          rules?: string[] | null
          setup_criteria?: string[] | null
          updated_at?: string
          user_id?: string
          weekly_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_level_from_streak: {
        Args: {
          daily_streak: number
        }
        Returns: number
      }
      get_trade_duration: {
        Args: {
          entry_date: string
          exit_date: string
        }
        Returns: unknown
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
