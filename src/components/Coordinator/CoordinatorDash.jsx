import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  LayoutGrid, 
  Clock, 
  AlertCircle, 
  Bell, 
  Settings, 
  ChevronDown, 
  Calendar as CalendarIcon,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardList,
  MessageSquare
} from 'lucide-react';

const CoordinatorDash = () => {
  const [department, setDepartment] = useState('All Departments');
  const [year, setYear] = useState('2024');

  // Mock Data
  const stats = [
    { label: 'Total Students', value: '1,234', trend: '+5%', up: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Groups', value: '56', trend: '-2%', up: false, icon: LayoutGrid, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Mentors', value: '16', trend: '0%', up: true, icon: UserPlus, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Vacant Slots', value: '24', trend: '-10%', up: false, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const keyMetrics = [
    { label: 'Mentors Assigned', value: '89', sub: 'Last 30 days +5%', color: 'border-t-green-500', iconColor: 'text-green-500', iconBg: 'bg-green-100' },
    { label: 'Vacant Group Slots', value: '12', sub: 'Last 30 days -2%', color: 'border-t-orange-500', iconColor: 'text-orange-500', iconBg: 'bg-orange-100' },
    { label: 'Unassigned Students', value: '5', sub: 'Last 30 days +10%', color: 'border-t-red-500', iconColor: 'text-red-500', iconBg: 'bg-red-100' },
    { label: 'Groups Without Mentor', value: '2', sub: 'Last 30 days +1%', color: 'border-t-pink-500', iconColor: 'text-pink-500', iconBg: 'bg-pink-100' },
  ];

  const activities = [
    { id: 1, text: 'Group 12 submitted Milestone 2', time: '2 hours ago', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 2, text: 'Group 8 needs attention - Progress lagging', time: '4 hours ago', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 3, text: 'Project review scheduled for Group 15', time: '5 hours ago', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 4, text: 'Mentor allocation completed for 5 groups', time: '1 day ago', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
        
        {/* Filters */}
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
            Department: {department} <ChevronDown size={14} />
          </button>
          <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
            Year: {year} <ChevronDown size={14} />
          </button>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center text-xs font-bold ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.trend}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Key Department Metrics */}
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
                <p className="text-xs text-gray-400 font-medium">{metric.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Insights */}
        <div>
          <h2 className="text-lg font-bold mb-4">Action Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-6">
              <div className="p-3 bg-blue-50 text-blue-600 h-fit rounded-full">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Unassigned Students Need Attention</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  There are 5 students waiting to be assigned to a group. Prompt assignment ensures they don't miss out on program activities.
                </p>
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                  Assign Students <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-6">
              <div className="p-3 bg-red-50 text-red-600 h-fit rounded-full">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Groups Require Mentors</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  2 groups currently do not have an assigned mentor. Assign mentors to ensure groups have the guidance they need to succeed.
                </p>
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                  Assign Mentors <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upcoming & Requests */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upcoming Deadlines */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold flex items-center gap-2 text-gray-800">
                    <CalendarIcon size={18} className="text-blue-500" /> Upcoming Deadlines
                  </h3>
                  <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {[
                    { date: 'OCT 25', title: 'Mentor-Mentee Kickoff Meeting', sub: 'Finalize group formations', color: 'bg-blue-50 text-blue-600' },
                    { date: 'NOV 15', title: 'First Project Proposal Due', sub: 'All groups must submit their proposals', color: 'bg-indigo-50 text-indigo-600' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                      <div className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg font-bold text-[10px] leading-tight shrink-0 ${item.color}`}>
                        <span className="text-sm uppercase">{item.date.split(' ')[0]}</span>
                        <span className="text-lg">{item.date.split(' ')[1]}</span>
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-sm truncate group-hover:text-blue-600 transition-colors">{item.title}</h4>
                        <p className="text-xs text-gray-400 truncate">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Requests */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold flex items-center gap-2 text-gray-800">
                    <Bell size={18} className="text-blue-500" /> Pending Requests & Alerts
                  </h3>
                  <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {[
                    { type: 'Request', icon: MessageSquare, title: 'Group Name Change', sub: 'Group "Innovators" requests to be "Tech Titans"', color: 'text-orange-500', bg: 'bg-orange-50' },
                    { type: 'Alert', icon: AlertCircle, title: 'Low Engagement', sub: 'Group "Synergy" has low activity this month', color: 'text-red-500', bg: 'bg-red-50' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                      <div className={`p-2 h-fit rounded-lg ${item.bg} ${item.color}`}>
                        <item.icon size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${item.bg} ${item.color}`}>{item.type}</span>
                          <h4 className="font-bold text-sm truncate">{item.title}</h4>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-1">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities Section (From Image 1) */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg text-gray-800 mb-6">Recent Activities</h3>
              <div className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 items-start">
                    <div className={`p-2 rounded-full ${activity.bg} ${activity.color}`}>
                      <activity.icon size={20} />
                    </div>
                    <div className="flex-1 pb-4 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-800">{activity.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Side (From Image 1) */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-lg text-gray-800">Calendar</h3>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <button className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <ChevronDown size={18} className="-rotate-90" /> August 5, 2025
                </button>
              </div>

              {/* Simple Grid Calendar */}
              <div className="grid grid-cols-7 gap-1 text-center mb-8">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <span key={d} className="text-[10px] font-bold text-gray-400 mb-2">{d}</span>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <div key={day} className="aspect-square flex items-center justify-center text-xs relative group cursor-pointer">
                    <span className={`z-10 ${day === 5 ? 'text-white' : 'text-gray-600'}`}>{day}</span>
                    {day === 5 && <div className="absolute inset-1 rounded-full border-2 border-blue-500 bg-blue-500 shadow-sm"></div>}
                    {day === 15 && <div className="absolute inset-1 rounded-full bg-red-500"></div>}
                    {day === 15 && <span className="absolute inset-1 rounded-full text-white flex items-center justify-center text-xs z-20">15</span>}
                    {day === 22 && <div className="absolute inset-1 rounded-full bg-blue-600"></div>}
                    {day === 22 && <span className="absolute inset-1 rounded-full text-white flex items-center justify-center text-xs z-20">22</span>}
                    {day === 26 && <div className="absolute inset-1 rounded-full bg-orange-500"></div>}
                    {day === 26 && <span className="absolute inset-1 rounded-full text-white flex items-center justify-center text-xs z-20">26</span>}
                    {!([5, 15, 22, 26].includes(day)) && <div className="absolute inset-1 rounded-full group-hover:bg-gray-100 transition-colors"></div>}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {[
                  { label: 'Deadline 2', color: 'bg-red-500' },
                  { label: 'Meeting', color: 'bg-blue-600' },
                  { label: 'Report submission', color: 'bg-orange-500' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-xs font-semibold text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
    </div>
  );
};

export default CoordinatorDash;