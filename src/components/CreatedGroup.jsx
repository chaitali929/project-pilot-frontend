import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function GroupDetails() {
  const members = [
    { id: 1, name: "Anuj Dighe", role: "Leader", lastActive: "Active now" },
    { id: 2, name: "Mayur Kumawat", role: "Member", lastActive: "2 hours ago" },
    { id: 3, name: "Chaitali Dhalje", role: "Member", lastActive: "1 day ago" },
    { id: 4, name: "Om Waghmare", role: "Member", lastActive: "3 day ago" },
  ];

  const pendingRequests = [
    { id: 1, name: "Anuj Dighe", time: "51 mins ago" },
    { id: 2, name: "Mayur Kumawat", time: "2 hours ago" },
    { id: 3, name: "Chaitali Dhalje", time: "1 day ago" },
    { id: 4, name: "Om Waghmare", time: "3 day ago" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="p-6 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Group Title */}
            <h2 className="text-xl font-semibold">Team Alpha (4/4)</h2>

            {/* Members Table */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-sm">
                    <th className="pb-3">Members</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Last Active</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y">
                  {members.map((m) => (
                    <tr key={m.id} className="h-14">
                      <td className="flex items-center gap-3 py-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                        {m.name}
                      </td>
                      <td>
                        {m.role === "Leader" ? (
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                            Leader
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            Member
                          </span>
                        )}
                      </td>
                      <td>{m.lastActive}</td>
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

            {/* Mentor + Group Progress + Pending Requests */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mentor */}
              <div className="bg-white rounded-lg shadow-sm p-4 col-span-1">
                <h3 className="font-medium text-gray-700 mb-3">Mentor</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <div className="font-medium">Prof. Archana Mate</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Group Progress
                  </h4>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    5 more milestones for completion
                  </p>
                </div>
              </div>

              {/* Pending Requests */}
              <div className="bg-white rounded-lg shadow-sm p-4 col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-700">Pending Requests</h3>
                  <button className="text-red-500 text-sm hover:underline">
                    Reject all
                  </button>
                </div>
                <ul className="divide-y text-sm">
                  {pendingRequests.map((req) => (
                    <li
                      key={req.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                        <div>
                          <div className="font-medium">{req.name}</div>
                          <div className="text-xs text-gray-500">{req.time}</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="text-green-500 hover:text-green-700">
                          ✔
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          ✖
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
