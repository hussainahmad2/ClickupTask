import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Video, Users, FolderOpen } from 'lucide-react';
import { useMeetingStore } from '../../stores/meetingStore';
import { useProjectStore } from '../../stores/projectStore';
import { useAuthStore } from '../../stores/authStore';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMeetingModal({ isOpen, onClose }: CreateMeetingModalProps) {
  const { createMeeting } = useMeetingStore();
  const { projects } = useProjectStore();
  const { profile } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    start_time: '',
    end_time: '',
    location: '',
    meeting_url: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validate times
      const startTime = new Date(formData.start_time);
      const endTime = new Date(formData.end_time);
      
      if (endTime <= startTime) {
        alert('End time must be after start time');
        return;
      }

      await createMeeting({
        title: formData.title,
        description: formData.description || null,
        project_id: formData.project_id || null,
        start_time: formData.start_time,
        end_time: formData.end_time,
        location: formData.location || null,
        meeting_url: formData.meeting_url || null,
        created_by: profile?.id || null
      });
      
      onClose();
      setFormData({
        title: '',
        description: '',
        project_id: '',
        start_time: '',
        end_time: '',
        location: '',
        meeting_url: ''
      });
    } catch (error) {
      console.error('Error creating meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate default end time (1 hour after start time)
  const handleStartTimeChange = (startTime: string) => {
    setFormData({ ...formData, start_time: startTime });
    
    if (startTime && !formData.end_time) {
      const start = new Date(startTime);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour
      const endTimeString = end.toISOString().slice(0, 16);
      setFormData(prev => ({ ...prev, end_time: endTimeString }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Schedule New Meeting</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Meeting Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Meeting Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter meeting title"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Meeting agenda and details..."
                    />
                  </div>

                  {/* Project */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FolderOpen className="w-4 h-4 inline mr-1" />
                      Project
                    </label>
                    <select
                      value={formData.project_id}
                      onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" className="bg-gray-800">No Project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id} className="bg-gray-800">
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Type Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Meeting Type
                    </label>
                    <div className="flex bg-white/10 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, meeting_url: '', location: formData.location || 'Conference Room' })}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          !formData.meeting_url
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <MapPin className="w-4 h-4 inline mr-1" />
                        In-Person
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, location: '', meeting_url: 'https://meet.google.com/' })}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          formData.meeting_url
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Video className="w-4 h-4 inline mr-1" />
                        Online
                      </button>
                    </div>
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={(e) => handleStartTimeChange(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Location or Meeting URL */}
                  {formData.meeting_url ? (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Video className="w-4 h-4 inline mr-1" />
                        Meeting URL
                      </label>
                      <input
                        type="url"
                        value={formData.meeting_url}
                        onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://meet.google.com/..."
                      />
                    </div>
                  ) : (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Conference Room A, Office Building..."
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-white/20">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || !formData.title || !formData.start_time || !formData.end_time}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Scheduling...' : 'Schedule Meeting'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}