import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  TrendingUp,
  User,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';

export default function RahulDemoWalkthrough() {
  const {
    students,
    setSelectedStudentId,
    openRecordModal,
    setRahulDemoStage,
    rahulDemoStage,
    triggerToast
  } = useApp();

  const [isPlaying, setIsPlaying] = useState(false);

  // Find Rahul's current calculated state from Context
  const rahul = students.find(s => s.id === "STU-2026-001");

  const stages = [
    {
      stage: 1,
      title: "Week 1: Baseline",
      risk: "Low Risk",
      badgeColor: "bg-[#3D8B68]/10 text-[#3D8B68] border-[#3D8B68]/20",
      att: "82%",
      assess: "72%",
      assign: "0 missed",
      score: "0 / 7 Pts",
      desc: "Good academic standing. All indicators within benchmarks."
    },
    {
      stage: 2,
      title: "Week 2: Early Warning",
      risk: "Medium Risk",
      badgeColor: "bg-[#C58A32]/10 text-[#C58A32] border-[#C58A32]/20",
      att: "74%",
      assess: "65%",
      assign: "1 missed",
      score: "2 / 7 Pts",
      desc: "Attendance (74%) crossed below 75% benchmark (+2 points)."
    },
    {
      stage: 3,
      title: "Week 3: Escalating Warning",
      risk: "Medium Risk",
      badgeColor: "bg-[#C58A32]/10 text-[#C58A32] border-[#C58A32]/20",
      att: "65%",
      assess: "54%",
      assign: "2 missed",
      score: "4 / 7 Pts",
      desc: "Attendance below threshold (+2) and 2 missed assignments (+2)."
    },
    {
      stage: 4,
      title: "Week 4: High Risk",
      risk: "High Academic Risk",
      badgeColor: "bg-[#C45151]/10 text-[#C45151] border-[#C45151]/20",
      att: "38%",
      assess: "35%",
      assign: "5 missed",
      score: "7 / 7 Pts",
      desc: "Escalation across all 3 rule benchmarks (+2, +3, +2)."
    },
    {
      stage: 6,
      title: "Updated Data (Simulated)",
      risk: "Low Risk",
      badgeColor: "bg-[#3D8B68]/10 text-[#3D8B68] border-[#3D8B68]/20",
      att: "78%",
      assess: "68%",
      assign: "0 missed",
      score: "0 / 7 Pts",
      desc: "Simulated metric update to test rule engine re-evaluation."
    }
  ];

  const handleSelectStage = (stageNum) => {
    setRahulDemoStage(stageNum);
    if (stageNum === 4) {
      triggerToast("Early Warning Alert: Rahul Kumar moved to High Academic Risk tier (7/7 Pts)!", "warning");
    } else if (stageNum === 6) {
      triggerToast("Simulated data update applied: Rahul's indicators re-evaluated by rule engine.", "info");
    }
  };

  const handleOpenProfileAndRecord = () => {
    setSelectedStudentId("STU-2026-001");
    setTimeout(() => {
      openRecordModal("STU-2026-001");
    }, 400);
  };

  const handleAutoPlay = () => {
    setIsPlaying(true);
    triggerToast("Starting automated Early Warning Workflow Demonstration...", "info");

    handleSelectStage(1);

    setTimeout(() => {
      handleSelectStage(2);
    }, 2000);

    setTimeout(() => {
      handleSelectStage(3);
    }, 4000);

    setTimeout(() => {
      handleSelectStage(4);
    }, 6000);

    setTimeout(() => {
      setSelectedStudentId("STU-2026-001");
      triggerToast("Opening Rahul's Academic Profile & Intervention Modal...", "info");
      setTimeout(() => {
        openRecordModal("STU-2026-001");
      }, 500);
    }, 8000);

    setTimeout(() => {
      handleSelectStage(6);
      setIsPlaying(false);
    }, 11000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 text-[#18202A] shadow-2xs border border-[#E4E7E2] relative overflow-hidden my-4 font-sans">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E4E7E2]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#ECEEFA] text-[#263B8F] border border-[#263B8F]/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3 text-[#263B8F]" />
              Interactive Prototype Scenario
            </span>
            <span className="text-xs text-[#68717D] font-mono">Rahul Kumar (Roll: 310624104101)</span>
          </div>
          <h3 className="text-lg font-black text-[#18202A] mt-1 flex items-center gap-2">
            Complete Early Warning & Early Intervention Workflow Scenario
          </h3>
          <p className="text-xs text-[#68717D] max-w-3xl mt-0.5 font-medium">
            Demonstrate how student indicators deteriorate over time (Low → Medium → High Risk), how faculty review contributing factors, record interventions, and observe rule engine response to updated data.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAutoPlay}
            disabled={isPlaying}
            className="px-4 py-2 rounded-xl bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isPlaying ? "Running Demonstration..." : "Auto-Play Demo Workflow"}</span>
          </button>
        </div>
      </div>

      {/* Stepper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {stages.map((stg) => {
          const isActive = (stg.stage === 6 && (rahulDemoStage === 5 || rahulDemoStage === 6)) || stg.stage === rahulDemoStage;

          return (
            <div
              key={stg.stage}
              onClick={() => handleSelectStage(stg.stage)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isActive
                  ? "bg-[#ECEEFA]/70 border-[#263B8F] shadow-2xs ring-2 ring-[#263B8F]/30"
                  : "bg-[#F6F7F4]/60 border-[#E4E7E2] hover:bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-bold text-[#18202A]">{stg.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${stg.badgeColor}`}>
                    {stg.risk}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-[#18202A] font-mono mb-2">
                  <div className="flex justify-between">
                    <span className="text-[#68717D]">Attendance:</span>
                    <span className="font-bold">{stg.att}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68717D]">Assessment:</span>
                    <span className="font-bold">{stg.assess}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68717D]">Assignments:</span>
                    <span className="font-bold">{stg.assign}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#E4E7E2]">
                    <span className="text-[#263B8F] font-semibold">Rule Score:</span>
                    <span className="font-bold">{stg.score}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E4E7E2] flex items-center justify-between text-[11px]">
                <span className="text-[#68717D] text-[10px] leading-tight line-clamp-2">{stg.desc}</span>
                {isActive && (
                  <CheckCircle2 className="w-4 h-4 text-[#263B8F] shrink-0 ml-1" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Demonstration Explanatory Note */}
      <div className="mt-4 p-3 rounded-xl bg-[#F6F7F4] border border-[#E4E7E2] text-[11px] text-[#68717D] flex items-start gap-2">
        <Info className="w-4 h-4 text-[#263B8F] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#18202A] font-bold">Demonstration Note:</strong> Demonstration only. Updated values are simulated to show how the rule engine responds to changing academic indicators. They are not measured intervention outcomes.
        </div>
      </div>

      {/* Action Prompt Banner */}
      <div className="mt-4 pt-3 border-t border-[#E4E7E2] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#68717D]">
          <ShieldCheck className="w-4 h-4 text-[#263B8F] shrink-0" />
          <span>Current Rahul Status: <strong className="text-[#18202A] font-mono">Att: {rahul?.attendance}%</strong> | Score: <strong className="text-[#18202A] font-mono">{rahul?.riskScoreText}</strong> | Tier: <strong className="text-[#263B8F] font-bold">{rahul?.riskLevel === "High Risk" ? "HIGH ACADEMIC RISK" : rahul?.riskLevel}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedStudentId("STU-2026-001")}
            className="px-3 py-1.5 rounded-lg bg-[#F6F7F4] hover:bg-[#E4E7E2] text-[#18202A] border border-[#E4E7E2] text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <User className="w-3.5 h-3.5 text-[#263B8F]" />
            <span>1. Open Rahul's Profile</span>
          </button>

          <button
            onClick={handleOpenProfileAndRecord}
            className="px-3.5 py-1.5 rounded-lg bg-[#263B8F] hover:bg-[#18265F] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-white" />
            <span>2. Record Intervention & Set Follow-up</span>
          </button>

          <button
            onClick={() => handleSelectStage(6)}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E4E7E2] hover:bg-[#F6F7F4] text-[#18202A] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#6FA58A]" />
            <span>3. Simulate Updated Academic Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
