import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

export default function RiskBadge({ level, score, showScore = true, size = "md" }) {
  let styleClasses = "";
  let Icon = CheckCircle;

  if (level === "High Risk" || level === "High Academic Risk") {
    styleClasses = "bg-[#C45151]/10 text-[#C45151] border-[#C45151]/25 font-bold";
    Icon = AlertTriangle;
  } else if (level === "Medium Risk") {
    styleClasses = "bg-[#C58A32]/10 text-[#C58A32] border-[#C58A32]/25 font-bold";
    Icon = AlertCircle;
  } else {
    styleClasses = "bg-[#3D8B68]/10 text-[#3D8B68] border-[#3D8B68]/25 font-bold";
    Icon = CheckCircle;
  }

  const sizeClasses = size === "sm"
    ? "px-2 py-0.5 text-xs gap-1"
    : size === "lg"
    ? "px-3 py-1 text-sm gap-1.5"
    : "px-2.5 py-1 text-xs gap-1.5";

  const scoreText = typeof score === 'number' ? `${score}/7` : score;

  return (
    <span className={`inline-flex items-center rounded-md border ${styleClasses} ${sizeClasses}`}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span>{level === "High Risk" ? "High Academic Risk" : level}</span>
      {showScore && score !== undefined && (
        <span className="ml-1 pl-1.5 border-l border-current opacity-80 font-mono text-[11px]">
          {scoreText}
        </span>
      )}
    </span>
  );
}
