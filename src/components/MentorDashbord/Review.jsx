import React, { useState, useMemo } from 'react';
import { Search, Filter, MessageSquare, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

// --- Types & Constants ---
const SubmissionStatus = {
  PENDING: 'Pending',
  REVIEWED: 'Reviewed',
  NEEDS_ATTENTION: 'Needs Attention'
};

const StatusColors = {
  [SubmissionStatus.PENDING]: 'bg-amber-50 text-amber-700 border-amber-100',
  [SubmissionStatus.REVIEWED]: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  [SubmissionStatus.NEEDS_ATTENTION]: 'bg-rose-50 text-rose-700 border-rose-100'
};

const MOCK_REVIEWS = [
  {
    id: '1',
    teamName: 'Team Alpha',
    leadName: 'Sarah Chen',
    projectName: 'Eco-Friendly Packaging Design',
    submissionType: 'Report',
    submittedAt: '2024-07-26T14:30:00',
    status: SubmissionStatus.PENDING,
  },
  {
    id: '2',
    teamName: 'Team Beta',
    leadName: 'David Lee',
    projectName: 'Mobile App for Local Tourism',
    submissionType: 'Prototype',
    submittedAt: '2024-07-25T11:15:00',
    status: SubmissionStatus.REVIEWED,
  },
  {
    id: '3',
    teamName: 'Team Gamma',
    leadName: 'Maria Rodriguez',
    projectName: 'Sustainable Urban Farming',
    submissionType: 'Presentation',
    submittedAt: '2024-07-24T16:45:00',
    status: SubmissionStatus.NEEDS_ATTENTION,
  },
  {
    id: '4',
    teamName: 'Team Delta',
    leadName: 'Ethan Clark',
    projectName: 'AI-Powered Education Platform',
    submissionType: 'Code',
    submittedAt: '2024-07-23T09:00:00',
    status: SubmissionStatus.PENDING,
  },
  {
    id: '5',
    teamName: 'Team Epsilon',
    leadName: 'Olivia Brown',
    projectName: 'Community Health Awareness',
    submissionType: 'Report',
    submittedAt: '2024-07-22T13:20:00',
    status: SubmissionStatus.REVIEWED,
  },
];

// --- Sub-components ---

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
          placeholder="Search teams, projects, or leads..."
          type="text"
          value={value}
          onChange={onChange}
        />
      </div>
      <button className="flex items-center justify-center px-4 h-full text-slate-500 hover:text-indigo-600 border-l border-slate-100 transition-colors">
        <Filter className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">Filters</span>
      </button>
    </div>
  </div>
);

const ReviewTable = ({ reviews, onFeedback, totalCount }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500">Team & Lead</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500">Project</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500">Type</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500">Submitted</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((review) => (
              <tr key={review.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-900">{review.teamName}</div>
                  <div className="text-xs text-slate-500">{review.leadName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors cursor-pointer">
                    {review.projectName}
                    <ExternalLink className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded text-[11px] font-bold uppercase tracking-tight">
                    {review.submissionType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600 font-medium">{formatDate(review.submittedAt)}</div>
                  <div className="text-xs text-slate-400">{formatTime(review.submittedAt)}</div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={review.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onFeedback(review.teamName)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Feedback
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Search className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-sm">No submissions found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          Showing <span className="text-slate-900 font-bold">{reviews.length}</span> of <span className="text-slate-900 font-bold">{totalCount}</span> results
        </p>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors" disabled>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex space-x-1">
             <button className="px-3 py-1 text-xs font-bold rounded bg-indigo-600 text-white shadow-sm">1</button>
             <button className="px-3 py-1 text-xs font-bold rounded text-slate-600 hover:bg-slate-200 transition-colors">2</button>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function MentorReview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  const filteredReviews = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return MOCK_REVIEWS.filter(
      (review) =>
        review.teamName.toLowerCase().includes(lowerQuery) ||
        review.leadName.toLowerCase().includes(lowerQuery) ||
        review.projectName.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const handleFeedback = (teamName) => {
    setNotification(`Review panel for ${teamName} will be available shortly.`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 text-sm font-medium">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Submission Reviews
          </h1>
          <p className="mt-2 text-slate-500 text-lg">
            Manage and provide feedback on team progress and final prototypes.
          </p>
        </header>

        <div className="mb-8">
          <SearchBar 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>

        <ReviewTable 
          reviews={filteredReviews} 
          onFeedback={handleFeedback}
          totalCount={24}
        />
        
        <footer className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
            <p>© 2024 Evaluation Platform. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-slate-600 transition-colors underline decoration-slate-200 underline-offset-4">Guidelines</a>
              <a href="#" className="hover:text-slate-600 transition-colors underline decoration-slate-200 underline-offset-4">Scoring Rubric</a>
              <a href="#" className="hover:text-slate-600 transition-colors underline decoration-slate-200 underline-offset-4">Help Center</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}