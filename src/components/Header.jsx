import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, UserCheck, GraduationCap, Settings, Bell, Search, Info } from 'lucide-react';

export default function Header() {
  const { currentRole, setCurrentRole, searchQuery, setSearchQuery, students } = useApp();

  const highRiskCount = students.filter(s => s.riskLevel === "High Risk").length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      {/* Top Banner Disclaimer & Info */}
      <div className="bg-slate-950/80 border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong className="text-slate-300 font-semibold">Decision Support System:</strong> Academic risk levels are composite indicators to help faculty & mentors identify support needs. Not an automated assessment.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-400">
          <span>Campus Data Sync: <strong className="text-emerald-400 font-mono">LIVE</strong></span>
          <span>Semester: <strong className="text-slate-200">Fall 2026</strong></span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">EduSignal</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-slate-400">Early Warning System for At-Risk Students</p>
          </div>
        </div>

        {/* Global Search & Actions */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student name, roll no, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right side controls: Role Selector & Alerts */}
        <div className="flex items-center gap-4">
          {/* Active Alert Badge */}
          <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            <Bell className="w-3.5 h-3.5 animate-pulse" />
            <span>{highRiskCount} High Risk Flagged</span>
          </div>

          {/* Role Switcher dropdown */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-slate-400 pl-2 hidden lg:inline">Role:</span>
            <button
              onClick={() => setCurrentRole("faculty")}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1.5 ${
                currentRole === "faculty"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              title="Faculty view: course rosters, quick flags"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>
            <button
              onClick={() => setCurrentRole("mentor")}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1.5 ${
                currentRole === "mentor"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              title="Mentor view: assigned mentees, active interventions"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Mentor</span>
            </button>
            <button
              onClick={() => setCurrentRole("coordinator")}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1.5 ${
                currentRole === "coordinator"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              title="Coordinator view: system weight config, campus analytics"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Coordinator</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
