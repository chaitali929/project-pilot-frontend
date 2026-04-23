import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useWorkspaceStore from '../store/workspaceStore';
import useUserStore from '../store/userStore';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import '../styles/prism-zencode.css';
import { 
  Folder, File, ChevronRight, Search, 
  ArrowLeft, Plus, MessageSquare, Send,
  ChevronDown, FileText, Code, Image,
  FileJson, Settings, Database, Globe,
  MoreVertical, Trash2
} from 'lucide-react';

const View_workspace = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [activeFile, setActiveFile] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [openCommentMenu, setOpenCommentMenu] = useState(null);
  
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const { currentWorkspace, loading, error, getWorkspaceById, loadWorkspaceFiles, addComment, refreshComments, deleteComment, updateCurrentWorkspace } = useWorkspaceStore();
  const { user, initializeUser } = useUserStore();

  useEffect(() => {
    if (workspaceId) {
      loadWorkspaceWithRetry();
    }
  }, [workspaceId]);

  const loadWorkspaceWithRetry = async () => {
    try {
      setIsRetrying(false);
      await getWorkspaceById(workspaceId);
      setRetryCount(0);
    } catch (error) {
      if (retryCount < 2 && (error.code === 'ECONNABORTED' || error.message.includes('timeout'))) {
        setRetryCount(prev => prev + 1);
        setIsRetrying(true);
        setTimeout(() => {
          loadWorkspaceWithRetry();
        }, 2000);
      }
    }
  };

  const handleManualRetry = () => {
    setRetryCount(0);
    loadWorkspaceWithRetry();
  };

  // Initialize user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      initializeUser();
    }
  }, [initializeUser, user]);

  // Poll for new comments every 10 seconds (reduced frequency)
  useEffect(() => {
    if (!workspaceId) return;
    
    const interval = setInterval(() => {
      refreshComments(workspaceId);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [workspaceId, refreshComments]);

  // Load Prism languages dynamically
  useEffect(() => {
    const loadPrismLanguages = async () => {
      try {
        await import('prismjs/components/prism-javascript');
        await import('prismjs/components/prism-typescript');
        await import('prismjs/components/prism-python');
        await import('prismjs/components/prism-java');
        await import('prismjs/components/prism-json');
        await import('prismjs/components/prism-css');
      } catch (error) {
        console.warn('Failed to load some Prism languages:', error);
      }
    };
    loadPrismLanguages();
  }, []);

  useEffect(() => {
    if (currentWorkspace?.files?.length > 0 && !activeFile) {
      setActiveFile(currentWorkspace.files[0].path);
    }
  }, [currentWorkspace, activeFile]);
  const fileTree = useMemo(() => {
    if (!currentWorkspace?.files) return {};
    
    const tree = {};
    currentWorkspace.files.forEach(file => {
      const parts = file.path.split('/');
      let current = tree;
      
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = { ...file, isFile: true };
        } else {
          if (!current[part]) {
            current[part] = { isFolder: true, children: {} };
          }
          current = current[part].children;
        }
      });
    });
    
    return tree;
  }, [currentWorkspace?.files]);

  // Filtered files for search
  const filteredFiles = useMemo(() => {
    if (!searchTerm || !currentWorkspace?.files) return currentWorkspace?.files || [];
    return currentWorkspace.files.filter(file => 
      file.path.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentWorkspace?.files, searchTerm]);

  // Get file icon based on extension
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': case 'jsx': case 'ts': case 'tsx': case 'py': case 'java': case 'cpp': case 'c': case 'cs':
        return <Code size={14} className="text-blue-500" />;
      case 'json': case 'xml': case 'yaml': case 'yml':
        return <FileJson size={14} className="text-yellow-500" />;
      case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg':
        return <Image size={14} className="text-green-500" />;
      case 'html': case 'css':
        return <Globe size={14} className="text-orange-500" />;
      case 'sql': case 'db':
        return <Database size={14} className="text-purple-500" />;
      case 'config': case 'env': case 'ini':
        return <Settings size={14} className="text-gray-500" />;
      default:
        return <FileText size={14} className="text-gray-500" />;
    }
  };

  // Toggle folder expansion
  const toggleFolder = (folderPath) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  // Render file tree recursively
  const renderFileTree = (tree, basePath = '') => {
    return Object.entries(tree).map(([name, item]) => {
      const fullPath = basePath ? `${basePath}/${name}` : name;
      
      if (item.isFile) {
        return (
          <div 
            key={fullPath}
            onClick={() => setActiveFile(item.path)}
            className={`flex items-center gap-2 text-sm cursor-pointer p-1 rounded ml-4 hover:bg-gray-100 ${
              activeFile === item.path ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            {getFileIcon(name)}
            <span className="truncate">{name}</span>
          </div>
        );
      } else {
        const isExpanded = expandedFolders.has(fullPath);
        return (
          <div key={fullPath}>
            <div 
              onClick={() => toggleFolder(fullPath)}
              className="flex items-center gap-2 text-sm cursor-pointer p-1 rounded hover:bg-gray-100 text-gray-700"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Folder size={14} className="text-blue-500" />
              <span>{name}</span>
            </div>
            {isExpanded && (
              <div className="ml-4">
                {renderFileTree(item.children, fullPath)}
              </div>
            )}
          </div>
        );
      }
    });
  };

  // Highlight syntax and search term
  const getHighlightedContent = (content, searchTerm, language) => {
    if (!content) return 'File content not available';
    
    let highlightedContent = content;
    
    // Apply syntax highlighting
    if (language && Prism.languages[language]) {
      highlightedContent = Prism.highlight(content, Prism.languages[language], language);
    }
    
    // Apply search highlighting on top of syntax highlighting
    if (searchTerm) {
      const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      highlightedContent = highlightedContent.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    }
    
    return highlightedContent;
  };
  // Get Prism language identifier
  const getPrismLanguage = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': case 'jsx': return 'javascript';
      case 'ts': case 'tsx': return 'typescript';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'json': return 'json';
      case 'html': return 'markup';
      case 'css': return 'css';
      default: return null;
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const tempComment = {
      _id: Date.now().toString(),
      message: newComment,
      userId: { email: user?.email || 'You' },
      createdAt: new Date().toISOString()
    };
    
    // Clear input immediately
    setNewComment('');
    
    // Optimistic update - add comment to UI immediately
    const originalComments = currentWorkspace.comments || [];
    const updatedComments = [...originalComments, tempComment];
    
    updateCurrentWorkspace({
      ...currentWorkspace,
      comments: updatedComments
    });
    
    try {
      const result = await addComment(workspaceId, tempComment.message);
      if (result.success) {
        // Replace temp comment with real comment from backend
        refreshComments(workspaceId);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      // Revert on error
      updateCurrentWorkspace({
        ...currentWorkspace,
        comments: originalComments
      });
      // Restore the comment text on error
      setNewComment(tempComment.message);
    }
  };

  const handleRetryClone = async () => {
    try {
      const { workspaceAPI } = await import('../api');
      await workspaceAPI.retryClone(workspaceId);
      // Refresh workspace data
      getWorkspaceById(workspaceId);
    } catch (error) {
      console.error('Retry clone error:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setOpenCommentMenu(null);
    
    // Optimistic update - remove comment from UI immediately
    const originalComments = currentWorkspace.comments;
    const updatedComments = originalComments.filter(comment => comment._id !== commentId);
    
    // Update UI immediately
    updateCurrentWorkspace({
      ...currentWorkspace,
      comments: updatedComments
    });
    
    try {
      // Make backend call
      await deleteComment(workspaceId, commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      // Revert on error
      updateCurrentWorkspace({
        ...currentWorkspace,
        comments: originalComments
      });
    }
  };

  // Check if current user is group admin
  const isGroupAdmin = currentWorkspace?.groupId?.admin?.toString() === user?.id?.toString();


  // Close comment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openCommentMenu !== null && !event.target.closest('.comment-menu')) {
        setOpenCommentMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openCommentMenu]);

  // Show loading state if we have workspace but files are still loading
  const isLoadingFiles = currentWorkspace && 
                        currentWorkspace.status === 'ready' && 
                        (!currentWorkspace.files || currentWorkspace.files.length === 0) &&
                        !error;

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Left Sidebar Skeleton */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="p-4 flex-1">
            <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex-1"></div>
            <div className="h-8 w-96 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex-1"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 p-6">
            <div className="bg-white rounded-xl border h-full flex flex-col">
              <div className="h-12 bg-gray-100 border-b flex items-center px-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex-1 p-4">
                <div className="space-y-4">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{width: `${Math.random() * 40 + 60}%`}}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar Skeleton */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="h-6 w-24 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-xl">
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!loading && !currentWorkspace) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <div className="text-xl font-semibold text-gray-700 mb-4">Workspace not found</div>
        {error && (
          <div className="text-red-500 text-sm mb-4">
            Error: {error}
            {error.includes('timeout') && (
              <div className="mt-2">
                <span className="text-gray-600">The workspace is large and taking time to load.</span>
                {isRetrying && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-blue-600">Retrying... ({retryCount}/2)</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="flex gap-3">
          <button 
            onClick={handleManualRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={isRetrying}
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
          <button 
            onClick={() => navigate('/StudentDashboard/Workspace')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Left Sidebar - File Explorer */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <button 
            onClick={() => navigate('/StudentDashboard/Workspace')}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
          >
            <ArrowLeft size={16} /> Back to Workspace
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 text-sm font-semibold mb-4">
            <ChevronRight size={14} /> {currentWorkspace.name}
            <span className={`ml-2 px-2 py-1 text-xs rounded ${
              currentWorkspace.status === 'ready' ? 'bg-green-100 text-green-700' :
              currentWorkspace.status === 'cloning' ? 'bg-blue-100 text-blue-700' :
              currentWorkspace.status === 'error' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {currentWorkspace.status}
            </span>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-1">
            {currentWorkspace.status === 'cloning' ? (
              <div className="text-blue-500 text-sm flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                Cloning repository...
              </div>
            ) : currentWorkspace.status === 'error' ? (
              <div className="space-y-3">
                <div className="text-red-500 text-sm">
                  Error: {currentWorkspace.errorMessage || 'Failed to clone repository'}
                </div>
                {currentWorkspace.type === 'git' && (
                  <button
                    onClick={handleRetryClone}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Retry Clone
                  </button>
                )}
              </div>
            ) : loading && currentWorkspace ? (
              <div className="text-blue-500 text-sm flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                Loading workspace content...
              </div>
            ) : searchTerm ? (
              // Show filtered files when searching
              filteredFiles.length > 0 ? (
                filteredFiles.map(file => (
                  <div 
                    key={file.path}
                    onClick={() => setActiveFile(file.path)}
                    className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded hover:bg-gray-100 ${
                      activeFile === file.path ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                    }`}
                  >
                    {getFileIcon(file.path)}
                    <span className="truncate">{file.path}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm">No files found</div>
              )
            ) : currentWorkspace.files?.length > 0 ? (
              renderFileTree(fileTree)
            ) : isLoadingFiles ? (
              <div className="space-y-2">
                <div className="text-blue-500 text-sm flex items-center gap-2 mb-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  Loading files...
                </div>
                {/* Skeleton folder structure */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 p-1">
                    <ChevronRight size={14} className="text-gray-300" />
                    <Folder size={14} className="text-gray-300" />
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="ml-4 space-y-1">
                    <div className="flex items-center gap-2 p-1 ml-4">
                      <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2 p-1 ml-4">
                      <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-1">
                    <ChevronRight size={14} className="text-gray-300" />
                    <Folder size={14} className="text-gray-300" />
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2 p-1 ml-4">
                    <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-28 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2 p-1 ml-4">
                    <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No files available</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Center - Read-Only Editor */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="font-bold text-blue-600 text-xl flex items-center gap-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">P</div>
            ProjectPilot
          </div>
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search in file content" 
              value={contentSearchTerm}
              onChange={(e) => setContentSearchTerm(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold">Anuj Dighe</div>
              <div className="text-xs text-gray-400">Student</div>
            </div>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anuj" className="w-10 h-10 rounded-full bg-orange-100" alt="profile" />
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
            {/* File Tab */}
            <div className="flex bg-gray-50 border-b border-gray-200">
              {activeFile && (
                <div className="flex items-center px-6 py-3 text-sm bg-white border-b-2 border-b-blue-500 font-medium">
                  {getFileIcon(activeFile)}
                  <span className="ml-2">{activeFile.split('/').pop()}</span>
                  <span className="ml-2 text-xs text-gray-400">({activeFile})</span>
                </div>
              )}
            </div>
            
            {/* Code Editor */}
            <div className="flex-1 overflow-hidden">
              {activeFile ? (
                <div className="h-full flex">
                  {/* Line Numbers */}
                  <div className="bg-gray-50 border-r border-gray-200 px-3 py-4 text-xs font-mono text-gray-400 select-none">
                    {currentWorkspace.files?.find(f => f.path === activeFile)?.content?.split('\n').map((_, index) => (
                      <div key={index + 1} className="leading-6">
                        {index + 1}
                      </div>
                    )) || <div>1</div>}
                  </div>
                  
                  {/* Code Content */}
                  <div className="flex-1 p-4 text-sm font-mono text-gray-800 overflow-auto bg-white w-200">
                    <pre className="whitespace-pre-wrap break-words w-200 overflow-x-auto">
                      <code 
                        className={`language-${getPrismLanguage(activeFile) || 'text'}`}
                        dangerouslySetInnerHTML={{
                          __html: getHighlightedContent(
                            currentWorkspace.files?.find(f => f.path === activeFile)?.content,
                            contentSearchTerm,
                            getPrismLanguage(activeFile)
                          )
                        }}
                      />
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <File size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Select a file to view its content</p>
                    <p className="text-sm text-gray-400 mt-2">Choose a file from the explorer to start viewing</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* File Info Footer */}
            {activeFile && (
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-2 text-xs text-gray-500 flex justify-between">
                <span>
                  {currentWorkspace.files?.find(f => f.path === activeFile)?.type || 'text'} • 
                  {currentWorkspace.files?.find(f => f.path === activeFile)?.size ? 
                    `${(currentWorkspace.files.find(f => f.path === activeFile).size / 1024).toFixed(1)} KB` : 
                    'Unknown size'
                  }
                </span>
                <span>
                  {currentWorkspace.files?.find(f => f.path === activeFile)?.content?.split('\n').length || 0} lines
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Comments/Activity */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
          <MessageSquare size={20} className="text-gray-400" /> Comments
        </h2>
        
        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
        
        <div className="space-y-4">
          {!currentWorkspace.comments || currentWorkspace.comments.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-8">
              No comments yet
            </div>
          ) : (
            currentWorkspace.comments.map((comment, i) => (
              <div key={comment._id || i} className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow relative">
                {isGroupAdmin && (
                  <div className="absolute top-2 right-2 comment-menu">
                    <button
                      onClick={() => setOpenCommentMenu(openCommentMenu === i ? null : i)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical size={14} className="text-gray-400" />
                    </button>
                    {openCommentMenu === i && (
                      <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[100px]">
                        <button
                          onClick={() => {
                            console.log('Deleting comment:', comment._id);
                            handleDeleteComment(comment._id);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left whitespace-nowrap"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                    {comment.userId?.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-sm truncate">{comment.userId?.email}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{comment.message}</p>
                <div className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default View_workspace;