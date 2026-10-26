import React from 'react';

export default function ProgressBar({ value, max = 100, label, showValue = true, variant = "default", size = "md" }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  let barColor = "bg-teal-600";
  if (variant === "danger" || (variant === "auto" && percentage < 60)) {
    barColor = "bg-red-600";
  } else if (variant === "warning" || (variant === "auto" && percentage < 75)) {
    barColor = "bg-amber-500";
  } else if (variant === "success" || (variant === "auto" && percentage >= 75)) {
    barColor = "bg-emerald-600";
  }

  const heightClass = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  return (
    <div className="space-y-1 w-full">
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-slate-600 font-medium">
          {label && <span>{label}</span>}
          {showValue && <span className="font-mono">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 ${heightClass}`}>
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full ${barColor} transition-all duration-300`}
        />
      </div>
    </div>
  );
}
