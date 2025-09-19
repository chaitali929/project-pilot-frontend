import React from "react";

export default function ProjectProgress() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Project Progress</h3>

      <div className="bg-gray-50 p-6 rounded-md">
        <div className="flex items-center gap-4">
          {/* timeline steps */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-4 w-full">
              <div className="flex-1 border-t-2 border-blue-200 relative">
                <div className="absolute -left-4 -top-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">✓</div>
                </div>
              </div>
              <div className="flex-1 border-t-2 border-blue-200 relative">
                <div className="absolute -left-4 -top-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">✓</div>
                </div>
              </div>
              <div className="flex-1 border-t-2 border-blue-200 relative">
                <div className="absolute -left-4 -top-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">✓</div>
                </div>
              </div>
              <div className="flex-1 border-t-2 border-gray-200 relative">
                <div className="absolute -left-4 -top-3">
                  <div className="w-8 h-8 rounded-full bg-white border text-gray-400 flex items-center justify-center">4</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 text-xs text-gray-600">
          <div className="text-center">Topic Submitted</div>
          <div className="text-center">Guide Approved</div>
          <div className="text-center">Reports Submitted</div>
          <div className="text-center">Topic selected</div>
        </div>
      </div>
    </div>
  );
}
