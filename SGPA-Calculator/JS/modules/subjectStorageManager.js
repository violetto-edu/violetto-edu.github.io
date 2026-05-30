/**
 * Subject Storage Manager Module
 * Persists subject-level marks and grades in browser localStorage
 */

export class SubjectStorageManager {
  static STORAGE_KEY = 'vtuSubjectRecordsV1';

  /**
   * Create a branch-specific storage scope
   * @param {{semester: number|string, branch_scope?: string}} subject
   * @returns {string}
   */
  static getBranchScope(subject) {
    const semester = Number.parseInt(subject?.semester, 10);
    if (semester === 1 || semester === 2) {
      return 'common';
    }

    return (subject?.branch_scope || 'unknown').toLowerCase();
  }

  /**
   * Read the persisted store from localStorage
   * @returns {{subjects: Record<string, any>, updatedAt: string|null}}
   */
  static readStore() {
    try {
      const storedValue = window.localStorage.getItem(this.STORAGE_KEY);
      if (!storedValue) {
        return { subjects: {}, updatedAt: null };
      }

      const parsedValue = JSON.parse(storedValue);
      return {
        subjects: parsedValue?.subjects || {},
        updatedAt: parsedValue?.updatedAt || null
      };
    } catch (error) {
      console.warn('Failed to read subject storage:', error);
      return { subjects: {}, updatedAt: null };
    }
  }

  /**
   * Persist store to localStorage
   * @param {{subjects: Record<string, any>, updatedAt: string|null}} store
   */
  static writeStore(store) {
    try {
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      console.warn('Failed to write subject storage:', error);
    }
  }

  /**
   * Create a stable key for a subject
   * @param {{subject_code: string, semester: number|string, branch_scope?: string}} subject
   * @returns {string|null}
   */
  static createSubjectKey(subject) {
    const subjectCode = subject?.subject_code?.trim();
    const semester = subject?.semester;

    if (!subjectCode || semester === null || semester === undefined) {
      return null;
    }

    return `${this.getBranchScope(subject)}:${semester}:${subjectCode}`;
  }

  /**
   * Legacy key format used before branch scoping
   * @param {{subject_code: string, semester: number|string}} subject
   * @returns {string|null}
   */
  static createLegacySubjectKey(subject) {
    const subjectCode = subject?.subject_code?.trim();
    const semester = subject?.semester;

    if (!subjectCode || semester === null || semester === undefined) {
      return null;
    }

    return `${semester}:${subjectCode}`;
  }

  /**
   * Resolve persisted data for a subject, with limited legacy fallback for common semesters
   * @param {{subject_code: string, semester: number|string, branch_scope?: string}} subject
   * @param {{subjects: Record<string, any>}} store
   * @returns {any|null}
   */
  static resolveStoredSubject(subject, store) {
    const key = this.createSubjectKey(subject);
    if (key && store.subjects[key]) {
      return store.subjects[key];
    }

    const semester = Number.parseInt(subject?.semester, 10);
    if (semester === 1 || semester === 2) {
      const legacyKey = this.createLegacySubjectKey(subject);
      return legacyKey ? store.subjects[legacyKey] || null : null;
    }

    return null;
  }

  /**
   * Normalize a subject for persistence
   * @param {any} subject
   * @returns {any|null}
   */
  static normalizeSubject(subject) {
    const key = this.createSubjectKey(subject);
    if (!key) {
      return null;
    }

    const marks =
      subject?.marks !== null &&
      subject?.marks !== undefined &&
      subject?.marks !== ''
        ? Number.parseFloat(subject.marks)
        : null;

    const grade = typeof subject?.grade === 'string' ? subject.grade.trim() : '';
    const inputType =
      subject?.inputType === 'grade'
        ? 'grade'
        : marks !== null
          ? 'marks'
          : grade
            ? 'grade'
            : 'marks';

    return {
      key,
      subject_code: subject.subject_code.trim(),
      subject_name: subject.subject_name || '',
      branch_scope: this.getBranchScope(subject),
      credits:
        subject.credits !== null && subject.credits !== undefined
          ? Number.parseFloat(subject.credits)
          : 0,
      semester: Number.parseInt(subject.semester, 10),
      max_marks:
        subject.max_marks !== null && subject.max_marks !== undefined
          ? Number.parseFloat(subject.max_marks)
          : 100,
      marks: Number.isFinite(marks) ? marks : null,
      grade,
      inputType,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Merge a list of subjects into local storage
   * @param {any[]} subjects
   * @returns {{created: number, updated: number, totalStored: number}}
   */
  static mergeSubjects(subjects = []) {
    const store = this.readStore();
    let created = 0;
    let updated = 0;

    subjects.forEach((subject) => {
      const normalizedSubject = this.normalizeSubject(subject);
      if (!normalizedSubject) {
        return;
      }

      const existingSubject = store.subjects[normalizedSubject.key];
      const hasChanged =
        !existingSubject ||
        existingSubject.subject_name !== normalizedSubject.subject_name ||
        existingSubject.credits !== normalizedSubject.credits ||
        existingSubject.max_marks !== normalizedSubject.max_marks ||
        existingSubject.marks !== normalizedSubject.marks ||
        existingSubject.grade !== normalizedSubject.grade ||
        existingSubject.inputType !== normalizedSubject.inputType;

      if (!existingSubject) {
        created++;
      } else if (hasChanged) {
        updated++;
      }

      if (hasChanged) {
        store.subjects[normalizedSubject.key] = normalizedSubject;
      }
    });

    if (created > 0 || updated > 0) {
      store.updatedAt = new Date().toISOString();
      this.writeStore(store);
    }

    return {
      created,
      updated,
      totalStored: Object.keys(store.subjects).length
    };
  }

  /**
   * Hydrate subjects with persisted values if available
   * @param {any[]} subjects
   * @returns {any[]}
   */
  static hydrateSubjects(subjects = []) {
    const store = this.readStore();

    return subjects.map((subject) => {
      const storedSubject = this.resolveStoredSubject(subject, store);

      if (!storedSubject) {
        return { ...subject };
      }

      return {
        ...subject,
        marks:
          storedSubject.marks !== null && storedSubject.marks !== undefined
            ? storedSubject.marks
            : subject.marks,
        grade: storedSubject.grade || subject.grade,
        inputType:
          storedSubject.inputType ||
          subject.inputType ||
          (storedSubject.marks !== null ? 'marks' : 'grade'),
        storedRecord: true
      };
    });
  }

  /**
   * Count how many of the provided subjects have persisted values
   * @param {any[]} subjects
   * @returns {number}
   */
  static countStoredMatches(subjects = []) {
    const store = this.readStore();

    return subjects.reduce((count, subject) => {
      return this.resolveStoredSubject(subject, store) ? count + 1 : count;
    }, 0);
  }

  /**
   * Count all persisted subjects
   * @returns {number}
   */
  static getStoredSubjectCount() {
    const store = this.readStore();
    return Object.keys(store.subjects).length;
  }
}
