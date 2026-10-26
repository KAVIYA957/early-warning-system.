import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  HeartHandshake,
  BarChart3,
  Bell,
  Settings,
  ShieldAlert,
  LogOut,
  User
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, currentUser, logout, students } = useApp();

  const highRiskCount = students.filter(s => s.riskLevel === "High Risk" || s.riskLevel === "High Academic Risk").length;

  const primaryNavItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "directory", label: "Students", icon: Users, badge: students.length },
    { id: "interventions", label: "Interventions", icon: HeartHandshake },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "notifications", label: "Alerts", icon: Bell, badge: highRiskCount },
  ];

  const secondaryNavItems = [
    { id: "formula", label: "Risk Rules", icon: ShieldCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#F6F7F4] text-[#18202A] flex flex-col shrink-0 min-h-screen border-r border-[#E4E7E2] select-none font-sans">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E4E7E2] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#263B8F] text-white flex items-center justify-center font-bold shadow-xs">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-black tracking-tight text-[#18202A] flex items-center gap-1.5">
            EduSignal
          </h1>
          <p className="text-[11px] text-[#6F7FAF] font-bold">Academic Early Warning</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="space-y-1">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  isActive
                    ? "bg-[#ECEEFA] text-[#263B8F] font-extrabold shadow-2xs"
                    : "text-[#68717D] hover:bg-white hover:text-[#18202A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#263B8F]" : "text-[#68717D]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md ${
                    isActive
                      ? "bg-[#263B8F] text-white"
                      : item.id === "notifications" && item.badge > 0
                      ? "bg-[#C45151]/10 text-[#C45151] border border-[#C45151]/20"
                      : "bg-[#E4E7E2] text-[#68717D]"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-3 my-2 border-t border-[#E4E7E2]" />

        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  isActive
                    ? "bg-[#ECEEFA] text-[#263B8F] font-extrabold shadow-2xs"
                    : "text-[#68717D] hover:bg-white hover:text-[#18202A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#263B8F]" : "text-[#68717D]"}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Profile & Sign Out Footer */}
      <div className="p-4 border-t border-[#E4E7E2] bg-white space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#ECEEFA] border border-[#263B8F]/20 text-[#263B8F] flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-[#18202A] block truncate">{currentUser?.name || "Dr. Aris Thorne"}</span>
            <span className="text-[10px] text-[#68717D] block truncate">{currentUser?.role || "Faculty Member"}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full px-3 py-1.5 rounded-lg bg-[#F6F7F4] hover:bg-[#E4E7E2] text-[#68717D] hover:text-[#18202A] border border-[#E4E7E2] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-[#68717D]" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
