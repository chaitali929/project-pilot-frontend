import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";

const groups = [
  { name: "Code Crusaders", members: "4/4", status: "Full" },
  { name: "Pixel Pioneers", members: "3/4", status: "Open" },
  { name: "Logic Legends", members: "3/4", status: "Open" },
  { name: "Bug Busters", members: "4/4", status: "Full" },
  { name: "Data Dynamos", members: "4/4", status: "Full" },
  { name: "Syntax Squad", members: "4/4", status: "Full" },
  { name: "UI Unicorns", members: "2/4", status: "Open" },
];

// Fake members data for create group screen
const members = [
  { name: "Mayur Kumawat", status: "Accepted" },
  { name: "Chaitali Dhalje", status: "Invite" },
  { name: "Om Waghmare", status: "Pending" },
  { name: "Atharva Shelke", status: "In Group" },
  { name: "Mahendra Samant", status: "Rejected" },
];

export default function Groups() {
  const [showCreate, setShowCreate] = useState(false);
    const navigate = useNavigate();


  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {!showCreate ? (
              <>
                {/* Default Groups UI */}
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold">
                    You’re not in any group yet
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Create a new group or join an existing one to get started.
                  </p>
                </div>

                {/* Card Container */}
                <div className="mx-auto w-[900px] rounded-2xl border border-gray-200 bg-white shadow p-6">
                  {/* Card Header */}
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
                        aria-label="Refresh"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      >
                        ↻
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 border-b border-gray-200 bg-gray-50 px-4 py-3">
                      <div>Group Name</div>
                      <div>Members</div>
                      <div>Status</div>
                      <div>Action</div>
                    </div>

                    {/* Table Rows */}
                    {groups.map((g, index) => (
                      <div
                        key={g.name}
                        className={`grid grid-cols-4 gap-4 items-center px-4 py-3 text-sm ${
                          index !== groups.length - 1
                            ? "border-b border-gray-200"
                            : ""
                        }`}
                      >
                        <div className="text-gray-800">{g.name}</div>
                        <div className="text-gray-600">{g.members}</div>
                        <div>
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                              g.status === "Open"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                g.status === "Open"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                              }`}
                            />
                            {g.status}
                          </span>
                        </div>
                        <div>
                          <button
                            disabled={g.status !== "Open"}
                            className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-medium shadow-sm transition-colors ${
                              g.status === "Open"
                                ? "bg-[#1F73E8] text-white hover:bg-[#1663cc]"
                                : "bg-gray-100 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            Ask to Join
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Create Group button */}
                <button
                  onClick={() => setShowCreate(true)}
                  className="fixed bottom-8 right-8 inline-flex items-center gap-2 rounded-full bg-[#1F73E8] px-4 py-2 text-white shadow hover:bg-[#1663cc]"
                >
                  <span className="text-lg">＋</span>
                  <span className="text-sm font-medium">Create Group</span>
                </button>
              </>
            ) : (
              <>
          {/* Create Group UI */}
<div className="mx-auto w-[700px] rounded-2xl border border-gray-200 bg-white shadow p-6">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-semibold">Create Group</h3>
    <button
      onClick={() => setShowCreate(false)}
      className="text-sm text-gray-500 hover:text-gray-700"
    >
      ← Available Groups
    </button>
  </div>
  <hr className="border-gray-300 mb-6" /> {/* Gray line */}

  {/* Group Name */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Group Name
    </label>
    <input
      type="text"
      placeholder="Enter Group Name"
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
    />
  </div>

  {/* Invite Members */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Invite Members (2/4)
    </label>

    {/* Invited avatars */}
    <div className="flex -space-x-3 mb-3">
      <img
        src="/avatars/mayur.png"
        alt="Mayur"
        className="w-10 h-10 rounded-full border-2 border-white"
      />
      <img
        src="/avatars/chaitali.png"
        alt="Chaitali"
        className="w-10 h-10 rounded-full border-2 border-white"
      />
    </div>

    {/* Search box with icon */}
    <div className="relative mb-4">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        🔍
      </span>
      <input
        type="text"
        placeholder="Invite by user name"
        className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

  {/* Members List inside gray border */}
<div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
  {members.map((m) => (
    <div
      key={m.name}
      className="grid grid-cols-3 items-center px-4 py-3"
    >
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-3">
        <img
          src={`/avatars/${m.name.split(" ")[0].toLowerCase()}.png`}
          alt={m.name}
          className="w-10 h-10 rounded-full"
        />
        <p className="text-sm font-medium text-gray-800">{m.name}</p>
      </div>

      {/* Middle: Availability */}
      <div className="text-center text-xs text-gray-500">
        {m.status === "In Group" ? "In group" : "Available"}
      </div>

      {/* Right: Equal size buttons */}
      <div className="flex justify-end">
        <button
          className={`min-w-[90px] text-center px-3 py-1 rounded-md text-xs font-medium ${
            m.status === "Accepted"
              ? "bg-green-500 text-white"
              : m.status === "Invite"
              ? "bg-blue-500 text-white"
              : m.status === "Pending"
              ? "bg-gray-400 text-white"
              : m.status === "In Group"
              ? "bg-gray-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {m.status}
        </button>
      </div>
    </div>
  ))}
</div>

  </div>

  {/* Create Button */}
   <button
        onClick={() => navigate("/StudentDashboard/Groups/Created")}
        className="w-full rounded-md bg-[#1F73E8] py-2 text-white font-medium hover:bg-[#1663cc] mt-6"
      >
        Create a Group
      </button>
</div>

              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
