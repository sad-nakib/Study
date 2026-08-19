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
}

export type ActiveScreen = 'home' | 'subject' | 'editor';

export interface EditorFormState {
  mode: 'add_class' | 'add_subject' | 'edit_class' | 'edit_subject';
  classData?: Partial<StudyClass>;
  subjectData?: Partial<Subject>;
}
