import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, PlusCircle, CheckCircle2 } from 'lucide-react';

function RecordInterventionModalContent() {
  const {
    students,
    mentors,
    recordModalStudentId,
    closeRecordModal,
    addIntervention,
    setActiveTab,
    setSelectedStudentId
  } = useApp();

  const priorityStudents = students.filter(s => s.riskLevel === "High Risk" || s.riskLevel === "Medium Risk");
  const initialStudentId = recordModalStudentId || (priorityStudents.length > 0 ? priorityStudents[0].id : (students[0]?.id || ""));

  const [studentId, setStudentId] = useState(initialStudentId);
  const [type, setType] = useState("Academic Counselling");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mentorId, setMentorId] = useState("M1");
  const [observation, setObservation] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState("Follow-up Required");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !observation.trim()) return;

    await addIntervention(studentId, {
      type,
      date,
      mentorId,
      notes: `${observation} | Action Taken: ${actionTaken || "Scheduled advisory review"}`,
      observation,
      actionTaken,
      followUpDate,
      status,
      actionItems: [actionTaken || "Advisory follow-up session", `Follow-up date: ${followUpDate}`]
    });

    setObservation("");
    setActionTaken("");
    closeRecordModal();
    setSelectedStudentId(null);
    setActiveTab("interventions");
  };

  const selectedStudent = students.find(s => s.id === studentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-slate-800 text-xs">
        
        {/* Modal Top Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-teal-700 text-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Record Academic Intervention</h3>
              <p className="text-[11px] text-slate-300">Log advisory observations, action taken, and follow-up commitments</p>
            </div>
          </div>
          <button
            onClick={closeRecordModal}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 bg-slate-50/40 flex-1">
          
          {/* 1. Student Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Target Student</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 rounded-md p-2 text-xs focus:ring-1 focus:ring-teal-700 font-medium outline-none"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo}) — {s.department} [{s.riskLevel}]
                </option>
              ))}
            </select>
            {selectedStudent && (
              <div className="mt-1 text-[11px] text-slate-500 font-medium flex items-center gap-2">
                <span>Current Risk Level: <strong className={selectedStudent.riskLevel === "High Risk" ? "text-red-700" : "text-amber-700"}>{selectedStudent.riskLevel} ({selectedStudent.riskScore}/100)</strong></span>
                <span>•</span>
                <span>Attendance: <strong>{selectedStudent.attendance}%</strong></span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 2. Intervention Type */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Intervention Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-md p-2 text-xs focus:ring-1 focus:ring-teal-700 font-medium outline-none"
              >
                <option value="Academic Counselling">Academic Counselling</option>
                <option value="Attendance Discussion">Attendance Discussion</option>
                <option value="Assignment Support">Assignment Support</option>
                <option value="Subject Mentoring">Subject Mentoring</option>
                <option value="Parent/Guardian Communication">Parent/Guardian Communication</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* 3. Date */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Intervention Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-md p-2 text-xs focus:ring-1 focus:ring-teal-700 font-mono outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 4. Faculty / Mentor */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Responsible Faculty / Mentor</label>
              <select
                value={mentorId}
                onChange={(e) => setMentorId(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-md p-2 text-xs focus:ring-1 focus:ring-teal-700 font-medium outline-none"
              >
                {mentors.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.department})</option>
                ))}
              </select>
            </div>

            {/* 5. Follow-up Status */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-md p-2 text-xs focus:ring-1 focus:ring-teal-700 font-bold text-teal-800 outline-none"
              >
                <option value="Follow-up Required">Follow-up Required</option>
                <option value="Open">Open</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* 6. Observation */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Faculty Observation</label>
            <textarea
              rows={2}
              placeholder="Detail specific observations (e.g., student reported illness during midterm week, missed 3 labs)..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              required
              className="w-full bg-white border border-slate-300 text-slate-900 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-teal-700 outline-none placeholder-slate-400"
            />
          </div>

          {/* 7. Action Taken */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Action Taken / Agreed Next Steps</label>
            <textarea
              rows={2}
              placeholder="Describe action taken (e.g., issued attendance pledge contract, assigned peer tutor for Circuits II)..."
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-teal-700 outline-none placeholder-slate-400"
            />
          </div>

          {/* 8. Follow-up Date */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Scheduled Follow-up Date</label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 rounded-md p-2 text-xs focus:ring-1 focus:ring-teal-700 font-mono outline-none"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={closeRecordModal}
              className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Record Intervention</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RecordInterventionModal() {
  const { isRecordModalOpen, recordModalStudentId } = useApp();
  if (!isRecordModalOpen) return null;
  return <RecordInterventionModalContent key={recordModalStudentId || 'default'} />;
}
