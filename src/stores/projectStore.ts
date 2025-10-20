import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  color: string;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  progress: number;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectState {
  projects: Project[];
  tasks: Task[];
  selectedProject: Project | null;
  loading: boolean;
  loadProjects: () => Promise<void>;
  loadTasks: (projectId?: string) => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setSelectedProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  tasks: [],
  selectedProject: null,
  loading: false,

  loadProjects: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ projects: data || [] });
    } catch (error: any) {
      toast.error('Failed to load projects');
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  loadTasks: async (projectId?: string) => {
    try {
      set({ loading: true });
      let query = supabase.from('tasks').select('*');
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      set({ tasks: data || [] });
    } catch (error: any) {
      toast.error('Failed to load tasks');
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (project) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({ projects: [data, ...state.projects] }));
      toast.success('Project created successfully');
    } catch (error: any) {
      toast.error('Failed to create project');
      throw error;
    }
  },

  updateProject: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, ...updates } : p
        ),
        selectedProject: state.selectedProject?.id === id 
          ? { ...state.selectedProject, ...updates }
          : state.selectedProject
      }));
      
      toast.success('Project updated successfully');
    } catch (error: any) {
      toast.error('Failed to update project');
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        projects: state.projects.filter(p => p.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject
      }));
      
      toast.success('Project deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete project');
      throw error;
    }
  },

  createTask: async (task) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({ tasks: [data, ...state.tasks] }));
      toast.success('Task created successfully');
    } catch (error: any) {
      toast.error('Failed to create task');
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        tasks: state.tasks.map(t => 
          t.id === id ? { ...t, ...updates } : t
        )
      }));
      
      toast.success('Task updated successfully');
    } catch (error: any) {
      toast.error('Failed to update task');
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        tasks: state.tasks.filter(t => t.id !== id)
      }));
      
      toast.success('Task deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete task');
      throw error;
    }
  },

  setSelectedProject: (project) => {
    set({ selectedProject: project });
  },
}));