import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, Info, Calendar, BookOpen } from 'lucide-react';

export default function StudentAssessmentsPage() {
  const { currentStudent } = useApp();

  const student = currentStudent || {
    assessmentAvg: 35,
    midtermScore: 32,
    quizAvg: 38
  };

  const assessmentAvg = student.assessmentAvg !== undefined ? student.assessmentAvg : 35;
  const midtermScore = student.midtermScore !== undefined ? student.midtermScore : 32;
  const quizAvg = student.quizAvg !== undefined ? student.quizAvg : 38;
  const benchmark = 40;
  const isBelow = assessmentAvg < benchmark;

  const hasRealHistory = Array.isArray(student.assessmentTrend) && student.assessmentTrend.length > 0;
  const trendData = hasRealHistory
    ? student.assessmentTrend.map((score, idx) => ({
        week: `Week ${idx + 1}`,
        score,
        benchmark: 40,
        evaluation: score >= 60 ? "Satisfactory" : (score >= 40 ? "Passing" : "Needs Review"),
      }))
    : [
        { week: "Week 1", score: 72, benchmark: 40, evaluation: "Satisfactory" },
        { week: "Week 2", score: 65, benchmark: 40, evaluation: "Passing" },
        { week: "Week 3", score: 54, benchmark: 40, evaluation: "Passing" },
        { week: "Week 4", score: 35, benchmark: 40, evaluation: "Needs Review" },
      ];

  return (
    <div className="space-y-6 font-sans text-[#18202A] max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-[#263B8F]/10 border border-[#263B8F]/20 text-[#263B8F]">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#18202A] tracking-tight">My Assessments</h1>
            <p className="text-xs text-[#68717D] mt-0.5">
              Review current assessment averages and examination indicator trends.
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
            Current Average
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-mono text-[#C45151]">{assessmentAvg}%</span>
            <span className="text-xs text-[#68717D]">recent assessments</span>
          </div>
          <span className="text-[11px] text-[#68717D] mt-2 block">
            Combined midterm tests and periodic quizzes
          </span>
        </div>

        <div className="bg-white border border-[#E4E7E2] rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#68717D] uppercase tracking-wider block">
            Prototype Benchmark
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-mono text-[#263B8F]">{benchmark}%</span>
            <span className="text-xs text-[#68717D]">advisory threshold</span>
          </div>
          <span className="text-[11px] text-[#68717D] mt-2 block">
            Early warning advisory threshold
          </span>
        </div>

        <div className="bg-white border border-[#E4E7E2] rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#68717D] uppercase tracking-wider block">
            Status
          </span>
          <div className="mt-2">
            <span className="text-lg font-black uppercase text-[#C45151] block">
              {isBelow ? "Below Benchmark" : "Above Benchmark"}
            </span>
          </div>
          <span className="text-[11px] text-[#C45151] font-semibold mt-2 block">
            Current assessment average is below the prototype benchmark.
          </span>
        </div>
      </div>

      {/* Component Breakdown Card */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs space-y-4">
        <h2 className="text-xs font-bold text-[#18202A] uppercase tracking-wider border-b border-[#E4E7E2] pb-3">
          Component Assessment Breakdown
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#18202A] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#263B8F]" />
                <span>Midterm Examination</span>
              </span>
              <span className="font-mono font-bold text-sm text-[#C45151]">{midtermScore}%</span>
            </div>
            <p className="text-[11px] text-[#68717D]">
              Recent formal midterm written and practical examination score.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#18202A] flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#263B8F]" />
                <span>Periodic Quizzes Average</span>
              </span>
              <span className="font-mono font-bold text-sm text-[#C45151]">{quizAvg}%</span>
            </div>
            <p className="text-[11px] text-[#68717D]">
              Cumulative score across weekly modular continuous quizzes.
            </p>
          </div>
        </div>
      </div>

      {/* Demonstration Trend */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7E2] pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#18202A] tracking-tight">
              Demonstration Assessment Trend
            </h2>
            <p className="text-xs text-[#68717D] mt-0.5">
              Weekly progress records across the demonstration timeline.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#68717D]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#263B8F]"></span>
            <span>Benchmark: 40%</span>
          </div>
        </div>

        <div className="space-y-3">
          {trendData.map((item) => {
            const itemBelow = item.score < item.benchmark;
            return (
              <div
                key={item.week}
                className="p-4 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-32">
                  <Calendar className="w-4 h-4 text-[#68717D]" />
                  <span className="font-bold text-[#18202A]">{item.week}</span>
                </div>

                <div className="flex-1 max-w-md mx-2">
                  <div className="relative w-full h-3 bg-white rounded-full border border-[#E4E7E2] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        itemBelow ? "bg-[#C45151]" : "bg-[#3D8B68]"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[#18202A]/40"
                      style={{ left: "40%" }}
                      title="40% Benchmark"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 min-w-44 text-right">
                  <span className="font-mono font-bold text-sm text-[#18202A]">
                    {item.score}%
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      itemBelow
                        ? "bg-[#C45151]/10 text-[#C45151] border-[#C45151]/20"
                        : "bg-[#3D8B68]/10 text-[#3D8B68] border-[#3D8B68]/20"
                    }`}
                  >
                    {item.evaluation}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supportive Notice */}
      <div className="p-4 rounded-xl bg-[#ECEEFA]/60 border border-[#263B8F]/20 flex items-start gap-3 text-xs text-[#18202A]">
        <Info className="w-5 h-5 text-[#263B8F] shrink-0 mt-0.5" />
        <div>
          <strong className="font-extrabold text-[#263B8F] block mb-0.5">
            Advisory Information:
          </strong>
          Current assessment average is below the prototype benchmark. These indicators are computed dynamically for advisory review and do not represent a final grade prediction. Students are encouraged to schedule a tutorial review session with faculty.
        </div>
      </div>
    </div>
  );
}
