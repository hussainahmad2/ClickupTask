import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Video, MapPin, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  meeting_url: string | null;
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

interface MeetingCardProps {
  meeting: Meeting;
  index: number;
}

const statusColors = {
  invited: 'bg-gray-500/20 text-gray-400',
  accepted: 'bg-green-500/20 text-green-400',
  declined: 'bg-red-500/20 text-red-400',
  tentative: 'bg-yellow-500/20 text-yellow-400'
};

export default function MeetingCard({ meeting, index }: MeetingCardProps) {
  const startTime = new Date(meeting.start_time);
  const endTime = new Date(meeting.end_time);
  const isUpcoming = startTime > new Date();
  const isToday = startTime.toDateString() === new Date().toDateString();

  const acceptedParticipants = meeting.participants?.filter(p => p.status === 'accepted') || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 cursor-pointer group relative overflow-hidden"
    >
      {/* Project Color Accent */}
      {meeting.project && (
        <div 
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: meeting.project.color }}
        ></div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {meeting.project && (
            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300 mb-2 inline-block">
              {meeting.project.name}
            </span>
          )}
          
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
            {meeting.title}
          </h3>
          
          {meeting.description && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {meeting.description}
            </p>
          )}
        </div>
        
        <button className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Time and Date */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-300">
          <Calendar className="w-4 h-4 mr-2" />
          <span className={`text-sm ${isToday ? 'text-blue-400 font-medium' : ''}`}>
            {format(startTime, 'MMM dd, yyyy')}
            {isToday && ' (Today)'}
          </span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
          </span>
        </div>

        {meeting.location && (
          <div className="flex items-center text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{meeting.location}</span>
          </div>
        )}

        {meeting.meeting_url && (
          <div className="flex items-center text-blue-400">
            <Video className="w-4 h-4 mr-2" />
            <span className="text-sm">Online Meeting</span>
          </div>
        )}
      </div>

      {/* Participants */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Users className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-400">
            {acceptedParticipants.length} attending
          </span>
        </div>

        {/* Participant Avatars */}
        <div className="flex -space-x-2">
          {acceptedParticipants.slice(0, 3).map((participant) => (
            <div
              key={participant.id}
              className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-gray-800"
              title={participant.user.full_name}
            >
              {participant.user.full_name.charAt(0)}
            </div>
          ))}
          {acceptedParticipants.length > 3 && (
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-gray-800">
              +{acceptedParticipants.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${
          isUpcoming ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
        }`}>
          {isUpcoming ? 'Upcoming' : 'Past'}
        </span>

        {meeting.meeting_url && isUpcoming && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              window.open(meeting.meeting_url!, '_blank');
            }}
            className="text-xs px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
          >
            Join
          </motion.button>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
    </motion.div>
  );
}