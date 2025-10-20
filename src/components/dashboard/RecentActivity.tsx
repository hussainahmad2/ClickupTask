import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  FolderOpen, 
  MessageSquare, 
  Calendar,
  Clock
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'task_completed' | 'project_created' | 'comment_added' | 'meeting_scheduled';
  title: string;
  description: string;
  time: string;
  user: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'task_completed',
    title: 'Task Completed',
    description: 'Database schema design completed',
    time: '2 hours ago',
    user: 'John Doe'
  },
  {
    id: '2',
    type: 'project_created',
    title: 'New Project',
    description: 'Mobile App Redesign project created',
    time: '4 hours ago',
    user: 'Jane Smith'
  },
  {
    id: '3',
    type: 'comment_added',
    title: 'Comment Added',
    description: 'New comment on API Integration task',
    time: '6 hours ago',
    user: 'Mike Johnson'
  },
  {
    id: '4',
    type: 'meeting_scheduled',
    title: 'Meeting Scheduled',
    description: 'Sprint Planning meeting scheduled for tomorrow',
    time: '8 hours ago',
    user: 'Sarah Wilson'
  }
];

const activityIcons = {
  task_completed: CheckSquare,
  project_created: FolderOpen,
  comment_added: MessageSquare,
  meeting_scheduled: Calendar
};

const activityColors = {
  task_completed: 'text-green-400 bg-green-500/20',
  project_created: 'text-blue-400 bg-blue-500/20',
  comment_added: 'text-purple-400 bg-purple-500/20',
  meeting_scheduled: 'text-orange-400 bg-orange-500/20'
};

export default function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{activity.title}</h4>
                <p className="text-gray-400 text-sm mt-1">{activity.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-500 text-xs">{activity.user}</span>
                  <span className="text-gray-500 text-xs">{activity.time}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 py-2 px-4 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm"
      >
        View All Activity
      </motion.button>
    </motion.div>
  );
}