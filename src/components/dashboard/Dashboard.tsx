import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  CheckSquare, 
  Calendar,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react';
import StatsCard from './StatsCard';
import ProjectChart from './ProjectChart';
import RecentActivity from './RecentActivity';
import { useProjectStore } from '../../stores/projectStore';
import { useAuthStore } from '../../stores/authStore';

export default function Dashboard() {
  const { projects, tasks, loadProjects, loadTasks } = useProjectStore();
  const { profile } = useAuthStore();

  useEffect(() => {
    loadProjects();
    loadTasks();
  }, []);

  // Calculate statistics
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const overdueTasks = tasks.filter(t => 
    t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Good morning, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your projects today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Projects"
          value={activeProjects}
          change="+12%"
          changeType="increase"
          icon={FolderOpen}
          gradient="from-blue-500 to-cyan-400"
        />
        
        <StatsCard
          title="Completed Tasks"
          value={completedTasks}
          change="+8%"
          changeType="increase"
          icon={CheckSquare}
          gradient="from-green-500 to-emerald-400"
        />
        
        <StatsCard
          title="Pending Tasks"
          value={pendingTasks}
          change="-5%"
          changeType="decrease"
          icon={Clock}
          gradient="from-orange-500 to-yellow-400"
        />
        
        <StatsCard
          title="Overdue Tasks"
          value={overdueTasks}
          change={overdueTasks > 0 ? "Attention needed" : "All good"}
          changeType={overdueTasks > 0 ? "decrease" : "increase"}
          icon={AlertTriangle}
          gradient="from-red-500 to-pink-400"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectChart projects={projects} tasks={tasks} />
        </div>
        
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg text-white hover:from-blue-500/30 hover:to-purple-500/30 transition-all"
          >
            <FolderOpen className="w-5 h-5 mr-3" />
            New Project
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg text-white hover:from-green-500/30 hover:to-emerald-500/30 transition-all"
          >
            <CheckSquare className="w-5 h-5 mr-3" />
            Add Task
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg text-white hover:from-orange-500/30 hover:to-yellow-500/30 transition-all"
          >
            <Calendar className="w-5 h-5 mr-3" />
            Schedule Meeting
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}