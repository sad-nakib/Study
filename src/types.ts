export interface Subject {
  id: string;
  name: string;
  code?: string;
  description?: string;
  color: string;
  icon?: string;
  order: number;
}

export interface StudyClass {
  id: string;
  subjectId: string;
  title: string;
  youtubeUrl: string;
  driveSheetUrl: string;
  bookPdfUrl?: string;
  topic?: string;
  instructor?: string;
  dateAdded: string;
  isCompleted?: boolean;
}

export type ActiveScreen = 'home' | 'subject' | 'editor' | 'practice';

export interface EditorFormState {
  mode: 'add_class' | 'add_subject' | 'edit_class' | 'edit_subject';
  classData?: Partial<StudyClass>;
  subjectData?: Partial<Subject>;
}

export type ExamTarget = 'bup_fbs' | 'ju_iba' | 'ru_iba' | 'all' | 'custom';
export type QuestionSubject = 'english' | 'math' | 'gk' | 'analytical';

export interface PracticeQuestion {
  id: string;
  subject: QuestionSubject;
  topic?: string;
  targetExam?: string;
  passage?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  formulaOrRule?: string;
  sourceSheet?: string;
}

export interface ExamConfig {
  target: ExamTarget;
  targetName: string;
  subjectFilter?: QuestionSubject | 'all';
  specificSubjectId?: string;
  specificClassId?: string;
  specificClassName?: string;
  questionCount: number;
  timeLimitMinutes: number;
  negativeMarking: number; // e.g. 0.25
  aiModel?: string;
}

export interface SectionScore {
  total: number;
  answered: number;
  correct: number;
  incorrect: number;
  marks: number;
}

export interface ExamResult {
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  positiveMarks: number;
  negativeMarks: number;
  netScore: number;
  maxScore: number;
  accuracyPercentage: number;
  timeTakenSeconds: number;
  passed: boolean;
  sectionScores: Record<string, SectionScore>;
  completedAt: string;
}

export type ActivityType = 
  | 'class_start' 
  | 'sheet_open' 
  | 'book_open' 
  | 'practice_start' 
  | 'practice_complete' 
  | 'class_complete'
  | 'subject_view';

export interface ActivityMetadata {
  classId?: string;
  className?: string;
  subjectId?: string;
  subjectName?: string;
  score?: number;
  maxScore?: number;
  accuracy?: number;
  targetExam?: string;
  questionCount?: number;
  durationSeconds?: number;
  url?: string;
}

export interface ActivityLog {
  id: string;
  type: ActivityType;
  title: string;
  details?: string;
  subjectName?: string;
  timestamp: string; // ISO 8601 string
  formattedDate: string; // e.g. "Aug 24, 2026"
  formattedTime: string; // e.g. "03:45 PM"
  metadata?: ActivityMetadata;
}


