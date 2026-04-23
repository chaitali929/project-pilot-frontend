import React, { useEffect, useState } from 'react';
import { Trash2, Edit2, Check, X, ChevronDown, UserCog, Users, BookOpen, FileText, Shield } from 'lucide-react';
import useCoordinatorStore from '../store/coordinatorStore';
import CoordinatorSidebar from '../components/CoordinatorSideBar';
import Topbar from '../components/Topbar';

const TABS = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'groups', label: 'Groups', icon: UserCog },
  { id: 'topics', label: 'Topics', icon: BookOpen },
  { id: 'reports', label: 'Reports', icon: FileText },
];

const Badge = ({ label, color }) => (
  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${color}`}>{label}</span>
);

const statusColor = (s) => ({
  pending: 'bg-yellow-50 text-yellow-600',
  accepted: 'bg-green-50 text-green-600',
  rejected: 'bg-red-50 text-red-600',
  viewed: 'bg-blue-50 text-blue-600',
}[s] || 'bg-gray-100 text-gray-600');

// ── Users Tab ─────────────────────────────────────────────────────────────────
const UsersTab = () => {
  const { adminUsers, fetchAdminUsers, changeUserRole, deleteUser, isLoading } = useCoordinatorStore();
  const [editingRole, setEditingRole] = useState(null); // { id, role }
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAdminUsers(); }, []);

  const filtered = adminUsers.filter(u =>
    (u.name || u.email).toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleSave = async () => {
    if (!editingRole) return;
    await changeUserRole(editingRole.id, editingRole.role);
    setEditingRole(null);
  };

  return (
    <div className="space-y-4">
      <input
        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {isLoading ? (
        <div className="flex justify-center py-10"><div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name / Email</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{user.name || '—'}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.department}</td>
                  <td className="px-6 py-4">
                    {editingRole?.id === user._id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={editingRole.role}
                          onChange={e => setEditingRole({ id: user._id, role: e.target.value })}
                          className="border rounded-lg px-2 py-1 text-xs focus:outline-none"
                        >
                          <option value="student">student</option>
                          <option value="mentor">mentor</option>
                          <option value="coordinator">coordinator</option>
                        </select>
                        <button onClick={handleRoleSave} className="text-green-500 hover:text-green-700"><Check size={14} /></button>
                        <button onClick={() => setEditingRole(null)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                      </div>
                    ) : (
                      <Badge
                        label={user.role}
                        color={user.role === 'mentor' ? 'bg-green-50 text-green-600' : user.role === 'coordinator' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingRole({ id: user._id, role: user.role })}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Change Role"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete User"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Groups Tab ────────────────────────────────────────────────────────────────
const GroupsTab = () => {
  const { adminGroups, mentors, fetchAdminGroups, fetchMentors, adminChangeMentor, adminDeleteGroup, adminRemoveMember, isLoading } = useCoordinatorStore();
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [changingMentor, setChangingMentor] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAdminGroups(); fetchMentors(); }, []);

  const filtered = adminGroups.filter(g =>
    g.groupName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Search groups..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {isLoading ? (
        <div className="flex justify-center py-10"><div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(group => (
            <div key={group._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedGroup(expandedGroup === group._id ? null : group._id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-gray-800">{group.groupName}</p>
                    <p className="text-xs text-gray-400">{group.year} · {group.currentYear} · {group.members?.filter(m => m.status === 'accepted').length || 0} members</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    label={group.mentor ? group.mentor.name : 'No Mentor'}
                    color={group.mentor ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}
                  />
                  <button
                    onClick={e => { e.stopPropagation(); adminDeleteGroup(group._id); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedGroup === group._id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {expandedGroup === group._id && (
                <div className="px-6 pb-5 border-t border-gray-50 space-y-4 pt-4">
                  {/* Change Mentor */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">Mentor:</span>
                    {changingMentor === group._id ? (
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue={group.mentor?._id || ''}
                          onChange={async e => { await adminChangeMentor(group._id, e.target.value || null); setChangingMentor(null); }}
                          className="border rounded-lg px-2 py-1 text-sm focus:outline-none"
                        >
                          <option value="">— Remove Mentor —</option>
                          {mentors.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
                        </select>
                        <button onClick={() => setChangingMentor(null)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">{group.mentor ? `${group.mentor.name} (${group.mentor.email})` : 'None'}</span>
                        <button
                          onClick={() => setChangingMentor(group._id)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Members */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Members</p>
                    <div className="space-y-2">
                      {group.members?.filter(m => m.status === 'accepted').map(m => (
                        <div key={m.userId?._id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2">
                          <div>
                            <p className="text-sm font-medium text-gray-700">{m.userId?.name || '—'}</p>
                            <p className="text-xs text-gray-400">{m.userId?.email}</p>
                          </div>
                          <button
                            onClick={() => adminRemoveMember(group._id, m.userId?._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {!group.members?.filter(m => m.status === 'accepted').length && (
                        <p className="text-xs text-gray-400">No accepted members.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">No groups found.</div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Topics Tab ────────────────────────────────────────────────────────────────
const TopicsTab = () => {
  const { adminTopics, fetchAdminTopics, adminUpdateTopicStatus, isLoading } = useCoordinatorStore();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAdminTopics(); }, []);

  const filtered = adminTopics.filter(t =>
    t.projectTitle?.toLowerCase().includes(search.toLowerCase()) ||
    t.groupId?.groupName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Search topics..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {isLoading ? (
        <div className="flex justify-center py-10"><div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Project Title</th>
                <th className="px-6 py-4">Group</th>
                <th className="px-6 py-4">Mentor</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(topic => (
                <tr key={topic._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{topic.projectTitle}</td>
                  <td className="px-6 py-4 text-gray-500">{topic.groupId?.groupName} <span className="text-xs text-gray-400">({topic.groupId?.year})</span></td>
                  <td className="px-6 py-4 text-gray-500">{topic.mentorId?.name || '—'}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{topic.projectCategory}</td>
                  <td className="px-6 py-4"><Badge label={topic.status} color={statusColor(topic.status)} /></td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={topic.status}
                      onChange={e => adminUpdateTopicStatus(topic._id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-xs focus:outline-none"
                    >
                      <option value="pending">pending</option>
                      <option value="accepted">accepted</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">No topics found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Reports Tab ───────────────────────────────────────────────────────────────
const ReportsTab = () => {
  const { adminReports, fetchAdminReports, isLoading } = useCoordinatorStore();
  const [search, setSearch] = useState('');
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => { fetchAdminReports(); }, []);

  const filtered = adminReports.filter(r =>
    r.reportTitle?.toLowerCase().includes(search.toLowerCase()) ||
    r.groupId?.groupName?.toLowerCase().includes(search.toLowerCase())
  );

  const viewReport = (reportFile) => {
    window.open(`${API_BASE}/uploads/reports/${reportFile.split('/').pop()}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <input
        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Search reports..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {isLoading ? (
        <div className="flex justify-center py-10"><div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Report Title</th>
                <th className="px-6 py-4">Group</th>
                <th className="px-6 py-4">Mentor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(report => (
                <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{report.reportTitle}</td>
                  <td className="px-6 py-4 text-gray-500">{report.groupId?.groupName} <span className="text-xs text-gray-400">({report.groupId?.year})</span></td>
                  <td className="px-6 py-4 text-gray-500">{report.mentorId?.name || '—'}</td>
                  <td className="px-6 py-4"><Badge label={report.status} color={statusColor(report.status)} /></td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    {report.reportFile ? (
                      <button
                        onClick={() => viewReport(report.reportFile)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-all"
                      >
                        View
                      </button>
                    ) : <span className="text-gray-300 text-xs">N/A</span>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">No reports found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Main Administration Page ──────────────────────────────────────────────────
export default function AdministrationPage() {
  const [activeTab, setActiveTab] = useState('users');
  const { error, clearError } = useCoordinatorStore();

  return (
    <div className="flex h-screen bg-gray-50">
      <CoordinatorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-xl">
                <Shield className="text-red-500 w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Administration</h1>
                <p className="text-sm text-gray-400">Full control over users, groups, topics and reports.</p>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
                <button onClick={clearError}><X size={16} /></button>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm w-fit">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'groups' && <GroupsTab />}
            {activeTab === 'topics' && <TopicsTab />}
            {activeTab === 'reports' && <ReportsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
