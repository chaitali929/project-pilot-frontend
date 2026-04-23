import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import useGroupStore from "../store/groupStore";
import useUserStore from "../store/userStore";

export default function GroupDetails() {
  const { groupId } = useParams();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupForm, setGroupForm] = useState({ groupName: '', maxMembers: 4, year: 'SE', currentYear: '' });
  
  const { 
    currentGroup, 
    users, 
    isLoading, 
    error, 
    fetchGroupById, 
    fetchUsers, 
    createGroup, 
    inviteUsers, 
    respondToInvite,
    clearError 
  } = useGroupStore();
  
  const { user } = useUserStore();

  useEffect(() => {
    if (groupId) {
      fetchGroupById(groupId);
    } else {
      setShowCreateForm(true);
    }
    fetchUsers();
  }, [groupId]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const result = await createGroup(groupForm);
    if (result.success) {
      setShowCreateForm(false);
      setGroupForm({ groupName: '', maxMembers: 4, year: 'SE', currentYear: '' });
    }
  };

  const handleInviteUsers = async () => {
    if (selectedUsers.length > 0 && currentGroup) {
      const result = await inviteUsers(currentGroup._id, selectedUsers);
      if (result.success) {
        setShowInviteModal(false);
        setSelectedUsers([]);
      }
    }
  };

  const handleRespondToInvite = async (groupId, response) => {
    await respondToInvite(groupId, response);
  };

  const isAdmin = currentGroup && user && currentGroup.admin._id === user.id;
  const acceptedMembers = currentGroup?.members?.filter(m => m.status === 'accepted') || [];
  const pendingMembers = currentGroup?.members?.filter(m => m.status === 'pending') || [];

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (!groupId && !showCreateForm) {
    setShowCreateForm(true);
  }

  if (!currentGroup && !showCreateForm) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="p-6 overflow-auto">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">No Group Found</h2>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create New Group
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="p-6 overflow-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button onClick={clearError} className="float-right font-bold">×</button>
            </div>
          )}

          {showCreateForm ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                  <input
                    type="text"
                    value={groupForm.groupName}
                    onChange={(e) => setGroupForm({...groupForm, groupName: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={groupForm.maxMembers}
                    onChange={(e) => setGroupForm({...groupForm, maxMembers: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={groupForm.year}
                    onChange={(e) => setGroupForm({...groupForm, year: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="SE">SE</option>
                    <option value="TE">TE</option>
                    <option value="BE">BE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Year (e.g., 2025-2026)</label>
                  <input
                    type="text"
                    value={groupForm.currentYear}
                    onChange={(e) => setGroupForm({...groupForm, currentYear: e.target.value})}
                    placeholder="2025-2026"
                    pattern="^\d{4}-\d{4}$"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Create Group
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">
                    {currentGroup?.groupName} ({acceptedMembers.length}/{currentGroup?.maxMembers})
                  </h2>
                  <div className="text-sm text-gray-600 mt-1">
                    {currentGroup?.year} • {currentGroup?.currentYear}
                  </div>
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => setShowInviteModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Invite Members
                  </button>
                )}
              </div>

              {/* Members Table */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-sm">
                      <th className="pb-3">Members</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y">
                    {acceptedMembers.map((member, index) => (
                      <tr key={`member-${member._id}-${index}`} className="h-14">
                        <td className="flex items-center gap-3 py-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                            {member.userId?.email?.charAt(0).toUpperCase()}
                          </div>
                          {member.userId?.email}
                        </td>
                        <td>
                          {member.userId._id === currentGroup.admin._id ? (
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                              Admin
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              Member
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs">
                            {member.status}
                          </span>
                        </td>
                        <td>
                          <button className="p-2 text-gray-500 hover:text-gray-700">
                            ⋮
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pending Requests */}
              {isAdmin && pendingMembers.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-700">Pending Requests</h3>
                  </div>
                  <ul className="divide-y text-sm">
                    {pendingMembers.map((member, index) => (
                      <li key={`pending-${member._id}-${index}`} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                            {member.userId?.email?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{member.userId?.email}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(member.joinedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleRespondToInvite(currentGroup._id, 'accepted')}
                            className="text-green-500 hover:text-green-700"
                          >
                            ✔
                          </button>
                          <button 
                            onClick={() => handleRespondToInvite(currentGroup._id, 'rejected')}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✖
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Invite Modal */}
          {showInviteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Invite Users</h3>
                <div className="space-y-2 mb-4">
                  {users.map((user, index) => (
                    <label key={`invite-${user._id}-${index}`} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user._id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                          }
                        }}
                      />
                      <span>{user.email} - {user.collegeName}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleInviteUsers}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Send Invites
                  </button>
                  <button 
                    onClick={() => setShowInviteModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
