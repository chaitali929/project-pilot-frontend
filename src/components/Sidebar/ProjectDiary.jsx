import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle, Star, Search, Filter, ArrowUpDown, 
  Plus, ChevronDown, ChevronUp, X, Info, Upload
} from 'lucide-react';
import useDiaryStore from '../../store/diaryStore';
import useGroupStore from '../../store/GroupStore';
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';

const ProjectDiary = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEntry, setExpandedEntry] = useState(null);

  const { diaries, fetchDiaries, submitDiary, isLoading } = useDiaryStore();
  const { groups, fetchGroups } = useGroupStore();
  const [currentGroupId, setCurrentGroupId] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (groups.length > 0) {
      const acceptedGroup = groups.find(g => g.members?.some(m => m.status === 'accepted'));
      if (acceptedGroup) {
        setCurrentGroupId(acceptedGroup._id);
        fetchDiaries(acceptedGroup._id);
      }
    }
  }, [groups, fetchDiaries]);

  const filteredEntries = diaries.filter(entry => 
    entry.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `Week ${entry.week}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const submittedCount = diaries.length;
  const totalWeeks = 12;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="p-6 overflow-auto">
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-10">Project Dairy</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<Calendar className="text-blue-500" />} label={`${totalWeeks} Weeks`} sub="Total Duration" />
        <StatCard icon={<CheckCircle className="text-emerald-500" />} label={`${submittedCount} Entries`} sub="Submitted" />
        <StatCard icon={<Star className="text-purple-500" />} label={`${submittedCount}`} sub="Total Entries" />
      </div>

      {/* Filters Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm" 
            placeholder="Search entries..." 
          />
        </div>
      </div>

      {/* Entries Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading entries...</div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No diary entries found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEntries.map((entry) => (
            <DiaryCard 
              key={entry._id} 
              entry={entry}
              isExpanded={expandedEntry === entry._id}
              onToggle={() => setExpandedEntry(expandedEntry === entry._id ? null : entry._id)}
            />
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 bg-[#0070D2] text-white px-6 py-4 rounded-2xl flex items-center gap-2 shadow-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 z-40"
      >
        <Plus size={20} strokeWidth={3} />
        <span className="font-bold">New Entry</span>
      </button>

            {isModalOpen && (
              <NewEntryModal 
                onClose={() => setIsModalOpen(false)} 
                currentGroupId={currentGroupId}
                onSuccess={() => {
                  setIsModalOpen(false);
                  if (currentGroupId) fetchDiaries(currentGroupId);
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ icon, label, sub }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-2xl font-black text-slate-800">{label}</p>
      <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{sub}</p>
    </div>
  </div>
);

const DiaryCard = ({ entry, isExpanded, onToggle }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const completedTasks = entry.tasks?.filter(t => t.completed).length || 0;
  const totalTasks = entry.tasks?.length || 0;

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm group hover:border-blue-200 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-800">Week {entry.week}</h3>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            {formatDate(entry.dateRange.startDate)} - {formatDate(entry.dateRange.endDate)}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100 flex items-center gap-1">
            <CheckCircle size={10}/> Submitted
          </span>
          <button onClick={onToggle}>
            {isExpanded ? <ChevronUp size={16} className="text-slate-500 cursor-pointer" /> : <ChevronDown size={16} className="text-slate-300 group-hover:text-slate-500 cursor-pointer" />}
          </button>
        </div>
      </div>
      
      <p className={`text-slate-600 text-[14px] leading-relaxed mb-4 italic ${!isExpanded && 'line-clamp-3'}`}>
        {entry.summary}
      </p>

      {isExpanded && (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-bold text-slate-700">Tasks ({completedTasks}/{totalTasks} completed):</p>
          {entry.tasks?.map((task, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle size={14} className={task.completed ? 'text-green-500' : 'text-slate-300'} />
              <span className={task.completed ? 'line-through text-slate-400' : ''}>{task.description}</span>
            </div>
          ))}
          {entry.proofOfWork?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-700 mb-2">Proof of Work ({entry.proofOfWork.length} files):</p>
              <div className="flex flex-wrap gap-2">
                {entry.proofOfWork.map((file, idx) => (
                  <a 
                    key={idx}
                    href={`http://localhost:3000/uploads/proofOfWork/${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100"
                  >
                    File {idx + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {entry.status === 'reviewed' && entry.mentorFeedback ? (
        <div className="bg-blue-50 p-5 rounded-2xl border-l-4 border-blue-500">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Mentor Feedback</p>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">"{entry.mentorFeedback}"</p>
        </div>
      ) : (
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-xs italic">
          Awaiting mentor review
        </div>
      )}
    </div>
  );
};

const NewEntryModal = ({ onClose, currentGroupId, onSuccess }) => {
  const [week, setWeek] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState("");
  const [tasks, setTasks] = useState([{ description: "", completed: false }]);
  const [taskText, setTaskText] = useState("");
  const [proofFiles, setProofFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { submitDiary } = useDiaryStore();

  const handleAddTask = () => {
    if (taskText.trim()) {
      setTasks([...tasks, { description: taskText, completed: false }]);
      setTaskText("");
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setProofFiles([...proofFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setProofFiles(proofFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentGroupId) {
      alert('No group found');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('groupId', currentGroupId);
    formData.append('week', week);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('summary', summary);
    formData.append('tasks', JSON.stringify(tasks));
    
    proofFiles.forEach(file => {
      formData.append('proofOfWork', file);
    });

    try {
      await submitDiary(formData);
      onSuccess();
    } catch (err) {
      console.error('Failed to submit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">New Dairy Entry</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Week Number</label>
                <input
                  type="number"
                  min="1"
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                  required
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  min={startDate}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Progress Summary */}
            <div>
              <label className="text-sm font-bold text-slate-700 mb-3 block flex items-center gap-2">
                <Info size={16} className="text-blue-500" /> Progress Summary
              </label>
              <textarea 
                placeholder="This weeks summary..........."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                maxLength={1000}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all h-28 resize-none text-sm leading-relaxed"
              />
              <p className="text-xs text-slate-400 mt-1">{summary.length}/1000</p>
            </div>

            {/* Tasks Container */}
            <div>
              <label className="text-sm font-bold text-slate-700 mb-3 block">Tasks</label>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  placeholder="Enter your tasks" 
                  className="flex-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none text-sm"
                />
                <button 
                  type="button"
                  onClick={handleAddTask}
                  className="px-5 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {tasks.map((task, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm text-slate-700">{task.description}</span>
                    <button 
                      type="button"
                      onClick={() => removeTask(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Proof of Work */}
            <div>
              <label className="text-sm font-bold text-slate-700 mb-3 block">Proof of Work</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl h-32 cursor-pointer hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 text-slate-400" />
                <p className="text-sm text-slate-500 mt-2">Upload files</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.jpg,.jpeg,.png,.zip"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {proofFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {proofFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-700 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Entry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectDiary;