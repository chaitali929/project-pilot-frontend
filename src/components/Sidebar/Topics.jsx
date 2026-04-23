// src/pages/Topics.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { MdUploadFile } from "react-icons/md";
import useTopicStore from "../../store/TopicStore";
import useGroupStore from "../../store/GroupStore";

export default function Topics() {
  const [formData, setFormData] = useState({
    projectTitle: '',
    description: '',
    projectCategory: 'Web Development'
  });
  const [abstractFile, setAbstractFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const { postTopic, fetchTopics, topics, isLoading, error } = useTopicStore();
  const { groups, fetchGroups } = useGroupStore();
  const [currentGroupId, setCurrentGroupId] = useState(null);

  const hasAcceptedTopic = topics.some(t => t.status === 'accepted');

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (groups.length > 0) {
      const acceptedGroup = groups.find(g => {
        const isAccepted = g.members?.some(m => m.status === 'accepted');
        return isAccepted;
      });
      if (acceptedGroup) {
        setCurrentGroupId(acceptedGroup._id);
        fetchTopics(acceptedGroup._id);
      }
    }
  }, [groups, fetchTopics]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setAbstractFile(file);
      } else {
        alert('Only PDF and DOCX files are allowed');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setAbstractFile(file);
      } else {
        alert('Only PDF and DOCX files are allowed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentGroupId) {
      alert('You must be part of a group to submit a topic');
      return;
    }
    
    const hasAcceptedTopic = topics.some(t => t.status === 'accepted');
    if (hasAcceptedTopic) {
      alert('You already have an accepted topic. No more submissions allowed.');
      return;
    }
    
    if (!abstractFile) {
      alert('Please upload an abstract file');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('groupId', currentGroupId);
    formDataToSend.append('projectTitle', formData.projectTitle);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('projectCategory', formData.projectCategory);
    formDataToSend.append('abstract', abstractFile);

    await postTopic(formDataToSend);
    
    if (!error) {
      setFormData({
        projectTitle: '',
        description: '',
        projectCategory: 'Web Development'
      });
      setAbstractFile(null);
    }
  };
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Submit Your Topics</h2>
            {hasAcceptedTopic && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                ✓ Your topic has been accepted! No more submissions allowed.
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="Enter project title"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Description
                </label>
                <textarea
                  placeholder="Describe your project"
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Category
                </label>
                <select 
                  value={formData.projectCategory}
                  onChange={(e) => setFormData({...formData, projectCategory: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Web Development</option>
                  <option>Mobile App Development</option>
                  <option>Data Science</option>
                  <option>Machine Learning</option>
                  <option>Artificial Intelligence</option>
                  <option>Cybersecurity</option>
                  <option>Cloud Computing</option>
                  <option>Internet of Things</option>
                  <option>Blockchain</option>
                  <option>Game Development</option>
                  <option>other</option>
                </select>
              </div>

              <div 
                className={`border-2 border-dashed p-6 rounded-lg flex flex-col items-center text-gray-500 cursor-pointer hover:bg-gray-50 ${
                  dragActive ? 'bg-blue-50 border-blue-400' : ''
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <MdUploadFile className="text-3xl mb-2" />
                <p>{abstractFile ? abstractFile.name : 'Drag & drop your PDF/DOCX here or click to browse'}</p>
                <p className="text-sm">Supported formats: PDF, DOCX (max 10MB)</p>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || hasAcceptedTopic}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : hasAcceptedTopic ? 'Topic Already Accepted' : 'Submit Topic'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {topics.length > 0 && topics[topics.length - 1].mentorFeedback && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Latest Mentor Feedback</h2>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 font-medium">{topics[topics.length - 1].projectTitle}</span>
                  <span className={`font-medium ${
                    topics[topics.length - 1].status === 'accepted' ? 'text-green-500' :
                    topics[topics.length - 1].status === 'rejected' ? 'text-red-500' :
                    'text-yellow-500'
                  }`}>
                    ● {topics[topics.length - 1].status === 'accepted' ? 'Accepted' : 
                       topics[topics.length - 1].status === 'rejected' ? 'Rejected' : 'Pending'}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 border rounded-lg">
                  <p className="text-gray-700">{topics[topics.length - 1].mentorFeedback}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Submitted Topics</h2>
                <span className="text-sm text-gray-500">
                  Total: {topics.length}
                </span>
              </div>

              <ul className="space-y-3">
                {topics.length === 0 ? (
                  <li className="text-center text-gray-500 py-4">No topics submitted yet</li>
                ) : (
                  topics.map((topic, i) => (
                    <li
                      key={topic._id || i}
                      className="p-3 border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            topic.status === 'accepted' ? 'bg-green-100 text-green-600' :
                            topic.status === 'rejected' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {topic.projectTitle?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-medium">{topic.projectTitle}</span>
                            <p className="text-xs text-gray-500">{topic.projectCategory}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          topic.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          topic.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {topic.status}
                        </span>
                      </div>
                      {topic.mentorFeedback && (
                        <div className="mt-2 pl-11 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <span className="font-medium">Feedback: </span>{topic.mentorFeedback}
                        </div>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
