import React from 'react';
import { useApp } from '../../context/AppContext';
import RiskBadge from '../UI/RiskBadge';
import { AlertTriangle, UserCheck, ChevronRight, FileText, ArrowUpRight } from 'lucide-react';

export default function HighRiskQueue() {
  const { students, setSelectedStudentId, setActiveTab } = useApp();

  const highRiskStudents = students
    .filter(s => s.riskLevel === "High Risk")
    .sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-red-50 text-red-600 border border-red-100">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Priority High-Risk Queue</h3>
            <p className="text-[11px] text-slate-500">Students requiring immediate faculty/mentor intervention</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab("directory")}
          className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 hover:underline"
        >
          <span>View Roster ({students.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {highRiskStudents.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-xs">
          No students currently classified under High Risk threshold.
        </div>
      ) : (
        <div className="space-y-3">
          {highRiskStudents.map((student) => {
            const activeInt = student.interventions && student.interventions.find(i => i.status !== "Completed" && i.status !== "Resolved");

            return (
              <div
                key={student.id}
                className="p-3.5 rounded-lg bg-slate-50/50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                {/* Left info */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                    {student.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className="text-sm font-bold text-slate-900 hover:text-teal-700 cursor-pointer"
                        onClick={() => setSelectedStudentId(student.id)}
                      >
                        {student.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-mono">({student.rollNo})</span>
                      <RiskBadge level={student.riskLevel} score={student.riskScore} size="sm" />
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1">
                      <span>{student.department}</span>
                      <span>•</span>
                      <span>{student.semester}</span>
                      <span>•</span>
                      <span>Att: <strong className={student.attendance < 75 ? "text-red-600 font-bold" : "text-slate-800"}>{student.attendance}%</strong></span>
                      <span>•</span>
                      <span>Assess: <strong className={student.assessmentAvg < 60 ? "text-red-600 font-bold" : "text-slate-800"}>{student.assessmentAvg}%</strong></span>
                    </div>

                    {/* Contributing warning factors pills */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {student.factors.map((factor, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-200"
                        >
                          ⚠ {factor.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side status & action */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Intervention</span>
                    {activeInt ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold">
                        <UserCheck className="w-3 h-3" />
                        {activeInt.status}
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 font-semibold">No Active Plan</span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedStudentId(student.id)}
                    className="px-3 py-1.5 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Explain & Act</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
