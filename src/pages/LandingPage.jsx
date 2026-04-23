import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Users, BookOpen, FileText, BarChart3, Shield, Zap, ChevronDown } from 'lucide-react';

const FEATURES = [
  { icon: Users, title: 'Group Management', desc: 'Create groups, invite members, and collaborate seamlessly with your project team.' },
  { icon: BookOpen, title: 'Topic Submission', desc: 'Submit project topics, track approval status, and receive mentor feedback in real time.' },
  { icon: FileText, title: 'Report Tracking', desc: 'Submit progress reports and get structured feedback from your assigned mentor.' },
  { icon: BarChart3, title: 'Project Diary', desc: 'Log weekly progress, upload proof of work, and maintain a complete project history.' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Separate dashboards for Students, Mentors, and Coordinators with tailored controls.' },
  { icon: Zap, title: 'AI Workspace', desc: 'Get AI-powered coding help, document analysis, and project guidance in one place.' },
];

const ROLES = [
  { role: 'Student', color: 'bg-blue-600', desc: 'Manage your group, submit topics & reports, track tasks and diary entries.', path: '/StudentDashboard' },
  { role: 'Mentor', color: 'bg-green-600', desc: 'Review topics and reports, give feedback, and guide your assigned groups.', path: '/MentorDashboard' },
  { role: 'Coordinator', color: 'bg-purple-600', desc: 'Oversee all groups, assign mentors, and manage the entire department.', path: '/CoordinatorDashboard' },
];

const FAQ = [
  { q: 'How do I get started?', a: 'Sign up, complete onboarding with your college and department info, then access your role-specific dashboard.' },
  { q: 'Can I change my mentor?', a: 'Coordinators can reassign mentors to groups at any time from the Administration panel.' },
  { q: 'What file formats are supported?', a: 'PDF and DOCX files are supported for topic abstracts, reports, and proof of work uploads.' },
  { q: 'Is my data secure?', a: 'Yes. All data is protected with JWT authentication and role-based access control.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PP</span>
          </div>
          <span className="font-bold text-lg">ProjectPilot</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
            Sign In
          </button>
          <button onClick={() => navigate('/signup')} className="text-sm font-semibold bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
          Academic Project Management
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Manage Your Final Year<br />
          <span className="text-blue-600">Project with Confidence</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          ProjectPilot brings students, mentors, and coordinators together on one platform — from topic submission to final report, all in one place.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button onClick={() => navigate('/signup')} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/25">
            Start for Free <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 border border-gray-200 text-gray-700 px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-50 transition">
            Sign In
          </button>
        </div>
        <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-400">
          {['No credit card required', 'Free for students', 'Secure & private'].map(t => (
            <span key={t} className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" />{t}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Everything you need</h2>
            <p className="text-gray-500">A complete toolkit for academic project management.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="text-blue-600" size={22} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Built for every role</h2>
            <p className="text-gray-500">Tailored dashboards and tools for each user type.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLES.map(({ role, color, desc, path }) => (
              <div key={role} className="rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{role[0]}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{role}</h3>
                <p className="text-sm text-gray-500 flex-1">{desc}</p>
                <button onClick={() => navigate('/login')} className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  Get started <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  {faq.q}
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-500">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-500 mb-8">Join thousands of students managing their final year projects on ProjectPilot.</p>
          <button onClick={() => navigate('/signup')} className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/25">
            Create Free Account <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} ProjectPilot. Built for academic excellence.
      </footer>
    </div>
  );
}
