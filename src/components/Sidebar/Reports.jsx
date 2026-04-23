import React, { useState, useEffect } from "react";
import { Upload, ChevronDown, ChevronUp, Plus } from "lucide-react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import useReportStore from "../../store/reportStore";
import useGroupStore from "../../store/GroupStore";

const FILE_BASE = "http://localhost:3000/uploads/reports/";

function VersionUploader({ reportId, onDone }) {
  const { addVersion, fetchReports, isLoading } = useReportStore();
  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append("reportFile", file);
    fd.append("note", note);
    await addVersion(reportId, fd);
    setFile(null);
    setNote("");
    onDone();
  };

  return (
    <form onSubmit={submit} className="mt-3 p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl space-y-2">
      <p className="text-xs font-semibold text-gray-600">Upload New Version</p>
      <input
        type="text"
        placeholder="Version note (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
        className="w-full text-xs p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-500 hover:text-blue-600 transition">
        <Upload size={14} />
        {file ? file.name : "Choose PDF or DOCX"}
        <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleFile} />
      </label>
      <button
        type="submit"
        disabled={!file || isLoading}
        className="w-full text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-1.5 rounded-lg font-medium transition"
      >
        {isLoading ? "Uploading..." : "Submit Version"}
      </button>
    </form>
  );
}

function ReportRow({ report, groupId }) {
  const { fetchReports } = useReportStore();
  const [expanded, setExpanded] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const versions = report.versions?.length
    ? report.versions
    : [{ file: report.reportFile, uploadedAt: report.createdAt, note: "Initial submission" }];

  const onVersionAdded = () => {
    setShowUploader(false);
    fetchReports(groupId);
  };

  return (
    <>
      <tr className="border-t hover:bg-gray-50">
        <td className="px-6 py-4 font-medium text-gray-800">{report.reportTitle}</td>
        <td className="px-6 py-4 text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            report.status === "accepted" ? "bg-green-100 text-green-700" :
            report.status === "rejected" ? "bg-red-100 text-red-700" :
            report.status === "viewed" ? "bg-blue-100 text-blue-700" :
            "bg-yellow-100 text-yellow-700"
          }`}>
            {report.status}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="text-xs text-gray-500 font-medium">v{versions.length}</span>
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Hide" : "Versions"}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-gray-50">
          <td colSpan={5} className="px-6 py-4">
            <div className="space-y-2">
              {versions.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-400 w-6">v{i + 1}</span>
                    <div>
                      <a
                        href={`${FILE_BASE}${v.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        {v.file}
                      </a>
                      {v.note && <p className="text-xs text-gray-400">{v.note}</p>}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(v.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}

              {!showUploader ? (
                <button
                  onClick={() => setShowUploader(true)}
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium mt-1 transition"
                >
                  <Plus size={13} /> Upload New Version
                </button>
              ) : (
                <VersionUploader reportId={report._id} onDone={onVersionAdded} />
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Reports() {
  const [reportTitle, setReportTitle] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const { postReport, fetchReports, reports, isLoading, error } = useReportStore();
  const { groups, fetchGroups } = useGroupStore();
  const [currentGroupId, setCurrentGroupId] = useState(null);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  useEffect(() => {
    if (groups.length > 0) {
      const acceptedGroup = groups.find(g => g.members?.some(m => m.status === "accepted"));
      if (acceptedGroup) {
        setCurrentGroupId(acceptedGroup._id);
        fetchReports(acceptedGroup._id);
      }
    }
  }, [groups, fetchReports]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && /\.(pdf|docx)$/i.test(file.name)) setReportFile(file);
    else alert("Only PDF and DOCX files are allowed");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && /\.(pdf|docx)$/i.test(file.name)) setReportFile(file);
    else alert("Only PDF and DOCX files are allowed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentGroupId) return alert("You must be part of a group to submit a report");
    if (!reportFile) return alert("Please upload a report file");

    const fd = new FormData();
    fd.append("groupId", currentGroupId);
    fd.append("reportTitle", reportTitle);
    fd.append("reportFile", reportFile);

    await postReport(fd);
    if (!error) {
      setReportTitle("");
      setReportFile(null);
      fetchReports(currentGroupId);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6 space-y-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800">Submit Your Report</h1>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              {/* Submit form */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="font-semibold text-gray-700 mb-4">New Report Submission</h2>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Report Title</label>
                    <input
                      type="text"
                      placeholder="Enter report title"
                      value={reportTitle}
                      onChange={e => setReportTitle(e.target.value)}
                      required
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-3">Attach File</p>
                    <label
                      htmlFor="fileUpload"
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-40 cursor-pointer transition ${
                        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-10 h-10 text-gray-400" />
                      <p className="text-gray-500 mt-2 text-sm">
                        {reportFile ? reportFile.name : "Drag & drop your PDF/DOCX here or click to browse"}
                      </p>
                      <p className="text-xs text-gray-400">PDF or DOCX · max 10MB</p>
                      <input id="fileUpload" type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow disabled:opacity-50 transition"
                  >
                    {isLoading ? "Submitting..." : "Submit Report"}
                  </button>
                </form>
              </div>

              {/* Reports table with version rows */}
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Title</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Versions</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No reports submitted yet</td>
                      </tr>
                    ) : (
                      reports.map(report => (
                        <ReportRow key={report._id} report={report} groupId={currentGroupId} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar panels */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="font-semibold text-gray-700 mb-4">Submission Guidelines</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• File format: PDF or DOCX</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Upload new versions to existing reports</li>
                  <li>• Feedback timeline: Within 2 working days</li>
                </ul>
              </div>

              {reports.some(r => r.status === "accepted") && (
                <div className="bg-white p-6 rounded-2xl shadow">
                  <h3 className="font-semibold text-gray-700 mb-4">Mentor Approvals</h3>
                  <div className="space-y-3">
                    {reports.filter(r => r.status === "accepted").map(r => (
                      <div key={r._id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{r.reportTitle}</span>
                        <span className="text-green-600 font-semibold text-xs">✓ Accepted</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reports.some(r => r.mentorFeedback) && (
                <div className="bg-white p-6 rounded-2xl shadow">
                  <h3 className="font-semibold text-gray-700 mb-4">Mentor Feedback</h3>
                  <div className="space-y-4">
                    {reports.filter(r => r.mentorFeedback).reverse().map(r => (
                      <div key={r._id} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{r.reportTitle}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            r.status === "accepted" ? "bg-green-100 text-green-700" :
                            r.status === "rejected" ? "bg-red-100 text-red-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>{r.status}</span>
                        </div>
                        <div className="p-3 bg-gray-50 border rounded-lg text-sm text-gray-700">{r.mentorFeedback}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
