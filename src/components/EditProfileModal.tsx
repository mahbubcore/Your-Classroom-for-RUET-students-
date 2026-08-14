import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Link as LinkIcon,
  Sparkles,
  User as UserIcon,
  Check,
  RotateCcw,
  Mail,
  Hash,
  BookOpen,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { User, UserRole } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveProfile: (updatedUser: User) => void;
}

// Curated avatar presets for RUET students, CRs, faculty, and admins
const AVATAR_PRESETS = [
  {
    id: 'student-1',
    label: 'Student (Male 1)',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-2',
    label: 'Student (Female 1)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-3',
    label: 'Student (Male 2)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'student-4',
    label: 'Student (Female 2)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'teacher-1',
    label: 'Faculty / Professor',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'teacher-2',
    label: 'Faculty (Researcher)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-tech',
    label: 'Tech Enthusiast',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-coder',
    label: 'Coder & Problem Solver',
    url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&auto=format&fit=crop&q=80',
  },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [roll, setRoll] = useState(currentUser.roll || '');
  const [series, setSeries] = useState(currentUser.series || "'20 Series");
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [bio, setBio] = useState(
    currentUser.role === 'teacher'
      ? 'Faculty Member • Department of Computer Science & Engineering'
      : currentUser.role === 'cr'
      ? 'Class Representative • 20 Series Section B'
      : '3rd Year Student • RUET CSE'
  );
  const [activeAvatarTab, setActiveAvatarTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [isSavedToast, setIsSavedToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file upload with FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (customUrlInput.trim()) {
      setAvatarUrl(customUrlInput.trim());
      setCustomUrlInput('');
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: User = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      roll: roll.trim() || undefined,
      series: series.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
    };

    onSaveProfile(updated);
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0a1226]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-200 my-8">
        {/* Header decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Edit Profile</h2>
              <p className="text-xs text-slate-400">
                Update your avatar, personal credentials, and academic details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10 max-h-[75vh] overflow-y-auto">
          {/* Avatar Edit Section */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-4 shadow-lg shadow-black/20">
            <label className="block text-xs font-bold text-white uppercase tracking-wider">
              Profile Picture & Avatar
            </label>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-950 to-blue-900 border-2 border-cyan-400/40 flex items-center justify-center text-2xl font-bold text-white overflow-hidden shadow-xl shadow-cyan-500/10">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{name.charAt(0) || 'U'}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 bg-cyan-500 hover:bg-cyan-400 text-[#050b18] rounded-xl shadow-lg border border-cyan-300 font-bold transition-transform hover:scale-110 cursor-pointer"
                  title="Upload from device"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Avatar Options Tabs */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveAvatarTab('presets')}
                    className={`flex-1 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                      activeAvatarTab === 'presets'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Preset Photos
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAvatarTab('upload')}
                    className={`flex-1 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                      activeAvatarTab === 'upload'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAvatarTab('url')}
                    className={`flex-1 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                      activeAvatarTab === 'url'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Paste URL
                  </button>
                </div>

                {/* Preset Avatars Grid */}
                {activeAvatarTab === 'presets' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                      {AVATAR_PRESETS.map((preset) => {
                        const isSelected = avatarUrl === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setAvatarUrl(preset.url)}
                            className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                              isSelected
                                ? 'border-cyan-400 shadow-lg shadow-cyan-500/30 scale-105'
                                : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                            }`}
                            title={preset.label}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-cyan-500/30 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white drop-shadow" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Upload File View */}
                {activeAvatarTab === 'upload' && (
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 hover:border-cyan-400/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.05]"
                    >
                      <Upload className="w-5 h-5 mx-auto text-cyan-400 mb-1" />
                      <p className="text-xs font-semibold text-white">Click to select photo from device</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  </div>
                )}

                {/* URL input View */}
                {activeAvatarTab === 'url' && (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="url"
                        placeholder="https://example.com/my-photo.jpg"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      disabled={!customUrlInput.trim()}
                      className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#050b18] text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Reset / Remove Button */}
                {avatarUrl && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Remove Picture (Use Initials)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal & Academic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nafis Sadik"
                className="w-full px-3.5 py-2.5 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.07] transition"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. 2003045@student.ruet.ac.bd"
                className="w-full px-3.5 py-2.5 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.07] transition"
              />
            </div>

            {/* Roll Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                <span>7-Digit Roll Number</span>
              </label>
              <input
                type="text"
                maxLength={7}
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                placeholder="e.g. 2003045"
                className="w-full px-3.5 py-2.5 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.07] transition"
              />
            </div>

            {/* Series / Batch */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Series / Academic Title</span>
              </label>
              <input
                type="text"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                placeholder="e.g. '20 Series or Faculty"
                className="w-full px-3.5 py-2.5 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.07] transition"
              />
            </div>
          </div>

          {/* Department Information (Fixed RUET) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Department</span>
            </label>
            <div className="px-3.5 py-2.5 text-xs bg-white/[0.02] border border-white/10 rounded-xl text-slate-300 flex items-center justify-between">
              <span>Department of Computer Science & Engineering (Code: 03)</span>
              <span className="text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded">
                RUET
              </span>
            </div>
          </div>

          {/* Bio / Status Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bio / Academic Focus</span>
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. 3rd Year CSE student • Operating Systems & Database management focus"
              className="w-full px-3.5 py-2 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.07] transition resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-[11px] text-slate-400">
              Role: <strong className="text-white capitalize">{currentUser.role}</strong>
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-[#050b18] bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isSavedToast ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
