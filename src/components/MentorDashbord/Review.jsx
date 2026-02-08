import React, { useState, useMemo, useEffect } from 'react';
import { Search, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import MentorSideBar from "../MentorSideBar";
import Topbar from "../Topbar";
import useMentorStore from '../../store/mentorStore';
import ReportViewModal from './ReportViewModal';

const StatusColors = {
  'sent': 'bg-yellow-50 text-yellow-700 border-yellow-100',
  'viewed': 'bg-blue-50 text-blue-700 border-blue-100',
  'accepted': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'rejected': 'bg-rose-50 text-rose-700 border-rose-100'
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${StatusColors[status]}`}>
    {status}
  </span>
);

const SearchBar = ({ value, onChange }) => (
  <div className="relative group">
    <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
      <div className="flex items-center flex-grow pl-4">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          className="w-full bg-transparent border-none focus:ring-0 py-3.5 px-3 text-slate-700 placeholder-slate-400 text-sm"
          placeholder="Search teams or reports..."
          type="text"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  </div>
);

const ReviewTable = ({ reports, onFeedback, isLoading }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-16 text-center">
        <p className="text-slate-500">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500">Team</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500">Report Title</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500">Submitted</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((report) => (
              <tr key={report._id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-900">{report.groupId?.groupName || 'Unknown'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-900 font-medium">{report.reportTitle}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600 font-medium">{formatDate(report.createdAt)}</div>
                  <div className="text-xs text-slate-400">{formatTime(report.createdAt)}</div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onFeedback(report)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Review
                  </button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Search className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-sm">No reports found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          Showing <span className="text-slate-900 font-bold">{reports.length}</span> reports
        </p>
      </div>
    </div>
  );
};

export default function MentorReview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewDoc, setShowViewDoc] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const { reports, fetchReports, isLoading } = useMentorStore();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredReports = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return reports.filter(
      (report) =>
        report.groupId?.groupName?.toLowerCase().includes(lowerQuery) ||
        report.reportTitle?.toLowerCase().includes(lowerQuery)
    );
  }, [reports, searchQuery]);

  const handleFeedback = (report) => {
    setSelectedReport(report);
    setShowViewDoc(true);
  };

  const handleCloseViewDoc = () => {
    setShowViewDoc(false);
    setSelectedReport(null);
    fetchReports();
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MentorSideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Review Reports</h1>
            </div>

            <div className="mb-6">
              <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <ReviewTable 
              reports={filteredReports} 
              onFeedback={handleFeedback}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>

      {showViewDoc && selectedReport && (
        <ReportViewModal 
          isOpen={showViewDoc}
          onClose={handleCloseViewDoc}
          report={selectedReport}
          teamName={selectedReport.groupId?.groupName || 'Unknown Team'}
        />
      )}
    </div>
  );
}
