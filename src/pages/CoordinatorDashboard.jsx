import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import CoordinatorSidebar from '../components/CoordinatorSideBar';
import CoordinatorDash from '../components/Coordinator/CoordinatorDash';

const CoordinatorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <CoordinatorSidebar />
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
            <CoordinatorSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar gets toggle button for mobile */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <CoordinatorDash />
        </main>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;