import React, { useState, useEffect, useMemo } from 'react';
import Topbar from '../components/Topbar';
import CoordinatorSidebar from '../components/CoordinatorSideBar';
import { Search, SlidersHorizontal } from 'lucide-react';
import useCoordinatorStore from '../store/coordinatorStore';

const CoMentorPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { mentors, fetchMentors, isLoading } = useCoordinatorStore();

  useEffect(() => { fetchMentors(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mentors.filter(m =>
      (m.name || '').toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.department || '').toLowerCase().includes(q)
    );
  }, [mentors, search]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden md:flex">
        <CoordinatorSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 w-64 bg-white shadow-xl">
            <CoordinatorSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-auto p-4 md:p-8 font-sans">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Search */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search mentors by name, email or department..."
                className="w-full h-14 pl-14 pr-14 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-600 placeholder-slate-400"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 flex items-center gap-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Mentors</h2>
                <span className="px-4 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                  {filtered.length} mentors
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">#</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Department</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Groups Assigned</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Years</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-8 py-16 text-center">
                          <div className="flex justify-center">
                            <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-8 py-16 text-center text-slate-400 text-sm">
                          No mentors found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((mentor, idx) => (
                        <tr key={mentor._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-8 py-5 text-sm text-slate-500">{idx + 1}.</td>
                          <td className="px-8 py-5 text-sm text-slate-800 font-bold">
                            {mentor.name || <span className="text-slate-400 italic font-normal">No name</span>}
                          </td>
                          <td className="px-8 py-5 text-sm text-slate-500">{mentor.email}</td>
                          <td className="px-8 py-5 text-sm text-slate-500">{mentor.department || '—'}</td>
                          <td className="px-8 py-5 text-sm text-slate-600 font-semibold">{mentor.groupCount}</td>
                          <td className="px-8 py-5 text-sm text-slate-600">{mentor.assignedYears}</td>
                          <td className="px-8 py-5 text-center">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                              mentor.groupCount === 0
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {mentor.groupCount === 0 ? 'Unassigned' : 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CoMentorPage;
