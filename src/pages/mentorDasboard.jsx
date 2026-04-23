import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CheckSquare, Users, BookOpen, 
  FileText, Briefcase, Book, Bell, User, Settings, 
  HelpCircle, Search, Filter, CheckCircle2, Clock 
} from 'lucide-react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import MentorSidebar from '../components/MentorSideBar';
import useMentorStore from '../store/mentorStore';

const MentorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { groups, topics, reports, diaries, fetchGroups, fetchReports, fetchDiaries } = useMentorStore();

  useEffect(() => {
    fetchGroups();
    fetchReports();
    fetchDiaries();
  }, [fetchGroups, fetchReports, fetchDiaries]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <MentorSidebar />
      </div>

      {/* Mobile sidebar (drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar content */}
          <div className="relative z-50 w-64 bg-white shadow-xl">
            <MentorSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar gets toggle button for mobile */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Main content */}
        <main className="p-4 sm:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Group Overview */}
          <div className="col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Groups Overview</h3>
              <span className="bg-blue-50 text-blue-500 text-xs px-3 py-1 rounded-full font-semibold">{groups.length} Groups</span>
            </div>
            {groups.length > 0 ? (
              <div className="space-y-3">
                {groups.slice(0, 3).map((group, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium text-sm">{group.groupName}</span>
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded">{group.members?.length || 0} members</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No groups assigned</p>
            )}
          </div>

          {/* Tasks Overview */}
          <div className="col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Reports Overview</h3>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
              <div>
                <p className="text-sm font-semibold mb-3">Reviewed ({reports.filter(r => r.status === 'accepted' || r.status === 'rejected').length})</p>
                <ul className="space-y-2">
                  {reports.filter(r => r.status === 'accepted' || r.status === 'rejected').slice(0, 3).map((report, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${report.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`} /> {report.title || 'Report'}
                    </li>
                  ))}
                  {reports.filter(r => r.status === 'accepted' || r.status === 'rejected').length === 0 && <li className="text-gray-400 text-xs">No reviewed reports</li>}
                </ul>
              </div>
              <div className="border-l border-gray-100 pl-4">
                <p className="text-sm font-semibold mb-3 text-gray-400">Pending ({reports.filter(r => r.status === 'pending').length})</p>
                <ul className="space-y-2">
                  {reports.filter(r => r.status === 'pending').slice(0, 3).map((report, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 rounded-full bg-orange-400" /> {report.title || 'Report'}
                    </li>
                  ))}
                  {reports.filter(r => r.status === 'pending').length === 0 && <li className="text-gray-400 text-xs">No pending reports</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Project Progress */}
          <div className="col-span-7 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-8">Diaries Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Diaries</span>
                <span className="text-2xl font-bold">{diaries.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Reviewed</span>
                <span className="text-lg font-semibold text-green-600">{diaries.filter(d => d.status === 'reviewed').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pending Review</span>
                <span className="text-lg font-semibold text-orange-600">{diaries.filter(d => d.status === 'pending').length}</span>
              </div>
            </div>
          </div>

          {/* Report Summary */}
          <div className="col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between">
            <div>
              <h3 className="text-lg font-bold">Report Summary</h3>
              <div className="mt-4">
                <p className="text-3xl font-bold">{reports.length} Reports</p>
                <p className="text-xs text-gray-400">Total submissions</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                <Clock size={14} /> {reports.length > 0 ? `Last: ${new Date(reports[reports.length - 1]?.createdAt).toLocaleDateString()}` : 'No submissions'}
              </div>
            </div>
            <div className="space-y-3">
              {reports.slice(0, 4).map((report, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium">
                  <div className={`w-4 h-1 rounded-full ${report.status === 'accepted' ? 'bg-green-500' : report.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'}`} /> {report.title || `Report ${i + 1}`}
                </div>
              ))}
              {reports.length === 0 && <p className="text-gray-400 text-xs">No reports yet</p>}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Pending Reviews</h3>
            <div className="space-y-4">
              {reports.filter(r => r.status === 'pending').slice(0, 3).map((report, idx) => (
                <DeadlineItem key={idx} title={report.title || 'Report'} date={new Date(report.createdAt).toLocaleDateString()} />
              ))}
              {reports.filter(r => r.status === 'pending').length === 0 && <p className="text-gray-400 text-sm">No pending reviews</p>}
            </div>
          </div>

          <div className="col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Recent Activities</h3>
            <div className="space-y-6">
              {reports.slice(-3).reverse().map((report, idx) => (
                <ActivityItem key={idx} title={`${report.status === 'pending' ? 'New' : 'Reviewed'} Report: ${report.title || 'Untitled'}`} time={new Date(report.createdAt).toLocaleDateString()} color={report.status === 'accepted' ? 'bg-green-500' : report.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'} />
              ))}
              {reports.length === 0 && <p className="text-gray-400 text-sm">No recent activities</p>}
            </div>
          </div>

          <div className="col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Calendar</h3>
                <span className="text-sm font-semibold">August 5, 2025</span>
             </div>
             {/* Simplified Calendar Visual */}
             <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-gray-400 py-2">{d}</div>)}
                {Array.from({length: 31}).map((_, i) => (
                  <div key={i} className={`py-2 rounded-lg ${i === 14 ? 'bg-red-500 text-white' : i === 21 ? 'bg-blue-500 text-white' : i === 25 ? 'bg-orange-400 text-white' : ''}`}>
                    {i + 1}
                  </div>
                ))}
             </div>
          </div>

        </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}>
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const ProgressStep = ({ label, completed = false }) => (
  <div className="relative z-10 flex flex-col items-center gap-2">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${completed ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-300'}`}>
      <CheckCircle2 size={20} />
    </div>
    <span className="text-[10px] font-semibold text-gray-500 absolute -bottom-6 whitespace-nowrap">{label}</span>
  </div>
);

const DeadlineItem = ({ title, date }) => (
  <div className="flex gap-3">
    <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-400 font-bold text-[10px]">!</div>
    <div>
      <p className="text-xs font-bold leading-tight">{title}</p>
      <p className="text-[10px] text-gray-400">{date}</p>
    </div>
  </div>
);

const ActivityItem = ({ title, time, color }) => (
  <div className="flex gap-4 relative">
    <div className={`w-1 h-10 rounded-full ${color}`} />
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  </div>
);

export default MentorDashboard;