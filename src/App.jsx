import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginScreen from './components/Auth/LoginScreen';
import Sidebar from './components/UI/Sidebar';
import Header from './components/UI/Header';
import FacultyDashboard from './components/Dashboard/FacultyDashboard';
import StudentsPage from './components/StudentDirectory/StudentsPage';
import NotificationsPage from './components/Notifications/NotificationsPage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import SettingsPage from './components/Settings/SettingsPage';
import StudentDetailModal from './components/StudentProfileModal/StudentDetailModal';
import RecordInterventionModal from './components/Interventions/RecordInterventionModal';
import InterventionTracker from './components/Interventions/InterventionTracker';
import WeightConfigurator from './components/FormulaEngine/WeightConfigurator';
import DataSimulator from './components/Simulator/DataSimulator';
import ExportReports from './components/Reports/ExportReports';
import Toast from './components/UI/Toast';
import StudentPortalShell from './components/StudentPortal/StudentPortalShell';

function MainContent() {
  const { activeTab } = useApp();

  return (
    <main className="p-6 space-y-6 flex-1 max-w-7xl mx-auto w-full">
      {activeTab === "dashboard" && <FacultyDashboard />}
      {activeTab === "directory" && <StudentsPage />}
      {activeTab === "notifications" && <NotificationsPage />}
      {activeTab === "analytics" && <AnalyticsPage />}
      {activeTab === "interventions" && <InterventionTracker />}
      {activeTab === "formula" && <WeightConfigurator />}
      {activeTab === "settings" && <SettingsPage />}
      {activeTab === "simulator" && <DataSimulator />}
      {activeTab === "reports" && <ExportReports />}
    </main>
  );
}

function AppShell() {
  const { isAuthenticated, currentRole } = useApp();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Dedicated Student Portal Experience
  if (currentRole === "student") {
    return <StudentPortalShell />;
  }

  return (
    <div className="flex min-h-screen bg-[#F6F7F4] text-[#18202A] font-sans selection:bg-[#263B8F] selection:text-white antialiased">
      {/* Fixed Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <MainContent />

        {/* Academic Footer */}
        <footer className="bg-white border-t border-[#E4E7E2] py-3.5 px-6 text-xs text-[#68717D] mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong className="text-[#18202A] font-extrabold">EduSignal</strong> Academic Early Warning & Advisory Suite v2.4
            </div>
            <div className="text-[11px] text-[#68717D]">
              Decision Support Tool • Real-time Indicator Calculation • Campus Monitoring
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals & Notifications */}
      <StudentDetailModal />
      <RecordInterventionModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
