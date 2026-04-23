import React, { useEffect, useState } from "react";
import useTaskStore from "../../store/taskStore";
import useReportStore from "../../store/reportStore";
import useDiaryStore from "../../store/diaryStore";
import useGroupStore from "../../store/groupStore";
import useUserStore from "../../store/userStore";

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
  const { tasks } = useTaskStore();
  const { reports } = useReportStore();
  const { diaries } = useDiaryStore();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const allActivities = [];

    tasks.forEach(task => {
      if (task.status === 'completed') {
        allActivities.push({
          title: `Completed ${task.title}`,
          date: new Date(task.updatedAt),
          color: 'bg-green-400'
        });
      }
    });

    reports.forEach(report => {
      allActivities.push({
        title: `Submitted ${report.title || 'Report'}`,
        date: new Date(report.createdAt),
        color: 'bg-blue-400'
      });
    });

    diaries.forEach(diary => {
      allActivities.push({
        title: `Submitted Week ${diary.week} Diary`,
        date: new Date(diary.createdAt),
        color: 'bg-indigo-400'
      });
    });

    const sorted = allActivities
      .sort((a, b) => b.date - a.date)
      .slice(0, 3)
      .map(activity => ({
        ...activity,
        timeAgo: getTimeAgo(activity.date)
      }));

    setActivities(sorted);
  }, [tasks, reports, diaries]);

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hrs ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h4 className="font-semibold mb-4">Recent Activities</h4>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, idx) => (
            <Activity key={idx} colorClass={activity.color} title={activity.title} sub={activity.timeAgo} />
          ))
        ) : (
          <p className="text-gray-400 text-sm">No recent activities</p>
        )}
      </div>
    </div>
  );
}
