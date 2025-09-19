import React from "react";

function Activity({ colorClass, title, sub }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-1.5 h-10 ${colorClass} rounded`}></div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-gray-400">{sub}</div>
      </div>
    </div>
  );
}

export default function RecentActivities() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h4 className="font-semibold mb-4">Recent Activities</h4>

      <div className="space-y-4">
        <Activity colorClass="bg-green-400" title="Completed Design Wireframes" sub="2 hrs ago" />
        <Activity colorClass="bg-blue-400" title="Submitted Report" sub="Yesterday" />
        <Activity colorClass="bg-indigo-400" title="Group uploaded revised synopsis" sub="4 days ago" />
      </div>
    </div>
  );
}
