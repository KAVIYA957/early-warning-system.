import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import RiskBadge from '../UI/RiskBadge';
import RahulDemoWalkthrough from '../Demo/RahulDemoWalkthrough';
import AcademicSignalTimeline from '../UI/AcademicSignalTimeline';
import {
  Search,
  RotateCcw,
  Eye,
  PieChart as PieIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function FacultyDashboard() {
  const { students, setSelectedStudentId } = useApp();
  const [showDemoScenario, setShowDemoScenario] = useState(false);

  // Progressive Disclosure State (Show 5 initially)
  const [isExpanded, setIsExpanded] = useState(false);

  // Active filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("riskDesc");

  const resetFilters = () => {
    setSearchQuery("");
    setRiskFilter("ALL");
    setDeptFilter("ALL");
    setSortBy("riskDesc");
  };

  // Identify Top Risk Hero Student (Rahul Kumar or highest risk score)
  const priorityStudent = students.find(s => s.id === "STU-2026-001") || students.find(s => s.riskScore >= 5) || students[0];

  // Calculate KPI Metrics dynamically for sub-labels
  const highRiskCount = students.filter(s => s.riskLevel === "High Risk" || s.riskLevel === "High Academic Risk").length;
  const mediumRiskCount = students.filter(s => s.riskLevel === "Medium Risk").length;
  const lowRiskCount = students.filter(s => s.riskLevel === "Low Risk").length;

  // Filter & Sort Logic across ALL 42 students
  const filteredStudents = students.filter(s => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchRoll = s.rollNo.toLowerCase().includes(q);
      if (!matchName && !matchRoll) return false;
    }

    if (riskFilter !== "ALL") {
      if (riskFilter === "High Risk" && !(s.riskLevel === "High Risk" || s.riskLevel === "High Academic Risk")) return false;
      if (riskFilter === "Medium Risk" && s.riskLevel !== "Medium Risk") return false;
      if (riskFilter === "Low Risk" && s.riskLevel !== "Low Risk") return false;
    }

    if (deptFilter !== "ALL" && s.department !== deptFilter) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === "riskDesc") return b.riskScore - a.riskScore;
    if (sortBy === "riskAsc") return a.riskScore - b.riskScore;
    if (sortBy === "attAsc") return a.attendance - b.attendance;
    if (sortBy === "scoreAsc") return a.assessmentAvg - b.assessmentAvg;
    if (sortBy === "nameAsc") return a.name.localeCompare(b.name);
    return 0;
  });

  // Progressive Disclosure Math (5 visible initially)
  const visibleStudents = isExpanded ? filteredStudents : filteredStudents.slice(0, 5);
  const remainingCount = filteredStudents.length - 5;

  // Recharts Donut Data using Semantic Palette
  const pieData = [
    { name: 'Low Risk', value: lowRiskCount, color: '#3D8B68' },
    { name: 'Medium Risk', value: mediumRiskCount, color: '#C58A32' },
    { name: 'High Academic Risk', value: highRiskCount, color: '#C45151' },
  ];

  // Collect Follow-ups Due List
  const followUpsDue = [];
  students.forEach(s => {
    if (s.interventions && s.interventions.length > 0) {
      s.interventions.forEach(item => {
        if (item.status === "Follow-up Required" || item.status === "Open") {
          followUpsDue.push({
            ...item,
            studentName: s.name,
            rollNo: s.rollNo,
            studentId: s.id,
            riskLevel: s.riskLevel,
            riskScore: s.riskScore
          });
        }
      });
    }
  });

  const departmentsList = ["ALL", "Computer Science & Engineering", "Electrical Engineering", "Mechanical Engineering", "Business & Management", "Data Science"];

  return (
    <div className="space-y-8 font-sans text-[#18202A]">
      
      {/* EDITORIAL HEADER: WHO NEEDS ATTENTION? */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div>
          <span className="text-xs text-[#263B8F] font-mono font-extrabold uppercase tracking-wider block mb-1">
            Faculty Academic Workspace
          </span>
          <h1 className="text-3xl font-black text-[#18202A] tracking-tight">
            Good morning
          </h1>
          <p className="text-sm text-[#68717D] mt-1 font-medium">
            <strong className="text-[#C45151] font-extrabold">{highRiskCount} students</strong> are currently flagged for faculty review.
          </p>
        </div>

        <button
          onClick={() => setShowDemoScenario(!showDemoScenario)}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#E4E7E2] hover:bg-[#F6F7F4] text-[#263B8F] text-xs font-extrabold transition-all shadow-2xs flex items-center gap-2 self-start md:self-center shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#263B8F]" />
          <span>{showDemoScenario ? "Close Demo Scenario" : "Interactive Demo Walkthrough"}</span>
          {showDemoScenario ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Collapsible Demo Walkthrough Scenario */}
      {showDemoScenario && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <RahulDemoWalkthrough />
        </div>
      )}

      {/* HERO COMPOSITION: WHO → WHY → WHAT CAN I DO? (Rahul Kumar) */}
      {priorityStudent && (
        <div className="bg-white rounded-2xl border border-[#E4E7E2] p-7 shadow-2xs relative overflow-hidden space-y-6">
          {/* Header Story */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-[#E4E7E2] pb-5">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#C45151]/10 text-[#C45151] border border-[#C45151]/20 text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#C45151]" />
                  PRIORITY REVIEW REQUIRED
                </span>
                <span className="text-xs text-[#68717D] font-mono">
                  Rule Score: <strong className="text-[#C45151] font-extrabold">{priorityStudent.riskScore} / 7 Pts</strong>
                </span>
              </div>

              <h2 className="text-2xl font-black text-[#18202A] tracking-tight flex items-center gap-3">
                {priorityStudent.name}
                <RiskBadge level={priorityStudent.riskLevel} score={priorityStudent.riskScore} size="md" />
              </h2>
              <p className="text-xs text-[#68717D] font-mono">
                {priorityStudent.department} • Roll No: {priorityStudent.rollNo}
              </p>
            </div>

            <button
              onClick={() => setSelectedStudentId(priorityStudent.id)}
              className="px-5 py-3 rounded-xl bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-extrabold shadow-2xs transition-all flex items-center gap-2 shrink-0"
            >
              <Eye className="w-4 h-4" />
              <span>Review Student Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Academic Signal & 3 Factor Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* 3 Metric Pills (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2]">
                <span className="text-[10px] text-[#68717D] block uppercase font-bold">Attendance</span>
                <span className={`text-xl font-black font-mono ${priorityStudent.attendance < 75 ? "text-[#C45151]" : "text-[#18202A]"}`}>
                  {priorityStudent.attendance}%
                </span>
                <span className="text-[9px] text-[#68717D] block truncate">Below 75% benchmark</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2]">
                <span className="text-[10px] text-[#68717D] block uppercase font-bold">Assessment</span>
                <span className={`text-xl font-black font-mono ${priorityStudent.assessmentAvg < 40 ? "text-[#C45151]" : "text-[#18202A]"}`}>
                  {priorityStudent.assessmentAvg}%
                </span>
                <span className="text-[9px] text-[#68717D] block truncate">Below 40% benchmark</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2]">
                <span className="text-[10px] text-[#68717D] block uppercase font-bold">Assignments</span>
                <span className={`text-xl font-black font-mono ${priorityStudent.missingAssignments >= 2 ? "text-[#C45151]" : "text-[#18202A]"}`}>
                  {priorityStudent.missingAssignments} missed
                </span>
                <span className="text-[9px] text-[#68717D] block truncate">2+ threshold</span>
              </div>
            </div>

            {/* Academic Signal Timeline Snippet (7 cols) */}
            <div className="lg:col-span-7 bg-[#F6F7F4] p-4 rounded-xl border border-[#E4E7E2]">
              <div className="flex items-center justify-between text-xs text-[#18202A] font-mono mb-2">
                <span className="font-extrabold text-[#263B8F]">ACADEMIC SIGNAL TRAJECTORY</span>
                <span className="text-[#68717D] text-[11px]">4-Week Evolution</span>
              </div>
              <AcademicSignalTimeline compact={true} />
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MONITORED COHORT TABLE (5 Students Initially + Progressive Expand)
      ------------------------------------------------------------- */}
      <div className="space-y-4">
        {/* Editorial Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
          <div>
            <h2 className="text-xl font-black text-[#18202A] tracking-tight">STUDENTS REQUIRING FACULTY REVIEW</h2>
            <p className="text-xs text-[#68717D]">
              Showing {visibleStudents.length} of {filteredStudents.length} students requiring review
            </p>
          </div>

          <div className="text-xs font-mono text-[#68717D]">
            Order: <strong className="text-[#18202A] font-bold">Highest Risk Score First</strong>
          </div>
        </div>

        {/* Integrated Filter Control Bar */}
        <div className="bg-white border border-[#E4E7E2] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search across ALL 42 */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#68717D]" />
              <input
                type="text"
                placeholder="Search name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A] rounded-md pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-[#263B8F] outline-none"
              />
            </div>

            {/* Risk Filter across ALL 42 */}
            <div className="flex items-center gap-1.5">
              <label className="text-[#68717D] font-medium">Risk Tier:</label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A] rounded-md px-2 py-1 text-xs outline-none font-medium"
              >
                <option value="ALL">All Risk Tiers</option>
                <option value="High Risk">High Academic Risk ({highRiskCount})</option>
                <option value="Medium Risk">Medium Risk ({mediumRiskCount})</option>
                <option value="Low Risk">Low Risk ({lowRiskCount})</option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-1.5">
              <label className="text-[#68717D] font-medium">Department:</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A] rounded-md px-2 py-1 text-xs outline-none font-medium"
              >
                {departmentsList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5">
              <label className="text-[#68717D] font-medium">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A] rounded-md px-2 py-1 text-xs outline-none font-medium"
              >
                <option value="riskDesc">Highest Risk Score First</option>
                <option value="riskAsc">Lowest Risk Score First</option>
                <option value="attAsc">Lowest Attendance</option>
                <option value="scoreAsc">Lowest Assessment Avg</option>
                <option value="nameAsc">Name (A-Z)</option>
              </select>
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="px-2.5 py-1 rounded-md bg-[#F6F7F4] hover:bg-[#E4E7E2] text-[#18202A] border border-[#E4E7E2] flex items-center gap-1 font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#68717D]" />
            <span>Reset</span>
          </button>
        </div>

        {/* Data Table (Renders initial 5 visible, expandable via progressive disclosure) */}
        <div className="bg-white border border-[#E4E7E2] rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#18202A]">
              <thead className="bg-[#F6F7F4] text-[#68717D] font-bold uppercase tracking-wider text-[10px] border-b border-[#E4E7E2]">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-3">Attendance</th>
                  <th className="py-3.5 px-3">Assessment</th>
                  <th className="py-3.5 px-3">Assignments</th>
                  <th className="py-3.5 px-3">Risk Score</th>
                  <th className="py-3.5 px-3">Risk Level</th>
                  <th className="py-3.5 px-4">Primary Warning</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7E2]">
                {visibleStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-[#68717D]">
                      No student records matched the specified criteria.
                    </td>
                  </tr>
                ) : (
                  visibleStudents.map((student) => {
                    const primaryWarningText = student.pointReasons && student.pointReasons.length > 0
                      ? student.pointReasons.join(" • ")
                      : "Good academic standing";

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-[#F6F7F4]/80 transition-colors group cursor-pointer"
                        onClick={() => setSelectedStudentId(student.id)}
                      >
                        {/* Student Name */}
                        <td className="py-3.5 px-4 font-bold text-[#18202A] group-hover:text-[#263B8F] transition-colors">
                          {student.name}
                          <span className="text-[10px] text-[#68717D] block font-mono font-normal">{student.rollNo}</span>
                        </td>

                        {/* Attendance */}
                        <td className="py-3.5 px-3">
                          <span className={`font-mono font-bold ${student.attendance < 75 ? "text-[#C45151]" : "text-[#18202A]"}`}>
                            {student.attendance}%
                          </span>
                        </td>

                        {/* Assessment */}
                        <td className="py-3.5 px-3">
                          <span className={`font-mono font-bold ${student.assessmentAvg < 40 ? "text-[#C45151]" : "text-[#18202A]"}`}>
                            {student.assessmentAvg}%
                          </span>
                        </td>

                        {/* Assignments */}
                        <td className="py-3.5 px-3 font-mono">
                          {student.missingAssignments >= 2 ? (
                            <span className="text-[#C45151] font-bold">
                              {student.missingAssignments} missed
                            </span>
                          ) : (
                            <span className="text-[#68717D] font-medium">{student.missingAssignments} missed</span>
                          )}
                        </td>

                        {/* Risk Score */}
                        <td className="py-3.5 px-3 font-mono font-bold text-[#18202A]">
                          {student.riskScore} / 7
                        </td>

                        {/* Risk Level */}
                        <td className="py-3.5 px-3">
                          <RiskBadge level={student.riskLevel} score={student.riskScore} size="sm" />
                        </td>

                        {/* Primary Warning */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <span className={`text-[11px] font-medium block truncate ${
                            student.riskLevel === "High Risk" || student.riskLevel === "High Academic Risk"
                              ? "text-[#C45151]"
                              : student.riskLevel === "Medium Risk"
                              ? "text-[#C58A32]"
                              : "text-[#3D8B68]"
                          }`} title={primaryWarningText}>
                            {primaryWarningText}
                          </span>
                        </td>

                        {/* Action: View Profile */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudentId(student.id);
                            }}
                            className="px-3 py-1 rounded-lg bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-semibold inline-flex items-center gap-1 transition-all shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Profile</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Progressive Disclosure Expand/Collapse Control */}
          {filteredStudents.length > 5 && (
            <div className="py-3 text-center border-t border-[#E4E7E2] bg-[#F6F7F4]/60">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-mono font-bold text-[#263B8F] hover:text-[#18265F] inline-flex items-center gap-1.5 transition-all"
              >
                <span>{isExpanded ? "Show fewer students ↑" : `View ${remainingCount} more students ↓`}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------
          LOWER SECTION: FOLLOW-UPS DUE & RISK DISTRIBUTION
      ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Follow-ups Due */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E4E7E2] p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E7E2] mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#263B8F]" />
              <h3 className="text-xs font-bold text-[#18202A] uppercase tracking-wider">Scheduled Follow-ups Due</h3>
            </div>
            <span className="text-[11px] font-mono text-[#C45151] font-bold bg-[#C45151]/10 px-2.5 py-0.5 rounded border border-[#C45151]/20">
              {followUpsDue.length} Action Pending
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#18202A]">
              <thead className="bg-[#F6F7F4] text-[#68717D] font-bold uppercase text-[10px] border-b border-[#E4E7E2]">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Intervention Type</th>
                  <th className="py-2.5 px-3">Follow-up Date</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7E2]">
                {followUpsDue.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-[#68717D]">
                      No pending follow-ups scheduled at this time.
                    </td>
                  </tr>
                ) : (
                  followUpsDue.slice(0, 4).map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#F6F7F4] transition-colors cursor-pointer"
                      onClick={() => setSelectedStudentId(item.studentId)}
                    >
                      <td className="py-2.5 px-3 font-semibold text-[#18202A]">
                        {item.studentName}
                        <span className="text-[10px] text-[#68717D] block font-mono font-normal">{item.rollNo}</span>
                      </td>
                      <td className="py-2.5 px-3 text-[#263B8F] font-bold">{item.type}</td>
                      <td className="py-2.5 px-3 text-[#68717D] font-mono">{item.followUpDate || item.date}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C58A32]/10 text-[#C58A32] border border-[#C58A32]/20">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cohort Risk Distribution Donut */}
        <div className="bg-white rounded-xl border border-[#E4E7E2] p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E7E2] mb-2">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#263B8F]" />
              <h3 className="text-xs font-bold text-[#18202A] uppercase tracking-wider">Cohort Risk Distribution</h3>
            </div>
            <span className="text-[11px] text-[#68717D] font-mono">42 Monitored</span>
          </div>

          <div className="h-48 flex items-center justify-center my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E4E7E2', borderRadius: '8px', color: '#18202A', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 pt-3 border-t border-[#E4E7E2] text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#3D8B68]" />
              <span className="text-[#68717D]">Low: <strong className="text-[#18202A]">{lowRiskCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#C58A32]" />
              <span className="text-[#68717D]">Med: <strong className="text-[#18202A]">{mediumRiskCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#C45151]" />
              <span className="text-[#68717D]">High: <strong className="text-[#18202A]">{highRiskCount}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
