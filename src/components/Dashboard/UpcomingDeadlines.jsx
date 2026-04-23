import React, { useEffect } from "react";
import useTaskStore from "../../store/taskStore";
import useGroupStore from "../../store/groupStore";
import useUserStore from "../../store/userStore";

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
  const { tasks, getGroupTasks } = useTaskStore();
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
      getGroupTasks(userGroup._id).catch(() => {});
    }
  }, [groups, user, getGroupTasks]);

  const upcomingTasks = tasks
    .filter(t => t.dueDate && new Date(t.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h4 className="font-semibold mb-4">Upcoming deadlines</h4>

      <div className="space-y-4">
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task, idx) => (
            <Item key={idx} title={task.title} date={formatDate(task.dueDate)} />
          ))
        ) : (
          <p className="text-gray-400 text-sm">No upcoming deadlines</p>
        )}
      </div>
    </div>
  );
}
