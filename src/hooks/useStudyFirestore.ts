import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Subject, StudyClass } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
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
  const [loading, setLoading] = useState<boolean>(true);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Real-time listener for subjects and classes
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
              batch.set(ref, s);
            });
            INITIAL_CLASSES.forEach((c) => {
              const ref = doc(db, 'classes', c.id);
              batch.set(ref, c);
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
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Subject);
        });
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
        setSubjects(items);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'subjects');
        setLoading(false);
      }
    );

    const unsubClasses = onSnapshot(
      collection(db, 'classes'),
      (snapshot) => {
        const items: StudyClass[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as StudyClass);
        });
        setClasses(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'classes');
      }
    );

    return () => {
      unsubSubjects();
      unsubClasses();
    };
  }, [isSeeding]);

  // Create Subject in Firestore
  const addSubject = async (data: { name: string; code?: string; description?: string; color?: string; icon?: string }) => {
    const id = `subj-${Date.now()}`;
    const newSubject: Subject = {
      id,
      name: data.name.trim(),
      code: data.code?.trim() || undefined,
      description: data.description?.trim() || undefined,
      color: data.color || 'indigo',
      icon: data.icon || 'BookOpen',
      order: subjects.length + 1,
    };

    try {
      const docRef = doc(db, 'subjects', id);
      await setDoc(docRef, newSubject);
      return newSubject;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `subjects/${id}`);
    }
  };

  // Update Subject in Firestore
  const updateSubject = async (id: string, data: Partial<Subject>) => {
    try {
      const docRef = doc(db, 'subjects', id);
      await updateDoc(docRef, data as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `subjects/${id}`);
    }
  };

  // Delete Subject & its classes in Firestore
  const deleteSubject = async (id: string) => {
    try {
      // Delete subject doc
      await deleteDoc(doc(db, 'subjects', id));
      
      // Delete related classes
      const relatedClasses = classes.filter((c) => c.subjectId === id);
      for (const cls of relatedClasses) {
        await deleteDoc(doc(db, 'classes', cls.id));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `subjects/${id}`);
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
      bookPdfUrl: data.bookPdfUrl ? data.bookPdfUrl.trim() : undefined,
      topic: data.topic ? data.topic.trim() : undefined,
      instructor: data.instructor ? data.instructor.trim() : undefined,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    try {
      const docRef = doc(db, 'classes', id);
      await setDoc(docRef, newClass);
      return newClass;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `classes/${id}`);
    }
  };

  // Update Class in Firestore
  const updateClass = async (id: string, data: Partial<StudyClass>) => {
    try {
      const docRef = doc(db, 'classes', id);
      await updateDoc(docRef, data as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `classes/${id}`);
    }
  };

  // Delete Class in Firestore
  const deleteClass = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'classes', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `classes/${id}`);
    }
  };

  // Reset to default sample
  const resetData = async () => {
    setLoading(true);
    try {
      // Clear existing
      const subjectsSnapshot = await getDocs(collection(db, 'subjects'));
      const classesSnapshot = await getDocs(collection(db, 'classes'));

      const batch = writeBatch(db);
      subjectsSnapshot.forEach((d) => batch.delete(d.ref));
      classesSnapshot.forEach((d) => batch.delete(d.ref));

      INITIAL_SUBJECTS.forEach((s) => {
        batch.set(doc(db, 'subjects', s.id), s);
      });
      INITIAL_CLASSES.forEach((c) => {
        batch.set(doc(db, 'classes', c.id), c);
      });

      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'reset');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
