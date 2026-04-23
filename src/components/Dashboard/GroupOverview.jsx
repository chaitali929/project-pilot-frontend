import React, { useEffect } from "react";
import useGroupStore from "../../store/groupStore";
import useUserStore from "../../store/userStore";

export default function GroupOverview() {
  const { groups, fetchGroups } = useGroupStore();
  const { user } = useUserStore();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const userGroup = groups.find(group => 
    group.admin?._id === user?.id || 
    group.members?.some(m => m.userId?._id === user?.id && m.status === 'accepted')
  );

  const isAdmin = userGroup?.admin?._id === user?.id;
  const acceptedMembers = userGroup?.members?.filter(m => m.status === 'accepted') || [];
  const totalMembers = acceptedMembers.length + 1;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Group Overview</h3>
        <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          {userGroup ? 'Active' : 'No Group'}
        </span>
      </div>

      {userGroup ? (
        <>
          <p className="mt-4 text-gray-600">
            {userGroup.groupName}{" "}
            {isAdmin && (
              <span className="ml-2 inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Leader
              </span>
            )}
          </p>

          <div className="mt-4 flex items-center gap-3">
            {[userGroup.admin, ...acceptedMembers.map(m => m.userId)].slice(0, 5).map((member, index) => (
              <div key={index} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center border border-gray-200 text-sm font-semibold">
                {member?.email?.charAt(0).toUpperCase()}
              </div>
            ))}
            {totalMembers > 5 && (
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">
                +{totalMembers - 5}
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="mt-4 text-gray-500 text-sm">You are not part of any group yet</p>
      )}
    </div>
  );
}
