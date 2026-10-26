import 'dotenv/config';
import http from 'http';
import app from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { calculateStudentRisk } from '../services/riskCalculator.js';

let server;
let baseUrl;

function request(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {
          json = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('   Early Warning System — Automated Backend Tests   ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    await connectDB();
    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;
    console.log(`Test server running at ${baseUrl}\n`);

    // -------------------------------------------------------------------------
    console.log('[Suite 1: Risk Engine Calculations & Exact Boundary Tests]');
    // -------------------------------------------------------------------------
    // Test Rule 1: Attendance < 75% -> +2
    const r1 = calculateStudentRisk({ attendance: 70, assessmentAvg: 80, missingAssignments: 0 });
    assert(r1.riskScore === 2 && r1.riskLevel === 'Medium Risk', 'Rule 1: Attendance 70% (<75%) yields +2 pts (Medium Risk)');

    // Boundary Test: Attendance 74.99% vs 75%
    const r1_below = calculateStudentRisk({ attendance: 74.99, assessmentAvg: 80, missingAssignments: 0 });
    assert(r1_below.riskScore === 2, 'Boundary: Attendance 74.99% (<75%) yields +2 pts');

    const r1_at = calculateStudentRisk({ attendance: 75, assessmentAvg: 80, missingAssignments: 0 });
    assert(r1_at.riskScore === 0, 'Boundary: Attendance exactly 75% yields 0 pts');

    // Test Rule 2: Assessment Avg < 40% -> +3
    const r2 = calculateStudentRisk({ attendance: 85, assessmentAvg: 35, missingAssignments: 0 });
    assert(r2.riskScore === 3 && r2.riskLevel === 'Medium Risk', 'Rule 2: Assessment 35% (<40%) yields +3 pts (Medium Risk)');

    // Boundary Test: Assessment 39.99% vs 40%
    const r2_below = calculateStudentRisk({ attendance: 85, assessmentAvg: 39.99, missingAssignments: 0 });
    assert(r2_below.riskScore === 3, 'Boundary: Assessment 39.99% (<40%) yields +3 pts');

    const r2_at = calculateStudentRisk({ attendance: 85, assessmentAvg: 40, missingAssignments: 0 });
    assert(r2_at.riskScore === 0, 'Boundary: Assessment exactly 40% yields 0 pts');

    // Test Rule 3: Missing Assignments >= 2 -> +2
    const r3_1 = calculateStudentRisk({ attendance: 85, assessmentAvg: 80, missingAssignments: 1 });
    assert(r3_1.riskScore === 0, 'Boundary: Missed 1 assignment (<2 threshold) yields 0 pts');

    const r3_2 = calculateStudentRisk({ attendance: 85, assessmentAvg: 80, missingAssignments: 2 });
    assert(r3_2.riskScore === 2 && r3_2.riskLevel === 'Medium Risk', 'Boundary: Missed exactly 2 assignments (>=2 threshold) yields +2 pts');

    // Test Baseline / Low Risk: Score 0/7 and Score 1/7
    const rLow0 = calculateStudentRisk({ attendance: 90, assessmentAvg: 85, missingAssignments: 0 });
    assert(rLow0.riskScore === 0 && rLow0.riskLevel === 'Low Risk', 'Score 0/7 is Low Risk');

    const rLow1 = calculateStudentRisk({ attendance: 90, assessmentAvg: 85, missingAssignments: 0, testScore: 1 });
    assert(rLow1.riskLevel === 'Low Risk', 'Score 1/7 boundary is Low Risk');

    // Test Maximum Score: Rahul Kumar 38% attendance, 35% assessment, 5 missed assignments -> 7/7
    const rRahul = calculateStudentRisk({ attendance: 38, assessmentAvg: 35, missingAssignments: 5 });
    assert(rRahul.riskScore === 7 && rRahul.riskLevel === 'High Risk', 'Rahul Kumar: Att 38%, Assess 35%, Missed 5 yields 7/7 High Academic Risk');

    // Test Tier Boundaries: Score 2 (Medium boundary), Score 4 (Medium boundary), Score 5 (High boundary)
    const rMed2 = calculateStudentRisk({ attendance: 70, assessmentAvg: 80, missingAssignments: 0 });
    assert(rMed2.riskScore === 2 && rMed2.riskLevel === 'Medium Risk', 'Score 2/7 is Medium Risk boundary');

    const rMed4 = calculateStudentRisk({ attendance: 60, assessmentAvg: 80, missingAssignments: 2 });
    assert(rMed4.riskScore === 4 && rMed4.riskLevel === 'Medium Risk', 'Score 4/7 is Medium Risk boundary');

    const rHigh5 = calculateStudentRisk({ attendance: 60, assessmentAvg: 35, missingAssignments: 0 });
    assert(rHigh5.riskScore === 5 && rHigh5.riskLevel === 'High Risk', 'Score 5/7 is High Risk boundary');

    // -------------------------------------------------------------------------
    console.log('\n[Suite 2: Health Check & System Status]');
    // -------------------------------------------------------------------------
    const healthRes = await request('GET', '/api/health');
    assert(healthRes.status === 200, 'GET /api/health returns 200 OK');
    assert(healthRes.data.status === 'healthy' && healthRes.data.database === 'connected', 'Database reports connected state');

    // -------------------------------------------------------------------------
    console.log('\n[Suite 3: Authentication & Security]');
    // -------------------------------------------------------------------------
    // Blank credentials
    const emptyLoginRes = await request('POST', '/api/auth/login', {}, { identifier: '', password: '' });
    assert(emptyLoginRes.status === 400, 'Blank credentials return 400 Bad Request');

    // Invalid password
    const badPassRes = await request('POST', '/api/auth/login', {}, { identifier: 'faculty@university.edu', password: 'wrongpassword' });
    assert(badPassRes.status === 401, 'Invalid password returns 401 Unauthorized');

    // Invalid student ID
    const badStudentRes = await request('POST', '/api/auth/login', {}, { identifier: '999999999999', password: 'student123', role: 'student' });
    assert(badStudentRes.status === 401, 'Unknown student ID returns 401 Unauthorized');

    // Valid Faculty Login
    const facultyLoginRes = await request('POST', '/api/auth/login', {}, { identifier: 'faculty@university.edu', password: 'faculty123', role: 'faculty' });
    assert(facultyLoginRes.status === 200, 'Valid faculty login returns 200 OK');
    assert(facultyLoginRes.data.token && facultyLoginRes.data.user.role === 'faculty', 'Faculty login provides JWT token with role=faculty');
    const facultyToken = facultyLoginRes.data.token;

    // Valid Student Login (Rahul Kumar)
    const studentLoginRes = await request('POST', '/api/auth/login', {}, { identifier: '310624104101', password: 'student123', role: 'student' });
    assert(studentLoginRes.status === 200, 'Valid student login with Roll Number returns 200 OK');
    assert(studentLoginRes.data.token && studentLoginRes.data.user.role === 'student', 'Student login provides JWT token with role=student');
    const studentToken = studentLoginRes.data.token;

    // Verify /api/auth/me for Faculty
    const facultyMeRes = await request('GET', '/api/auth/me', { Authorization: `Bearer ${facultyToken}` });
    assert(facultyMeRes.status === 200 && facultyMeRes.data.user.email === 'faculty@university.edu', 'GET /api/auth/me verifies faculty token');

    // Verify /api/auth/me for Student
    const studentMeRes = await request('GET', '/api/auth/me', { Authorization: `Bearer ${studentToken}` });
    assert(studentMeRes.status === 200 && studentMeRes.data.user.rollNo === '310624104101', 'GET /api/auth/me verifies student token with Roll No');

    // Privilege Escalation Prevention Tests
    const privEscFacultyRes = await request('POST', '/api/auth/register', {}, {
      name: 'Unverified Faculty',
      email: 'intruder@university.edu',
      password: 'password123',
      role: 'faculty',
    });
    assert(privEscFacultyRes.status === 403, 'Privilege escalation blocked: Public registration as faculty returns 403 Forbidden');

    const privEscCoordRes = await request('POST', '/api/auth/register', {}, {
      name: 'Unverified Admin',
      email: 'intruder2@university.edu',
      password: 'password123',
      role: 'coordinator',
    });
    assert(privEscCoordRes.status === 403, 'Privilege escalation blocked: Public registration as coordinator returns 403 Forbidden');

    // Student Registration Roster Validation Test
    const fakeStudentRegRes = await request('POST', '/api/auth/register', {}, {
      name: 'Fake Student',
      email: 'fake@student.edu',
      password: 'password123',
      role: 'student',
      rollNo: '999999999999',
    });
    assert(fakeStudentRegRes.status === 404, 'Registration requires valid enrolled student roll number (returns 404)');

    // Corrupted / Forged JWT Token Rejection
    const badTokenRes = await request('GET', '/api/auth/me', { Authorization: 'Bearer invalid.corrupted.jwt.token' });
    assert(badTokenRes.status === 401, 'Corrupted or forged token returns 401 Unauthorized');

    // -------------------------------------------------------------------------
    console.log('\n[Suite 4: Role-Based Access Control & Student Data Isolation]');
    // -------------------------------------------------------------------------
    // Unauthenticated access
    const noAuthRes = await request('GET', '/api/students');
    assert(noAuthRes.status === 401, 'Unauthenticated request to /api/students returns 401 Unauthorized');

    // Student attempting to fetch entire roster
    const studentRosterRes = await request('GET', '/api/students', { Authorization: `Bearer ${studentToken}` });
    assert(studentRosterRes.status === 403, 'Student attempting GET /api/students returns 403 Forbidden');

    // Faculty fetching entire roster
    const facultyRosterRes = await request('GET', '/api/students', { Authorization: `Bearer ${facultyToken}` });
    assert(facultyRosterRes.status === 200 && facultyRosterRes.data.count === 42, 'Faculty fetching GET /api/students returns all 42 students');

    // Student fetching their own record via /api/students/me
    const studentSelfRes = await request('GET', '/api/students/me', { Authorization: `Bearer ${studentToken}` });
    assert(studentSelfRes.status === 200 && studentSelfRes.data.student.id === 'STU-2026-001', 'Student can retrieve own record via GET /api/students/me');
    assert(studentSelfRes.data.student.riskScore === 7, 'Rahul Kumar record in API response has riskScore 7/7');

    // Student fetching their own record via /api/students/STU-2026-001
    const studentOwnIdRes = await request('GET', '/api/students/STU-2026-001', { Authorization: `Bearer ${studentToken}` });
    assert(studentOwnIdRes.status === 200 && studentOwnIdRes.data.student.name === 'Rahul Kumar', 'Student can access own record via /api/students/STU-2026-001');

    // STUDENT ISOLATION TEST: Student attempting to access Alex Rivera (STU-2026-002)
    const studentSnoopRes = await request('GET', '/api/students/STU-2026-002', { Authorization: `Bearer ${studentToken}` });
    assert(studentSnoopRes.status === 403, 'CRITICAL ISOLATION: Student accessing another student (STU-2026-002) returns 403 Forbidden');

    // STUDENT ISOLATION TEST: Student attempting to access another student risk endpoint
    const studentRiskSnoopRes = await request('GET', '/api/students/STU-2026-002/risk', { Authorization: `Bearer ${studentToken}` });
    assert(studentRiskSnoopRes.status === 403, 'CRITICAL ISOLATION: Student accessing another student risk returns 403 Forbidden');

    // DATA INTEGRITY TEST: Student attempting to modify own indicators via PATCH
    const studentTamperRes = await request('PATCH', '/api/students/STU-2026-001', { Authorization: `Bearer ${studentToken}` }, {
      attendance: 99,
      assessmentAvg: 95,
      missingAssignments: 0,
    });
    assert(studentTamperRes.status === 403, 'CRITICAL INTEGRITY: Student attempting PATCH /api/students returns 403 Forbidden');

    // Robustness: Non-existent student ID returns 404 cleanly
    const nonExistentRes = await request('GET', '/api/students/non-existent-student-999', { Authorization: `Bearer ${facultyToken}` });
    assert(nonExistentRes.status === 404, 'Non-existent student query returns 404 cleanly without error');

    // -------------------------------------------------------------------------
    console.log('\n[Suite 5: Interventions & Note Privacy]');
    // -------------------------------------------------------------------------
    // Student attempting to record an intervention
    const studentCreateInvRes = await request('POST', '/api/interventions', { Authorization: `Bearer ${studentToken}` }, {
      studentId: 'STU-2026-001',
      type: 'Academic Counselling',
    });
    assert(studentCreateInvRes.status === 403, 'Student attempting to create intervention returns 403 Forbidden');

    // Faculty recording an intervention
    const facultyCreateInvRes = await request('POST', '/api/interventions', { Authorization: `Bearer ${facultyToken}` }, {
      studentId: 'STU-2026-001',
      type: 'Academic Counselling',
      observation: 'Student attended advisory session. Committed to remedial coursework.',
      actionTaken: 'Signed remedial agreement',
      followUpDate: '2026-09-25',
      notes: 'CONFIDENTIAL FACULTY NOTE: Student cited personal commuting delays.',
    });
    assert(facultyCreateInvRes.status === 201, 'Faculty successfully creates intervention (201 Created)');
    const createdInvId = facultyCreateInvRes.data.intervention.id;

    // Faculty updating intervention status
    const updateInvRes = await request('PATCH', `/api/interventions/${createdInvId}`, { Authorization: `Bearer ${facultyToken}` }, {
      status: 'In Progress',
    });
    assert(updateInvRes.status === 200 && updateInvRes.data.intervention.status === 'In Progress', 'Faculty updates intervention status to "In Progress"');

    // NOTE PRIVACY TEST: Student fetching interventions must NOT receive private notes
    const studentInvsRes = await request('GET', '/api/interventions', { Authorization: `Bearer ${studentToken}` });
    assert(studentInvsRes.status === 200, 'Student can retrieve own interventions');
    const hasPrivateNotes = studentInvsRes.data.interventions.some(i => i.notes && i.notes.includes('CONFIDENTIAL FACULTY NOTE'));
    assert(!hasPrivateNotes, 'PRIVACY AUDIT: Private faculty notes are completely redacted from student view');

    // -------------------------------------------------------------------------
    console.log('\n[Suite 6: Student Support Requests]');
    // -------------------------------------------------------------------------
    // Student submitting support request
    const supportReqRes = await request('POST', '/api/support-requests', { Authorization: `Bearer ${studentToken}` }, {
      requestMessage: 'I would like to schedule an advisory consultation regarding upcoming lab exams.',
    });
    assert(supportReqRes.status === 201, 'Student successfully submits mentor support request (201 Created)');
    const supportReqId = supportReqRes.data.supportRequest._id;

    // Student checking their own support requests
    const studentSupportListRes = await request('GET', '/api/support-requests/me', { Authorization: `Bearer ${studentToken}` });
    assert(studentSupportListRes.status === 200 && studentSupportListRes.data.count >= 1, 'Student can view own submitted support requests');

    // Faculty viewing all support requests
    const facultySupportListRes = await request('GET', '/api/support-requests', { Authorization: `Bearer ${facultyToken}` });
    assert(facultySupportListRes.status === 200 && facultySupportListRes.data.count >= 1, 'Faculty can view support requests queue');

    // Faculty resolving support request
    const resolveSupportRes = await request('PATCH', `/api/support-requests/${supportReqId}`, { Authorization: `Bearer ${facultyToken}` }, {
      status: 'In Review',
      responseNote: 'Advisory consultation scheduled for Thursday.',
    });
    assert(resolveSupportRes.status === 200 && resolveSupportRes.data.supportRequest.status === 'In Review', 'Faculty updates support request status to "In Review"');

    // -------------------------------------------------------------------------
    console.log('\n====================================================');
    console.log(`Results: ${passed} PASSED, ${failed} FAILED (Total: ${passed + failed})`);
    console.log('====================================================');

    if (failed > 0) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Test Execution Error:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await disconnectDB();
  }
}

runTests();
