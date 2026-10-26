export function exportStudentsToCSV(students, filename = "at_risk_students_report.csv") {
  if (!students || !students.length) return;

  const headers = [
    "Student ID",
    "Roll No",
    "Name",
    "Department",
    "Semester",
    "Risk Level",
    "Risk Score (0-100)",
    "Attendance (%)",
    "Assessment Avg (%)",
    "Assignment Completion (%)",
    "Missing Assignments",
    "Engagement Index",
    "Primary Warning Reasons"
  ];

  const rows = students.map(s => {
    const factorSummary = s.factors ? s.factors.map(f => f.title).join(" | ") : "None";
    return [
      `"${s.id}"`,
      `"${s.rollNo}"`,
      `"${s.name}"`,
      `"${s.department}"`,
      `"${s.semester}"`,
      `"${s.riskLevel}"`,
      s.riskScore,
      s.attendance,
      s.assessmentAvg,
      s.assignmentCompletion,
      s.missingAssignments,
      s.engagementIndex,
      `"${factorSummary.replace(/"/g, '""')}"`
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
