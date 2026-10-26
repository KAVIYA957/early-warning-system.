import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export default function StudentOverviewPage() {
  const { currentStudent, setActiveTab } = useApp();

  // Fallback student data if currentStudent is somehow null
  const student = currentStudent || {
    name: "Rahul Kumar",
    rollNo: "310624104101",
    department: "Computer Science & Engineering",
    assignedMentorId: "M1",
    lastReviewed: "2026-09-18",
    attendance: 38,
    assessmentAvg: 35,
    missingAssignments: 5,
    riskScore: 7,
    riskLevel: "High Academic Risk",
    interventions: [
      {
        id: "INT-101",
        date: "2026-09-10",
        type: "Academic Counselling",
        status: "Follow-up Required"
      }
    ]
  };

  const latestIntervention = student.interventions && student.interventions.length > 0 ? student.interventions[0] : null;
  const supportStatus = latestIntervention?.status || "Follow-up Required";
  const lastReviewDate = latestIntervention?.date || student.lastReviewed || "2026-09-10";

  const attendance = student.attendance !== undefined ? student.attendance : 38;
  const assessmentAvg = student.assessmentAvg !== undefined ? student.assessmentAvg : 35;
  const missingAssignments = student.missingAssignments !== undefined ? student.missingAssignments : 5;
  const riskScore = student.riskScore !== undefined ? student.riskScore : 7;
  const riskLevel = student.riskLevel || "High Academic Risk";

  // Rahul 4-week demonstration trajectory per specification
  const demonstrationStages = [
    {
      week: "Week 1",
      attendance: 82,
      assessment: 72,
      missed: 0,
      risk: "0 / 7",
      status: "Low Academic Risk",
      statusColor: "#3D8B68",
      bgColor: "bg-[#3D8B68]/10",
      borderColor: "border-[#3D8B68]/30"
    },
    {
      week: "Week 2",
      attendance: 74,
      assessment: 65,
      missed: 1,
      risk: "2 / 7",
      status: "Medium Academic Risk",
      statusColor: "#C58A32",
      bgColor: "bg-[#C58A32]/10",
      borderColor: "border-[#C58A32]/30"
    },
    {
      week: "Week 3",
      attendance: 65,
      assessment: 54,
      missed: 2,
      risk: "4 / 7",
      status: "Medium Academic Risk",
      statusColor: "#C58A32",
      bgColor: "bg-[#C58A32]/10",
      borderColor: "border-[#C58A32]/30"
    },
    {
      week: "Week 4",
      attendance: 38,
      assessment: 35,
      missed: 5,
      risk: "7 / 7",
      status: "High Academic Risk",
      statusColor: "#C45151",
      bgColor: "bg-[#C45151]/10",
      borderColor: "border-[#C45151]/30"
    }
  ];

  return (
    <div className="space-y-6 font-sans text-[#18202A] max-w-5xl mx-auto">
      
      {/* 1. Header Greeting & Overview Title */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#68717D] tracking-wider uppercase block mb-1">
            Student Academic Advisory Portal
          </span>
          <h1 className="text-2xl font-black text-[#18202A] tracking-tight">
            Good morning, {student.name ? student.name.split(" ")[0] : "Rahul"}
          </h1>
          <p className="text-xs text-[#68717D] mt-1 font-medium">
            Review your current academic indicators and support status.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#F6F7F4] border border-[#E4E7E2] px-3.5 py-2 rounded-lg text-xs">
          <Calendar className="w-4 h-4 text-[#263B8F]" />
          <span className="font-semibold text-[#18202A]">Academic Term 2026–2027</span>
        </div>
      </div>

      {/* 2. Academic Status Box & Score */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs">
        <span className="text-[10px] font-mono font-bold text-[#68717D] tracking-wider uppercase block mb-2">
          ACADEMIC STATUS
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E7E2]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C45151]/10 border border-[#C45151]/20 flex items-center justify-center text-[#C45151] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#C45151] block uppercase">
                {riskLevel === "High Risk" || riskLevel === "High Academic Risk" ? "HIGH ACADEMIC RISK" : riskLevel}
              </span>
              <span className="text-xs text-[#68717D] font-medium">
                Academic indicators have flagged multiple areas requiring advisor follow-up and study support.
              </span>
            </div>
          </div>

          {/* Subdued risk point score */}
          <div className="text-left sm:text-right bg-[#F6F7F4] border border-[#E4E7E2] rounded-lg px-4 py-2 shrink-0">
            <span className="text-[10px] text-[#68717D] block uppercase font-bold tracking-wider">Indicator Score</span>
            <span className="text-sm font-mono font-bold text-[#18202A]">
              {riskScore} / 7
            </span>
          </div>
        </div>

        <p className="text-[11px] text-[#68717D] mt-3 leading-relaxed">
          This early warning status is a supportive decision-support indicator designed to assist students and mentors in identifying warning signals early. It is not an assessment of failure or a punitive measure.
        </p>
      </div>

      {/* 3. Current Academic Indicators (3 Columns) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-[#18202A] uppercase tracking-wider">
            Current Academic Indicators
          </h2>
          <span className="text-[11px] text-[#68717D]">Evaluated against institutional benchmarks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Indicator 1: Attendance */}
          <div className="bg-white rounded-xl border border-[#E4E7E2] p-5 shadow-2xs flex flex-col justify-between hover:border-[#263B8F]/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#68717D] uppercase tracking-wider">Attendance</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C45151]/10 text-[#C45151] border border-[#C45151]/20">
                  Below Benchmark
                </span>
              </div>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-black font-mono text-[#C45151]">{attendance}%</span>
                <span className="text-xs text-[#68717D]">recorded presence</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#E4E7E2] text-xs">
              <span className="text-[#68717D] block">Institutional benchmark: <strong className="text-[#18202A]">75%</strong></span>
              <span className="text-[11px] text-[#C45151] font-semibold block mt-0.5">Below 75% benchmark</span>
            </div>
          </div>

          {/* Indicator 2: Assessment */}
          <div className="bg-white rounded-xl border border-[#E4E7E2] p-5 shadow-2xs flex flex-col justify-between hover:border-[#263B8F]/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#68717D] uppercase tracking-wider">Assessment Average</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C45151]/10 text-[#C45151] border border-[#C45151]/20">
                  Below Benchmark
                </span>
              </div>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-black font-mono text-[#C45151]">{assessmentAvg}%</span>
                <span className="text-xs text-[#68717D]">midterm & quizzes</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#E4E7E2] text-xs">
              <span className="text-[#68717D] block">Institutional benchmark: <strong className="text-[#18202A]">40%</strong></span>
              <span className="text-[11px] text-[#C45151] font-semibold block mt-0.5">Below 40% benchmark</span>
            </div>
          </div>

          {/* Indicator 3: Assignments */}
          <div className="bg-white rounded-xl border border-[#E4E7E2] p-5 shadow-2xs flex flex-col justify-between hover:border-[#263B8F]/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#68717D] uppercase tracking-wider">Missed Assignments</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C45151]/10 text-[#C45151] border border-[#C45151]/20">
                  Threshold Reached
                </span>
              </div>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-black font-mono text-[#C45151]">{missingAssignments}</span>
                <span className="text-xs text-[#68717D]">unsubmitted tasks</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#E4E7E2] text-xs">
              <span className="text-[#68717D] block">Institutional benchmark: <strong className="text-[#18202A]">Threshold ≥ 2</strong></span>
              <span className="text-[11px] text-[#C45151] font-semibold block mt-0.5">5 missed coursework items</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. "What Needs Attention?" Section (Supportive & Constructive) */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7E2] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#263B8F]" />
            <h2 className="text-sm font-extrabold text-[#18202A] tracking-tight">
              What Needs Attention?
            </h2>
          </div>
          <span className="text-[11px] text-[#68717D] font-medium">Recommended focus areas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2] space-y-1.5">
            <span className="font-bold text-[#18202A] block text-xs">Attendance</span>
            <p className="text-[#68717D] leading-relaxed text-[11px]">
              Your current attendance is below the 75% academic benchmark. Attending forthcoming sessions will help rebuild your record.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2] space-y-1.5">
            <span className="font-bold text-[#18202A] block text-xs">Assessment Performance</span>
            <p className="text-[#68717D] leading-relaxed text-[11px]">
              Your current assessment average is below the 40% benchmark. Scheduling a preparation review with your mentor is advised.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2] space-y-1.5">
            <span className="font-bold text-[#18202A] block text-xs">Assignment Submissions</span>
            <p className="text-[#68717D] leading-relaxed text-[11px]">
              You currently have 5 missed assignments. Catching up on pending submissions will significantly recover coursework marks.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setActiveTab("attendance")}
            className="px-4 py-2 rounded-lg bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>View Academic Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. Academic Signal History (Demonstration Data) */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E7E2] pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#18202A] tracking-tight">
              My Academic Signal History
            </h2>
            <p className="text-xs text-[#68717D] mt-0.5">
              View how your academic indicators have changed across the demonstration timeline.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#ECEEFA] text-[#263B8F] border border-[#263B8F]/20 shrink-0 self-start sm:self-auto">
            DEMONSTRATION DATA
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {demonstrationStages.map((stage) => (
            <div
              key={stage.week}
              className={`p-4 rounded-xl border ${stage.borderColor} ${stage.bgColor} space-y-3 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#18202A]">{stage.week}</span>
                  <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-white/80 border border-[#E4E7E2]">
                    {stage.risk}
                  </span>
                </div>
                <span className="text-[11px] font-extrabold block" style={{ color: stage.statusColor }}>
                  {stage.status}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] font-mono pt-2 border-t border-black/5 text-[#18202A]">
                <div className="flex justify-between">
                  <span className="text-[#68717D]">Attendance:</span>
                  <span className="font-bold">{stage.attendance}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68717D]">Assessment:</span>
                  <span className="font-bold">{stage.assessment}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68717D]">Missed tasks:</span>
                  <span className="font-bold">{stage.missed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Small Unobtrusive Label Note */}
        <div className="p-3 rounded-lg bg-[#F6F7F4] border border-[#E4E7E2] flex items-start gap-2 text-[11px] text-[#68717D]">
          <Info className="w-4 h-4 text-[#263B8F] shrink-0 mt-0.5" />
          <span>
            These values are simulated demonstration data used to show how the system responds to changing academic indicators.
          </span>
        </div>
      </div>

      {/* 6. Mentor Support Summary Preview */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#263B8F]/10 border border-[#263B8F]/20 flex items-center justify-center text-[#263B8F] shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#68717D] uppercase tracking-wider block">
              ADVISORY & MENTOR SUPPORT
            </span>
            <h3 className="text-sm font-extrabold text-[#18202A]">
              {supportStatus}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#68717D] mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#263B8F]" />
              <span>Session Logged: <strong>{lastReviewDate}</strong></span>
              <span>•</span>
              <span>Mentor: <strong>Assigned Faculty Mentor (CSE)</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("mentor-support")}
          className="px-4 py-2 rounded-lg bg-[#F6F7F4] hover:bg-[#E4E7E2] border border-[#E4E7E2] text-[#18202A] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>View Mentor Support</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#263B8F]" />
        </button>
      </div>

    </div>
  );
}
