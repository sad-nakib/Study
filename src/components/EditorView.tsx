import React, { useState, useEffect } from 'react';
import { Subject, StudyClass } from '../types';
import { 
  ArrowLeft, 
  Plus, 
  FolderPlus, 
  Youtube, 
  FileText, 
  BookOpen, 
  Save, 
  Edit3, 
  Trash2, 
  Layers, 
  Check, 
  ExternalLink,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface EditorViewProps {
  subjects: Subject[];
  classes: StudyClass[];
  initialMode?: 'add_class' | 'add_subject';
  initialSubjectId?: string;
  onBack: () => void;
  onAddClass: (data: {
    subjectId: string;
    title: string;
    youtubeUrl: string;
    driveSheetUrl?: string;
    bookPdfUrl?: string;
    topic?: string;
    instructor?: string;
  }) => Promise<any>;
  onUpdateClass: (id: string, data: Partial<StudyClass>) => Promise<any>;
  onDeleteClass: (id: string) => Promise<any>;
  onAddSubject: (data: { name: string; code?: string; description?: string; color?: string }) => Promise<any>;
  onUpdateSubject: (id: string, data: Partial<Subject>) => Promise<any>;
  onDeleteSubject: (id: string) => Promise<any>;
  onResetData: () => Promise<any>;
}

export const EditorView: React.FC<EditorViewProps> = ({
  subjects,
  classes,
  initialMode = 'add_class',
  initialSubjectId,
  onBack,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onResetData,
}) => {
  const [tab, setTab] = useState<'classes' | 'subjects'>(initialMode === 'add_subject' ? 'subjects' : 'classes');
  
  // Class Form State
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [classSubjectId, setClassSubjectId] = useState<string>(initialSubjectId || subjects[0]?.id || '');
  const [classTitle, setClassTitle] = useState<string>('');
  const [classYoutubeUrl, setClassYoutubeUrl] = useState<string>('');
  const [classDriveSheetUrl, setClassDriveSheetUrl] = useState<string>('');
  const [classBookPdfUrl, setClassBookPdfUrl] = useState<string>('');
  const [classTopic, setClassTopic] = useState<string>('');
  const [classInstructor, setClassInstructor] = useState<string>('');

  // Subject Form State
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState<string>('');
  const [subjectCode, setSubjectCode] = useState<string>('');
  const [subjectDescription, setSubjectDescription] = useState<string>('');
  const [subjectColor, setSubjectColor] = useState<string>('indigo');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (subjects.length > 0 && !classSubjectId) {
      setClassSubjectId(subjects[0].id);
    }
  }, [subjects, classSubjectId]);

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Submit Class Handler
  const handleSubmitClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classSubjectId || !classTitle.trim() || !classYoutubeUrl.trim()) {
      alert('Please select a Subject and enter Class Title and YouTube link.');
      return;
    }

    if (editingClassId) {
      await onUpdateClass(editingClassId, {
        subjectId: classSubjectId,
        title: classTitle.trim(),
        youtubeUrl: classYoutubeUrl.trim(),
        driveSheetUrl: classDriveSheetUrl.trim(),
        bookPdfUrl: classBookPdfUrl.trim() || undefined,
        topic: classTopic.trim() || undefined,
        instructor: classInstructor.trim() || undefined,
      });
      showNotification('Class updated successfully on backend!');
      setEditingClassId(null);
    } else {
      await onAddClass({
        subjectId: classSubjectId,
        title: classTitle.trim(),
        youtubeUrl: classYoutubeUrl.trim(),
        driveSheetUrl: classDriveSheetUrl.trim(),
        bookPdfUrl: classBookPdfUrl.trim() || undefined,
        topic: classTopic.trim() || undefined,
        instructor: classInstructor.trim() || undefined,
      });
      showNotification('New class saved to backend!');
    }

    // Reset Form
    setClassTitle('');
    setClassYoutubeUrl('');
    setClassDriveSheetUrl('');
    setClassBookPdfUrl('');
    setClassTopic('');
    setClassInstructor('');
  };

  // Start Edit Class
  const handleEditClassClick = (c: StudyClass) => {
    setEditingClassId(c.id);
    setClassSubjectId(c.subjectId);
    setClassTitle(c.title);
    setClassYoutubeUrl(c.youtubeUrl);
    setClassDriveSheetUrl(c.driveSheetUrl || '');
    setClassBookPdfUrl(c.bookPdfUrl || '');
    setClassTopic(c.topic || '');
    setClassInstructor(c.instructor || '');
    setTab('classes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Edit Class
  const handleCancelEditClass = () => {
    setEditingClassId(null);
    setClassTitle('');
    setClassYoutubeUrl('');
    setClassDriveSheetUrl('');
    setClassBookPdfUrl('');
    setClassTopic('');
    setClassInstructor('');
  };

  // Submit Subject Handler
  const handleSubmitSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      alert('Please enter a subject name.');
      return;
    }

    if (editingSubjectId) {
      await onUpdateSubject(editingSubjectId, {
        name: subjectName.trim(),
        code: subjectCode.trim() || undefined,
        description: subjectDescription.trim() || undefined,
        color: subjectColor,
      });
      showNotification('Subject updated successfully on backend!');
      setEditingSubjectId(null);
    } else {
      await onAddSubject({
        name: subjectName.trim(),
        code: subjectCode.trim() || undefined,
        description: subjectDescription.trim() || undefined,
        color: subjectColor,
      });
      showNotification('New subject created on backend!');
    }

    setSubjectName('');
    setSubjectCode('');
    setSubjectDescription('');
    setSubjectColor('indigo');
  };

  // Start Edit Subject
  const handleEditSubjectClick = (s: Subject) => {
    setEditingSubjectId(s.id);
    setSubjectName(s.name);
    setSubjectCode(s.code || '');
    setSubjectDescription(s.description || '');
    setSubjectColor(s.color || 'indigo');
    setTab('subjects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const colors = ['indigo', 'emerald', 'amber', 'rose', 'sky', 'purple'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Back to Home Tiles"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Admin & Link Manager
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Editor: Add & Manage Links
            </h1>
          </div>
        </div>

        {/* Tab Toggle: Manage Classes vs Manage Subjects */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setTab('classes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'classes'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Add & Manage Classes ({classes.length})
          </button>
          <button
            onClick={() => setTab('subjects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'subjects'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Add & Manage Subjects ({subjects.length})
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* TAB 1: ADD & MANAGE CLASSES */}
      {tab === 'classes' && (
        <div className="space-y-6">
          
          {/* Add / Edit Class Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingClassId ? 'Edit Class & Links' : 'Add New Class'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Paste YouTube video link & Google Drive sheet link for this class
                  </p>
                </div>
              </div>
              {editingClassId && (
                <button
                  onClick={handleCancelEditClass}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitClass} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Choose Subject */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Subject <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={classSubjectId}
                    onChange={(e) => setClassSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code || 'Subject'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Class Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={classTitle}
                    onChange={(e) => setClassTitle(e.target.value)}
                    placeholder="e.g. Class 04: Grammar & Modifiers"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* YouTube Link & Drive Sheet Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    YouTube Class Link (Video URL) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      value={classYoutubeUrl}
                      onChange={(e) => setClassYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <Youtube className="w-4 h-4 text-red-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Google Drive Sheet / Slides Link
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={classDriveSheetUrl}
                      onChange={(e) => setClassDriveSheetUrl(e.target.value)}
                      placeholder="https://docs.google.com/document/d/... or drive link"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FileText className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Optional Book/PDF Link & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Study Material / Book PDF Link (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={classBookPdfUrl}
                      onChange={(e) => setClassBookPdfUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/... or textbook link"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <BookOpen className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Topic / Instructor (Optional)
                  </label>
                  <input
                    type="text"
                    value={classTopic}
                    onChange={(e) => setClassTopic(e.target.value)}
                    placeholder="e.g. Topic: Active Voice | Prof. David"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingClassId ? 'Update Class in Firestore' : 'Save Class to Firebase'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Existing Classes */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              All Saved Classes ({classes.length})
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {classes.map((cls) => {
                const subject = subjects.find((s) => s.id === cls.subjectId);
                return (
                  <div
                    key={cls.id}
                    className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {subject && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {subject.name}
                          </span>
                        )}
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {cls.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        <a
                          href={cls.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                        >
                          <Youtube className="w-3.5 h-3.5" />
                          <span>YouTube Link</span>
                        </a>
                        {cls.driveSheetUrl && (
                          <a
                            href={cls.driveSheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Drive Sheet</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleEditClassClick(cls)}
                        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${cls.title}"?`)) {
                            onDeleteClass(cls.id);
                          }
                        }}
                        className="p-2 rounded-xl text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADD & MANAGE SUBJECTS */}
      {tab === 'subjects' && (
        <div className="space-y-6">
          
          {/* Add / Edit Subject Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingSubjectId ? 'Edit Subject' : 'Add New Subject'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Creates a new subject tile on the main home screen
                  </p>
                </div>
              </div>
              {editingSubjectId && (
                <button
                  onClick={() => {
                    setEditingSubjectId(null);
                    setSubjectName('');
                    setSubjectCode('');
                    setSubjectDescription('');
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitSubject} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g. Physics, Bangla, ICT, Chemistry"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject Code (Short)
                  </label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="e.g. PHY, BAN, ICT"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Subject Theme Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSubjectColor(c)}
                      className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        subjectColor === c
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Description / Topic Focus (Optional)
                </label>
                <input
                  type="text"
                  value={subjectDescription}
                  onChange={(e) => setSubjectDescription(e.target.value)}
                  placeholder="Short summary of this subject..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>{editingSubjectId ? 'Update Subject in Firestore' : 'Create Subject in Firebase'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Existing Subjects */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              All Subjects ({subjects.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((s) => {
                const count = classes.filter((c) => c.subjectId === s.id).length;
                return (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {s.name}
                        </span>
                        {s.code && (
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                            {s.code}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {count} {count === 1 ? 'Class' : 'Classes'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditSubjectClick(s)}
                        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-semibold transition-colors shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete subject "${s.name}" and all its classes?`)) {
                            onDeleteSubject(s.id);
                          }
                        }}
                        className="p-2 rounded-xl text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-xs font-semibold transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset to defaults option */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => {
                if (window.confirm('Reset data to default English, Math, and GK curriculum?')) {
                  onResetData();
                  showNotification('Reset to sample subjects & classes');
                }
              }}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-rose-600 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default English, Math, GK Samples</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
