import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StudentOverviewPage from './StudentOverviewPage';
import StudentAttendancePage from './StudentAttendancePage';
import StudentAssessmentsPage from './StudentAssessmentsPage';
import StudentAssignmentsPage from './StudentAssignmentsPage';
import StudentMentorPage from './StudentMentorPage';
import StudentProfilePage from './StudentProfilePage';
import Toast from '../UI/Toast';
import {
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Activity,
  FileSpreadsheet,
  Users,
  UserCheck,
  User,
  Menu,
  X
} from 'lucide-react';

export default function StudentPortalShell() {
  const { currentStudent, currentUser, logout, activeTab, setActiveTab } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const studentName = currentStudent?.name || currentUser?.name || "Rahul Kumar";
  const rollNo = currentStudent?.rollNo || currentUser?.rollNo || "310624104101";

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "attendance", label: "My Attendance", icon: Activity },
    { id: "assessments", label: "Assessments", icon: FileSpreadsheet },
    { id: "assignments", label: "Assignments", icon: Users },
    { id: "mentor-support", label: "Mentor Support", icon: UserCheck },
    { id: "profile", label: "My Profile", icon: User },
  ];

  const validStudentTabs = ["overview", "attendance", "assessments", "assignments", "mentor-support", "profile"];
  const currentTab = validStudentTabs.includes(activeTab) ? activeTab : "overview";

  return (
    <div className="min-h-screen bg-[#F6F7F4] text-[#18202A] font-sans selection:bg-[#263B8F] selection:text-white flex flex-col">
      {/* 1. Dedicated Student Portal Top Header */}
      <header className="bg-white border-b border-[#E4E7E2] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Brand & System Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#263B8F] text-white flex items-center justify-center font-bold shadow-2xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-[#18202A] uppercase">
                  Early Warning System
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECEEFA] text-[#263B8F] font-extrabold border border-[#263B8F]/20">
                  STUDENT PORTAL
                </span>
              </div>
              <p className="text-[11px] text-[#68717D] hidden sm:block">
                Academic Indicators & Advisory Support
              </p>
            </div>
          </div>

          {/* Student Identity & Actions */}
          <div className="flex items-center gap-3 text-xs">
            {/* Student User Badge */}
            <div className="hidden sm:flex flex-col text-right pr-3 border-r border-[#E4E7E2]">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-[11px] text-[#68717D]">Student:</span>
                <strong className="text-xs font-black text-[#18202A]">{studentName}</strong>
              </div>
              <div className="flex items-center gap-2 justify-end text-[10px] text-[#68717D] font-mono">
                <span>{rollNo}</span>
                <span>•</span>
                <span className="text-[#263B8F] font-bold">Role: Student</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-[#F6F7F4] hover:bg-[#E4E7E2] text-[#18202A] text-xs font-bold border border-[#E4E7E2] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Sign out of student portal"
            >
              <LogOut className="w-3.5 h-3.5 text-[#C45151]" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg bg-[#F6F7F4] text-[#18202A] border border-[#E4E7E2]"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. Desktop Navigation Tab Bar */}
        <div className="hidden sm:block border-t border-[#E4E7E2] bg-[#F6F7F4]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-white text-[#263B8F] shadow-2xs border border-[#E4E7E2]"
                      : "text-[#68717D] hover:text-[#18202A] hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#263B8F]" : "text-[#68717D]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-[#E4E7E2] bg-white p-3 space-y-1">
            <div className="p-2 mb-2 bg-[#F6F7F4] rounded-lg text-xs">
              <span className="text-[#68717D] block">Logged in as:</span>
              <strong className="text-[#18202A] font-bold block">{studentName} ({rollNo})</strong>
              <span className="text-[10px] text-[#263B8F] font-bold">Student Portal</span>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-2.5 transition-all text-left ${
                    isActive
                      ? "bg-[#263B8F] text-white"
                      : "text-[#68717D] hover:bg-[#F6F7F4] text-[#18202A]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* 3. Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6">
        {currentTab === "overview" && <StudentOverviewPage />}
        {currentTab === "attendance" && <StudentAttendancePage />}
        {currentTab === "assessments" && <StudentAssessmentsPage />}
        {currentTab === "assignments" && <StudentAssignmentsPage />}
        {currentTab === "mentor-support" && <StudentMentorPage />}
        {currentTab === "profile" && <StudentProfilePage />}
      </main>

      {/* 4. Academic Footer */}
      <footer className="bg-white border-t border-[#E4E7E2] py-3.5 px-6 text-xs text-[#68717D] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-[#18202A] font-extrabold">EduSignal</strong> Academic Early Warning & Advisory Suite
          </div>
          <div className="text-[11px] text-[#68717D]">
            Student Advisory Portal • Read-only personal academic indicators & support
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <Toast />
    </div>
  );
}
