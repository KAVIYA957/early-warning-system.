import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  CheckCircle2,
  Filter,
  Eye,
  ArrowRight
} from 'lucide-react';

export default function NotificationsPage() {
  const { students, setSelectedStudentId } = useApp();
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [readAlertIds, setReadAlertIds] = useState(new Set());
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamically derive actionable alerts directly from the student dataset
  const generatedAlerts = [];
  let alertCounter = 1;

  students.forEach(student => {
    // 1. High Academic Risk alert
    if (student.riskLevel === "High Risk" || student.riskLevel === "High Academic Risk") {
      generatedAlerts.push({
        id: `ALT-${String(alertCounter++).padStart(3, '0')}`,
        date: "2026-09-24",
        time: "09:00 AM",
        studentName: student.name,
        rollNo: student.rollNo,
        studentId: student.id,
        whatHappened: "Multiple academic warning signals detected.",
        whyItMatters: `Attendance has fallen below the 75% benchmark and assessment performance is currently below the 40% configured threshold (${student.riskScore}/7 points).`,
        whatCanIDo: "Review student profile, inspect risk factor breakdown, and schedule an academic counselling dialogue.",
        severity: "Critical",
        category: "Risk Escalation"
      });
    }

    // 2. Attendance threshold alert
    if (student.attendance < 75 && !(student.riskLevel === "High Risk" || student.riskLevel === "High Academic Risk")) {
      generatedAlerts.push({
        id: `ALT-${String(alertCounter++).padStart(3, '0')}`,
        date: "2026-09-23",
        time: "10:30 AM",
        studentName: student.name,
        rollNo: student.rollNo,
        studentId: student.id,
        whatHappened: `Attendance dropped below benchmark (${student.attendance}% < 75%).`,
        whyItMatters: "Crossed the minimum attendance threshold (+2 risk points added).",
        whatCanIDo: "Monitor weekly presence and issue an early advisory reminder.",
        severity: "Warning",
        category: "Attendance Threshold"
      });
    }

    // 3. Intervention follow-up alert
    if (student.interventions) {
      student.interventions.forEach(item => {
        if (item.status === "Follow-up Required") {
          generatedAlerts.push({
            id: `ALT-${String(alertCounter++).padStart(3, '0')}`,
            date: item.followUpDate || "2026-09-30",
            time: "02:00 PM",
            studentName: student.name,
            rollNo: student.rollNo,
            studentId: student.id,
            whatHappened: `Follow-up review due for ${item.type}.`,
            whyItMatters: `Scheduled advisory follow-up is pending review for ${student.name}.`,
            whatCanIDo: "Open intervention record and log updated dialogue progress or resolution.",
            severity: "Warning",
            category: "Follow-up Due"
          });
        }
      });
    }
  });

  const filteredAlerts = generatedAlerts.filter(alert => {
    if (severityFilter !== "ALL" && alert.severity !== severityFilter) return false;
    return true;
  });

  // Progressive disclosure math (5 initial visible)
  const visibleAlerts = isExpanded ? filteredAlerts : filteredAlerts.slice(0, 5);
  const remainingCount = filteredAlerts.length - 5;

  const toggleReadStatus = (id) => {
    setReadAlertIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const markAllAsRead = () => {
    setReadAlertIds(new Set(generatedAlerts.map(a => a.id)));
  };

  return (
    <div className="space-y-6 font-sans text-[#18202A]">
      {/* Page Header */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#C45151]/10 border border-[#C45151]/20 text-[#C45151]">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#18202A] tracking-tight">Academic Alerts & Action Center</h1>
            <p className="text-xs text-[#68717D] mt-0.5">
              Actionable early-warning signals explaining what happened, why it matters, and recommended faculty actions.
            </p>
          </div>
        </div>

        <button
          onClick={markAllAsRead}
          className="px-3.5 py-2 rounded-xl bg-[#F6F7F4] hover:bg-[#E4E7E2] text-[#18202A] border border-[#E4E7E2] text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4 text-[#3D8B68]" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#263B8F]" />
          <span className="text-[#18202A] font-bold uppercase text-[11px]">Filter Severity:</span>
          
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setIsExpanded(false);
            }}
            className="bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A] rounded-md px-3 py-1 text-xs outline-none font-medium"
          >
            <option value="ALL">All Severities ({generatedAlerts.length})</option>
            <option value="Critical">Critical ({generatedAlerts.filter(a => a.severity === "Critical").length})</option>
            <option value="Warning">Warning ({generatedAlerts.filter(a => a.severity === "Warning").length})</option>
            <option value="Info">Info ({generatedAlerts.filter(a => a.severity === "Info").length})</option>
          </select>
        </div>

        <div className="text-xs text-[#68717D] font-medium">
          Showing <strong className="text-[#18202A]">{visibleAlerts.length}</strong> of <strong className="text-[#18202A]">{filteredAlerts.length}</strong> actionable alerts
        </div>
      </div>

      {/* Notifications List (Renders initial 5 visible) */}
      <div className="space-y-4">
        {visibleAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#E4E7E2] text-[#68717D] text-xs font-medium">
            No academic alerts match the selected severity filter.
          </div>
        ) : (
          visibleAlerts.map((alert) => {
            const isRead = readAlertIds.has(alert.id);

            let borderClass = "border-l-4 border-l-[#C45151] bg-[#C45151]/5";
            let badgeClass = "bg-[#C45151]/10 text-[#C45151] border-[#C45151]/20";
            let Icon = AlertTriangle;

            if (alert.severity === "Warning") {
              borderClass = "border-l-4 border-l-[#C58A32] bg-[#C58A32]/5";
              badgeClass = "bg-[#C58A32]/10 text-[#C58A32] border-[#C58A32]/20";
              Icon = AlertCircle;
            } else if (alert.severity === "Info") {
              borderClass = "border-l-4 border-l-[#263B8F] bg-[#ECEEFA]/50";
              badgeClass = "bg-[#ECEEFA] text-[#263B8F] border-[#263B8F]/20";
              Icon = Info;
            }

            return (
              <div
                key={alert.id}
                className={`bg-white border border-[#E4E7E2] rounded-xl p-5 shadow-2xs transition-all hover:border-[#263B8F]/30 ${borderClass} ${
                  isRead ? "opacity-60" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left Info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className={`p-2.5 rounded-xl shrink-0 border ${badgeClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold border ${badgeClass}`}>
                          {alert.severity}
                        </span>
                        <h3 className="text-sm font-black text-[#18202A]">{alert.studentName}</h3>
                        <span className="text-xs text-[#68717D] font-mono">({alert.rollNo})</span>
                      </div>

                      {/* 3 Question Structure */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                        <div className="p-2.5 rounded-lg bg-[#F6F7F4] border border-[#E4E7E2]">
                          <span className="text-[10px] uppercase font-bold text-[#68717D] block mb-0.5">What happened?</span>
                          <span className="text-[#18202A] font-bold block">{alert.whatHappened}</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-[#F6F7F4] border border-[#E4E7E2]">
                          <span className="text-[10px] uppercase font-bold text-[#68717D] block mb-0.5">Why does it matter?</span>
                          <span className="text-[#68717D] font-medium block">{alert.whyItMatters}</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-[#ECEEFA]/60 border border-[#263B8F]/20">
                          <span className="text-[10px] uppercase font-bold text-[#263B8F] block mb-0.5">What can I do?</span>
                          <span className="text-[#18202A] font-bold block">{alert.whatCanIDo}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-[#68717D] pt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#68717D]" />
                          {alert.date}
                        </span>
                        <span>•</span>
                        <span>Category: <strong>{alert.category}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E4E7E2]">
                    <button
                      onClick={() => toggleReadStatus(alert.id)}
                      className="text-xs text-[#68717D] hover:text-[#18202A] font-medium underline"
                    >
                      {isRead ? "Mark Unread" : "Mark Read"}
                    </button>

                    {alert.studentId && (
                      <button
                        onClick={() => setSelectedStudentId(alert.studentId)}
                        className="px-3.5 py-2 rounded-xl bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review Student</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}

        {/* Progressive Disclosure Expand / Collapse Control */}
        {filteredAlerts.length > 5 && (
          <div className="py-3 text-center bg-white rounded-xl border border-[#E4E7E2] shadow-2xs">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-mono font-bold text-[#263B8F] hover:text-[#18265F] inline-flex items-center gap-1.5 transition-all"
            >
              <span>{isExpanded ? "Show fewer alerts ↑" : `View ${remainingCount} more alerts ↓`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
