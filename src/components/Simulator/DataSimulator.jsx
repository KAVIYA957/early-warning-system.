import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FlaskConical, Play, Upload, RotateCcw } from 'lucide-react';

export default function DataSimulator() {
  const { batchSimulateUpdate, resetStudentsData } = useApp();

  const [simDept, setSimDept] = useState("Computer Science");
  const [simMetric, setSimMetric] = useState("attendance");
  const [simDelta, setSimDelta] = useState(-15);
  const [simNote, setSimNote] = useState("Simulating Week 6 Attendance Drop after Midterm Exam week");

  const depts = ["ALL", "Computer Science", "Electrical Engineering", "Mechanical Engineering", "Business & Management", "Data Science"];

  const handleRunSimulation = (e) => {
    e.preventDefault();
    batchSimulateUpdate(simDept, simMetric, simDelta);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Batch Data Ingestion & Risk Simulator</h2>
            <p className="text-xs text-slate-500">Simulate incoming academic updates (attendance logs, quiz scores) to see live Early Warning System response</p>
          </div>
        </div>

        <button
          onClick={resetStudentsData}
          type="button"
          className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          <span>Reset Cohort to Baseline</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation Control Card */}
        <form onSubmit={handleRunSimulation} className="bg-white border border-slate-200 rounded-lg p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-700" />
              <span>Configure Data Update Event</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">Live Processing Engine</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select Target Department / Cohort</label>
              <select
                value={simDept}
                onChange={(e) => setSimDept(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-md p-2 text-xs focus:ring-1 focus:ring-teal-700 outline-none"
              >
                {depts.map(d => (
                  <option key={d} value={d}>{d === "ALL" ? "All Campus Departments" : d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select Indicator Metric to Update</label>
              <select
                value={simMetric}
                onChange={(e) => setSimMetric(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-md p-2 text-xs focus:ring-1 focus:ring-teal-700 outline-none"
              >
                <option value="attendance">Attendance Rate (%)</option>
                <option value="assessmentAvg">Assessment Exam Average (%)</option>
                <option value="assignmentCompletion">Assignment Submission Rate (%)</option>
                <option value="engagementIndex">LMS Platform Engagement Index</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Value Adjustment Shift: <strong className="text-teal-800 font-mono text-sm">{simDelta > 0 ? `+${simDelta}` : simDelta}%</strong>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={simDelta}
                  onChange={(e) => setSimDelta(parseInt(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span className="text-red-700 font-bold">-30% (Severe Drop)</span>
                <span>0% (No Change)</span>
                <span className="text-emerald-700 font-bold">+30% (Improvement)</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Simulation Context / Audit Note</label>
              <input
                type="text"
                value={simNote}
                onChange={(e) => setSimNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-md p-2 text-xs outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Execute Batch Ingestion Simulation</span>
          </button>
        </form>

        {/* Quick Presets */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Quick Preset Academic Scenarios
          </h3>

          <div className="space-y-3 text-xs">
            <button
              onClick={() => {
                setSimDept("Computer Science");
                setSimMetric("attendance");
                setSimDelta(-15);
                batchSimulateUpdate("Computer Science", "attendance", -15);
              }}
              className="w-full p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 text-left transition-all group"
            >
              <div className="flex items-center justify-between font-bold text-red-700">
                <span>📉 Post-Exam Attendance Slump</span>
                <span className="text-[10px] font-mono bg-red-100 px-2 py-0.5 rounded border border-red-200 text-red-800">-15% CS Att</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">Simulates students skipping lectures after midterm week in CS.</p>
            </button>

            <button
              onClick={() => {
                setSimDept("Electrical Engineering");
                setSimMetric("assessmentAvg");
                setSimDelta(-20);
                batchSimulateUpdate("Electrical Engineering", "assessmentAvg", -20);
              }}
              className="w-full p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 text-left transition-all group"
            >
              <div className="flex items-center justify-between font-bold text-red-700">
                <span>⚠️ Difficult Quiz Result Import</span>
                <span className="text-[10px] font-mono bg-red-100 px-2 py-0.5 rounded border border-red-200 text-red-800">-20% EE Marks</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">Simulates low test average on Circuits II quiz triggering assessment warning signals.</p>
            </button>

            <button
              onClick={() => {
                setSimDept("ALL");
                setSimMetric("attendance");
                setSimDelta(15);
                batchSimulateUpdate("ALL", "attendance", 15);
              }}
              className="w-full p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 text-left transition-all group"
            >
              <div className="flex items-center justify-between font-bold text-emerald-800">
                <span>📈 Post-Intervention Recovery</span>
                <span className="text-[10px] font-mono bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 text-emerald-900">+15% Att Campus-Wide</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">Simulates overall improvement following mentor outreach.</p>
            </button>

            <button
              onClick={resetStudentsData}
              type="button"
              className="w-full p-3.5 rounded-lg bg-slate-50 border border-dashed border-slate-300 hover:border-slate-400 text-left transition-all group"
            >
              <div className="flex items-center justify-between font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Restore Initial Baseline Cohort</span>
                </span>
                <span className="text-[10px] font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-700">Reset All</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Clears local simulations & returns all 42 students to original records.</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
