import React from "react";

export default function ReportSummary() {
  return (
    <div className="bg-white rounded-xl shadow p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">Report Summary</h3>

      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-bold">5 Reports</div>
          <div className="text-sm text-gray-500">Submitted this semester</div>
          <div className="text-xs text-gray-400 mt-2">Last Submission: 2 days ago</div>
        </div>

        <div className="text-sm space-y-2">
          <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-600 rounded-full" /> ProjectPilot</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-600 rounded-full" /> PrePlacement-Hub</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-600 rounded-full" /> Quick-legal bot</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-600 rounded-full" /> Banking & Management</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-600 rounded-full" /> Event Management</div>
        </div>
      </div>
    </div>
  );
}
