import React, { useEffect } from "react";
import useDiaryStore from "../../store/diaryStore";
import useReportStore from "../../store/reportStore";
import useGroupStore from "../../store/groupStore";
import useUserStore from "../../store/userStore";
import useTopicStore from "../../store/TopicStore";

export default function ProjectProgress() {
  const { diaries, fetchDiaries } = useDiaryStore();
  const { reports, fetchReports } = useReportStore();
  const { groups, fetchGroups } = useGroupStore();
  const { user } = useUserStore();
  const { topics, fetchTopics } = useTopicStore();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    const userGroup = groups.find(g => 
      g.admin?._id === user?.id || 
      g.members?.some(m => m.userId?._id === user?.id && m.status === 'accepted')
    );
    if (userGroup) {
      fetchDiaries(userGroup._id).catch(() => {});
      fetchReports(userGroup._id).catch(() => {});
      fetchTopics(userGroup._id).catch(() => {});
    }
  }, [groups, user, fetchDiaries, fetchReports, fetchTopics]);

  const hasGroup = groups.some(g => g.admin?._id === user?.id || g.members?.some(m => m.userId?._id === user?.id && m.status === 'accepted'));
  const topicAccepted = topics.some(t => t.status === 'accepted');
  const hasReports = reports.length > 0;
  const reportAccepted = reports.some(r => r.status === 'accepted');

  const steps = [
    { label: 'Group Formed', completed: hasGroup },
    { label: 'Topic Accepted', completed: topicAccepted },
    { label: 'Report Submitted', completed: hasReports },
    { label: 'Report Accepted', completed: reportAccepted }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Project Progress</h3>

      <div className="bg-gray-50 p-6 rounded-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 w-full">
            {steps.map((step, idx) => (
              <div key={idx} className="flex-1 border-t-2 border-blue-200 relative">
                <div className="absolute -left-4 -top-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border text-gray-400'
                  }`}>
                    {step.completed ? '✓' : idx + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 text-xs text-gray-600">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">{step.label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
