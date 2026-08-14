import React, { useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  COURSES,
  INITIAL_CONTENT_ITEMS,
  QUESTION_BANK,
  INITIAL_PREDICTIONS,
  PENDING_REGISTRATIONS,
  INITIAL_THREADS,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';
import { User, UserRole, ContentItem, Thread, Message, AuditLog } from './types';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { CourseMaterialsView } from './components/CourseMaterialsView';
import { ClassNotesView } from './components/ClassNotesView';
import { AssignmentsView } from './components/AssignmentsView';
import { NoticesView } from './components/NoticesView';
import { QuestionBankView } from './components/QuestionBankView';
import { ExamPrepView } from './components/ExamPrepView';
import { CommunicationView } from './components/CommunicationView';
import { ModerationQueueView } from './components/ModerationQueueView';
import { ArchitectureSpecView } from './components/ArchitectureSpecView';
import { EditProfileModal } from './components/EditProfileModal';
import { LoginView } from './components/LoginView';

export default function App() {
  // Theme management ('dark' or 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('your_classroom_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('your_classroom_logged_in');
    return saved !== 'false'; // Default logged in for smooth instant access
  });
  const [isSpecModalOpenFromLogin, setIsSpecModalOpenFromLogin] = useState(false);

  // State management
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<NavTab>('materials');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [preselectedExamCourse, setPreselectedExamCourse] = useState<string>('CSE 3101');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Active User ID management
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem('your_classroom_current_user_id');
    return saved || 'u-student-20';
  });

  // Live Users dataset
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('your_classroom_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USERS;
  });

  // Datasets with live mutations
  const [contentItems, setContentItems] = useState<ContentItem[]>(INITIAL_CONTENT_ITEMS);
  const [pendingUsers, setPendingUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('your_classroom_pending_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return PENDING_REGISTRATIONS;
  });
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Sync theme with body class & localStorage
  useEffect(() => {
    localStorage.setItem('your_classroom_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Persist customized users and pending registrations
  useEffect(() => {
    localStorage.setItem('your_classroom_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('your_classroom_pending_users', JSON.stringify(pendingUsers));
  }, [pendingUsers]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Active User object matching the authenticated user or active role
  const currentUser =
    users.find((u) => u.id === currentUserId) ||
    users.find((u) => u.role === currentUserRole) ||
    users[0] ||
    INITIAL_USERS[0];

  const pendingContent = contentItems.filter((item) => item.status === 'pending');

  // Handle switching role (instant simulator)
  const handleSelectRole = (role: UserRole) => {
    setCurrentUserRole(role);
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      localStorage.setItem('your_classroom_current_user_id', targetUser.id);
    }
  };

  // Save profile updates (avatar, name, email, roll, series, etc.)
  const handleSaveProfile = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    // Also update author names/avatars in active content if needed
    setContentItems((prev) =>
      prev.map((item) =>
        item.uploaderId === updatedUser.id
          ? { ...item, uploaderName: updatedUser.name, uploaderRoll: updatedUser.roll }
          : item
      )
    );

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: updatedUser.id,
      actorName: updatedUser.name,
      actorRole: updatedUser.role,
      action: 'update_profile',
      targetType: 'user',
      targetId: updatedUser.id,
      targetDescription: `Updated profile details & avatar picture for ${updatedUser.name} (${updatedUser.role.toUpperCase()})`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Upload new content
  const handleUploadItem = (item: Partial<ContentItem>) => {
    const newItem: ContentItem = {
      id: `cnt-${Date.now()}`,
      title: item.title || 'Untitled Document',
      description: item.description || '',
      contentType: item.contentType || 'course_material',
      courseCode: item.courseCode,
      courseTitle: item.courseTitle,
      batch: item.batch || '20',
      departmentCode: item.departmentCode || '03',
      uploaderId: item.uploaderId || currentUser.id,
      uploaderName: item.uploaderName || currentUser.name,
      uploaderRoll: item.uploaderRoll || currentUser.roll,
      uploaderRole: item.uploaderRole || currentUser.role,
      status: item.status || 'pending',
      fileUrl: item.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileType: item.fileType || 'PDF Document',
      fileSize: item.fileSize || '3.2 MB',
      dueDate: item.dueDate,
      totalMarks: item.totalMarks,
      submittedCount: item.submittedCount,
      isPinned: item.isPinned,
      priority: item.priority,
      createdAt: new Date().toISOString(),
      downloadCount: 0,
    };

    setContentItems((prev) => [newItem, ...prev]);

    // Add audit log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'upload_content',
      targetType: 'content',
      targetId: newItem.id,
      targetDescription: `Uploaded ${newItem.contentType}: "${newItem.title}" (${newItem.status})`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Approve pending registration
  const handleApproveUser = (userId: string) => {
    const target = pendingUsers.find((u) => u.id === userId) || users.find((u) => u.id === userId);
    if (!target) return;

    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));

    setUsers((prev) => {
      const exists = prev.some((u) => u.id === userId);
      if (exists) {
        return prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                verificationStatus: 'approved' as const,
                approvedBy: currentUser.id,
                approvedByName: currentUser.name,
                approvedAt: new Date().toISOString(),
              }
            : u
        );
      } else {
        return [
          ...prev,
          {
            ...target,
            verificationStatus: 'approved' as const,
            approvedBy: currentUser.id,
            approvedByName: currentUser.name,
            approvedAt: new Date().toISOString(),
          },
        ];
      }
    });

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'approve_user',
      targetType: 'user',
      targetId: target.id,
      targetDescription: `Approved registration for ${target.name} (Role: ${target.role.toUpperCase()}, Roll: #${target.roll || 'N/A'})`,
      timestamp: new Date().toISOString(),
      details: `OCR Match Confidence: ${target.ocrConfidence || 96}%`,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Reject pending registration
  const handleRejectUser = (userId: string, reason: string) => {
    const target = pendingUsers.find((u) => u.id === userId) || users.find((u) => u.id === userId);
    if (!target) return;

    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              verificationStatus: 'rejected' as const,
              rejectionReason: reason,
            }
          : u
      )
    );

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'reject_user',
      targetType: 'user',
      targetId: target.id,
      targetDescription: `Rejected registration for ${target.name}: "${reason}"`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Approve pending content
  const handleApproveContent = (contentId: string) => {
    setContentItems((prev) =>
      prev.map((item) =>
        item.id === contentId
          ? {
              ...item,
              status: 'approved',
              approverId: currentUser.id,
              approverName: currentUser.name,
              approvedAt: new Date().toISOString(),
            }
          : item
      )
    );

    const item = contentItems.find((c) => c.id === contentId);
    if (item) {
      const log: AuditLog = {
        id: `log-${Date.now()}`,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'approve_content',
        targetType: 'content',
        targetId: item.id,
        targetDescription: `Approved ${item.contentType}: "${item.title}"`,
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prev) => [log, ...prev]);
    }
  };

  // Reject pending content
  const handleRejectContent = (contentId: string, reason: string) => {
    setContentItems((prev) =>
      prev.map((item) =>
        item.id === contentId
          ? {
              ...item,
              status: 'rejected',
              rejectionReason: reason,
            }
          : item
      )
    );

    const item = contentItems.find((c) => c.id === contentId);
    if (item) {
      const log: AuditLog = {
        id: `log-${Date.now()}`,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'reject_content',
        targetType: 'content',
        targetId: item.id,
        targetDescription: `Rejected ${item.contentType} "${item.title}": "${reason}"`,
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prev) => [log, ...prev]);
    }
  };

  // Send communication message
  const handleSendMessage = (threadId: string, content: string) => {
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      threadId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderRoll: currentUser.roll,
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newMessage],
    }));

    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              lastMessage: content,
              lastMessageTime: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const handleNavigateToExamPrep = (courseCode: string) => {
    setPreselectedExamCourse(courseCode);
    setActiveTab('exam_prep');
  };

  // Authentication Handlers
  const handleLogin = (user: User) => {
    setCurrentUserId(user.id);
    setCurrentUserRole(user.role);
    localStorage.setItem('your_classroom_current_user_id', user.id);
    setUsers((prev) => {
      if (!prev.some((u) => u.id === user.id)) {
        return [...prev, user];
      }
      return prev.map((u) => (u.id === user.id ? user : u));
    });
    setIsLoggedIn(true);
    localStorage.setItem('your_classroom_logged_in', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('your_classroom_logged_in', 'false');
  };

  const handleRegister = (newUser: User) => {
    setPendingUsers((prev) => [newUser, ...prev.filter((u) => u.id !== newUser.id && (!newUser.roll || u.roll !== newUser.roll))]);
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === newUser.id || (newUser.roll && u.roll === newUser.roll));
      if (exists) {
        return prev.map((u) => (u.id === newUser.id || (newUser.roll && u.roll === newUser.roll) ? newUser : u));
      }
      return [...prev, newUser];
    });
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: newUser.role,
      action: 'register_request',
      targetType: 'user',
      targetId: newUser.id,
      targetDescription: `Submitted registration for ${newUser.name} (${newUser.roll || 'No Roll'}) in ${newUser.series}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // If user is logged out, render the Login / Registration Portal
  if (!isLoggedIn) {
    return (
      <>
        <LoginView
          users={users}
          onLogin={handleLogin}
          onRegister={handleRegister}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenSpecs={() => setIsSpecModalOpenFromLogin(true)}
        />

        {/* System Architecture Specs Modal for Logged Out Visitors */}
        {isSpecModalOpenFromLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 p-6 sm:p-8 relative shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-white">RUET Classroom Architecture & Engineering Specs</h3>
                  <p className="text-xs text-slate-400">Technical design documentation & specifications</p>
                </div>
                <button
                  onClick={() => setIsSpecModalOpenFromLogin(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
                >
                  Close Spec
                </button>
              </div>
              <ArchitectureSpecView />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'light bg-[#f8fafc] text-slate-900' : 'dark bg-[#050b18] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.12),rgba(5,11,24,0.95))] text-slate-200'} flex flex-col font-sans selection:bg-cyan-500 selection:text-[#050b18] relative overflow-x-hidden transition-colors duration-300`}>
      {/* Ambient background glows for glass depth */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {theme === 'dark' ? (
          <>
            <div className="absolute -top-40 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/3 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 left-1/4 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl" />
            <div className="absolute top-1/3 -right-20 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
          </>
        )}
      </div>

      {/* Top Universal Header */}
      <div className="relative z-40">
        <Header
          currentUser={currentUser}
          onSelectRole={handleSelectRole}
          pendingUsersCount={pendingUsers.length}
          pendingContentCount={pendingContent.length}
          onOpenModeration={() => setActiveTab('moderation')}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="relative z-30">
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={currentUser.role}
          pendingCount={pendingUsers.length + pendingContent.length}
        />
      </div>

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeTab === 'materials' && (
          <CourseMaterialsView
            items={contentItems}
            courses={COURSES}
            currentUser={currentUser}
            onUploadItem={handleUploadItem}
          />
        )}

        {activeTab === 'notes' && (
          <ClassNotesView
            items={contentItems}
            courses={COURSES}
            currentUser={currentUser}
            onUploadItem={handleUploadItem}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsView
            items={contentItems}
            courses={COURSES}
            currentUser={currentUser}
            onUploadItem={handleUploadItem}
          />
        )}

        {activeTab === 'notices' && (
          <NoticesView
            items={contentItems}
            courses={COURSES}
            currentUser={currentUser}
            onUploadItem={handleUploadItem}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionBankView
            entries={QUESTION_BANK}
            courses={COURSES}
            currentUser={currentUser}
            onNavigateToExamPrep={handleNavigateToExamPrep}
          />
        )}

        {activeTab === 'exam_prep' && (
          <ExamPrepView
            courses={COURSES}
            initialPredictions={INITIAL_PREDICTIONS}
            questionBank={QUESTION_BANK}
            contentItems={contentItems}
            currentUser={currentUser}
            preselectedCourse={preselectedExamCourse}
          />
        )}

        {activeTab === 'communication' && (
          <CommunicationView
            threads={threads}
            messages={messages}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'moderation' && (
          <ModerationQueueView
            currentUser={currentUser}
            pendingUsers={pendingUsers}
            pendingContent={pendingContent}
            auditLogs={auditLogs}
            onApproveUser={handleApproveUser}
            onRejectUser={handleRejectUser}
            onApproveContent={handleApproveContent}
            onRejectContent={handleRejectContent}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureSpecView />}
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
      />

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#070e1e]/75 backdrop-blur-xl py-6 text-center text-xs text-slate-400 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Your <span className="text-cyan-400">Classroom</span></span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">for RUET students (CSE)</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by Google Gemini 3.7 Flash • Rajshahi University of Engineering & Technology
          </div>
        </div>
      </footer>
    </div>
  );
}

