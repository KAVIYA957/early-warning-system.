import React from 'react';

export default function KPICard({ title, value, subtext, icon: Icon, badgeColor = "navy" }) {
  let borderLeft = "border-l-4 border-l-slate-800";
  let iconBg = "bg-slate-100 text-slate-700";

  if (badgeColor === "red") {
    borderLeft = "border-l-4 border-l-red-600";
    iconBg = "bg-red-50 text-red-600";
  } else if (badgeColor === "amber") {
    borderLeft = "border-l-4 border-l-amber-500";
    iconBg = "bg-amber-50 text-amber-600";
  } else if (badgeColor === "green") {
    borderLeft = "border-l-4 border-l-emerald-600";
    iconBg = "bg-emerald-50 text-emerald-600";
  } else if (badgeColor === "teal") {
    borderLeft = "border-l-4 border-l-teal-600";
    iconBg = "bg-teal-50 text-teal-700";
  }

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-4 shadow-sm ${borderLeft} transition-shadow hover:shadow-md`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-1.5 rounded-md ${iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
      {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
    </div>
  );
}
