import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  let bgClasses = "bg-slate-900 border-slate-700 text-white";
  let Icon = Info;

  if (toast.type === "success") {
    bgClasses = "bg-emerald-900 border-emerald-700 text-emerald-100";
    Icon = CheckCircle2;
  } else if (toast.type === "warning") {
    bgClasses = "bg-amber-900 border-amber-700 text-amber-100";
    Icon = AlertCircle;
  } else if (toast.type === "info") {
    bgClasses = "bg-teal-900 border-teal-700 text-teal-100";
    Icon = Info;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`px-4 py-3 rounded-lg border shadow-lg flex items-center gap-3 text-xs font-semibold ${bgClasses}`}>
        <Icon className="w-4 h-4 shrink-0" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
