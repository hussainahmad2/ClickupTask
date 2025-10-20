import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Meeting {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  meeting_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    name: string;
    color: string;
  };
  participants?: {
    id: string;
    user_id: string;
    status: 'invited' | 'accepted' | 'declined' | 'tentative';
    user: {
      id: string;
      full_name: string;
      avatar_url: string | null;
    };
  }[];
}

interface MeetingState {
  meetings: Meeting[];
  selectedMeeting: Meeting | null;
  loading: boolean;
  loadMeetings: (projectId?: string) => Promise<void>;
  createMeeting: (meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateMeeting: (id: string, updates: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  addParticipant: (meetingId: string, userId: string) => Promise<void>;
  updateParticipantStatus: (meetingId: string, userId: string, status: string) => Promise<void>;
  setSelectedMeeting: (meeting: Meeting | null) => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  meetings: [],
  selectedMeeting: null,
  loading: false,

  loadMeetings: async (projectId?: string) => {
    try {
      set({ loading: true });
      let query = supabase
        .from('meetings')
        .select(`
          *,
          project:projects(id, name, color),
          participants:meeting_participants(
            id,
            user_id,
            status,
            user:profiles(id, full_name, avatar_url)
          )
        `);
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('start_time', { ascending: true });

      if (error) throw error;
      set({ meetings: data || [] });
    } catch (error: any) {
      toast.error('Failed to load meetings');
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  createMeeting: async (meeting) => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .insert([meeting])
        .select(`
          *,
          project:projects(id, name, color),
          participants:meeting_participants(
            id,
            user_id,
            status,
            user:profiles(id, full_name, avatar_url)
          )
        `)
        .single();

      if (error) throw error;
      
      set(state => ({ meetings: [data, ...state.meetings] }));
      toast.success('Meeting created successfully');
    } catch (error: any) {
      toast.error('Failed to create meeting');
      throw error;
    }
  },

  updateMeeting: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        meetings: state.meetings.map(m => 
          m.id === id ? { ...m, ...updates } : m
        ),
        selectedMeeting: state.selectedMeeting?.id === id 
          ? { ...state.selectedMeeting, ...updates }
          : state.selectedMeeting
      }));
      
      toast.success('Meeting updated successfully');
    } catch (error: any) {
      toast.error('Failed to update meeting');
      throw error;
    }
  },

  deleteMeeting: async (id) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        meetings: state.meetings.filter(m => m.id !== id),
        selectedMeeting: state.selectedMeeting?.id === id ? null : state.selectedMeeting
      }));
      
      toast.success('Meeting deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete meeting');
      throw error;
    }
  },

  addParticipant: async (meetingId, userId) => {
    try {
      const { error } = await supabase
        .from('meeting_participants')
        .insert([{ meeting_id: meetingId, user_id: userId }]);

      if (error) throw error;
      
      // Reload meetings to get updated participants
      await get().loadMeetings();
      toast.success('Participant added');
    } catch (error: any) {
      toast.error('Failed to add participant');
      throw error;
    }
  },

  updateParticipantStatus: async (meetingId, userId, status) => {
    try {
      const { error } = await supabase
        .from('meeting_participants')
        .update({ status })
        .eq('meeting_id', meetingId)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Reload meetings to get updated status
      await get().loadMeetings();
      toast.success('Status updated');
    } catch (error: any) {
      toast.error('Failed to update status');
      throw error;
    }
  },

  setSelectedMeeting: (meeting) => {
    set({ selectedMeeting: meeting });
  },
}));