import React, { useState } from 'react';
import { MoreVertical, Check, X } from 'lucide-react';
import useGroupStore from '../store/groupStore';
import useUserStore from '../store/userStore';
import { useNavigate } from 'react-router-dom';

const GroupDashboard = ({ userGroup, isUserAdmin, allMembers, pendingRequests }) => {
  const { respondToInvite, respondToJoinRequest, leaveGroup, deleteGroup, removeMember } = useGroupStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Filter pending requests to show only users who requested to join (not invited by admin)
  const joinRequests = pendingRequests.filter(member => !member.invitedBy);

  // Create proper member list with admin first, then other accepted members
  const adminMember = {
    userId: userGroup.admin,
    status: 'accepted',
    _id: 'admin',
    isAdmin: true
  };
  
  const otherMembers = userGroup?.members?.filter(m => 
    m.status === 'accepted' && m.userId._id !== userGroup.admin._id
  ) || [];
  
  const displayMembers = [adminMember, ...otherMembers];

  // Generate dynamic last active status based on user data
  const getLastActiveStatus = (member, idx) => {
    if (member.isAdmin) return 'Active now';
    
    // Use member's joinedAt or updatedAt if available
    if (member.joinedAt) {
      const joinDate = new Date(member.joinedAt);
      const now = new Date();
      const diffMs = now - joinDate;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffHours < 1) return 'Active now';
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays < 7) return `${diffDays} days ago`;
      return `${Math.floor(diffDays / 7)} weeks ago`;
    }
    
    // Fallback to pseudo-random based on user ID
    const userId = member.userId?._id || member._id;
    if (userId) {
      const hash = userId.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const statuses = ['2 hours ago', '5 hours ago', '1 day ago', '2 days ago', '3 days ago', '1 week ago'];
      return statuses[Math.abs(hash) % statuses.length];
    }
    
    return '2 hours ago';
  };

  const handleRespondToJoinRequest = async (groupId, response, userId) => {
    await respondToJoinRequest(groupId, response, userId);
  };

  const handleLeaveGroup = async () => {
    const result = await leaveGroup(userGroup._id);
    if (result.success) {
      navigate('/StudentDashboard/Groups');
    }
    setShowActionModal(false);
  };

  const handleDeleteGroup = async () => {
    const result = await deleteGroup(userGroup._id);
    if (result.success) {
      navigate('/StudentDashboard/Groups');
    }
    setShowActionModal(false);
  };

  const handleRemoveMember = async () => {
    const targetUserId = selectedMember?.userId?._id === (user?.id || user?._id) 
      ? user?.id || user?._id 
      : selectedMember?.userId?._id;
    
    const result = await removeMember(userGroup._id, targetUserId);
    if (result.success) {
      if (selectedMember?.userId?._id === (user?.id || user?._id)) {
        navigate('/StudentDashboard/Groups');
      }
    }
    setShowActionModal(false);
    setSelectedMember(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Main Team Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 flex items-center gap-2">
            <h1 className="text-2xl font-bold">{userGroup?.groupName} ({displayMembers.length}/{userGroup?.maxMembers})</h1>
            <span className="text-gray-400 font-medium">• #{userGroup?._id?.slice(-4)}</span>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b border-gray-50">
                <th className="px-6 py-4 font-semibold">Members</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Last Active</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayMembers.map((member, idx) => {
                const isCurrentUser = member.userId?._id === (user?.id || user?._id);
                return (
                <tr key={`member-${member._id}-${idx}`} className={`transition-colors ${isCurrentUser ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                      {member.userId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className={`font-medium ${isCurrentUser ? 'text-blue-600' : ''}`}>
                      {isCurrentUser ? 'You' : member.userId?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                      member.isAdmin || member.userId._id === userGroup.admin._id
                        ? 'bg-blue-50 text-blue-500' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {member.isAdmin || member.userId._id === userGroup.admin._id ? 'Admin' : 'Member'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{getLastActiveStatus(member, idx)}</td>
                  <td className="px-6 py-4">
                    {isUserAdmin ? (
                      <button 
                        onClick={() => {
                          setSelectedMember(member);
                          setShowActionModal(true);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical size={20}/>
                      </button>
                    ) : (
                      (member.userId?._id === (user?.id || user?._id)) && (
                        <button 
                          onClick={() => {
                            setSelectedMember(member);
                            setShowActionModal(true);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical size={20}/>
                        </button>
                      )
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Mentor & Progress */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Mentor</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              {userGroup.mentor?.name ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                    {userGroup.mentor.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xl font-semibold">{userGroup.mentor.name}</span>
                </div>
              ) : userGroup.mentor ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                    M
                  </div>
                  <span className="text-xl font-semibold">Mentor Assigned</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                    ?
                  </div>
                  <span className="text-xl font-semibold text-gray-500">No Mentor Assigned</span>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-bold">Group Progress</h3>
                <span className="text-gray-400 font-bold">75%</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full mb-6">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-gray-500 font-medium text-sm">5 more milestones for completion</p>
            </div>
          </div>

          {/* Right Column: Join Requests */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Join Requests ({joinRequests.length})</h2>
              {isUserAdmin && joinRequests.length > 0 && (
                <button className="text-red-500 font-medium hover:underline text-sm">Reject all</button>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
              {joinRequests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No join requests
                </div>
              ) : (
                joinRequests.map((member, idx) => (
                  <div key={`request-${member._id}-${idx}`} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                        {member.userId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{member.userId?.name}</div>
                        <div className="text-xs text-gray-400">
                          Requested {new Date(member.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {isUserAdmin && (
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleRespondToJoinRequest(userGroup._id, 'accepted', member.userId._id)}
                          className="text-green-500 hover:bg-green-50 p-1 rounded"
                        >
                          <Check size={20}/>
                        </button>
                        <button 
                          onClick={() => handleRespondToJoinRequest(userGroup._id, 'rejected', member.userId._id)}
                          className="text-red-400 hover:bg-red-50 p-1 rounded"
                        >
                          <X size={20}/>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedMember?.userId?._id === (user?.id || user?._id) ? 'Group Actions' : 'Member Actions'}
            </h3>
            <div className="space-y-3">
              {selectedMember?.userId?._id === (user?.id || user?._id) ? (
                isUserAdmin ? (
                  <>
                    <button
                      onClick={handleDeleteGroup}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Delete Group
                    </button>
                
                  </>
                ) : (
                  <button
                    onClick={handleLeaveGroup}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Leave Group
                  </button>
                )
              ) : (
                <button
                  onClick={handleRemoveMember}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-md"
                >
                  Remove {selectedMember?.userId?.name}
                </button>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedMember(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDashboard;