import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUser, FiHelpCircle, FiLogOut } from "react-icons/fi";
import useUserStore from "../store/userStore";

export default function Topbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, initializeUser, logout } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "?";
  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const role = user?.role || "Student";

  // Determine base path from current route
  const basePath = location.pathname.startsWith("/MentorDashboard")
    ? "/MentorDashboard"
    : location.pathname.startsWith("/CoordinatorDashboard")
    ? "/CoordinatorDashboard"
    : "/StudentDashboard";

  const handleNavigate = (path) => {
    setDropdownOpen(false);
    navigate(`${basePath}/${path}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-black relative z-50">
      <div className="flex items-center gap-4 w-1/2">
        <div className="flex items-center bg-gray-50 border rounded px-3 py-2 w-full max-w-lg">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z" />
          </svg>
          <input className="ml-2 bg-transparent outline-none text-sm" placeholder="Search for anything" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600 capitalize">{role}</div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-2 py-1 transition"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border border-gray-200">
              <span className="text-white font-semibold text-sm">{initial}</span>
            </div>
            <div className="text-sm text-left">
              <div className="font-medium">{displayName}</div>
              <div className="text-xs text-gray-500 capitalize">{role}</div>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50">
                <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <DropdownItem icon={<FiUser />} label="Profile" onClick={() => handleNavigate("Profile")} />
                <DropdownItem icon={<FiHelpCircle />} label="Help" onClick={() => handleNavigate("Help")} />
              </div>
              <div className="border-t py-1">
                <DropdownItem icon={<FiLogOut />} label="Logout" onClick={handleLogout} danger />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const DropdownItem = ({ icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-gray-50 ${danger ? "text-red-500" : "text-gray-700"}`}
  >
    {icon}
    {label}
  </button>
);
