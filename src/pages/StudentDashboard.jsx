import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import GroupOverview from "../components/Dashboard/GroupOverview";
import TasksOverview from "../components/Dashboard/TasksOverview";
import ProjectProgress from "../components/Dashboard/ProjectProgress";
import ReportSummary from "../components/Dashboard/ReportSummary";
import UpcomingDeadlines from "../components/Dashboard/UpcomingDeadlines";
import RecentActivities from "../components/Dashboard/RecentActivities";
import CalendarWidget from "../components/Dashboard/CalendarWidget";
import useGroupStore from "../store/groupStore";
import useTaskStore from "../store/taskStore";
import useReportStore from "../store/reportStore";
import useDiaryStore from "../store/diaryStore";
import useUserStore from "../store/userStore";

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { fetchGroups, groups } = useGroupStore();
  const { getGroupTasks } = useTaskStore();
  const { fetchReports } = useReportStore();
  const { fetchDiaries } = useDiaryStore();
  const { user } = useUserStore();

  useEffect(() => {
    const refreshData = async () => {
      await fetchGroups();
      const userGroup = groups.find(g => 
        g.admin?._id === user?.id || 
        g.members?.some(m => m.userId?._id === user?.id && m.status === 'accepted')
      );
      if (userGroup) {
        await getGroupTasks(userGroup._id).catch(() => {});
        await fetchReports(userGroup._id).catch(() => {});
        await fetchDiaries(userGroup._id).catch(() => {});
      }
    };

    refreshData();
  }, [fetchGroups, groups, user, getGroupTasks, fetchReports, fetchDiaries]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar (drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar content */}
          <div className="relative z-50 w-64 bg-white shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar gets toggle button for mobile */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Main content */}
        <main className="p-4 sm:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top widgets row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GroupOverview />
              </div>
              <div>
                <TasksOverview />
              </div>
            </div>

            {/* Middle row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ProjectProgress />
              </div>
              <div>
                <ReportSummary />
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <UpcomingDeadlines />
              <RecentActivities />
              <CalendarWidget />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
