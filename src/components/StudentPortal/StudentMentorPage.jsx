import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  Clock,
  Mail,
  Building,
  CheckCircle2,
  Send,
  MessageSquare,
  Info
} from 'lucide-react';

export default function StudentMentorPage() {
  const { currentStudent, triggerToast, submitSupportRequest } = useApp();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestNote, setRequestNote] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Extract verified intervention record from student data (excluding private faculty notes)
  const interventions = currentStudent?.interventions || [];
  const latestIntervention = interventions.length > 0 ? interventions[0] : null;
  const supportStatus = latestIntervention?.status || "Follow-up Required";
  const interventionDate = latestIntervention?.date || "2026-09-10";
  const interventionType = latestIntervention?.type || "Academic Counselling";
  const actionItems = latestIntervention?.actionItems || [
    "Attendance contract (min 80%)",
    "Remedial assignment submission"
  ];
  const lastReviewed = currentStudent?.lastReviewed || "2026-09-18";

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setRequestSubmitted(true);
    try {
      if (submitSupportRequest) {
        await submitSupportRequest(requestNote);
      } else {
        triggerToast("Your request has been recorded for mentor follow-up.", "success");
      }
    } catch {
      // Handled in submitSupportRequest
    }
    setTimeout(() => {
      setIsRequestModalOpen(false);
      setRequestSubmitted(false);
      setRequestNote("");
    }, 2000);
  };

  return (
    <div className="space-y-6 font-sans text-[#18202A] max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-[#263B8F]/10 border border-[#263B8F]/20 text-[#263B8F]">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#18202A] tracking-tight">Mentor Support</h1>
            <p className="text-xs text-[#68717D] mt-0.5">
              Connect with your assigned faculty advisor and review scheduled academic support records.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Request Mentor Support</span>
        </button>
      </div>

      {/* Mentor Profile & Contact Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mentor Card */}
        <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs space-y-4 md:col-span-1">
          <span className="text-[10px] font-mono font-bold text-[#68717D] uppercase tracking-wider block">
            ASSIGNED FACULTY MENTOR
          </span>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#263B8F] text-white flex items-center justify-center font-bold text-base shadow-2xs">
              FM
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#18202A]">Assigned Faculty Mentor</h2>
              <span className="text-xs text-[#68717D] block">Department Advisory Committee</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs pt-3 border-t border-[#E4E7E2]">
            <div className="flex items-center gap-2 text-[#68717D]">
              <Building className="w-3.5 h-3.5 text-[#263B8F] shrink-0" />
              <span>{currentStudent?.department || "Computer Science & Engineering"}</span>
            </div>
            <div className="flex items-center gap-2 text-[#68717D]">
              <Mail className="w-3.5 h-3.5 text-[#263B8F] shrink-0" />
              <span>advisory.cse@university.edu</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="w-full py-2 rounded-lg bg-[#F6F7F4] hover:bg-[#E4E7E2] border border-[#E4E7E2] text-[#18202A] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Message Faculty Advisor</span>
            </button>
          </div>
        </div>

        {/* Support Schedule & Verified Milestone Tracking */}
        <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs space-y-5 md:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E4E7E2] pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-[#18202A]">
                Advisory Support Status
              </h2>
              <p className="text-xs text-[#68717D] mt-0.5">
                Verified advisory milestone records from institutional student record.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#C58A32]/10 text-[#C58A32] border border-[#C58A32]/20 font-mono">
              {supportStatus}
            </span>
          </div>

          {/* Structured Verified Milestones (Excluding private faculty comments) */}
          <div className="space-y-3 text-xs">
            {/* Milestone 1: Department Review */}
            <div className="p-4 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3D8B68]" />
                  <span className="font-bold text-[#18202A]">Department Academic Review</span>
                </div>
                <p className="text-[11px] text-[#68717D]">
                  Academic indicator review conducted by faculty advisory committee.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#68717D] self-start sm:self-auto bg-white px-2 py-1 rounded border border-[#E4E7E2]">
                {lastReviewed}
              </span>
            </div>

            {/* Milestone 2: Advisory Session */}
            <div className="p-4 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3D8B68]" />
                  <span className="font-bold text-[#18202A]">{interventionType}</span>
                </div>
                <p className="text-[11px] text-[#68717D]">
                  Advisory dialogue with assigned faculty mentor. Rebuilding plan outlined.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#68717D] self-start sm:self-auto bg-white px-2 py-1 rounded border border-[#E4E7E2]">
                {interventionDate}
              </span>
            </div>

            {/* Milestone 3: Support Status */}
            <div className="p-4 rounded-xl bg-[#ECEEFA]/70 border border-[#263B8F]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#263B8F]" />
                  <span className="font-bold text-[#263B8F]">Follow-up Status</span>
                </div>
                <p className="text-[11px] text-[#18202A]">
                  Scheduled ongoing advisory review of attendance rate and assignment submissions.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#263B8F] self-start sm:self-auto bg-white px-2.5 py-1 rounded border border-[#263B8F]/20">
                {supportStatus}
              </span>
            </div>
          </div>

          {/* Agreed Action Objectives (strictly from actionItems in dataset) */}
          <div className="p-4 rounded-xl bg-white border border-[#E4E7E2] space-y-2">
            <span className="text-[11px] font-bold text-[#18202A] uppercase tracking-wider block">
              Agreed Advisory Action Items
            </span>
            <ul className="text-xs text-[#68717D] space-y-1.5 list-disc list-inside">
              {actionItems.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Advisory Guidance & Prototype Notice */}
      <div className="p-4 rounded-xl bg-[#ECEEFA]/60 border border-[#263B8F]/20 flex items-start gap-3 text-xs text-[#18202A]">
        <Info className="w-5 h-5 text-[#263B8F] shrink-0 mt-0.5" />
        <div>
          <strong className="font-extrabold text-[#263B8F] block mb-0.5">
            Advisory Confidentiality & Scope Note:
          </strong>
          Mentor dialogues and advisory meetings are focused on providing personalized academic assistance. In this prototype, requests and follow-up actions are maintained in local demonstration state. Internal faculty logs are kept confidential.
        </div>
      </div>

      {/* Request Support Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E4E7E2] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E4E7E2] pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#263B8F]" />
                <h3 className="text-sm font-bold text-[#18202A]">Request Mentor Support</h3>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="text-xs text-[#68717D] hover:text-[#18202A] font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {requestSubmitted ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#3D8B68]/10 text-[#3D8B68] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#18202A]">Support Request Recorded</h4>
                <p className="text-xs text-[#68717D]">
                  Your request has been recorded for mentor follow-up. This demonstration prototype logs your request in local session state.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#18202A] font-bold mb-1">
                    Recipient Faculty Mentor
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`Assigned Faculty Mentor (${currentStudent?.department || "Computer Science & Engineering"})`}
                    className="w-full bg-[#F6F7F4] border border-[#E4E7E2] text-[#68717D] rounded-lg p-2.5 text-xs font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[#18202A] font-bold mb-1">
                    Optional Note / Message (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                    placeholder="Enter an optional message or question for your faculty mentor..."
                    className="w-full bg-[#F6F7F4] border border-[#E4E7E2] rounded-lg p-3 text-xs text-[#18202A] focus:bg-white focus:ring-2 focus:ring-[#263B8F] outline-none"
                  />
                  <span className="text-[11px] text-[#68717D] block mt-1">
                    You may leave this blank if you just want to request a routine follow-up meeting.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E4E7E2]">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-[#F6F7F4] hover:bg-[#E4E7E2] text-[#18202A] font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#263B8F] hover:bg-[#18265F] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Support Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
