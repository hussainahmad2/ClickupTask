import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Flag, Clock, MessageSquare, Paperclip, CreditCard as Edit, Trash2, Send } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { useAuthStore } from '../../stores/authStore';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  progress: number;
  estimated_hours: number | null;
  actual_hours: number;
  created_at: string;
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

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const statusColors = {
  todo: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  review: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const priorityColors = {
  low: 'text-gray-400',
  medium: 'text-blue-400',
  high: 'text-orange-400',
  urgent: 'text-red-400'
};

export default function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  const { updateTask, deleteTask, comments, loadTaskComments, addComment } = useTaskStore();
  const { profile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    status: 'todo' as const,
    priority: 'medium' as const,
    progress: 0
  });

  useEffect(() => {
    if (task) {
      setEditData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        progress: task.progress
      });
      loadTaskComments(task.id);
    }
  }, [task]);

  const handleSave = async () => {
    if (!task) return;
    
    try {
      await updateTask(task.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
        onClose();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return;
    
    try {
      await addComment(task.id, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!task) return null;

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
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div className="flex items-center space-x-4">
                  {task.project && (
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: task.project.color }}
                      ></div>
                      <span className="text-sm text-gray-400">{task.project.name}</span>
                    </div>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex h-[calc(90vh-120px)]">
                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Status
                          </label>
                          <select
                            value={editData.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value as any })}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="todo" className="bg-gray-800">To Do</option>
                            <option value="in_progress" className="bg-gray-800">In Progress</option>
                            <option value="review" className="bg-gray-800">Review</option>
                            <option value="completed" className="bg-gray-800">Completed</option>
                            <option value="cancelled" className="bg-gray-800">Cancelled</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Priority
                          </label>
                          <select
                            value={editData.priority}
                            onChange={(e) => setEditData({ ...editData, priority: e.target.value as any })}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low" className="bg-gray-800">Low</option>
                            <option value="medium" className="bg-gray-800">Medium</option>
                            <option value="high" className="bg-gray-800">High</option>
                            <option value="urgent" className="bg-gray-800">Urgent</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Progress ({editData.progress}%)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editData.progress}
                          onChange={(e) => setEditData({ ...editData, progress: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div className="flex space-x-4">
                        <button
                          onClick={handleSave}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl font-bold text-white mb-4">{task.title}</h1>
                        {task.description && (
                          <p className="text-gray-300 leading-relaxed">{task.description}</p>
                        )}
                      </div>

                      {/* Task Meta */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center text-gray-400 mb-2">
                            <Flag className={`w-4 h-4 mr-2 ${priorityColors[task.priority]}`} />
                            <span className="text-sm">Priority</span>
                          </div>
                          <span className={`font-medium capitalize ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                        </div>

                        {task.due_date && (
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="flex items-center text-gray-400 mb-2">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="text-sm">Due Date</span>
                            </div>
                            <span className="text-white font-medium">
                              {format(new Date(task.due_date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        )}

                        {task.assignee && (
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="flex items-center text-gray-400 mb-2">
                              <User className="w-4 h-4 mr-2" />
                              <span className="text-sm">Assignee</span>
                            </div>
                            <span className="text-white font-medium">
                              {task.assignee.full_name}
                            </span>
                          </div>
                        )}

                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center text-gray-400 mb-2">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="text-sm">Time</span>
                          </div>
                          <span className="text-white font-medium">
                            {task.actual_hours}h / {task.estimated_hours || 0}h
                          </span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white font-medium">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3">
                          <div 
                            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comments Sidebar */}
                <div className="w-80 border-l border-white/20 flex flex-col">
                  <div className="p-4 border-b border-white/20">
                    <h3 className="font-semibold text-white flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Comments ({comments.length})
                    </h3>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">
                              {comment.user?.full_name || 'Unknown User'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {format(new Date(comment.created_at), 'MMM dd, HH:mm')}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{comment.content}</p>
                        </div>
                      ))}
                      
                      {comments.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No comments yet</p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t border-white/20">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="p-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}