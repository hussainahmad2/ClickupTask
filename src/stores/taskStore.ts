import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Task {
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
  assignee?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  project?: {
    id: string;
    name: string;
    color: string;
  };
}

interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface TaskState {
  tasks: Task[];
  comments: TaskComment[];
  selectedTask: Task | null;
  loading: boolean;
  loadTasks: (projectId?: string) => Promise<void>;
  loadTaskComments: (taskId: string) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'actual_hours' | 'progress' | 'completed_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<void>;
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>;
  assignTask: (id: string, userId: string) => Promise<void>;
  setSelectedTask: (task: Task | null) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  comments: [],
  selectedTask: null,
  loading: false,

  loadTasks: async (projectId?: string) => {
    try {
      set({ loading: true });
      let query = supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles!assigned_to(id, full_name, avatar_url),
          project:projects(id, name, color)
        `);
      
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

  loadTaskComments: async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .select(`
          *,
          user:profiles(id, full_name, avatar_url)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ comments: data || [] });
    } catch (error: any) {
      toast.error('Failed to load comments');
      console.error(error);
    }
  },

  createTask: async (task) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, actual_hours: 0, progress: 0 }])
        .select(`
          *,
          assignee:profiles!assigned_to(id, full_name, avatar_url),
          project:projects(id, name, color)
        `)
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
        ),
        selectedTask: state.selectedTask?.id === id 
          ? { ...state.selectedTask, ...updates }
          : state.selectedTask
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
        tasks: state.tasks.filter(t => t.id !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask
      }));
      
      toast.success('Task deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete task');
      throw error;
    }
  },

  addComment: async (taskId, content) => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .insert([{ task_id: taskId, content }])
        .select(`
          *,
          user:profiles(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;
      
      set(state => ({ comments: [...state.comments, data] }));
      toast.success('Comment added');
    } catch (error: any) {
      toast.error('Failed to add comment');
      throw error;
    }
  },

  updateTaskStatus: async (id, status) => {
    try {
      const updates: any = { status };
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
        updates.progress = 100;
      }

      await get().updateTask(id, updates);
    } catch (error) {
      throw error;
    }
  },

  assignTask: async (id, userId) => {
    try {
      await get().updateTask(id, { assigned_to: userId });
    } catch (error) {
      throw error;
    }
  },

  setSelectedTask: (task) => {
    set({ selectedTask: task });
  },
}));