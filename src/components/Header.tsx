import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  User,
  Users,
  Search,
  Bell,
  Sparkles,
  BookOpen,
  ArrowRightLeft,
  ChevronDown,
  Sun,
  Moon,
  Camera,
  Edit3,
  Check,
  LogOut,
} from 'lucide-react';
import { User as UserType, UserRole } from '../types';
import { YourClassroomLogo } from './YourClassroomLogo';

interface HeaderProps {
  currentUser: UserType;
  onSelectRole: (role: UserRole) => void;
  pendingUsersCount: number;
  pendingContentCount: number;
  onOpenModeration: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenEditProfile: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectRole,
  pendingUsersCount,
  pendingContentCount,
  onOpenModeration,
  searchQuery,
  setSearchQuery,
  theme,
  onToggleTheme,
  onOpenEditProfile,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const totalPending = pendingUsersCount + pendingContentCount;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin (System Master)',
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-sm shadow-rose-500/10',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
        };
      case 'teacher':
        return {
          label: 'Faculty / Teacher',
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-sm shadow-amber-500/10',
          icon: <UserCheck className="w-3.5 h-3.5" />,
        };
      case 'cr':
        return {
          label: 'Class Representative (CR)',
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-500/10',
          icon: <Users className="w-3.5 h-3.5" />,
        };
      case 'student':
        return {
          label: 'Verified Student',
          bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-sm shadow-cyan-500/10',
          icon: <GraduationCap className="w-3.5 h-3.5" />,
        };
      case 'guest':
      default:
        return {
          label: 'Public Guest (Read-Only)',
          bg: 'bg-white/5 text-slate-400 border-white/10',
          icon: <User className="w-3.5 h-3.5" />,
        };
    }
  };

  const badge = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-[#070e1f]/75 backdrop-blur-xl border-b border-white/[0.08] text-slate-100 shadow-xl shadow-black/25 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <YourClassroomLogo size={42} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white drop-shadow-sm">
                  Your <span className="text-cyan-400">Classroom</span>
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 backdrop-blur-sm">
                  RUET
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                for RUET students
              </p>
            </div>
          </div>

          {/* Global Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search CSE courses, notes, question bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.08] backdrop-blur-md transition-all shadow-inner"
            />
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl backdrop-blur-md transition-all shadow-sm flex items-center gap-1.5 cursor-pointer group"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                  <span className="hidden xl:inline text-xs font-medium text-slate-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
                  <span className="hidden xl:inline text-xs font-medium text-slate-300">Dark</span>
                </>
              )}
            </button>

            {/* Quick Role Switcher */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 rounded-xl text-xs backdrop-blur-md transition-all cursor-pointer shadow-sm">
                <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400 hidden sm:inline">Role:</span>
                <span className="font-semibold text-white capitalize">{currentUser.role}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Role Dropdown menu */}
              <div className="absolute right-0 mt-2 w-56 bg-[#0a1226]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl py-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10">
                  Switch Active Role (Demo)
                </div>
                {(['student', 'cr', 'teacher', 'admin', 'guest'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => onSelectRole(r)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer ${
                      currentUser.role === r ? 'text-cyan-300 font-bold bg-cyan-500/15' : 'text-slate-300'
                    }`}
                  >
                    <span className="capitalize">{r === 'cr' ? 'Class Representative (CR)' : r}</span>
                    {currentUser.role === r && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Moderation Bell for CR, Teacher, Admin */}
            {['cr', 'teacher', 'admin'].includes(currentUser.role) && (
              <button
                onClick={onOpenModeration}
                className="relative p-2 text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl backdrop-blur-md transition-all shadow-sm cursor-pointer"
                title="Moderation & Verification Desk"
              >
                <Bell className="w-4 h-4" />
                {totalPending > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center px-1.5 py-0.2 bg-rose-500 text-white font-bold text-[10px] rounded-full ring-2 ring-[#070e1f] shadow-lg shadow-rose-500/50 animate-pulse">
                    {totalPending}
                  </span>
                )}
              </button>
            )}

            {/* User Profile Capsule with Interactive Dropdown & Edit Profile */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-2.5 py-1 pr-1.5 sm:pr-2 border-l border-white/10 hover:bg-white/[0.06] rounded-xl transition-all cursor-pointer group"
                title="Account & Profile Settings"
              >
                <div className="relative w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-semibold text-white overflow-hidden shadow-inner group-hover:border-cyan-400/50 transition-colors">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{currentUser.name.charAt(0)}</span>
                  )}
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-[#070e1f] rounded-full" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[120px] group-hover:text-white">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium border backdrop-blur-sm ${badge.bg}`}>
                      {badge.icon}
                      <span>{currentUser.role.toUpperCase()}</span>
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0a1226]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-200">
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-base font-bold text-white overflow-hidden shadow-md">
                      {currentUser.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{currentUser.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-semibold border ${badge.bg}`}>
                          {badge.icon}
                          <span>{currentUser.role.toUpperCase()}</span>
                        </span>
                        {currentUser.roll && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            #{currentUser.roll}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions List */}
                  <div className="py-2 space-y-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenEditProfile();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-white hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/20 rounded-xl transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Camera className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Edit Profile & Avatar</span>
                      </div>
                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                    </button>

                    <button
                      onClick={() => {
                        onToggleTheme();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {theme === 'dark' ? (
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                        <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                        {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition flex items-center justify-between cursor-pointer mt-1"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span className="font-semibold">Log Out</span>
                      </div>
                      <span className="text-[10px] text-rose-400/80 bg-rose-500/10 px-1.5 py-0.5 rounded font-mono">
                        Sign out
                      </span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 flex items-center justify-between px-1">
                    <span>RUET CSE '20 Series</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> Verified Student
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

