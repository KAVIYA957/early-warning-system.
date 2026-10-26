import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Info, Calendar } from 'lucide-react';

export default function StudentAttendancePage() {
  const { currentStudent } = useApp();

  const student = currentStudent || {
    attendance: 38,
    attendanceTrend: [82, 74, 65, 38]
  };

  const attendance = student.attendance !== undefined ? student.attendance : 38;
  const benchmark = 75;
  const status = attendance >= benchmark ? "In Good Standing" : "Below Benchmark";

  const hasRealHistory = Array.isArray(student.attendanceTrend) && student.attendanceTrend.length > 0;
  const trendData = hasRealHistory
    ? student.attendanceTrend.map((rate, idx) => ({
        week: `Week ${idx + 1}`,
        rate,
        benchmark: 75,
        status: rate >= 75 ? "Compliant" : (rate >= 70 ? "Near Benchmark" : "Below Benchmark"),
      }))
    : [
        { week: "Week 1", rate: 82, benchmark: 75, status: "Compliant" },
        { week: "Week 2", rate: 74, benchmark: 75, status: "Near Benchmark" },
        { week: "Week 3", rate: 65, benchmark: 75, status: "Below Benchmark" },
        { week: "Week 4", rate: 38, benchmark: 75, status: "Below Benchmark" },
      ];

  return (
    <div className="space-y-6 font-sans text-[#18202A] max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-[#263B8F]/10 border border-[#263B8F]/20 text-[#263B8F]">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#18202A] tracking-tight">My Attendance</h1>
            <p className="text-xs text-[#68717D] mt-0.5">
              Review your course and laboratory session presence records.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#ECEEFA] text-[#263B8F] border border-[#263B8F]/20 shrink-0 self-start sm:self-auto">
          {hasRealHistory ? "HISTORICAL DATA" : "ILLUSTRATIVE DEMO"}
        </span>
      </div>

      {/* Primary KPI Card Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E4E7E2] rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#68717D] uppercase tracking-wider block">
            Current Attendance
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-mono text-[#C45151]">{attendance}%</span>
            <span className="text-xs text-[#68717D]">overall presence</span>
          </div>
          <span className="text-[11px] text-[#68717D] mt-2 block">
            Calculated across current semester sessions
          </span>
        </div>

        <div className="bg-white border border-[#E4E7E2] rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#68717D] uppercase tracking-wider block">
            Institutional Benchmark
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-mono text-[#263B8F]">{benchmark}%</span>
            <span className="text-xs text-[#68717D]">minimum required</span>
          </div>
          <span className="text-[11px] text-[#68717D] mt-2 block">
            Required for normal academic eligibility
          </span>
        </div>

        <div className="bg-white border border-[#E4E7E2] rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#68717D] uppercase tracking-wider block">
            Academic Status
          </span>
          <div className="mt-2">
            <span className="text-lg font-black uppercase text-[#C45151] block">
              {status}
            </span>
          </div>
          <span className="text-[11px] text-[#C45151] font-semibold mt-2 block">
            {benchmark - attendance}% below target benchmark
          </span>
        </div>
      </div>

      {/* Simple Trend Progression Table / Visualization */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7E2] pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#18202A] tracking-tight">
              Weekly Attendance Progression
            </h2>
            <p className="text-xs text-[#68717D] mt-0.5">
              Chronological presence across the demonstration period.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#68717D]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#263B8F]"></span>
            <span>Benchmark: 75%</span>
          </div>
        </div>

        <div className="space-y-3">
          {trendData.map((item) => {
            const isBelow = item.rate < item.benchmark;
            return (
              <div
                key={item.week}
                className="p-4 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-32">
                  <Calendar className="w-4 h-4 text-[#68717D]" />
                  <span className="font-bold text-[#18202A]">{item.week}</span>
                </div>

                {/* Clean Horizontal Progress Bar with 75% reference marker */}
                <div className="flex-1 max-w-md mx-2">
                  <div className="relative w-full h-3 bg-white rounded-full border border-[#E4E7E2] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isBelow ? "bg-[#C45151]" : "bg-[#3D8B68]"
                      }`}
                      style={{ width: `${item.rate}%` }}
                    />
                    {/* Benchmark 75% vertical marker line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[#18202A]/40"
                      style={{ left: "75%" }}
                      title="75% Benchmark"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 min-w-44 text-right">
                  <span className="font-mono font-bold text-sm text-[#18202A]">
                    {item.rate}%
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isBelow
                        ? "bg-[#C45151]/10 text-[#C45151] border-[#C45151]/20"
                        : "bg-[#3D8B68]/10 text-[#3D8B68] border-[#3D8B68]/20"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supportive Advisory Notice */}
      <div className="p-4 rounded-xl bg-[#ECEEFA]/60 border border-[#263B8F]/20 flex items-start gap-3 text-xs text-[#18202A]">
        <Info className="w-5 h-5 text-[#263B8F] shrink-0 mt-0.5" />
        <div>
          <strong className="font-extrabold text-[#263B8F] block mb-0.5">
            Attendance Support Note:
          </strong>
          Institutional policy requires a minimum of 75% overall attendance. If you have faced medical circumstances or scheduling conflicts, please coordinate with your faculty mentor to document approved absences and plan attendance recovery.
        </div>
      </div>
    </div>
  );
}
