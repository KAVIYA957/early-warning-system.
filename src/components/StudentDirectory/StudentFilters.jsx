import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export default function StudentFilters({
  selectedDept,
  setSelectedDept,
  selectedRisk,
  setSelectedRisk,
  attendanceFilter,
  setAttendanceFilter,
  sortBy,
  setSortBy,
  resetFilters
}) {
  const depts = ["ALL", "Computer Science", "Electrical Engineering", "Mechanical Engineering", "Business & Management", "Data Science"];
  const riskLevels = ["ALL", "High Risk", "Medium Risk", "Low Risk"];
  const attOptions = ["ALL", "< 75% (Critical)", "< 60% (Severe)"];
  const sortOptions = [
    { value: "riskDesc", label: "Highest Risk Score" },
    { value: "riskAsc", label: "Lowest Risk Score" },
    { value: "attAsc", label: "Lowest Attendance" },
    { value: "scoreAsc", label: "Lowest Assessment Score" },
    { value: "nameAsc", label: "Name (A-Z)" }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3.5 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase tracking-wider text-[11px] mr-1">
          <Filter className="w-3.5 h-3.5 text-teal-700" />
          <span>Filters:</span>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-600 font-medium">Dept:</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-teal-700 focus:bg-white outline-none"
          >
            {depts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Risk Level Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-600 font-medium">Risk:</label>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-teal-700 focus:bg-white outline-none"
          >
            {riskLevels.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Attendance Threshold Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-600 font-medium">Attendance:</label>
          <select
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-teal-700 focus:bg-white outline-none"
          >
            {attOptions.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-600 font-medium">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-teal-700 focus:bg-white outline-none font-medium"
          >
            {sortOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1 font-medium transition-all"
        title="Reset filters"
      >
        <RotateCcw className="w-3 h-3 text-slate-500" />
        <span>Reset</span>
      </button>
    </div>
  );
}
