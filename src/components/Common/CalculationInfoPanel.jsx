import React, { useState } from 'react';
import { HelpCircle, X, Sliders, ShieldCheck } from 'lucide-react';

export default function CalculationInfoPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-xs"
        title="Understand how student risk scores are calculated"
      >
        <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
        <span>How Risk Is Calculated</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-teal-700 text-white">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">How Academic Risk Is Calculated</h3>
                  <p className="text-[11px] text-slate-300">Prototype rule-based academic risk scoring logic</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800 bg-slate-50/40">
              
              {/* Directive 7: Prototype Disclaimer Box */}
              <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-950 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-teal-950">PROTOTYPE RULE-BASED RISK INDICATOR:</strong>
                  <p className="text-[11px] text-teal-900 mt-0.5 leading-relaxed">
                    Prototype risk indicator based on configurable academic thresholds. Intended to support faculty review, not replace professional judgement.
                  </p>
                </div>
              </div>

              {/* Directive 5: Three Core Rules Panel */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 shadow-xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">
                  1. Core Prototype Point Rules (0 to 7 Risk Points)
                </h4>

                <div className="space-y-2 text-xs">
                  {/* Rule 1 */}
                  <div className="p-3 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Rule 1 — Attendance Benchmark</span>
                      <span className="text-[11px] text-slate-600">If student attendance rate is below 75%</span>
                    </div>
                    <span className="font-mono font-bold px-2.5 py-1 rounded bg-red-100 text-red-800 border border-red-200 text-xs shrink-0">
                      +2 Risk Points
                    </span>
                  </div>

                  {/* Rule 2 */}
                  <div className="p-3 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Rule 2 — Assessment Benchmark</span>
                      <span className="text-[11px] text-slate-600">If recent test/assessment average is below 40%</span>
                    </div>
                    <span className="font-mono font-bold px-2.5 py-1 rounded bg-red-100 text-red-800 border border-red-200 text-xs shrink-0">
                      +3 Risk Points
                    </span>
                  </div>

                  {/* Rule 3 */}
                  <div className="p-3 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Rule 3 — Missing Coursework Benchmark</span>
                      <span className="text-[11px] text-slate-600">If missed assignments count is 2 or more (≥ 2)</span>
                    </div>
                    <span className="font-mono font-bold px-2.5 py-1 rounded bg-red-100 text-red-800 border border-red-200 text-xs shrink-0">
                      +2 Risk Points
                    </span>
                  </div>
                </div>

                {/* Point Classification Tiers */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-900 block text-[11px] mb-2 uppercase tracking-wider">Classification Tiers:</span>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      🟢 Low Risk: 0 – 1 Points
                    </div>
                    <div className="p-2.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                      🟡 Medium Risk: 2 – 4 Points
                    </div>
                    <div className="p-2.5 rounded bg-red-50 text-red-800 border border-red-200 font-semibold">
                      🔴 High Risk: 5 – 7 Points
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Close */}
            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-all shadow-xs"
              >
                Close Explanation Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
