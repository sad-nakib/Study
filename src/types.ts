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

