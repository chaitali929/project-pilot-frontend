import React, { useState } from 'react';
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

const MOCK_DATA = [
  { id: 1, team: 'Group No.1', week: 'Week-5', dates: 'Oct-14-20', summary: 'Completed the backend API integration for real-time location tracking. Implemented WebSocket connection for live updates and tested with', pow: 'pow.pdf', type: 'pdf', status: 'Reviewed', grade: '+8' },
  { id: 3, team: 'Group No.3', week: 'Week-5', dates: 'Oct-14-20', summary: 'Completed the backend API integration for real-time location tracking. Implemented WebSocket connection for live updates and tested with', pow: 'Pow.jpeg', type: 'image', status: 'Attention', grade: '+10' },
  { id: 4, team: 'Group No.4', week: 'Week-5', dates: 'Oct-14-20', summary: 'Completed the backend API integration for real-time location tracking. Implemented WebSocket connection for live updates and tested with', pow: 'pow.pdf', type: 'pdf', status: 'Overdue', grade: '+7' },
  { id: 7, team: 'Group No.7', week: 'Week-5', dates: 'Oct-14-20', summary: 'Completed the backend API integration for real-time location tracking. Implemented WebSocket connection for live updates and tested with', pow: 'pow.pdf', type: 'pdf', status: 'Reviewed', grade: '+9' },
];

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
        <div className="flex flex-wrap gap-6">
          <StatCard icon={Users} value="12" label="Active Teams" color={{ bg: 'bg-emerald-50', text: 'text-emerald-500' }} />
          <StatCard icon={Clock} value="5" label="Pending Reviews" color={{ bg: 'bg-amber-50', text: 'text-amber-500' }} />
          <StatCard icon={AlertCircle} value="2" label="Overdue Logs" color={{ bg: 'bg-rose-50', text: 'text-rose-500' }} />
          <StatCard icon={TrendingUp} value="68%" label="Average Progress" color={{ bg: 'bg-indigo-50', text: 'text-indigo-500' }} />
          <StatCard icon={Calendar} value="Oct 27, 2024" label="Next Deadline" color={{ bg: 'bg-purple-50', text: 'text-purple-500' }} />
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search teams..." 
                className="w-full pl-12 pr-10 py-3 bg-slate-100/50 border-none rounded-2xl text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg shadow-sm">
                <Filter size={14} className="text-slate-400" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm">Active</button>
              <button className="px-4 py-3 bg-slate-100 text-slate-400 rounded-xl font-medium text-sm flex items-center gap-2">
                Inactive <X size={14} />
              </button>
              <button className="px-4 py-3 bg-slate-100 text-slate-400 rounded-xl font-medium text-sm flex items-center gap-2">
                Completed <X size={14} />
              </button>
            </div>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 border-2 border-sky-400 text-sky-500 rounded-xl font-bold text-sm hover:bg-sky-50 transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 text-slate-500 text-sm font-medium">
                <th className="px-8 py-6 text-center border-r border-slate-50">Team</th>
                <th className="px-8 py-6 text-center border-r border-slate-50">Weeks/dates</th>
                <th className="px-8 py-6 border-r border-slate-50 w-[40%] text-center">Summary</th>
                <th className="px-8 py-6 text-center border-r border-slate-50">Proof of work</th>
                <th className="px-8 py-6 text-center border-r border-slate-50">Status</th>
                <th className="px-8 py-6 text-center border-r border-slate-50">Grades</th>
                <th className="px-8 py-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_DATA.map((item) => (
                <tr key={item.id} className="text-slate-700">
                  <td className="px-8 py-6 border-r border-slate-50">
                    <div className="flex flex-col items-center gap-3">
                      <span className="font-bold text-sm">{item.team}</span>
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                          <img 
                            key={i}
                            src={`https://i.pravatar.cc/100?u=${item.id}${i}`} 
                            className="w-8 h-8 rounded-full border-2 border-white"
                            alt="member"
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center border-r border-slate-50">
                    <div className="font-bold text-sm mb-1">{item.week}</div>
                    <div className="text-xs text-indigo-300 font-medium">{item.dates}</div>
                  </td>
                  <td className="px-8 py-6 border-r border-slate-50">
                    <p className="text-xs text-slate-500 leading-relaxed text-center">
                      {item.summary}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-center border-r border-slate-50">
                    <div className="flex flex-col items-center gap-1">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-400">
                        {item.type === 'pdf' ? <FileText size={20} /> : <ImageIcon size={20} />}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{item.pow}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center border-r border-slate-50">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-8 py-6 text-center border-r border-slate-50 font-bold text-lg text-slate-600">
                    {item.grade}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
                      <Edit3 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </div>
        </main>
      </div>
    </div>
  );
}