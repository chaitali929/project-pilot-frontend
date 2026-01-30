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
        <div className="flex flex-wrap gap-6 mb-8">
          <StatCard icon={Users} value="12" label="Active Teams" color={{ bg: 'bg-emerald-50', text: 'text-emerald-500' }} />
          <StatCard icon={Clock} value="5" label="Pending Reviews" color={{ bg: 'bg-amber-50', text: 'text-amber-500' }} />
          <StatCard icon={AlertCircle} value="2" label="Overdue Logs" color={{ bg: 'bg-rose-50', text: 'text-rose-500' }} />
          <StatCard icon={TrendingUp} value="68%" label="Average Progress" color={{ bg: 'bg-indigo-50', text: 'text-indigo-500' }} />
          <StatCard icon={Calendar} value="Oct 27, 2024" label="Next Deadline" color={{ bg: 'bg-purple-50', text: 'text-purple-500' }} />
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search teams..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm">Active</button>
              <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors">
                Inactive
              </button>
              <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors">
                Completed
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
              {MOCK_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-semibold text-sm text-slate-800">{item.team}</span>
                      <div className="flex -space-x-1">
                        {[1, 2, 3, 4].map(i => (
                          <img 
                            key={i}
                            src={`https://i.pravatar.cc/100?u=${item.id}${i}`} 
                            className="w-6 h-6 rounded-full border-2 border-white"
                            alt="member"
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-semibold text-sm text-slate-800">{item.week}</div>
                    <div className="text-xs text-slate-500">{item.dates}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
                      {item.summary}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {item.type === 'pdf' ? <FileText size={18} className="text-blue-500" /> : <ImageIcon size={18} className="text-blue-500" />}
                      </div>
                      <span className="text-xs text-slate-500">{item.pow}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-lg text-slate-700">{item.grade}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
                      <Edit3 size={16} />
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