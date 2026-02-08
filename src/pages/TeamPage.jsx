import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import CoordinatorSidebar from '../components/CoordinatorSideBar';
import { 
  ChevronDown, 
  Edit3, 
} from 'lucide-react';
import useCoordinatorStore from '../store/coordinatorStore';
import GroupActionModal from '../components/Coordinator/GroupActionModal';

const TeamPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    BE: true,
    TE: true,
    SE: true
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { groupsByYear, isLoading, error, fetchGroups, clearError } = useCoordinatorStore();

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleEditClick = (group) => {
    setSelectedGroup(group);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedGroup(null);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getYearStats = (year) => {
    const groups = groupsByYear[year] || [];
    const totalGroups = groups.length;
    const totalStudents = groups.reduce((sum, group) => {
      return sum + (group.members?.filter(m => m.status === 'accepted').length || 0) + 1;
    }, 0);
    return { totalGroups, totalStudents };
  };

  const getTotalStats = () => {
    const allGroups = [...groupsByYear.SE, ...groupsByYear.TE, ...groupsByYear.BE];
    const totalGroups = allGroups.length;
    const totalStudents = allGroups.reduce((sum, group) => {
      return sum + (group.members?.filter(m => m.status === 'accepted').length || 0) + 1;
    }, 0);
    const incompleteGroups = allGroups.filter(group => {
      const memberCount = (group.members?.filter(m => m.status === 'accepted').length || 0) + 1;
      return memberCount < group.maxMembers;
    }).length;
    
    return { totalGroups, totalStudents, incompleteGroups };
  };

  const TableSection = ({ title, year, isOpen, onToggle }) => {
    const groups = groupsByYear[year] || [];
    const { totalGroups, totalStudents } = getYearStats(year);

    return (
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
              {totalGroups} Groups • {totalStudents} Students
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                  <tr className="border-y border-slate-50">
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Group Name</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Year</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mentor Assigned</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Members</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Capacity</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {groups.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                      No groups found for {year}
                    </td>
                  </tr>
                ) : (
                  groups.map((group) => {
                    const acceptedMembers = group.members?.filter(m => m.status === 'accepted') || [];
                    const totalMembers = acceptedMembers.length + 1;
                    const isFull = totalMembers >= group.maxMembers;
                    
                    return (
                      <tr key={group._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-800 font-medium">{group.groupName}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{group.currentYear}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-600">
                              {group.admin?.email?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-slate-600">{group.admin?.email?.replace('@gmail.com', '')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {group.mentor ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs text-green-600">
                                {group.mentor.email?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm text-slate-600">{group.mentor.email?.replace('@gmail.com', '')}</span>
                            </div>
                          ) : (
                            <span className="px-3 py-1 bg-red-50 text-red-400 text-xs font-bold rounded-full">
                              Needs Mentor
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center -space-x-2">
                            <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs">
                              {group.admin?.email?.charAt(0).toUpperCase()}
                            </div>
                            {acceptedMembers.slice(0, 3).map((member, i) => (
                              <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs">
                                {member.userId?.email?.charAt(0).toUpperCase()}
                              </div>
                            ))}
                            {acceptedMembers.length > 3 && (
                              <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs">
                                +{acceptedMembers.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <span className={`
                              px-3 py-1 rounded-full text-[11px] font-bold
                              ${isFull 
                                ? 'bg-emerald-50 text-emerald-500' 
                                : 'bg-orange-50 text-orange-400'}
                            `}>
                              {totalMembers}/{group.maxMembers}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleEditClick(group)}
                            className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <div className="hidden md:flex">
          <CoordinatorSidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-slate-600">Loading groups...</div>
          </main>
        </div>
      </div>
    );
  }

  const totalStats = getTotalStats();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={clearError} className="float-right font-bold ml-4">×</button>
        </div>
      )}
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
                  year="BE"
                  isOpen={expandedSections.BE} 
                  onToggle={() => toggleSection('BE')} 
                />
                <TableSection 
                  title="TE 2025" 
                  year="TE"
                  isOpen={expandedSections.TE} 
                  onToggle={() => toggleSection('TE')} 
                />
                <TableSection 
                  title="SE 2025" 
                  year="SE"
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
                      <span className="font-bold text-slate-800">{totalStats.totalGroups}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Total Students</span>
                      <span className="font-bold text-slate-800">{totalStats.totalStudents}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 border-t border-slate-50 pt-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Incomplete Groups</span>
                      <span className="font-bold text-red-500">{totalStats.incompleteGroups}</span>
                    </div>
                  </div>

                  <button 
                    onClick={fetchGroups}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all mb-4 flex items-center justify-center gap-2"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
      
      <GroupActionModal 
        isOpen={modalOpen}
        onClose={closeModal}
        group={selectedGroup}
      />
    </div>
  );
};

export default TeamPage;