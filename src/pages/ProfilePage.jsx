import React, { useEffect } from 'react';
import { FiMail, FiBook, FiMapPin, FiUser } from 'react-icons/fi';
import useUserStore from '../store/userStore';

export default function ProfilePage({ Sidebar, Topbar }) {
  const { user, initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const initial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Profile</h1>

            <div className="bg-white rounded-2xl shadow p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {initial}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{displayName}</h2>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                  <span className="inline-block mt-1 px-3 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full capitalize">
                    {user?.role || 'Student'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Field icon={<FiUser className="text-gray-400" />} label="Name" value={user?.name} />
                <Field icon={<FiMail className="text-gray-400" />} label="Email" value={user?.email} />
                <Field icon={<FiBook className="text-gray-400" />} label="Department" value={user?.department} />
                <Field icon={<FiMapPin className="text-gray-400" />} label="College" value={user?.collegeName} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Field = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
    {icon}
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value || '—'}</p>
    </div>
  </div>
);
