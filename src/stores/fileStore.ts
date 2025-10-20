import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface FileItem {
  id: string;
  project_id: string | null;
  task_id: string | null;
  name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_by: string | null;
  created_at: string;
  uploader?: {
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

interface FileState {
  files: FileItem[];
  loading: boolean;
  uploading: boolean;
  loadFiles: (projectId?: string, taskId?: string) => Promise<void>;
  uploadFile: (file: File, projectId?: string, taskId?: string) => Promise<void>;
  deleteFile: (id: string, filePath: string) => Promise<void>;
  downloadFile: (filePath: string, fileName: string) => Promise<void>;
}

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  loading: false,
  uploading: false,

  loadFiles: async (projectId?: string, taskId?: string) => {
    try {
      set({ loading: true });
      let query = supabase
        .from('files')
        .select(`
          *,
          uploader:profiles!uploaded_by(id, full_name, avatar_url),
          project:projects(id, name, color)
        `);
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      if (taskId) {
        query = query.eq('task_id', taskId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      set({ files: data || [] });
    } catch (error: any) {
      toast.error('Failed to load files');
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  uploadFile: async (file: File, projectId?: string, taskId?: string) => {
    try {
      set({ uploading: true });
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save file record to database
      const { data, error } = await supabase
        .from('files')
        .insert([{
          project_id: projectId || null,
          task_id: taskId || null,
          name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
        }])
        .select(`
          *,
          uploader:profiles!uploaded_by(id, full_name, avatar_url),
          project:projects(id, name, color)
        `)
        .single();

      if (error) throw error;
      
      set(state => ({ files: [data, ...state.files] }));
      toast.success('File uploaded successfully');
    } catch (error: any) {
      toast.error('Failed to upload file');
      throw error;
    } finally {
      set({ uploading: false });
    }
  },

  deleteFile: async (id: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        files: state.files.filter(f => f.id !== id)
      }));
      
      toast.success('File deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete file');
      throw error;
    }
  },

  downloadFile: async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .download(filePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error('Failed to download file');
      throw error;
    }
  },
}));