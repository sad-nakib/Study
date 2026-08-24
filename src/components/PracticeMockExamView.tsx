import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Subject, 
  StudyClass, 
  PracticeQuestion, 
  ExamTarget, 
  QuestionSubject, 
  ExamResult, 
  SectionScore 
} from '../types';
import { ADMISSION_QUESTION_BANK } from '../data/admissionQuestionBank';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Award, 
  Flag, 
  Send, 
  BarChart3, 
  Zap, 
  FileText, 
  BrainCircuit, 
  Clock, 
  Target, 
  ArrowRight,
  RefreshCw,
  Loader2,
  ListFilter,
  Check,
  GraduationCap,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface PracticeMockExamViewProps {
  subjects: Subject[];
  classes: StudyClass[];
  preselectedClassId?: string;
  onBackToHome: () => void;
}

type ExamMode = 'subject_wise' | 'class_wise';

export const PracticeMockExamView: React.FC<PracticeMockExamViewProps> = ({
  subjects,
  classes,
  preselectedClassId,
  onBackToHome,
}) => {
  // Phase state: 'setup' | 'exam' | 'result'
  const [phase, setPhase] = useState<'setup' | 'exam' | 'result'>('setup');

  // Exam Mode Sliding Switch: Subject-wise vs Class-wise
  const [examMode, setExamMode] = useState<ExamMode>(preselectedClassId ? 'class_wise' : 'subject_wise');

  // Exam Configuration State
  const [selectedTarget, setSelectedTarget] = useState<ExamTarget>('bup_fbs');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<QuestionSubject | 'all'>('all');
  const [selectedClassId, setSelectedClassId] = useState<string>(preselectedClassId || '');
  const [classSubjectFilter, setClassSubjectFilter] = useState<string>('all');
  const [classSortOrder, setClassSortOrder] = useState<'default' | 'title_asc'>('default');
  
  // Parameters
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(12); // auto-calibrated
  const [hasNegativeMarking, setHasNegativeMarking] = useState<boolean>(true);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Active Single-Page Exam State
  const [activeQuestions, setActiveQuestions] = useState<PracticeQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [examStartTime, setExamStartTime] = useState<number>(0);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Result State
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'marked'>('all');
  const [expandedAiExplanation, setExpandedAiExplanation] = useState<Record<string, string>>({});
  const [loadingAiExplainId, setLoadingAiExplainId] = useState<string | null>(null);

  // Timer Ref
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger Haptic Vibration & Confetti Celebration
  const triggerCelebration = () => {
    // 1. Mobile Phone Haptic Vibration
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 100, 50, 200]);
      } catch (e) {
        console.warn('Vibration API not accessible:', e);
      }
    }

    // 2. Confetti Particle Cannon Animation
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    } catch (err) {
      console.warn('Confetti error:', err);
    }
  };

  // Automatically calibrate time limit when question count changes (1.2 mins per question)
  const handleQuestionCountChange = (count: number) => {
    setQuestionCount(count);
    const autoMinutes = Math.max(5, Math.round(count * 1.2));
    setTimeLimitMinutes(autoMinutes);
  };

  // Start Countdown Timer when entering 'exam' phase
  useEffect(() => {
    if (phase === 'exam' && timeRemainingSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [phase, timeRemainingSeconds]);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter and sort classes for the class-wise selector
  const filteredAndSortedClasses = classes
    .filter((c) => {
      if (classSubjectFilter === 'all') return true;
      return c.subjectId === classSubjectFilter;
    })
    .sort((a, b) => {
      if (classSortOrder === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // Start Exam Flow
  const handleStartExam = async () => {
    setIsGeneratingAi(true);
    let questionsToUse: PracticeQuestion[] = [];

    const targetClass = examMode === 'class_wise' ? classes.find((c) => c.id === selectedClassId) : undefined;

    try {
      // Call Backend API to generate questions (Gemini 2.0 Flash in backend by default)
      const res = await fetch('/api/practice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: selectedTarget,
          subjectFilter: examMode === 'subject_wise' ? selectedSubjectFilter : 'all',
          questionCount: questionCount,
          specificTopic: targetClass?.topic || '',
          sheetContext: targetClass ? `${targetClass.title} (Topic: ${targetClass.topic || 'General'})` : '',
          model: 'google/gemini-2.0-flash-001', // Default model
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          questionsToUse = data.questions;
        }
      }
    } catch (e) {
      console.warn('Backend question generator error, using calibrated bank:', e);
    } finally {
      setIsGeneratingAi(false);
    }

    // Fallback or blend with curated BUP FBS & IBA Admission Question Bank
    if (questionsToUse.length === 0) {
      let filtered = [...ADMISSION_QUESTION_BANK];

      if (examMode === 'subject_wise' && selectedSubjectFilter !== 'all') {
        filtered = filtered.filter((q) => q.subject === selectedSubjectFilter);
      }

      if (selectedTarget === 'bup_fbs') {
        filtered = filtered.filter((q) => !q.targetExam || q.targetExam.includes('BUP') || q.subject !== 'analytical');
      } else if (selectedTarget === 'ju_iba') {
        filtered = filtered.filter((q) => !q.targetExam || q.targetExam.includes('JU') || q.subject === 'analytical');
      } else if (selectedTarget === 'ru_iba') {
        filtered = filtered.filter((q) => !q.targetExam || q.targetExam.includes('RU') || q.subject === 'math');
      }

      if (filtered.length === 0) {
        filtered = [...ADMISSION_QUESTION_BANK];
      }

      // Shuffle & slice
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      questionsToUse = shuffled.slice(0, questionCount);
    }

    // If still less than requested, pad
    if (questionsToUse.length < questionCount && ADMISSION_QUESTION_BANK.length > 0) {
      const extraNeeded = questionCount - questionsToUse.length;
      const extra = ADMISSION_QUESTION_BANK.slice(0, extraNeeded).map((q, idx) => ({
        ...q,
        id: `${q.id}-dup-${idx}`,
      }));
      questionsToUse = [...questionsToUse, ...extra];
    }

    setActiveQuestions(questionsToUse);
    setUserAnswers({});
    setMarkedForReview({});
    setTimeRemainingSeconds(timeLimitMinutes * 60);
    setExamStartTime(Date.now());
    setPhase('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Option for a specific question
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Toggle Review for a specific question
  const handleToggleReview = (questionId: string) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Auto submit when time runs out
  const handleAutoSubmit = () => {
    calculateAndShowResults();
  };

  // Manual submit trigger
  const handleManualSubmit = () => {
    setShowSubmitModal(false);
    calculateAndShowResults();
  };

  // Calculate Final Score
  const calculateAndShowResults = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const sectionMap: Record<string, SectionScore> = {};

    activeQuestions.forEach((q) => {
      const subjectKey = q.subject || 'general';
      if (!sectionMap[subjectKey]) {
        sectionMap[subjectKey] = { total: 0, answered: 0, correct: 0, incorrect: 0, marks: 0 };
      }
      sectionMap[subjectKey].total += 1;

      const chosen = userAnswers[q.id];
      if (chosen === undefined) {
        unattempted += 1;
      } else if (chosen === q.correctIndex) {
        correct += 1;
        sectionMap[subjectKey].answered += 1;
        sectionMap[subjectKey].correct += 1;
        sectionMap[subjectKey].marks += 1.0;
      } else {
        incorrect += 1;
        sectionMap[subjectKey].answered += 1;
        sectionMap[subjectKey].incorrect += 1;
        sectionMap[subjectKey].marks -= hasNegativeMarking ? 0.25 : 0;
      }
    });

    const positiveMarks = correct * 1.0;
    const negativePenalty = hasNegativeMarking ? incorrect * 0.25 : 0;
    const netScore = Math.max(0, Number((positiveMarks - negativePenalty).toFixed(2)));
    const maxScore = activeQuestions.length * 1.0;
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    const elapsed = Math.round((Date.now() - examStartTime) / 1000);

    const result: ExamResult = {
      totalQuestions: activeQuestions.length,
      attemptedCount: correct + incorrect,
      correctCount: correct,
      incorrectCount: incorrect,
      unattemptedCount: unattempted,
      positiveMarks,
      negativeMarks: negativePenalty,
      netScore,
      maxScore,
      accuracyPercentage: accuracy,
      timeTakenSeconds: elapsed,
      passed: netScore >= maxScore * 0.4,
      sectionScores: sectionMap,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setExamResult(result);
    setPhase('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger phone vibration and celebratory confetti animation
    triggerCelebration();
  };

  // Request AI Doubt Solver / In-Depth Explanation
  const handleAskAiExplainer = async (q: PracticeQuestion) => {
    setLoadingAiExplainId(q.id);
    try {
      const res = await fetch('/api/practice/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          options: q.options,
          correctOption: `${String.fromCharCode(65 + q.correctIndex)}. ${q.options[q.correctIndex]}`,
          chosenOption: userAnswers[q.id] !== undefined ? `${String.fromCharCode(65 + userAnswers[q.id])}. ${q.options[userAnswers[q.id]]}` : 'Unattempted',
          userDoubt: `Please explain the trick, grammar/math logic, and shortcut to solve this BUP/IBA question.`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setExpandedAiExplanation((prev) => ({
          ...prev,
          [q.id]: data.explanation,
        }));
      }
    } catch (e) {
      console.error('AI explainer error:', e);
    } finally {
      setLoadingAiExplainId(null);
    }
  };

  // Practice Mistakes Only
  const handlePracticeMistakesOnly = () => {
    if (!examResult) return;
    const mistakes = activeQuestions.filter((q) => userAnswers[q.id] !== q.correctIndex);
    if (mistakes.length === 0) {
      alert('Congratulations! You achieved a perfect 100% score with no mistakes to review.');
      return;
    }
    setActiveQuestions(mistakes);
    setUserAnswers({});
    setMarkedForReview({});
    setTimeRemainingSeconds(Math.max(3, Math.round(mistakes.length * 1.2)) * 60);
    setExamStartTime(Date.now());
    setPhase('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to Setup
  const handleResetToSetup = () => {
    setPhase('setup');
    setExamResult(null);
    setActiveQuestions([]);
    setUserAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to question card on single page
  const scrollToQuestion = (idx: number) => {
    const el = document.getElementById(`q-card-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // -------------------------------------------------------------
  // PHASE 1: CLEAN SETUP & CONFIGURATION SCREEN
  // -------------------------------------------------------------
  if (phase === 'setup') {
    return (
      <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
        
        {/* Header Banner */}
        <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#6750A4] to-[#4F378B] text-white shadow-md space-y-4 relative overflow-hidden">
          <div aria-hidden="true" className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-xs mb-2">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>BUP FBS, JU IBA & RU IBA Admission Simulator</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-medium tracking-tight">
                Practice & Mock Exam
              </h1>
              <p className="text-xs sm:text-sm text-[#EADDFF] mt-1 max-w-2xl leading-relaxed">
                Take authentic admission standard exams with auto-calibrated timers, negative marking (-0.25), and comprehensive analysis.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onBackToHome}
                className="h-10 px-5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer"
              >
                Back to Curriculum
              </button>
            </div>
          </div>
        </div>

        {/* Configuration Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Target & Scope Selection (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Target University Presets */}
            <div className="p-7 rounded-[32px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-xs space-y-4">
              <h2 className="text-lg font-medium text-[#1C1B1F] flex items-center gap-2">
                <Target className="w-5 h-5 text-[#6750A4]" />
                <span>1. Select Admission Target</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'bup_fbs',
                    title: 'BUP FBS Admission Test',
                    desc: 'Faculty of Business Studies (English, Math, GK & Business)',
                    badge: 'BUP FBS',
                  },
                  {
                    id: 'ju_iba',
                    title: 'JU IBA Admission Test',
                    desc: 'Jahangirnagar Univ IBA (English, Advanced Quant, Analytical)',
                    badge: 'JU IBA',
                  },
                  {
                    id: 'ru_iba',
                    title: 'RU IBA Admission Test',
                    desc: 'Rajshahi Univ IBA (Quantitative Aptitude, Grammar, Vocabulary)',
                    badge: 'RU IBA',
                  },
                  {
                    id: 'all',
                    title: 'Combined IBA & FBS Full Mock',
                    desc: 'Comprehensive multi-section exam covering all admission topics',
                    badge: 'Full Mock',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedTarget(item.id as ExamTarget)}
                    className={`p-5 rounded-[24px] border-2 cursor-pointer transition-all duration-200 active:scale-[0.99] flex flex-col justify-between ${
                      selectedTarget === item.id
                        ? 'border-[#6750A4] bg-[#EADDFF]/40 shadow-xs'
                        : 'border-[#CAC4D0]/40 bg-[#FFFBFE] hover:border-[#6750A4]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#E8DEF8] text-[#1D192B]">
                          {item.badge}
                        </span>
                        {selectedTarget === item.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#6750A4]" />
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-[#1C1B1F]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#49454F] mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Sliding Switch: Subject-wise vs Class-wise Exam */}
            <div className="p-7 rounded-[32px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-lg font-medium text-[#1C1B1F] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#6750A4]" />
                  <span>2. Exam Scope</span>
                </h2>

                {/* Sliding Segmented Switch */}
                <div className="flex p-1 bg-[#E7E0EC] rounded-full w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setExamMode('subject_wise')}
                    className={`flex-1 sm:flex-initial px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                      examMode === 'subject_wise'
                        ? 'bg-[#6750A4] text-white shadow-xs'
                        : 'text-[#49454F] hover:text-[#1C1B1F]'
                    }`}
                  >
                    Subject-wise Exam
                  </button>
                  <button
                    type="button"
                    onClick={() => setExamMode('class_wise')}
                    className={`flex-1 sm:flex-initial px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                      examMode === 'class_wise'
                        ? 'bg-[#6750A4] text-white shadow-xs'
                        : 'text-[#49454F] hover:text-[#1C1B1F]'
                    }`}
                  >
                    Class-wise Exam
                  </button>
                </div>
              </div>

              {/* Option A: Subject-wise Exam Choice */}
              {examMode === 'subject_wise' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <p className="text-xs text-[#49454F]">
                    Select which subject domain you would like to test:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'all', label: 'All Subjects (Full Test)' },
                      { id: 'english', label: 'English' },
                      { id: 'math', label: 'Mathematics' },
                      { id: 'gk', label: 'General Knowledge' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSubjectFilter(s.id as any)}
                        className={`h-11 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer active:scale-95 ${
                          selectedSubjectFilter === s.id
                            ? 'bg-[#6750A4] text-white shadow-xs'
                            : 'bg-[#FFFBFE] text-[#49454F] border border-[#CAC4D0]/40 hover:bg-[#E8DEF8]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Option B: Class-wise Exam with Subject Filter & Sorting */}
              {examMode === 'class_wise' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                    {/* Subject Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setClassSubjectFilter('all')}
                        className={`h-8 px-3.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                          classSubjectFilter === 'all'
                            ? 'bg-[#6750A4] text-white'
                            : 'bg-[#FFFBFE] text-[#49454F] border border-[#CAC4D0]/40 hover:bg-[#E8DEF8]'
                        }`}
                      >
                        All Subjects ({classes.length})
                      </button>
                      {subjects.map((subj) => {
                        const count = classes.filter((c) => c.subjectId === subj.id).length;
                        return (
                          <button
                            key={subj.id}
                            type="button"
                            onClick={() => setClassSubjectFilter(subj.id)}
                            className={`h-8 px-3.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                              classSubjectFilter === subj.id
                                ? 'bg-[#6750A4] text-white'
                                : 'bg-[#FFFBFE] text-[#49454F] border border-[#CAC4D0]/40 hover:bg-[#E8DEF8]'
                            }`}
                          >
                            {subj.name} ({count})
                          </button>
                        );
                      })}
                    </div>

                    {/* Sorting Control */}
                    <div className="flex items-center gap-2 text-xs text-[#49454F]">
                      <ListFilter className="w-3.5 h-3.5 text-[#79747E]" />
                      <select
                        value={classSortOrder}
                        onChange={(e) => setClassSortOrder(e.target.value as any)}
                        className="h-8 px-2.5 rounded-lg bg-[#FFFBFE] border border-[#CAC4D0]/60 text-xs text-[#1C1B1F] focus:outline-none"
                      >
                        <option value="default">Default Lesson Order</option>
                        <option value="title_asc">Title (A-Z)</option>
                      </select>
                    </div>
                  </div>

                  {/* Class Selection Cards List */}
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1 pt-1">
                    {filteredAndSortedClasses.length === 0 ? (
                      <div className="text-center py-6 text-xs text-[#79747E] bg-[#FFFBFE] rounded-2xl border border-[#CAC4D0]/30">
                        No classes found for this subject filter.
                      </div>
                    ) : (
                      filteredAndSortedClasses.map((cls, idx) => {
                        const subj = subjects.find((s) => s.id === cls.subjectId);
                        const isSelected = selectedClassId === cls.id;

                        return (
                          <div
                            key={cls.id}
                            onClick={() => setSelectedClassId(cls.id)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-150 flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'border-[#6750A4] bg-[#EADDFF]/50 shadow-xs'
                                : 'border-[#CAC4D0]/40 bg-[#FFFBFE] hover:border-[#6750A4]/40 hover:bg-[#F3EDF7]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium ${
                                isSelected ? 'bg-[#6750A4] text-white' : 'bg-[#E8DEF8] text-[#1D192B]'
                              }`}>
                                {idx + 1}
                              </div>
                              <div>
                                <div className="text-xs font-medium text-[#1C1B1F]">
                                  {cls.title}
                                </div>
                                <div className="text-[11px] text-[#49454F] flex items-center gap-2 mt-0.5">
                                  {subj && <span className="font-medium text-[#6750A4]">{subj.name}</span>}
                                  {cls.topic && <span>• Topic: {cls.topic}</span>}
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-[#6750A4] shrink-0" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Exam Parameters & Start Card (1 col) */}
          <div className="space-y-6">
            <div className="p-7 rounded-[32px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-xs space-y-6">
              <h2 className="text-lg font-medium text-[#1C1B1F] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#6750A4]" />
                <span>3. Exam Parameters</span>
              </h2>

              {/* Number of Questions */}
              <div>
                <label className="block text-xs font-medium text-[#49454F] uppercase tracking-wider mb-2">
                  Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleQuestionCountChange(num)}
                      className={`h-10 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                        questionCount === num
                          ? 'bg-[#6750A4] text-white shadow-xs'
                          : 'bg-[#FFFBFE] text-[#49454F] border border-[#CAC4D0]/40 hover:bg-[#E8DEF8]'
                      }`}
                    >
                      {num} MCQs
                    </button>
                  ))}
                </div>
              </div>

              {/* Automatically Set Time Limit */}
              <div className="p-4 rounded-2xl bg-[#FFFBFE] border border-[#CAC4D0]/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#49454F] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#6750A4]" />
                    <span>Time Limit (Auto-Set)</span>
                  </span>
                  <span className="font-mono font-bold text-[#6750A4] text-sm">
                    {timeLimitMinutes} Mins
                  </span>
                </div>
                <p className="text-[11px] text-[#79747E]">
                  Calibrated to ~1.2 minutes per MCQ according to BUP & IBA admission test rules.
                </p>
              </div>

              {/* Negative Marking Toggle */}
              <div 
                onClick={() => setHasNegativeMarking(!hasNegativeMarking)}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFBFE] border border-[#CAC4D0]/40 cursor-pointer select-none"
              >
                <div>
                  <div className="text-xs font-medium text-[#1C1B1F]">
                    Negative Marking (-0.25)
                  </div>
                  <div className="text-[11px] text-[#49454F]">
                    Standard BUP/IBA deduction per wrong MCQ
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${
                  hasNegativeMarking ? 'bg-[#6750A4]' : 'bg-[#CAC4D0]'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                    hasNegativeMarking ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              {/* Start Mock Exam Action Button */}
              <button
                onClick={handleStartExam}
                disabled={isGeneratingAi || (examMode === 'class_wise' && !selectedClassId && filteredAndSortedClasses.length > 0 && false)}
                className="w-full h-14 rounded-full bg-[#6750A4] hover:bg-[#593E96] active:scale-95 disabled:opacity-50 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing Exam Paper...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Start Mock Exam</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // PHASE 2: ACTIVE SINGLE-PAGE MOCK EXAM SCREEN
  // -------------------------------------------------------------
  if (phase === 'exam' && activeQuestions.length > 0) {
    const isTimeUrgent = timeRemainingSeconds < 120;
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200 pb-20">
        
        {/* Top Floating Sticky Exam Header Bar */}
        <div className="sticky top-20 z-20 p-4 sm:p-5 rounded-[28px] bg-[#FFFBFE]/95 backdrop-blur-md border border-[#CAC4D0]/40 shadow-md flex items-center justify-between gap-4">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-medium px-3.5 py-1 rounded-full bg-[#EADDFF] text-[#21005D]">
              {answeredCount} / {activeQuestions.length} Answered
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-[#49454F]">
              {selectedTarget === 'bup_fbs' ? 'BUP FBS Mock' : selectedTarget === 'ju_iba' ? 'JU IBA Mock' : selectedTarget === 'ru_iba' ? 'RU IBA Mock' : 'IBA / FBS Mock'}
            </span>
          </div>

          {/* Live Countdown Timer */}
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-sm font-bold shadow-xs transition-colors ${
            isTimeUrgent
              ? 'bg-[#FFD8E4] text-[#B3261E] animate-pulse border border-[#B3261E]/40'
              : 'bg-[#E8DEF8] text-[#1D192B]'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>

          {/* Finish & Submit Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="h-10 px-5 rounded-full bg-[#B3261E] hover:bg-[#9C2019] text-white text-xs font-medium active:scale-95 transition-all duration-150 cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Exam</span>
          </button>
        </div>

        {/* Quick Jump Bar for Single-Page Navigation */}
        <div className="p-4 rounded-[24px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
          <div className="text-xs font-medium text-[#49454F] shrink-0">
            Jump to Question:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {activeQuestions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isMarked = !!markedForReview[q.id];

              let bg = 'bg-[#FFFBFE] text-[#49454F] border border-[#CAC4D0]/60';
              if (isMarked) {
                bg = 'bg-[#FFDDB3] text-[#603500] border-2 border-[#8C5000] font-bold';
              } else if (isAnswered) {
                bg = 'bg-[#6750A4] text-white font-bold';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => scrollToQuestion(idx)}
                  className={`w-8 h-8 rounded-full text-xs font-mono transition-all duration-150 cursor-pointer shrink-0 ${bg}`}
                  title={`Go to Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* ALL QUESTIONS RENDERED ON A SINGLE SCROLLING PAGE */}
        <div className="space-y-6">
          {activeQuestions.map((q, idx) => {
            const isSelectedAny = userAnswers[q.id] !== undefined;
            const isMarked = !!markedForReview[q.id];

            return (
              <div
                id={`q-card-${idx}`}
                key={q.id}
                className="p-7 sm:p-9 rounded-[32px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-xs space-y-5 transition-all duration-200"
              >
                {/* Question Header & Review Flag */}
                <div className="flex items-center justify-between gap-2 border-b border-[#CAC4D0]/40 pb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#EADDFF] text-[#21005D]">
                      Question {idx + 1}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider px-3 py-0.5 rounded-full bg-[#E8DEF8] text-[#1D192B]">
                      {q.subject}
                    </span>
                    {q.topic && (
                      <span className="text-xs text-[#49454F] font-medium">
                        • {q.topic}
                      </span>
                    )}
                  </div>

                  {/* Mark for review toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleReview(q.id)}
                    className={`h-8 px-3.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer active:scale-95 ${
                      isMarked
                        ? 'bg-[#FFDDB3] text-[#603500] border border-[#8C5000]/40'
                        : 'bg-[#FFFBFE] text-[#49454F] border border-[#CAC4D0]/60 hover:bg-[#EADDFF]'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${isMarked ? 'fill-current' : ''}`} />
                    <span>{isMarked ? 'Marked' : 'Mark'}</span>
                  </button>
                </div>

                {/* Optional Reading Comprehension Passage */}
                {q.passage && (
                  <div className="p-5 rounded-2xl bg-[#FFFBFE] border border-[#CAC4D0]/40 text-xs text-[#1C1B1F] leading-relaxed max-h-48 overflow-y-auto">
                    <div className="font-medium text-[#6750A4] uppercase tracking-wider mb-1">
                      Reading Passage
                    </div>
                    <p className="whitespace-pre-line">{q.passage}</p>
                  </div>
                )}

                {/* Question Statement */}
                <div className="text-base sm:text-lg font-medium text-[#1C1B1F] leading-relaxed whitespace-pre-line">
                  {q.question}
                </div>

                {/* MCQ Options List */}
                <div className="space-y-2.5 pt-1">
                  {q.options.map((option, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isSelected = userAnswers[q.id] === optIdx;

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-150 active:scale-[0.99] flex items-center gap-3.5 ${
                          isSelected
                            ? 'border-[#6750A4] bg-[#EADDFF] shadow-xs'
                            : 'border-[#CAC4D0]/40 bg-[#FFFBFE] hover:border-[#6750A4]/40 hover:bg-[#F3EDF7]'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-colors ${
                          isSelected
                            ? 'bg-[#6750A4] text-white'
                            : 'bg-[#E8DEF8] text-[#1D192B]'
                        }`}>
                          {letter}
                        </div>
                        <div className="text-sm font-medium text-[#1C1B1F] flex-1">
                          {option}
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-[#6750A4]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Submit Action Area */}
        <div className="p-7 rounded-[32px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#49454F] text-center sm:text-left">
            You have answered <strong className="text-[#1C1B1F]">{answeredCount}</strong> of <strong>{activeQuestions.length}</strong> questions.
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#1B5E20] hover:bg-[#144818] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>Submit Exam Paper</span>
          </button>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setShowSubmitModal(false)}
          >
            <div 
              className="w-full max-w-md bg-[#FFFBFE] rounded-[36px] border border-[#CAC4D0]/50 p-8 shadow-2xl space-y-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#EADDFF] text-[#21005D] flex items-center justify-center mx-auto shadow-xs">
                  <Award className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-medium text-[#1C1B1F]">
                  Submit Your Mock Exam?
                </h2>
                <p className="text-xs text-[#49454F]">
                  Are you ready to submit and calculate your final score & analysis?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F3EDF7] text-center text-xs">
                <div>
                  <div className="text-lg font-bold text-[#6750A4]">
                    {answeredCount}
                  </div>
                  <div className="text-[#49454F]">Answered</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#79747E]">
                    {activeQuestions.length - answeredCount}
                  </div>
                  <div className="text-[#49454F]">Unattempted</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 h-12 rounded-full bg-[#E8DEF8] text-[#1D192B] hover:bg-[#D0BCFF] text-xs font-medium transition-colors cursor-pointer"
                >
                  Resume Exam
                </button>
                <button
                  onClick={handleManualSubmit}
                  className="flex-1 h-12 rounded-full bg-[#6750A4] text-white hover:bg-[#593E96] text-xs font-medium transition-colors cursor-pointer shadow-xs"
                >
                  Submit & Score
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // PHASE 3: COMPREHENSIVE SCORECARD & DIAGNOSTIC REVIEW
  // -------------------------------------------------------------
  if (phase === 'result' && examResult) {
    const filteredQuestions = activeQuestions.filter((q) => {
      if (reviewFilter === 'incorrect') return userAnswers[q.id] !== q.correctIndex;
      if (reviewFilter === 'marked') return !!markedForReview[q.id];
      return true;
    });

    return (
      <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
        
        {/* Scorecard Hero Card */}
        <div className="p-8 rounded-[36px] bg-gradient-to-br from-[#6750A4] to-[#4F378B] text-white shadow-lg space-y-6 relative overflow-hidden">
          <div aria-hidden="true" className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#EADDFF]" />
                <span>Mock Exam Scorecard</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight mt-2">
                {examResult.passed ? 'Excellent Performance! 🎉' : 'Good Effort! Review & Improve 💪'}
              </h1>
              <p className="text-xs sm:text-sm text-[#EADDFF] mt-1">
                Completed at {examResult.completedAt} • Time spent: {Math.floor(examResult.timeTakenSeconds / 60)}m {examResult.timeTakenSeconds % 60}s
              </p>
            </div>

            {/* Total Net Score Badge */}
            <div className="p-6 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 text-center min-w-[140px]">
              <div className="text-xs text-[#EADDFF] uppercase tracking-wider font-medium">
                Net Score
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-white mt-1">
                {examResult.netScore} <span className="text-sm font-normal text-white/70">/ {examResult.maxScore}</span>
              </div>
              <div className="text-[11px] text-[#C4EED0] font-medium mt-1">
                {examResult.accuracyPercentage}% Accuracy
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 pt-2 border-t border-white/15">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs text-center">
              <div className="text-xl font-bold text-[#C4EED0]">
                {examResult.correctCount}
              </div>
              <div className="text-[11px] text-white/80">Correct (+1.00)</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs text-center">
              <div className="text-xl font-bold text-[#FFD9E2]">
                {examResult.incorrectCount}
              </div>
              <div className="text-[11px] text-white/80">
                Wrong ({hasNegativeMarking ? `-${examResult.negativeMarks}` : '0.00'})
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs text-center">
              <div className="text-xl font-bold text-white">
                {examResult.unattemptedCount}
              </div>
              <div className="text-[11px] text-white/80">Unattempted</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs text-center">
              <div className="text-xl font-bold text-[#FFDDB3]">
                {Object.keys(markedForReview).filter((k) => markedForReview[k]).length}
              </div>
              <div className="text-[11px] text-white/80">Marked Review</div>
            </div>
          </div>
        </div>

        {/* Section Breakdown Cards */}
        {Object.keys(examResult.sectionScores).length > 1 && (
          <div className="p-7 rounded-[32px] bg-[#F3EDF7] border border-[#CAC4D0]/40 shadow-xs space-y-4">
            <h3 className="text-base font-medium text-[#1C1B1F] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#6750A4]" />
              <span>Sectional Performance Analysis</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(examResult.sectionScores).map(([secName, val]) => {
                const secData = val as { correct: number; incorrect: number; unattempted: number; total: number; marks: number };
                return (
                  <div
                    key={secName}
                    className="p-4 rounded-2xl bg-[#FFFBFE] border border-[#CAC4D0]/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-[#1C1B1F]">
                        {secName}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#6750A4]">
                        {secData.marks.toFixed(2)} / {secData.total}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E7E0EC] overflow-hidden">
                      <div
                        className="h-full bg-[#6750A4] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(0, Math.min(100, (secData.marks / (secData.total || 1)) * 100))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#79747E]">
                      <span>{secData.correct} Correct</span>
                      <span>{secData.incorrect} Wrong</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Controls: Retake Mistakes, New Exam, Curriculum */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-[28px] bg-[#F3EDF7] border border-[#CAC4D0]/40">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePracticeMistakesOnly}
              className="h-10 px-5 rounded-full bg-[#FFD8E4] text-[#31111D] hover:bg-[#FFB0C8] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#7D5260]" />
              <span>Practice Mistakes Only ({examResult.incorrectCount})</span>
            </button>
            <button
              onClick={handleResetToSetup}
              className="h-10 px-5 rounded-full bg-[#E8DEF8] text-[#1D192B] hover:bg-[#D0BCFF] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#6750A4]" />
              <span>New Mock Exam</span>
            </button>
          </div>

          <button
            onClick={onBackToHome}
            className="h-10 px-5 rounded-full bg-[#6750A4] text-white hover:bg-[#593E96] text-xs font-medium transition-colors cursor-pointer active:scale-95 shadow-xs"
          >
            Back to Curriculum
          </button>
        </div>

        {/* Diagnostic Question Review List */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-xl font-medium text-[#1C1B1F]">
              Detailed Question Solutions & Explanations
            </h2>

            {/* Filter Toggle */}
            <div className="flex items-center gap-1 p-1 bg-[#E8DEF8] rounded-full">
              {[
                { id: 'all', label: `All (${activeQuestions.length})` },
                { id: 'incorrect', label: `Mistakes (${examResult.incorrectCount})` },
                { id: 'marked', label: 'Marked' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setReviewFilter(f.id as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                    reviewFilter === f.id
                      ? 'bg-[#6750A4] text-white shadow-xs'
                      : 'text-[#49454F] hover:text-[#1C1B1F]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 rounded-[28px] bg-[#F3EDF7] border border-[#CAC4D0]/40 text-[#49454F] text-xs">
              No questions found under the "{reviewFilter}" filter.
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const chosen = userAnswers[q.id];
              const isCorrect = chosen === q.correctIndex;
              const isUnattempted = chosen === undefined;
              const hasExplanation = !!expandedAiExplanation[q.id];
              const isLoadingAi = loadingAiExplainId === q.id;

              return (
                <div
                  key={q.id}
                  className={`p-7 sm:p-9 rounded-[32px] border shadow-xs space-y-5 bg-[#FFFBFE] ${
                    isCorrect
                      ? 'border-[#2E6C3B]/40'
                      : isUnattempted
                      ? 'border-[#CAC4D0]/60'
                      : 'border-[#B3261E]/40'
                  }`}
                >
                  {/* Status Banner */}
                  <div className="flex items-center justify-between gap-2 border-b border-[#CAC4D0]/40 pb-3">
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1B5E20] bg-[#C4EED0] px-3 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct (+1.00)</span>
                        </span>
                      ) : isUnattempted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#49454F] bg-[#E7E0EC] px-3 py-0.5 rounded-full">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Unattempted (0.00)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#B3261E] bg-[#FFD8E4] px-3 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Wrong ({hasNegativeMarking ? '-0.25' : '0.00'})</span>
                        </span>
                      )}
                      <span className="text-xs uppercase font-medium px-2.5 py-0.5 rounded-full bg-[#E8DEF8] text-[#1D192B]">
                        {q.subject}
                      </span>
                    </div>

                    {q.targetExam && (
                      <span className="text-xs text-[#79747E] font-medium hidden sm:inline">
                        {q.targetExam}
                      </span>
                    )}
                  </div>

                  {/* Passage if present */}
                  {q.passage && (
                    <div className="p-4 rounded-xl bg-[#F3EDF7] border border-[#CAC4D0]/40 text-xs text-[#1C1B1F] leading-relaxed">
                      <div className="font-medium text-[#6750A4] mb-1">Passage Context:</div>
                      <p className="whitespace-pre-line">{q.passage}</p>
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="text-base font-medium text-[#1C1B1F] leading-relaxed whitespace-pre-line">
                    {q.question}
                  </div>

                  {/* Options Review */}
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isOptionCorrect = oIdx === q.correctIndex;
                      const isOptionChosen = chosen === oIdx;

                      let optStyle = 'border-[#CAC4D0]/40 bg-[#FFFBFE] text-[#49454F]';
                      if (isOptionCorrect) {
                        optStyle = 'border-[#2E6C3B] bg-[#C4EED0]/40 text-[#1B5E20] font-medium';
                      } else if (isOptionChosen && !isOptionCorrect) {
                        optStyle = 'border-[#B3261E] bg-[#FFD8E4]/50 text-[#B3261E] font-medium';
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${optStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center font-mono font-bold text-[11px]">
                              {letter}
                            </span>
                            <span>{opt}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isOptionCorrect && (
                              <span className="text-[11px] font-medium text-[#1B5E20] flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Correct Answer</span>
                              </span>
                            )}
                            {isOptionChosen && !isOptionCorrect && (
                              <span className="text-[11px] font-medium text-[#B3261E] flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Your Answer</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Standard Curated Solution */}
                  {q.explanation && (
                    <div className="p-4 rounded-2xl bg-[#F3EDF7] border border-[#CAC4D0]/40 text-xs space-y-1">
                      <div className="font-bold text-[#6750A4] uppercase tracking-wider">
                        Official Solution:
                      </div>
                      <p className="text-[#1C1B1F] leading-relaxed">{q.explanation}</p>
                    </div>
                  )}

                  {/* In-Depth Explanation Display */}
                  {hasExplanation && (
                    <div className="p-5 rounded-2xl bg-[#EADDFF]/40 border border-[#6750A4]/30 text-xs space-y-2 animate-in fade-in">
                      <div className="font-bold text-[#21005D] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#6750A4]" />
                        <span>Detailed Solution Breakdown & Shortcuts:</span>
                      </div>
                      <div className="text-[#1C1B1F] leading-relaxed whitespace-pre-line">
                        {expandedAiExplanation[q.id]}
                      </div>
                    </div>
                  )}

                  {/* Detailed Explanation Button */}
                  {!hasExplanation && (
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleAskAiExplainer(q)}
                        disabled={isLoadingAi}
                        className="h-9 px-4 rounded-full bg-[#6750A4]/10 hover:bg-[#6750A4]/20 text-[#6750A4] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {isLoadingAi ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Generating Detailed Breakdown...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Get In-Depth Solution & Math/Grammar Shortcuts</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return null;
};
