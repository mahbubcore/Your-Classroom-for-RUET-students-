import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  User as UserIcon,
  Users,
  LogIn,
  KeyRound,
  Mail,
  Hash,
  Sparkles,
  Sun,
  Moon,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Layers,
  FileText,
  FileCheck,
  Upload,
  Eye,
  EyeOff,
  Info,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { DEPARTMENTS, VALID_SERIES } from '../data/mockData';
import { YourClassroomLogo } from './YourClassroomLogo';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (newUser: User) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSpecs?: () => void;
}

type LoginTabType = 'student' | 'cr' | 'teacher' | 'admin' | 'guest';

export const LoginView: React.FC<LoginViewProps> = ({
  users,
  onLogin,
  onRegister,
  theme,
  onToggleTheme,
  onOpenSpecs,
}) => {
  const [activeTab, setActiveTab] = useState<LoginTabType>('student');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [pendingLoginUser, setPendingLoginUser] = useState<User | null>(null);

  // Student Form State
  const [studentRoll, setStudentRoll] = useState('2003045');
  const [studentPassword, setStudentPassword] = useState('123');
  const [studentError, setStudentError] = useState<string | null>(null);

  // CR Form State
  const [crRoll, setCrRoll] = useState('2003001');
  const [crPassword, setCrPassword] = useState('123');
  const [crError, setCrError] = useState<string | null>(null);

  // Teacher Form State
  const [teacherIdentifier, setTeacherIdentifier] = useState('mamun@cse.ruet.ac.bd');
  const [teacherPassword, setTeacherPassword] = useState('123');
  const [teacherError, setTeacherError] = useState<string | null>(null);

  // Admin Form State (Default UserID: admin, Password: admin)
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Password reset state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null);

  // Registration Form State
  const [regRole, setRegRole] = useState<'student' | 'cr' | 'teacher'>('student');
  const [regName, setRegName] = useState('');
  const [regRoll, setRegRoll] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSeries, setRegSeries] = useState<string>("'20 Series");
  const [regDept, setRegDept] = useState('03');
  const [regDesignation, setRegDesignation] = useState('Assistant Professor');
  const [regIdPhotoUrl, setRegIdPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=500&auto=format&fit=crop&q=80'
  );
  const [regSubmitted, setRegSubmitted] = useState(false);
  const [regSuccessMessage, setRegSuccessMessage] = useState('');
  const idFileInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Upload in Registration
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setRegIdPhotoUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 1. Student Login Handler
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);

    const rollClean = studentRoll.trim();

    // Check if roll is valid 7 digits
    if (!/^\d{7}$/.test(rollClean)) {
      setStudentError('Please enter a valid 7-digit RUET Roll number (e.g. 2003045).');
      return;
    }

    const batch = rollClean.substring(0, 2);

    // Validate series (20 to 25)
    const validBatches = ['20', '21', '22', '23', '24', '25'];
    if (!validBatches.includes(batch)) {
      setStudentError(`Roll number batch "${batch}" is outside the permitted active batches (20, 21, 22, 23, 24, 25 series).`);
      return;
    }

    // Find existing student or CR
    const existing = users.find(
      (u) => u.roll === rollClean && (u.role === 'student' || u.role === 'cr')
    );

    if (!existing) {
      setStudentError(`Student Roll #${rollClean} is not registered yet. Please click "+ Register Student" above to submit your name and student ID card for verification.`);
      return;
    }

    if (existing.verificationStatus === 'pending') {
      setStudentError(`Account for "${existing.name}" (Roll #${existing.roll}) is pending approval by your Class Representative (CR), Teacher, or Admin. Once approved, you can log in with default password "123".`);
      return;
    }

    if (existing.verificationStatus === 'rejected') {
      setStudentError(`Your registration was rejected: ${existing.rejectionReason || 'Identity document mismatch'}. Please contact your CR/Teacher or submit a new registration.`);
      return;
    }

    // Verified & Approved student login
    if (studentPassword === '123' || existing.isFirstLogin) {
      setPendingLoginUser(existing);
      setShowPasswordResetModal(true);
    } else {
      onLogin(existing);
    }
  };

  // 2. CR Login Handler
  const handleCrLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCrError(null);

    const rollClean = crRoll.trim();
    const existing = users.find(
      (u) => (u.roll === rollClean || u.id === rollClean) && u.role === 'cr'
    );

    if (!existing) {
      setCrError(`No CR account found with Roll #${rollClean}. Please click "+ Register" or select an active CR roll (e.g. 2003001).`);
      return;
    }

    if (existing.verificationStatus === 'pending') {
      setCrError(`CR registration for "${existing.name}" is pending approval by a Faculty Teacher. (CR accounts can only be verified by Teachers).`);
      return;
    }

    if (existing.verificationStatus === 'rejected') {
      setCrError(`Your CR application was rejected: ${existing.rejectionReason || 'Contact faculty head.'}`);
      return;
    }

    if (crPassword === '123' || existing.isFirstLogin) {
      setPendingLoginUser(existing);
      setShowPasswordResetModal(true);
    } else {
      onLogin(existing);
    }
  };

  // 3. Teacher Login Handler
  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherError(null);

    const cleanInput = teacherIdentifier.trim().toLowerCase();
    const existing = users.find(
      (u) =>
        u.role === 'teacher' &&
        (u.email.toLowerCase() === cleanInput ||
          u.id.toLowerCase() === cleanInput ||
          cleanInput.includes('teacher') ||
          cleanInput.includes('mamun'))
    );

    if (existing) {
      if (existing.verificationStatus === 'pending') {
        setTeacherError('Teacher account is pending Central Admin approval.');
        return;
      }
      onLogin(existing);
    } else {
      // Find default teacher
      const defaultTeacher = users.find((u) => u.role === 'teacher');
      if (defaultTeacher) {
        onLogin(defaultTeacher);
      } else {
        setTeacherError('Teacher account not found. Please use mamun@cse.ruet.ac.bd or register.');
      }
    }
  };

  // 4. Admin Login Handler (UserID: admin, Password: admin)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    const userClean = adminUsername.trim().toLowerCase();
    const passClean = adminPassword.trim();

    if ((userClean === 'admin' || userClean === 'admin@ruet.ac.bd') && (passClean === 'admin' || passClean === '123')) {
      const adminUser = users.find((u) => u.role === 'admin') || {
        id: 'admin',
        name: 'RUET Central Admin',
        email: 'admin@ruet.ac.bd',
        role: 'admin',
        departmentCode: '03',
        departmentName: 'Computer Science & Engineering',
        batch: '00',
        series: 'System',
        verificationStatus: 'approved',
      };
      onLogin(adminUser);
    } else {
      setAdminError('Invalid admin credentials. Use User ID: admin and Password: admin');
    }
  };

  // 5. Guest Access Handler (No login required)
  const handleGuestAccess = () => {
    const guestUser: User = {
      id: 'u-guest',
      name: 'Public Guest Visitor',
      email: 'guest@ruet.ac.bd',
      role: 'guest',
      departmentCode: '03',
      departmentName: 'Computer Science & Engineering',
      batch: '20',
      series: 'Public Visitor',
      verificationStatus: 'approved',
    };
    onLogin(guestUser);
  };

  // Handle Forced Password Reset Completion
  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordResetError(null);

    if (!newPassword.trim() || newPassword.length < 4) {
      setPasswordResetError('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordResetError('Passwords do not match. Please re-enter.');
      return;
    }

    if (pendingLoginUser) {
      const updatedUser: User = {
        ...pendingLoginUser,
        isFirstLogin: false,
      };
      setShowPasswordResetModal(false);
      onLogin(updatedUser);
    }
  };

  // Handle Universal Registration Submit
  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const deptObj = DEPARTMENTS.find((d) => d.code === regDept);

    let newUser: User;

    if (regRole === 'student') {
      if (!/^\d{7}$/.test(regRoll.trim())) {
        alert('Student registration requires a valid 7-digit RUET roll.');
        return;
      }
      const batch = regRoll.trim().substring(0, 2);
      newUser = {
        id: `u-reg-student-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim() || `${regRoll.trim()}@student.ruet.ac.bd`,
        roll: regRoll.trim(),
        role: 'student',
        departmentCode: regDept,
        departmentName: deptObj?.name || 'Computer Science & Engineering',
        batch,
        series: regSeries,
        verificationStatus: 'pending',
        idCardPhotoUrl: regIdPhotoUrl,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${regRoll}`,
        ocrConfidence: 95,
        ocrExtractedName: regName.trim(),
        ocrExtractedRoll: regRoll.trim(),
      };
      setRegSuccessMessage('Student registration submitted! Your account is unverified and will be activated after a Class Representative (CR) or Faculty Teacher verifies your student ID.');
    } else if (regRole === 'cr') {
      if (!/^\d{7}$/.test(regRoll.trim())) {
        alert('CR registration requires a valid 7-digit RUET roll.');
        return;
      }
      const batch = regRoll.trim().substring(0, 2);
      newUser = {
        id: `u-reg-cr-${Date.now()}`,
        name: `${regName.trim()} (${regSeries} CR)`,
        email: regEmail.trim() || `${regRoll.trim()}@student.ruet.ac.bd`,
        roll: regRoll.trim(),
        role: 'cr',
        departmentCode: regDept,
        departmentName: deptObj?.name || 'Computer Science & Engineering',
        batch,
        series: regSeries,
        verificationStatus: 'pending',
        idCardPhotoUrl: regIdPhotoUrl,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${regRoll}`,
        ocrConfidence: 97,
        ocrExtractedName: regName.trim(),
        ocrExtractedRoll: regRoll.trim(),
      };
      setRegSuccessMessage('CR registration submitted! As per policy, CR accounts can ONLY be verified and approved by a Faculty Teacher (not by other CRs).');
    } else {
      // Teacher
      newUser = {
        id: `u-reg-teacher-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim(),
        role: 'teacher',
        departmentCode: regDept,
        departmentName: deptObj?.name || 'Computer Science & Engineering',
        batch: '05',
        series: regDesignation,
        verificationStatus: 'pending',
        idCardPhotoUrl: regIdPhotoUrl,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        ocrConfidence: 99,
        ocrExtractedName: regName.trim(),
      };
      setRegSuccessMessage('Faculty registration submitted! Teacher accounts require Central Admin approval before activation.');
    }

    onRegister(newUser);
    setRegSubmitted(true);
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'light bg-[#f8fafc] text-slate-900' : 'dark bg-[#050b18] text-slate-200'} flex flex-col justify-between relative overflow-x-hidden transition-colors duration-300 font-sans`}>
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {theme === 'dark' ? (
          <>
            <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -right-20 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -right-20 w-[450px] h-[450px] bg-blue-100/40 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl" />
          </>
        )}
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <YourClassroomLogo size={36} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                YOUR CLASSROOM
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
                RUET CSE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Centralized Academic Repository & Communication Ecosystem
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSpecs && (
            <button
              onClick={onOpenSpecs}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">System Spec</span>
            </button>
          )}

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10 transition cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Platform Identity & Role Descriptions */}
          <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Department of Computer Science & Engineering</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Unified Academic <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  Access Portal
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Choose your role to sign in. Active student batches include <strong>'20, '21, '22, '23, '24, and '25 Series</strong>.
              </p>
            </div>

            {/* Role Guidelines Checklist */}
            <div className="space-y-2.5 pt-1 text-left">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>1. Student</span>
                    <span className="text-[10px] font-normal text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-400/20">7-Digit Roll</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Default pass: <code className="text-cyan-300 font-mono">123</code> (forced reset on first login). Uploads go to approval queue. Verified by CR or Teacher.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>2. Class Representative (CR)</span>
                    <span className="text-[10px] font-normal text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-400/20">Elevated</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Can add/edit/remove content and approve students/notes. Account verified <strong>ONLY by Faculty Teachers</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>3. Faculty Teacher</span>
                    <span className="text-[10px] font-normal text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-400/20">Admin Approved</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Full academic content authority. Exclusive power to verify CR accounts and approve students.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>4. Central Admin</span>
                    <span className="text-[10px] font-normal text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-400/20">User: admin</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Master system controller. Approves Teacher registrations, user management, and full audit logs.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-500/10 text-slate-300 shrink-0 mt-0.5">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>5. Public Guest</span>
                    <span className="text-[10px] font-normal text-slate-400 bg-white/5 px-1.5 py-0.2 rounded border border-white/10">No Login</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Instant read-only browsing of course materials, class notes, notices, and question bank.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 5-Type Login Interactive Container */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/15 shadow-2xl relative">
              
              {/* 5-Role Tab Switcher */}
              <div className="grid grid-cols-5 p-1 bg-white/[0.05] rounded-2xl border border-white/10 mb-6 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('student');
                    setStudentError(null);
                  }}
                  className={`py-2 px-1 text-[11px] font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'student'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('cr');
                    setCrError(null);
                  }}
                  className={`py-2 px-1 text-[11px] font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'cr'
                      ? 'bg-emerald-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>CR</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('teacher');
                    setTeacherError(null);
                  }}
                  className={`py-2 px-1 text-[11px] font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'teacher'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Teacher</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admin');
                    setAdminError(null);
                  }}
                  className={`py-2 px-1 text-[11px] font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('guest');
                  }}
                  className={`py-2 px-1 text-[11px] font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'guest'
                      ? 'bg-slate-200 text-slate-900 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Guest</span>
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 1. STUDENT LOGIN TAB */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'student' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-cyan-400" />
                        <span>Student Institutional Login</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Enter your 7-digit roll number (e.g. 2003045). Default password: <code className="text-cyan-300 font-mono">123</code>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setRegRole('student');
                        setShowRegistrationModal(true);
                        setRegSubmitted(false);
                      }}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 transition cursor-pointer"
                    >
                      + Register Student
                    </button>
                  </div>

                  {studentError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{studentError}</span>
                    </div>
                  )}

                  <form onSubmit={handleStudentLogin} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        7-Digit Student Roll Number
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          maxLength={7}
                          value={studentRoll}
                          onChange={(e) => setStudentRoll(e.target.value)}
                          placeholder="e.g. 2003045"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition"
                          required
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 px-1">
                        <span>Format: [Batch 2 Digits] + [Dept Code 03] + [Roll 3 Digits]</span>
                        <span className="text-cyan-400 font-mono">
                          {studentRoll.length >= 2 ? `'${studentRoll.substring(0, 2)} Series` : ''}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          placeholder="Default is 123"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer mt-3"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Log In as Student</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 2. CLASS REPRESENTATIVE (CR) LOGIN TAB */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'cr' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span>Class Representative (CR) Portal</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Elevated batch coordination access. Verified ONLY by Faculty Teachers.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setRegRole('cr');
                        setShowRegistrationModal(true);
                        setRegSubmitted(false);
                      }}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 transition cursor-pointer"
                    >
                      + Register CR
                    </button>
                  </div>

                  {/* Active CR Presets */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                      Select Active Elected CR:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCrRoll('2003001');
                          setCrPassword('123');
                          setCrError(null);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                          crRoll === '2003001'
                            ? 'bg-emerald-500/15 border-emerald-400/50 text-white'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-emerald-300">Tanvir Hossain</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">'20 Series CR (#2003001)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCrRoll('2103002');
                          setCrPassword('123');
                          setCrError(null);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                          crRoll === '2103002'
                            ? 'bg-emerald-500/15 border-emerald-400/50 text-white'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-emerald-300">Mustakim Billah</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">'21 Series CR (#2103002)</div>
                      </button>
                    </div>
                  </div>

                  {crError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{crError}</span>
                    </div>
                  )}

                  <form onSubmit={handleCrLogin} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        CR 7-Digit Roll Number
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={crRoll}
                          onChange={(e) => setCrRoll(e.target.value)}
                          placeholder="e.g. 2003001"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white font-mono focus:outline-none focus:border-emerald-400 transition"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={crPassword}
                          onChange={(e) => setCrPassword(e.target.value)}
                          placeholder="Default is 123"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-emerald-400 transition"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-300 hover:to-teal-400 shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer mt-3"
                    >
                      <Users className="w-4 h-4" />
                      <span>Log In as Class Representative</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 3. TEACHER LOGIN TAB */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'teacher' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-amber-400" />
                        <span>Faculty & Teacher Portal</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Academic authority. Exclusive power to approve CR and student registrations.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setRegRole('teacher');
                        setShowRegistrationModal(true);
                        setRegSubmitted(false);
                      }}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-400/30 transition cursor-pointer"
                    >
                      + Register Faculty
                    </button>
                  </div>

                  {/* Sample Faculty Profile */}
                  <div
                    onClick={() => {
                      setTeacherIdentifier('mamun@cse.ruet.ac.bd');
                      setTeacherPassword('123');
                      setTeacherError(null);
                    }}
                    className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between cursor-pointer hover:bg-amber-500/15 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center font-bold text-amber-300">
                        AM
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Prof. Dr. Md. Al Mamun</h4>
                        <p className="text-[11px] text-amber-300/80">mamun@cse.ruet.ac.bd • Professor, CSE</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-400/20">
                      Quick Fill
                    </span>
                  </div>

                  {teacherError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{teacherError}</span>
                    </div>
                  )}

                  <form onSubmit={handleTeacherLogin} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Institutional Faculty Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={teacherIdentifier}
                          onChange={(e) => setTeacherIdentifier(e.target.value)}
                          placeholder="e.g. mamun@cse.ruet.ac.bd"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={teacherPassword}
                          onChange={(e) => setTeacherPassword(e.target.value)}
                          placeholder="Default is 123"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer mt-3"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Log In as Teacher</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 4. ADMIN LOGIN TAB */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'admin' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-rose-400" />
                      <span>Central System Administrator</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Master control over teachers, users, audit logs, and global parameters.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0" />
                    <div className="text-xs text-rose-300">
                      <strong>Default Credentials:</strong> User ID: <code className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">admin</code> | Password: <code className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">admin</code>
                    </div>
                  </div>

                  {adminError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{adminError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAdminLogin} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Admin User ID
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          placeholder="admin"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-rose-400 transition"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Admin Password
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="admin"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-rose-400 transition"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-xs hover:from-rose-400 hover:to-red-500 shadow-lg shadow-rose-500/20 transition flex items-center justify-center gap-2 cursor-pointer mt-3"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Log In to Central Admin Desk</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 5. GUEST ACCESS TAB */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'guest' && (
                <div className="space-y-5 animate-in fade-in duration-200 py-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-slate-300" />
                      <span>Public Guest Mode (Read-Only)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Explore all public educational resources without creating an account.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Allowed:</strong> Browse course materials, class notes, notices, and question bank</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Allowed:</strong> View AI exam prep recurring topics & syllabus advice</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3 text-xs text-slate-400">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Restricted:</strong> Cannot upload files, submit notes, post notices, or direct message</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGuestAccess}
                    className="w-full py-3 px-4 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue as Guest Visitor</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: FORCED PASSWORD RESET MODAL */}
      {/* ------------------------------------------------------------- */}
      {showPasswordResetModal && pendingLoginUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-cyan-400">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/30">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Set Your Personal Password</h3>
                <p className="text-[11px] text-slate-400">First-time login detected for {pendingLoginUser.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              For account security, RUET requires you to change the default temporary password (<code className="text-cyan-300 font-mono">123</code>) to your own private password.
            </p>

            {passwordResetError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{passwordResetError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordResetSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 4 chars)"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    // Allow proceeding with default if they choose
                    setShowPasswordResetModal(false);
                    onLogin(pendingLoginUser);
                  }}
                  className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition cursor-pointer"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  Save & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: UNIVERSAL REGISTRATION MODAL (STUDENT / CR / TEACHER) */}
      {/* ------------------------------------------------------------- */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-white/20 p-6 sm:p-7 shadow-2xl space-y-4 my-8">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>RUET Account Registration</span>
                </h3>
                <p className="text-[11px] text-slate-400">Institutional ID verification workflow</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRegistrationModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 text-xs px-2.5 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {regSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Registration Submitted!</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  {regSuccessMessage}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationModal(false)}
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegistrationSubmit} className="space-y-3">
                
                {/* Role Switcher */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Select Role to Register As:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole('student')}
                      className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        regRole === 'student'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                          : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('cr')}
                      className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        regRole === 'cr'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                          : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      CR (Elected)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('teacher')}
                      className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        regRole === 'teacher'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                          : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      Faculty Teacher
                    </button>
                  </div>
                </div>

                {/* Role Info Notice */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    {regRole === 'student' && 'Student account will be verified by a CR or Teacher upon checking your student ID photo.'}
                    {regRole === 'cr' && 'CR accounts can ONLY be verified by a Faculty Teacher (not by another CR).'}
                    {regRole === 'teacher' && 'Teacher registrations require Central Admin approval.'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Sazzad Hossain"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>

                  {regRole !== 'teacher' ? (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">7-Digit RUET Roll</label>
                      <input
                        type="text"
                        maxLength={7}
                        value={regRoll}
                        onChange={(e) => setRegRoll(e.target.value)}
                        placeholder="e.g. 2003045"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Designation</label>
                      <input
                        type="text"
                        value={regDesignation}
                        onChange={(e) => setRegDesignation(e.target.value)}
                        placeholder="e.g. Assistant Professor"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Institutional Email</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder={regRole === 'teacher' ? 'name@cse.ruet.ac.bd' : 'roll@student.ruet.ac.bd'}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {regRole !== 'teacher' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Series (Batch)</label>
                      <select
                        value={regSeries}
                        onChange={(e) => setRegSeries(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#091124] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        {VALID_SERIES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* ID Card Photo Upload & Preview */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    RUET ID Card Photo (Required for Identity Verification)
                  </label>
                  <input
                    ref={idFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => idFileInputRef.current?.click()}
                    className="border border-dashed border-white/20 hover:border-cyan-400/50 rounded-xl p-3 text-center cursor-pointer transition bg-white/[0.02] hover:bg-white/[0.04] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 text-left">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0">
                        {regIdPhotoUrl ? (
                          <img src={regIdPhotoUrl} alt="ID Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Upload className="w-4 h-4 text-slate-400 m-auto mt-3" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Click to upload RUET ID photo</p>
                        <p className="text-[10px] text-slate-400">Used for OCR verification by CR/Teacher</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-lg border border-cyan-400/20">
                      Browse
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 shadow-md shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Submit Registration for Moderation</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-3.5 px-4 text-center text-xs text-slate-400">
        <p>Rajshahi University of Engineering & Technology • Department of Computer Science & Engineering</p>
      </footer>
    </div>
  );
};
