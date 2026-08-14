export type UserRole = 'student' | 'cr' | 'teacher' | 'admin' | 'guest';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  roll?: string; // 7 digits, e.g. "2003045"
  role: UserRole;
  departmentCode: string; // "03" for CSE
  departmentName: string; // "Computer Science & Engineering"
  batch: string; // "20" (from first 2 digits of roll)
  series: string; // "'20 Series"
  verificationStatus: VerificationStatus;
  idCardPhotoUrl?: string;
  approvedBy?: string; // Teacher or CR ID
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  isFirstLogin?: boolean;
  avatarUrl?: string;
  ocrConfidence?: number;
  ocrExtractedRoll?: string;
  ocrExtractedName?: string;
}

export interface Department {
  code: string; // "03"
  name: string; // "Computer Science & Engineering"
  shortName: string; // "CSE"
}

export interface Course {
  id: string;
  code: string; // "CSE 3101"
  title: string; // "Database Management Systems"
  departmentCode: string;
  year: number; // 3
  term: number; // 1
  credits: number; // 3.0
  description: string;
  instructor?: string;
  tags: string[];
}

export type ContentType = 'course_material' | 'class_note' | 'assignment' | 'notice';
export type ContentStatus = 'pending' | 'approved' | 'rejected';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  courseCode?: string;
  courseTitle?: string;
  batch?: string;
  departmentCode: string;
  uploaderId: string;
  uploaderName: string;
  uploaderRoll?: string;
  uploaderRole: UserRole;
  status: ContentStatus;
  fileUrl?: string;
  fileType?: string;
  fileSize?: string;
  externalLink?: string;
  dueDate?: string; // for assignments
  totalMarks?: number; // for assignments
  submittedCount?: number; // for assignments
  isPinned?: boolean; // for notices
  priority?: 'low' | 'normal' | 'urgent'; // for notices
  approverId?: string;
  approverName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  downloadCount: number;
}

export interface QuestionBankEntry {
  id: string;
  courseCode: string;
  courseTitle: string;
  year: number; // 2024, 2023, 2022, 2021, 2020, 2019
  termExamType: 'Semester Final (Section A)' | 'Semester Final (Section B)' | 'Class Test (CT-1)' | 'Class Test (CT-2)' | 'Class Test (CT-3)' | 'Backlog Exam';
  departmentCode: string;
  topicsCovered: string[];
  pdfUrl?: string;
  questions: {
    questionNo: string;
    text: string;
    marks: number;
    topic: string;
    recurringCountLast5Years: number;
  }[];
  uploadedBy: string;
  uploadedAt: string;
}

export interface ExamPrediction {
  courseCode: string;
  courseTitle: string;
  confidenceScore: number;
  analyzedPapersCount: number;
  recurringTopics: {
    topic: string;
    frequency: number; // e.g. 4 (out of 5 years)
    yearsAppeared: number[];
    importance: 'High' | 'Medium' | 'Low';
    probableQuestions: {
      question: string;
      expectedMarks: number;
      predictionRationale: string;
      sourceCitations: string[];
    }[];
  }[];
  summaryAdvice: string;
  generatedAt: string;
  isCached?: boolean;
}

export interface MCQQuestion {
  id: string;
  courseCode: string;
  courseTitle?: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  sourceCitation?: string;
  createdAt?: string;
  isAiGenerated?: boolean;
  authorName?: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderRoll?: string;
  content: string;
  timestamp: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export interface Thread {
  id: string;
  title: string;
  type: 'course_channel' | 'direct_message' | 'batch_channel';
  courseCode?: string;
  batch?: string;
  participants: string[]; // user IDs
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 'approve_user' | 'reject_user' | 'approve_content' | 'reject_content' | 'delete_content' | 'upload_content' | 'reset_password' | 'update_profile' | 'register_request';
  targetType: 'user' | 'content' | 'system';
  targetId: string;
  targetDescription: string;
  timestamp: string;
  details?: string;
}
