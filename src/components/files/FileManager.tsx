import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Search, Filter, Download, Trash2, File, Image, FileText, Archive, Video, Music, FolderOpen, Grid2x2 as Grid, List } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useFileStore } from '../../stores/fileStore';
import { useProjectStore } from '../../stores/projectStore';
import FileCard from './FileCard';
import { format } from 'date-fns';

export default function FileManager() {
  const { files, loading, uploading, loadFiles, uploadFile, deleteFile, downloadFile } = useFileStore();
  const { projects, loadProjects } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadFiles();
    loadProjects();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      await uploadFile(file, filterProject !== 'all' ? filterProject : undefined);
    }
  }, [uploadFile, filterProject]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = filterProject === 'all' || file.project_id === filterProject;
    const matchesType = filterType === 'all' || getFileCategory(file.file_type) === filterType;
    
    return matchesSearch && matchesProject && matchesType;
  });

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

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const fileTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'image', label: 'Images' },
    { value: 'document', label: 'Documents' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'archive', label: 'Archives' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">File Manager</h1>
          <p className="text-gray-400">Upload, organize, and manage project files</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        {...getRootProps()}
        className={`mb-6 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-white/20 bg-white/5 hover:bg-white/10'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {isDragActive ? 'Drop files here' : 'Upload Files'}
          </h3>
          <p className="text-gray-400">
            Drag and drop files here, or click to select files
          </p>
          {uploading && (
            <div className="mt-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                Uploading...
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fileTypeOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          <div className="relative">
            <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all" className="bg-gray-800">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id} className="bg-gray-800">
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* File Content */}
      <AnimatePresence>
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-white/20 rounded mb-4"></div>
                <div className="h-3 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredFiles.length > 0 ? (
          viewMode === 'grid' ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredFiles.map((file, index) => (
                <FileCard 
                  key={file.id} 
                  file={file} 
                  index={index}
                  onDownload={() => downloadFile(file.file_path, file.name)}
                  onDelete={() => deleteFile(file.id, file.file_path)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div layout className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
              <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/20 text-sm font-medium text-gray-400">
                <div className="col-span-2">Name</div>
                <div>Size</div>
                <div>Type</div>
                <div>Project</div>
                <div>Actions</div>
              </div>
              
              {filteredFiles.map((file, index) => {
                const FileIcon = getFileIcon(file.file_type);
                
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-6 gap-4 p-4 border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <div className="col-span-2 flex items-center">
                      <FileIcon className="w-5 h-5 text-blue-400 mr-3" />
                      <div>
                        <p className="text-white font-medium truncate">{file.name}</p>
                        <p className="text-gray-400 text-xs">
                          {format(new Date(file.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      {formatFileSize(file.file_size)}
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm capitalize">
                      {getFileCategory(file.file_type)}
                    </div>
                    
                    <div className="flex items-center">
                      {file.project && (
                        <span className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded">
                          {file.project.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadFile(file.file_path, file.name)}
                        className="p-1 hover:bg-blue-500/20 text-blue-400 rounded transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteFile(file.id, file.file_path)}
                        className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No files found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterProject !== 'all' || filterType !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Upload your first file to get started'
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}