import React from 'react';
import { Subject, StudyClass } from '../types';
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  GraduationCap, 
  Play, 
  ChevronRight,
  Sparkles,
  Layers,
  BrainCircuit,
  CheckCircle2,
  Zap,
  ArrowRight
} from 'lucide-react';

interface HomeTilesViewProps {
  subjects: Subject[];
  classes: StudyClass[];
  onSelectSubject: (subject: Subject) => void;
  onOpenEditor?: (mode?: 'add_class' | 'add_subject') => void;
  onOpenPractice?: () => void;
}

// Material You Tonal Palette variants for subject cards
const m3ThemeStyles: Record<string, { 
  bg: string; 
  surface: string; 
  text: string; 
  iconBg: string; 
  pillBg: string; 
  glow: string;
}> = {
  indigo: {
    bg: 'bg-gradient-to-br from-[#6750A4] to-[#4F378B]',
    surface: 'text-white',
    text: 'text-[#EADDFF]',
    iconBg: 'bg-white/18 text-white',
    pillBg: 'bg-white/20 text-white',
    glow: 'bg-[#EADDFF]/20',
  },
  emerald: {
    bg: 'bg-gradient-to-br from-[#2E6C3B] to-[#1C4B25]',
    surface: 'text-white',
    text: 'text-[#C4EED0]',
    iconBg: 'bg-white/18 text-white',
    pillBg: 'bg-white/20 text-white',
    glow: 'bg-[#C4EED0]/20',
  },
  amber: {
    bg: 'bg-gradient-to-br from-[#8C5000] to-[#603500]',
    surface: 'text-white',
    text: 'text-[#FFDDB3]',
    iconBg: 'bg-white/18 text-white',
    pillBg: 'bg-white/20 text-white',
    glow: 'bg-[#FFDDB3]/20',
  },
  rose: {
    bg: 'bg-gradient-to-br from-[#984061] to-[#702542]',
    surface: 'text-white',
    text: 'text-[#FFD9E2]',
    iconBg: 'bg-white/18 text-white',
    pillBg: 'bg-white/20 text-white',
    glow: 'bg-[#FFD9E2]/20',
  },
  sky: {
    bg: 'bg-gradient-to-br from-[#006399] to-[#004770]',
    surface: 'text-white',
    text: 'text-[#C2E8FF]',
    iconBg: 'bg-white/18 text-white',
    pillBg: 'bg-white/20 text-white',
    glow: 'bg-[#C2E8FF]/20',
  },
  purple: {
    bg: 'bg-gradient-to-br from-[#7D5260] to-[#593441]',
    surface: 'text-white',
    text: 'text-[#FFD8E4]',
    iconBg: 'bg-white/18 text-white',
    pillBg: 'bg-white/20 text-white',
    glow: 'bg-[#FFD8E4]/20',
  },
};

