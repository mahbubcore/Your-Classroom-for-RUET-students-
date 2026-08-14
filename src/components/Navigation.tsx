import React from 'react';
import {
  FolderArchive,
  FileText,
  CheckSquare,
  Bell,
  HelpCircle,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab =
  | 'materials'
  | 'notes'
  | 'assignments'
  | 'notices'
  | 'questions'
  | 'exam_prep'
  | 'communication'
  | 'moderation'
  | 'architecture';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userRole: UserRole;
  pendingCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  pendingCount,
}) => {
  const isElevated = ['cr', 'teacher', 'admin'].includes(userRole);

  const tabs = [
    { id: 'materials' as NavTab, label: 'Course Materials', icon: <FolderArchive className="w-4 h-4" /> },
    { id: 'notes' as NavTab, label: 'Class Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'assignments' as NavTab, label: 'Assignments', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'notices' as NavTab, label: 'Notices', icon: <Bell className="w-4 h-4" /> },
    { id: 'questions' as NavTab, label: 'Question Bank', icon: <HelpCircle className="w-4 h-4" />, badge: '5-Yr RUET' },
    {
      id: 'exam_prep' as NavTab,
      label: 'Exam Prep (Gemini AI)',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      highlight: true,
    },
    { id: 'communication' as NavTab, label: 'Communication', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-[#070e1f]/60 backdrop-blur-xl border-b border-white/[0.08] shadow-md shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2 gap-2">
          <div className="flex items-center gap-1.5 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 backdrop-blur-md ${
                    isActive
                      ? tab.highlight
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-400/40 shadow-lg shadow-amber-500/10'
                        : 'bg-white/10 text-white border border-white/20 shadow-lg shadow-cyan-500/5'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] border border-transparent'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-md bg-white/10 text-slate-300 border border-white/15 backdrop-blur-sm">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 min-w-max pl-4 border-l border-white/10">
            {/* Moderation Desk for elevated roles */}
            {isElevated && (
              <button
                onClick={() => setActiveTab('moderation')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 backdrop-blur-md ${
                  activeTab === 'moderation'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Moderation Queue</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/40">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}

            {/* Architecture Blueprint & Specs Tab */}
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 backdrop-blur-md ${
                activeTab === 'architecture'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-500/10'
                  : 'text-cyan-400/90 hover:text-cyan-200 hover:bg-white/[0.05] border border-cyan-500/20'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Specs & Architecture</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
