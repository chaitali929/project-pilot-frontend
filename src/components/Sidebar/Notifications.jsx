import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { MdClose } from "react-icons/md";
import { notificationAPI } from "../../api";

const CATEGORIES = ["All", "Mentor", "Tasks"];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    notificationAPI.getStudentNotifications()
      .then(res => setNotifications(res.data.notifications || []))
      .catch(() => setNotifications([]))
      .finally(() => setIsLoading(false));
  }, []);

  const visible = notifications.filter(n =>
    !dismissed.includes(n._id) &&
    (activeTab === "All" || n.category === activeTab)
  );

  // Group by date
  const grouped = visible.reduce((acc, n) => {
    const d = new Date(n.time);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const label = isToday ? "Today" : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!acc[label]) acc[label] = [];
    acc[label].push(n);
    return acc;
  }, {});

  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === "All"
      ? notifications.filter(n => !dismissed.includes(n._id)).length
      : notifications.filter(n => !dismissed.includes(n._id) && n.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex space-x-6 border-b px-6 bg-white">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`py-3 text-sm font-medium border-b-2 ${
                activeTab === cat ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {cat} ({counts[cat]})
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-20 text-gray-400">No notifications yet.</div>
          ) : (
            Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <h2 className="text-gray-500 text-sm font-medium mb-3">{date}</h2>
                <div className="space-y-3">
                  {items.map(n => (
                    <div key={n._id} className="flex items-start justify-between bg-white p-4 rounded-xl shadow-sm border">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-xl shrink-0">
                          {n.icon}
                        </div>
                        <div>
                          <p className="text-gray-800 text-sm font-medium">{n.title}</p>
                          {n.feedback && (
                            <p className="text-xs text-gray-500 mt-1 bg-gray-50 px-2 py-1 rounded">
                              Feedback: {n.feedback}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(n.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => setDismissed(d => [...d, n._id])}>
                        <MdClose className="text-gray-400 hover:text-red-500 mt-1" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
