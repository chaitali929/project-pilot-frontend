import React, { useEffect } from "react";
import useTaskStore from "../../store/taskStore";
import useGroupStore from "../../store/groupStore";
import useUserStore from "../../store/userStore";

function Bullet({ color = "bg-green-500" }) {
  return <span className={`inline-block ${color} w-2 h-2 rounded-full mr-2`} />;
}

export default function TasksOverview() {
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

  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const pendingTasks = tasks.filter(t => t.status !== 'Completed');

  return (
    <div className="bg-white rounded-xl shadow p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">Tasks Overview</h3>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <div className="font-medium mb-2">Done ({completedTasks.length})</div>
          <ul className="space-y-2">
            {completedTasks.slice(0, 3).map((task, idx) => (
              <li key={idx}><Bullet color="bg-green-500" />{task.heading}</li>
            ))}
            {completedTasks.length === 0 && <li className="text-gray-400 text-xs">No completed tasks</li>}
          </ul>
        </div>

        <div>
          <div className="font-medium mb-2">Pending ({pendingTasks.length})</div>
          <ul className="space-y-2">
            {pendingTasks.slice(0, 3).map((task, idx) => (
              <li key={idx}><Bullet color="bg-yellow-400" />{task.heading}</li>
            ))}
            {pendingTasks.length === 0 && <li className="text-gray-400 text-xs">No pending tasks</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
