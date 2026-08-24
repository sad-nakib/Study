import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Subject, StudyClass, ActivityLog, ActivityType, ActivityMetadata } from '../types';

// Helper to remove any undefined or null keys from objects before sending to Firestore
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined && val !== null) {
      if (typeof val === 'object' && !Array.isArray(val)) {
        result[key] = sanitizeForFirestore(val);
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-english',
    name: 'English',
    code: 'ENG',
    description: 'Grammar, Comprehension, Vocabulary & Writing Skills',
    color: 'indigo',
    icon: 'BookOpen',
    order: 1,
  },
  {
    id: 'subj-math',
    name: 'Math',
    code: 'MATH',
    description: 'Algebra, Calculus, Geometry & Problem Solving',
    color: 'emerald',
    icon: 'Calculator',
    order: 2,
  },
  {
    id: 'subj-gk',
    name: 'General Knowledge',
    code: 'GK',
    description: 'Current Affairs, World History, Science & Geography',
    color: 'amber',
    icon: 'Globe',
    order: 3,
  },
];

const INITIAL_CLASSES: StudyClass[] = [
  {
    id: 'cls-eng-1',
    subjectId: 'subj-english',
    title: 'Class 01: Complete Tenses & Sentence Structures',
    youtubeUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME',
    driveSheetUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
    bookPdfUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
    topic: 'Grammar Fundamentals',
    instructor: 'Prof. Sarah',
    dateAdded: '2026-08-01',
  },
  {
    id: 'cls-eng-2',
    subjectId: 'subj-english',
    title: 'Class 02: Vocabulary Building & Idiomatic Expressions',
    youtubeUrl: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
    driveSheetUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
    topic: 'Vocabulary Mastery',
    instructor: 'Prof. Sarah',
    dateAdded: '2026-08-05',
  },
  {
    id: 'cls-eng-3',
    subjectId: 'subj-english',
    title: 'Class 03: Reading Comprehension Techniques & Speed Tactics',
    youtubeUrl: 'https://www.youtube.com/watch?v=76dhtgZt38A',
    driveSheetUrl: 'https://docs.google.com/presentation/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
    topic: 'Reading & Analysis',
    instructor: 'Prof. Sarah',
    dateAdded: '2026-08-10',
  },
  {
    id: 'cls-math-1',
    subjectId: 'subj-math',
    title: 'Class 01: Linear Equations, Graphs & Matrix Basics',
    youtubeUrl: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
    driveSheetUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
    bookPdfUrl: 'https://openstax.org/details/books/calculus-volume-1',
    topic: 'Algebra & Matrices',
    instructor: 'Prof. Gilbert',
    dateAdded: '2026-08-02',
  },
  {
    id: 'cls-math-2',
    subjectId: 'subj-math',
    title: 'Class 02: Differentiation Rules & Rate of Change',
    youtubeUrl: 'https://www.youtube.com/watch?v=PFDu9oVAE-g',
    driveSheetUrl: 'https://docs.google.com/presentation/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
    topic: 'Calculus Foundations',
    instructor: 'Prof. Gilbert',
    dateAdded: '2026-08-06',
  },
  {
    id: 'cls-math-3',
    subjectId: 'subj-math',
    title: 'Class 03: Probability & Permutation Combinations',
    youtubeUrl: 'https://www.youtube.com/watch?v=s-CYnVz-uh4',
    driveSheetUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
    topic: 'Probability Theory',
    instructor: 'Prof. Gilbert',
    dateAdded: '2026-08-11',
  },
  {
    id: 'cls-gk-1',
    subjectId: 'subj-gk',
    title: 'Class 01: Modern World History & International Treaties',
    youtubeUrl: 'https://www.youtube.com/watch?v=7Zc9Nu_3VGs',
    driveSheetUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
    bookPdfUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
    topic: 'World Affairs',
    instructor: 'Dr. Walter',
    dateAdded: '2026-08-03',
  },
  {
    id: 'cls-gk-2',
    subjectId: 'subj-gk',
    title: 'Class 02: Physical Geography, Oceans & Climate Zones',
    youtubeUrl: 'https://www.youtube.com/watch?v=hO3z2u3vW28',
    driveSheetUrl: 'https://docs.google.com/presentation/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
    topic: 'Geography',
    instructor: 'Dr. Walter',
    dateAdded: '2026-08-08',
  },
];

