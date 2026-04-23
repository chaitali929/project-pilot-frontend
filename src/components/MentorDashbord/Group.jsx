import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import MentorSideBar from "../MentorSideBar";
import Topbar from "../Topbar";
import ProjectModal from "./TeamViewGroup";
import useMentorStore from '../../store/mentorStore';

const TeamStatus = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  COMPLETED: 'Completed'
};

export default function MentorGroups() {
  const { groups, fetchGroups, isLoading } = useMentorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([
    TeamStatus.ACTIVE,
    TeamStatus.INACTIVE,
    TeamStatus.COMPLETED
  ]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleTeamClick = (team) => {
    setSelectedTeam({ name: team.groupName, id: team._id });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  const getTeamStatus = (group) => {
    const acceptedMembers = group.members?.filter(m => m.status === 'accepted').length || 0;
    if (acceptedMembers >= group.maxMembers) return TeamStatus.COMPLETED;
    if (acceptedMembers > 0) return TeamStatus.ACTIVE;
    return TeamStatus.INACTIVE;
  };

  const filteredTeams = useMemo(() => {
    return groups.filter(group => {
      const query = searchQuery.toLowerCase();
      const status = getTeamStatus(group);
      const leaderName = group.admin?.name || '';
      
      const matchesSearch = 
        group.groupName.toLowerCase().includes(query) ||
        leaderName.toLowerCase().includes(query);
      
      const matchesFilter = activeFilters.includes(status);
      return matchesSearch && matchesFilter;
    });
  }, [groups, searchQuery, activeFilters]);

  const toggleFilter = (status) => {
    setActiveFilters(prev => 
      prev.includes(status) 
        ? prev.filter(f => f !== status) 
        : [...prev, status]
    );
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case TeamStatus.ACTIVE:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          icon: <Clock className="w-4 h-4" />
        };
      case TeamStatus.COMPLETED:
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-700',
          icon: <CheckCircle2 className="w-4 h-4" />
        };
      case TeamStatus.INACTIVE:
        default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          icon: <AlertCircle className="w-4 h-4" />
        };
    }
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
              <h1 className="text-2xl font-semibold">Groups Management</h1>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-8 relative flex items-center">
                <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by team, leader, or project..."
                  className="block w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all outline-none"
                />
              </div>

              <div className="lg:col-span-4 flex flex-wrap items-center gap-2">
                {Object.values(TeamStatus).map((status) => {
                  const isActive = activeFilters.includes(status);
                  return (
                    <button
                      key={status}
                      onClick={() => toggleFilter(status)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm border ${
                        isActive 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {status}
                      {isActive && <X className="w-3 h-3 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Teams Table Container */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Team Identity</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Leadership</th>
                      <th className="px-8 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Year/Batch</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Members</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <Clock className="w-12 h-12 mb-4 opacity-20 animate-spin" />
                            <p className="text-lg font-medium">Loading groups...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredTeams.length > 0 ? (
                      filteredTeams.map((group) => {
                        const status = getTeamStatus(group);
                        const statusUI = getStatusStyles(status);
                        const acceptedMembers = group.members?.filter(m => m.status === 'accepted').length || 0;
                        const leaderEmail = group.admin?.email || '';
                        const leaderInitial = leaderEmail.charAt(0).toUpperCase();
                        
                        return (
                          <tr key={group._id} className="group hover:bg-blue-50/30 transition-colors">
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex flex-col">
                                <button 
                                  onClick={() => handleTeamClick(group)}
                                  className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer hover:underline text-left"
                                >
                                  {group.groupName}
                                </button>
                                <span className="text-xs text-gray-500 font-medium">
                                  {acceptedMembers} Members Assigned
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full border-2 border-white ring-2 ring-gray-100 bg-blue-500 flex items-center justify-center text-white font-bold">
                                  {leaderInitial}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                  {group.admin?.name || 'Unknown'}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold ${statusUI.bg} ${statusUI.text}`}>
                                {statusUI.icon}
                                {status}
                              </span>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-600">
                                {group.year} - {group.currentYear}
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full transition-all" 
                                    style={{ width: `${(acceptedMembers / group.maxMembers) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-600 min-w-[3rem]">
                                  {acceptedMembers}/{group.maxMembers}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <Search className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No teams found</p>
                            <p className="text-sm">Try adjusting your search or filter criteria.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Team Projects Modal */}
      <ProjectModal 
        isOpen={showModal}
        onClose={handleCloseModal}
        team={selectedTeam}
      />
    </div>
  );
}