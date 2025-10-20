import { motion } from 'framer-motion';
import { Calendar, User, Flag, Clock, MessageSquare, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  progress: number;
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

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
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

const priorityIcons = {
  low: '↓',
  medium: '→',
  high: '↑',
  urgent: '⚡'
};

export default function TaskCard({ task, index, onClick }: TaskCardProps) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={onClick}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 cursor-pointer group relative overflow-hidden"
    >
      {/* Project Color Accent */}
      {task.project && (
        <div 
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: task.project.color }}
        ></div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {task.project && (
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                {task.project.name}
              </span>
            )}
            <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
              {priorityIcons[task.priority]} {task.priority.toUpperCase()}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[task.status]}`}>
          <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
          {task.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>

        {isOverdue && (
          <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
            Overdue
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-medium">{task.progress}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Task Meta */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          {task.due_date && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span className={isOverdue ? 'text-red-400' : ''}>
                {format(new Date(task.due_date), 'MMM dd')}
              </span>
            </div>
          )}
          
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            <span>0</span>
          </div>
          
          <div className="flex items-center">
            <Paperclip className="w-4 h-4 mr-1" />
            <span>0</span>
          </div>
        </div>

        {task.assignee && (
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
              {task.assignee.full_name.charAt(0)}
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
    </motion.div>
  );
}