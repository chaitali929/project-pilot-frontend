import React, { useState } from "react";
import { Upload, Clock } from "lucide-react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

export default function Reports() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-800">Submit Your Report</h1>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-2 space-y-6">
              {/* Upload Section */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="font-semibold text-gray-700 mb-3">Attach File</p>
                <label
                  htmlFor="fileUpload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:border-blue-500 transition"
                >
                  <Upload className="w-10 h-10 text-gray-400" />
                  <p className="text-gray-500 mt-2">
                    Drag & drop your PDF here or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    Supported format: PDF or DOCX (max 10MB)
                  </p>
                  <input
                    id="fileUpload"
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow">
                  Submit Report
                </button>
              </div>

             {/* Reports Table */}
<div className="w-full bg-white rounded-2xl shadow overflow-hidden">
  <table className="w-full border-separate border-spacing-y-3 text-sm">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-4 text-left font-semibold text-gray-700">Week</th>
        <th className="px-6 py-4 text-left font-semibold text-gray-700">Date</th>
        <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
        <th className="px-6 py-4 text-left font-semibold text-gray-700">View</th>
      </tr>
    </thead>
    <tbody>
      {[
        { week: 4, date: "25 Aug", status: "Viewed", file: "report4.pdf" },
        { week: 3, date: "18 Aug", status: "Approved", file: "report3.pdf" },
        { week: 2, date: "11 Aug", status: "Approved", file: "report2.pdf" },
        { week: 1, date: "4 Aug", status: "Approved", file: "report1.pdf" },
      ].map((r, idx) => (
        <tr
          key={idx}
          className="bg-white hover:bg-gray-50 shadow-sm rounded-lg"
        >
          <td className="px-6 py-5">{r.week}</td>
          <td className="px-6 py-5">{r.date}</td>
          <td className="px-6 py-5">
            {r.status === "Approved" ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {r.status}
              </span>
            ) : (
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {r.status}
              </span>
            )}
          </td>
          <td className="px-6 py-5 text-blue-600 underline cursor-pointer">
            {r.file}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Submission Guidelines */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="font-semibold text-gray-700 mb-4">Submission Guidelines</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• File format: PDF or DOCX</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Submit before: 21 Aug 2025</li>
                  <li>• Feedback timeline: Within 2 working days</li>
                </ul>
              </div>

              {/* Mentor's Approval */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Mentor's Approval</h3>
                  <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                    <Clock className="w-4 h-4" /> Pending
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    "",
                    "Make Changes in References & methodology",
                    "Make Changes in References & methodology",
                    "Make Changes in References & methodology",
                  ].map((fb, i) => (
                    <div
                      key={i}
                      className="bg-white border rounded-lg shadow px-4 py-5 text-sm text-gray-700"
                    >
                      {fb}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
