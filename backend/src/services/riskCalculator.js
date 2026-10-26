/**
 * Official Rule-Based Academic Risk Engine (Backend Service)
 * 
 * SOURCE OF TRUTH SCORING MODEL:
 * - Rule 1: Attendance < 75%             → +2 Risk Points
 * - Rule 2: Recent Assessment Avg < 40%  → +3 Risk Points
 * - Rule 3: Missed Assignments >= 2      → +2 Risk Points
 * 
 * CLASSIFICATION TIERS:
 * - 0 to 1 Points  → Low Risk
 * - 2 to 4 Points  → Medium Risk
 * - 5 to 7 Points  → High Risk (High Academic Risk)
 * 
 * Note: Engagement (LMS activity, engagement index) is contextual only and does NOT contribute to risk points.
 */

export function calculateStudentRisk(student) {
  let riskScore = 0;
  const pointReasons = [];
  const factors = [];

  const attendance = typeof student.attendance === 'number' ? student.attendance : 100;
  const assessmentAvg = typeof student.assessmentAvg === 'number' ? student.assessmentAvg : 100;
  const missingAssignments = typeof student.missingAssignments === 'number' ? student.missingAssignments : 0;

  // Rule 1: Attendance < 75% -> +2 points
  if (attendance < 75) {
    riskScore += 2;
    pointReasons.push(`Attendance below 75% benchmark (${attendance}%)`);
    factors.push({
      category: "Attendance",
      title: "Attendance below 75% benchmark",
      value: `${attendance}%`,
      threshold: "Below 75%",
      points: 2,
      severity: attendance < 60 ? "High Risk Factor" : "Risk Factor"
    });
  }

  // Rule 2: Assessment Avg < 40% -> +3 points
  if (assessmentAvg < 40) {
    riskScore += 3;
    pointReasons.push(`Assessment average below 40% benchmark (${assessmentAvg}%)`);
    factors.push({
      category: "Assessment",
      title: "Assessment average below 40% benchmark",
      value: `${assessmentAvg}%`,
      threshold: "Below 40%",
      points: 3,
      severity: "High Risk Factor"
    });
  }

  // Rule 3: Missed Assignments >= 2 -> +2 points
  if (missingAssignments >= 2) {
    riskScore += 2;
    pointReasons.push(`${missingAssignments} missed assignments (≥ 2 benchmark)`);
    factors.push({
      category: "Assignments",
      title: `${missingAssignments} missed assignments`,
      value: `${missingAssignments} missed`,
      threshold: "2+ threshold",
      points: 2,
      severity: missingAssignments >= 4 ? "High Risk Factor" : "Risk Factor"
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

export function enrichStudentWithRisk(studentObj) {
  const plainStudent = studentObj.toObject ? studentObj.toObject() : { ...studentObj };
  const riskData = calculateStudentRisk(plainStudent);
  return {
    ...plainStudent,
    ...riskData
  };
}
