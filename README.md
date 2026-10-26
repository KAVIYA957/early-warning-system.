# Early Warning System for At-Risk Students (MERN Stack)

A full-stack institutional advisory decision-support system designed for colleges and universities to identify early academic warning signals, preserve student dignity, coordinate faculty interventions, and empower students through an isolated personal advisory portal.

---

## 1. System Architecture

```
                       ┌──────────────────────────────────────────┐
                       │           React 19 + Vite Frontend       │
                       │   (Warm Ivory & Deep Indigo Design)      │
                       └────────────────────┬─────────────────────┘
                                            │ REST API (JSON / Bearer JWT)
                                            ▼
                       ┌──────────────────────────────────────────┐
                       │          Express.js REST Backend         │
                       │           (Node.js, Port 5000)           │
                       └─────┬──────────────────┬───────────────┬─┘
                             │                  │               │
                             ▼                  ▼               ▼
                      ┌──────────────┐   ┌─────────────┐  ┌─────────────┐
                      │  JWT & Role  │   │ Rule-Based  │  │  Ownership  │
                      │  Middleware  │   │ Risk Engine │  │  Isolation  │
                      └──────────────┘   └─────────────┘  └─────────────┘
                                                │
                                                ▼
                       ┌──────────────────────────────────────────┐
                       │          MongoDB (Mongoose ODM)          │
                       │  Users • Students • Interventions • Req  │
                       └──────────────────────────────────────────┘
```

- **Frontend**: React 19, Tailwind CSS v4, Lucide Icons, Recharts, Vite.
- **Backend**: Node.js, Express.js, Mongoose ODM.
- **Database**: MongoDB (Local or Atlas) on `mongodb://localhost:27017/early_warning_system`.
- **Security**: Password hashing with `bcryptjs`, signed JWT tokens, strict role-based access control, and student data isolation middleware.

---

## 2. Risk Scoring Engine (Source of Truth)

The system adheres strictly to the approved 0–7 rule-based scoring engine:

| Rule | Indicator Benchmark | Points | Severity Classification |
|---|---|---|---|
| **Rule 1** | Attendance < 75% | **+2 Points** | Warning Indicator |
| **Rule 2** | Assessment Average < 40% | **+3 Points** | High Warning Indicator |
| **Rule 3** | Missed Assignments ≥ 2 | **+2 Points** | Warning Indicator |

### Classification Tiers:
- **0–1 Points**: **Low Risk** (Good Academic Standing)
- **2–4 Points**: **Medium Risk** (Targeted Faculty Monitoring)
- **5–7 Points**: **High Academic Risk** (Priority Intervention Queue)

*Note: LMS engagement and activity indices remain purely contextual and do not artificially alter the official risk score.*

---

## 3. Quick Start & Startup Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on default port 27017, or configured via connection string)

### Step 1: Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Configure Environment Variables
Copy the example environment file:
```bash
cp backend/.env.example backend/.env
```

Ensure `backend/.env` contains:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/early_warning_system
JWT_SECRET=your_cryptographically_secure_random_key_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

### Step 3: Seed Database (Idempotent 42-Student Roster)
Run the automated seed script to import all 42 canonical demonstration students and initialize demo accounts:
```bash
npm run seed
```

### Step 4: Start the Applications
Open two terminals (or use background execution):

**Terminal 1 (Backend Server on Port 5000):**
```bash
npm run server
```

**Terminal 2 (Frontend Client on Port 5173):**
```bash
npm run dev
```

Visit the application at `http://localhost:5173`.

---

## 4. Demonstration Accounts

| Role | Username / Identifier | Password | Access Scope |
|---|---|---|---|
| **Faculty Member** | `faculty@university.edu` | `faculty123` | Full 42-student cohort, risk triage, interventions, case files |
| **Academic Coordinator** | `coordinator@university.edu` | `coordinator123` | Institutional analytics, policy rules, cohort monitoring |
| **Student (Rahul Kumar)** | `310624104101` | `student123` | Strictly isolated personal dashboard (Score: 7/7 High Risk) |

*Shortcut: In development mode, typing `"demo"` as the password or clicking the quick-access demo buttons on the sign-in screen is supported.*

---

## 5. Automated Tests

Run the complete backend automated test suite covering risk calculations, boundary conditions, authentication, privilege escalation prevention, role authorization, student record isolation, and note privacy:

```bash
npm run test:backend
```
Expected output: **48 PASSED, 0 FAILED**.

---

## 6. REST API Endpoints

### Authentication
- `POST /api/auth/login` — Sign in with email or student roll number + password.
- `POST /api/auth/register` — Register user account.
- `GET /api/auth/me` — Retrieve active session profile.
- `POST /api/auth/logout` — Invalidate session.

### Students
- `GET /api/students` — Faculty list of all students (Supports `search`, `department`, `riskLevel`).
- `GET /api/students/:id` — Get single student by ID or Roll Number (Enforces student ownership).
- `GET /api/students/me` — Authenticated student personal academic record.
- `GET /api/students/:id/risk` — Breakdown of risk rules and score factors.
- `PATCH /api/students/:id` — Update student metrics (Faculty/Coordinator only).

### Interventions
- `GET /api/interventions` — Retrieve case interventions (Faculty sees all; student sees own without private notes).
- `POST /api/interventions` — Record advisory intervention (Faculty/Coordinator only).
- `PATCH /api/interventions/:id` — Update intervention status / commitments.

### Support Requests
- `POST /api/support-requests` — Student submits mentor advisory request.
- `GET /api/support-requests/me` — Student views own requests.
- `GET /api/support-requests` — Faculty views cohort support requests.
- `PATCH /api/support-requests/:id` — Update support request status.

### Health Check
- `GET /api/health` — System status and MongoDB connection state.

---

## 7. Prototype Status & Known Limitations

1. **Institutional Prototype**: Designed and validated for college evaluation and review. Production deployment would require external reverse proxies (Nginx), TLS/HTTPS termination, Redis session rate-limiting, and SMTP mail servers.
2. **Simulated Email Dispatch**: Mentor support requests and faculty alerts are saved to MongoDB; outbound email delivery is simulated via client toast notifications to prevent unintended external mail dispatch during review demonstrations.
3. **Demo Passwords**: Demo passwords can be customized before presentations by modifying `DEMO_FACULTY_PASSWORD`, `DEMO_COORDINATOR_PASSWORD`, and `DEMO_STUDENT_PASSWORD` in `backend/.env` and re-running `npm run seed`.
4. **Data Isolation**: Strict server-side ownership and role guards protect student privacy; students cannot view peers' records, cohort analytics, or private faculty notes.
