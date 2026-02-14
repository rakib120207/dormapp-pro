export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nickname: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          nickname?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_by?: string;
          created_at?: string;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: "admin" | "member";
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          role?: "admin" | "member";
          joined_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          role?: "admin" | "member";
          joined_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          group_id: string;
          paid_by: string | null;
          amount: number;
          description: string | null;
          category: string | null;
          expense_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          paid_by?: string | null;
          amount: number;
          description?: string | null;
          category?: string | null;
          expense_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          paid_by?: string | null;
          amount?: number;
          description?: string | null;
          category?: string | null;
          expense_date?: string;
          created_at?: string;
        };
      };
      expense_shares: {
        Row: {
          id: string;
          expense_id: string;
          user_id: string;
          amount: number;
        };
        Insert: {
          id?: string;
          expense_id: string;
          user_id: string;
          amount: number;
        };
        Update: {
          id?: string;
          expense_id?: string;
          user_id?: string;
          amount?: number;
        };
      };
    };
    Functions: {
      create_group_with_admin: {
        Args: { group_name: string };
        Returns: string;
      };
      join_group: {
        Args: { group_uuid: string };
        Returns: void;
      };
      leave_group: {
        Args: { group_uuid: string };
        Returns: void;
      };
      get_group_balances: {
        Args: { group_uuid: string };
        Returns: {
          user_id: string;
          nickname: string;
          avatar_url: string | null;
          total_paid: number;
          total_share: number;
          balance: number;
        }[];
      };
      remove_member: {
        Args: { group_uuid: string; member_uuid: string };
        Returns: void;
      };
      is_group_admin: {
        Args: { group_uuid: string; user_uuid: string };
        Returns: boolean;
      };
      is_group_member: {
        Args: { group_uuid: string; user_uuid: string };
        Returns: boolean;
      };
    };
  };
}