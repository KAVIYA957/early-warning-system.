import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Intervention from '../models/Intervention.js';
import SupportRequest from '../models/SupportRequest.js';
import { INITIAL_STUDENTS } from '../../../src/data/initialStudents.js';

async function seedDatabase() {
  console.log('====================================================');
  console.log('  Early Warning System — Idempotent Database Seeder  ');
  console.log('====================================================');

  try {
    await connectDB();

    console.log(`\n[1/4] Processing ${INITIAL_STUDENTS.length} students from canonical dataset...`);

    let studentUpsertCount = 0;
    const studentDocMap = {};

    for (const studentData of INITIAL_STUDENTS) {
      const { interventions: _interventions, ...studentFields } = studentData;

      // Upsert student record to ensure idempotency without duplicate key collisions
      const studentDoc = await Student.findOneAndUpdate(
        { id: studentFields.id },
        { $set: studentFields },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      studentDocMap[studentDoc.id] = studentDoc;
      studentUpsertCount++;
    }

    console.log(`✓ Upserted ${studentUpsertCount} students (Preserved exact academic indicators).`);

    // Verify Rahul Kumar demonstration record
    const rahul = await Student.findOne({ id: 'STU-2026-001' });
    if (rahul) {
      console.log(`✓ Verified Rahul Kumar: Attendance=${rahul.attendance}%, Assessment=${rahul.assessmentAvg}%, MissedAssignments=${rahul.missingAssignments}`);
    }

    console.log('\n[2/4] Processing demonstration intervention records...');
    let interventionCount = 0;

    for (const studentData of INITIAL_STUDENTS) {
      if (studentData.interventions && Array.isArray(studentData.interventions)) {
        const studentDoc = studentDocMap[studentData.id];
        if (!studentDoc) continue;

        for (const inv of studentData.interventions) {
          const invId = inv.id || `INT-${Date.now().toString().slice(-4)}`;
          await Intervention.findOneAndUpdate(
            { id: invId },
            {
              $set: {
                id: invId,
                student: studentDoc._id,
                studentId: studentDoc.id,
                type: inv.type || 'Academic Counselling',
                date: inv.date || '2026-09-10',
                mentorId: inv.mentorId || 'M1',
                status: inv.status || 'Follow-up Required',
                notes: inv.notes || 'Advisory session recorded.',
                actionItems: inv.actionItems || ['Attendance contract (min 80%)', 'Remedial assignment submission'],
                observation: inv.observation || 'Attendance shortage and assessment review',
                actionTaken: inv.actionTaken || 'Issued academic advisory pledge',
                followUpDate: inv.followUpDate || '2026-09-20',
              },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
          interventionCount++;
        }
      }
    }
    console.log(`✓ Processed ${interventionCount} intervention records.`);

    console.log('\n[3/4] Creating/updating demonstration user accounts...');

    const facultyPassword = process.env.DEMO_FACULTY_PASSWORD || 'faculty123';
    const coordinatorPassword = process.env.DEMO_COORDINATOR_PASSWORD || 'coordinator123';
    const studentPassword = process.env.DEMO_STUDENT_PASSWORD || 'student123';

    // Hash passwords directly for idempotency check
    const salt = await bcrypt.genSalt(10);
    const hashedFacultyPassword = await bcrypt.hash(facultyPassword, salt);
    const hashedCoordinatorPassword = await bcrypt.hash(coordinatorPassword, salt);
    const hashedStudentPassword = await bcrypt.hash(studentPassword, salt);

    // 1. Faculty Demo Account
    await User.findOneAndUpdate(
      { email: 'faculty@university.edu' },
      {
        $set: {
          name: 'Faculty Advisor',
          email: 'faculty@university.edu',
          password: hashedFacultyPassword,
          role: 'faculty',
          department: 'Computer Science & Engineering',
          accountStatus: 'active',
        },
      },
      { upsert: true, new: true }
    );
    console.log('✓ Faculty Account: faculty@university.edu (Role: faculty)');

    // 2. Coordinator Demo Account
    await User.findOneAndUpdate(
      { email: 'coordinator@university.edu' },
      {
        $set: {
          name: 'Academic Coordinator',
          email: 'coordinator@university.edu',
          password: hashedCoordinatorPassword,
          role: 'coordinator',
          department: "Dean's Office",
          accountStatus: 'active',
        },
      },
      { upsert: true, new: true }
    );
    console.log('✓ Coordinator Account: coordinator@university.edu (Role: coordinator)');

    // 3. Student Demo Account (Rahul Kumar)
    const rahulDoc = studentDocMap['STU-2026-001'];
    await User.findOneAndUpdate(
      { $or: [{ email: 'rahul.kumar@student.edu' }, { rollNo: '310624104101' }] },
      {
        $set: {
          name: 'Rahul Kumar',
          email: 'rahul.kumar@student.edu',
          password: hashedStudentPassword,
          role: 'student',
          studentId: 'STU-2026-001',
          rollNo: '310624104101',
          student: rahulDoc ? rahulDoc._id : null,
          department: 'Computer Science & Engineering',
          accountStatus: 'active',
        },
      },
      { upsert: true, new: true }
    );
    console.log('✓ Student Account: 310624104101 / rahul.kumar@student.edu (Rahul Kumar)');

    // 4. Initial Sample Support Request
    if (rahulDoc) {
      await SupportRequest.findOneAndUpdate(
        { studentId: 'STU-2026-001', status: 'Pending' },
        {
          $set: {
            student: rahulDoc._id,
            studentId: 'STU-2026-001',
            rollNo: '310624104101',
            studentName: 'Rahul Kumar',
            requestMessage: 'Requesting academic advisory consultation regarding attendance requirements and assessment review.',
            status: 'Pending',
            assignedMentorId: 'M1',
          },
        },
        { upsert: true, new: true }
      );
      console.log('✓ Initial Support Request created for Rahul Kumar.');
    }

    console.log('\n[4/4] Summary & Credentials:');
    console.log('----------------------------------------------------');
    console.log('Faculty Login:     faculty@university.edu    / ' + facultyPassword);
    console.log('Coordinator Login: coordinator@university.edu / ' + coordinatorPassword);
    console.log('Student Login:     310624104101              / ' + studentPassword);
    console.log('----------------------------------------------------');
    console.log('NOTE: To customize demo passwords before a presentation, set DEMO_FACULTY_PASSWORD, DEMO_COORDINATOR_PASSWORD, and DEMO_STUDENT_PASSWORD in backend/.env.');
    console.log('\n✓ Database seed completed successfully!');
  } catch (error) {
    console.error('✗ Seed Error:', error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}

seedDatabase();
