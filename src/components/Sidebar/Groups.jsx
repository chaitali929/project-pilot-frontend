import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import useGroupStore from "../../store/groupStore";
import useUserStore from "../../store/userStore";
import GroupDashboard from "../Detailedgroup";

export default function Groups() {
  const [showCreate, setShowCreate] = useState(false);
  const [groupForm, setGroupForm] = useState({ groupName: '', maxMembers: 4 });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

  const { 
    groups, 
    users, 
    isLoading, 
    error, 
    fetchGroups, 
    fetchUsers, 
    createGroup, 
    inviteUsers,
    joinGroup,
    respondToInvite,
    clearError 
  } = useGroupStore();
  
  const { user, initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser();
    fetchGroups();
    fetchUsers();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const result = await createGroup(groupForm);
    if (result.success) {
      if (selectedUsers.length > 0) {
        await inviteUsers(result.group._id, selectedUsers);
      }
      setShowCreate(false);
      setGroupForm({ groupName: '', maxMembers: 4 });
      setSelectedUsers([]);
      fetchGroups();
    }
  };

  const handleUserSelection = (userId, action) => {
    if (action === 'invite') {
      setSelectedUsers([...selectedUsers, userId]);
    } else if (action === 'remove') {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const filteredUsers = users.filter(u => 
    u._id !== (user?.id || user?._id) &&
    u.collegeName === user?.collegeName &&
    u.department === user?.department
  );

  // Check if user is in any group (either as member or admin)
  const userGroup = groups.find(group => 
    // User is admin of the group
    (group.admin?._id === (user?.id || user?._id)) ||
    // User is an accepted member of the group
    group.members?.some(member => 
      member.userId?._id === (user?.id || user?._id) && member.status === 'accepted'
    )
  );

  const isUserInGroup = !!userGroup;
  const isUserAdmin = userGroup && userGroup.admin?._id === (user?.id || user?._id);
  const pendingRequests = userGroup?.members?.filter(m => m.status === 'pending') || [];
  
  // For display purposes, include admin as a member if they're not already in members array
  const acceptedMembers = userGroup?.members?.filter(m => m.status === 'accepted') || [];
  const adminAsMember = isUserAdmin && !acceptedMembers.some(m => m.userId._id === user?.id) ? 
    [{ userId: { _id: user?.id, email: user?.email }, status: 'accepted', _id: 'admin' }] : [];
  const allMembers = [...adminAsMember, ...acceptedMembers];

  // Check if user has any invitations
  const userInvitations = groups.filter(group => 
    group.members?.some(member => 
      member.userId?._id === (user?.id || user?._id) && 
      member.status === 'pending' && 
      member.invitedBy // User was invited by admin
    )
  );

  const handleJoinRequest = async (groupId) => {
    const group = groups.find(g => g._id === groupId);
    if (group?.admin?.collegeName !== user?.collegeName) {
      alert('You can only join groups from your college');
      return;
    }
    await joinGroup(groupId);
    fetchGroups();
  };

  const handleInvitationResponse = async (groupId, response) => {
    await respondToInvite(groupId, response);
    fetchGroups();
  };

  const getUserStatus = (userId) => {
    if (selectedUsers.includes(userId)) return 'Invited';
    const userInGroup = groups.some(group => 
      group.members?.some(member => 
        member.userId?._id === userId && member.status === 'accepted'
      )
    );
    return userInGroup ? 'In Group' : 'Available';
  };

  const getGroupStatus = (group) => {
    const acceptedCount = group.members?.filter(m => m.status === 'accepted').length || 0;
    // Add 1 for admin if admin is not already counted in members
    const totalMembers = acceptedCount + 1; // +1 for admin
    return totalMembers >= group.maxMembers ? 'Full' : 'Open';
  };

  const getUserGroupStatus = (group) => {
    const userMember = group.members?.find(member => 
      member.userId?._id === (user?.id || user?._id)
    );
    if (userMember) {
      if (userMember.status === 'pending' && userMember.invitedBy) return 'Invited';
      if (userMember.status === 'pending' && !userMember.invitedBy) return 'Requested';
      if (userMember.status === 'accepted') return 'Member';
    }
    return null;
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  // If user is in a group, show group dashboard
  if (isUserInGroup) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <GroupDashboard 
            userGroup={userGroup}
            isUserAdmin={isUserAdmin}
            allMembers={allMembers}
            pendingRequests={pendingRequests}
          />
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
          <div className="max-w-4xl mx-auto">
            {!showCreate ? (
              <>
                {/* Invitations Section */}
                {userInvitations.length > 0 && (
                  <div className="mx-auto w-[900px] rounded-2xl border border-blue-200 bg-blue-50 shadow p-6 mb-6">
                    <h3 className="text-[22px] font-semibold text-blue-900 mb-4">
                      Group Invitations ({userInvitations.length})
                    </h3>
                    <div className="space-y-3">
                      {userInvitations.map((group) => (
                        <div key={group._id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{group.groupName}</h4>
                            <p className="text-sm text-gray-500">Invited by admin</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleInvitationResponse(group._id, 'accepted')}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleInvitationResponse(group._id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mx-auto w-[900px] rounded-2xl border border-gray-200 bg-white shadow p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                    <h3 className="text-[22px] font-semibold text-gray-900">
                      Available Groups
                    </h3>
                    <div className="flex items-center gap-3">
                      <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <span>All</span>
                        <span className="text-gray-500">▾</span>
                      </button>
                      <button
                        onClick={fetchGroups}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      >
                        ↻
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 border-b border-gray-200 bg-gray-50 px-4 py-3">
                      <div>Group Name</div>
                      <div>Members</div>
                      <div>Status</div>
                      <div>Action</div>
                    </div>

                    {groups.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        No groups available
                      </div>
                    ) : (
                      groups.map((group, index) => {
                        const acceptedMembers = group.members?.filter(m => m.status === 'accepted').length || 0;
                        const totalMembers = acceptedMembers + 1; // +1 for admin
                        const status = getGroupStatus(group);
                        const userGroupStatus = getUserGroupStatus(group);
                        const isUserInThisGroup = group.members?.some(member => 
                          member.userId?._id === (user?.id || user?._id) && member.status === 'accepted'
                        );
                        
                        return (
                          <div
                            key={group._id}
                            className={`grid grid-cols-4 gap-4 items-center px-4 py-3 text-sm ${
                              index !== groups.length - 1 ? "border-b border-gray-200" : ""
                            }`}
                          >
                            <div className="text-gray-800">{group.groupName}</div>
                            <div className="text-gray-600">{totalMembers}/{group.maxMembers}</div>
                            <div>
                              <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                                  status === "Open"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    status === "Open" ? "bg-green-500" : "bg-gray-500"
                                  }`}
                                />
                                {status}
                              </span>
                            </div>
                            <div>
                              {isUserInThisGroup ? (
                                <button
                                  onClick={() => navigate(`/StudentDashboard/Groups/Created/${group._id}`)}
                                  className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-medium shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                                >
                                  View Group
                                </button>
                              ) : userGroupStatus === 'Invited' ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleInvitationResponse(group._id, 'accepted')}
                                    className="flex-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleInvitationResponse(group._id, 'rejected')}
                                    className="flex-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                  >
                                    Decline
                                  </button>
                                </div>
                              ) : userGroupStatus === 'Requested' ? (
                                <button
                                  disabled
                                  className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-medium shadow-sm bg-yellow-100 text-yellow-700 cursor-not-allowed"
                                >
                                  Requested
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleJoinRequest(group._id)}
                                  disabled={status !== "Open"}
                                  className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-medium shadow-sm transition-colors ${
                                    status === "Open"
                                      ? "bg-[#1F73E8] text-white hover:bg-[#1663cc]"
                                      : "bg-gray-100 text-gray-500 cursor-not-allowed"
                                  }`}
                                >
                                  Ask to Join
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowCreate(true)}
                  className="fixed bottom-8 right-8 inline-flex items-center gap-2 rounded-full bg-[#1F73E8] px-4 py-2 text-white shadow hover:bg-[#1663cc]"
                >
                  <span className="text-lg">＋</span>
                  <span className="text-sm font-medium">Create Group</span>
                </button>
              </>
            ) : (
              <div className="mx-auto w-[700px] rounded-2xl border border-gray-200 bg-white shadow p-6">
                <form onSubmit={handleCreateGroup}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Create Group</h3>
                    <button
                      type="button"
                      onClick={() => setShowCreate(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      ← Available Groups
                    </button>
                  </div>
                  <hr className="border-gray-300 mb-6" />

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Group Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Group Name"
                      value={groupForm.groupName}
                      onChange={(e) => setGroupForm({...groupForm, groupName: e.target.value})}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Members
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="10"
                      value={groupForm.maxMembers}
                      onChange={(e) => setGroupForm({...groupForm, maxMembers: parseInt(e.target.value)})}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invite Members ({selectedUsers.length}/{groupForm.maxMembers - 1})
                    </label>

                    {selectedUsers.length > 0 && (
                      <div className="flex -space-x-3 mb-3">
                        {selectedUsers.map((userId, index) => {
                          const selectedUser = users.find(u => u._id === userId);
                          return (
                            <div key={`selected-${userId}-${index}`} className="w-10 h-10 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
                              {selectedUser?.email?.charAt(0).toUpperCase()}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto">
                      {filteredUsers.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          No members available from your college and department
                        </div>
                      ) : (
                        filteredUsers.map((member) => {
                          const status = getUserStatus(member._id);
                          return (
                            <div key={member._id} className="grid grid-cols-3 items-center px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                                  {member.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{member.email}</p>
                                  <p className="text-xs text-gray-500">{member.collegeName}</p>
                                </div>
                              </div>

                              <div className="text-center text-xs text-gray-500">
                                {status === "In Group" ? "In group" : "Available"}
                              </div>

                              <div className="flex justify-end">
                                {status === 'Available' && (
                                  <button
                                    type="button"
                                    onClick={() => handleUserSelection(member._id, 'invite')}
                                    disabled={selectedUsers.length >= groupForm.maxMembers - 1}
                                    className="min-w-[90px] text-center px-3 py-1 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
                                  >
                                    Invite
                                  </button>
                                )}
                                {status === 'Invited' && (
                                  <button
                                    type="button"
                                    onClick={() => handleUserSelection(member._id, 'remove')}
                                    className="min-w-[90px] text-center px-3 py-1 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700"
                                  >
                                    Remove
                                  </button>
                                )}
                                {status === 'In Group' && (
                                  <span className="min-w-[90px] text-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
                                    In Group
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreate(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Create Group
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}