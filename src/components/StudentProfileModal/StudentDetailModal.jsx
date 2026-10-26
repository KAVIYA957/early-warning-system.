import React from 'react';
import { useApp } from '../../context/AppContext';
import RiskBadge from '../UI/RiskBadge';
import {
  X,
  HeartHandshake,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function StudentDetailModal() {
  const {
    selectedStudent,
    setSelectedStudentId,
    mentors,
    openRecordModal,
    setRahulDemoStage,
    rahulDemoStage,
    triggerToast
  } = useApp();

  if (!selectedStudent) return null;

  const handleClose = () => setSelectedStudentId(null);

  const isRahul = selectedStudent.id === "STU-2026-001";

  // Indicator conditions evaluated by 0-7 risk model
  const isAttTriggered = selectedStudent.attendance < 75;
  const isAssessTriggered = selectedStudent.assessmentAvg < 40;
  const isAssignTriggered = selectedStudent.missingAssignments >= 2;

  // Academic Signal status mapping: Low -> STABLE, Medium -> WATCH, High -> REVIEW
  const getSignalCategory = (level) => {
    if (level === "High Risk" || level === "High Academic Risk") return "REVIEW";
    if (level === "Medium Risk") return "WATCH";
    return "STABLE";
  };

  const signalCategory = getSignalCategory(selectedStudent.riskLevel);

  // Rahul 4-week demonstration trajectory
  const rahulTimelineStages = [
    { week: "Week 1", att: 82, assess: 72, missed: 0, level: "LOW", points: 0, tag: "STABLE" },
    { week: "Week 2", att: 74, assess: 65, missed: 1, level: "MEDIUM", points: 2, tag: "WATCH" },
    { week: "Week 3", att: 65, assess: 54, missed: 2, level: "MEDIUM", points: 4, tag: "WATCH" },
    { week: "Week 4", att: 38, assess: 35, missed: 5, level: "HIGH", points: 7, tag: "REVIEW" }
  ];

  // Generic 4-week timeline for non-demo students
  const attTrend = selectedStudent.attendanceTrend || [selectedStudent.attendance, selectedStudent.attendance, selectedStudent.attendance, selectedStudent.attendance];
  const assessTrend = selectedStudent.assessmentTrend || [selectedStudent.assessmentAvg, selectedStudent.assessmentAvg, selectedStudent.assessmentAvg, selectedStudent.assessmentAvg];

  const genericTimeline = attTrend.map((attVal, idx) => {
    const assessVal = assessTrend[idx] !== undefined ? assessTrend[idx] : selectedStudent.assessmentAvg;
    const isAtt = attVal < 75;
    const isAssess = assessVal < 40;
    const isAssign = selectedStudent.missingAssignments >= 2 && idx >= 2;
    const score = (isAtt ? 2 : 0) + (isAssess ? 3 : 0) + (isAssign ? 2 : 0);
    let level = "LOW";
    let tag = "STABLE";
    if (score >= 5) { level = "HIGH"; tag = "REVIEW"; }
    else if (score >= 2) { level = "MEDIUM"; tag = "WATCH"; }
    return {
      week: `Week ${idx + 1}`,
      att: attVal,
      assess: assessVal,
      missed: isAssign ? selectedStudent.missingAssignments : Math.min(idx, selectedStudent.missingAssignments),
      level,
      points: score,
      tag
    };
  });

  const timelineStages = isRahul ? rahulTimelineStages : genericTimeline;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#18202A]/60 backdrop-blur-xs overflow-y-auto font-sans text-[#18202A]">
      <div className="bg-[#F6F7F4] border border-[#E4E7E2] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* ================================================== */}
        {/* 1. STUDENT HEADER & TOP BAR                        */}
        {/* ================================================== */}
        <div className="bg-white px-6 sm:px-8 py-6 border-b border-[#E4E7E2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black tracking-tight text-[#18202A]">
                {selectedStudent.name}
              </h2>
              <RiskBadge level={selectedStudent.riskLevel} score={selectedStudent.riskScore} size="lg" />
            </div>
            <p className="text-xs text-[#68717D] font-mono">
              {selectedStudent.department} • Roll No: <strong className="text-[#18202A]">{selectedStudent.rollNo}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                handleClose();
                openRecordModal(selectedStudent.id);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-extrabold shadow-2xs inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Record Intervention</span>
            </button>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl border border-[#E4E7E2] bg-[#F6F7F4] hover:bg-[#E4E7E2] text-[#68717D] hover:text-[#18202A] transition-colors cursor-pointer"
              title="Close Case View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* MODAL BODY WITH CLEAN WHITESPACE & STRUCTURE      */}
        {/* ================================================== */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8 divide-y divide-[#E4E7E2]">

          {/* ================================================ */}
          {/* 2. SIMPLE CASE STATUS BAR                        */}
          {/* ================================================ */}
          <div className="space-y-3 pt-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#68717D]">
              ACADEMIC SIGNAL
            </div>

            <div className="bg-white rounded-xl p-5 border border-[#E4E7E2] flex flex-col space-y-3">
              <div className="relative flex items-center justify-between font-mono text-xs font-bold text-[#68717D]">
                {/* Scale line behind labels */}
                <div className="absolute top-1/2 left-12 right-12 h-[2px] bg-[#E4E7E2] -translate-y-1/2 z-0" />
                
                {/* STABLE */}
                <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-3">
                  <span className={signalCategory === "STABLE" ? "text-[#3D8B68] font-black" : "text-[#68717D]"}>STABLE</span>
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-white ${
                    signalCategory === "STABLE" ? "bg-[#3D8B68] ring-4 ring-[#3D8B68]/20 scale-125" : "bg-[#E4E7E2]"
                  }`} />
                </div>

                {/* WATCH */}
                <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-3">
                  <span className={signalCategory === "WATCH" ? "text-[#C58A32] font-black" : "text-[#68717D]"}>WATCH</span>
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-white ${
                    signalCategory === "WATCH" ? "bg-[#C58A32] ring-4 ring-[#C58A32]/20 scale-125" : "bg-[#E4E7E2]"
                  }`} />
                </div>

                {/* REVIEW */}
                <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-3">
                  <span className={signalCategory === "REVIEW" ? "text-[#C45151] font-black" : "text-[#68717D]"}>REVIEW</span>
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-white ${
                    signalCategory === "REVIEW" ? "bg-[#C45151] ring-4 ring-[#C45151]/20 scale-125" : "bg-[#E4E7E2]"
                  }`} />
                </div>
              </div>
            </div>
          </div>

          {/* ================================================ */}
          {/* 3. WHY THIS STUDENT IS SHOWING WARNING SIGNALS   */}
          {/* ================================================ */}
          <div className="pt-8 space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#18202A]">
                WHY THIS STUDENT IS SHOWING WARNING SIGNALS
              </h3>
              <p className="text-xs text-[#68717D] mt-0.5">
                Evaluated against the official 0–7 point risk benchmark engine
              </p>
            </div>

            {/* Clean 3-Column Horizontal Layout */}
            <div className="bg-white rounded-xl border border-[#E4E7E2] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E4E7E2]">
              
              {/* Factor 1: Attendance */}
              <div className="pt-4 md:pt-0 md:pr-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#68717D]">ATTENDANCE</span>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    isAttTriggered ? "bg-[#C45151]/10 text-[#C45151]" : "bg-[#3D8B68]/10 text-[#3D8B68]"
                  }`}>
                    {isAttTriggered ? "+2 points" : "0 points"}
                  </span>
                </div>
                <div className="text-3xl font-black text-[#18202A] font-mono tracking-tight">
                  {selectedStudent.attendance}%
                </div>
                <p className="text-xs text-[#68717D] font-medium">
                  {isAttTriggered ? "Below 75% benchmark threshold" : "Within 75% benchmark threshold"}
                </p>
              </div>

              {/* Factor 2: Assessment */}
              <div className="pt-4 md:pt-0 md:px-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#68717D]">ASSESSMENT</span>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    isAssessTriggered ? "bg-[#C45151]/10 text-[#C45151]" : "bg-[#3D8B68]/10 text-[#3D8B68]"
                  }`}>
                    {isAssessTriggered ? "+3 points" : "0 points"}
                  </span>
                </div>
                <div className="text-3xl font-black text-[#18202A] font-mono tracking-tight">
                  {selectedStudent.assessmentAvg}%
                </div>
                <p className="text-xs text-[#68717D] font-medium">
                  {isAssessTriggered ? "Below 40% benchmark threshold" : "Above 40% benchmark threshold"}
                </p>
              </div>

              {/* Factor 3: Assignments */}
              <div className="pt-4 md:pt-0 md:pl-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#68717D]">ASSIGNMENTS</span>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    isAssignTriggered ? "bg-[#C45151]/10 text-[#C45151]" : "bg-[#3D8B68]/10 text-[#3D8B68]"
                  }`}>
                    {isAssignTriggered ? "+2 points" : "0 points"}
                  </span>
                </div>
                <div className="text-3xl font-black text-[#18202A] font-mono tracking-tight">
                  {selectedStudent.missingAssignments} missed
                </div>
                <p className="text-xs text-[#68717D] font-medium">
                  {isAssignTriggered ? "Threshold: 2 or more missed" : "Below 2 missed threshold"}
                </p>
              </div>

            </div>
          </div>

          {/* ================================================ */}
          {/* 4. ACADEMIC SIGNAL HISTORY (HOW THE SIGNAL CHANGED)*/}
          {/* ================================================ */}
          <div className="pt-8 space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#18202A]">
                HOW THE SIGNAL CHANGED
              </h3>
              <p className="text-xs text-[#68717D] mt-0.5">
                4-week indicator trajectory and rule score evolution
              </p>
            </div>

            {/* Horizontal Timeline Layout */}
            <div className="bg-white rounded-xl border border-[#E4E7E2] p-6 space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {timelineStages.map((stg, idx) => {
                  const isHigh = stg.level === "HIGH";
                  const isMedium = stg.level === "MEDIUM";
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        idx === timelineStages.length - 1
                          ? "bg-[#ECEEFA]/40 border-[#263B8F]/30 shadow-2xs"
                          : "bg-[#F6F7F4]/50 border-[#E4E7E2]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 font-mono">
                        <span className="text-xs font-black text-[#263B8F]">{stg.week}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isHigh
                            ? "bg-[#C45151]/10 text-[#C45151]"
                            : isMedium
                            ? "bg-[#C58A32]/10 text-[#C58A32]"
                            : "bg-[#3D8B68]/10 text-[#3D8B68]"
                        }`}>
                          {stg.tag}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-mono text-[#18202A]">
                        <div className="flex justify-between">
                          <span className="text-[#68717D] text-[11px]">Attendance:</span>
                          <strong className={stg.att < 75 ? "text-[#C45151]" : "text-[#18202A]"}>{stg.att}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#68717D] text-[11px]">Assessment:</span>
                          <strong className={stg.assess < 40 ? "text-[#C45151]" : "text-[#18202A]"}>{stg.assess}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#68717D] text-[11px]">Missed:</span>
                          <strong className={stg.missed >= 2 ? "text-[#C45151]" : "text-[#18202A]"}>{stg.missed}</strong>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-[#E4E7E2] text-[11px] text-[#68717D] flex justify-between items-center font-mono">
                        <span>Risk Score:</span>
                        <strong className="text-[#263B8F] font-black">{stg.points} / 7 Pts</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* ================================================ */}
          {/* 5. WHAT CHANGED? INTERPRETATION                   */}
          {/* ================================================ */}
          <div className="pt-8 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#18202A]">
              WHAT CHANGED?
            </h3>
            <div className="bg-white rounded-xl border border-[#E4E7E2] p-5 text-xs text-[#18202A] leading-relaxed font-medium">
              Across the four-week demonstration timeline, attendance and assessment values declined while missed assignments increased. The rule engine therefore moved the student from Low to Medium and eventually High Academic Risk.
            </div>
          </div>

          {/* ================================================ */}
          {/* 6. CASE HISTORY (INTERVENTIONS TIMELINE)         */}
          {/* ================================================ */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#18202A]">
                CASE HISTORY
              </h3>
              <span className="text-xs text-[#68717D] font-mono">
                {selectedStudent.interventions ? selectedStudent.interventions.length : 0} Record(s) Logged
              </span>
            </div>

            <div className="bg-white rounded-xl border border-[#E4E7E2] p-6">
              {(!selectedStudent.interventions || selectedStudent.interventions.length === 0) ? (
                <div className="text-center py-6 space-y-3">
                  <p className="text-xs text-[#68717D]">
                    No intervention has been recorded yet.
                  </p>
                  <button
                    onClick={() => {
                      handleClose();
                      openRecordModal(selectedStudent.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Record Intervention</span>
                  </button>
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E4E7E2]">
                  {selectedStudent.interventions.map((item, idx) => {
                    const mentor = mentors.find(m => m.id === item.mentorId) || mentors[0];
                    return (
                      <div key={item.id || idx} className="relative space-y-1 text-xs">
                        {/* Bullet node */}
                        <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#263B8F] ring-4 ring-white" />
                        
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-extrabold text-[#18202A]">{item.type}</span>
                          <span className="text-mono text-[11px] text-[#68717D]">{item.date}</span>
                        </div>

                        <p className="text-[#68717D] text-[11px]">
                          Advisor: <strong className="text-[#18202A]">{mentor.name}</strong>
                        </p>

                        <p className="text-[#18202A] font-medium mt-1 leading-relaxed bg-[#F6F7F4] p-3 rounded-lg border border-[#E4E7E2]">
                          {item.notes}
                        </p>

                        {item.followUpDate && (
                          <div className="text-[11px] text-[#C58A32] font-mono flex items-center gap-1 font-semibold pt-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Follow-up Scheduled: {item.followUpDate}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ================================================ */}
          {/* 7. FACULTY ACTION & FOOTER                        */}
          {/* ================================================ */}
          <div className="pt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleClose();
                    openRecordModal(selectedStudent.id);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-extrabold shadow-2xs inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Record Intervention</span>
                </button>

                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-[#E4E7E2] bg-white hover:bg-[#F6F7F4] text-[#18202A] text-xs font-bold transition-all cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>

            {/* DEMONSTRATION ONLY CONTROLLER */}
            {isRahul && (
              <div className="pt-4 border-t border-[#E4E7E2] flex items-center justify-between text-xs text-[#68717D]">
                <div className="font-mono text-[11px]">
                  DEMONSTRATION: <span className="italic">Simulate stage transitions for presentation</span>
                </div>
                <button
                  onClick={() => {
                    const nextStage = rahulDemoStage === 6 ? 4 : 6;
                    setRahulDemoStage(nextStage);
                    triggerToast(
                      nextStage === 6
                        ? "Simulated updated academic data applied to Rahul."
                        : "Reset Rahul to High Academic Risk stage (7/7 Pts).",
                      "info"
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E4E7E2] hover:bg-[#F6F7F4] text-[#18202A] text-[11px] font-bold font-mono inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#6FA58A]" />
                  <span>Simulate Updated Academic Data</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
