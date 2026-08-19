import React from 'react';
import { Subject, StudyClass } from '../types';
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  FolderPlus, 
  Edit, 
  GraduationCap, 
  Play, 
  FileText, 
  Layers, 
  ChevronRight,
  Sparkles,
  Settings
} from 'lucide-react';

interface HomeTilesViewProps {
  subjects: Subject[];
  classes: StudyClass[];
  onSelectSubject: (subject: Subject) => void;
  onOpenEditor: (mode?: 'add_class' | 'add_subject') => void;
}

const colorThemeStyles: Record<string, { bg: string; border: string; text: string; iconBg: string; badge: string; shadow: string }> = {
  indigo: {
    bg: 'from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600',
    border: 'border-indigo-400/30',
    text: 'text-indigo-100',
    iconBg: 'bg-white/20 text-white',
    badge: 'bg-white/20 text-white',
    shadow: 'shadow-indigo-500/20 hover:shadow-indigo-500/30',
  },
  emerald: {
    bg: 'from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600',
    border: 'border-emerald-400/30',
    text: 'text-emerald-100',
    iconBg: 'bg-white/20 text-white',
    badge: 'bg-white/20 text-white',
    shadow: 'shadow-emerald-500/20 hover:shadow-emerald-500/30',
  },
  amber: {
    bg: 'from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600',
    border: 'border-amber-400/30',
    text: 'text-amber-100',
    iconBg: 'bg-white/20 text-white',
    badge: 'bg-white/20 text-white',
    shadow: 'shadow-amber-500/20 hover:shadow-amber-500/30',
  },
  rose: {
    bg: 'from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600',
    border: 'border-rose-400/30',
    text: 'text-rose-100',
    iconBg: 'bg-white/20 text-white',
    badge: 'bg-white/20 text-white',
    shadow: 'shadow-rose-500/20 hover:shadow-rose-500/30',
  },
  sky: {
    bg: 'from-sky-600 to-cyan-700 hover:from-sky-500 hover:to-cyan-600',
    border: 'border-sky-400/30',
    text: 'text-sky-100',
    iconBg: 'bg-white/20 text-white',
    badge: 'bg-white/20 text-white',
    shadow: 'shadow-sky-500/20 hover:shadow-sky-500/30',
  },
  purple: {
    bg: 'from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600',
    border: 'border-purple-400/30',
    text: 'text-purple-100',
    iconBg: 'bg-white/20 text-white',
    badge: 'bg-white/20 text-white',
    shadow: 'shadow-purple-500/20 hover:shadow-purple-500/30',
  },
};

export const HomeTilesView: React.FC<HomeTilesViewProps> = ({
  subjects,
  classes,
  onSelectSubject,
  onOpenEditor,
}) => {
  const getSubjectIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('eng')) return <BookOpen className="w-8 h-8" />;
    if (lower.includes('math')) return <Calculator className="w-8 h-8" />;
    if (lower.includes('gk') || lower.includes('general') || lower.includes('know')) return <Globe className="w-8 h-8" />;
    return <GraduationCap className="w-8 h-8" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* App Welcome Banner */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Centralized Class & Lecture Hub</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Select Your Subject
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Tap any subject tile to view all class lectures, YouTube videos, and Google Drive lecture sheets.
        </p>
      </div>

      {/* Main 4-Tile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        
        {/* Subject Tiles */}
        {subjects.map((subj) => {
          const subjectClasses = classes.filter((c) => c.subjectId === subj.id);
          const theme = colorThemeStyles[subj.color] || colorThemeStyles.indigo;

          return (
            <div
              key={subj.id}
              onClick={() => onSelectSubject(subj)}
              className={`group relative cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-br ${theme.bg} p-7 text-white shadow-xl ${theme.shadow} border ${theme.border} transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] flex flex-col justify-between min-h-[210px]`}
            >
              {/* Decorative background glow */}
              <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

              {/* Top Row: Icon & Class Count Pill */}
              <div className="flex items-center justify-between relative z-10">
                <div className={`p-3.5 rounded-2xl ${theme.iconBg} shadow-inner`}>
                  {getSubjectIcon(subj.name)}
                </div>
                <div className="flex items-center gap-2">
                  {subj.code && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-black/20 text-white/90">
                      {subj.code}
                    </span>
                  )}
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${theme.badge} backdrop-blur-xs flex items-center gap-1.5`}>
                    <Play className="w-3 h-3 fill-current" />
                    <span>{subjectClasses.length} Classes</span>
                  </span>
                </div>
              </div>

              {/* Subject Title & Description */}
              <div className="relative z-10 space-y-1.5 mt-6">
                <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-white flex items-center justify-between">
                  <span>{subj.name}</span>
                  <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform opacity-80" />
                </h2>
                {subj.description ? (
                  <p className={`text-xs ${theme.text} line-clamp-2 leading-relaxed`}>
                    {subj.description}
                  </p>
                ) : (
                  <p className={`text-xs ${theme.text}`}>
                    View lecture videos, drive sheets & study material
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* 4th Tile: Editor (Add Subject or Class) */}
        <div
          onClick={() => onOpenEditor('add_class')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-7 text-slate-800 dark:text-slate-100 shadow-xl shadow-slate-900/5 hover:shadow-indigo-500/15 border-2 border-dashed border-indigo-400 dark:border-indigo-600/60 hover:border-indigo-600 transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] flex flex-col justify-between min-h-[210px]"
        >
          {/* Top Row: Editor Icon & Actions */}
          <div className="flex items-center justify-between relative z-10">
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200 dark:border-indigo-800">
              <Settings className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
              <Edit className="w-3 h-3" />
              <span>Editor Tile</span>
            </span>
          </div>

          {/* Editor Title & Description */}
          <div className="relative z-10 space-y-1.5 mt-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-between group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              <span>Editor & Manager</span>
              <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform text-indigo-500" />
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Add new classes, update YouTube & Drive links, or create new subjects.
            </p>
          </div>
        </div>

      </div>

      {/* Quick Summary Pill below grid */}
      <div className="max-w-md mx-auto text-center pt-2">
        <div className="inline-flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700">
          <span><strong>{subjects.length}</strong> Subjects</span>
          <span>•</span>
          <span><strong>{classes.length}</strong> Total Classes</span>
          <span>•</span>
          <span>Stored in backend</span>
        </div>
      </div>
    </div>
  );
};
