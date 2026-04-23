import React, { useState } from 'react';
import { FiBell, FiMoon, FiGlobe, FiShield } from 'react-icons/fi';

export default function PreferencesPage({ Sidebar, Topbar }) {
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    language: 'English',
    twoFactor: false,
  });

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Preferences</h1>

            <div className="space-y-4">
              <Section title="Notifications" icon={<FiBell className="text-blue-500" />}>
                <Toggle label="Email Notifications" sub="Receive updates via email" value={prefs.emailNotifications} onChange={() => toggle('emailNotifications')} />
                <Toggle label="Push Notifications" sub="Receive in-app notifications" value={prefs.pushNotifications} onChange={() => toggle('pushNotifications')} />
              </Section>

              <Section title="Appearance" icon={<FiMoon className="text-purple-500" />}>
                <Toggle label="Dark Mode" sub="Switch to dark theme" value={prefs.darkMode} onChange={() => toggle('darkMode')} />
              </Section>

              <Section title="Language" icon={<FiGlobe className="text-green-500" />}>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Display Language</p>
                    <p className="text-xs text-gray-500">Choose your preferred language</p>
                  </div>
                  <select
                    value={prefs.language}
                    onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                    className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                  </select>
                </div>
              </Section>

              <Section title="Security" icon={<FiShield className="text-red-500" />}>
                <Toggle label="Two-Factor Authentication" sub="Add an extra layer of security" value={prefs.twoFactor} onChange={() => toggle('twoFactor')} />
              </Section>

              <button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
              >
                {saved ? 'Saved!' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h2 className="font-semibold text-gray-700">{title}</h2>
    </div>
    <div className="divide-y">{children}</div>
  </div>
);

const Toggle = ({ label, sub, value, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
);
