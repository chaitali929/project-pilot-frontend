import React from "react";

function Item({ title, date }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">i</div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-gray-400">{date}</div>
      </div>
    </div>
  );
}

export default function UpcomingDeadlines() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h4 className="font-semibold mb-4">Upcoming deadlines</h4>

      <div className="space-y-4">
        <Item title="Project Milestone 2" date="September 15, 2024" />
        <Item title="Group Presentation" date="September 20, 2024" />
        <Item title="Final Report Submission" date="September 30, 2024" />
      </div>
    </div>
  );
}
