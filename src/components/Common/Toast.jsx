import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  let bgClasses = "bg-slate-900 border-indigo-500/40 text-white";
  let Icon = Info;

  if (toast.type === "success") {
    bgClasses = "bg-emerald-950/90 border-emerald-500/50 text-emerald-200";
    Icon = CheckCircle2;
  } else if (toast.type === "warning") {
    bgClasses = "bg-amber-950/90 border-amber-500/50 text-amber-200";
    Icon = AlertCircle;
  } else if (toast.type === "info") {
    bgClasses = "bg-indigo-950/90 border-indigo-500/50 text-indigo-200";
    Icon = Info;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`px-4 py-3 rounded-xl border shadow-xl flex items-center gap-3 text-xs font-semibold ${bgClasses}`}>
        <Icon className="w-4 h-4 shrink-0" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
