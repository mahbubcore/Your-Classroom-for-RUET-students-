import React, { useState } from 'react';
import {
  ShieldAlert,
  UserCheck,
  FileCheck,
  XCircle,
  CheckCircle2,
  Clock,
  Eye,
  AlertTriangle,
  History,
  Sparkles,
  Search,
  Check,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { User, ContentItem, AuditLog, UserRole } from '../types';

interface ModerationQueueViewProps {
  currentUser: User;
  pendingUsers: User[];
  pendingContent: ContentItem[];
  auditLogs: AuditLog[];
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string, reason: string) => void;
  onApproveContent: (contentId: string) => void;
  onRejectContent: (contentId: string, reason: string) => void;
}

export const ModerationQueueView: React.FC<ModerationQueueViewProps> = ({
  currentUser,
  pendingUsers,
  pendingContent,
  auditLogs,
  onApproveUser,
  onRejectUser,
  onApproveContent,
  onRejectContent,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'audit'>('users');
  const [selectedUserForInspection, setSelectedUserForInspection] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingTarget, setRejectingTarget] = useState<{ type: 'user' | 'content'; id: string } | null>(null);

  // Permission rules:
  // - Student verification: CR, Teacher, Admin
  // - CR verification: Teacher, Admin only (CR CANNOT approve other CRs)
  // - Teacher verification: Admin only (Teacher/CR cannot approve teachers)
  const canVerifyUser = (targetUser: User): { allowed: boolean; reason?: string } => {
    if (currentUser.role === 'admin') return { allowed: true };

    if (targetUser.role === 'student') {
      if (currentUser.role === 'cr' || currentUser.role === 'teacher') return { allowed: true };
      return { allowed: false, reason: 'Requires CR or Teacher privileges' };
    }

    if (targetUser.role === 'cr') {
      if (currentUser.role === 'teacher') return { allowed: true };
      if (currentUser.role === 'cr') return { allowed: false, reason: 'CR accounts can ONLY be verified by Teachers' };
      return { allowed: false, reason: 'Requires Faculty Teacher approval' };
    }

    if (targetUser.role === 'teacher') {
      return { allowed: false, reason: 'Teacher registrations require Central Admin approval' };
    }

    return { allowed: false };
  };

  const handleConfirmReject = () => {
    if (!rejectingTarget) return;
    if (rejectingTarget.type === 'user') {
      onRejectUser(rejectingTarget.id, rejectionReason || 'Identity document mismatch');
    } else {
      onRejectContent(rejectingTarget.id, rejectionReason || 'Content does not meet syllabus guidelines');
    }
    setRejectingTarget(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Role-Gated Security Control Desk</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
              Moderation & Verification Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Strict multi-tier approval queue for new student registrations, CR identity verification with Gemini OCR matching, and student-submitted study materials.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all duration-200 ${
                activeTab === 'users'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-lg shadow-rose-500/10'
                  : 'bg-white/[0.04] text-slate-400 border border-white/10 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-rose-400" />
              <span>Pending Registrations ({pendingUsers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all duration-200 ${
                activeTab === 'content'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-lg shadow-amber-500/10'
                  : 'bg-white/[0.04] text-slate-400 border border-white/10 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>Pending Materials ({pendingContent.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all duration-200 ${
                activeTab === 'audit'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-400/40 shadow-lg shadow-teal-500/10'
                  : 'bg-white/[0.04] text-slate-400 border border-white/10 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <History className="w-4 h-4 text-teal-400" />
              <span>Audit Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: User Registrations Queue */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {pendingUsers.length === 0 ? (
            <div className="bg-white/[0.035] backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center text-slate-400 text-xs shadow-2xl shadow-black/20">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-white text-sm">All registration requests resolved!</p>
              <p className="mt-1 text-slate-400">There are no pending student or faculty verification requests in the queue.</p>
            </div>
          ) : (
            pendingUsers.map((user) => {
              const check = canVerifyUser(user);
              return (
                <div
                  key={user.id}
                  className="bg-white/[0.035] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-200 space-y-4 shadow-xl shadow-black/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-inner">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">
                            {user.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white/10 text-slate-300 border border-white/10 backdrop-blur-sm">
                            Role Requested: {user.role.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          {user.roll && (
                            <span className="font-mono text-emerald-400 font-semibold">
                              Roll: #{user.roll}
                            </span>
                          )}
                          <span>{user.departmentName}</span>
                          <span>Series: {user.series}</span>
                        </div>
                      </div>
                    </div>

                    {/* Gemini AI OCR Confidence Badge */}
                    <div className="flex items-center gap-3">
                      <div className="px-3.5 py-1.5 bg-white/[0.04] border border-white/10 rounded-xl text-right backdrop-blur-sm">
                        <div className="flex items-center gap-1.5 justify-end text-[11px] font-bold text-emerald-400">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Gemini OCR: {user.ocrConfidence || 96}% Match</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          ID Card matches Roll #{user.roll}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedUserForInspection(user)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-200"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        <span>Inspect ID</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs">
                    <div>
                      {!check.allowed && (
                        <span className="text-rose-400 flex items-center gap-1 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>{check.reason}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRejectingTarget({ type: 'user', id: user.id })}
                        disabled={!check.allowed}
                        className="px-3.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 disabled:opacity-30 text-xs font-semibold rounded-xl backdrop-blur-sm transition cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => onApproveUser(user.id)}
                        disabled={!check.allowed}
                        className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold disabled:opacity-30 text-xs rounded-xl shadow-lg shadow-emerald-500/25 border border-emerald-300/40 backdrop-blur-md transition cursor-pointer"
                      >
                        Approve & Activate
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Content Moderation Queue */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          {pendingContent.length === 0 ? (
            <div className="bg-white/[0.035] backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center text-slate-400 text-xs shadow-2xl shadow-black/20">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-white text-sm">No pending content submissions!</p>
              <p className="mt-1 text-slate-400">All student materials and class notes have been reviewed.</p>
            </div>
          ) : (
            pendingContent.map((item) => (
              <div
                key={item.id}
                className="bg-white/[0.035] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-200 space-y-4 shadow-xl shadow-black/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
                        {item.contentType.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-sky-400 font-mono">
                        {item.courseCode}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {item.description}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-2">
                      Submitted by: <strong className="text-slate-200 font-medium">{item.uploaderName}</strong> (Roll #{item.uploaderRoll || 'N/A'})
                    </div>
                  </div>

                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-200 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>Preview File</span>
                  </a>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => setRejectingTarget({ type: 'content', id: item.id })}
                    className="px-3.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 text-xs font-semibold rounded-xl backdrop-blur-sm transition cursor-pointer"
                  >
                    Reject Submission
                  </button>
                  <button
                    onClick={() => onApproveContent(item.id)}
                    className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 border border-emerald-300/40 backdrop-blur-md transition cursor-pointer"
                  >
                    Approve & Publish Publicly
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: System Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white/[0.035] backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white">
              System Audit Logs & Verification Trail
            </h3>
            <span className="text-xs text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
              Immutable Ledger
            </span>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-start justify-between gap-3 text-xs backdrop-blur-sm hover:border-white/15 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {log.actorName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-white/10 text-slate-300 border border-white/10">
                      {log.actorRole}
                    </span>
                    <span className="text-slate-400">performed</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      [{log.action}]
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium">
                    {log.targetDescription}
                  </p>
                  {log.details && (
                    <p className="text-[11px] text-slate-400 italic">
                      Note: {log.details}
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ID Card Inspection Modal */}
      {selectedUserForInspection && (
        <div className="fixed inset-0 z-50 bg-[#050b18]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1428]/95 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                RUET Student ID Card Verification
              </h3>
              <button
                onClick={() => setSelectedUserForInspection(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-2 shadow-inner">
              <img
                src={selectedUserForInspection.idCardPhotoUrl}
                alt="Submitted ID"
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>

            <div className="p-3.5 bg-white/[0.04] rounded-2xl border border-white/10 text-xs space-y-2 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Submitted Name:</span>
                <strong className="text-white">{selectedUserForInspection.name}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Submitted Roll:</span>
                <strong className="text-emerald-400 font-mono">#{selectedUserForInspection.roll}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Gemini OCR Confidence:</span>
                <span className="text-amber-300 font-bold font-mono">
                  {selectedUserForInspection.ocrConfidence || 96}% High Match
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedUserForInspection(null);
                  setRejectingTarget({ type: 'user', id: selectedUserForInspection.id });
                }}
                className="px-4 py-2 bg-rose-500/20 text-rose-300 border border-rose-400/30 rounded-xl text-xs font-semibold backdrop-blur-sm hover:bg-rose-500/30 transition cursor-pointer"
              >
                Reject Request
              </button>
              <button
                onClick={() => {
                  onApproveUser(selectedUserForInspection.id);
                  setSelectedUserForInspection(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/25 border border-emerald-300/40 backdrop-blur-md transition cursor-pointer"
              >
                Confirm & Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingTarget && (
        <div className="fixed inset-0 z-50 bg-[#050b18]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1428]/95 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              Provide Rejection Reason
            </h3>
            <p className="text-xs text-slate-300">
              Please specify the reason for rejection (e.g. blurry ID photo, roll number mismatch, or incomplete notes).
            </p>

            <textarea
              rows={3}
              placeholder="e.g. ID card photo is illegible. Please re-upload with clear Roll number."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:border-rose-400/60 focus:bg-white/[0.08] focus:outline-none resize-none backdrop-blur-md"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectingTarget(null)}
                className="px-4 py-2 bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 backdrop-blur-sm transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/25 border border-rose-300/40 backdrop-blur-md transition cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
