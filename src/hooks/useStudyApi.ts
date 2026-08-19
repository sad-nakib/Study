import { useState, useEffect, useCallback } from 'react';
import { Subject, StudyClass } from '../types';

const LOCAL_BACKUP_KEY = 'study_tiles_data_v2';

export function useStudyApi() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<StudyClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data from backend API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.subjects && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
      }
      if (data.classes && Array.isArray(data.classes)) {
        setClasses(data.classes);
      }
      // Save local backup
      localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(data));
      setError(null);
    } catch (err: any) {
      console.warn('Backend fetch failed, loading from local backup:', err);
      try {
        const local = localStorage.getItem(LOCAL_BACKUP_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          setSubjects(parsed.subjects || []);
          setClasses(parsed.classes || []);
        }
      } catch (e) {
        console.error('Failed to load local backup:', e);
      }
      setError('Working in offline/local mode');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Create Subject
  const addSubject = async (data: { name: string; code?: string; description?: string; color?: string; icon?: string }) => {
    const tempId = `subj-${Date.now()}`;
    const newSubject: Subject = {
      id: tempId,
      name: data.name.trim(),
      code: data.code?.trim() || undefined,
      description: data.description?.trim() || undefined,
      color: data.color || 'indigo',
      icon: data.icon || 'BookOpen',
      order: subjects.length + 1,
    };

    // Optimistic update
    setSubjects((prev) => [...prev, newSubject]);

    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        setSubjects((prev) => prev.map((s) => (s.id === tempId ? created : s)));
        return created;
      }
    } catch (err) {
      console.error('Failed to save subject to backend:', err);
    }
    return newSubject;
  };

  // Update Subject
  const updateSubject = async (id: string, data: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));

    try {
      await fetch(`/api/subjects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to update subject on backend:', err);
    }
  };

  // Delete Subject
  const deleteSubject = async (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setClasses((prev) => prev.filter((c) => c.subjectId !== id));

    try {
      await fetch(`/api/subjects/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete subject on backend:', err);
    }
  };

  // Create Class
  const addClass = async (data: {
    subjectId: string;
    title: string;
    youtubeUrl: string;
    driveSheetUrl?: string;
    bookPdfUrl?: string;
    topic?: string;
    instructor?: string;
  }) => {
    const tempId = `cls-${Date.now()}`;
    const newClass: StudyClass = {
      id: tempId,
      subjectId: data.subjectId,
      title: data.title.trim(),
      youtubeUrl: data.youtubeUrl.trim(),
      driveSheetUrl: data.driveSheetUrl ? data.driveSheetUrl.trim() : '',
      bookPdfUrl: data.bookPdfUrl ? data.bookPdfUrl.trim() : undefined,
      topic: data.topic ? data.topic.trim() : undefined,
      instructor: data.instructor ? data.instructor.trim() : undefined,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    // Optimistic update
    setClasses((prev) => [...prev, newClass]);

    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        setClasses((prev) => prev.map((c) => (c.id === tempId ? created : c)));
        return created;
      }
    } catch (err) {
      console.error('Failed to save class on backend:', err);
    }
    return newClass;
  };

  // Update Class
  const updateClass = async (id: string, data: Partial<StudyClass>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));

    try {
      await fetch(`/api/classes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to update class on backend:', err);
    }
  };

  // Delete Class
  const deleteClass = async (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));

    try {
      await fetch(`/api/classes/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete class on backend:', err);
    }
  };

  // Reset to default sample
  const resetData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSubjects(data.subjects);
        setClasses(data.classes);
      }
    } catch (e) {
      console.error('Failed to reset:', e);
    } finally {
      setLoading(false);
    }
  };

  return {
    subjects,
    classes,
    loading,
    error,
    addSubject,
    updateSubject,
    deleteSubject,
    addClass,
    updateClass,
    deleteClass,
    resetData,
    refreshData: fetchData,
  };
}
