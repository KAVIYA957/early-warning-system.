import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Building2,
  TrendingUp,
  FileSpreadsheet,
  HeartHandshake,
  Users,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function AnalyticsPage() {
  const { students } = useApp();
  const cohortSize = students.length;

  // 1. Chart 1: Cohort Risk Level Distribution (Semantic Palette)
  const highCount = students.filter(s => s.riskLevel === "High Risk" || s.riskLevel === "High Academic Risk").length;
  const medCount = students.filter(s => s.riskLevel === "Medium Risk").length;
  const lowCount = students.filter(s => s.riskLevel === "Low Risk").length;

  const riskPieData = [
    { name: 'Low Risk (0–1 pts)', value: lowCount, color: '#3D8B68' },
    { name: 'Medium Risk (2–4 pts)', value: medCount, color: '#C58A32' },
    { name: 'High Academic Risk (5–7 pts)', value: highCount, color: '#C45151' },
  ];

  // 2. Chart 2: Risk Levels by Department
  const departments = ["Computer Science & Engineering", "Electrical Engineering", "Mechanical Engineering", "Business & Management", "Data Science"];
  const riskByDeptData = departments.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    return {
      department: dept.replace(" Engineering", "").replace(" & Management", "").replace(" & ", " "),
      High: deptStudents.filter(s => s.riskLevel === "High Risk" || s.riskLevel === "High Academic Risk").length,
      Medium: deptStudents.filter(s => s.riskLevel === "Medium Risk").length,
      Low: deptStudents.filter(s => s.riskLevel === "Low Risk").length,
    };
  });

  // 3. Chart 3: Average Attendance Trend (Indigo `#263B8F` + Red Benchmark `#C45151`)
  const attendanceTrendData = [
    { period: 'Week 1', avgAttendance: 82, benchmark: 75 },
    { period: 'Week 2', avgAttendance: 79, benchmark: 75 },
    { period: 'Week 3', avgAttendance: 74, benchmark: 75 },
    { period: 'Week 4', avgAttendance: 68, benchmark: 75 },
  ];

  // 4. Chart 4: Average Assessment Trend (Slate Indigo `#6F7FAF` + Amber Benchmark `#C58A32`)
  const assessmentTrendData = [
    { assessment: 'Assessment 1', averageScore: 74, benchmark: 40 },
    { assessment: 'Assessment 2', averageScore: 68, benchmark: 40 },
    { assessment: 'Assessment 3', averageScore: 58, benchmark: 40 },
    { assessment: 'Assessment 4', averageScore: 52, benchmark: 40 },
  ];

  // 5. Chart 5: Intervention Follow-up Status
  let openCount = 0;
  let followUpRequiredCount = 0;
  let resolvedCount = 0;

  students.forEach(s => {
    if (s.interventions) {
      s.interventions.forEach(i => {
        if (i.status === "Follow-up Required") followUpRequiredCount++;
        else if (i.status === "Completed" || i.status === "Resolved") resolvedCount++;
        else openCount++;
      });
    }
  });

  const interventionStatusData = [
    { category: 'Intervention Status', 'Follow-up Required': followUpRequiredCount, 'Open Cases': openCount, 'Resolved': resolvedCount }
  ];

  return (
    <div className="space-y-6 font-sans text-[#18202A]">
      {/* Page Header */}
      <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#ECEEFA] border border-[#263B8F]/20 text-[#263B8F]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#18202A] tracking-tight">Cohort Analytics Workspace</h1>
            <p className="text-xs text-[#68717D] mt-0.5">
              Review systemic patterns in attendance, assessment performance, department distribution, and advisory outcomes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#263B8F] text-white font-mono text-xs shadow-2xs font-bold">
          <Users className="w-4 h-4 text-emerald-300" />
          <span>{cohortSize} Monitored Students</span>
        </div>
      </div>

      {/* QUESTION 1 & 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Cohort Risk Distribution */}
        <div className="bg-white rounded-xl border border-[#E4E7E2] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#263B8F] mb-1">
              <HelpCircle className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Question 1</span>
            </div>
            <h2 className="text-sm font-bold text-[#18202A] tracking-tight">How is risk distributed across the cohort?</h2>
            <p className="text-[11px] text-[#68717D] mt-0.5">Overall risk tier counts</p>
          </div>

          <div className="h-52 flex items-center justify-center my-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E4E7E2', borderRadius: '8px', color: '#18202A', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 pt-3 border-t border-[#E4E7E2] text-xs font-semibold">
            <span className="text-[#3D8B68]">Low: {lowCount}</span>
            <span className="text-[#C58A32]">Med: {medCount}</span>
            <span className="text-[#C45151]">High: {highCount}</span>
          </div>
        </div>

        {/* Chart 2: Risk Levels by Department */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E4E7E2] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#263B8F] mb-1">
              <Building2 className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Question 2</span>
            </div>
            <h2 className="text-sm font-bold text-[#18202A] tracking-tight">Where is academic risk concentrated by department?</h2>
            <p className="text-[11px] text-[#68717D] mt-0.5">Comparison of risk tiers across academic programs</p>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskByDeptData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F6F7F4" />
                <XAxis dataKey="department" stroke="#68717D" fontSize={11} />
                <YAxis stroke="#68717D" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E4E7E2', borderRadius: '8px', color: '#18202A', fontSize: '12px' }} />
                <Legend />
                <Bar dataKey="Low" fill="#3D8B68" stackId="a" />
                <Bar dataKey="Medium" fill="#C58A32" stackId="a" />
                <Bar dataKey="High" fill="#C45151" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* QUESTION 3 & 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Average Attendance Trend */}
        <div className="bg-white rounded-xl border border-[#E4E7E2] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#263B8F] mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Question 3</span>
            </div>
            <h2 className="text-sm font-bold text-[#18202A] tracking-tight">What is the cohort attendance trend over time?</h2>
            <p className="text-[11px] text-[#68717D] mt-0.5">Weekly average attendance vs 75% benchmark threshold</p>
          </div>

          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F6F7F4" />
                <XAxis dataKey="period" stroke="#68717D" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#68717D" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E4E7E2', borderRadius: '8px', color: '#18202A', fontSize: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="avgAttendance" name="Cohort Avg Attendance (%)" stroke="#263B8F" strokeWidth={2.5} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="benchmark" name="Benchmark Threshold (75%)" stroke="#C45151" strokeDasharray="4 4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Average Assessment Trend */}
        <div className="bg-white rounded-xl border border-[#E4E7E2] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#263B8F] mb-1">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Question 4</span>
            </div>
            <h2 className="text-sm font-bold text-[#18202A] tracking-tight">What is the cohort assessment performance trend?</h2>
            <p className="text-[11px] text-[#68717D] mt-0.5">Exam performance average vs 40% benchmark threshold</p>
          </div>

          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={assessmentTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F6F7F4" />
                <XAxis dataKey="assessment" stroke="#68717D" fontSize={11} />
                <YAxis domain={[20, 100]} stroke="#68717D" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E4E7E2', borderRadius: '8px', color: '#18202A', fontSize: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="averageScore" name="Cohort Exam Avg (%)" stroke="#6F7FAF" strokeWidth={2.5} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="benchmark" name="Benchmark Threshold (40%)" stroke="#C58A32" strokeDasharray="4 4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* QUESTION 5 */}
      <div className="bg-white rounded-xl border border-[#E4E7E2] p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#263B8F] mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Question 5</span>
          </div>
          <h2 className="text-sm font-bold text-[#18202A] tracking-tight">What is the status of logged faculty interventions?</h2>
          <p className="text-[11px] text-[#68717D] mt-0.5">Breakdown of follow-ups due, open cases, and resolved student outcomes</p>
        </div>

        <div className="h-56 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={interventionStatusData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F6F7F4" />
              <XAxis dataKey="category" stroke="#68717D" fontSize={11} />
              <YAxis stroke="#68717D" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E4E7E2', borderRadius: '8px', color: '#18202A', fontSize: '12px' }} />
              <Legend />
              <Bar dataKey="Follow-up Required" fill="#C45151" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Open Cases" fill="#C58A32" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Resolved" fill="#3D8B68" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
