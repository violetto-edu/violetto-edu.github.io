/**
 * Grade Utilities Module
 * Contains grade mappings and conversion functions
 */

// Grade point to letter grade mapping
export const gradeMapping = {
  10: 'O',
  9: 'A+',
  8: 'A',
  7: 'B+',
  6: 'B',
  5: 'C',
  4: 'P',
  0: 'F'
};

// Letter grade to grade point mapping
export const letterGradeMapping = {
  O: 10,
  'A+': 9,
  A: 8,
  'B+': 7,
  B: 6,
  C: 5,
  P: 4,
  F: 0
};

/**
 * Get grade point based on marks
 * @param {number} marks - The marks obtained
 * @param {number} maxMarks - The maximum marks (default: 100)
 * @returns {number} The corresponding grade point
 */
export function getGradePoint(marks, maxMarks = 100) {
  // Convert to percentage
  const percentage = (marks / maxMarks) * 100;

  if (percentage >= 90 && percentage <= 100) return 10;
  if (percentage >= 80) return 9;
  if (percentage >= 70) return 8;
  if (percentage >= 60) return 7;
  if (percentage >= 55) return 6;
  if (percentage >= 50) return 5;
  if (percentage >= 40) return 4;
  return 0;
}

/**
 * Get approximate marks from grade point (for display purposes)
 * @param {number} gradePoint - The grade point
 * @returns {number} The approximate marks
 */
export function getMarksFromGrade(gradePoint) {
  switch (gradePoint) {
    case 10:
      return 95; // O: 90-100
    case 9:
      return 85; // A+: 80-89
    case 8:
      return 75; // A: 70-79
    case 7:
      return 65; // B+: 60-69
    case 6:
      return 57; // B: 55-59
    case 5:
      return 52; // C: 50-54
    case 4:
      return 45; // P: 40-49
    default:
      return 20; // F: 0-39
  }
}
