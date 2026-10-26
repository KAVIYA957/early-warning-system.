import React from 'react';
import { useApp } from '../../context/AppContext';
import { Download, FileSpreadsheet, Printer } from 'lucide-react';
import { exportStudentsToCSV } from '../../utils/csvExporter';

export default function ExportReports() {
  const { students } = useApp();

  const highRiskStudents = students.filter(s => s.riskLevel === "High Risk");
  const medRiskStudents = students.filter(s => s.riskLevel === "Medium Risk");
  const lowRiskStudents = students.filter(s => s.riskLevel === "Low Risk");

  const totalInterventions = students.reduce((acc, s) => acc + (s.interventions ? s.interventions.length : 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Academic Audit Reports & Data Export</h2>
            <p className="text-xs text-slate-500">Generate executive summaries, intervention logs, and downloadable rosters</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 flex items-center gap-1.5 transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Audit View</span>
        </button>
      </div>

      {/* Export Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Full Student Roster Export</h3>
            <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              CSV FORMAT
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Export all {students.length} student records including attendance, exam marks, coursework completion, risk levels, and explainable warning reasons.
          </p>
          <button
            onClick={() => exportStudentsToCSV(students, "full_academic_roster_report.csv")}
            className="w-full py-2.5 rounded-md bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Complete Roster (.CSV)</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">High-Risk Priority Intervention Export</h3>
            <span className="text-[10px] font-mono text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
              HIGH RISK ONLY
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Export the {highRiskStudents.length} students currently flagged under High Risk criteria for mentor assignment and Dean review.
          </p>
          <button
            onClick={() => exportStudentsToCSV(highRiskStudents, "high_risk_students_action_list.csv")}
            className="w-full py-2.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Risk Queue (.CSV)</span>
          </button>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Semester Executive Summary Matrix</h3>
          <span className="text-[11px] text-slate-500 font-mono">Academic Term 2026-2027</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Total Monitored</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">{students.length}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200">
            <span className="text-[11px] text-red-800 font-semibold block">High Risk</span>
            <span className="text-xl font-bold text-red-700 mt-1 block">{highRiskStudents.length}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200">
            <span className="text-[11px] text-amber-800 font-semibold block">Medium Risk</span>
            <span className="text-xl font-bold text-amber-700 mt-1 block">{medRiskStudents.length}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] text-emerald-800 font-semibold block">Low Risk (Stable)</span>
            <span className="text-xl font-bold text-emerald-700 mt-1 block">{lowRiskStudents.length}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200">
            <span className="text-[11px] text-teal-800 font-semibold block">Interventions</span>
            <span className="text-xl font-bold text-teal-700 mt-1 block">{totalInterventions}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
