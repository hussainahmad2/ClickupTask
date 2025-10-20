import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          organization_id: string | null;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'super_admin' | 'admin' | 'team_lead' | 'employee' | 'client';
          department: string | null;
          job_title: string | null;
          phone: string | null;
          timezone: string;
          is_active: boolean;
          last_seen: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id?: string | null;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: 'super_admin' | 'admin' | 'team_lead' | 'employee' | 'client';
          department?: string | null;
          job_title?: string | null;
          phone?: string | null;
          timezone?: string;
          is_active?: boolean;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string | null;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'super_admin' | 'admin' | 'team_lead' | 'employee' | 'client';
          department?: string | null;
          job_title?: string | null;
          phone?: string | null;
          timezone?: string;
          is_active?: boolean;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          organization_id: string | null;
          name: string;
          description: string | null;
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          start_date: string | null;
          end_date: string | null;
          budget: number | null;
          color: string;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string | null;
          parent_task_id: string | null;
          title: string;
          description: string | null;
          status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          start_date: string | null;
          due_date: string | null;
          estimated_hours: number | null;
          actual_hours: number;
          progress: number;
          created_by: string | null;
          assigned_to: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};