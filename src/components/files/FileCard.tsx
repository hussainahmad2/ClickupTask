import { motion } from 'framer-motion';
import { Download, Trash2, File, Image, FileText, Archive, Video, Music, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface FileItem {
  id: string;
  name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  created_at: string;
  uploader?: {
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

interface FileCardProps {
  file: FileItem;
  index: number;
  onDownload: () => void;
  onDelete: () => void;
}

const getFileCategory = (fileType: string | null) => {
  if (!fileType) return 'other';
  
  if (fileType.startsWith('image/')) return 'image';
  if (fileType.startsWith('video/')) return 'video';
  if (fileType.startsWith('audio/')) return 'audio';
  if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('text')) return 'document';
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('tar')) return 'archive';
  
  return 'other';
};

const getFileIcon = (fileType: string | null) => {
  const category = getFileCategory(fileType);
  
  switch (category) {
    case 'image': return Image;
    case 'video': return Video;
    case 'audio': return Music;
    case 'document': return FileText;
    case 'archive': return Archive;
    default: return File;
  }
};

const getCategoryColor = (fileType: string | null) => {
  const category = getFileCategory(fileType);
  
  switch (category) {
    case 'image': return 'text-green-400 bg-green-500/20';
    case 'video': return 'text-purple-400 bg-purple-500/20';
    case 'audio': return 'text-pink-400 bg-pink-500/20';
    case 'document': return 'text-blue-400 bg-blue-500/20';
    case 'archive': return 'text-orange-400 bg-orange-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return 'Unknown size';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export default function FileCard({ file, index, onDownload, onDelete }: FileCardProps) {
  const FileIcon = getFileIcon(file.file_type);
  const categoryColor = getCategoryColor(file.file_type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 cursor-pointer group relative overflow-hidden"
    >
      {/* Project Color Accent */}
      {file.project && (
        <div 
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: file.project.color }}
        ></div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${categoryColor}`}>
          <FileIcon className="w-6 h-6" />
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this file?')) {
                onDelete();
              }
            }}
            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File Info */}
      <div className="mb-4">
        <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {file.name}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center justify-between">
            <span>Size</span>
            <span className="text-white">{formatFileSize(file.file_size)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Type</span>
            <span className="text-white capitalize">{getFileCategory(file.file_type)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Uploaded</span>
            <span className="text-white">{format(new Date(file.created_at), 'MMM dd')}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {file.project ? (
          <span className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded">
            {file.project.name}
          </span>
        ) : (
          <span className="text-xs text-gray-500">No project</span>
        )}

        {file.uploader && (
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
              {file.uploader.full_name.charAt(0)}
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
    </motion.div>
  );
}