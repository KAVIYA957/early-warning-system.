/**
 * Official MVP Rule-Based Academic Risk Engine
 * 
 * SOURCE OF TRUTH SCORING MODEL:
 * - Rule 1: Attendance < 75%             → +2 Risk Points
 * - Rule 2: Recent Assessment Avg < 40%  → +3 Risk Points
 * - Rule 3: Missed Assignments >= 2      → +2 Risk Points
 * 
 * CLASSIFICATION:
 * - 0 to 1 Points  → LOW RISK
 * - 2 to 4 Points  → MEDIUM RISK
 * - 5 to 7 Points  → HIGH ACADEMIC RISK
 */

export function calculateStudentRisk(student) {
  let riskScore = 0;
  const pointReasons = [];
  const factors = [];

  // Rule 1: Attendance < 75% -> +2 points
  if (student.attendance < 75) {
    riskScore += 2;
    pointReasons.push(`Attendance below 75% benchmark (${student.attendance}%)`);
    factors.push({
      category: "Attendance",
      title: "Attendance below 75% benchmark",
      value: `${student.attendance}%`,
      threshold: "Below 75%",
      points: 2,
      severity: student.attendance < 60 ? "High Risk Factor" : "Risk Factor"
    });
  }

  // Rule 2: Assessment Avg < 40% -> +3 points
  if (student.assessmentAvg < 40) {
    riskScore += 3;
    pointReasons.push(`Assessment average below 40% benchmark (${student.assessmentAvg}%)`);
    factors.push({
      category: "Assessment",
      title: "Assessment average below 40% benchmark",
      value: `${student.assessmentAvg}%`,
      threshold: "Below 40%",
      points: 3,
      severity: "High Risk Factor"
    });
  }

  // Rule 3: Missed Assignments >= 2 -> +2 points
  if (student.missingAssignments >= 2) {
    riskScore += 2;
    pointReasons.push(`${student.missingAssignments} missed assignments (≥ 2 benchmark)`);
    factors.push({
      category: "Assignments",
      title: `${student.missingAssignments} missed assignments`,
      value: `${student.missingAssignments} missed`,
      threshold: "2+ threshold",
      points: 2,
      severity: student.missingAssignments >= 4 ? "High Risk Factor" : "Risk Factor"
    });
  }

  // Risk Classification Tier
  let riskLevel = "Low Risk";
  if (riskScore >= 5) {
    riskLevel = "High Risk";
  } else if (riskScore >= 2) {
    riskLevel = "Medium Risk";
  }

  const riskScoreText = `${riskScore} / 7`;

  let primaryWarning = "Good Academic Standing";
  if (pointReasons.length > 0) {
    primaryWarning = pointReasons.map(r => r.split(" (")[0]).join(" + ");
  }

  return {
    ...student,
    riskScore,
    riskScoreText,
    riskLevel,
    pointScore: riskScore,
    pointScoreText: riskScoreText,
    pointRiskLevel: riskLevel,
    primaryWarning,
    pointReasons,
    factors
  };
}

export function calculateAllStudentsRisk(students) {
  return students.map(s => calculateStudentRisk(s));
}
