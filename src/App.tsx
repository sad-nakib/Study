import React, { useState } from 'react';
import { useStudyFirestore } from './hooks/useStudyFirestore';
import { HomeTilesView } from './components/HomeTilesView';
import { SubjectClassesView } from './components/SubjectClassesView';
import { EditorView } from './components/EditorView';
import { Subject, StudyClass, ActiveScreen } from './types';
import { GraduationCap, Settings, Layers, Cloud } from 'lucide-react';

export default function App() {
  const {
    subjects,
    classes,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    addClass,
    updateClass,
    deleteClass,
    resetData,
  } = useStudyFirestore();

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [editorInitialMode, setEditorInitialMode] = useState<'add_class' | 'add_subject'>('add_class');
  const [editorInitialSubjectId, setEditorInitialSubjectId] = useState<string | undefined>(undefined);

  // Navigate to Subject
  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setActiveScreen('subject');
  };

  // Navigate to Editor
  const handleOpenEditor = (mode: 'add_class' | 'add_subject' = 'add_class', subjectId?: string) => {
    setEditorInitialMode(mode);
    setEditorInitialSubjectId(subjectId);
    setActiveScreen('editor');
  };

  // Navigate back to Home
  const handleBackToHome = () => {
    setActiveScreen('home');
    setSelectedSubject(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Home Click */}
          <div 
            onClick={handleBackToHome}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  StudyHub
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Classes & Sheets
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Navigation */}
          <div className="flex items-center gap-2">
            {activeScreen !== 'home' && (
              <button
                onClick={handleBackToHome}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Home Tiles
              </button>
            )}

            <button
              onClick={() => handleOpenEditor('add_class', selectedSubject?.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeScreen === 'editor'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-24 space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Loading Study Tiles from Backend...
            </p>
          </div>
        ) : (
          <>
            {/* 1. HOME SCREEN: 4 TILES (English, Math, GK, Editor) */}
            {activeScreen === 'home' && (
              <HomeTilesView
                subjects={subjects}
                classes={classes}
                onSelectSubject={handleSelectSubject}
                onOpenEditor={(mode) => handleOpenEditor(mode)}
              />
            )}

            {/* 2. SUBJECT SCREEN: TILES OF CLASSES WITH YOUTUBE & DRIVE OPTIONS */}
            {activeScreen === 'subject' && selectedSubject && (
              <SubjectClassesView
                subject={selectedSubject}
                classes={classes}
                onBack={handleBackToHome}
                onOpenAddClass={(subjectId) => handleOpenEditor('add_class', subjectId)}
                onEditClass={(item) => {
                  handleOpenEditor('add_class', item.subjectId);
                }}
                onDeleteClass={deleteClass}
              />
            )}

            {/* 3. EDITOR SCREEN: ADD SUBJECTS & CLASSES */}
            {activeScreen === 'editor' && (
              <EditorView
                subjects={subjects}
                classes={classes}
                initialMode={editorInitialMode}
                initialSubjectId={editorInitialSubjectId}
                onBack={handleBackToHome}
                onAddClass={addClass}
                onUpdateClass={updateClass}
                onDeleteClass={deleteClass}
                onAddSubject={addSubject}
                onUpdateSubject={updateSubject}
                onDeleteSubject={deleteSubject}
                onResetData={resetData}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
