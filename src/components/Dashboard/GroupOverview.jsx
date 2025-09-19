import React from "react";

export default function GroupOverview() {
  // Example array of image URLs (replace with actual paths or imported images)
  const teamMembers = [
    "/images/student1.jpg", // if stored locally in public/images/
    "/images/student2.jpg",
    "/images/student3.jpg",
    "/images/student4.jpg",
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Group Overview</h3>
        <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          Active
        </span>
      </div>

      <p className="mt-4 text-gray-600">
        Project Team 1{" "}
        <span className="ml-2 inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded">
          Leader
        </span>
      </p>

      <div className="mt-4 flex items-center gap-3">
        {teamMembers.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Student ${index + 1}`}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
        ))}
      </div>
    </div>
  );
}
