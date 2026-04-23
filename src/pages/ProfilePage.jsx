import React, { useEffect, useState } from 'react';
import { FiMail, FiBook, FiMapPin, FiUser, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import useUserStore from '../store/userStore';

export default function ProfilePage({ Sidebar, Topbar }) {
  const { user, initializeUser, updateProfile, isLoading } = useUserStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', collegeName: '', department: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => { initializeUser(); }, [initializeUser]);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', collegeName: user.collegeName || '', department: user.department || '' });
  }, [user]);

  const handleSave = async () => {
    const result = await updateProfile(form);
    if (result.success) { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2000); }
  };

  const initial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition">
                  <FiEdit2 size={15} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                    <FiCheck size={15} /> {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                    <FiX size={15} /> Cancel
                  </button>
                </div>
              )}
            </div>

            {saved && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                ✓ Profile updated successfully
              </div>
            )}

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
                <EditableField icon={<FiUser className="text-gray-400" />} label="Name"
                  value={form.name} editing={editing}
                  onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Enter your name" />
                <Field icon={<FiMail className="text-gray-400" />} label="Email" value={user?.email} />
                <EditableField icon={<FiBook className="text-gray-400" />} label="Department"
                  value={form.department} editing={editing}
                  onChange={v => setForm(f => ({ ...f, department: v }))} placeholder="Enter department" />
                <EditableField icon={<FiMapPin className="text-gray-400" />} label="College"
                  value={form.collegeName} editing={editing}
                  onChange={v => setForm(f => ({ ...f, collegeName: v }))} placeholder="Enter college name" />
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

const EditableField = ({ icon, label, value, editing, onChange, placeholder }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
    {icon}
    <div className="flex-1">
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      {editing ? (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      ) : (
        <p className="text-sm text-gray-800 font-medium">{value || '—'}</p>
      )}
    </div>
  </div>
);
