import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth / Onboarding Pages
import Login from "./components/loginPages/Login";
import Signup from "./components/Signup";
import AuthSuccess from "./components/AuthSuccess";
import Onboarding from "./components/Onboarding";
import Onboarding2 from "./components/loginPages/Onboarding2";
import Onboarding3 from "./components/loginPages/Onboarding3";

// Dashboard + Taskboard
import StudentDashboard from "./pages/StudentDashboard";
import Taskboard from "./components/Sidebar/Taskboard";
import Groups from "./components/Sidebar/Groups";
import Topics from "./components/Sidebar/Topics";
import Reports from "./components/Sidebar/Reports";
import Workspace from "./components/Sidebar/Workspace";
import GroupDetails from "./components/CreatedGroup"
import NewProject from "./pages/NewProject";
import WorkspaceView from "./components/workspaceView";
import Notifications from "./components/Sidebar/notifications";
import MentorDashboard from "./pages/mentorDasboard";
import MentorReview from "./components/MentorDashbord/Review";
import MentorGroups from "./components/MentorDashbord/Group";
import MentorProjectDiary from "./components/MentorDashbord/ProjectDiary";
import MentorNotifications from "./components/MentorDashbord/Notification";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import CoMentor from "./components/Coordinator/Co_Mentor";
import CoMentorPage from "./pages/CoMentorPage";
import TeamPage from "./pages/TeamPage";
import StudentsPage from "./pages/StudentsPage";

function App() {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Router>
        <Routes>
          {/* Default route goes to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/success" element={<AuthSuccess />} />

          {/* Onboarding flow */}
          <Route path="/onboarding1" element={<Onboarding />} />
          <Route path="/onboarding2" element={<Onboarding2 />} />
          <Route path="/onboarding3" element={<Onboarding3 />} />

          {/* Dashboard */}
          <Route path="/StudentDashboard" element={<StudentDashboard />} />
          <Route path="/MentorDashboard" element={<MentorDashboard/>}/>
          <Route path="/CoordinatorDashboard" element={<CoordinatorDashboard/>}/>

          {/* Taskboard page */}
          <Route path="/StudentDashboard/Taskboard" element={<Taskboard />} />
          <Route path="/StudentDashboard/Groups" element={<Groups />} />
          <Route path="/StudentDashboard/Groups/Created" element={<GroupDetails />} />
          <Route path="/StudentDashboard/Topics" element={<Topics />} />
          <Route path="/StudentDashboard/Reports" element={<Reports />} />
          <Route path="/StudentDashboard/Workspace" element={<Workspace />} />
          <Route path="/StudentDashboard/Workspace/view/:workspaceId" element={<WorkspaceView />} />
          <Route path="/StudentDashboard/Notifications" element={<Notifications />} />
          <Route path="/StudentDashboard/Workspace/NewProject" element={<NewProject />} />
        

          {/* Mentor Dashboard */}
          <Route path="/MentorDashboard/Review" element={<MentorReview />} />
          <Route path="/MentorDashboard/Groups" element={<MentorGroups />} />
          <Route path="/MentorDashboard/ProjectDiary" element={<MentorProjectDiary />} />
          <Route path="/MentorDashboard/Notifications" element={<MentorNotifications />} />

          {/* Coordinator Dashboard Routes */}
          <Route path="/CoordinatorDashboard/TeamsManagement" element={<TeamPage />} />
          <Route path="/CoordinatorDashboard/Students" element={<StudentsPage />} />
          <Route path="/CoordinatorDashboard/Mentors" element={<CoMentorPage />} />
          <Route path="/CoordinatorDashboard/Administration" element={<div>Administration</div>} />
          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-semibold text-gray-700">
                  404 - Page Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
