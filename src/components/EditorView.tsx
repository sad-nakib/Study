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
  Check, 
  AlertCircle,
  RotateCcw,
  Loader2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

interface EditorViewProps {
  subjects: Subject[];
  classes: StudyClass[];
  initialMode?: 'add_class' | 'add_subject';
  initialSubjectId?: string;
  onBack: () => void;
  onLock?: () => void;
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
  onLock,
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
  const [classSubjectId, setClassSubjectId] = useState<string>(initialSubjectId || (subjects[0]?.id ?? ''));
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

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (subjects.length > 0 && (!classSubjectId || !subjects.some(s => s.id === classSubjectId))) {
      setClassSubjectId(initialSubjectId || subjects[0].id);
    }
  }, [subjects, classSubjectId, initialSubjectId]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Submit Class Handler
  const handleSubmitClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classSubjectId) {
      alert('Please select a subject for this class.');
      return;
    }
    if (!classTitle.trim()) {
      alert('Please enter a class title.');
      return;
    }
    if (!classYoutubeUrl.trim()) {
      alert('Please enter a YouTube video URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingClassId) {
        await onUpdateClass(editingClassId, {
          subjectId: classSubjectId,
          title: classTitle.trim(),
          youtubeUrl: classYoutubeUrl.trim(),
          driveSheetUrl: classDriveSheetUrl.trim(),
          bookPdfUrl: classBookPdfUrl.trim(),
          topic: classTopic.trim(),
          instructor: classInstructor.trim(),
        });
        showNotification('Class updated successfully in Firebase Firestore!');
        setEditingClassId(null);
      } else {
        await onAddClass({
          subjectId: classSubjectId,
          title: classTitle.trim(),
          youtubeUrl: classYoutubeUrl.trim(),
          driveSheetUrl: classDriveSheetUrl.trim(),
          bookPdfUrl: classBookPdfUrl.trim(),
          topic: classTopic.trim(),
          instructor: classInstructor.trim(),
        });
        showNotification('New class added and saved to Firebase Firestore!');
      }

      // Reset Form fields
      setClassTitle('');
      setClassYoutubeUrl('');
      setClassDriveSheetUrl('');
      setClassBookPdfUrl('');
      setClassTopic('');
      setClassInstructor('');
    } catch (err: any) {
      console.error('Error saving class:', err);
      showNotification(`Failed to save class: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
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

    setIsSubmitting(true);
    try {
      if (editingSubjectId) {
        await onUpdateSubject(editingSubjectId, {
          name: subjectName.trim(),
          code: subjectCode.trim(),
          description: subjectDescription.trim(),
          color: subjectColor,
        });
        showNotification('Subject updated successfully in Firebase!');
        setEditingSubjectId(null);
      } else {
        await onAddSubject({
          name: subjectName.trim(),
          code: subjectCode.trim(),
          description: subjectDescription.trim(),
          color: subjectColor,
        });
        showNotification('New subject created and saved to Firebase!');
      }

      setSubjectName('');
      setSubjectCode('');
      setSubjectDescription('');
      setSubjectColor('indigo');
    } catch (err: any) {
      console.error('Error saving subject:', err);
      showNotification(`Failed to save subject: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
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

  const colors = [
    { key: 'indigo', label: 'Purple', bg: 'bg-[#6750A4]' },
    { key: 'emerald', label: 'Emerald', bg: 'bg-[#2E6C3B]' },
    { key: 'amber', label: 'Amber', bg: 'bg-[#8C5000]' },
    { key: 'rose', label: 'Rose', bg: 'bg-[#984061]' },
    { key: 'sky', label: 'Blue', bg: 'bg-[#006399]' },
    { key: 'purple', label: 'Mauve', bg: 'bg-[#7D5260]' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Material 3 Editor Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-7 rounded-[32px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-[#E8DEF8] text-[#1D192B] hover:bg-[#D0BCFF] active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs"
            title="Back to Home Tiles"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-medium px-3 py-0.5 rounded-full bg-[#EADDFF] text-[#21005D]">
              Admin & Resource Manager
            </span>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1C1B1F] mt-1">
              Editor: Add & Manage Links
            </h1>
          </div>
        </div>

        {/* Material 3 Segmented Toggle & Lock */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-[#E8DEF8] rounded-full">
            <button
              onClick={() => setTab('classes')}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                tab === 'classes'
                  ? 'bg-[#6750A4] text-white shadow-xs'
                  : 'text-[#49454F] hover:text-[#1C1B1F]'
              }`}
            >
              Classes ({classes.length})
            </button>
            <button
              onClick={() => setTab('subjects')}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                tab === 'subjects'
                  ? 'bg-[#6750A4] text-white shadow-xs'
                  : 'text-[#49454F] hover:text-[#1C1B1F]'
              }`}
            >
              Subjects ({subjects.length})
            </button>
          </div>

          {onLock && (
            <button
              onClick={onLock}
              className="h-10 flex items-center gap-1.5 px-4 rounded-full bg-[#FFD8E4] text-[#31111D] hover:bg-[#FFB0C8] text-xs font-medium active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
              title="Lock and exit editor"
            >
              <Lock className="w-3.5 h-3.5 text-[#7D5260]" />
              <span>Lock</span>
            </button>
          )}
        </div>
      </div>

      {/* Material 3 Snackbar Notification */}
      {feedbackMsg && (
        <div className={`p-4 px-6 rounded-full text-sm font-medium flex items-center gap-3 shadow-md animate-in fade-in ${
          feedbackMsg.type === 'success' ? 'bg-[#1B5E20] text-[#C4EED0]' : 'bg-[#B3261E] text-[#F9DEDC]'
        }`}>
          {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* TAB 1: ADD & MANAGE CLASSES */}
      {tab === 'classes' && (
        <div className="space-y-8">
          
          {/* Add / Edit Class Form Card */}
          <div className="p-8 rounded-[32px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#CAC4D0]/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#B3261E]/10 text-[#B3261E] flex items-center justify-center">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-[#1C1B1F]">
                    {editingClassId ? 'Edit Class & Resource Links' : 'Add New Class'}
                  </h2>
                  <p className="text-xs text-[#49454F]">
                    Attach YouTube video & Google Drive lecture sheet links
                  </p>
                </div>
              </div>
              {editingClassId && (
                <button
                  onClick={handleCancelEditClass}
                  className="h-9 px-4 rounded-full text-xs font-medium text-[#49454F] bg-[#E8DEF8] hover:bg-[#D0BCFF] transition-colors cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitClass} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Choose Subject */}
                <div>
                  <label className="block text-xs font-medium text-[#49454F] uppercase tracking-wider mb-1.5">
                    Select Subject *
                  </label>
                  {subjects.length === 0 ? (
                    <div className="p-3 bg-[#FFDDB3]/40 text-[#603500] text-xs rounded-xl border border-[#8C5000]/30">
                      No subjects available. Please add a subject in the "Subjects" tab.
                    </div>
                  ) : (
                    <select
                      required
                      value={classSubjectId}
                      onChange={(e) => setClassSubjectId(e.target.value)}
                      className="w-full h-13 px-4 text-sm bg-[#E7E0EC] text-[#1C1B1F] rounded-t-xl rounded-b-none border-b-2 border-[#79747E] focus:border-[#6750A4] focus:outline-none cursor-pointer font-medium"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code || 'Subject'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Class Title */}
                <div>
                  <label className="block text-xs font-medium text-[#49454F] uppercase tracking-wider mb-1.5">
                    Class Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={classTitle}
                    onChange={(e) => setClassTitle(e.target.value)}
                    placeholder="e.g. Class 04: Grammar & Modifiers"
                    className="w-full h-13 px-4 text-sm bg-[#E7E0EC] text-[#1C1B1F] rounded-t-xl rounded-b-none border-b-2 border-[#79747E] focus:border-[#6750A4] focus:outline-none"
                  />
                </div>
              </div>

              {/* YouTube Link & Drive Sheet Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-[#49454F] uppercase tracking-wider mb-1.5">
                    YouTube Class Link (Video URL) *
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      value={classYoutubeUrl}
                      onChange={(e) => setClassYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full h-13 pl-11 pr-4 text-sm bg-[#E7E0EC] text-[#1C1B1F] rounded-t-xl rounded-b-none border-b-2 border-[#79747E] focus:border-[#B3261E] focus:outline-none"
                    />
                    <Youtube className="w-5 h-5 text-[#B3261E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#49454F] uppercase tracking-wider mb-1.5">
                    Google Drive Sheet / Slides Link
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={classDriveSheetUrl}
                      onChange={(e) => setClassDriveSheetUrl(e.target.value)}
                      placeholder="https://docs.google.com/document/d/... or drive link"
                      className="w-full h-13 pl-11 pr-4 text-sm bg-[#E7E0EC] text-[#1C1B1F] rounded-t-xl rounded-b-none border-b-2 border-[#79747E] focus:border-[#006399] focus:outline-none"
                    />
                    <FileText className="w-5 h-5 text-[#006399] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Optional Book/PDF Link & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-[#49454F] uppercase tracking-wider mb-1.5">
                    Study Material / Book PDF Link (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={classBookPdfUrl}
                      onChange={(e) => setClassBookPdfUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/... or textbook link"
                      className="w-full h-13 pl-11 pr-4 text-sm bg-[#E7E0EC] text-[#1C1B1F] rounded-t-xl rounded-b-none border-b-2 border-[#79747E] focus:border-[#2E6C3B] focus:outline-none"
                    />
                    <BookOpen className="w-5 h-5 text-[#2E6C3B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#49454F] uppercase tracking-wider mb-1.5">
                    Topic / Instructor (Optional)
                  </label>
                  <input
                    type="text"
                    value={classTopic}
                    onChange={(e) => setClassTopic(e.target.value)}
                    placeholder="e.g. Topic: Active Voice | Prof. David"
                    className="w-full h-13 px-4 text-sm bg-[#E7E0EC] text-[#1C1B1F] rounded-t-xl rounded-b-none border-b-2 border-[#79747E] focus:border-[#6750A4] focus:outline-none"
                  />
                </div>
              </div>

              {/* Material 3 Pill Action Button */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting || subjects.length === 0}
                  className="h-12 px-7 rounded-full bg-[#6750A4] hover:bg-[#593E96] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingClassId ? 'Update Class in Firestore' : 'Save Class to Firebase'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* List of Existing Classes Card */}
          <div className="p-8 rounded-[32px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-xs space-y-4">
            <h3 className="text-lg font-medium text-[#1C1B1F]">
              All Saved Classes ({classes.length})
            </h3>

            {classes.length === 0 ? (
              <p className="text-xs text-[#49454F] py-6 text-center">No classes stored in Firebase yet.</p>
            ) : (
              <div className="divide-y divide-[#CAC4D0]/30">
                {classes.map((cls) => {
                  const subject = subjects.find((s) => s.id === cls.subjectId);
                  return (
                    <div
                      key={cls.id}
                      className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {subject && (
                            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#E8DEF8] text-[#1D192B]">
                              {subject.name}
                            </span>
                          )}
                          <span className="text-sm font-medium text-[#1C1B1F]">
                            {cls.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#49454F] mt-1.5 flex-wrap">
                          <a
                            href={cls.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#B3261E] hover:underline flex items-center gap-1"
                          >
                            <Youtube className="w-3.5 h-3.5" />
                            <span>YouTube Video</span>
                          </a>
                          {cls.driveSheetUrl && (
                            <a
                              href={cls.driveSheetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#006399] hover:underline flex items-center gap-1"
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
                          className="h-9 px-4 rounded-full bg-[#E8DEF8] text-[#1D192B] hover:bg-[#D0BCFF] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#6750A4]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete "${cls.title}"?`)) {
                              await onDeleteClass(cls.id);
                              showNotification('Class removed from Firebase');
                            }
                          }}
                          className="h-9 px-4 rounded-full bg-[#FFD8E4] text-[#31111D] hover:bg-[#FFB0C8] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#7D5260]" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ADD & MANAGE SUBJECTS */}
      {tab === 'subjects' && (
        <div className="space-y-8">
          
          {/* Add / Edit Subject Form Card */}
          <div className="p-8 rounded-[32px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#CAC4D0]/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EADDFF] text-[#21005D] flex items-center justify-center">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-[#1C1B1F]">
                    {editingSubjectId ? 'Edit Subject Details' : 'Add New Subject'}
                  </h2>
                  <p className="text-xs text-[#49454F]">
                    Creates a personalized Material You subject card on the home screen
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
                  className="h-9 px-4 rounded-full text-xs font-medium text-[#49454F] bg-[#E8DEF8] hover:bg-[#D0BCFF] transition-colors cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitSubject} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-[#49454F] uppercase tracking-wider mb-1.5">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g. Physics, Bangla, ICT, Chemistry"
                    className="w-full h-13 px-4 text-sm bg-[#E7E0EC] text-[#1C1B1F] rounded-t-xl rounded-b-none border-b-2 border-[#79747E] focus:border-[#6750A4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#49454F] uppercase tracking-wider mb-1.5">
                    Subject Code (Short)
                  </label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="e.g. PHY, BAN, ICT"
                    className="w-full h-13 px-4 text-sm bg-[#E7E0EC] text-[#1C1B1F] rounded-t-xl rounded-b-none border-b-2 border-[#79747E] focus:border-[#6750A4] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#49454F] uppercase tracking-wider mb-2">
                  Theme Palette
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setSubjectColor(c.key)}
                      className={`h-11 rounded-full text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                        subjectColor === c.key
                          ? 'bg-[#EADDFF] text-[#21005D] ring-2 ring-[#6750A4] shadow-xs'
                          : 'bg-[#E7E0EC] text-[#49454F] hover:bg-[#DED8E1]'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${c.bg}`} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#49454F] uppercase tracking-wider mb-1.5">
                  Description / Topic Focus (Optional)
                </label>
                <input
                  type="text"
                  value={subjectDescription}
                  onChange={(e) => setSubjectDescription(e.target.value)}
                  placeholder="Short summary of this subject..."
                  className="w-full h-13 px-4 text-sm bg-[#E7E0EC] text-[#1C1B1F] rounded-t-xl rounded-b-none border-b-2 border-[#79747E] focus:border-[#6750A4] focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-7 rounded-full bg-[#6750A4] hover:bg-[#593E96] disabled:opacity-50 text-white font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Subject...</span>
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-4 h-4" />
                      <span>{editingSubjectId ? 'Update Subject in Firestore' : 'Create Subject in Firebase'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* List of Existing Subjects Card */}
          <div className="p-8 rounded-[32px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-xs space-y-4">
            <h3 className="text-lg font-medium text-[#1C1B1F]">
              All Subjects ({subjects.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((s) => {
                const count = classes.filter((c) => c.subjectId === s.id).length;
                return (
                  <div
                    key={s.id}
                    className="p-5 rounded-[24px] bg-[#FFFBFE] border border-[#CAC4D0]/40 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#1C1B1F]">
                          {s.name}
                        </span>
                        {s.code && (
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#E8DEF8] text-[#1D192B]">
                            {s.code}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#49454F] mt-1">
                        {count} {count === 1 ? 'Class' : 'Classes'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditSubjectClick(s)}
                        className="w-9 h-9 rounded-full bg-[#E8DEF8] text-[#1D192B] hover:bg-[#D0BCFF] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                        title="Edit Subject"
                      >
                        <Edit3 className="w-4 h-4 text-[#6750A4]" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete subject "${s.name}" and all its classes?`)) {
                            await onDeleteSubject(s.id);
                            showNotification('Subject and classes removed from Firebase');
                          }
                        }}
                        className="w-9 h-9 rounded-full bg-[#FFD8E4] text-[#31111D] hover:bg-[#FFB0C8] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-4 h-4 text-[#7D5260]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset to defaults option */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={async () => {
                if (window.confirm('Reset data in Firebase to default English, Math, and GK curriculum?')) {
                  await onResetData();
                  showNotification('Reset to sample subjects & classes in Firebase');
                }
              }}
              className="h-10 px-5 rounded-full flex items-center gap-2 text-xs font-medium text-[#49454F] hover:bg-[#E8DEF8] transition-colors cursor-pointer"
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
