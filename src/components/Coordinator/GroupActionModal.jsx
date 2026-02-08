import React, { useState, useEffect } from 'react';
import { X, User, Trash2 } from 'lucide-react';
import useCoordinatorStore from '../../store/coordinatorStore';

const GroupActionModal = ({ isOpen, onClose, group }) => {
  const [showMentorList, setShowMentorList] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const { assignMentor, removeGroup, mentors, fetchMentors, isLoading } = useCoordinatorStore();

  useEffect(() => {
    if (isOpen && showMentorList && mentors.length === 0) {
      fetchMentors();
    }
  }, [isOpen, showMentorList, mentors.length, fetchMentors]);

  const handleAssignMentor = async () => {
    if (selectedMentor && group) {
      await assignMentor(group._id, selectedMentor._id);
      onClose();
      setShowMentorList(false);
      setSelectedMentor(null);
    }
  };

  const handleRemoveGroup = async () => {
    if (group) {
      await removeGroup(group._id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Group Actions</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {!showMentorList ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <h3 className="font-semibold text-slate-800 mb-2">{group?.groupName}</h3>
              <p className="text-sm text-slate-600">{group?.projectTitle || 'No Project Title'}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowMentorList(true)}
                className="w-full flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors"
              >
                <User size={20} />
                <span className="font-medium">Assign Mentor</span>
              </button>

              <button
                onClick={handleRemoveGroup}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors disabled:opacity-50"
              >
                <Trash2 size={20} />
                <span className="font-medium">Remove Group</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setShowMentorList(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ←
              </button>
              <h3 className="font-semibold text-slate-800">Select Mentor</h3>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mentors.map((mentor) => (
                <div
                  key={mentor._id}
                  onClick={() => setSelectedMentor(mentor)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedMentor?._id === mentor._id
                      ? 'bg-indigo-50 border-2 border-indigo-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`}
                      alt={mentor.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-slate-800">{mentor.name}</p>
                      <p className="text-sm text-slate-500">{mentor.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAssignMentor}
              disabled={!selectedMentor || isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Assigning...' : 'Assign Mentor'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupActionModal;