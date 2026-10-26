import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

export default function RiskBadge({ level, score, showScore = true, size = "md" }) {
  let styleClasses = "";
  let Icon = CheckCircle;

  if (level === "High Risk") {
    styleClasses = "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800/50";
    Icon = AlertTriangle;
  } else if (level === "Medium Risk") {
    styleClasses = "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/50";
    Icon = AlertCircle;
  } else {
    styleClasses = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/50";
    Icon = CheckCircle;
  }

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs gap-1" : size === "lg" ? "px-3 py-1.5 text-sm font-semibold gap-1.5" : "px-2.5 py-1 text-xs font-medium gap-1.5";

  return (
    <span className={`inline-flex items-center rounded-full border ${styleClasses} ${sizeClasses}`}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span>{level}</span>
      {showScore && score !== undefined && (
        <span className="ml-1 opacity-80 font-semibold border-l border-current pl-1.5">
          {score}
        </span>
      )}
    </span>
  );
}