export function useStudyFirestore() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<StudyClass[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('studyhub_activities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Real-time listener for subjects, classes, and activities
  useEffect(() => {
    setLoading(true);

    const unsubSubjects = onSnapshot(
      collection(db, 'subjects'),
      async (snapshot) => {
        if (snapshot.empty && !isSeeding) {
          // Auto-seed initial English, Math, GK subjects
          setIsSeeding(true);
          try {
            const batch = writeBatch(db);
            INITIAL_SUBJECTS.forEach((s) => {
              const ref = doc(db, 'subjects', s.id);
              batch.set(ref, sanitizeForFirestore(s));
            });
            INITIAL_CLASSES.forEach((c) => {
              const ref = doc(db, 'classes', c.id);
              batch.set(ref, sanitizeForFirestore(c));
            });
            await batch.commit();
          } catch (err) {
            console.error('Failed to seed initial Firestore data:', err);
          } finally {
            setIsSeeding(false);
          }
          return;
        }

        const items: Subject[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as Subject);
        });
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
        setSubjects(items);
        setLoading(false);
      },
      (error) => {
        console.error('Subjects Firestore listener error:', error);
        setLoading(false);
      }
    );

    const unsubClasses = onSnapshot(
      collection(db, 'classes'),
      (snapshot) => {
        const items: StudyClass[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as StudyClass);
        });
        setClasses(items);
      },
      (error) => {
        console.error('Classes Firestore listener error:', error);
      }
    );

    const unsubActivities = onSnapshot(
      collection(db, 'activities'),
      (snapshot) => {
        const items: ActivityLog[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as ActivityLog);
        });
        // Sort newest first
        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (items.length > 0) {
          setActivities(items);
          try {
            localStorage.setItem('studyhub_activities', JSON.stringify(items.slice(0, 100)));
          } catch {}
        }
      },
      (error) => {
        console.error('Activities Firestore listener error:', error);
      }
    );

    return () => {
      unsubSubjects();
      unsubClasses();
      unsubActivities();
    };
  }, [isSeeding]);

  // Create Subject in Firestore
  const addSubject = async (data: { name: string; code?: string; description?: string; color?: string; icon?: string }) => {
    const id = `subj-${Date.now()}`;
    const newSubject: Subject = {
      id,
      name: data.name.trim(),
      code: data.code?.trim() || '',
      description: data.description?.trim() || '',
      color: data.color || 'indigo',
      icon: data.icon || 'BookOpen',
      order: subjects.length + 1,
    };

    const docRef = doc(db, 'subjects', id);
    const sanitized = sanitizeForFirestore(newSubject);
    await setDoc(docRef, sanitized);
    return newSubject;
  };

  // Update Subject in Firestore
  const updateSubject = async (id: string, data: Partial<Subject>) => {
    const docRef = doc(db, 'subjects', id);
    const sanitized = sanitizeForFirestore(data);
    await updateDoc(docRef, sanitized);
  };

  // Delete Subject & its classes in Firestore
  const deleteSubject = async (id: string) => {
    // Delete subject doc
    await deleteDoc(doc(db, 'subjects', id));
    
    // Delete related classes
    const relatedClasses = classes.filter((c) => c.subjectId === id);
    for (const cls of relatedClasses) {
      await deleteDoc(doc(db, 'classes', cls.id));
    }
  };

  // Create Class in Firestore
  const addClass = async (data: {
    subjectId: string;
    title: string;
    youtubeUrl: string;
    driveSheetUrl?: string;
    bookPdfUrl?: string;
    topic?: string;
    instructor?: string;
  }) => {
    const id = `cls-${Date.now()}`;
    const newClass: StudyClass = {
      id,
      subjectId: data.subjectId,
      title: data.title.trim(),
      youtubeUrl: data.youtubeUrl.trim(),
      driveSheetUrl: data.driveSheetUrl ? data.driveSheetUrl.trim() : '',
      bookPdfUrl: data.bookPdfUrl ? data.bookPdfUrl.trim() : '',
      topic: data.topic ? data.topic.trim() : '',
      instructor: data.instructor ? data.instructor.trim() : '',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    const docRef = doc(db, 'classes', id);
    const sanitized = sanitizeForFirestore(newClass);
    await setDoc(docRef, sanitized);
    return newClass;
  };

  // Update Class in Firestore
  const updateClass = async (id: string, data: Partial<StudyClass>) => {
    const docRef = doc(db, 'classes', id);
    const sanitized = sanitizeForFirestore(data);
    await updateDoc(docRef, sanitized);
  };

  // Delete Class in Firestore
  const deleteClass = async (id: string) => {
    await deleteDoc(doc(db, 'classes', id));
  };

  // Reset to default sample
  const resetData = async () => {
    setLoading(true);
    try {
      const subjectsSnapshot = await getDocs(collection(db, 'subjects'));
      const classesSnapshot = await getDocs(collection(db, 'classes'));

      const batch = writeBatch(db);
      subjectsSnapshot.forEach((d) => batch.delete(d.ref));
      classesSnapshot.forEach((d) => batch.delete(d.ref));

      INITIAL_SUBJECTS.forEach((s) => {
        batch.set(doc(db, 'subjects', s.id), sanitizeForFirestore(s));
      });
      INITIAL_CLASSES.forEach((c) => {
        batch.set(doc(db, 'classes', c.id), sanitizeForFirestore(c));
      });

      await batch.commit();
    } catch (error) {
      console.error('Reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Lesson Completion Status
  const toggleLessonCompleted = async (id: string, currentStatus?: boolean) => {
    const nextStatus = !currentStatus;
    // Optimistically update local state
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isCompleted: nextStatus } : c))
    );
    try {
      const docRef = doc(db, 'classes', id);
      await updateDoc(docRef, { isCompleted: nextStatus });
    } catch (err) {
      console.error('Failed to update class completion status:', err);
      // Fallback: try local persist or sync if firestore rule/network issues
    }
  };

  // Log User Activity & Movement with exact Date & Time
  const logActivity = useCallback(async (
    type: ActivityType,
    title: string,
    details?: string,
    metadata?: ActivityMetadata
  ) => {
    const now = new Date();
    const id = `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const newActivity: ActivityLog = {
      id,
      type,
      title: title.trim(),
      details: details ? details.trim() : undefined,
      subjectName: metadata?.subjectName,
      timestamp: now.toISOString(),
      formattedDate,
      formattedTime,
      metadata,
    };

    // Update local state immediately
    setActivities((prev) => {
      const updated = [newActivity, ...prev].slice(0, 200);
      try {
        localStorage.setItem('studyhub_activities', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Write to Firestore asynchronously
    try {
      const docRef = doc(db, 'activities', id);
      const sanitized = sanitizeForFirestore(newActivity);
      await setDoc(docRef, sanitized);
    } catch (err) {
      console.warn('Could not persist activity log to Firestore, preserved in local storage:', err);
    }
  }, []);

  // Clear all Activity Logs (Management feature)
  const clearActivities = async () => {
    setActivities([]);
    try {
      localStorage.removeItem('studyhub_activities');
      const snapshot = await getDocs(collection(db, 'activities'));
      const batch = writeBatch(db);
      snapshot.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    } catch (err) {
      console.error('Failed to clear activities:', err);
    }
  };

  return {
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
    toggleLessonCompleted,
    logActivity,
    clearActivities,
    resetData,
  };
}
