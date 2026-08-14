import React, { useState } from 'react';
import {
  Bell,
  Pin,
  AlertCircle,
  Plus,
  Calendar,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { ContentItem, Course, User } from '../types';

interface NoticesViewProps {
  items: ContentItem[];
  courses: Course[];
  currentUser: User;
  onUploadItem: (item: Partial<ContentItem>) => void;
}

export const NoticesView: React.FC<NoticesViewProps> = ({
  items,
  courses,
  currentUser,
  onUploadItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'urgent'>('normal');
  const [isPinned, setIsPinned] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const notices = items.filter((item) => item.contentType === 'notice');
  const canPostNotice = ['teacher', 'cr', 'admin'].includes(currentUser.role);

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onUploadItem({
      title,
      description,
      contentType: 'notice',
      batch: currentUser.batch || '20',
      departmentCode: '03',
      uploaderId: currentUser.id,
      uploaderName: currentUser.name,
      uploaderRole: currentUser.role,
      status: 'approved',
      isPinned,
      priority,
      createdAt: new Date().toISOString(),
      downloadCount: 0,
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setFeedback('Notice published to all students and faculty!');
    setTimeout(() => setFeedback(null), 4000);
  };

  // Sort pinned first, then chronological
  const sorted = [...notices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4 text-rose-400" />
              <span>Section 4 • Official Board</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
              Department & Class Notices
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Urgent exam schedules, class test timings, lab slot notices, and official announcements from Department Head, Faculty, CRs, and Admin.
            </p>
          </div>

          {canPostNotice && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-500/25 border border-rose-400/30 backdrop-blur-md transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Post Notice</span>
            </button>
          )}
        </div>

        {feedback && (
          <div className="mt-4 p-3 bg-rose-500/15 border border-rose-400/30 rounded-xl text-rose-200 text-xs flex items-center gap-2 animate-in fade-in backdrop-blur-md shadow-lg shadow-rose-500/10">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sorted.map((item) => {
          const isUrgent = item.priority === 'urgent';
          return (
            <div
              key={item.id}
              className={`backdrop-blur-xl border rounded-2xl p-5 transition-all duration-200 shadow-xl shadow-black/20 ${
                item.isPinned
                  ? 'border-amber-400/35 bg-gradient-to-r from-amber-500/[0.08] to-white/[0.03] shadow-amber-500/5'
                  : 'bg-white/[0.035] border-white/10 hover:border-white/20 hover:bg-white/[0.055]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40 backdrop-blur-sm shadow-sm">
                      <Pin className="w-3 h-3 rotate-45 text-amber-400" />
                      <span>Pinned Announcement</span>
                    </span>
                  )}
                  {isUrgent && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-400/40 backdrop-blur-sm shadow-sm">
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                      <span>Urgent Action</span>
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-mono">
                    CSE '20 Series
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mt-2.5">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>

              <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                <span>
                  Posted by: <strong className="text-slate-200 font-medium">{item.uploaderName}</strong> ({item.uploaderRole.toUpperCase()})
                </span>
                <span>{item.downloadCount} views</span>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050b18]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1428]/95 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-lg font-bold text-white mb-1">
              Broadcast Department Notice
            </h2>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Post an official announcement for RUET students.
            </p>

            <form onSubmit={handlePostNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notice Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Class Test 2 (CSE 3101 & CSE 2201)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:border-rose-400/60 focus:bg-white/[0.08] focus:outline-none backdrop-blur-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white focus:border-rose-400/60 focus:bg-white/[0.08] focus:outline-none backdrop-blur-md"
                  >
                    <option value="normal" className="bg-[#0b1428] text-white">Normal</option>
                    <option value="urgent" className="bg-[#0b1428] text-white">Urgent / Important</option>
                    <option value="low" className="bg-[#0b1428] text-white">Low Priority</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="pinCheck"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="pinCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
                    Pin to top of board
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notice Body
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write announcement details, room numbers, time slots, and instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:border-rose-400/60 focus:bg-white/[0.08] focus:outline-none resize-none backdrop-blur-md"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-xl border border-white/10 backdrop-blur-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-500/25 border border-rose-400/30 backdrop-blur-md transition"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
