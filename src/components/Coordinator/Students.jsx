import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Edit3 
} from 'lucide-react';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(['Unassigned', 'No Mentors', 'BE']);

  const students = [
    {
      srNo: 1,
      name: 'Anuj Dighe',
      year: 'BE',
      group: 'Group 4',
      mentor: { name: 'Prof. Davis', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
      status: 'Assigned'
    },
    {
      srNo: 2,
      name: 'Mayur Kumawat',
      year: 'BE',
      group: 'Group 4',
      mentor: { name: 'Prof. Davis', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
      status: 'Unassigned'
    },
    {
      srNo: 3,
      name: 'Chaitali Dahije',
      year: 'BE',
      group: 'Group 4',
      mentor: { name: 'Prof. Davis', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
      status: 'Unassigned'
    },
    {
      srNo: 3,
      name: 'Om Waghmare',
      year: 'BE',
      group: 'Group 4',
      mentor: { name: 'Prof. Davis', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
      status: 'Unassigned'
    },
    {
      srNo: 3,
      name: 'Om Waghmare',
      year: 'BE',
      group: 'N/A',
      mentor: null,
      status: 'Unassigned'
    },
    {
      srNo: 3,
      name: 'Om Waghmare',
      year: 'TE',
      group: 'N/A',
      mentor: null,
      status: 'Unassigned'
    },
    {
      srNo: 3,
      name: 'Om Waghmare',
      year: 'SE',
      group: 'N/A',
      mentor: null,
      status: 'Unassigned'
    },
    {
      srNo: 3,
      name: 'Om Waghmare',
      year: 'TE',
      group: 'N/A',
      mentor: null,
      status: 'Unassigned'
    }
  ];

  const removeFilter = (filterToRemove) => {
    setFilters(filters.filter(f => f !== filterToRemove));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Search Bar Section */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search teams..." 
            className="w-full h-14 pl-14 pr-14 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-6 flex items-center">
            <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Filter Chips Section */}
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <div 
              key={filter} 
              className="flex items-center gap-2 px-4 py-2 bg-[#E9EDF1] text-slate-700 rounded-xl text-sm font-semibold transition-colors"
            >
              {filter}
              <button 
                onClick={() => removeFilter(filter)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>

        {/* Department Table Container */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          {/* Table Header Area */}
          <div className="px-10 py-6 flex items-center gap-4 border-b border-slate-50">
            <h2 className="text-xl font-bold text-slate-800">Computer Department</h2>
            <span className="px-3 py-1 bg-[#E8F0FE] text-[#4285F4] text-[10px] font-bold rounded-full">
              272 Students
            </span>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sr.No</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Group</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mentor</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="px-10 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((student, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-5 text-sm text-slate-500">{student.srNo}.</td>
                    <td className="px-6 py-5 text-sm text-slate-700 font-medium">{student.name}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{student.year}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{student.group}</td>
                    <td className="px-6 py-5">
                      {student.mentor ? (
                        <div className="flex items-center gap-2">
                          <img src={student.mentor.image} className="w-6 h-6 rounded-full border border-slate-100 shadow-sm" alt="" />
                          <span className="text-sm text-slate-600">{student.mentor.name}</span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 bg-red-50 text-red-400 text-[10px] font-bold rounded-full">
                          Needs Mentor
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className={`
                          px-4 py-1.5 rounded-full text-[11px] font-bold tracking-tight
                          ${student.status === 'Assigned' 
                            ? 'bg-emerald-50 text-emerald-500' 
                            : 'bg-orange-50 text-[#F4B400]'}
                        `}>
                          {student.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-5 text-right">
                      <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
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

export default App;