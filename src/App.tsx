import React, { useState } from 'react';
import { useStudyFirestore } from './hooks/useStudyFirestore';
import { HomeTilesView } from './components/HomeTilesView';
import { SubjectClassesView } from './components/SubjectClassesView';
import { EditorView } from './components/EditorView';
import { PracticeMockExamView } from './components/PracticeMockExamView';
import { PasswordPromptModal } from './components/PasswordPromptModal';
import { Subject, ActiveScreen } from './types';
import { GraduationCap, Settings, Lock, BrainCircuit, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const {
    subjects,
    classes,
    activities,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    addClass,
    updateClass,
    deleteClass,
    resetData,
    toggleLessonCompleted,
    logActivity,
    clearActivities,
  } = useStudyFirestore();

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [practiceClassId, setPracticeClassId] = useState<string | undefined>(undefined);
  
  // Editor Security & Authentication State
  const [isEditorUnlocked, setIsEditorUnlocked] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  // Navigate to Subject
  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setActiveScreen('subject');
  };

  // Navigate to Practice Screen
  const handleOpenPractice = (classId?: string) => {
    setPracticeClassId(classId);
    setActiveScreen('practice');
  };

  // Trigger Editor Navigation with Password Check
  const handleRequestEditor = () => {
    if (isEditorUnlocked) {
      setActiveScreen('editor');
    } else {
      setShowPasswordModal(true);
    }
  };

  // Password Success Callback
  const handlePasswordSuccess = () => {
    setIsEditorUnlocked(true);
    setShowPasswordModal(false);
    setActiveScreen('editor');
  };

  // Lock / Logout of Editor
  const handleLockEditor = () => {
    setIsEditorUnlocked(false);
    setActiveScreen('home');
  };

  // Navigate back to Home
  const handleBackToHome = () => {
    setActiveScreen('home');
    setSelectedSubject(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFBFE] text-[#1C1B1F] flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Material You Signature Atmospheric Background Blurs */}
      <div 
        aria-hidden="true" 
        className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#6750A4]/12 blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none z-0" 
      />
      <div 
        aria-hidden="true" 
        className="fixed top-20 right-0 w-[450px] h-[450px] rounded-full bg-[#E8DEF8]/70 blur-3xl translate-x-1/4 -translate-y-1/4 pointer-events-none z-0" 
      />
      <div 
        aria-hidden="true" 
        className="fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#7D5260]/10 blur-3xl translate-y-1/3 pointer-events-none z-0" 
      />

      {/* Material Design 3 Top App Bar */}
      <header className="sticky top-0 z-30 bg-[#FFFBFE]/90 backdrop-blur-md border-b border-[#CAC4D0]/40 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          
          {/* Logo & App Title */}
          <div 
            onClick={handleBackToHome}
            className="flex items-center gap-3.5 cursor-pointer group active:scale-95 transition-transform duration-200"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6750A4] to-[#4F378B] flex items-center justify-center text-white shadow-md shadow-[#6750A4]/25 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-[#1C1B1F]">
                  StudyHub
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#E8DEF8] text-[#1D192B]">
                  BUP & IBA Prep
                </span>
              </div>
            </div>
          </div>

          {/* Top Action: Settings Gear for Editing Panel */}
          <div className="flex items-center">
            {/* Settings Gear Icon Button -> Editing Panel */}
            <button
              onClick={handleRequestEditor}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
                activeScreen === 'editor'
                  ? 'bg-[#6750A4] text-white shadow-md shadow-[#6750A4]/30 rotate-45'
                  : 'bg-[#F3EDF7] text-[#49454F] hover:bg-[#E8DEF8] hover:text-[#1D192B]'
              }`}
              title={isEditorUnlocked ? 'Open Editing Panel' : 'Settings & Editing Panel (Password Protected: 16726)'}
              aria-label="Settings & Editing Panel"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Surface */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 relative z-10">
        {loading ? (
          <div className="text-center py-28 space-y-4">
            <div className="w-12 h-12 border-4 border-[#6750A4] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium tracking-wide text-[#49454F] uppercase">
              Connecting to Cloud Firestore...
            </p>
          </div>
        ) : (
          <>
            {/* 1. HOME SCREEN: SUBJECT TILES & MOCK EXAM CALLOUT */}
            {activeScreen === 'home' && (
              <HomeTilesView
                subjects={subjects}
                classes={classes}
                onSelectSubject={handleSelectSubject}
                onOpenPractice={() => handleOpenPractice()}
              />
            )}

            {/* 2. SUBJECT SCREEN: READ-ONLY TILES WITH COMPLETION TOGGLES & QUICK PRACTICE */}
            {activeScreen === 'subject' && selectedSubject && (
              <SubjectClassesView
                subject={selectedSubject}
                classes={classes}
                onBack={handleBackToHome}
                onToggleCompleted={toggleLessonCompleted}
                onLaunchPracticeForClass={(classId) => handleOpenPractice(classId || undefined)}
                onLogActivity={logActivity}
              />
            )}

            {/* 3. PRACTICE TAB: BUP FBS, JU IBA & RU IBA MOCK EXAM ENVIRONMENT */}
            {activeScreen === 'practice' && (
              <PracticeMockExamView
                classes={classes}
                subjects={subjects}
                preselectedClassId={practiceClassId}
                onBack={handleBackToHome}
                onLogActivity={logActivity}
              />
            )}

            {/* 4. EDITOR SCREEN: EDIT / DELETE / ADD & MOVEMENT HISTORY (PASSWORD PROTECTED) */}
            {activeScreen === 'editor' && isEditorUnlocked && (
              <EditorView
                subjects={subjects}
                classes={classes}
                activities={activities}
                onBack={handleBackToHome}
                onLock={handleLockEditor}
                onAddClass={addClass}
                onUpdateClass={updateClass}
                onDeleteClass={deleteClass}
                onAddSubject={addSubject}
                onUpdateSubject={updateSubject}
                onDeleteSubject={deleteSubject}
                onResetData={resetData}
                onClearActivities={clearActivities}
              />
            )}
          </>
        )}
      </main>

      {/* Footer with Contact Developer Link */}
      <footer className="w-full border-t border-[#CAC4D0]/30 py-4 px-6 text-center text-xs text-[#79747E] relative z-10">
        <p>
          Contact{' '}
          <a
            href="https://nakib.site"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-600 hover:underline font-medium transition-colors"
          >
            developer
          </a>
        </p>
      </footer>

      {/* Password Prompt Modal for Passcode: 16726 */}
      <PasswordPromptModal
        isOpen={showPasswordModal}
        onSuccess={handlePasswordSuccess}
        onCancel={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
