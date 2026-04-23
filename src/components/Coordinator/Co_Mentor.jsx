import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Edit3, 
  ChevronDown,
  LayoutGrid,
  Bell,
  Settings
} from 'lucide-react';

const CoMentor = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(['Unassigned', 'No Mentors', 'BE']);

  const mentors = [
    {
      srNo: 1,
      name: 'Dr. John Doe',
      groupAssigned: 4,
      availableSlots: 4,
      assignedYears: 'BE / TE / SE',
      status: 'available'
    },
    {
      srNo: 2,
      name: 'Prof. Jane Foster',
      groupAssigned: 6,
      availableSlots: 2,
      assignedYears: 'TE / SE',
      status: 'available'
    },
    {
      srNo: 3,
      name: 'Dr. Bruce Wayne',
      groupAssigned: 8,
      availableSlots: 'Full',
      assignedYears: 'BE / SE',
      status: 'full'
    },
    {
      srNo: 4,
      name: 'Ms. Lois Lane',
      groupAssigned: 2,
      availableSlots: 6,
      assignedYears: 'TE',
      status: 'available'
    }
  ];

  const removeFilter = (filterToRemove) => {
    setFilters(filters.filter(f => f !== filterToRemove));
  };

  return (
    <div className="p-4 md:p-8 font-sans">
      {/* Top Search Bar Area */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Search Input Container */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search teams..." 
            className="w-full h-14 pl-14 pr-14 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-600 placeholder-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-5 flex items-center">
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <div 
              key={filter} 
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors cursor-default"
            >
              {filter}
              <button 
                onClick={() => removeFilter(filter)}
                className="hover:text-red-500 transition-colors"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>

        {/* Main Data Table Container */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800">Computer Department</h2>
              <span className="px-4 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                272 Students
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Sr.No</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Group Assigned</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Available Slots</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned years</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mentors.map((mentor) => (
                  <tr key={mentor.srNo} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-5 text-sm text-slate-600 font-medium">{mentor.srNo}.</td>
                    <td className="px-8 py-5 text-sm text-slate-800 font-bold">{mentor.name}</td>
                    <td className="px-8 py-5 text-sm text-slate-600">{mentor.groupAssigned}</td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center">
                        <span className={`
                          min-w-[40px] px-3 py-1.5 rounded-full text-xs font-bold
                          ${mentor.status === 'full' 
                            ? 'bg-red-50 text-red-500' 
                            : 'bg-emerald-50 text-emerald-500'}
                        `}>
                          {mentor.availableSlots}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                      {mentor.assignedYears}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <Edit3 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoMentor;