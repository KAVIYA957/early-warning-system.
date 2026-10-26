import React from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export default function WeightConfigurator() {
  return (
    <div className="space-y-6 font-sans text-[#18202A]">
      {/* Page Header */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs flex items-center gap-4">
        <div className="p-3 rounded-xl bg-[#ECEEFA] border border-[#263B8F]/20 text-[#263B8F]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#18202A] tracking-tight">Risk Rules & Methodology</h1>
          <p className="text-xs text-[#68717D] mt-1 font-medium">
            Understand how the system evaluates academic indicators to classify early warning levels.
          </p>
        </div>
      </div>

      {/* 3 Large Rule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rule 01: Attendance */}
        <div className="bg-white rounded-xl border border-[#E4E7E2] p-6 shadow-2xs space-y-4 flex flex-col justify-between hover:border-[#263B8F]/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-extrabold text-[#263B8F] bg-[#ECEEFA] px-2.5 py-1 rounded-md border border-[#263B8F]/20">
                01 ATTENDANCE
              </span>
              <span className="text-sm font-mono font-black text-[#263B8F] bg-[#ECEEFA] px-2.5 py-1 rounded-md">
                +2 points
              </span>
            </div>
            <h2 className="text-base font-extrabold text-[#18202A] tracking-tight">ATTENDANCE BENCHMARK</h2>
            <p className="text-xs text-[#68717D] mt-1 leading-relaxed">
              Monitors overall lecture and lab presence percentage against institutional minimum requirement.
            </p>
          </div>
          <div className="bg-[#F6F7F4] p-4 rounded-xl border border-[#E4E7E2] text-center">
            <span className="text-[10px] text-[#68717D] block uppercase font-bold tracking-wider mb-1">Rule Condition</span>
            <span className="text-lg font-black text-[#C45151] font-mono">Below 75%</span>
          </div>
        </div>

        {/* Rule 02: Assessment */}
        <div className="bg-white rounded-xl border border-[#E4E7E2] p-6 shadow-2xs space-y-4 flex flex-col justify-between hover:border-[#263B8F]/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-extrabold text-[#263B8F] bg-[#ECEEFA] px-2.5 py-1 rounded-md border border-[#263B8F]/20">
                02 ASSESSMENT
              </span>
              <span className="text-sm font-mono font-black text-[#263B8F] bg-[#ECEEFA] px-2.5 py-1 rounded-md">
                +3 points
              </span>
            </div>
            <h2 className="text-base font-extrabold text-[#18202A] tracking-tight">ASSESSMENT BENCHMARK</h2>
            <p className="text-xs text-[#68717D] mt-1 leading-relaxed">
              Evaluates average performance across midterms, quizzes, and recent examination tests.
            </p>
          </div>
          <div className="bg-[#F6F7F4] p-4 rounded-xl border border-[#E4E7E2] text-center">
            <span className="text-[10px] text-[#68717D] block uppercase font-bold tracking-wider mb-1">Rule Condition</span>
            <span className="text-lg font-black text-[#C45151] font-mono">Average below 40%</span>
          </div>
        </div>

        {/* Rule 03: Assignments */}
        <div className="bg-white rounded-xl border border-[#E4E7E2] p-6 shadow-2xs space-y-4 flex flex-col justify-between hover:border-[#263B8F]/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-extrabold text-[#263B8F] bg-[#ECEEFA] px-2.5 py-1 rounded-md border border-[#263B8F]/20">
                03 ASSIGNMENTS
              </span>
              <span className="text-sm font-mono font-black text-[#263B8F] bg-[#ECEEFA] px-2.5 py-1 rounded-md">
                +2 points
              </span>
            </div>
            <h2 className="text-base font-extrabold text-[#18202A] tracking-tight">ASSIGNMENTS THRESHOLD</h2>
            <p className="text-xs text-[#68717D] mt-1 leading-relaxed">
              Tracks unsubmitted coursework, homework tasks, lab assignments, and project deliverables.
            </p>
          </div>
          <div className="bg-[#F6F7F4] p-4 rounded-xl border border-[#E4E7E2] text-center">
            <span className="text-[10px] text-[#68717D] block uppercase font-bold tracking-wider mb-1">Rule Condition</span>
            <span className="text-lg font-black text-[#C45151] font-mono">2 or more missed</span>
          </div>
        </div>
      </div>

      {/* CLASSIFICATION SCALE */}
      <div className="bg-white rounded-xl border border-[#E4E7E2] p-6 shadow-2xs space-y-4">
        <h2 className="text-xs font-bold text-[#18202A] uppercase tracking-wider">Classification Scale (Maximum Total = 7 Points)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#3D8B68]/10 border border-[#3D8B68]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3D8B68]" />
              <div>
                <span className="text-xs font-black text-[#3D8B68] block uppercase">0–1 Points</span>
                <span className="text-sm font-black text-[#3D8B68] font-mono">LOW</span>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#3D8B68]/20 text-[#3D8B68]">Normal</span>
          </div>

          <div className="p-4 rounded-xl bg-[#C58A32]/10 border border-[#C58A32]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#C58A32]" />
              <div>
                <span className="text-xs font-black text-[#C58A32] block uppercase">2–4 Points</span>
                <span className="text-sm font-black text-[#C58A32] font-mono">MEDIUM</span>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#C58A32]/20 text-[#C58A32]">Watch</span>
          </div>

          <div className="p-4 rounded-xl bg-[#C45151]/10 border border-[#C45151]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#C45151]" />
              <div>
                <span className="text-xs font-black text-[#C45151] block uppercase">5–7 Points</span>
                <span className="text-sm font-black text-[#C45151] font-mono">HIGH</span>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#C45151]/20 text-[#C45151]">Intervene</span>
          </div>
        </div>
      </div>

      {/* EXAMPLE CALCULATION */}
      <div className="bg-white rounded-xl border border-[#E4E7E2] p-6 shadow-2xs space-y-4">
        <h2 className="text-xs font-bold text-[#18202A] uppercase tracking-wider">Example Calculation — Rahul Kumar</h2>
        
        <div className="bg-[#F6F7F4] p-4 rounded-xl border border-[#E4E7E2] space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-white rounded-lg border border-[#E4E7E2]">
              <span className="text-[#68717D] font-medium block">Attendance = 38%</span>
              <span className="text-[#18202A] text-[11px]">Below 75% threshold</span>
              <span className="text-[#263B8F] font-extrabold font-mono block mt-1">+2 points</span>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-[#E4E7E2]">
              <span className="text-[#68717D] font-medium block">Assessment = 35%</span>
              <span className="text-[#18202A] text-[11px]">Below 40% threshold</span>
              <span className="text-[#263B8F] font-extrabold font-mono block mt-1">+3 points</span>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-[#E4E7E2]">
              <span className="text-[#68717D] font-medium block">Missed Assignments = 5</span>
              <span className="text-[#18202A] text-[11px]">≥ 2 threshold</span>
              <span className="text-[#263B8F] font-extrabold font-mono block mt-1">+2 points</span>
            </div>
          </div>

          <div className="p-4 bg-[#18202A] text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span>2 + 3 + 2</span>
              <ArrowRight className="w-4 h-4 text-emerald-300" />
              <strong className="text-sm text-white font-extrabold">Total = 7 / 7 Points</strong>
            </div>
            <span className="px-3 py-1 rounded-md bg-[#C45151] font-black text-white text-xs uppercase">
              HIGH ACADEMIC RISK
            </span>
          </div>
        </div>
      </div>

      {/* METHODOLOGY EXPLANATION NOTE */}
      <div className="p-4 rounded-xl bg-[#ECEEFA]/60 border border-[#263B8F]/20 flex items-start gap-3 text-xs text-[#18202A]">
        <Info className="w-5 h-5 text-[#263B8F] shrink-0 mt-0.5" />
        <div>
          <strong className="font-extrabold block mb-0.5 text-[#263B8F]">Prototype Methodology Disclaimer:</strong>
          These prototype thresholds are configurable and intended to demonstrate the early-warning workflow. They are not presented as universal academic standards.
        </div>
      </div>
    </div>
  );
}
