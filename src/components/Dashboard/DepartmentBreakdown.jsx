import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, TrendingUp } from 'lucide-react';

export default function DepartmentBreakdown() {
  const { students } = useApp();

  const depts = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Business & Management", "Data Science"];

  const deptStats = depts.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    const total = deptStudents.length;
    const high = deptStudents.filter(s => s.riskLevel === "High Risk").length;
    const med = deptStudents.filter(s => s.riskLevel === "Medium Risk").length;
    const low = deptStudents.filter(s => s.riskLevel === "Low Risk").length;
    const avgAtt = total > 0 ? Math.round(deptStudents.reduce((acc, s) => acc + s.attendance, 0) / total) : 0;
    const avgScore = total > 0 ? Math.round(deptStudents.reduce((acc, s) => acc + s.assessmentAvg, 0) / total) : 0;

    return {
      name: dept,
      total,
      high,
      med,
      low,
      avgAtt,
      avgScore
    };
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Department Risk Overview</h3>
        </div>
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-teal-700" />
          Cross-Department
        </span>
      </div>

      <div className="space-y-3">
        {deptStats.map((dept, i) => {
          const highPct = dept.total ? (dept.high / dept.total) * 100 : 0;
          const medPct = dept.total ? (dept.med / dept.total) * 100 : 0;
          const lowPct = dept.total ? (dept.low / dept.total) * 100 : 0;

          return (
            <div key={i} className="p-3 rounded-lg bg-slate-50/70 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-900">{dept.name}</span>
                <div className="flex items-center gap-3 text-[11px] text-slate-600">
                  <span>Att: <strong className={dept.avgAtt < 75 ? "text-amber-700 font-mono" : "text-slate-900 font-mono"}>{dept.avgAtt}%</strong></span>
                  <span>Score: <strong className="text-slate-900 font-mono">{dept.avgScore}%</strong></span>
                  <span className="text-slate-500 font-medium">Total: {dept.total}</span>
                </div>
              </div>

              {/* Stacked Progress Bar */}
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex border border-slate-300">
                <div style={{ width: `${highPct}%` }} className="bg-red-600 h-full" title={`High Risk: ${dept.high}`} />
                <div style={{ width: `${medPct}%` }} className="bg-amber-500 h-full" title={`Medium Risk: ${dept.med}`} />
                <div style={{ width: `${lowPct}%` }} className="bg-emerald-600 h-full" title={`Low Risk: ${dept.low}`} />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-600 mt-1.5 font-medium">
                <div className="flex items-center gap-3">
                  <span className="text-red-700">High: {dept.high}</span>
                  <span className="text-amber-700">Med: {dept.med}</span>
                  <span className="text-emerald-700">Low: {dept.low}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
