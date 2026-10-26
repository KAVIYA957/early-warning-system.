export const DEFAULT_FORMULA_CONFIG = {
  attendanceWeight: 0.35,
  assessmentWeight: 0.30,
  assignmentWeight: 0.20,
  engagementWeight: 0.15,
  
  mediumRiskThreshold: 35,
  highRiskThreshold: 65,

  // Thresholds for triggering specific explainable warning factors
  criticalAttendanceThreshold: 75, // Below 75% triggers attendance factor
  criticalAssessmentThreshold: 60, // Below 60% triggers assessment score factor
  maxMissingAssignmentsAllowed: 1, // > 1 missing assignments triggers missing assignment factor
  criticalEngagementThreshold: 50 // Below 50 triggers low engagement factor
};
