import React from 'react';
import { useApp } from '../../context/AppContext';
import CalculationInfoPanel from '../Common/CalculationInfoPanel';
import { Search, Bell, User } from 'lucide-react';

export default function Header() {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, students, currentUser } = useApp();

  const tabLabels = {
    dashboard: "Overview",
    directory: "Students",
    interventions: "Interventions",
    analytics: "Analytics",
    formula: "Risk Rules",
    notifications: "Alerts",
    settings: "Settings",
  };

  const highRiskCount = students.filter(s => s.riskLevel === "High Risk" || s.riskLevel === "High Academic Risk").length;

  return (
    <header className="bg-white border-b border-[#E4E7E2] text-[#18202A] sticky top-0 z-30 shadow-2xs font-sans">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#68717D] shrink-0">
          <span className="font-black text-[#18202A]">EduSignal</span>
          <span>/</span>
          <span className="font-bold text-[#263B8F] capitalize">{tabLabels[activeTab] || activeTab}</span>
        </div>

        {/* Center: Global Search Input */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68717D]" />
            <input
              type="text"
              placeholder="Search student name, roll number, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F6F7F4] border border-[#E4E7E2] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#18202A] placeholder-[#68717D] focus:outline-none focus:ring-2 focus:ring-[#263B8F] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Right: Controls & Faculty Profile */}
        <div className="flex items-center gap-3 text-xs shrink-0">
          <CalculationInfoPanel />

          {/* Alerts Bell Button */}
          <button
            onClick={() => setActiveTab("notifications")}
            className="relative p-2 rounded-lg bg-[#F6F7F4] hover:bg-[#E4E7E2] text-[#18202A] transition-colors border border-[#E4E7E2]"
            title="Academic Alerts"
          >
            <Bell className="w-4 h-4 text-[#68717D]" />
            {highRiskCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C45151] text-white text-[10px] font-bold flex items-center justify-center">
                {highRiskCount}
              </span>
            )}
          </button>

          {/* Faculty Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#E4E7E2]">
            <div className="w-7 h-7 rounded-full bg-[#ECEEFA] text-[#263B8F] flex items-center justify-center font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#18202A] hidden sm:inline">{currentUser?.name || "Dr. Aris Thorne"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
