import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import RiskBadge from '../UI/RiskBadge';
import { HeartHandshake, Eye, PlusCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function InterventionTracker() {
  const { students, mentors, setSelectedStudentId, updateInterventionStatus, openRecordModal } = useApp();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [mentorFilter, setMentorFilter] = useState("ALL");

  // Group interventions by Student for Case Management Timeline cards
  const studentCasesMap = new Map();

  students.forEach(s => {
    if (s.interventions && s.interventions.length > 0) {
      studentCasesMap.set(s.id, {
        student: s,
        interventions: s.interventions
      });
    }
  });

  const studentCases = Array.from(studentCasesMap.values());

  const allInterventions = [];
  studentCases.forEach(sc => {
    sc.interventions.forEach(item => {
      allInterventions.push({ ...item, student: sc.student });
    });
  });

  const openCasesCount = allInterventions.filter(i => i.status === "Open" || i.status === "In Progress").length;
  const followUpRequiredCount = allInterventions.filter(i => i.status === "Follow-up Required").length;
  const resolvedCount = allInterventions.filter(i => i.status === "Completed" || i.status === "Resolved").length;

  const filteredCases = studentCases.filter(sc => {
    if (statusFilter !== "ALL") {
      const hasStatus = sc.interventions.some(i => i.status === statusFilter);
      if (!hasStatus) return false;
    }
    if (mentorFilter !== "ALL") {
      const hasMentor = sc.interventions.some(i => i.mentorId === mentorFilter);
      if (!hasMentor) return false;
    }
    return true;
  });

  const statuses = ["Follow-up Required", "Open", "In Progress", "Escalated", "Completed", "Resolved"];

  return (
    <div className="space-y-6 font-sans text-[#18202A]">
      {/* Page Header */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#ECEEFA] border border-[#263B8F]/20 text-[#263B8F]">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#18202A] tracking-tight">Intervention Management Workspace</h1>
            <p className="text-xs text-[#68717D] mt-0.5">
              Case-management timeline for tracking student support dialogues and follow-up schedules.
            </p>
          </div>
        </div>

        <button
          onClick={() => openRecordModal()}
          className="px-4 py-2.5 rounded-xl bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Intervention</span>
        </button>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#E4E7E2] border-l-4 border-l-[#C58A32] p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#68717D]">Open Advisory Cases</span>
            <AlertCircle className="w-4 h-4 text-[#C58A32]" />
          </div>
          <div className="text-2xl font-black text-[#18202A] tracking-tight">{openCasesCount}</div>
          <p className="text-[11px] text-[#68717D] mt-0.5">Active support dialogues</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E4E7E2] border-l-4 border-l-[#C45151] p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#68717D]">Scheduled Follow-ups Due</span>
            <Clock className="w-4 h-4 text-[#C45151]" />
          </div>
          <div className="text-2xl font-black text-[#C45151] tracking-tight">{followUpRequiredCount}</div>
          <p className="text-[11px] text-[#C45151] mt-0.5 font-medium">Pending review date</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E4E7E2] border-l-4 border-l-[#3D8B68] p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#68717D]">Resolved Interventions</span>
            <CheckCircle2 className="w-4 h-4 text-[#3D8B68]" />
          </div>
          <div className="text-2xl font-black text-[#3D8B68] tracking-tight">{resolvedCount}</div>
          <p className="text-[11px] text-[#3D8B68] mt-0.5 font-medium">Completed support outcomes</p>
        </div>
      </div>

      {/* CASE MANAGEMENT TIMELINE LIST */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E4E7E2]">
          <div>
            <h2 className="text-sm font-bold text-[#18202A] uppercase tracking-wider">Active Student Case Files ({filteredCases.length})</h2>
            <p className="text-xs text-[#68717D] mt-0.5">Chronological intervention timeline per student case</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#68717D] font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A] rounded-md px-2.5 py-1 text-xs outline-none font-medium"
              >
                <option value="ALL">All Statuses</option>
                {statuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#68717D] font-medium">Advisor:</span>
              <select
                value={mentorFilter}
                onChange={(e) => setMentorFilter(e.target.value)}
                className="bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A] rounded-md px-2.5 py-1 text-xs outline-none font-medium"
              >
                <option value="ALL">All Advisors</option>
                {mentors.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredCases.length === 0 ? (
          <div className="p-12 text-center text-[#68717D] text-xs bg-[#F6F7F4] rounded-xl border border-[#E4E7E2]">
            No intervention case files match the selected status filters.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCases.map((caseItem) => {
              const { student, interventions } = caseItem;

              return (
                <div key={student.id} className="bg-[#F6F7F4]/70 border border-[#E4E7E2] rounded-xl p-5 space-y-4 hover:border-[#263B8F]/20 transition-all">
                  {/* Case Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E7E2]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#263B8F] text-white flex items-center justify-center font-bold text-sm">
                        {student.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-[#18202A]">{student.name}</h3>
                          <RiskBadge level={student.riskLevel} score={student.riskScore} size="sm" />
                        </div>
                        <span className="text-xs text-[#68717D] font-mono">
                          {student.department} • Roll No: {student.rollNo}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openRecordModal(student.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Action</span>
                      </button>
                      <button
                        onClick={() => setSelectedStudentId(student.id)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#E4E7E2] hover:bg-[#F6F7F4] text-[#18202A] text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#263B8F]" />
                        <span>Case Profile</span>
                      </button>
                    </div>
                  </div>

                  {/* Case Interventions Timeline */}
                  <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-[#E4E7E2]">
                    {interventions.map((item, idx) => {
                      const mentor = mentors.find(m => m.id === item.mentorId) || mentors[0];

                      return (
                        <div key={item.id || idx} className="relative pl-4 space-y-1">
                          {/* Timeline Dot */}
                          <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-[#263B8F] ring-4 ring-[#F6F7F4]" />

                          <div className="bg-white p-4 rounded-xl border border-[#E4E7E2] shadow-2xs space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-[#18202A]">{item.type}</span>
                                <span className="text-[#68717D]">•</span>
                                <span className="text-[#263B8F] font-medium">Advisor: {mentor.name}</span>
                              </div>

                              <div className="flex items-center gap-2 font-mono">
                                <span className="text-[#68717D]">{item.date}</span>
                                <select
                                  value={item.status}
                                  onChange={(e) => updateInterventionStatus(student.id, item.id, e.target.value)}
                                  className={`text-xs font-bold rounded-md px-2.5 py-0.5 border outline-none ${
                                    item.status === "Completed" || item.status === "Resolved"
                                      ? "bg-[#3D8B68]/10 text-[#3D8B68] border-[#3D8B68]/20"
                                      : item.status === "Follow-up Required"
                                      ? "bg-[#C58A32]/10 text-[#C58A32] border-[#C58A32]/20"
                                      : "bg-[#F6F7F4] text-[#18202A] border-[#E4E7E2]"
                                  }`}
                                >
                                  {statuses.map(st => (
                                    <option key={st} value={st}>{st}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <p className="text-xs text-[#18202A] leading-relaxed font-medium">
                              {item.notes}
                            </p>

                            {item.followUpDate && (
                              <div className="pt-2 border-t border-[#E4E7E2] text-[11px] text-[#C58A32] font-mono flex items-center gap-1.5 font-semibold">
                                <Clock className="w-3.5 h-3.5 text-[#C58A32]" />
                                <span>Scheduled Follow-up Date: {item.followUpDate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
