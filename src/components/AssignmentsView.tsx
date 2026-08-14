import React, { useState } from 'react';
import {
  CheckSquare,
  Calendar,
  Award,
  Upload,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { ContentItem, Course, User } from '../types';

interface AssignmentsViewProps {
  items: ContentItem[];
  courses: Course[];
  currentUser: User;
  onUploadItem: (item: Partial<ContentItem>) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  items,
  courses,
  currentUser,
  onUploadItem,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseCode, setCourseCode] = useState('CSE 3101');
  const [dueDate, setDueDate] = useState('');
  const [totalMarks, setTotalMarks] = useState(20);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  const assignments = items.filter((item) => item.contentType === 'assignment');
  const canPostAssignment = ['teacher', 'cr', 'admin'].includes(currentUser.role);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const courseObj = courses.find((c) => c.code === courseCode);

    onUploadItem({
      title,
      description,
      contentType: 'assignment',
      courseCode,
      courseTitle: courseObj?.title || 'CSE Course',
      batch: currentUser.batch || '20',
      departmentCode: '03',
      uploaderId: currentUser.id,
      uploaderName: currentUser.name,
      uploaderRole: currentUser.role,
      status: 'approved',
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      totalMarks: Number(totalMarks),
      submittedCount: 0,
      createdAt: new Date().toISOString(),
      downloadCount: 0,
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
    setSubmitFeedback('Assignment posted to the course batch stream!');
    setTimeout(() => setSubmitFeedback(null), 4000);
  };

  const handleStudentSubmitMock = (assignmentTitle: string) => {
    setSubmitFeedback(`Successfully submitted your solution for "${assignmentTitle}"!`);
    setTimeout(() => setSubmitFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <span>Section 3 • Term Coursework</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
              Assignments & Lab Tasks
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Coursework problem sets posted by Teachers and CRs with due date trackers and submission upload portals.
            </p>
          </div>

          {canPostAssignment && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/25 border border-indigo-400/30 backdrop-blur-md transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
          )}
        </div>

        {submitFeedback && (
          <div className="mt-4 p-3 bg-indigo-500/15 border border-indigo-400/30 rounded-xl text-indigo-200 text-xs flex items-center gap-2 animate-in fade-in backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>{submitFeedback}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((item) => {
          const isOverdue = item.dueDate && new Date(item.dueDate) < new Date();
          return (
            <div
              key={item.id}
              className="bg-white/[0.035] backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/[0.065] hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5 shadow-xl shadow-black/20"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-400/30 backdrop-blur-sm">
                    {item.courseCode}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.totalMarks || 20} Marks</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 p-3 bg-white/[0.03] rounded-xl border border-white/[0.08] flex items-center justify-between text-xs backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Deadline:</span>
                    <strong className={isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-100'}>
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'TBA'}
                    </strong>
                  </div>

                  <div className="text-slate-400 text-[11px]">
                    Submissions: <span className="text-emerald-400 font-semibold">{item.submittedCount || 0}</span> students
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400">
                  By {item.uploaderName} ({item.uploaderRole.toUpperCase()})
                </div>

                {currentUser.role === 'student' ? (
                  <button
                    onClick={() => handleStudentSubmitMock(item.title)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-500/20 border border-emerald-400/30 backdrop-blur-md transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Submit Solution</span>
                  </button>
                ) : (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-xl border border-white/10 backdrop-blur-md transition">
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Submissions ({item.submittedCount || 0})</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050b18]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1428]/95 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-lg font-bold text-white mb-1">
              Create Course Assignment
            </h2>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Post an assignment or lab task for CSE students.
            </p>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Course
                </label>
                <select
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white focus:border-indigo-400/60 focus:bg-white/[0.08] focus:outline-none backdrop-blur-md"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.code} className="bg-[#0b1428] text-white">
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assignment 3: Concurrency Control Simulation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:border-indigo-400/60 focus:bg-white/[0.08] focus:outline-none backdrop-blur-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white focus:border-indigo-400/60 focus:bg-white/[0.08] focus:outline-none backdrop-blur-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white focus:border-indigo-400/60 focus:bg-white/[0.08] focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Problem Description & Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide problem specifications, submission format (PDF/Zip), and scoring criteria..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:border-indigo-400/60 focus:bg-white/[0.08] focus:outline-none resize-none backdrop-blur-md"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-xl border border-white/10 backdrop-blur-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/25 border border-indigo-400/30 backdrop-blur-md transition"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
