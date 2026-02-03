import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import CoordinatorSidebar from '../components/CoordinatorSideBar';
import { 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Users, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

const TeamPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    BE: true,
    TE: true,
    SE: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const groupData = [
    {
      id: 1,
      groupNo: 'Group 1',
      projectName: 'ProjectPilot : Mini Project........',
      mentor: { name: 'Prof. Davis', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
      members: ['A', 'B', 'C', 'D'],
      vacancy: '4/4',
      vacancyStatus: 'full'
    },
    {
      id: 2,
      groupNo: 'Group 2',
      projectName: 'ProjectPilot : Mini Project........',
      mentor: { name: 'Prof. Davis', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb' },
      members: ['E', 'F', 'G'],
      vacancy: '3/4',
      vacancyStatus: 'partial'
    },
    {
      id: 3,
      groupNo: 'Group 2',
      projectName: 'ProjectPilot : Mini Project........',
      mentor: null,
      members: ['H', 'I', 'J'],
      vacancy: '3/4',
      vacancyStatus: 'partial'
    }
  ];

  const TableSection = ({ title, isOpen, onToggle }) => (
    <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden mb-6">
      <div 
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="text-slate-400">
            {isOpen ? <ChevronDown size={20} /> : <ChevronDown size={20} className="-rotate-90" />}
          </div>
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-500 text-[10px] font-bold rounded-full">
            26 Groups • 104 Students
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-y border-slate-50">
                <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Group No</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mentor Assigned</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Members</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Vacancy</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {groupData.map((group, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">{group.groupNo}</td>
                  <td className="px-6 py-4 text-sm text-slate-800 font-medium">{group.projectName}</td>
                  <td className="px-6 py-4">
                    {group.mentor ? (
                      <div className="flex items-center gap-2">
                        <img src={group.mentor.image} className="w-6 h-6 rounded-full border border-slate-100" alt="" />
                        <span className="text-sm text-slate-600">{group.mentor.name}</span>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-red-50 text-red-400 text-xs font-bold rounded-full">
                        Needs Mentor
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center -space-x-2">
                      {group.members.map((m, i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m}`} alt="" />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`
                        px-3 py-1 rounded-full text-[11px] font-bold
                        ${group.vacancyStatus === 'full' 
                          ? 'bg-emerald-50 text-emerald-500' 
                          : 'bg-orange-50 text-orange-400'}
                      `}>
                        {group.vacancy}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                      <Edit3 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <CoordinatorSidebar />
      </div>

      {/* Mobile sidebar (drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative z-50 w-64 bg-white shadow-xl">
            <CoordinatorSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-10 font-sans">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Left Content - Tables */}
              <div className="lg:col-span-3">
                <TableSection 
                  title="BE 2025" 
                  isOpen={expandedSections.BE} 
                  onToggle={() => toggleSection('BE')} 
                />
                <TableSection 
                  title="TE 2025" 
                  isOpen={expandedSections.TE} 
                  onToggle={() => toggleSection('TE')} 
                />
                <TableSection 
                  title="SE 2025" 
                  isOpen={expandedSections.SE} 
                  onToggle={() => toggleSection('SE')} 
                />
              </div>

              {/* Right Content - Overview Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6 sticky top-10">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Overview</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Total Groups</span>
                      <span className="font-bold text-slate-800">63</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Total Mentors</span>
                      <span className="font-bold text-slate-800">12</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Total Students</span>
                      <span className="font-bold text-slate-800">243</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 border-t border-slate-50 pt-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Groups lacking Mentors</span>
                      <span className="font-bold text-red-500">2</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Group less Students</span>
                      <span className="font-bold text-red-500">7</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Incomplete Groups</span>
                      <span className="font-bold text-red-500">8</span>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all mb-4 flex items-center justify-center gap-2">
                    Smart Assign
                  </button>
                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    Automatically fills unassigned groups and students based on availability.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamPage;