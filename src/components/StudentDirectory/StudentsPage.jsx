import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import RiskBadge from '../UI/RiskBadge';
import {
  Users,
  Search,
  RotateCcw,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { exportStudentsToCSV } from '../../utils/csvExporter';

export default function StudentsPage() {
  const { students, setSelectedStudentId, searchQuery, setSearchQuery } = useApp();

  // Local filter, pagination & progressive disclosure states
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [sortField, setSortField] = useState("riskScoreDesc");
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRisk("ALL");
    setSelectedDept("ALL");
    setSortField("riskScoreDesc");
    setIsExpanded(false);
    setCurrentPage(1);
  };

  const departmentsList = ["ALL", "Computer Science & Engineering", "Electrical Engineering", "Mechanical Engineering", "Business & Management", "Data Science"];

  // Filter & Sort Logic across ALL 42 students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search match
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = student.name.toLowerCase().includes(q);
        const matchRoll = student.rollNo.toLowerCase().includes(q);
        const matchDept = student.department.toLowerCase().includes(q);
        if (!matchName && !matchRoll && !matchDept) return false;
      }

      // Risk match
      if (selectedRisk !== "ALL") {
        if (selectedRisk === "High Risk" && !(student.riskLevel === "High Risk" || student.riskLevel === "High Academic Risk")) return false;
        if (selectedRisk === "Medium Risk" && student.riskLevel !== "Medium Risk") return false;
        if (selectedRisk === "Low Risk" && student.riskLevel !== "Low Risk") return false;
      }

      // Department match
      if (selectedDept !== "ALL" && student.department !== selectedDept) return false;

      return true;
    }).sort((a, b) => {
      if (sortField === "riskScoreDesc") return b.riskScore - a.riskScore;
      if (sortField === "riskScoreAsc") return a.riskScore - b.riskScore;
      if (sortField === "attAsc") return a.attendance - b.attendance;
      if (sortField === "attDesc") return b.attendance - a.attendance;
      if (sortField === "nameAsc") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [students, searchQuery, selectedRisk, selectedDept, sortField]);

  // Progressive Disclosure Math (5 initial visible, expandable to paginated/full view)
  const displayedStudents = useMemo(() => {
    if (!isExpanded) {
      return filteredStudents.slice(0, 5);
    }
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, isExpanded, currentPage, pageSize]);

  const totalStudentsCount = filteredStudents.length;
  const remainingCount = totalStudentsCount - 5;
  const totalPages = Math.ceil(totalStudentsCount / pageSize) || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-4 font-sans text-[#18202A]">
      
      {/* Page Header */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#ECEEFA] border border-[#263B8F]/20 text-[#263B8F]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-[#18202A] tracking-tight">Student Academic Roster</h1>
            <p className="text-xs text-[#68717D] mt-0.5">
              Review academic indicators and early-warning status across monitored students ({totalStudentsCount} total students).
            </p>
          </div>
        </div>

        <button
          onClick={() => exportStudentsToCSV(filteredStudents)}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F6F7F4] text-[#18202A] border border-[#E4E7E2] font-semibold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
        >
          <Download className="w-4 h-4 text-[#263B8F]" />
          <span>Export Roster (.CSV)</span>
        </button>
      </div>

      {/* Filter Control Bar (Operates across ALL 42) */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#68717D]" />
            <input
              type="text"
              placeholder="Search name, roll no, or dept..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A] rounded-md pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-[#263B8F] outline-none"
            />
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-[#68717D] font-medium">Risk Level:</label>
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A] rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#263B8F] outline-none font-medium"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="High Risk">High Academic Risk</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="Low Risk">Low Risk</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-[#68717D] font-medium">Department:</label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A] rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#263B8F] outline-none font-medium"
            >
              {departmentsList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <label className="text-[#68717D] font-medium">Sort By:</label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A] rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#263B8F] outline-none font-medium"
            >
              <option value="riskScoreDesc">Highest Risk Score</option>
              <option value="riskScoreAsc">Lowest Risk Score</option>
              <option value="attAsc">Lowest Attendance First</option>
              <option value="attDesc">Highest Attendance First</option>
              <option value="nameAsc">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Reset Filter Button */}
        <button
          onClick={resetFilters}
          className="px-2.5 py-1 rounded-md bg-[#F6F7F4] hover:bg-[#E4E7E2] text-[#18202A] border border-[#E4E7E2] flex items-center gap-1 font-semibold transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#68717D]" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Student Data Table */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#18202A]">
            <thead className="bg-[#F6F7F4] text-[#68717D] font-bold uppercase tracking-wider text-[10px] border-b border-[#E4E7E2]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Roll Number</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Assessment Avg</th>
                <th className="py-3 px-3">Missed Assignments</th>
                <th className="py-3 px-3">Risk Score</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Last Reviewed</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7E2]">
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-[#68717D] font-medium">
                    No students matched the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                displayedStudents.map((student) => {
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-[#F6F7F4]/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedStudentId(student.id)}
                    >
                      {/* Student */}
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-[#18202A] group-hover:text-[#263B8F] transition-colors">
                        {student.name}
                      </td>

                      {/* Roll Number */}
                      <td className="py-3 px-3 font-mono text-[#18202A] font-semibold whitespace-nowrap">
                        {student.rollNo}
                      </td>

                      {/* Department */}
                      <td className="py-3 px-3 text-[#68717D] font-medium whitespace-nowrap">
                        {student.department}
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`font-mono font-bold ${student.attendance < 75 ? "text-[#C45151]" : "text-[#18202A]"}`}>
                          {student.attendance}%
                        </span>
                      </td>

                      {/* Assessment Avg */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`font-mono font-bold ${student.assessmentAvg < 40 ? "text-[#C45151]" : "text-[#18202A]"}`}>
                          {student.assessmentAvg}%
                        </span>
                      </td>

                      {/* Missed Assignments */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono">
                        {student.missingAssignments >= 2 ? (
                          <span className="text-[#C45151] font-bold">
                            {student.missingAssignments} Missed
                          </span>
                        ) : (
                          <span className="text-[#68717D] font-medium">{student.missingAssignments} Missed</span>
                        )}
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-3 font-mono font-bold text-[#18202A] whitespace-nowrap">
                        {student.riskScore} / 7
                      </td>

                      {/* Risk Level */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <RiskBadge level={student.riskLevel} score={student.riskScore} size="sm" showScore={false} />
                      </td>

                      {/* Last Reviewed */}
                      <td className="py-3 px-3 font-mono text-[#68717D] whitespace-nowrap">
                        {student.lastReviewed || "2026-09-20"}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudentId(student.id);
                          }}
                          className="px-3 py-1 rounded bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-semibold inline-flex items-center gap-1 transition-all shadow-2xs"
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

        {/* Progressive Disclosure Expand / Pagination Bar */}
        {!isExpanded && totalStudentsCount > 5 ? (
          <div className="py-3.5 text-center border-t border-[#E4E7E2] bg-[#F6F7F4]/60">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-xs font-mono font-bold text-[#263B8F] hover:text-[#18265F] inline-flex items-center gap-1.5 transition-all"
            >
              <span>View all {remainingCount} more students ↓</span>
            </button>
          </div>
        ) : isExpanded ? (
          <div className="bg-[#F6F7F4] px-4 py-3 border-t border-[#E4E7E2] flex flex-wrap items-center justify-between gap-3 text-xs text-[#68717D]">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-[#E4E7E2] text-[#18202A] rounded px-2 py-0.5 text-xs outline-none font-medium"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="ml-2">
                Showing <strong>{totalStudentsCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong>–<strong>{Math.min(currentPage * pageSize, totalStudentsCount)}</strong> of <strong>{totalStudentsCount}</strong> students
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs font-mono font-bold text-[#263B8F] hover:text-[#18265F] inline-flex items-center gap-1 transition-all mr-2"
              >
                <span>Show fewer students ↑</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded bg-white hover:bg-[#E4E7E2] disabled:opacity-40 text-[#18202A] border border-[#E4E7E2] transition-all"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium font-mono text-[#18202A]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded bg-white hover:bg-[#E4E7E2] disabled:opacity-40 text-[#18202A] border border-[#E4E7E2] transition-all"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
