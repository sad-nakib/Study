import React, { useState } from 'react';
import { Subject, StudyClass } from '../types';
import { 
  ArrowLeft, 
  Youtube, 
  FileText, 
  BookOpen, 
  ExternalLink, 
  Play, 
  User, 
  BookMarked
} from 'lucide-react';

interface SubjectClassesViewProps {
  subject: Subject;
  classes: StudyClass[];
  onBack: () => void;
}

export const SubjectClassesView: React.FC<SubjectClassesViewProps> = ({
  subject,
  classes,
  onBack,
}) => {
  const [activeClassModal, setActiveClassModal] = useState<StudyClass | null>(null);

  const subjectClasses = classes.filter((c) => c.subjectId === subject.id);

  // Helper to open YouTube app/browser
  const handleOpenYoutube = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!url) {
      alert('No YouTube link available for this class.');
      return;
    }
    // Opens in new tab / triggers YouTube app on mobile
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Helper to open Google Drive sheet
  const handleOpenDriveSheet = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (!url) {
      alert('No Google Drive sheet link available for this class.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Helper to open Book PDF
  const handleOpenBookPdf = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (!url) {
      alert('No book PDF link available for this class.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Subject Header & Back Navigation */}
      <div className="flex items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Back to All Subjects"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {subject.code || 'COURSE'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {subjectClasses.length} {subjectClasses.length === 1 ? 'Class' : 'Classes'} available
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {subject.name}
            </h1>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <BookMarked className="w-3.5 h-3.5 text-indigo-500" />
          <span>Curriculum View</span>
        </div>
      </div>

      {/* Class Tiles Grid */}
      {subjectClasses.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-800">
            <Play className="w-8 h-8 ml-0.5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              No classes available in {subject.name} yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Classes and lecture sheets for this subject can be added in the Editor.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {subjectClasses.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActiveClassModal(item)}
              className="group relative cursor-pointer rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 p-6 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Class Lesson Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Lesson {index + 1}
                  </span>
                </div>

                {/* Class Title (Written clearly on tile) */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                  {item.title}
                </h3>

                {/* Topic / Instructor (if present) */}
                {(item.topic || item.instructor) && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 flex-wrap">
                    {item.topic && (
                      <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md font-medium">
                        {item.topic}
                      </span>
                    )}
                    {item.instructor && (
                      <span className="flex items-center gap-1 font-medium">
                        <User className="w-3 h-3 text-slate-400" />
                        {item.instructor}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* TWO CORE OPTIONS: "Class" (YouTube) and "Sheet" (Drive) */}
              <div 
                className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* OPTION 1: "Class" -> Opens YouTube App / Player */}
                  <button
                    onClick={(e) => handleOpenYoutube(e, item.youtubeUrl)}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all cursor-pointer"
                    title="Watch class lecture on YouTube"
                  >
                    <Youtube className="w-4 h-4 fill-current" />
                    <span>Watch Class</span>
                  </button>

                  {/* OPTION 2: "Sheet" -> Opens Google Drive Link */}
                  <button
                    onClick={(e) => handleOpenDriveSheet(e, item.driveSheetUrl)}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95 ${
                      item.driveSheetUrl
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                    title={item.driveSheetUrl ? 'Open Google Drive Lecture Sheet' : 'No Drive sheet added yet'}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Drive Sheet</span>
                  </button>
                </div>

                {/* OPTION 3 (Optional): Study Book PDF if present */}
                {item.bookPdfUrl && (
                  <button
                    onClick={(e) => handleOpenBookPdf(e, item.bookPdfUrl)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Study Material / Book PDF</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Class Action Modal (when user taps on the tile card directly) */}
      {activeClassModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setActiveClassModal(null)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {subject.name}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {activeClassModal.title}
              </h2>
              {activeClassModal.topic && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Topic: {activeClassModal.topic}
                </p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              {/* Option 1: YouTube Class */}
              <button
                onClick={(e) => {
                  handleOpenYoutube(e, activeClassModal.youtubeUrl);
                  setActiveClassModal(null);
                }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-base shadow-lg shadow-red-600/30 transition-all cursor-pointer active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/20">
                    <Youtube className="w-6 h-6 fill-current" />
                  </div>
                  <div className="text-left">
                    <div>1. Watch Class</div>
                    <div className="text-xs font-normal text-red-100">Opens YouTube app / video</div>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 opacity-80" />
              </button>

              {/* Option 2: Drive Sheet */}
              <button
                onClick={(e) => {
                  handleOpenDriveSheet(e, activeClassModal.driveSheetUrl);
                  setActiveClassModal(null);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-base shadow-lg transition-all cursor-pointer active:scale-95 ${
                  activeClassModal.driveSheetUrl
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/20">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div>2. Lecture Sheet</div>
                    <div className="text-xs font-normal text-blue-100">Opens Google Drive sheet</div>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 opacity-80" />
              </button>

              {/* Option 3: Book PDF (if present) */}
              {activeClassModal.bookPdfUrl && (
                <button
                  onClick={(e) => {
                    handleOpenBookPdf(e, activeClassModal.bookPdfUrl);
                    setActiveClassModal(null);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/20">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div>3. Book / Study PDF</div>
                      <div className="text-xs font-normal text-emerald-100">Opens textbook & material</div>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 opacity-80" />
                </button>
              )}
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setActiveClassModal(null)}
                className="px-6 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
