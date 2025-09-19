import React from "react";

function Bullet({ color = "bg-green-500" }) {
  return <span className={`inline-block ${color} w-2 h-2 rounded-full mr-2`} />;
}

export default function TasksOverview() {
  return (
    <div className="bg-white rounded-xl shadow p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">Tasks Overview</h3>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <div className="font-medium mb-2">Done</div>
          <ul className="space-y-2">
            <li><Bullet color="bg-green-500" />Research</li>
            <li><Bullet color="bg-green-500" />Analysis</li>
            <li><Bullet color="bg-green-500" />Design</li>
          </ul>
        </div>

        <div>
          <div className="font-medium mb-2">Pending</div>
          <ul className="space-y-2">
            <li><Bullet color="bg-yellow-400" />Research</li>
            <li><Bullet color="bg-yellow-400" />Analysis</li>
            <li><Bullet color="bg-yellow-400" />Design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
