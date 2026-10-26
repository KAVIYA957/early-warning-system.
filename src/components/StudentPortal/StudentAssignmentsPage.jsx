import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function StudentAssignmentsPage() {
  const { currentStudent } = useApp();

  const student = currentStudent || {
    missingAssignments: 5
  };

  const missingAssignments = student.missingAssignments !== undefined ? student.missingAssignments : 5;
  const threshold = 2;
  const needsAttention = missingAssignments >= threshold;

  return (
    <div className="space-y-6 font-sans text-[#18202A] max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-[#263B8F]/10 border border-[#263B8F]/20 text-[#263B8F]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#18202A] tracking-tight">My Assignments</h1>
            <p className="text-xs text-[#68717D] mt-0.5">
              Review missed coursework deliverables and academic submission thresholds.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#ECEEFA] text-[#263B8F] border border-[#263B8F]/20 shrink-0 self-start sm:self-auto">
          DEMONSTRATION DATA
        </span>
      </div>

      {/* Primary KPI Card Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E4E7E2] rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#68717D] uppercase tracking-wider block">
            Missed Assignments
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-mono text-[#C45151]">{missingAssignments}</span>
            <span className="text-xs text-[#68717D]">unsubmitted deliverables</span>
          </div>
          <span className="text-[11px] text-[#68717D] mt-2 block">
            Verified institutional indicator record
          </span>
        </div>

        <div className="bg-white border border-[#E4E7E2] rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#68717D] uppercase tracking-wider block">
            Advisory Threshold
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-mono text-[#263B8F]">≥ {threshold}</span>
            <span className="text-xs text-[#68717D]">warning cutoff</span>
          </div>
          <span className="text-[11px] text-[#68717D] mt-2 block">
            Flagging trigger: 2 or more missed assignments
          </span>
        </div>

        <div className="bg-white border border-[#E4E7E2] rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#68717D] uppercase tracking-wider block">
            Indicator Evaluation
          </span>
          <div className="mt-2">
            <span className="text-lg font-black uppercase text-[#C45151] block">
              {needsAttention ? "Needs Attention" : "Normal Standing"}
            </span>
          </div>
          <span className="text-[11px] text-[#C45151] font-semibold mt-2 block">
            +2 Risk Points added to academic profile
          </span>
        </div>
      </div>

      {/* Verified Dataset Indicator Breakdown Card */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7E2] pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#18202A] tracking-tight">
              Coursework Status & Risk Rule Evaluation
            </h2>
            <p className="text-xs text-[#68717D] mt-0.5">
              Verified metric status against the early warning decision-support framework.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#C45151]">
            Rule 3 Triggered (+2 pts)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2] space-y-2">
            <div className="flex items-center gap-2 text-[#18202A] font-bold">
              <ShieldAlert className="w-4 h-4 text-[#C45151]" />
              <span>Current Flagged Metric</span>
            </div>
            <p className="text-[#68717D] leading-relaxed text-[11px]">
              The Early Warning System currently tracks <strong>{missingAssignments} missed coursework assignments</strong> for this semester. Reaching 2 or more missed tasks flags an academic warning signal (+2 points) to alert advisors before term-end examinations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2] space-y-2">
            <div className="flex items-center gap-2 text-[#18202A] font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#3D8B68]" />
              <span>Recommended Recovery Action</span>
            </div>
            <p className="text-[#68717D] leading-relaxed text-[11px]">
              Students who discuss missed work promptly with instructors can often access remedial submission opportunities or coursework extensions agreed through their faculty mentor.
            </p>
          </div>
        </div>
      </div>

      {/* Advisory Guidance & Data Scope Note */}
      <div className="p-4 rounded-xl bg-[#ECEEFA]/60 border border-[#263B8F]/20 flex items-start gap-3 text-xs text-[#18202A]">
        <Info className="w-5 h-5 text-[#263B8F] shrink-0 mt-0.5" />
        <div>
          <strong className="font-extrabold text-[#263B8F] block mb-0.5">
            LMS Submission Record Note:
          </strong>
          This early warning portal monitors the total count of unsubmitted deliverables for advisory intervention. Detailed assignment rubrics, submission deadlines, and individual grades are managed within your primary course Learning Management System (LMS).
        </div>
      </div>
    </div>
  );
}
