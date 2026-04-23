import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth / Onboarding Pages
import Login from "./components/loginPages/Login";
import Signup from "./components/Signup";
import AuthSuccess from "./components/AuthSuccess";
import Onboarding from "./components/Onboarding";
import Onboarding2 from "./components/loginPages/Onboarding2";
import Onboarding3 from "./components/loginPages/Onboarding3";

// Student
import StudentDashboard from "./pages/StudentDashboard";
import Taskboard from "./components/Sidebar/Taskboard";
import Groups from "./components/Sidebar/Groups";
import Topics from "./components/Sidebar/Topics";
import Reports from "./components/Sidebar/Reports";
import Workspace from "./components/Sidebar/Workspace";
import GroupDetails from "./components/CreatedGroup";
import NewProject from "./pages/NewProject";
import WorkspaceView from "./components/workspaceView";
import Notifications from "./components/Sidebar/Notifications";
import ProjectDiary from "./components/Sidebar/ProjectDiary";

// Mentor
import MentorDashboard from "./pages/mentorDasboard";
import MentorReview from "./components/MentorDashbord/Review";
import MentorGroups from "./components/MentorDashbord/Group";
import MentorProjectDiary from "./components/MentorDashbord/ProjectDiary";
import MentorNotifications from "./components/MentorDashbord/Notification";

// Coordinator
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import CoMentorPage from "./pages/CoMentorPage";
import TeamPage from "./pages/TeamPage";
import StudentsPage from "./pages/StudentsPage";
import AdministrationPage from "./pages/AdministrationPage";

// Shared
import ProfilePage from "./pages/ProfilePage";
import HelpPage from "./pages/HelpPage";
import ChatPage from "./pages/ChatPage";
import LandingPage from "./pages/LandingPage";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MentorSidebar from "./components/MentorSideBar";
import CoordinatorSidebar from "./components/CoordinatorSideBar";

const S = (roles, el) => <ProtectedRoute allowedRoles={roles}>{el}</ProtectedRoute>;

function App() {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/onboarding1" element={<Onboarding />} />
          <Route path="/onboarding2" element={<Onboarding2 />} />
          <Route path="/onboarding3" element={<Onboarding3 />} />

          {/* Student */}
          <Route path="/StudentDashboard" element={S(['student'], <StudentDashboard />)} />
          <Route path="/StudentDashboard/Taskboard" element={S(['student'], <Taskboard />)} />
          <Route path="/StudentDashboard/Groups" element={S(['student'], <Groups />)} />
          <Route path="/StudentDashboard/Groups/Created" element={S(['student'], <GroupDetails />)} />
          <Route path="/StudentDashboard/Topics" element={S(['student'], <Topics />)} />
          <Route path="/StudentDashboard/Reports" element={S(['student'], <Reports />)} />
          <Route path="/StudentDashboard/Workspace" element={S(['student'], <Workspace />)} />
          <Route path="/StudentDashboard/ProjectDiary" element={S(['student'], <ProjectDiary />)} />
          <Route path="/StudentDashboard/Workspace/view/:workspaceId" element={S(['student'], <WorkspaceView />)} />
          <Route path="/StudentDashboard/Notifications" element={S(['student'], <Notifications />)} />
          <Route path="/StudentDashboard/Workspace/NewProject" element={S(['student'], <NewProject />)} />
          <Route path="/StudentDashboard/Profile" element={S(['student'], <ProfilePage Sidebar={Sidebar} Topbar={Topbar} />)} />
          <Route path="/StudentDashboard/Help" element={S(['student'], <HelpPage Sidebar={Sidebar} Topbar={Topbar} />)} />
          <Route path="/StudentDashboard/Chat" element={S(['student'], <ChatPage Sidebar={Sidebar} Topbar={Topbar} />)} />

          {/* Mentor */}
          <Route path="/MentorDashboard" element={S(['mentor'], <MentorDashboard />)} />
          <Route path="/MentorDashboard/Review" element={S(['mentor'], <MentorReview />)} />
          <Route path="/MentorDashboard/Groups" element={S(['mentor'], <MentorGroups />)} />
          <Route path="/MentorDashboard/ProjectDiary" element={S(['mentor'], <MentorProjectDiary />)} />
          <Route path="/MentorDashboard/Notifications" element={S(['mentor'], <MentorNotifications />)} />
          <Route path="/MentorDashboard/Profile" element={S(['mentor'], <ProfilePage Sidebar={MentorSidebar} Topbar={Topbar} />)} />
          <Route path="/MentorDashboard/Help" element={S(['mentor'], <HelpPage Sidebar={MentorSidebar} Topbar={Topbar} />)} />
          <Route path="/MentorDashboard/Chat" element={S(['mentor'], <ChatPage Sidebar={MentorSidebar} Topbar={Topbar} />)} />

          {/* Coordinator */}
          <Route path="/CoordinatorDashboard" element={S(['coordinator'], <CoordinatorDashboard />)} />
          <Route path="/CoordinatorDashboard/TeamsManagement" element={S(['coordinator'], <TeamPage />)} />
          <Route path="/CoordinatorDashboard/Students" element={S(['coordinator'], <StudentsPage />)} />
          <Route path="/CoordinatorDashboard/Mentors" element={S(['coordinator'], <CoMentorPage />)} />
          <Route path="/CoordinatorDashboard/Administration" element={S(['coordinator'], <AdministrationPage />)} />
          <Route path="/CoordinatorDashboard/Profile" element={S(['coordinator'], <ProfilePage Sidebar={CoordinatorSidebar} Topbar={Topbar} />)} />
          <Route path="/CoordinatorDashboard/Help" element={S(['coordinator'], <HelpPage Sidebar={CoordinatorSidebar} Topbar={Topbar} />)} />
          <Route path="/CoordinatorDashboard/Chat" element={S(['coordinator'], <ChatPage Sidebar={CoordinatorSidebar} Topbar={Topbar} />)} />

          <Route path="*" element={<div className="flex items-center justify-center h-screen"><h1 className="text-2xl font-semibold text-gray-700">404 - Page Not Found</h1></div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
