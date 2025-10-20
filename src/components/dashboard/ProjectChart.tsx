import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Project {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
}

interface Task {
  id: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  project_id: string | null;
}

interface ProjectChartProps {
  projects: Project[];
  tasks: Task[];
}

const COLORS = {
  planning: '#8B5CF6',
  active: '#3B82F6',
  on_hold: '#F59E0B',
  completed: '#10B981',
  cancelled: '#EF4444'
};

const TASK_COLORS = {
  todo: '#6B7280',
  in_progress: '#F59E0B',
  review: '#8B5CF6',
  completed: '#10B981',
  cancelled: '#EF4444'
};

export default function ProjectChart({ projects, tasks }: ProjectChartProps) {
  // Project status distribution
  const projectStatusData = [
    { name: 'Planning', value: projects.filter(p => p.status === 'planning').length, color: COLORS.planning },
    { name: 'Active', value: projects.filter(p => p.status === 'active').length, color: COLORS.active },
    { name: 'On Hold', value: projects.filter(p => p.status === 'on_hold').length, color: COLORS.on_hold },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: COLORS.completed },
    { name: 'Cancelled', value: projects.filter(p => p.status === 'cancelled').length, color: COLORS.cancelled },
  ].filter(item => item.value > 0);

  // Task status distribution
  const taskStatusData = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: TASK_COLORS.todo },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: TASK_COLORS.in_progress },
    { name: 'Review', value: tasks.filter(t => t.status === 'review').length, color: TASK_COLORS.review },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: TASK_COLORS.completed },
    { name: 'Cancelled', value: tasks.filter(t => t.status === 'cancelled').length, color: TASK_COLORS.cancelled },
  ].filter(item => item.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
    >
      <h3 className="text-xl font-bold text-white mb-6">Project Analytics</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Chart */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Project Status Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Chart */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Task Status Overview</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskStatusData}>
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
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}