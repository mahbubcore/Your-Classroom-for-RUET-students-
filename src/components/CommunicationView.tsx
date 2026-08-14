import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  Lock,
  Hash,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Message, Thread, User, UserRole } from '../types';

interface CommunicationViewProps {
  threads: Thread[];
  messages: Record<string, Message[]>;
  currentUser: User;
  onSendMessage: (threadId: string, content: string) => void;
}

export const CommunicationView: React.FC<CommunicationViewProps> = ({
  threads,
  messages,
  currentUser,
  onSendMessage,
}) => {
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || 'th-cse3101');
  const [inputText, setInputText] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const threadMessages = messages[activeThreadId] || [];

  const isGuest = currentUser.role === 'guest';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGuest) return;

    onSendMessage(activeThreadId, inputText.trim());
    setInputText('');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/40 backdrop-blur-sm';
      case 'cr':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 backdrop-blur-sm';
      case 'admin':
        return 'bg-rose-500/20 text-rose-300 border-rose-400/40 backdrop-blur-sm';
      default:
        return 'bg-white/10 text-slate-300 border-white/15 backdrop-blur-sm';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4 text-violet-400" />
            <span>Section 7 • Course Communication Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
            Academic Discussion & Messaging
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Course-specific question threads, batch-wide announcements, and direct communication between RUET students, elected CRs, and course instructors.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-[#0b1428]/70 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[520px] shadow-2xl shadow-black/30">
        {/* Left Sidebar: Threads List */}
        <div className="border-r border-white/10 bg-white/[0.02] p-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center justify-between">
            <span>Channels & DMs</span>
            <span className="text-[10px] font-normal text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
              CSE '20
            </span>
          </div>

          <div className="space-y-1.5">
            {threads.map((t) => {
              const isSelected = t.id === activeThreadId;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 backdrop-blur-md ${
                    isSelected
                      ? 'bg-violet-500/15 border border-violet-400/30 text-white shadow-lg shadow-violet-500/10'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 shrink-0">
                    {t.type === 'course_channel' ? (
                      <Hash className="w-4 h-4 text-violet-400" />
                    ) : t.type === 'batch_channel' ? (
                      <Users className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-sky-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold truncate text-slate-200">
                        {t.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {t.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Chat Pane */}
        <div className="md:col-span-2 flex flex-col justify-between bg-transparent">
          {/* Channel Header */}
          <div className="p-4 border-b border-white/10 bg-white/[0.02] backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-400/30 flex items-center justify-center font-bold text-xs shadow-inner">
                #
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {activeThread.title}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {activeThread.type === 'course_channel'
                    ? 'Public Course Discussion • Teachers, CRs & Verified Students'
                    : 'Direct Conversation'}
                </span>
              </div>
            </div>

            {isGuest && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white/5 text-slate-300 border border-white/10 backdrop-blur-sm">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Guest Read-Only</span>
              </span>
            )}
          </div>

          {/* Messages Stream */}
          <div className="p-4 space-y-4 overflow-y-auto max-h-[380px]">
            {threadMessages.map((m) => {
              const isMe = m.senderId === currentUser.id;
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                    {m.senderName.charAt(0)}
                  </div>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 backdrop-blur-md shadow-lg ${
                      isMe
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-violet-500/20 border border-violet-400/30'
                        : 'bg-white/[0.05] border border-white/10 text-slate-200 rounded-tl-sm shadow-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold ${isMe ? 'text-white' : 'text-slate-200'}`}>
                        {m.senderName}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${
                          isMe ? 'bg-white/20 text-white border-white/30' : getRoleBadge(m.senderRole)
                        }`}
                      >
                        {m.senderRole}
                      </span>
                      {m.senderRoll && (
                        <span className="text-[10px] opacity-70 font-mono">
                          #{m.senderRoll}
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed whitespace-pre-line">{m.content}</p>
                    <span className="block text-[10px] opacity-60 text-right mt-1">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-white/10 bg-white/[0.02] backdrop-blur-md">
            {isGuest ? (
              <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-center text-xs text-slate-400">
                Guests have read-only access to academic channels. Please sign in with your RUET 7-digit roll to participate in discussions.
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Message #${activeThread.title.split(' ')[0]}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-2xl text-xs text-white placeholder-slate-400 focus:border-violet-400/60 focus:bg-white/[0.08] focus:outline-none backdrop-blur-md"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-2xl transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-violet-500/25 border border-violet-400/30 backdrop-blur-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
