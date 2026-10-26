import React from 'react';
import { useApp } from '../../context/AppContext';
import KPICard from '../UI/KPICard';
import { Users, AlertTriangle, AlertCircle, CheckCircle2, HeartHandshake, Percent } from 'lucide-react';

export default function MetricCards() {
  const { students } = useApp();

  const total = students.length;
  const highRisk = students.filter(s => s.riskLevel === "High Risk").length;
  const mediumRisk = students.filter(s => s.riskLevel === "Medium Risk").length;
  const lowRisk = students.filter(s => s.riskLevel === "Low Risk").length;

  const totalInterventions = students.reduce((acc, s) => acc + (s.interventions ? s.interventions.length : 0), 0);
  const activeInterventions = students.reduce((acc, s) => {
    return acc + (s.interventions ? s.interventions.filter(i => i.status !== "Completed" && i.status !== "Resolved").length : 0);
  }, 0);

  const avgAttendance = total > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / total)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPICard
        title="Monitored Students"
        value={total}
        subtext="Across 5 Departments"
        icon={Users}
        badgeColor="navy"
      />
      <KPICard
        title="High Risk"
        value={highRisk}
        subtext={`${total ? Math.round((highRisk / total) * 100) : 0}% of cohort`}
        icon={AlertTriangle}
        badgeColor="red"
      />
      <KPICard
        title="Medium Risk"
        value={mediumRisk}
        subtext={`${total ? Math.round((mediumRisk / total) * 100) : 0}% of cohort`}
        icon={AlertCircle}
        badgeColor="amber"
      />
      <KPICard
        title="Low Risk / On Track"
        value={lowRisk}
        subtext={`${total ? Math.round((lowRisk / total) * 100) : 0}% of cohort`}
        icon={CheckCircle2}
        badgeColor="green"
      />
      <KPICard
        title="Active Interventions"
        value={activeInterventions}
        subtext={`${totalInterventions} total logged`}
        icon={HeartHandshake}
        badgeColor="teal"
      />
      <KPICard
        title="Campus Avg Att."
        value={`${avgAttendance}%`}
        subtext="Benchmark: 75%"
        icon={Percent}
        badgeColor={avgAttendance >= 75 ? "green" : "amber"}
      />
    </div>
  );
}
