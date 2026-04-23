import React, { useState, useEffect, useMemo } from 'react';
import Topbar from '../components/Topbar';
import CoordinatorSidebar from '../components/CoordinatorSideBar';
import { Search } from 'lucide-react';
import useCoordinatorStore from '../store/coordinatorStore';

const YEARS = ['SE', 'TE', 'BE'];

const StudentsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilters, setYearFilters] = useState([...YEARS]);
  const [statusFilter, setStatusFilter] = useState('all'); // all | assigned | unassigned

  const { students, fetchStudents, isLoading } = useCoordinatorStore();

  useEffect(() => { fetchStudents(); }, []);

  const toggleYear = (year) => {
    setYearFilters(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const filtered = useMemo(() => {
    return students.filter(s => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        (s.name || '').toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.groupName || '').toLowerCase().includes(q);
      const matchYear = !s.groupYear || yearFilters.includes(s.groupYear);
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'assigned' && s.isAssigned) ||
        (statusFilter === 'unassigned' && !s.isAssigned);
      return matchSearch && matchYear && matchStatus;
    });
  }, [students, searchQuery, yearFilters, statusFilter]);

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

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-[1400px] mx-auto space-y-5">

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="text-slate-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or group..."
                className="w-full h-13 pl-14 pr-14 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 text-slate-600"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Year toggles */}
              {YEARS.map(year => (
                <button
                  key={year}
                  onClick={() => toggleYear(year)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                    yearFilters.includes(year)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {year}
                </button>
              ))}

              <div className="h-5 w-px bg-slate-200" />

              {/* Status toggles */}
              {[
                { val: 'all', label: 'All' },
                { val: 'assigned', label: 'Assigned' },
                { val: 'unassigned', label: 'Unassigned' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setStatusFilter(opt.val)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                    statusFilter === opt.val
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-5 flex items-center gap-4 border-b border-slate-50">
                <h2 className="text-xl font-bold text-slate-800">Students</h2>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[11px] font-bold rounded-full">
                  {filtered.length} students
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/40">
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">#</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Group</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mentor</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
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
                          No students found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((student, idx) => (
                        <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-4 text-sm text-slate-400">{idx + 1}.</td>
                          <td className="px-6 py-4 text-sm text-slate-800 font-semibold">
                            {student.name || <span className="text-slate-400 italic">No name</span>}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{student.email}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {student.groupYear ? (
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg">
                                {student.groupYear}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {student.groupName || <span className="text-slate-300">N/A</span>}
                          </td>
                          <td className="px-6 py-4">
                            {student.mentor ? (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                                  {(student.mentor.name || student.mentor.email || '?')[0].toUpperCase()}
                                </div>
                                <span className="text-sm text-slate-600">{student.mentor.name || student.mentor.email}</span>
                              </div>
                            ) : (
                              <span className="px-2.5 py-1 bg-red-50 text-red-400 text-[10px] font-bold rounded-full">
                                No Mentor
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${
                              student.isAssigned
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-orange-50 text-orange-500'
                            }`}>
                              {student.isAssigned ? 'Assigned' : 'Unassigned'}
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

export default StudentsPage;
