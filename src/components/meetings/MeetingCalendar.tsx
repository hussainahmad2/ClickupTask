import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  project?: {
    color: string;
  };
}

interface MeetingCalendarProps {
  meetings: Meeting[];
}

export default function MeetingCalendar({ meetings }: MeetingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getMeetingsForDay = (day: Date) => {
    return meetings.filter(meeting => 
      isSameDay(new Date(meeting.start_time), day)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <CalendarIcon className="w-6 h-6 mr-2" />
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayMeetings = getMeetingsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`min-h-[100px] p-2 border border-white/10 rounded-lg ${
                isCurrentMonth ? 'bg-white/5' : 'bg-white/2'
              } ${isDayToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`text-sm font-medium mb-2 ${
                isCurrentMonth ? 'text-white' : 'text-gray-500'
              } ${isDayToday ? 'text-blue-400' : ''}`}>
                {format(day, 'd')}
              </div>

              <div className="space-y-1">
                {dayMeetings.slice(0, 3).map(meeting => (
                  <div
                    key={meeting.id}
                    className="text-xs p-1 rounded bg-white/10 text-white truncate cursor-pointer hover:bg-white/20 transition-colors"
                    style={{
                      borderLeft: `3px solid ${meeting.project?.color || '#3B82F6'}`
                    }}
                    title={`${meeting.title} - ${format(new Date(meeting.start_time), 'HH:mm')}`}
                  >
                    <div className="font-medium truncate">{meeting.title}</div>
                    <div className="text-gray-400">
                      {format(new Date(meeting.start_time), 'HH:mm')}
                    </div>
                  </div>
                ))}
                
                {dayMeetings.length > 3 && (
                  <div className="text-xs text-gray-400 text-center">
                    +{dayMeetings.length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-400">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>Meetings</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 border-2 border-blue-500 rounded mr-2"></div>
          <span>Today</span>
        </div>
      </div>
    </motion.div>
  );
}