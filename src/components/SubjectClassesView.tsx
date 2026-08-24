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
  BookMarked,
  X,
  CheckCircle2,
  Circle,
  BrainCircuit,
  Zap
} from 'lucide-react';

interface SubjectClassesViewProps {
  subject: Subject;
  classes: StudyClass[];
  onBack: () => void;
  onToggleCompleted?: (classId: string, currentStatus?: boolean) => void;
  onLaunchPracticeForClass?: (classId: string) => void;
}

export const SubjectClassesView: React.FC<SubjectClassesViewProps> = ({
  subject,
  classes,
  onBack,
  onToggleCompleted,
  onLaunchPracticeForClass,
}) => {
  const [activeClassModal, setActiveClassModal] = useState<StudyClass | null>(null);

  const subjectClasses = classes.filter((c) => c.subjectId === subject.id);
  const completedCount = subjectClasses.filter((c) => c.isCompleted).length;
  const progressPercent = subjectClasses.length > 0 ? Math.round((completedCount / subjectClasses.length) * 100) : 0;

  // Helper to open YouTube app/browser
  const handleOpenYoutube = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!url) {
      alert('No YouTube link available for this class.');
      return;
    }
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
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Subject Header & Navigation & Progress */}
      <div className="p-7 rounded-[32px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-12 h-12 rounded-full bg-[#E8DEF8] text-[#1D192B] hover:bg-[#D0BCFF] active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs"
              title="Back to All Subjects"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium px-3 py-0.5 rounded-full bg-[#EADDFF] text-[#21005D]">
                  {subject.code || 'COURSE'}
                </span>
                <span className="text-xs text-[#49454F]">
                  {subjectClasses.length} {subjectClasses.length === 1 ? 'Class' : 'Classes'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-medium tracking-tight text-[#1C1B1F] mt-1">
                {subject.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onLaunchPracticeForClass && (
              <button
                onClick={() => onLaunchPracticeForClass('')}
                className="h-10 px-5 rounded-full bg-[#6750A4] text-white hover:bg-[#593E96] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-xs"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Practice Subject</span>
              </button>
            )}
          </div>
        </div>

        {/* Lesson Completion Progress Bar */}
        {subjectClasses.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#FFFBFE] border border-[#CAC4D0]/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#49454F] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E6C3B]" />
                <span>Curriculum Progress: {completedCount} of {subjectClasses.length} completed</span>
              </span>
              <span className="font-mono font-bold text-[#6750A4]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#E7E0EC] overflow-hidden">
              <div
                className="h-full bg-[#2E6C3B] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Class Tiles Grid */}
      {subjectClasses.length === 0 ? (
        <div className="text-center py-20 px-6 rounded-[32px] border-2 border-dashed border-[#CAC4D0] bg-[#F3EDF7]/60 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#E8DEF8] text-[#6750A4] flex items-center justify-center mx-auto shadow-xs">
            <Play className="w-8 h-8 ml-0.5" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#1C1B1F]">
              No classes available in {subject.name} yet
            </h3>
            <p className="text-xs text-[#49454F] mt-1 max-w-sm mx-auto">
              Classes and lecture sheets for this subject can be added in the Editor.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjectClasses.map((item, index) => {
            const isDone = !!item.isCompleted;

            return (
              <div
                key={item.id}
                onClick={() => setActiveClassModal(item)}
                className={`group relative cursor-pointer rounded-[28px] border p-7 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between ${
                  isDone 
                    ? 'bg-[#F3EDF7]/90 border-[#2E6C3B]/40' 
                    : 'bg-[#F3EDF7] border-[#CAC4D0]/30 hover:border-[#6750A4]/40'
                }`}
              >
                <div>
                  {/* Lesson Badge & Completed Status Pill */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-medium px-3.5 py-1 rounded-full bg-[#E8DEF8] text-[#1D192B]">
                      Lesson {index + 1}
                    </span>

                    {/* Mark as Completed Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleCompleted) onToggleCompleted(item.id, isDone);
                      }}
                      className={`h-8 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer ${
                        isDone
                          ? 'bg-[#C4EED0] text-[#1B5E20] border border-[#2E6C3B]/40'
                          : 'bg-[#FFFBFE] text-[#49454F] border border-[#CAC4D0]/60 hover:bg-[#EADDFF]'
                      }`}
                      title={isDone ? 'Mark as Incomplete' : 'Mark Lesson as Completed'}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#1B5E20]" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-[#79747E]" />
                          <span>Mark Done</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Class Title */}
                  <h3 className="text-lg font-medium text-[#1C1B1F] leading-snug group-hover:text-[#6750A4] transition-colors mb-2">
                    {item.title}
                  </h3>

                  {/* Topic / Instructor */}
                  {(item.topic || item.instructor) && (
                    <div className="flex items-center gap-2 text-xs text-[#49454F] mb-4 flex-wrap">
                      {item.topic && (
                        <span className="bg-[#EADDFF] text-[#21005D] px-2.5 py-1 rounded-full font-medium">
                          {item.topic}
                        </span>
                      )}
                      {item.instructor && (
                        <span className="flex items-center gap-1 font-medium text-[#49454F]">
                          <User className="w-3.5 h-3.5 text-[#79747E]" />
                          {item.instructor}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* CORE ACTIONS: "Watch Class" (YouTube), "Drive Sheet" (Google Drive), "Practice" */}
                <div 
                  className="pt-5 border-t border-[#CAC4D0]/40 space-y-2.5 mt-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* OPTION 1: "Watch Class" -> Opens YouTube App / Player */}
                    <button
                      onClick={(e) => handleOpenYoutube(e, item.youtubeUrl)}
                      className="h-11 flex items-center justify-center gap-2 px-4 rounded-full bg-[#B3261E] hover:bg-[#9C2019] text-white font-medium text-xs shadow-xs active:scale-95 transition-all duration-200 cursor-pointer"
                      title="Watch class lecture on YouTube"
                    >
                      <Youtube className="w-4 h-4 fill-current" />
                      <span>Watch Class</span>
                    </button>

                    {/* OPTION 2: "Drive Sheet" -> Opens Google Drive Link */}
                    <button
                      onClick={(e) => handleOpenDriveSheet(e, item.driveSheetUrl)}
                      className={`h-11 flex items-center justify-center gap-2 px-4 rounded-full font-medium text-xs shadow-xs transition-all duration-200 cursor-pointer active:scale-95 ${
                        item.driveSheetUrl
                          ? 'bg-[#006399] hover:bg-[#00517D] text-white'
                          : 'bg-[#E7E0EC] text-[#79747E] cursor-not-allowed'
                      }`}
                      title={item.driveSheetUrl ? 'Open Google Drive Lecture Sheet' : 'No Drive sheet added yet'}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Drive Sheet</span>
                    </button>
                  </div>

                  {/* OPTION 3: Quick Practice Exam grounded on this lecture */}
                  {onLaunchPracticeForClass && (
                    <button
                      onClick={() => onLaunchPracticeForClass(item.id)}
                      className="w-full h-9 flex items-center justify-center gap-2 px-4 rounded-full bg-[#6750A4]/10 hover:bg-[#6750A4]/20 text-[#6750A4] font-medium text-xs transition-all duration-200 cursor-pointer active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Practice Exam for this Lecture</span>
                    </button>
                  )}

                  {/* OPTION 4 (Optional): Study Book PDF if present */}
                  {item.bookPdfUrl && (
                    <button
                      onClick={(e) => handleOpenBookPdf(e, item.bookPdfUrl)}
                      className="w-full h-9 flex items-center justify-center gap-2 px-4 rounded-full bg-[#2E6C3B]/12 hover:bg-[#2E6C3B]/20 text-[#1B5E20] font-medium text-xs transition-all duration-200 cursor-pointer active:scale-95"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Study Material / PDF</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Material 3 Action Dialog Modal */}
      {activeClassModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveClassModal(null)}
        >
          <div 
            className="w-full max-w-md bg-[#FFFBFE] rounded-[36px] border border-[#CAC4D0]/50 p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveClassModal(null)}
              className="absolute right-5 top-5 w-9 h-9 rounded-full bg-[#F3EDF7] hover:bg-[#E8DEF8] flex items-center justify-center text-[#49454F] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1.5 pt-1">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#EADDFF] text-[#21005D]">
                {subject.name}
              </span>
              <h2 className="text-xl font-medium text-[#1C1B1F] pt-1">
                {activeClassModal.title}
              </h2>
              {activeClassModal.topic && (
                <p className="text-xs text-[#49454F]">
                  Topic: {activeClassModal.topic}
                </p>
              )}

              {/* Modal Completion Toggle */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onToggleCompleted) {
                      onToggleCompleted(activeClassModal.id, activeClassModal.isCompleted);
                      setActiveClassModal({ ...activeClassModal, isCompleted: !activeClassModal.isCompleted });
                    }
                  }}
                  className={`h-9 px-4 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                    activeClassModal.isCompleted
                      ? 'bg-[#C4EED0] text-[#1B5E20] border border-[#2E6C3B]/40'
                      : 'bg-[#E8DEF8] text-[#1D192B] hover:bg-[#D0BCFF]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{activeClassModal.isCompleted ? 'Completed ✓ (Click to toggle)' : 'Mark Lesson as Completed'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {/* Option 1: YouTube Class */}
              <button
                onClick={(e) => {
                  handleOpenYoutube(e, activeClassModal.youtubeUrl);
                  setActiveClassModal(null);
                }}
                className="w-full flex items-center justify-between p-4 rounded-full bg-[#B3261E] hover:bg-[#9C2019] text-white font-medium text-sm shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white/20">
                    <Youtube className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <div>1. Watch Class</div>
                    <div className="text-xs font-normal text-white/80">Opens YouTube app / video</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </button>

              {/* Option 2: Drive Sheet */}
              <button
                onClick={(e) => {
                  handleOpenDriveSheet(e, activeClassModal.driveSheetUrl);
                  setActiveClassModal(null);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-full font-medium text-sm shadow-xs transition-all duration-200 cursor-pointer active:scale-95 ${
                  activeClassModal.driveSheetUrl
                    ? 'bg-[#006399] hover:bg-[#00517D] text-white'
                    : 'bg-[#E7E0EC] text-[#79747E] cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div>2. Lecture Sheet</div>
                    <div className="text-xs font-normal text-white/80">Opens Google Drive sheet</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </button>

              {/* Option 3: Practice Exam for this Class */}
              {onLaunchPracticeForClass && (
                <button
                  onClick={() => {
                    const cid = activeClassModal.id;
                    setActiveClassModal(null);
                    onLaunchPracticeForClass(cid);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-full bg-[#6750A4] hover:bg-[#593E96] text-white font-medium text-sm shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/20">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div>3. Practice Exam (BUP & IBA)</div>
                      <div className="text-xs font-normal text-white/80">Mock test based on this sheet</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </button>
              )}

              {/* Option 4: Book PDF (if present) */}
              {activeClassModal.bookPdfUrl && (
                <button
                  onClick={(e) => {
                    handleOpenBookPdf(e, activeClassModal.bookPdfUrl);
                    setActiveClassModal(null);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-full bg-[#2E6C3B] hover:bg-[#23532D] text-white font-medium text-sm shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/20">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div>4. Book / Study PDF</div>
                      <div className="text-xs font-normal text-white/80">Opens textbook & material</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </button>
              )}
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setActiveClassModal(null)}
                className="h-10 px-6 rounded-full text-xs font-medium text-[#49454F] hover:bg-[#F3EDF7] transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
