import React from 'react';

export default function ChartCard({ title, subtitle, icon: Icon, children, action }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-teal-700" />}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