export const HomeTilesView: React.FC<HomeTilesViewProps> = ({
  subjects,
  classes,
  onSelectSubject,
  onOpenPractice,
}) => {
  const totalClasses = classes.length;
  const completedClasses = classes.filter((c) => c.isCompleted).length;
  const overallPercent = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;

  const getSubjectIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('eng')) return <BookOpen className="w-8 h-8" />;
    if (lower.includes('math')) return <Calculator className="w-8 h-8" />;
    if (lower.includes('gk') || lower.includes('general') || lower.includes('know')) return <Globe className="w-8 h-8" />;
    return <GraduationCap className="w-8 h-8" />;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Material Design 3 Hero Header */}
      <div className="text-center space-y-3 py-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EADDFF] text-[#21005D] text-xs font-medium shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#6750A4]" />
          <span>Centralized Class, Sheet & Exam Hub</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#1C1B1F]">
          Study • Practice • Progress
        </h1>
        <p className="text-sm sm:text-base text-[#49454F] leading-relaxed">
          Tap any subject tile to access YouTube lectures and Google Drive sheets, or take standard admission mock exams.
        </p>

        {/* Global Progress Pill */}
        {totalClasses > 0 && (
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#F3EDF7] border border-[#CAC4D0]/40 text-xs font-medium text-[#1C1B1F] shadow-xs mt-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E6C3B]" />
            <span>Overall Progress: <strong>{completedClasses}</strong> of {totalClasses} classes completed ({overallPercent}%)</span>
          </div>
        )}
      </div>

      {/* Quick Launch Practice & Mock Exam Banner Card */}
      {onOpenPractice && (
        <div 
          onClick={onOpenPractice}
          className="group relative cursor-pointer p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-[#21005D] via-[#4F378B] to-[#6750A4] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] max-w-5xl mx-auto overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div aria-hidden="true" className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-medium backdrop-blur-xs">
              <BookOpen className="w-3.5 h-3.5 text-[#EADDFF]" />
              <span>Based on question bank and lecture sheets</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight">
              BUP FBS, JU IBA & RU IBA Mock Practice Exam
            </h2>
            <p className="text-xs text-[#EADDFF] max-w-xl leading-relaxed">
              Standard timed MCQ practice with negative marking (-0.25), step-by-step solutions, grammar formulas, and in-depth explanations.
            </p>
          </div>

          <div className="relative z-10">
            <div className="h-12 px-6 rounded-full bg-white text-[#21005D] font-medium text-xs flex items-center gap-2 shadow-md group-hover:bg-[#EADDFF] transition-colors">
              <Zap className="w-4 h-4 text-[#6750A4]" />
              <span>Start Practice Exam</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      )}

      {/* Subject Tiles Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${subjects.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 max-w-5xl mx-auto`}>
        {subjects.map((subj) => {
          const subjectClasses = classes.filter((c) => c.subjectId === subj.id);
          const subjDone = subjectClasses.filter((c) => c.isCompleted).length;
          const theme = m3ThemeStyles[subj.color] || m3ThemeStyles.indigo;

          return (
            <div
              key={subj.id}
              onClick={() => onSelectSubject(subj)}
              className={`group relative cursor-pointer overflow-hidden rounded-[32px] ${theme.bg} p-8 ${theme.surface} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] flex flex-col justify-between min-h-[260px]`}
            >
              {/* Organic background aura blur */}
              <div 
                aria-hidden="true" 
                className={`absolute -right-8 -bottom-8 w-44 h-44 rounded-full ${theme.glow} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} 
              />

              {/* Top Row: Icon & Lesson Count Pill */}
              <div className="flex items-center justify-between relative z-10">
                <div className={`p-4 rounded-2xl ${theme.iconBg} shadow-inner backdrop-blur-xs`}>
                  {getSubjectIcon(subj.name)}
                </div>
                <div className="flex items-center gap-2">
                  {subj.code && (
                    <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-black/20 text-white/90">
                      {subj.code}
                    </span>
                  )}
                  <span className={`text-xs font-medium px-3.5 py-1 rounded-full ${theme.pillBg} backdrop-blur-xs flex items-center gap-1.5`}>
                    <Play className="w-3 h-3 fill-current" />
                    <span>{subjectClasses.length} Classes</span>
                  </span>
                </div>
              </div>

              {/* Subject Title & Description */}
              <div className="relative z-10 space-y-3 mt-6">
                <div>
                  <h2 className="text-2xl font-medium tracking-tight text-white flex items-center justify-between">
                    <span>{subj.name}</span>
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-white/20 transition-all duration-200">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </h2>
                  {subj.description ? (
                    <p className={`text-xs ${theme.text} line-clamp-2 leading-relaxed mt-1`}>
                      {subj.description}
                    </p>
                  ) : (
                    <p className={`text-xs ${theme.text} mt-1`}>
                      View lecture videos, drive sheets & study material
                    </p>
                  )}
                </div>

                {/* Subject Completion Progress Indicator */}
                {subjectClasses.length > 0 && (
                  <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-medium">
                    <span className="text-white/90 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>{subjDone} / {subjectClasses.length} Completed</span>
                    </span>
                    <span className="text-white/80">
                      {Math.round((subjDone / subjectClasses.length) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Material You Summary Pill */}
      <div className="max-w-md mx-auto text-center pt-2">
        <div className="inline-flex items-center gap-4 text-xs font-medium text-[#49454F] bg-[#F3EDF7] px-5 py-2.5 rounded-full border border-[#CAC4D0]/50 shadow-xs">
          <span><strong>{subjects.length}</strong> Subjects</span>
          <span className="text-[#79747E]">•</span>
          <span><strong>{classes.length}</strong> Classes</span>
          <span className="text-[#79747E]">•</span>
          <span className="text-[#1B5E20] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2E6C3B] animate-pulse inline-block" />
            Live Cloud Storage
          </span>
        </div>
      </div>
    </div>
  );
};
