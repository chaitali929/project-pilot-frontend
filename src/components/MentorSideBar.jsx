import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdNotifications, MdGroup } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiBook, FiUser, FiHelpCircle, FiMessageCircle } from "react-icons/fi";
import useMentorStore from "../store/mentorStore";

const Badge = ({ count }) => {
  if (!count) return null;
  return (
    <span className="ml-auto bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default function MentorSidebar({ isMobile = false, onClose }) {
  const { sidebarStats, fetchSidebarStats } = useMentorStore();

  useEffect(() => { fetchSidebarStats(); }, []);

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
        {isMobile && (
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="p-4 flex-1 overflow-auto text-sm space-y-1">
        <NavLink to="/MentorDashboard" className={linkClasses} end>
          <MdDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink to="/MentorDashboard/Groups" className={linkClasses}>
          <MdGroup className="w-5 h-5" />
          Groups
          <Badge count={sidebarStats?.groupCount} />
        </NavLink>

        <NavLink to="/MentorDashboard/Review" className={linkClasses}>
          <HiOutlineDocumentReport className="w-5 h-5" />
          Review
          <Badge count={(sidebarStats?.pendingTopics || 0) + (sidebarStats?.pendingReports || 0)} />
        </NavLink>

        <NavLink to="/MentorDashboard/ProjectDiary" className={linkClasses}>
          <FiBook className="w-5 h-5" />
          Project Diary
          <Badge count={sidebarStats?.pendingDiaries} />
        </NavLink>

        <NavLink to="/MentorDashboard/Notifications" className={linkClasses}>
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
              <NavLink to="/MentorDashboard/Profile" className={linkClasses}>
                <FiUser className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/MentorDashboard/Help" className={linkClasses}>
                <FiHelpCircle className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Help</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/MentorDashboard/Chat" className={linkClasses}>
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
