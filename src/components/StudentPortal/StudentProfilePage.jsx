import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, ShieldCheck } from 'lucide-react';

export default function StudentProfilePage() {
  const { currentStudent, currentUser } = useApp();

  const name = currentStudent?.name || currentUser?.name || "Rahul Kumar";
  const rollNo = currentStudent?.rollNo || currentUser?.rollNo || "310624104101";
  const department = currentStudent?.department === "Computer Science" 
    ? "Computer Science & Engineering" 
    : (currentStudent?.department || "Computer Science & Engineering");
  const semesterStr = `${currentStudent?.semester || "Semester 5"}${currentStudent?.section ? ` (${currentStudent.section})` : ""}`;
  const email = currentStudent?.email || currentUser?.email || "rahul.kumar@student.edu";

  return (
    <div className="space-y-6 font-sans text-[#18202A] max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#263B8F] text-white flex items-center justify-center font-bold text-lg shadow-2xs">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#18202A] tracking-tight">{name}</h1>
          <p className="text-xs text-[#68717D] mt-0.5">
            Student Academic Identity & Advisory Profile
          </p>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs space-y-4">
        <h2 className="text-xs font-bold text-[#18202A] uppercase tracking-wider border-b border-[#E4E7E2] pb-3">
          Institutional Student Record
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 bg-[#F6F7F4] rounded-lg border border-[#E4E7E2]">
            <span className="text-[#68717D] text-[11px] font-sans block">Full Name</span>
            <strong className="text-sm font-bold text-[#18202A] font-sans">{name}</strong>
          </div>

          <div className="p-3.5 bg-[#F6F7F4] rounded-lg border border-[#E4E7E2]">
            <span className="text-[#68717D] text-[11px] font-sans block">Roll Number / Student ID</span>
            <strong className="text-sm font-bold text-[#263B8F]">{rollNo}</strong>
          </div>

          <div className="p-3.5 bg-[#F6F7F4] rounded-lg border border-[#E4E7E2]">
            <span className="text-[#68717D] text-[11px] font-sans block">Academic Department</span>
            <strong className="text-sm font-bold text-[#18202A] font-sans">{department}</strong>
          </div>

          <div className="p-3.5 bg-[#F6F7F4] rounded-lg border border-[#E4E7E2]">
            <span className="text-[#68717D] text-[11px] font-sans block">Semester / Section</span>
            <strong className="text-sm font-bold text-[#18202A] font-sans">{semesterStr}</strong>
          </div>

          <div className="p-3.5 bg-[#F6F7F4] rounded-lg border border-[#E4E7E2]">
            <span className="text-[#68717D] text-[11px] font-sans block">Institutional Email</span>
            <strong className="text-xs font-bold text-[#18202A]">{email}</strong>
          </div>

          <div className="p-3.5 bg-[#F6F7F4] rounded-lg border border-[#E4E7E2]">
            <span className="text-[#68717D] text-[11px] font-sans block">System Role</span>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-[#263B8F]/10 text-[#263B8F] border border-[#263B8F]/20 font-bold text-xs font-sans">
              Student
            </span>
          </div>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="p-4 rounded-xl bg-white border border-[#E4E7E2] flex items-start gap-3 text-xs text-[#68717D]">
        <ShieldCheck className="w-5 h-5 text-[#263B8F] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#18202A] font-bold block mb-0.5">
            Student Access Privacy:
          </strong>
          As a registered student, you have access exclusively to your own academic status, attendance metrics, assessment benchmarks, and assigned mentor support information.
        </div>
      </div>
    </div>
  );
}
