import React, { useState } from 'react';
import {
  Layers,
  Database,
  ShieldCheck,
  GitBranch,
  Cpu,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  Zap,
  Code,
  Lock,
  Workflow,
  FileText,
  UserCheck,
  Server,
} from 'lucide-react';

export const ArchitectureSpecView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'schema' | 'matrix' | 'auth_flow' | 'tech_stack' | 'mvp_cut' | 'risks' | 'wow'
  >('schema');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Full-Stack Architecture & Blueprint Specifications</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
              RUET — System Architecture
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Complete engineering design covering Entity-Relationship models, 5-role permission matrix, multi-tier verification workflows, RAG exam-prep pipeline, and 24–48h MVP sizing.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-t border-white/[0.08] pt-4 relative z-10">
          {[
            { id: 'schema', label: '1. ERD & DB Schema', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'matrix', label: '2. Role-Permission Matrix', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            { id: 'auth_flow', label: '3. Auth & Verification Sequences', icon: <Workflow className="w-3.5 h-3.5" /> },
            { id: 'tech_stack', label: '4. Tech Stack & RAG Engine', icon: <Cpu className="w-3.5 h-3.5" /> },
            { id: 'mvp_cut', label: '5. Prioritized MVP Feature Cut', icon: <GitBranch className="w-3.5 h-3.5" /> },
            { id: 'risks', label: '6. Risks & Mitigations', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
            { id: 'wow', label: '7. Demo Wow Factors', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 backdrop-blur-md transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-400/40 shadow-lg shadow-teal-500/10'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10 hover:bg-white/[0.08]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: ERD & Database Schema */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl shadow-black/20">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-400" />
                <span>Entity-Relationship Diagram & Relational Schemas</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Normalized PostgreSQL/Firestore schema designed for multi-tier approvals, role-gating, course-specific RAG embeddings, and audit trails.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Table: Users */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-sm shadow-lg shadow-black/20">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-mono font-bold text-xs text-emerald-400">TABLE: users</span>
                  <span className="text-[10px] text-slate-400 font-mono">PK: id</span>
                </div>
                <div className="text-[11px] font-mono space-y-1 text-slate-300">
                  <div className="text-slate-400 font-semibold">• id: UUID (PK)</div>
                  <div>• roll: VARCHAR(7) UNIQUE NULL</div>
                  <div>• name: VARCHAR(255) NOT NULL</div>
                  <div>• email: VARCHAR(255) UNIQUE NOT NULL</div>
                  <div>• password_hash: VARCHAR(255)</div>
                  <div className="text-amber-300">• role: ENUM('student','cr','teacher','admin','guest')</div>
                  <div className="text-rose-300">• status: ENUM('pending','approved','rejected')</div>
                  <div>• dept_code: VARCHAR(2) DEFAULT '03'</div>
                  <div>• batch: VARCHAR(2) (e.g. '20')</div>
                  <div>• id_card_photo_url: TEXT</div>
                  <div>• ocr_confidence: FLOAT</div>
                  <div>• approved_by_id: UUID (FK -&gt; users.id)</div>
                  <div>• approved_at: TIMESTAMP WITH TIME ZONE</div>
                  <div>• is_first_login: BOOLEAN DEFAULT TRUE</div>
                </div>
              </div>

              {/* Table: Content Items */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-sm shadow-lg shadow-black/20">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-mono font-bold text-xs text-sky-400">TABLE: content_items</span>
                  <span className="text-[10px] text-slate-400 font-mono">PK: id</span>
                </div>
                <div className="text-[11px] font-mono space-y-1 text-slate-300">
                  <div className="text-slate-400 font-semibold">• id: UUID (PK)</div>
                  <div>• title: VARCHAR(255) NOT NULL</div>
                  <div>• description: TEXT</div>
                  <div className="text-amber-300">• content_type: ENUM('course_material','class_note','assignment','notice')</div>
                  <div className="text-rose-300">• status: ENUM('pending','approved','rejected')</div>
                  <div>• course_id: UUID (FK -&gt; courses.id)</div>
                  <div>• batch: VARCHAR(2) DEFAULT '20'</div>
                  <div>• uploader_id: UUID (FK -&gt; users.id)</div>
                  <div>• approver_id: UUID (FK -&gt; users.id) NULL</div>
                  <div>• file_url: TEXT</div>
                  <div>• file_size: VARCHAR(30)</div>
                  <div>• due_date: TIMESTAMP (assignments)</div>
                  <div>• total_marks: INT (assignments)</div>
                  <div>• is_pinned: BOOLEAN (notices)</div>
                  <div>• priority: ENUM('low','normal','urgent')</div>
                </div>
              </div>

              {/* Table: Question Bank */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-sm shadow-lg shadow-black/20">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-mono font-bold text-xs text-amber-400">TABLE: question_bank</span>
                  <span className="text-[10px] text-slate-400 font-mono">PK: id</span>
                </div>
                <div className="text-[11px] font-mono space-y-1 text-slate-300">
                  <div className="text-slate-400 font-semibold">• id: UUID (PK)</div>
                  <div>• course_id: UUID (FK -&gt; courses.id)</div>
                  <div className="text-emerald-400">• exam_year: SMALLINT (2020-2024)</div>
                  <div>• term_exam_type: VARCHAR(100)</div>
                  <div>• department_code: VARCHAR(2)</div>
                  <div>• pdf_url: TEXT</div>
                  <div className="text-sky-400">• questions_json: JSONB (QNo, Text, Marks, Topic, RecurrenceCount)</div>
                  <div>• uploaded_by_id: UUID (FK -&gt; users.id)</div>
                  <div>• created_at: TIMESTAMP DEFAULT NOW()</div>
                </div>
              </div>

              {/* Table: Courses */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-sm shadow-lg shadow-black/20">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-mono font-bold text-xs text-violet-400">TABLE: courses</span>
                  <span className="text-[10px] text-slate-400 font-mono">PK: id</span>
                </div>
                <div className="text-[11px] font-mono space-y-1 text-slate-300">
                  <div className="text-slate-400 font-semibold">• id: UUID (PK)</div>
                  <div className="text-emerald-400">• code: VARCHAR(20) UNIQUE (e.g. 'CSE 3101')</div>
                  <div>• title: VARCHAR(255) NOT NULL</div>
                  <div>• department_code: VARCHAR(2) (FK -&gt; departments.code)</div>
                  <div>• year: SMALLINT (1-4)</div>
                  <div>• term: SMALLINT (1-2)</div>
                  <div>• credits: NUMERIC(3,1)</div>
                  <div>• syllabus_text: TEXT (Used for RAG grounding)</div>
                </div>
              </div>

              {/* Table: Threads & Messages */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-sm shadow-lg shadow-black/20">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-mono font-bold text-xs text-rose-400">TABLE: threads & messages</span>
                  <span className="text-[10px] text-slate-400 font-mono">PK: id</span>
                </div>
                <div className="text-[11px] font-mono space-y-1 text-slate-300">
                  <div className="text-slate-400 font-semibold">• thread_id: UUID (PK)</div>
                  <div>• thread_type: ENUM('course_channel','batch_channel','dm')</div>
                  <div>• course_id: UUID NULL</div>
                  <div className="text-emerald-400">• message_id: UUID (PK)</div>
                  <div>• thread_id: UUID (FK -&gt; threads.id)</div>
                  <div>• sender_id: UUID (FK -&gt; users.id)</div>
                  <div>• content: TEXT NOT NULL</div>
                  <div>• created_at: TIMESTAMP DEFAULT NOW()</div>
                </div>
              </div>

              {/* Table: Exam Prep Cache & Audit Logs */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-sm shadow-lg shadow-black/20">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-mono font-bold text-xs text-teal-400">TABLE: exam_prep_cache & audit_logs</span>
                  <span className="text-[10px] text-slate-400 font-mono">PK: id</span>
                </div>
                <div className="text-[11px] font-mono space-y-1 text-slate-300">
                  <div className="text-slate-400 font-semibold">• course_code: VARCHAR(20) (PK)</div>
                  <div className="text-amber-300">• prediction_json: JSONB (Topics, Probabilities, Citations)</div>
                  <div>• confidence_score: INT</div>
                  <div>• cached_at: TIMESTAMP DEFAULT NOW()</div>
                  <div className="text-slate-400 font-semibold pt-1">• audit_id: UUID (PK)</div>
                  <div>• actor_id: UUID (FK -&gt; users.id)</div>
                  <div>• action: VARCHAR(100)</div>
                  <div>• target_type: VARCHAR(50)</div>
                  <div>• details: TEXT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Role-Permission Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl shadow-black/20">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Role-Based Access Control (RBAC) Matrix</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Explicit action permissions across all 5 discrete roles: Student, CR, Teacher, Admin, and Guest.
            </p>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/[0.04] text-slate-200 border-b border-white/10 backdrop-blur-sm">
                  <th className="p-3.5 font-bold">Action / Privilege</th>
                  <th className="p-3.5 font-bold text-center text-blue-400">Student</th>
                  <th className="p-3.5 font-bold text-center text-emerald-400">CR</th>
                  <th className="p-3.5 font-bold text-center text-amber-400">Teacher</th>
                  <th className="p-3.5 font-bold text-center text-rose-400">Admin</th>
                  <th className="p-3.5 font-bold text-center text-slate-400">Guest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.08] font-mono text-[11px]">
                {[
                  { action: 'View Course Materials & Notes', student: true, cr: true, teacher: true, admin: true, guest: true },
                  { action: 'View 5-Year Question Bank & Notices', student: true, cr: true, teacher: true, admin: true, guest: true },
                  { action: 'Upload Material / Note (Pending Approval)', student: true, cr: false, teacher: false, admin: false, guest: false },
                  { action: 'Direct Publish Material/Note (No approval)', student: false, cr: true, teacher: true, admin: true, guest: false },
                  { action: 'Post Assignment & Set Deadlines', student: false, cr: true, teacher: true, admin: true, guest: false },
                  { action: 'Submit Assignment Solution', student: true, cr: true, teacher: false, admin: false, guest: false },
                  { action: 'Post Official Department Notice', student: false, cr: true, teacher: true, admin: true, guest: false },
                  { action: 'Approve/Reject Student Registration', student: false, cr: true, teacher: true, admin: true, guest: false },
                  { action: 'Approve/Reject Student Uploads', student: false, cr: true, teacher: true, admin: true, guest: false },
                  { action: 'Verify CR Registration', student: false, cr: false, teacher: true, admin: true, guest: false },
                  { action: 'Approve Teacher Registration', student: false, cr: false, teacher: false, admin: true, guest: false },
                  { action: 'Participate in Course Channels & DMs', student: true, cr: true, teacher: true, admin: true, guest: false },
                  { action: 'AI Exam-Prep Bot (Unlimited)', student: true, cr: true, teacher: true, admin: true, guest: false },
                  { action: 'AI Exam-Prep Bot (Rate-Limited Demo)', student: true, cr: true, teacher: true, admin: true, guest: true },
                  { action: 'Delete Content of Others', student: false, cr: true, teacher: true, admin: true, guest: false },
                  { action: 'Manage System Users & Audit Logs', student: false, cr: false, teacher: false, admin: true, guest: false },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition">
                    <td className="p-3 text-slate-200 font-sans font-medium">{row.action}</td>
                    <td className="p-3 text-center">{row.student ? <span className="text-emerald-400 font-bold">TRUE</span> : <span className="text-slate-600">FALSE</span>}</td>
                    <td className="p-3 text-center">{row.cr ? <span className="text-emerald-400 font-bold">TRUE</span> : <span className="text-slate-600">FALSE</span>}</td>
                    <td className="p-3 text-center">{row.teacher ? <span className="text-emerald-400 font-bold">TRUE</span> : <span className="text-slate-600">FALSE</span>}</td>
                    <td className="p-3 text-center">{row.admin ? <span className="text-emerald-400 font-bold">TRUE</span> : <span className="text-slate-600">FALSE</span>}</td>
                    <td className="p-3 text-center">{row.guest ? <span className="text-emerald-400 font-bold">TRUE</span> : <span className="text-slate-600">FALSE</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Auth & Verification Sequences */}
      {activeTab === 'auth_flow' && (
        <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl shadow-black/20">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-sky-400" />
              <span>Authentication & Multi-Tier Verification Lifecycle</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Detailed step-by-step state transition flows from initial registration to cryptographic activation.
            </p>
          </div>

          <div className="space-y-4">
            {/* Student Sequence */}
            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-3 backdrop-blur-sm shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-blue-400 uppercase tracking-wider">
                  Sequence 1 • Student Registration & Activation
                </span>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  7-Digit Roll Protocol
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <strong className="text-white block mb-1">Step 1: Sign Up</strong>
                  <span className="text-slate-300 text-[11px] leading-relaxed">Enters 7-digit roll (e.g. 2003045), Name, ID card photo. Default pass: "123".</span>
                </div>
                <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <strong className="text-amber-400 block mb-1">Step 2: Pending State</strong>
                  <span className="text-slate-300 text-[11px] leading-relaxed">Account created with status: "pending". Gemini OCR parses roll & name from ID photo.</span>
                </div>
                <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <strong className="text-emerald-400 block mb-1">Step 3: Verifier Approval</strong>
                  <span className="text-slate-300 text-[11px] leading-relaxed">Either CR or Teacher inspects ID photo + OCR match badge and clicks "Approve".</span>
                </div>
                <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <strong className="text-sky-400 block mb-1">Step 4: Forced Password Reset</strong>
                  <span className="text-slate-300 text-[11px] leading-relaxed">On 1st login, user must change password from default "123" before accessing portal.</span>
                </div>
              </div>
            </div>

            {/* CR Sequence */}
            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-3 backdrop-blur-sm shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                  Sequence 2 • Class Representative (CR) Approval
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  Teacher-Only Verification Gate
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <strong className="text-white block mb-1">1. CR Claim</strong>
                  <span className="text-slate-300 text-[11px] leading-relaxed">Candidate registers with Roll + ID card, selecting CR role.</span>
                </div>
                <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <strong className="text-rose-400 block mb-1">2. CR Lockout</strong>
                  <span className="text-slate-300 text-[11px] leading-relaxed">Cannot be approved by fellow CRs. Hidden from other CR verification lists.</span>
                </div>
                <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <strong className="text-emerald-400 block mb-1">3. Teacher Activation</strong>
                  <span className="text-slate-300 text-[11px] leading-relaxed">Teacher confirms batch election results and grants elevated publisher/moderator rights.</span>
                </div>
              </div>
            </div>

            {/* Teacher Sequence */}
            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-3 backdrop-blur-sm shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-400 uppercase tracking-wider">
                  Sequence 3 • Faculty / Teacher Approval
                </span>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  Central Admin-Only Gate
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <strong className="text-white block mb-1">1. Faculty Reg</strong>
                  <span className="text-slate-300 text-[11px] leading-relaxed">Faculty member signs up with institutional email (@cse.ruet.ac.bd).</span>
                </div>
                <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <strong className="text-rose-400 block mb-1">2. Admin Verification</strong>
                  <span className="text-slate-300 text-[11px] leading-relaxed">Central Admin verifies against RUET Dean/Registrar faculty directory.</span>
                </div>
                <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <strong className="text-amber-400 block mb-1">3. System Provisioning</strong>
                  <span className="text-slate-300 text-[11px] leading-relaxed">Teacher receives exclusive power to approve CRs and post verified coursework.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Tech Stack & RAG Architecture */}
      {activeTab === 'tech_stack' && (
        <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl shadow-black/20">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <span>24–48 Hour Hackathon Tech Stack & Grounded RAG Pipeline</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Pragmatic, high-velocity engineering stack designed for zero build friction and production-grade live AI demonstrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-3 backdrop-blur-sm shadow-lg">
              <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Server className="w-4 h-4" />
                <span>Full-Stack Layer Recommendations</span>
              </h3>
              <ul className="text-xs space-y-2 text-slate-300">
                <li>• <strong className="text-white">Frontend:</strong> React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons (Blazing fast, responsive dark UI).</li>
                <li>• <strong className="text-white">Backend API:</strong> Express.js (Node.js TypeScript via TSX) serving REST endpoints for moderation & Gemini proxying.</li>
                <li>• <strong className="text-white">Database / Persistence:</strong> PostgreSQL (or Supabase / Firestore) with typed schemas.</li>
                <li>• <strong className="text-white">Authentication:</strong> JWT / HTTP-only cookies with roll parser middleware (`parseRUETRoll(roll)`).</li>
                <li>• <strong className="text-white">Storage:</strong> Cloudinary or Local Multi-part (with base64 image preview for ID verification).</li>
              </ul>
            </div>

            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-3 backdrop-blur-sm shadow-lg">
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Gemini Grounded RAG Pipeline Strategy</span>
              </h3>
              <ul className="text-xs space-y-2 text-slate-300">
                <li>• <strong className="text-white">Model:</strong> `gemini-3.7-flash` using `@google/genai` with strict `responseSchema` for JSON output.</li>
                <li>• <strong className="text-white">Anti-Hallucination Guardrails:</strong> Temperature set to `0.15` with mandatory Citation Array linking to exact year/question IDs (e.g. `2023 Q2(a)`).</li>
                <li>• <strong className="text-white">Cost-Saving Cache:</strong> Server-side hash caching (`course_code + paper_checksum`) saves 90% of redundant API calls during hackathon demos.</li>
                <li>• <strong className="text-white">Graceful Cold-Start:</strong> When a course has sparse uploads, fallback to RUET syllabus topic heuristics with informative banner.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: MVP Feature Cut */}
      {activeTab === 'mvp_cut' && (
        <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl shadow-black/20">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              <span>Prioritized MVP Scope & Feature Cut Matrix</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Triage plan for a 24–48 hour build: What must work end-to-end vs what can be simulated vs what is deferred to V2.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white/[0.03] border border-emerald-400/30 rounded-2xl space-y-3 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                  Tier 1 • Must-Have (Live Demo)
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md font-mono font-bold backdrop-blur-sm">
                  100% REAL
                </span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li>• All 5 Roles with functional RBAC switching</li>
                <li>• 7 Core sections navigable & populated</li>
                <li>• Real Gemini 3.7 Exam-Prep prediction engine</li>
                <li>• Pending queue moderation (Approve / Reject)</li>
                <li>• RUET 5-year question bank browser</li>
                <li>• Student content pending review flow</li>
              </ul>
            </div>

            <div className="p-5 bg-white/[0.03] border border-amber-400/30 rounded-2xl space-y-3 backdrop-blur-sm shadow-lg shadow-amber-500/10">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-400 uppercase tracking-wider">
                  Tier 2 • Stubbed / Simulated
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-md font-mono font-bold backdrop-blur-sm">
                  HEURISTIC
                </span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li>• SMS OTP verification (simulate instant token)</li>
                <li>• Actual PDF binary vector indexing (inject parsed JSON into Gemini context)</li>
                <li>• Real-time WebSockets (fast polling / optimistic local state)</li>
                <li>• Bulk ID card batch OCR exporter</li>
              </ul>
            </div>

            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-3 backdrop-blur-sm shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-400 uppercase tracking-wider">
                  Tier 3 • Skip / Post-Hackathon
                </span>
                <span className="text-[10px] bg-white/10 text-slate-300 border border-white/15 px-2 py-0.5 rounded-md font-mono font-bold backdrop-blur-sm">
                  ROADMAP
                </span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-400">
                <li>• Multi-department onboarding wizards (CE, EEE)</li>
                <li>• Plagiarism detector across student assignments</li>
                <li>• Live audio/video lecture streaming</li>
                <li>• Integrated payment gateway for printed notes</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Risks & Mitigations */}
      {activeTab === 'risks' && (
        <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl shadow-black/20">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Architectural Risks & Production Mitigations</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Anticipating failure modes specific to RUET academic workflows and how our design prevents them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <h3 className="font-bold text-xs text-white">
                  Risk 1: Manual ID Card Verification Bottleneck
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Vulnerability:</strong> At term start, 150+ students register simultaneously; manual inspection by 2 CRs causes severe onboarding latency.
              </p>
              <p className="text-xs text-emerald-400">
                <strong className="text-white">Mitigation:</strong> Built-in Gemini Vision OCR scans student ID photo in background, extracts roll & name, compares with form input, and highlights confidence score (e.g. "98% Match") for 1-click batch approvals.
              </p>
            </div>

            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <h3 className="font-bold text-xs text-white">
                  Risk 2: Role Escalation & Self-Approval Exploits
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Vulnerability:</strong> A malicious student claims CR or Teacher role during registration to bypass approval queues.
              </p>
              <p className="text-xs text-emerald-400">
                <strong className="text-white">Mitigation:</strong> Strict backend RBAC middleware. CR verification endpoints check `req.user.role === 'teacher' || req.user.role === 'admin'`. Roles cannot self-elevate in token payload.
              </p>
            </div>

            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <h3 className="font-bold text-xs text-white">
                  Risk 3: AI Hallucinations in Exam Predictions
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Vulnerability:</strong> The LLM invents fictitious exam questions not grounded in the actual RUET syllabus or 5-year past papers.
              </p>
              <p className="text-xs text-emerald-400">
                <strong className="text-white">Mitigation:</strong> Constrained RAG schema prompting requiring explicit `sourceCitations` (e.g. `2023 Q1(a)`), low temperature (0.15), and confidence metrics computed from past question paper coverage.
              </p>
            </div>

            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <h3 className="font-bold text-xs text-white">
                  Risk 4: Hardcoded Department Code ("03") Technical Debt
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Vulnerability:</strong> Platform breaks when expanding to Civil (01), EEE (02), or Mechanical (04).
              </p>
              <p className="text-xs text-emerald-400">
                <strong className="text-white">Mitigation:</strong> Normalized schema with dynamic department parser regex `^(\d{2})(\d{2})(\d{3})$` mapping batch and department keys to foreign tables automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: 3 Wow Factors */}
      {activeTab === 'wow' && (
        <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl shadow-black/20">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>3 "Wow Factor" Additions for Hackathon Judges</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              High-impact, differentiated capabilities engineered specifically for this design to win the hackathon demo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Wow Factor 1 */}
            <div className="p-5 bg-white/[0.03] border border-amber-400/30 rounded-2xl space-y-3 backdrop-blur-sm shadow-lg shadow-amber-500/10">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-sm text-white">
                AI Exam Radar & 5-Year Topic Heatmap
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A visual recurrence heatmap showing exactly how many times each topic appeared across 2020–2024 RUET semester finals (e.g. "B+ Trees: 5/5 Years (100%)"), with predicted mark allocations and exact paper citations.
              </p>
              <div className="text-[10px] text-amber-300 font-mono font-semibold">
                • Proves AI Grounding • High Student Value
              </div>
            </div>

            {/* Wow Factor 2 */}
            <div className="p-5 bg-white/[0.03] border border-emerald-400/30 rounded-2xl space-y-3 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-sm text-white">
                Gemini OCR Smart ID Auto-Verification Assistant
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instantly analyzes uploaded student ID cards using multimodal AI to match roll number and student name against registration inputs, displaying an automated "98% Match" badge for 1-click CR/Teacher approvals.
              </p>
              <div className="text-[10px] text-emerald-300 font-mono font-semibold">
                • Eliminates Verification Queue Bottleneck
              </div>
            </div>

            {/* Wow Factor 3 */}
            <div className="p-5 bg-white/[0.03] border border-sky-400/30 rounded-2xl space-y-3 backdrop-blur-sm shadow-lg shadow-sky-500/10">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/40 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-sm text-white">
                1-Click Multi-Role Simulator for Judges
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                An instant interactive switcher in the top navigation allowing judges during the live demo to toggle between Student, CR, Teacher, Admin, and Guest views to witness real-time RBAC restrictions and moderation workflows.
              </p>
              <div className="text-[10px] text-sky-300 font-mono font-semibold">
                • Flawless Hackathon Demo UX
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
