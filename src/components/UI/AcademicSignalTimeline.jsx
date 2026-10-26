import React from 'react';
import { Activity } from 'lucide-react';

/**
 * ACADEMIC SIGNAL TIMELINE
 * Signature visual language for the Early Warning System.
 * Connects indicator trajectory across time: STABLE ─── WATCH ─── REVIEW
 */
export default function AcademicSignalTimeline({ 
  trendData, 
  currentStage = 4, 
  compact = false,
  showLabels = true 
}) {
  const defaultStages = [
    { week: "Week 1", att: 82, assess: 72, risk: "Low Risk", level: "STABLE", points: 0, text: "Baseline" },
    { week: "Week 2", att: 74, assess: 65, risk: "Medium Risk", level: "WATCH", points: 2, text: "Att < 75%" },
    { week: "Week 3", att: 65, assess: 54, risk: "Medium Risk", level: "WATCH", points: 4, text: "Att + 2 Missed" },
    { week: "Week 4", att: 38, assess: 35, risk: "High Academic Risk", level: "REVIEW", points: 7, text: "High Risk Trigger" },
  ];

  const stages = trendData || defaultStages;

  const getStageColor = (riskOrLevel) => {
    if (riskOrLevel === "REVIEW" || riskOrLevel === "High" || riskOrLevel === "High Risk" || riskOrLevel === "High Academic Risk") {
      return {
        dot: "bg-[#C45151] ring-4 ring-[#C45151]/15",
        text: "text-[#C45151]",
        tag: "bg-[#C45151]/10 text-[#C45151]"
      };
    }
    if (riskOrLevel === "WATCH" || riskOrLevel === "Medium" || riskOrLevel === "Medium Risk") {
      return {
        dot: "bg-[#C58A32] ring-4 ring-[#C58A32]/15",
        text: "text-[#C58A32]",
        tag: "bg-[#C58A32]/10 text-[#C58A32]"
      };
    }
    return {
      dot: "bg-[#3D8B68] ring-4 ring-[#3D8B68]/15",
      text: "text-[#3D8B68]",
      tag: "bg-[#3D8B68]/10 text-[#3D8B68]"
    };
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {stages.map((stg, idx) => {
          const style = getStageColor(stg.level || stg.risk);
          const isLast = idx === stages.length - 1;
          return (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-1.5 shrink-0 font-mono">
                <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                <span className="text-[11px] text-[#18202A] font-semibold">{stg.att}%</span>
              </div>
              {!isLast && <span className="text-[#E4E7E2] text-xs font-mono">──────</span>}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl p-6 border border-[#E4E7E2] shadow-2xs font-sans">
      {/* Header Label */}
      {showLabels && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#E4E7E2] text-xs">
          <div className="flex items-center gap-2 text-[#263B8F] font-bold uppercase tracking-wider text-[11px]">
            <Activity className="w-4 h-4 text-[#263B8F]" />
            <span>Academic Signal Progression</span>
          </div>
          <div className="text-[#68717D] text-[11px] font-mono">
            Trajectory: <strong className="text-[#18202A] font-extrabold">STABLE ──── WATCH ──── REVIEW</strong>
          </div>
        </div>
      )}

      {/* Signature Timeline Layout */}
      <div className="relative py-2">
        {/* Thin Indigo/Ivory Line */}
        <div className="absolute top-[28px] left-10 right-10 h-[2px] bg-[#E4E7E2] -z-0 hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {stages.map((stg, idx) => {
            const style = getStageColor(stg.level || stg.risk);
            const isCurrent = idx === currentStage - 1 || idx === stages.length - 1;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-[#ECEEFA]/60 border-[#263B8F]/30 shadow-2xs"
                    : "bg-[#F6F7F4]/40 border-[#E4E7E2]"
                }`}
              >
                {/* Node & Week Label */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${style.dot} shrink-0`} />
                    <span className="text-xs font-mono font-black text-[#263B8F]">{stg.week}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${style.tag}`}>
                    {stg.level || (stg.att < 75 ? "REVIEW" : "STABLE")}
                  </span>
                </div>

                {/* Metrics */}
                <div className="space-y-1 text-xs font-mono text-[#18202A]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#68717D] text-[11px]">Attendance:</span>
                    <strong className={stg.att < 75 ? "text-[#C45151]" : "text-[#18202A]"}>{stg.att}%</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#68717D] text-[11px]">Assessment:</span>
                    <strong className={stg.assess < 40 ? "text-[#C45151]" : "text-[#18202A]"}>{stg.assess}%</strong>
                  </div>
                </div>

                {/* Subtext */}
                <div className="pt-2 mt-2 border-t border-[#E4E7E2] text-[11px] text-[#68717D] flex justify-between items-center font-medium">
                  <span className="truncate">{stg.text || stg.risk}</span>
                  <span className="font-mono text-[10px] font-bold text-[#263B8F]">{stg.points || 0}/7 Pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
