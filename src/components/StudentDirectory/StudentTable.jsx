import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import RiskBadge from '../UI/RiskBadge';
import StudentFilters from './StudentFilters';
import { Download, Eye } from 'lucide-react';
import { exportStudentsToCSV } from '../../utils/csvExporter';

export default function StudentTable() {
  const { students, setSelectedStudentId, searchQuery } = useApp();

  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [attendanceFilter, setAttendanceFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("riskDesc");

  const resetFilters = () => {
    setSelectedDept("ALL");
    setSelectedRisk("ALL");
    setAttendanceFilter("ALL");
    setSortBy("riskDesc");
  };

  const filteredStudents = students.filter(student => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = student.name.toLowerCase().includes(q);
      const matchRoll = student.rollNo.toLowerCase().includes(q);
      const matchDept = student.department.toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchDept) return false;
    }

    if (selectedDept !== "ALL" && student.department !== selectedDept) return false;
    if (selectedRisk !== "ALL" && student.riskLevel !== selectedRisk) return false;

    if (attendanceFilter === "< 75% (Critical)" && student.attendance >= 75) return false;
    if (attendanceFilter === "< 60% (Severe)" && student.attendance >= 60) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === "riskDesc") return b.riskScore - a.riskScore;
    if (sortBy === "riskAsc") return a.riskScore - b.riskScore;
    if (sortBy === "attAsc") return a.attendance - b.attendance;
    if (sortBy === "scoreAsc") return a.assessmentAvg - b.assessmentAvg;
    if (sortBy === "nameAsc") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Top filter bar */}
      <StudentFilters
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        selectedRisk={selectedRisk}
        setSelectedRisk={setSelectedRisk}
        attendanceFilter={attendanceFilter}
        setAttendanceFilter={setAttendanceFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        resetFilters={resetFilters}
      />

      {/* Roster Header summary & Export button */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-slate-600 font-medium">
          Showing <strong className="text-slate-900">{filteredStudents.length}</strong> of <strong className="text-slate-700">{students.length}</strong> registered students
        </div>
        <button
          onClick={() => exportStudentsToCSV(filteredStudents)}
          className="px-3 py-1.5 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-semibold flex items-center gap-1.5 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Filtered Roster (.CSV)</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Assessment Avg</th>
                <th className="py-3 px-3">Coursework</th>
                <th className="py-3 px-3">LMS Engagement</th>
                <th className="py-3 px-4">Explainable Factors</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-500">
                    No students matched the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedStudentId(student.id)}
                    >
                      {/* Name & Roll */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {student.rollNo} • {student.department}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Risk Badge */}
                      <td className="py-3 px-3">
                        <RiskBadge level={student.riskLevel} score={student.riskScore} size="sm" />
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <span className={student.attendance < 75 ? "text-red-600 font-bold" : "text-slate-900 font-medium"}>
                            {student.attendance}%
                          </span>
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                              style={{ width: `${student.attendance}%` }}
                              className={`h-full ${student.attendance < 60 ? "bg-red-600" : student.attendance < 75 ? "bg-amber-500" : "bg-emerald-600"}`}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Assessment Avg */}
                      <td className="py-3 px-3">
                        <div>
                          <span className={student.assessmentAvg < 60 ? "text-red-600 font-bold" : "text-slate-900 font-medium"}>
                            {student.assessmentAvg}%
                          </span>
                          <span className="text-[10px] text-slate-500 block">Midterm: {student.midtermScore}%</span>
                        </div>
                      </td>

                      {/* Coursework */}
                      <td className="py-3 px-3">
                        <div>
                          <span className={student.missingAssignments > 1 ? "text-red-600 font-bold" : "text-slate-900 font-medium"}>
                            {student.assignmentCompletion}%
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {student.missingAssignments > 0 ? `${student.missingAssignments} missing` : "All submitted"}
                          </span>
                        </div>
                      </td>

                      {/* Engagement */}
                      <td className="py-3 px-3">
                        <div>
                          <span className={student.engagementIndex < 50 ? "text-amber-700 font-bold" : "text-slate-900 font-medium"}>
                            {student.engagementIndex}/100
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {student.lmsLastActiveDaysAgo === 0 ? "Active today" : `${student.lmsLastActiveDaysAgo}d ago`}
                          </span>
                        </div>
                      </td>

                      {/* Explainable Factors */}
                      <td className="py-3 px-4">
                        {student.factors.length === 0 ? (
                          <span className="text-emerald-700 text-[11px] font-semibold">✓ Normal monitoring</span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {student.factors.map((f, i) => (
                              <span
                                key={i}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                  f.severity === "Critical"
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {f.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudentId(student.id);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-teal-700 text-slate-700 hover:text-white border border-slate-300 text-xs font-semibold inline-flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Explain</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
