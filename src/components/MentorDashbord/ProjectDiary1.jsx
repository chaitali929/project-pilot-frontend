import React, { useState } from 'react';

const TASKS = [
    { id: 1, name: 'API Integration', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'WebSocket Setup', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Performance Testing', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'Documentation', avatar: 'https://i.pravatar.cc/150?u=4' }
];

const POW_FILES = [
    { id: 1, name: 'api_docs.pdf', type: 'document' },
    { id: 2, name: 'screenshot.png', type: 'image' },
    { id: 3, name: 'test_results.pdf', type: 'document' },
    { id: 4, name: 'demo.mp4', type: 'video' }
];

const TEAM_AVATARS = [
    'https://i.pravatar.cc/150?u=team1',
    'https://i.pravatar.cc/150?u=team2',
    'https://i.pravatar.cc/150?u=team3',
    'https://i.pravatar.cc/150?u=team4'
];

const TaskItem = ({ task }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
        <img alt={task.name} className="w-8 h-8 rounded-full" src={task.avatar} />
        <span className="text-sm text-gray-700 font-medium">{task.name}</span>
    </div>
);

const FileItem = ({ file }) => (
    <div className="flex items-center gap-2 p-2.5 px-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-300 transition-colors cursor-pointer group">
        <div className={`w-4 h-4 ${file.type === 'image' ? 'bg-blue-500' : 'bg-gray-400'} rounded`}></div>
        <span className="text-xs text-gray-600 truncate group-hover:text-blue-600 transition-colors">{file.name}</span>
    </div>
);

const ProjectDiary1Modal = ({ isOpen, onClose, teamName = "Group No.4" }) => {
    const [feedback, setFeedback] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        console.log("Feedback submitted:", feedback);
        onClose();
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
                        <h1 className="text-2xl font-bold text-gray-900">{teamName}</h1>
                        <div className="flex -space-x-2">
                            {TEAM_AVATARS.map((src, i) => (
                                <img 
                                    key={i} 
                                    alt="Team member" 
                                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 shadow-sm" 
                                    src={src} 
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-3">Summary</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Completed the backend API integration for real-time location tracking. Implemented WebSocket connection for live updates and tested with multiple concurrent users. Performance benchmarks show 95% accuracy in indoor positioning.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Tasks Done</h2>
                        <div className="space-y-3">
                            {TASKS.map(task => <TaskItem key={task.id} task={task} />)}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col bg-white overflow-y-auto">
                    <div className="mb-8">
                        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Proof of Work</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {POW_FILES.map(file => <FileItem key={file.id} file={file} />)}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Grades</h2>
                        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors shadow-sm group">
                            <div className="flex -space-x-1.5">
                                {TEAM_AVATARS.map((src, i) => (
                                    <img 
                                        key={i} 
                                        alt="Team member" 
                                        className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 shadow-sm" 
                                        src={src} 
                                    />
                                ))}
                            </div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-blue-600 transition-colors">
                                <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                        </div>
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
                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98]"
                        >
                            Grade & Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDiary1Modal;