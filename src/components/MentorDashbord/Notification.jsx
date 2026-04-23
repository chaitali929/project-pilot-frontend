import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import MentorSideBar from "../MentorSideBar";
import Topbar from "../Topbar";
import { notificationAPI } from "../../api";

const CATEGORIES = ["All", "Tasks", "Mentor"];

export default function MentorNotifications() {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    notificationAPI.getMentorNotifications()
      .then(res => setNotifications(res.data.notifications || []))
      .catch(() => setNotifications([]))
      .finally(() => setIsLoading(false));
  }, []);

  const visible = notifications.filter(n =>
    !dismissed.includes(n._id) &&
    (activeTab === "All" || n.category === activeTab)
  );

  const grouped = visible.reduce((acc, n) => {
    const d = new Date(n.time);
    const today = new Date();
    const label = d.toDateString() === today.toDateString()
      ? "Today"
      : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
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
      <MentorSideBar />
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

        <main className="p-6 overflow-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Notifications</h1>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : Object.keys(grouped).length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">All caught up!</p>
              </div>
            ) : (
              Object.entries(grouped).map(([date, items]) => (
                <div key={date} className="mb-10">
                  <h3 className="text-sm font-semibold text-slate-500 mb-4 ml-1">{date}</h3>
                  <div className="space-y-3">
                    {items.map(n => (
                      <div key={n._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start p-5 gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl shrink-0">
                          {n.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">{n.title}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(n.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <button onClick={() => setDismissed(d => [...d, n._id])} className="text-slate-400 hover:text-slate-600 mt-1">
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
