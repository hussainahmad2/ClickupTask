import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  Users,
  Clock,
  Target,
  FileText,
  PieChart
} from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { useTaskStore } from '../../stores/taskStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function ReportsPage() {
  const { projects, loadProjects } = useProjectStore();
  const { tasks, loadTasks } = useTaskStore();
  const [dateRange, setDateRange] = useState('month');
  const [selectedProject, setSelectedProject] = useState('all');

  useEffect(() => {
    loadProjects();
    loadTasks();
  }, []);

  // Calculate metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => 
    t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
  ).length;

  // Project status distribution
  const projectStatusData = [
    { name: 'Planning', value: projects.filter(p => p.status === 'planning').length, color: '#8B5CF6' },
    { name: 'Active', value: projects.filter(p => p.status === 'active').length, color: '#3B82F6' },
    { name: 'On Hold', value: projects.filter(p => p.status === 'on_hold').length, color: '#F59E0B' },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: '#10B981' },
    { name: 'Cancelled', value: projects.filter(p => p.status === 'cancelled').length, color: '#EF4444' },
  ].filter(item => item.value > 0);

  // Task priority distribution
  const taskPriorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#6B7280' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#3B82F6' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#F59E0B' },
    { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length, color: '#EF4444' },
  ].filter(item => item.value > 0);

  // Task completion trend (mock data for demo)
  const completionTrendData = [
    { name: 'Week 1', completed: 12, created: 15 },
    { name: 'Week 2', completed: 18, created: 20 },
    { name: 'Week 3', completed: 25, created: 22 },
    { name: 'Week 4', completed: 30, created: 28 },
  ];

  const exportReport = (format: 'pdf' | 'csv') => {
    // Mock export functionality
    const data = {
      projects: projects.length,
      tasks: tasks.length,
      completedTasks: completedTasks,
      overdueTasks: overdueTasks,
      generatedAt: new Date().toISOString()
    };
    
    console.log(`Exporting ${format.toUpperCase()} report:`, data);
    alert(`${format.toUpperCase()} report exported successfully!`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-gray-400">Track performance and generate insights</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                dateRange === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                dateRange === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                dateRange === 'year'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Year
            </button>
          </div>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportReport('pdf')}
              className="flex items-center px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportReport('csv')}
              className="flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm text-green-400">+12%</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Projects</h3>
          <p className="text-white text-2xl font-bold">{totalProjects}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-sm text-green-400">+8%</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Completed Tasks</h3>
          <p className="text-white text-2xl font-bold">{completedTasks}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-500/20">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-sm text-red-400">+3</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Overdue Tasks</h3>
          <p className="text-white text-2xl font-bold">{overdueTasks}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm text-green-400">Active</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Team Members</h3>
          <p className="text-white text-2xl font-bold">12</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Project Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Task Priority Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskPriorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'white', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <YAxis 
                  tick={{ fill: 'white', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {taskPriorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Task Completion Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Task Completion Trend
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={completionTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'white', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <YAxis 
                tick={{ fill: 'white', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                name="Completed Tasks"
              />
              <Line 
                type="monotone" 
                dataKey="created" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                name="Created Tasks"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Project Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Project Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Project</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Tasks</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Progress</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 5).map((project, index) => {
                const projectTasks = tasks.filter(t => t.project_id === project.id);
                const completedProjectTasks = projectTasks.filter(t => t.status === 'completed');
                const progress = projectTasks.length > 0 ? Math.round((completedProjectTasks.length / projectTasks.length) * 100) : 0;

                return (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: project.color }}
                        ></div>
                        <span className="text-white font-medium">{project.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        project.status === 'on_hold' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">
                      {completedProjectTasks.length}/{projectTasks.length}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-700/50 rounded-full h-2 mr-3">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm">{progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm capitalize ${
                        project.priority === 'urgent' ? 'text-red-400' :
                        project.priority === 'high' ? 'text-orange-400' :
                        project.priority === 'medium' ? 'text-blue-400' :
                        'text-gray-400'
                      }`}>
                        {project.priority}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}