import React, { useState } from 'react';
import {
  HelpCircle,
  Calendar,
  Filter,
  Download,
  BookOpen,
  Sparkles,
  TrendingUp,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { Course, QuestionBankEntry, User } from '../types';

interface QuestionBankViewProps {
  entries: QuestionBankEntry[];
  courses: Course[];
  currentUser: User;
  onNavigateToExamPrep: (courseCode: string) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  entries,
  courses,
  currentUser,
  onNavigateToExamPrep,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('CSE 3101');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const filteredEntries = entries.filter((e) => {
    const matchesCourse = selectedCourse === 'all' || e.courseCode === selectedCourse;
    const matchesYear = selectedYear === 'all' || String(e.year) === selectedYear;
    return matchesCourse && matchesYear;
  });

  const availableYears = [2024, 2023, 2022, 2021, 2020];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0b1428]/65 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>Section 5 • 5-Year RUET Archive</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
              RUET Semester Final Question Bank (2020–2024)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Official past semester final and class test question papers for RUET CSE. Categorized by course, question breakdown, and recurrence frequency.
            </p>
          </div>

          <button
            onClick={() => onNavigateToExamPrep(selectedCourse !== 'all' ? selectedCourse : 'CSE 3101')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 border border-amber-300/40 backdrop-blur-md transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Analyze with AI Exam Prep</span>
          </button>
        </div>

        {/* Course and Year Filter Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Course:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-1.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white focus:border-sky-400/60 focus:bg-white/[0.08] focus:outline-none font-medium backdrop-blur-md"
            >
              <option value="all" className="bg-[#0b1428] text-white">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.code} className="bg-[#0b1428] text-white">
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-xs text-slate-400 font-medium ml-2">Exam Year:</span>
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all backdrop-blur-md ${
                selectedYear === 'all'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm shadow-sky-500/10'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              All (5 Years)
            </button>
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(String(yr))}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all backdrop-blur-md ${
                  selectedYear === String(yr)
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm shadow-sky-500/10'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Question Papers List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center text-slate-400 text-xs">
            No question bank archives uploaded for this combination yet.
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white/[0.035] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.055] hover:border-white/20 transition-all duration-200 shadow-xl shadow-black/20 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 backdrop-blur-sm flex items-center justify-center font-bold text-sm shadow-inner">
                    {entry.year}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        {entry.courseCode} — {entry.courseTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white/10 text-slate-300 border border-white/15 backdrop-blur-sm">
                        {entry.termExamType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Archived by {entry.uploadedBy} • RUET CSE Dept
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToExamPrep(entry.courseCode)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/30 text-xs font-semibold rounded-xl backdrop-blur-md transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Predict Next Questions</span>
                  </button>
                  <a
                    href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-xl border border-white/10 backdrop-blur-md transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Original PDF</span>
                  </a>
                </div>
              </div>

              {/* Questions Breakdown */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Question Breakdown with Recurrence Indices:</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {entry.questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white/[0.025] border border-white/[0.08] rounded-xl flex flex-col justify-between backdrop-blur-md hover:bg-white/[0.04] transition"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-mono font-bold text-xs text-sky-400">
                            Q. {q.questionNo}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-medium">
                              {q.marks} Marks
                            </span>
                            {q.recurringCountLast5Years >= 4 && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40 backdrop-blur-sm">
                                <TrendingUp className="w-2.5 h-2.5 text-amber-400" />
                                {q.recurringCountLast5Years}/5 Yrs
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {q.text}
                        </p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
                        <span className="bg-white/10 px-2 py-0.5 rounded-md text-slate-300 font-medium backdrop-blur-sm">
                          Topic: {q.topic}
                        </span>
                        <span>Compulsory Section</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
