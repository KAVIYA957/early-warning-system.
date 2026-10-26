import React from 'react';
import { useApp } from '../../context/AppContext';
import ChartCard from '../UI/ChartCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';

export default function RiskOverviewChart() {
  const { students } = useApp();

  const highRiskCount = students.filter(s => s.riskLevel === "High Risk").length;
  const mediumRiskCount = students.filter(s => s.riskLevel === "Medium Risk").length;
  const lowRiskCount = students.filter(s => s.riskLevel === "Low Risk").length;

  const pieData = [
    { name: 'High Risk', value: highRiskCount, color: '#dc2626' }, // Red ONLY for High Risk
    { name: 'Medium Risk', value: mediumRiskCount, color: '#d97706' }, // Amber for Medium Risk
    { name: 'Low Risk', value: lowRiskCount, color: '#16a34a' }, // Green for Low Risk
  ];

  const factorCounts = {
    "Low Attendance": 0,
    "Falling Assessment Marks": 0,
    "Missing Coursework": 0,
    "Low Engagement": 0,
    "Declining Trend": 0
  };

  students.forEach(s => {
    s.factors.forEach(f => {
      if (f.category === "Attendance") factorCounts["Low Attendance"]++;
      if (f.category === "Assessment") factorCounts["Falling Assessment Marks"]++;
      if (f.category === "Assignments") factorCounts["Missing Coursework"]++;
      if (f.category === "Engagement") factorCounts["Low Engagement"]++;
      if (f.category === "Performance Trend") factorCounts["Declining Trend"]++;
    });
  });

  const barData = Object.keys(factorCounts).map(key => ({
    factor: key,
    count: factorCounts[key]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Risk Distribution Donut */}
      <ChartCard
        title="Cohort Risk Distribution"
        subtitle={`${students.length} Total Monitored Students`}
        icon={PieIcon}
      >
        <div className="h-56 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '6px', color: '#0f172a', fontSize: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 pt-3 border-t border-slate-100 text-xs">
          {pieData.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 font-medium">{item.name}:</span>
              <span className="text-slate-900 font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Top Warning Signals Bar Chart */}
      <ChartCard
        title="Major Warning Signals Triggered"
        subtitle="Quantitative Evidence Count Across Cohort"
        icon={BarChart3}
      >
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={11} />
              <YAxis dataKey="factor" type="category" stroke="#64748b" fontSize={11} width={130} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '6px', color: '#0f172a', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#0f766e" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-slate-100">
          *Identified by composite criteria (Attendance &lt; 75%, Quiz &lt; 60%, Missing Work &gt; 1)
        </div>
      </ChartCard>
    </div>
  );
}
