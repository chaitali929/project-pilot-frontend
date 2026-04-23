import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiMail, FiBook } from 'react-icons/fi';

const FAQS = [
  { q: 'How do I create a group?', a: 'Go to Groups in the sidebar, click "Create Group", fill in the details and invite members.' },
  { q: 'How do I submit a topic?', a: 'Navigate to Topics, fill in the project title, description, category and upload your abstract PDF/DOCX.' },
  { q: 'How do I submit a report?', a: 'Go to Reports, enter the report title, upload your PDF/DOCX file and click Submit Report.' },
  { q: 'How do I view mentor feedback?', a: 'Feedback appears on your Topics, Reports, and Project Diary pages once your mentor reviews them.' },
  { q: 'How do I submit a diary entry?', a: 'Go to Project Diary, click "New Entry", fill in the week, date range, summary, tasks and upload proof of work.' },
  { q: 'How do I contact my mentor?', a: 'Your assigned mentor details are visible in your group page. You can reach out via email shown there.' },
];

export default function HelpPage({ Sidebar, Topbar }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Help & Support</h1>
            <p className="text-gray-500 text-sm mb-8">Find answers to common questions or reach out to us.</p>

            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FiBook className="text-blue-500" /> Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
                    >
                      {faq.q}
                      {openIdx === idx ? <FiChevronUp className="text-gray-400 shrink-0" /> : <FiChevronDown className="text-gray-400 shrink-0" />}
                    </button>
                    {openIdx === idx && (
                      <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex">
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center gap-3 flex-1">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <FiMail className="text-blue-500 w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-800">Email Support</h3>
                <p className="text-xs text-gray-500">Reach us at</p>
                <a href="mailto:support@projectpilot.com" className="text-sm text-blue-600 hover:underline">support@projectpilot.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
