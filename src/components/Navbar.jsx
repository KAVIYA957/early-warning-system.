import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Users, HeartHandshake, Sliders, FlaskConical, FileSpreadsheet } from 'lucide-react';

export default function Navbar() {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "directory", label: "Student Roster", icon: Users },
    { id: "interventions", label: "Intervention Tracker", icon: HeartHandshake },
    { id: "formula", label: "Risk Formula Engine", icon: Sliders },
    { id: "simulator", label: "Data Simulator", icon: FlaskConical },
    { id: "reports", label: "Reports & Export", icon: FileSpreadsheet }
  ];

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
