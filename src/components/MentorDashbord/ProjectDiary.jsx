import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  TrendingUp,
  Calendar,
  Users,
  Filter,
  X
} from 'lucide-react';
import MentorSideBar from "../MentorSideBar";
import Topbar from "../Topbar";
import ProjectDiary1Modal from './ProjectDiary1';
import useMentorStore from '../../store/mentorStore';

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm border border-slate-50 min-w-[180px] flex-1">
    <div className={`p-3 rounded-xl mb-4 ${color.bg}`}>
      <Icon className={color.text} size={24} />
    </div>
    <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
    <div className="text-sm text-slate-400 font-medium">{label}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Reviewed: "bg-blue-50 text-blue-500 border-blue-100",
    Attention: "bg-orange-50 text-orange-500 border-orange-100",
    Overdue: "bg-red-50 text-red-500 border-red-100"
  };
  const Icons = {
    Reviewed: CheckCircle2,
    Attention: AlertCircle,
    Overdue: AlertCircle
  };
  const Icon = Icons[status];

  return (
    <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium w-32 mx-auto ${styles[status]}`}>
      <Icon size={16} />
      {status}
    </div>
  );
};

export default function MentorProjectDiary() {
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { diaries, fetchDiaries, isLoading } = useMentorStore();

  useEffect(() => {
    fetchDiaries();
  }, [fetchDiaries]);

  const filteredDiaries = diaries.filter(diary => 
    diary.groupId?.groupName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = diaries.filter(d => d.status === 'pending').length;

  const handleActionClick = (diary) => {
    setSelectedDiary(diary);
    setShowDiaryModal(true);
  };

  const handleCloseDiaryModal = () => {
    setShowDiaryModal(false);
    setSelectedDiary(null);
    fetchDiaries();
  };
  return (
    <div className="min-h-screen flex bg-gray-50">
      <MentorSideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Project Diary</h1>
            </div>
        
        {/* Stat Cards Row */}
        <div className="flex flex-wrap gap-6 mb-8">
          <StatCard icon={Users} value={diaries.length} label="Total Entries" color={{ bg: 'bg-emerald-50', text: 'text-emerald-500' }} />
          <StatCard icon={Clock} value={pendingCount} label="Pending Reviews" color={{ bg: 'bg-amber-50', text: 'text-amber-500' }} />
          <StatCard icon={CheckCircle2} value={diaries.length - pendingCount} label="Reviewed" color={{ bg: 'bg-blue-50', text: 'text-blue-500' }} />
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm">All</button>
              <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors">
                Pending
              </button>
              <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors">
                Reviewed
              </button>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-sky-500 text-sky-600 rounded-lg font-medium text-sm hover:bg-sky-50 transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Team</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Week/Dates</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Summary</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Proof of Work</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Grade</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Loading diaries...
                  </td>
                </tr>
              ) : filteredDiaries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No diary entries found
                  </td>
                </tr>
              ) : (
                filteredDiaries.map((diary) => (
                <tr key={diary._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-semibold text-sm text-slate-800">{diary.groupId?.groupName || 'Unknown'}</span>
                      <div className="flex -space-x-1">
                        {diary.groupId?.members?.slice(0, 4).map((member, i) => {
                          const initial = member.userId?.email?.charAt(0).toUpperCase() || '?';
                          return (
                            <div 
                              key={i}
                              className="w-6 h-6 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-white text-xs font-semibold"
                              title={member.userId?.email}
                            >
                              {initial}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-semibold text-sm text-slate-800">Week {diary.week}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(diary.dateRange.startDate).toLocaleDateString()} - {new Date(diary.dateRange.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 leading-relaxed max-w-xs line-clamp-2">
                      {diary.summary}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText size={18} className="text-blue-500" />
                      </div>
                      <span className="text-xs text-slate-500">{diary.proofOfWork?.length || 0} files</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={diary.status === 'reviewed' ? 'Reviewed' : 'Attention'} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-lg text-slate-700">{diary.grade || '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleActionClick(diary)}
                      className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                  </td>
                </tr>
              )))
              }
            </tbody>
          </table>
        </div>
          </div>
        </main>
      </div>

      {/* ProjectDiary1 Modal */}
      <ProjectDiary1Modal 
        isOpen={showDiaryModal}
        onClose={handleCloseDiaryModal}
        diary={selectedDiary}
      />
    </div>
  );
}