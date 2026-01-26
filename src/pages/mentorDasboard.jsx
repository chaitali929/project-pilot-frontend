import React, { useState } from 'react';
import { 
  LayoutDashboard, CheckSquare, Users, BookOpen, 
  FileText, Briefcase, Book, Bell, User, Settings, 
  HelpCircle, Search, Filter, CheckCircle2, Clock 
} from 'lucide-react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import MentorSidebar from '../components/MentorSideBar';

const MentorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              <h3 className="text-lg font-bold">Group Overview</h3>
              <span className="bg-blue-50 text-blue-500 text-xs px-3 py-1 rounded-full font-semibold">Active</span>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-gray-600 font-medium">Project Team 1</span>
              <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded">Leader</span>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100" alt="team" />
              ))}
            </div>
          </div>

          {/* Tasks Overview */}
          <div className="col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Tasks Overview</h3>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
              <div>
                <p className="text-sm font-semibold mb-3">Done</p>
                <ul className="space-y-2">
                  {['Research', 'Analysis', 'Design'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 rounded-full bg-green-500" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-l border-gray-100 pl-4">
                <p className="text-sm font-semibold mb-3 text-gray-400">Pending</p>
                <ul className="space-y-2">
                  {['Research', 'Analysis', 'Design'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 rounded-full bg-orange-400" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Project Progress */}
          <div className="col-span-7 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-8">Project Progress</h3>
            <div className="relative flex justify-between items-center px-4">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
              <div className="absolute top-1/2 left-0 w-3/4 h-0.5 bg-blue-500 -translate-y-1/2 z-0" />
              <ProgressStep label="Topic Submitted" completed />
              <ProgressStep label="Guide Approved" completed />
              <ProgressStep label="Reports Submitted" completed />
              <ProgressStep label="Topic selected" />
            </div>
          </div>

          {/* Report Summary */}
          <div className="col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between">
            <div>
              <h3 className="text-lg font-bold">Report Summary</h3>
              <div className="mt-4">
                <p className="text-3xl font-bold">5 Reports</p>
                <p className="text-xs text-gray-400">Submitted this semester</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                <Clock size={14} /> Last Submission: 2 days ago
              </div>
            </div>
            <div className="space-y-3">
              {['ProjectPilot', 'PrePlacement-Hub', 'Quick-legal bot', 'Banking & Management'].map((name, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium">
                  <div className="w-4 h-1 rounded-full bg-blue-500" /> {name}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Upcoming deadlines</h3>
            <div className="space-y-4">
              <DeadlineItem title="Project Milestone 2" date="September 15, 2024" />
              <DeadlineItem title="Group Presentation" date="September 20, 2024" />
              <DeadlineItem title="Final Report Submission" date="September 30, 2024" />
            </div>
          </div>

          <div className="col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Recent Activities</h3>
            <div className="space-y-6">
              <ActivityItem title="Completed Design Wireframes" time="2 hrs ago" color="bg-green-500" />
              <ActivityItem title="Submitted Report" time="Yesterday" color="bg-blue-500" />
              <ActivityItem title="Group uploaded revised synopsis" time="4 days ago" color="bg-blue-500" />
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