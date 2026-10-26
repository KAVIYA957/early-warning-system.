import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { INITIAL_STUDENTS } from '../data/initialStudents';
import { MENTORS } from '../data/mentors';
import { calculateAllStudentsRisk } from '../utils/riskCalculator';
import { api, tokenStorage } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [rawStudents, setRawStudents] = useState(INITIAL_STUDENTS);
  const [mentors] = useState(MENTORS);
  const [currentRole, setCurrentRole] = useState("faculty"); // 'faculty', 'coordinator', 'student'
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  // Authentication & Session State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "Faculty User",
    email: "faculty@university.edu",
    role: "Faculty Member",
    department: "Computer Science & Engineering"
  });
  const [studentProfile, setStudentProfile] = useState(null);

  // System & Connection State
  const [isLoading, setIsLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [supportRequests, setSupportRequests] = useState([]);

  // Intervention Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordModalStudentId, setRecordModalStudentId] = useState(null);

  // Timeline Demonstration Controller
  const [rahulDemoStage, setRahulDemoStageState] = useState(4);

  // Dynamic Rule-Based Risk Engine Calculation across current dataset
  const students = useMemo(() => {
    return calculateAllStudentsRisk(rawStudents);
  }, [rawStudents]);

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return students.find(s => s.id === selectedStudentId || s._id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Isolated student object for student portal
  const currentStudent = useMemo(() => {
    if (currentRole !== "student") return null;
    if (studentProfile) return studentProfile;
    return students.find(s => s.id === currentUser?.studentId || s.rollNo === currentUser?.rollNo) ||
           students.find(s => s.id === "STU-2026-001") ||
           students[0];
  }, [students, currentRole, currentUser, studentProfile]);

  // Load authorized data from Express / MongoDB backend
  const loadBackendData = useCallback(async (role) => {
    try {
      if (role === 'student') {
        const studentRes = await api.students.getMe();
        if (studentRes.success && studentRes.student) {
          setStudentProfile(studentRes.student);
        }
        const supportRes = await api.support.getMe().catch(() => null);
        if (supportRes?.success) {
          setSupportRequests(supportRes.supportRequests || []);
        }
      } else {
        const rosterRes = await api.students.getAll();
        if (rosterRes.success && Array.isArray(rosterRes.students)) {
          setRawStudents(rosterRes.students);
        }
        const supportRes = await api.support.getAll().catch(() => null);
        if (supportRes?.success) {
          setSupportRequests(supportRes.supportRequests || []);
        }
      }
      setBackendConnected(true);
    } catch (err) {
      console.warn("[AppContext] Backend sync notice:", err.message);
    }
  }, []);

  // Verify and restore authenticated session on mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      setIsLoading(true);
      const token = tokenStorage.get();

      if (token) {
        try {
          const meRes = await api.auth.getMe();
          if (isMounted && meRes.success && meRes.user) {
            setCurrentUser(meRes.user);
            setCurrentRole(meRes.user.role);
            setIsAuthenticated(true);
            setBackendConnected(true);
            await loadBackendData(meRes.user.role);
          }
        } catch (e) {
          console.warn("[AppContext] Session token expired, clearing:", e.message);
          tokenStorage.clear();
          if (isMounted) {
            setIsAuthenticated(false);
          }
        }
      } else {
        api.health()
          .then(() => { if (isMounted) setBackendConnected(true); })
          .catch(() => { if (isMounted) setBackendConnected(false); });
      }

      if (isMounted) setIsLoading(false);
    }

    initSession();
    return () => { isMounted = false; };
  }, [loadBackendData]);

  // Authentication: Login via Express API
  const login = async (identifier, password, role = "faculty") => {
    const cleanId = identifier ? String(identifier).trim() : "";
    if (!cleanId) {
      triggerToast(role === "student" ? "Please enter a valid student Roll Number." : "Please enter your email address.", "error");
      return false;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.login({
        identifier: cleanId,
        password: password || 'demo',
        role,
      });

      if (res.success && res.token) {
        tokenStorage.set(res.token);
        setCurrentUser(res.user);
        setCurrentRole(res.user.role);
        setIsAuthenticated(true);
        setBackendConnected(true);

        if (res.user.role === 'student') {
          setActiveTab("overview");
          await loadBackendData('student');
          triggerToast(`Signed in as ${res.user.name} (Student Portal).`, "success");
        } else {
          setActiveTab("dashboard");
          await loadBackendData(res.user.role);
          triggerToast(`Signed in as ${res.user.name}. Welcome to Early Warning Portal.`, "success");
        }
        return true;
      }
    } catch (err) {
      triggerToast(err.message || "Authentication failed. Please verify your credentials.", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Authentication: Logout and clear session
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Best effort API logout
    }
    tokenStorage.clear();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setStudentProfile(null);
    setSelectedStudentId(null);
    setCurrentRole("faculty");
    setActiveTab("dashboard");
    triggerToast("Signed out of portal.", "info");
  };

  const openRecordModal = (studentId = null) => {
    setRecordModalStudentId(studentId);
    setIsRecordModalOpen(true);
  };

  const closeRecordModal = () => {
    setIsRecordModalOpen(false);
    setRecordModalStudentId(null);
  };

  // Interventions: Save to MongoDB via Express API
  const addIntervention = async (studentId, interventionData) => {
    const student = students.find(s => s.id === studentId || s._id === studentId);
    const studentName = student ? student.name : "Student";

    try {
      const res = await api.interventions.create({
        studentId,
        ...interventionData,
      });

      if (res.success && res.intervention) {
        setRawStudents(prev => prev.map(s => {
          if (s.id === studentId || s._id === studentId) {
            return {
              ...s,
              lastReviewed: res.intervention.date,
              interventions: [res.intervention, ...(s.interventions || [])]
            };
          }
          return s;
        }));
        triggerToast(`Intervention recorded successfully in database for ${studentName}!`, "success");
        return res.intervention;
      }
    } catch (err) {
      console.error("Failed to persist intervention:", err);
      // Fallback local update
      setRawStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          const newIntervention = {
            id: `INT-${Date.now().toString().slice(-4)}`,
            date: interventionData.date || new Date().toISOString().split('T')[0],
            status: interventionData.status || "Follow-up Required",
            ...interventionData
          };
          return {
            ...s,
            interventions: [newIntervention, ...(s.interventions || [])]
          };
        }
        return s;
      }));
      triggerToast(`Intervention saved locally (${err.message})`, "info");
    }
  };

  // Interventions: Update status in MongoDB
  const updateInterventionStatus = async (studentId, interventionId, newStatus) => {
    try {
      await api.interventions.update(interventionId, { status: newStatus });
      setRawStudents(prev => prev.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            interventions: (student.interventions || []).map(item => {
              if (item.id === interventionId || item._id === interventionId) {
                return { ...item, status: newStatus };
              }
              return item;
            })
          };
        }
        return student;
      }));
      triggerToast(`Intervention status updated to "${newStatus}" in MongoDB.`, "info");
    } catch (err) {
      triggerToast(`Status update failed: ${err.message}`, "error");
    }
  };

  // Student Metrics: Update in MongoDB
  const updateStudentData = async (studentId, updatedFields) => {
    try {
      const res = await api.students.update(studentId, updatedFields);
      if (res.success && res.student) {
        setRawStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...res.student } : s));
        triggerToast("Student record updated in MongoDB. Risk indicators re-evaluated.", "success");
        return;
      }
    } catch (err) {
      console.warn("API update failed, applying local update:", err.message);
    }

    setRawStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return { ...student, ...updatedFields };
      }
      return student;
    }));
    triggerToast("Student record updated. Risk indicators re-evaluated.", "success");
  };

  // Student Support: Submit request to MongoDB
  const submitSupportRequest = async (requestMessage) => {
    try {
      const res = await api.support.create({ requestMessage });
      if (res.success && res.supportRequest) {
        setSupportRequests(prev => [res.supportRequest, ...prev]);
        triggerToast("Your request has been recorded in the database for faculty mentor follow-up.", "success");
        return res.supportRequest;
      }
    } catch (err) {
      triggerToast(`Support request failed: ${err.message}`, "error");
      throw err;
    }
  };

  // Timeline Demonstration Controller for Rahul Kumar
  const setRahulDemoStage = (stage) => {
    setRahulDemoStageState(stage);
    let attendance = 38;
    let assessmentAvg = 35;
    let missingAssignments = 5;
    let assignmentCompletion = 38;
    let engagementIndex = 22;
    let attendanceTrend = [82, 74, 65, 38];
    let assessmentTrend = [72, 65, 54, 35];

    if (stage === 1) {
      attendance = 82;
      assessmentAvg = 72;
      missingAssignments = 0;
      assignmentCompletion = 100;
      engagementIndex = 85;
      attendanceTrend = [82, 82, 82, 82];
      assessmentTrend = [72, 72, 72, 72];
    } else if (stage === 2) {
      attendance = 74;
      assessmentAvg = 65;
      missingAssignments = 1;
      assignmentCompletion = 88;
      engagementIndex = 68;
      attendanceTrend = [82, 74, 74, 74];
      assessmentTrend = [72, 65, 65, 65];
    } else if (stage === 3) {
      attendance = 65;
      assessmentAvg = 54;
      missingAssignments = 2;
      assignmentCompletion = 75;
      engagementIndex = 55;
      attendanceTrend = [82, 74, 65, 65];
      assessmentTrend = [72, 65, 54, 54];
    } else if (stage === 4) {
      attendance = 38;
      assessmentAvg = 35;
      missingAssignments = 5;
      assignmentCompletion = 38;
      engagementIndex = 22;
      attendanceTrend = [82, 74, 65, 38];
      assessmentTrend = [72, 65, 54, 35];
    } else if (stage === 5 || stage === 6) {
      attendance = 78;
      assessmentAvg = 68;
      missingAssignments = 0;
      assignmentCompletion = 100;
      engagementIndex = 80;
      attendanceTrend = [82, 74, 65, 38, 78];
      assessmentTrend = [72, 65, 54, 35, 68];
    }

    const updates = {
      attendance,
      attendanceTrend,
      assessmentAvg,
      assessmentTrend,
      assignmentCompletion,
      missingAssignments,
      engagementIndex
    };

    setRawStudents(prev => prev.map(s => s.id === "STU-2026-001" ? { ...s, ...updates } : s));
    api.students.update("STU-2026-001", updates).catch(() => {});
  };

  // Department Simulator
  const batchSimulateUpdate = (dept, metric, delta) => {
    setRawStudents(prev => prev.map(student => {
      const matchesDept = dept === "ALL" || 
        student.department === dept || 
        student.department.toLowerCase().includes(dept.toLowerCase()) ||
        (dept === "Computer Science" && student.department.includes("Computer"));

      if (!matchesDept) return student;

      const updated = { ...student };
      if (metric === "attendance") {
        const newVal = Math.max(10, Math.min(100, Math.round((student.attendance || 75) + delta)));
        updated.attendance = newVal;
        updated.attendanceTrend = student.attendanceTrend ? [...student.attendanceTrend, newVal] : [newVal];
      } else if (metric === "assessmentAvg") {
        const newVal = Math.max(10, Math.min(100, Math.round((student.assessmentAvg || 60) + delta)));
        updated.assessmentAvg = newVal;
        updated.assessmentTrend = student.assessmentTrend ? [...student.assessmentTrend, newVal] : [newVal];
      } else if (metric === "assignmentCompletion") {
        const newVal = Math.max(0, Math.min(100, Math.round((student.assignmentCompletion || 70) + delta)));
        updated.assignmentCompletion = newVal;
        if (delta < 0) {
          updated.missingAssignments = Math.min(student.totalAssignments || 8, (student.missingAssignments || 0) + Math.ceil(Math.abs(delta) / 10));
        } else {
          updated.missingAssignments = Math.max(0, (student.missingAssignments || 0) - Math.ceil(delta / 10));
        }
      } else if (metric === "engagementIndex") {
        const newVal = Math.max(5, Math.min(100, Math.round((student.engagementIndex || 50) + delta)));
        updated.engagementIndex = newVal;
      }
      return updated;
    }));

    const prefix = delta > 0 ? `+${delta}%` : `${delta}%`;
    const targetDept = dept === "ALL" ? "All Departments" : dept;
    triggerToast(`Simulation: ${targetDept} ${metric} adjusted by ${prefix}. Indicators re-evaluated.`, "info");
  };

  const resetStudentsData = async () => {
    setRawStudents(INITIAL_STUDENTS);
    await loadBackendData(currentRole);
    triggerToast("Reset student roster back to default demonstration dataset.", "info");
  };

  return (
    <AppContext.Provider value={{
      students,
      mentors,
      currentRole,
      setCurrentRole,
      activeTab,
      setActiveTab,
      selectedStudent,
      setSelectedStudentId,
      currentStudent,
      searchQuery,
      setSearchQuery,
      toast,
      triggerToast,
      isAuthenticated,
      currentUser,
      isLoading,
      backendConnected,
      supportRequests,
      login,
      logout,
      isRecordModalOpen,
      recordModalStudentId,
      openRecordModal,
      closeRecordModal,
      addIntervention,
      updateInterventionStatus,
      updateStudentData,
      submitSupportRequest,
      rahulDemoStage,
      setRahulDemoStage,
      batchSimulateUpdate,
      resetStudentsData,
      refreshData: () => loadBackendData(currentRole)
    }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
// oxlint-disable-next-line react/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
