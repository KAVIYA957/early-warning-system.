import React from 'react';
import { Settings, ShieldCheck, CheckCircle2, Layers, Info } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header (Title + One-line Description) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">System Information & Prototype Configuration</h1>
            <p className="text-xs text-slate-600 mt-0.5">
              View institutional rule parameters and prototype deployment scope.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Risk Rules */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">1. Risk Rules</h2>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="font-semibold text-slate-800">Rule 1: Attendance &lt; 75%</span>
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">+2 points</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="font-semibold text-slate-800">Rule 2: Assessment Average &lt; 40%</span>
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">+3 points</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="font-semibold text-slate-800">Rule 3: Missed Assignments ≥ 2</span>
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">+2 points</span>
            </div>
          </div>
        </div>

        {/* Section 2: Risk Classification */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-teal-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">2. Risk Classification</h2>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex justify-between items-center">
              <span className="font-bold text-emerald-900">0–1 Points</span>
              <span className="font-bold text-emerald-800 uppercase text-[11px]">Low Risk</span>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex justify-between items-center">
              <span className="font-bold text-amber-900">2–4 Points</span>
              <span className="font-bold text-amber-800 uppercase text-[11px]">Medium Risk</span>
            </div>
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex justify-between items-center">
              <span className="font-bold text-red-900">5–7 Points</span>
              <span className="font-bold text-red-800 uppercase text-[11px]">High Academic Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Prototype Scope */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Layers className="w-5 h-5 text-teal-700" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">3. Prototype Scope</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-teal-800 uppercase text-[11px] block">Currently Implemented</span>
            <ul className="space-y-1 text-slate-700 list-disc list-inside">
              <li>Student academic roster & search</li>
              <li>Rule-based risk scoring engine (0–7 points)</li>
              <li>Faculty decision-support dashboard</li>
              <li>Student academic profile & trend review</li>
              <li>Intervention tracking & follow-up scheduling</li>
              <li>Cohort analytics & alert management</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-600 uppercase text-[11px] block">Future Deployment Scope</span>
            <ul className="space-y-1 text-slate-500 list-disc list-inside">
              <li>Institutionally validated ML model</li>
              <li>ERP / LMS direct database integration</li>
              <li>SSO / OAuth institutional authentication</li>
              <li>Automated email & SMS faculty alerts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 4: Data Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3 text-xs">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">4. Data Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block">Dataset</span>
            <strong className="text-slate-800 text-sm">Mock Demonstration Data</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block">Monitored Cohort</span>
            <strong className="text-slate-800 text-sm">42 Monitored Students</strong>
          </div>
        </div>
      </div>

      {/* Institutional Validation Note */}
      <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-3 text-xs text-teal-900">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-teal-950 block mb-0.5">Configuration Disclaimer:</strong>
          These thresholds are prototype configuration values and should be institutionally validated before real deployment.
        </div>
      </div>
    </div>
  );
}
