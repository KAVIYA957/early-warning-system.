import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, GraduationCap, Lock, Mail, UserCheck, Activity, Users, FileSpreadsheet, CheckCircle2, User, BookOpen } from 'lucide-react';

export default function LoginScreen() {
  const { login } = useApp();
  const [portalType, setPortalType] = useState("faculty"); // "faculty" | "student"

  // Faculty form state
  const [email, setEmail] = useState("faculty@university.edu");
  const [password, setPassword] = useState("faculty123");
  const [role, setRole] = useState("faculty");

  // Student form state
  const [studentId, setStudentId] = useState("310624104101");
  const [studentPassword, setStudentPassword] = useState("student123");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (portalType === "student") {
      login(studentId, studentPassword, "student");
    } else {
      login(email, password, role);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F4] flex items-center justify-center p-4 sm:p-6 font-sans text-[#18202A] select-none">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-[#E4E7E2]">
        
        {/* Left Side: Sophisticated Academic Signal Journey (7 Cols) */}
        <div className="md:col-span-7 bg-[#F6F7F4] p-8 sm:p-10 text-[#18202A] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E4E7E2] relative overflow-hidden">
          
          {/* Subtle Graphic Signal Line background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
            <svg className="w-full h-full text-[#263B8F]" viewBox="0 0 400 200" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M 0,100 Q 50,30 100,100 T 200,100 T 300,160 T 400,100" />
              <path d="M 0,120 Q 70,150 140,80 T 280,110 T 400,70" strokeDasharray="4 4" />
            </svg>
          </div>

          <div className="relative z-10">
            {/* Brand Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#263B8F] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-[#18202A] uppercase">
                  Early Warning System
                </h1>
                <p className="text-xs text-[#263B8F] font-bold tracking-wide">
                  Academic Risk Monitoring & Early Intervention
                </p>
              </div>
            </div>

            {/* Core Philosophy Tagline */}
            <div className="my-6 space-y-2">
              <h2 className="text-2xl font-black text-[#18202A] tracking-tight leading-tight">
                Notice the signal.<br />
                <span className="text-[#263B8F]">Support the student.</span>
              </h2>
              <p className="text-xs text-[#68717D] leading-relaxed max-w-md font-medium">
                A dual-portal academic workspace: faculty monitor early warning signals while students track indicators and seek mentor support.
              </p>
            </div>

            {/* Abstract Visual Signal Journey */}
            <div className="mt-8 bg-white p-5 rounded-xl border border-[#E4E7E2] shadow-2xs space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#68717D] block tracking-wider mb-2">
                ACADEMIC SIGNAL JOURNEY
              </span>

              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono">
                <div className="p-2 rounded bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A]">
                  <Activity className="w-3.5 h-3.5 text-[#263B8F] mx-auto mb-1" />
                  <span>Attendance</span>
                </div>
                <div className="p-2 rounded bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A]">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#263B8F] mx-auto mb-1" />
                  <span>Assessment</span>
                </div>
                <div className="p-2 rounded bg-[#F6F7F4] border border-[#E4E7E2] text-[#18202A]">
                  <Users className="w-3.5 h-3.5 text-[#263B8F] mx-auto mb-1" />
                  <span>Assignments</span>
                </div>
                <div className="p-2 rounded bg-[#C58A32]/10 border border-[#C58A32]/30 text-[#C58A32] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C58A32] mx-auto mb-1" />
                  <span>Early Signal</span>
                </div>
                <div className="p-2 rounded bg-[#6FA58A]/15 border border-[#6FA58A]/30 text-[#3D8B68] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D8B68] mx-auto mb-1" />
                  <span>Faculty Support</span>
                </div>
              </div>

              {/* Connecting Flow Indicator */}
              <div className="flex items-center justify-between text-[10px] text-[#68717D] pt-2 border-t border-[#E4E7E2]">
                <span>Signal → Review → Action → Follow-up</span>
                <span className="text-[#263B8F] font-bold">Rule Engine v2.4</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 text-[11px] text-[#68717D] mt-8 pt-4 border-t border-[#E4E7E2] flex items-center justify-between">
            <span>Faculty Advisory & Student Portal</span>
            <span>Institutional Support Suite</span>
          </div>
        </div>

        {/* Right Side: Role Selection & Institutional Sign In (5 Cols) */}
        <div className="md:col-span-5 p-8 flex flex-col justify-between bg-white">
          <div>
            {/* Role Switcher Tabs */}
            <div className="mb-5">
              <span className="text-[10px] font-bold text-[#68717D] uppercase tracking-wider block mb-1.5">Select Portal Access</span>
              <div className="grid grid-cols-2 p-1 bg-[#F6F7F4] rounded-xl border border-[#E4E7E2]">
                <button
                  type="button"
                  onClick={() => setPortalType("faculty")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    portalType === "faculty"
                      ? "bg-white text-[#263B8F] shadow-2xs border border-[#E4E7E2]"
                      : "text-[#68717D] hover:text-[#18202A]"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Faculty / Mentor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPortalType("student")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    portalType === "student"
                      ? "bg-white text-[#263B8F] shadow-2xs border border-[#E4E7E2]"
                      : "text-[#68717D] hover:text-[#18202A]"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>
              </div>
            </div>

            {portalType === "faculty" ? (
              <div>
                <div className="mb-5">
                  <h2 className="text-xl font-black text-[#18202A] tracking-tight">Faculty Sign In</h2>
                  <p className="text-xs text-[#68717D] mt-1">Access your monitored student cohort & advisory queue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#18202A] mb-1">Institutional Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68717D]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-[#F6F7F4] border border-[#E4E7E2] rounded-lg pl-9 pr-3 py-2 text-xs text-[#18202A] focus:bg-white focus:ring-2 focus:ring-[#263B8F] outline-none transition-all font-medium"
                        placeholder="faculty@university.edu"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18202A] mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68717D]" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-[#F6F7F4] border border-[#E4E7E2] rounded-lg pl-9 pr-3 py-2 text-xs text-[#18202A] focus:bg-white focus:ring-2 focus:ring-[#263B8F] outline-none transition-all font-medium"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18202A] mb-1">Select Role Context</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#F6F7F4] border border-[#E4E7E2] rounded-lg p-2 text-xs text-[#18202A] font-semibold outline-none focus:ring-2 focus:ring-[#263B8F]"
                    >
                      <option value="faculty">Faculty Member</option>
                      <option value="coordinator">Academic Coordinator</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Sign In to Faculty Portal</span>
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <h2 className="text-xl font-black text-[#18202A] tracking-tight">Student Sign In</h2>
                  <p className="text-xs text-[#68717D] mt-1">Review your personal indicators & mentor support status</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#18202A] mb-1">Student ID / Roll Number</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68717D]" />
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                        className="w-full bg-[#F6F7F4] border border-[#E4E7E2] rounded-lg pl-9 pr-3 py-2 text-xs text-[#18202A] focus:bg-white focus:ring-2 focus:ring-[#263B8F] outline-none transition-all font-mono font-bold"
                        placeholder="e.g. 310624104101"
                      />
                    </div>
                    <span className="text-[10px] text-[#68717D] mt-1 block">
                      Demo Student: <strong>310624104101</strong> (Rahul Kumar)
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18202A] mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68717D]" />
                      <input
                        type="password"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        required
                        className="w-full bg-[#F6F7F4] border border-[#E4E7E2] rounded-lg pl-9 pr-3 py-2 text-xs text-[#18202A] focus:bg-white focus:ring-2 focus:ring-[#263B8F] outline-none transition-all font-medium"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Sign In to Student Portal</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Prototype Quick Access */}
          <div className="mt-8 pt-4 border-t border-[#E4E7E2]">
            <span className="text-[10px] uppercase font-bold text-[#68717D] block mb-2 tracking-wider">
              Prototype Demo Quick Access
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => login("faculty@university.edu", "faculty123", "faculty")}
                className="px-2 py-2 rounded-lg bg-[#F6F7F4] hover:bg-[#E4E7E2] border border-[#E4E7E2] text-[#18202A] text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                title="Sign in as Faculty"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#263B8F]" />
                <span>Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => login("coordinator@university.edu", "coordinator123", "coordinator")}
                className="px-2 py-2 rounded-lg bg-[#F6F7F4] hover:bg-[#E4E7E2] border border-[#E4E7E2] text-[#18202A] text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                title="Sign in as Academic Coordinator"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#263B8F]" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => login("310624104101", "student123", "student")}
                className="px-2 py-2 rounded-lg bg-[#263B8F]/10 hover:bg-[#263B8F]/20 border border-[#263B8F]/30 text-[#263B8F] text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                title="Sign in as Rahul Kumar (Student)"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#263B8F]" />
                <span>Student</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
