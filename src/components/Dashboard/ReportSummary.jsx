import React, { useEffect } from "react";
import useReportStore from "../../store/reportStore";
import useGroupStore from "../../store/groupStore";
import useUserStore from "../../store/userStore";

export default function ReportSummary() {
  const { reports, fetchReports } = useReportStore();
  const { groups, fetchGroups } = useGroupStore();
  const { user } = useUserStore();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    const userGroup = groups.find(g => 
      g.admin?._id === user?.id || 
      g.members?.some(m => m.userId?._id === user?.id && m.status === 'accepted')
    );
    if (userGroup) {
      fetchReports(userGroup._id).catch(() => {});
    }
  }, [groups, user, fetchReports]);

  const getLastSubmission = () => {
    if (reports.length === 0) return 'No submissions yet';
    const lastReport = reports[reports.length - 1];
    const date = new Date(lastReport.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : `${diffDays} days ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">Report Summary</h3>

      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-bold">{reports.length} Reports</div>
          <div className="text-sm text-gray-500">Submitted this semester</div>
          <div className="text-xs text-gray-400 mt-2">Last Submission: {getLastSubmission()}</div>
        </div>

        <div className="text-sm space-y-2">
          {reports.slice(0, 5).map((report, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" /> 
              {report.title || `Report ${idx + 1}`}
            </div>
          ))}
          {reports.length === 0 && <div className="text-gray-400 text-xs">No reports submitted</div>}
        </div>
      </div>
    </div>
  );
}
