import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Bell 
} from 'lucide-react';
import MentorSideBar from "../MentorSideBar";
import Topbar from "../Topbar";

const NOTIFICATIONS_DATA = [
  {
    id: 1,
    group: "Today",
    items: [
      {
        id: "t1",
        type: "event",
        title: "Project Submission Due: Advanced UI/UX Design",
        time: "2 hours ago",
        icon: <Calendar className="text-rose-400" size={20} />,
        iconBg: "bg-rose-50"
      },
      {
        id: "t2",
        type: "user",
        title: "Professor Williams left feedback on your Weekly Report",
        time: "4 hours ago",
        avatar: "https://i.pravatar.cc/150?u=williams",
        hasAvatar: true
      }
    ]
  },
  {
    id: 2,
    group: "4 August 2025",
    items: [
      {
        id: "a1",
        type: "user",
        title: "Anuj Dighe added new task in taskboard",
        avatar: "https://i.pravatar.cc/150?u=anuj",
        hasAvatar: true
      }
    ]
  },
  {
    id: 3,
    group: "1 August 2025",
    items: [
      {
        id: "a2",
        type: "user",
        title: "New commit pushed to main branch by Om Waghmare",
        avatar: "https://i.pravatar.cc/150?u=om",
        hasAvatar: true
      }
    ]
  }
];

const NotificationItem = ({ item }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-4 flex items-center p-5 group transition-all hover:border-slate-200">
      {/* Icon/Avatar Section */}
      <div className="flex items-center justify-center w-20 border-r border-slate-50 mr-6">
        {item.hasAvatar ? (
          <img 
            src={item.avatar} 
            alt="user" 
            className="w-12 h-12 rounded-full object-cover ring-4 ring-slate-50"
          />
        ) : (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.iconBg}`}>
            {item.icon}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1">
        <h4 className="text-[15px] font-medium text-slate-700 leading-snug">
          {item.title}
        </h4>
        {item.time && (
          <p className="text-sm text-slate-400 mt-1 font-normal">
            {item.time}
          </p>
        )}
      </div>

      {/* Close Action */}
      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default function MentorNotifications() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MentorSideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Notifications</h1>
            </div>

            <div className="max-w-3xl mx-auto">

        {/* Groups */}
        {notifications.map((group) => (
          <div key={group.id} className="mb-10">
            <h3 className="text-[15px] font-semibold text-slate-500 mb-5 ml-2">
              {group.group}
            </h3>
            
            <div className="space-y-4">
              {group.items.map((item) => (
                <NotificationItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}

        {/* Optional Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">All caught up!</p>
          </div>
        )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}