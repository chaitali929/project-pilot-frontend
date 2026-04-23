import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdNotifications, MdGroup, MdAssignment, MdAdminPanelSettings } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiUsers, FiUser, FiHelpCircle, FiUserCheck, FiMessageCircle } from "react-icons/fi";
import { RiTeamLine, RiGroupLine } from "react-icons/ri";
import { HiAcademicCap } from "react-icons/hi2";

export default function CoordinatorSidebar({ isMobile = false, onClose }) {
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
          <div className="w-9 h-9 bg-gray-200 rounded flex items-center justify-center">
            Logo
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
        <NavLink to="/CoordinatorDashboard" className={linkClasses} end>
          <MdDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink to="/CoordinatorDashboard/TeamsManagement" className={linkClasses}>
          <RiTeamLine className="w-5 h-5" />
          Teams & Management
        </NavLink>

        <NavLink to="/CoordinatorDashboard/Students" className={linkClasses}>
          <HiAcademicCap className="w-5 h-5" />
          Students
        </NavLink>

        <NavLink to="/CoordinatorDashboard/Mentors" className={linkClasses}>
          <FiUserCheck className="w-5 h-5" />
          Mentors
        </NavLink>

        <NavLink to="/CoordinatorDashboard/Administration" className={linkClasses}>
          <MdAdminPanelSettings className="w-5 h-5" />
          Administration
        </NavLink>

      <hr className="my-3" />

<div className="mt-4">
  <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
    Settings
  </p>
  <ul className="space-y-1">
    <li>
      <NavLink to="/CoordinatorDashboard/Profile" className={linkClasses}>
        <FiUser className="w-5 h-5 text-gray-600" />
        <span className="text-gray-700">Profile</span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/CoordinatorDashboard/Help" className={linkClasses}>
        <FiHelpCircle className="w-5 h-5 text-gray-600" />
        <span className="text-gray-700">Help</span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/CoordinatorDashboard/Chat" className={linkClasses}>
        <FiMessageCircle className="w-5 h-5 text-gray-600" />
        <span className="text-gray-700">Live Chat</span>
      </NavLink>
    </li>
  </ul>
</div>
      </nav>
    </aside>
  );
}