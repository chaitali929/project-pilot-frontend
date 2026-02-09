import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdTopic, MdNotifications, MdGroup, } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";

import { FiPackage, FiUser, FiSliders, FiHelpCircle } from "react-icons/fi";

export default function Sidebar({ isMobile = false, onClose }) {
  const linkClasses = ({ isActive }) =>
    `w-full flex items-center gap-3 text-left p-3 rounded-lg transition ${
      isActive
        ? "bg-blue-50 text-blue-600 font-medium"
        : "hover:bg-gray-100 text-gray-700"
    }`;

  return (
    <aside
      className={`w-64 bg-white flex flex-col border-r border-black ${
        isMobile ? "h-full" : "hidden md:flex"
      }`}
    >
      {/* Header */}
      <div className="px-4 py-5 border-b flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">PP</span>
          </div>
          <div className="font-semibold text-lg">ProjectPilot</div>
        </div>

        {/* Show close button only in mobile drawer */}
        {isMobile && (
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="p-4 flex-1 overflow-auto text-sm space-y-1">
        <NavLink to="/StudentDashboard" className={linkClasses} end>
          <MdDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink to="/StudentDashboard/Taskboard" className={linkClasses}>
          <FaTasks className="w-5 h-5" />
          Task board
        </NavLink>

        <NavLink to="/StudentDashboard/Groups" className={linkClasses}>
          <MdGroup className="w-5 h-5" />
          Groups
        </NavLink>

       <NavLink to="/StudentDashboard/Topics" className={linkClasses}>
          <MdTopic className="w-5 h-5" />
          Topics
        </NavLink>

   <NavLink 
  to="/StudentDashboard/Reports" 
  className={({ isActive }) =>
    `w-full flex items-center gap-3 text-left p-3 rounded-lg hover:bg-gray-100 ${
      isActive ? "bg-gray-200 font-semibold text-blue-600" : ""
    }`
  }
>
  <HiOutlineDocumentReport className="w-5 h-5" />
  Reports
</NavLink>

 {/* ✅ Workspace (updated text) */}
     
       <NavLink to="/StudentDashboard/Workspace" className={linkClasses}>
          <FiPackage className="w-5 h-5" />
          Workspace
        </NavLink>

   <NavLink to="/StudentDashboard/ProjectDiary" className={linkClasses}>
          <FiPackage className="w-5 h-5" />
          Project Dairy
        </NavLink>

              
       <NavLink to="/StudentDashboard/Notifications" className={linkClasses}>
         <MdNotifications className="w-5 h-5" />
          Notifications
        </NavLink>

      

<hr className="my-3" />

<div className="mt-4">
  <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
    Settings
  </p>
  <ul className="space-y-1">
    <li>
      <button className="w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg hover:bg-gray-100">
        <FiUser className="w-5 h-5 text-gray-600" />
        <span className="text-gray-700">Profile</span>
      </button>
    </li>
    <li>
      <button className="w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg hover:bg-gray-100">
        <FiSliders className="w-5 h-5 text-gray-600" />
        <span className="text-gray-700">Preference</span>
      </button>
    </li>
    <li>
      <button className="w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg hover:bg-gray-100">
        <FiHelpCircle className="w-5 h-5 text-gray-600" />
        <span className="text-gray-700">Help</span>
      </button>
    </li>
  </ul>
</div>
      </nav>
    </aside>
  );
}
