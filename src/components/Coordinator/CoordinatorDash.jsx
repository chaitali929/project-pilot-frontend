import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserPlus, LayoutGrid, Clock,
  AlertCircle, Bell, ChevronDown, Calendar as CalendarIcon,
  CheckCircle2, ArrowUpRight, ArrowDownRight, MessageSquare
} from 'lucide-react';
import useCoordinatorStore from '../../store/coordinatorStore';

const CoordinatorDash = () => {
  const navigate = useNavigate();
  const { stats, fetchStats, isLoading } = useCoordinatorStore();

  useEffect(() => { fetchStats(); }, []);

  const statCards = stats ? [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Groups', value: stats.totalGroups, icon: LayoutGrid, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Mentors', value: stats.totalMentors, icon: UserPlus, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Unassigned Students', value: stats.unassignedStudents, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ] : [];

  const keyMetrics = stats ? [
    { label: 'Mentors Assigned', value: stats.groupsWithMentor, color: 'border-t-green-500', iconBg: 'bg-green-100', iconColor: 'text-green-500' },
    { label: 'Groups Without Mentor', value: stats.groupsWithoutMentor, color: 'border-t-red-500', iconBg: 'bg-red-100', iconColor: 'text-red-500' },
    { label: 'Unassigned Students', value: stats.unassignedStudents, color: 'border-t-orange-500', iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
    { label: 'Total Groups', value: stats.totalGroups, color: 'border-t-blue-500', iconBg: 'bg-blue-100', iconColor: 'text-blue-500' },
  ] : [];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">

      {isLoading && !stats && (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Top Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold mt-1 tracking-tight">{stat.value ?? '—'}</p>
          </div>
        ))}
      </div>

      {/* Key Department Metrics */}
      {stats && (
        <div>
          <h2 className="text-lg font-bold mb-4">Key Department Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyMetrics.map((metric, i) => (
              <div key={i} className={`bg-white p-6 rounded-2xl border border-gray-100 border-t-4 ${metric.color} shadow-sm`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-2 rounded-lg ${metric.iconBg} ${metric.iconColor}`}>
                    <Users size={20} />
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{metric.label}</span>
                </div>
                <p className="text-4xl font-bold mb-1">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Insights */}
      {stats && (
        <div>
          <h2 className="text-lg font-bold mb-4">Action Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {stats.groupsWithoutMentor > 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-6">
                <div className="p-3 bg-red-50 text-red-600 h-fit rounded-full">
                  <AlertCircle size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Groups Require Mentors</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {stats.groupsWithoutMentor} out of {stats.totalGroups} group{stats.totalGroups !== 1 ? 's' : ''} {stats.groupsWithoutMentor === 1 ? 'needs' : 'need'} a mentor assigned.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(stats.groupsWithoutMentorList || []).slice(0, 5).map(g => (
                      <span key={g._id} className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-lg">
                        {g.groupName} <span className="text-red-400">({g.year})</span>
                      </span>
                    ))}
                    {stats.groupsWithoutMentor > 5 && (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-lg">
                        +{stats.groupsWithoutMentor - 5} more
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => navigate('/CoordinatorDashboard/TeamsManagement')}
                    className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-700 transition-all"
                  >
                    Assign Mentors <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-6">
                <div className="p-3 bg-green-50 text-green-600 h-fit rounded-full">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">All Groups Have Mentors</h3>
                  <p className="text-sm text-gray-500">All {stats.totalGroups} group{stats.totalGroups !== 1 ? 's' : ''} have a mentor assigned.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Manage Teams', path: '/CoordinatorDashboard/TeamsManagement', color: 'bg-purple-50 text-purple-700' },
            { label: 'View Students', path: '/CoordinatorDashboard/Students', color: 'bg-blue-50 text-blue-700' },
            { label: 'View Mentors', path: '/CoordinatorDashboard/Mentors', color: 'bg-green-50 text-green-700' },
            { label: 'Administration', path: '/CoordinatorDashboard/Administration', color: 'bg-red-50 text-red-700' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className={`p-4 rounded-2xl font-semibold text-sm ${item.color} hover:opacity-80 transition-opacity text-left`}
            >
              {item.label} <ArrowUpRight size={14} className="inline ml-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDash;
