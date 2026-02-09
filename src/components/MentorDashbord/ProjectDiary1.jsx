import React, { useState, useEffect } from 'react';
import useMentorStore from '../../store/mentorStore';

const ProjectDiary1Modal = ({ isOpen, onClose, diary }) => {
    const [feedback, setFeedback] = useState('');
    const [grade, setGrade] = useState('');
    const { submitDiaryFeedback, isLoading } = useMentorStore();

    useEffect(() => {
        if (diary) {
            setFeedback(diary.mentorFeedback || '');
            setGrade(diary.grade || '');
        }
    }, [diary]);

    if (!isOpen || !diary) return null;

    const handleSubmit = async () => {
        try {
            await submitDiaryFeedback(diary._id, feedback, grade);
            onClose();
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative border border-gray-200 flex flex-col md:flex-row max-h-[90vh]">
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 rounded-full hover:bg-gray-100"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="w-full md:w-1/2 p-8 md:p-10 border-r border-gray-100 bg-white overflow-y-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">{diary.groupId?.groupName || 'Unknown Team'}</h1>
                        <div className="flex -space-x-2">
                            {diary.groupId?.members?.slice(0, 4).map((member, i) => {
                                const initial = member.userId?.email?.charAt(0).toUpperCase() || '?';
                                return (
                                    <div 
                                        key={i}
                                        className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm"
                                        title={member.userId?.email}
                                    >
                                        {initial}
                                    </div>
                                );
                            })}
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Week {diary.week}</span>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Date Range</h2>
                        <p className="text-sm text-gray-600">
                            {new Date(diary.dateRange.startDate).toLocaleDateString()} - {new Date(diary.dateRange.endDate).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-3">Summary</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {diary.summary}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Tasks ({diary.tasks?.filter(t => t.completed).length}/{diary.tasks?.length} completed)</h2>
                        <div className="space-y-3">
                            {diary.tasks?.map((task, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <input type="checkbox" checked={task.completed} readOnly className="w-4 h-4" />
                                    <span className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col bg-white overflow-y-auto">
                    <div className="mb-8">
                        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Proof of Work ({diary.proofOfWork?.length || 0} files)</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {diary.proofOfWork?.map((file, idx) => (
                                <a 
                                    key={idx}
                                    href={`http://localhost:3000/uploads/proofOfWork/${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2.5 px-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-300 transition-colors cursor-pointer group"
                                >
                                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                    <span className="text-xs text-gray-600 truncate group-hover:text-blue-600 transition-colors">File {idx + 1}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Grade</h2>
                        <input
                            type="text"
                            placeholder="Enter grade (e.g., +8, A, 85%)"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400 text-sm"
                        />
                    </div>

                    <div className="flex-grow">
                        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Feedback</h2>
                        <textarea 
                            className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-gray-700 placeholder-gray-400 text-sm transition-all" 
                            placeholder="Enter your feedback here..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="mt-8">
                        <button 
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDiary1Modal;