import React, { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  Filter,
  Plus,
  BookOpen,
  Check,
  X,
} from 'lucide-react';
import { ContentItem, Course, User } from '../types';

interface ClassNotesViewProps {
  items: ContentItem[];
  courses: Course[];
  currentUser: User;
  onUploadItem: (item: Partial<ContentItem>) => void;
}

export const ClassNotesView: React.FC<ClassNotesViewProps> = ({
  items,
  courses,
  currentUser,
  onUploadItem,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseCode, setCourseCode] = useState('CSE 3101');
  const [notice, setNotice] = useState<string | null>(null);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notes = items.filter((item) => item.contentType === 'class_note');
  const filtered = selectedCourse === 'all'
    ? notes
    : notes.filter((item) => item.courseCode === selectedCourse);

  const isGuest = currentUser.role === 'guest';
  const needsApproval = currentUser.role === 'student';

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const processSelectedFile = (file: File) => {
    setUploadedFile(file);
    setUploadedFileName(file.name);
    setUploadedFileSize(formatFileSize(file.size));

    // Auto-fill title if empty
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setTitle(cleanName);
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setUploadedFileUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    setUploadedFileName('');
    setUploadedFileSize('');
    setUploadedFileUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const courseObj = courses.find((c) => c.code === courseCode);

    onUploadItem({
      title,
      description: description || (uploadedFileName ? `Uploaded file: ${uploadedFileName}` : 'Student handwritten / scanned lecture note'),
      contentType: 'class_note',
      courseCode,
      courseTitle: courseObj?.title || 'CSE Course',
      batch: currentUser.batch || '20',
      departmentCode: '03',
      uploaderId: currentUser.id,
      uploaderName: currentUser.name,
      uploaderRoll: currentUser.roll,
      uploaderRole: currentUser.role,
      status: needsApproval ? 'pending' : 'approved',
      fileType: 'Scanned Notes PDF',
      fileSize: uploadedFileSize || '4.2 MB',
      fileUrl: uploadedFileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      downloadCount: 0,
      createdAt: new Date().toISOString(),
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setUploadedFile(null);
    setUploadedFileName('');
    setUploadedFileSize('');
    setUploadedFileUrl('');
    setNotice(
      needsApproval
        ? 'Your class note has been submitted to the CR & Teacher approval queue!'
        : 'Your class note was published directly to the portal.'
    );
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Section 2 • Peer & Faculty Notes</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
              Class Notes & Handwritten Compilations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Student-contributed lecture notes, whiteboard derivations, and summary cheatsheets reviewed by CRs and Teachers.
            </p>
          </div>

          {!isGuest && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-500/25 border border-cyan-400/30 backdrop-blur-md transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Contribute Class Note</span>
            </button>
          )}
        </div>

        {notice && (
          <div className="mt-4 p-3 bg-cyan-500/15 border border-cyan-400/30 rounded-xl text-cyan-200 text-xs flex items-center gap-2 animate-in fade-in backdrop-blur-md shadow-lg shadow-cyan-500/10">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>{notice}</span>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Course:</span>
          </span>
          <button
            onClick={() => setSelectedCourse('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 backdrop-blur-md ${
              selectedCourse === 'all'
                ? 'bg-white text-slate-900 shadow-md shadow-white/20'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            All Notes ({notes.length})
          </button>
          {courses.map((course) => {
            const count = notes.filter((m) => m.courseCode === course.code).length;
            return (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 backdrop-blur-md ${
                  selectedCourse === course.code
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-md shadow-cyan-500/10'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
                }`}
              >
                {course.code} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const isPending = item.status === 'pending';
          return (
            <div
              key={item.id}
              className={`bg-white/[0.035] backdrop-blur-xl border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:bg-white/[0.065] hover:border-white/20 hover:-translate-y-0.5 shadow-xl shadow-black/20 ${
                isPending ? 'border-amber-400/30 bg-amber-500/[0.06]' : 'border-white/10'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 backdrop-blur-sm">
                    {item.courseCode}
                  </span>
                  {isPending ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
                      <Clock className="w-3 h-3" />
                      <span>Pending CR Review</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Note</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2 hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3.5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
                  <span>Author: <strong className="text-slate-200 font-medium">{item.uploaderName}</strong> {item.uploaderRoll ? `(#${item.uploaderRoll})` : ''}</span>
                  {item.approverName && (
                    <span className="text-emerald-400/90 font-medium">Approved by {item.approverName.split(' ')[0]}</span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.fileSize || '4.2 MB'}
                </span>
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl border border-white/15 backdrop-blur-md transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050b18]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1428]/95 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-lg font-bold text-white mb-1">
              Contribute Class Notes
            </h2>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {needsApproval
                ? 'Your note will be verified by a CR or Teacher for clarity and accuracy before becoming visible to the class.'
                : 'Publish note directly to the batch repository.'}
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Course
                </label>
                <select
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white focus:border-cyan-400/60 focus:bg-white/[0.08] focus:outline-none backdrop-blur-md"
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
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lecture 12-14: AVL Tree Rotation Cases & Balance Factor"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:border-cyan-400/60 focus:bg-white/[0.08] focus:outline-none backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Topics / Notes Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention topics, key formulas, or specific lecture dates covered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:border-cyan-400/60 focus:bg-white/[0.08] focus:outline-none resize-none backdrop-blur-md"
                />
              </div>

              {/* File Upload Drop Zone */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  id="class-notes-file-input"
                />

                {!uploadedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`p-5 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? 'border-cyan-400 bg-cyan-500/15 scale-[1.01]'
                        : 'border-white/20 bg-white/[0.03] hover:border-cyan-400/50 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2 border border-cyan-400/20">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-200 font-semibold">
                      Click to browse or drag & drop scanned notes
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Scanned PDF, CamScanner exports, Images (Up to 30MB)
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {uploadedFileName}
                        </div>
                        <div className="text-[10px] text-cyan-400 flex items-center gap-2 mt-0.5">
                          <span>{uploadedFileSize}</span>
                          <span>•</span>
                          <span className="font-semibold">Ready for Review</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-cyan-300">
                            <Check className="w-3 h-3" /> Selected
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
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
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-500/25 border border-cyan-400/30 backdrop-blur-md transition"
                >
                  {needsApproval ? 'Submit to CR for Review' : 'Publish Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
