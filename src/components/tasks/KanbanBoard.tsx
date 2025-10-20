import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';

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

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-500' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', title: 'Review', color: 'bg-yellow-500' },
  { id: 'completed', title: 'Completed', color: 'bg-green-500' },
];

const priorityColors = {
  low: 'border-l-gray-400',
  medium: 'border-l-blue-400',
  high: 'border-l-orange-400',
  urgent: 'border-l-red-400'
};

export default function KanbanBoard({ tasks, onTaskClick }: KanbanBoardProps) {
  const { updateTaskStatus } = useTaskStore();

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status !== status) {
      await updateTaskStatus(taskId, status);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {columns.map((column) => {
        const columnTasks = tasks.filter(task => task.status === column.id);
        
        return (
          <div
            key={column.id}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id as Task['status'])}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${column.color} mr-2`}></div>
                <h3 className="font-semibold text-white">{column.title}</h3>
                <span className="ml-2 px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                  {columnTasks.length}
                </span>
              </div>
              
              <button className="p-1 hover:bg-white/10 rounded transition-colors">
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {columnTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onClick={() => onTaskClick(task)}
                  className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 cursor-pointer hover:bg-white/15 transition-all border-l-4 ${priorityColors[task.priority]}`}
                >
                  {/* Project Tag */}
                  {task.project && (
                    <div className="flex items-center mb-2">
                      <div 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: task.project.color }}
                      ></div>
                      <span className="text-xs text-gray-400">{task.project.name}</span>
                    </div>
                  )}

                  {/* Task Title */}
                  <h4 className="text-white font-medium mb-2 line-clamp-2">
                    {task.title}
                  </h4>

                  {/* Task Description */}
                  {task.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  {task.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-1">
                        <div 
                          className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Task Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300 capitalize">
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span className="text-xs text-gray-400">
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {task.assignee && (
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
                        {task.assignee.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No tasks</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}