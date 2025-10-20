import { motion } from 'framer-motion';
import { Calendar, Users, MoreHorizontal, Target } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { format } from 'date-fns';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date: string | null;
  end_date: string | null;
  color: string;
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const statusColors = {
  planning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  on_hold: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const priorityColors = {
  low: 'text-gray-400',
  medium: 'text-blue-400',
  high: 'text-orange-400',
  urgent: 'text-red-400'
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { setSelectedProject } = useProjectStore();

  const handleProjectClick = () => {
    setSelectedProject(project);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={handleProjectClick}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 cursor-pointer group relative overflow-hidden"
    >
      {/* Project Color Accent */}
      <div 
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: project.color }}
      ></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
            {project.name}
          </h3>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {project.description || 'No description available'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium capitalize ${priorityColors[project.priority]}`}>
            {project.priority}
          </span>
          <button className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[project.status]}`}>
          <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
          {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      </div>

      {/* Project Stats */}
      <div className="space-y-3">
        {project.start_date && (
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {project.end_date ? (
              <>
                {format(new Date(project.start_date), 'MMM dd')} - {format(new Date(project.end_date), 'MMM dd, yyyy')}
              </>
            ) : (
              <>Started {format(new Date(project.start_date), 'MMM dd, yyyy')}</>
            )}
          </div>
        )}
        
        <div className="flex items-center text-gray-400 text-sm">
          <Users className="w-4 h-4 mr-2" />
          0 team members
        </div>
        
        <div className="flex items-center text-gray-400 text-sm">
          <Target className="w-4 h-4 mr-2" />
          0 tasks
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-medium">0%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
            style={{ width: '0%' }}
          ></div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
    </motion.div>
  );
}