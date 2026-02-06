/**
 * UI Manager Module
 * Handles UI initialization, interactions, and subject display
 */

import { DataManager } from './dataManager.js';
import { GPACalculator } from './gpaCalculator.js';
import { PopupManager } from './popupManager.js';

export class UIManager {
  constructor() {
    this.initializeUI();
    this.setupEventListeners();
  }

  /**
   * Initialize UI elements
   */
  initializeUI() {
    const subjectTableContainer = document.getElementById(
      'subjectTableContainer'
    );
    const resultDiv = document.getElementById('result');
    if (subjectTableContainer) subjectTableContainer.classList.add('hidden');
    if (resultDiv) resultDiv.classList.add('hidden');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    document.querySelectorAll('input[name="gradeType"]').forEach((radio) => {
      radio.addEventListener('change', this.handleInputChange.bind(this));
    });

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', this.handleInputChange.bind(this));
      submitBtn.addEventListener('click', this.handleSubmit.bind(this));
    }

    const branchSelect = document.getElementById('branch');
    if (branchSelect)
      branchSelect.addEventListener(
        'change',
        this.handleInputChange.bind(this)
      );

    const semesterSelect = document.getElementById('semester');
    if (semesterSelect)
      semesterSelect.addEventListener(
        'change',
        this.handleInputChange.bind(this)
      );
  }

  /**
   * Handle input changes
   */
  handleInputChange() {
    const gradeType = document.querySelector(
      'input[name="gradeType"]:checked'
    )?.value;
    const semesterContainer = document.getElementById('semesterContainer');
    const branchContainer = document.getElementById('branchContainer');
    const subjectTableContainer = document.getElementById(
      'subjectTableContainer'
    );
    const resultDiv = document.getElementById('result');
    const semesterSelect = document.getElementById('semester');

    if (subjectTableContainer) subjectTableContainer.innerHTML = '';
    if (resultDiv) resultDiv.innerHTML = '';
    if (subjectTableContainer) subjectTableContainer.classList.add('hidden');
    if (resultDiv) resultDiv.classList.add('hidden');
    if (semesterContainer) semesterContainer.style.display = 'block';
    if (branchContainer) branchContainer.style.display = 'block';

    if (gradeType === 'sgpa' && semesterSelect) {
      const semesterValue = semesterSelect.value;
      if (semesterValue === '1' || semesterValue === '2') {
        if (branchContainer) branchContainer.style.display = 'none';
      } else {
        if (branchContainer) branchContainer.style.display = 'block';
      }
    } else {
      if (semesterContainer) semesterContainer.style.display = 'none';
    }
  }

  /**
   * Handle form submission
   */
  handleSubmit() {
    const semester = document.getElementById('semester')?.value;
    const branch = document.getElementById('branch')?.value;
    const gradeType = document.querySelector(
      'input[name="gradeType"]:checked'
    )?.value;

    if (!semester || !branch || !gradeType) {
      PopupManager.showWarningPopup(
        ['Please select all required fields.'],
        false
      );
      return;
    }

    if (gradeType === 'sgpa' && semester !== '1' && semester !== '2') {
      DataManager.fetchSubjects(`data/${branch}.json`, semester)
        .then((subjects) => {
          this.displaySubjects(subjects);
          this.scrollToElement('subjectTableContainer');
        })
        .catch(() => {
          // Error handling is done in DataManager
        });
    } else if (gradeType === 'sgpa' && (semester === '1' || semester === '2')) {
      const currentSemester = semester === '1' ? 'one' : 'two';
      DataManager.fetchSubjects(`data/${currentSemester}.json`)
        .then((subjects) => {
          this.displaySubjects(subjects);
          this.scrollToElement('subjectTableContainer');
        })
        .catch(() => {
          // Error handling is done in DataManager
        });
    } else {
      DataManager.fetchCGPAData(branch)
        .then((subjects) => {
          this.displaySubjects(subjects);
          this.scrollToElement('subjectTableContainer');
        })
        .catch(() => {
          // Error handling is done in DataManager
        });
    }
  }

  /**
   * Handle input type change for individual subjects
   * @param {number} subjectIndex - Index of the subject
   */
  static handleInputTypeChange(subjectIndex) {
    const inputTypeRadio = document.querySelector(
      `input[name="inputType_${subjectIndex}"]:checked`
    );
    const marksInput = document.getElementById(`marks_${subjectIndex}`);
    const gradeSelect = document.getElementById(`grade_${subjectIndex}`);

    if (inputTypeRadio && inputTypeRadio.value === 'marks') {
      marksInput.style.display = 'block';
      gradeSelect.style.display = 'none';
      marksInput.required = true;
      gradeSelect.required = false;
    } else {
      marksInput.style.display = 'none';
      gradeSelect.style.display = 'block';
      marksInput.required = false;
      gradeSelect.required = true;
    }
  }

  /**
   * Handle default input type change for all subjects
   */
  static handleDefaultInputTypeChange() {
    const defaultInputType = document.querySelector(
      'input[name="defaultInputType"]:checked'
    )?.value;
    const subjects = document.querySelectorAll('tbody tr');

    subjects.forEach((row, index) => {
      const marksRadio = document.querySelector(
        `input[name="inputType_${index}"][value="marks"]`
      );
      const gradeRadio = document.querySelector(
        `input[name="inputType_${index}"][value="grade"]`
      );

      if (defaultInputType === 'marks') {
        if (marksRadio) marksRadio.checked = true;
      } else {
        if (gradeRadio) gradeRadio.checked = true;
      }

      // Apply the change
      UIManager.handleInputTypeChange(index);
    });
  }

  /**
   * Handle semester-specific default input type change (for CGPA)
   * @param {string} semester - The semester number
   */
  static handleSemesterDefaultInputTypeChange(semester) {
    const defaultInputType = document.querySelector(
      `input[name="semesterDefaultInputType_${semester}"]:checked`
    )?.value;

    // Find all subject rows for this semester
    const semesterRows = document.querySelectorAll('tbody tr');
    let isInTargetSemester = false;
    let subjectIndex = 0;

    semesterRows.forEach((row) => {
      // Check if this is a semester separator row
      const semesterHeader = row.querySelector('td[colspan="6"]');
      if (semesterHeader) {
        const headerText = semesterHeader.textContent;
        isInTargetSemester = headerText.includes(`Semester ${semester}`);
        return;
      }

      // If we're in the target semester and this is a subject row
      if (isInTargetSemester && row.querySelector('input[name="credits"]')) {
        const marksRadio = document.querySelector(
          `input[name="inputType_${subjectIndex}"][value="marks"]`
        );
        const gradeRadio = document.querySelector(
          `input[name="inputType_${subjectIndex}"][value="grade"]`
        );

        if (defaultInputType === 'marks') {
          if (marksRadio) marksRadio.checked = true;
        } else {
          if (gradeRadio) gradeRadio.checked = true;
        }

        // Apply the change
        UIManager.handleInputTypeChange(subjectIndex);
        subjectIndex++;
      } else if (row.querySelector('input[name="credits"]')) {
        // Count other semester subjects to maintain correct indexing
        subjectIndex++;
      }
    });
  }

  /**
   * Display subjects in the table
   * @param {any[]} subjects - Array of subject objects
   */
  displaySubjects(subjects) {
    const container = document.getElementById('subjectTableContainer');
    if (!container) return;

    container.innerHTML = '';

    if (subjects.length === 0) {
      container.innerHTML = `
        <h2 class="text-xl text-gray-700 dark:text-gray-300 text-center py-6 text-heading">
          No subjects found for selected criteria.
        </h2>`;
      return;
    }

    // Group subjects by semester
    const subjectsBySemester = subjects.reduce((acc, subject) => {
      const semester = subject.semester;
      if (!acc[semester]) {
        acc[semester] = [];
      }
      acc[semester].push(subject);
      return acc;
    }, {});

    // Sort semesters in ascending order
    const sortedSemesters = Object.keys(subjectsBySemester).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    let table = this.generateTableHTML();

    let globalIndex = 0;

    sortedSemesters.forEach((semester, semesterIndex) => {
      const semesterSubjects = subjectsBySemester[semester];
      const gradeType = document.querySelector(
        'input[name="gradeType"]:checked'
      )?.value;

      // Add semester separator row
      table += this.generateSemesterSeparatorHTML(semester, gradeType);

      semesterSubjects.forEach((subject, index) => {
        const rowClass =
          globalIndex % 2 === 0
            ? 'bg-white dark:bg-gray-800'
            : 'bg-gray-50 dark:bg-gray-900';
        table += this.generateSubjectRowHTML(subject, globalIndex, rowClass);
        globalIndex++;
      });
    });

    table += this.generateTableFooterHTML();

    container.innerHTML = table;
    container.classList.remove('hidden');

    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => {
        const calculator = new GPACalculator();
        calculator.calculateGPA();
      });
    }
  }

  /**
   * Generate table header HTML
   * @returns {string} Table header HTML
   */
  generateTableHTML() {
    return `
    <form id="marksForm" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 text-heading w-full">Subject Details</h3>
          <div class="flex items-start justify-between md:justify-end w-full space-x-4">
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 text-caption">Default Input Type:</span>
            <div class="flex flex-col md:flex-row items-center gap-2">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  name="defaultInputType"
                  value="marks"
                  checked
                  onchange="window.UIManager.handleDefaultInputTypeChange()"
                  class="form-radio text-fuchsia-600 focus:ring-fuchsia-500"
                >
                <span class="text-sm text-gray-700 dark:text-gray-300 text-body">Marks</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  name="defaultInputType"
                  value="grade"
                  onchange="window.UIManager.handleDefaultInputTypeChange()"
                  class="form-radio text-fuchsia-600 focus:ring-fuchsia-500"
                >
                <span class="text-sm text-gray-700 dark:text-gray-300 text-body">Grade</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-700">
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-xs text-caption">Semester</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-xs text-caption">Code</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-3xl text-caption">Subject Name</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-sm text-caption">Credits</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-sm text-caption">Input Type</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-3xl text-caption">Marks/Grade</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">`;
  }

  /**
   * Generate semester separator HTML
   * @param {string} semester - Semester number
   * @param {string} gradeType - Type of grade calculation (sgpa/cgpa)
   * @returns {string} Semester separator HTML
   */
  generateSemesterSeparatorHTML(semester, gradeType) {
    return `
      <tr class="bg-gradient-to-r from-fuchsia-100 to-purple-100 dark:from-fuchsia-900 dark:to-purple-900 border-t-2 border-fuchsia-300 dark:border-fuchsia-600">
        <td colspan="6" class="px-6 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 flex-1">
              <div class="h-0.5 flex-1 bg-fuchsia-300 dark:bg-fuchsia-600"></div>
              <span class="text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300 uppercase tracking-wider text-caption">
                Semester ${semester}
              </span>
              <div class="h-0.5 flex-1 bg-fuchsia-300 dark:bg-fuchsia-600"></div>
            </div>
            ${
              gradeType === 'cgpa'
                ? `
            <div class="flex items-center space-x-3 ml-4">
              <span class="text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-300 text-caption">Default:</span>
              <div class="flex items-center space-x-2">
                <label class="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="semesterDefaultInputType_${semester}"
                    value="marks"
                    checked
                    onchange="window.UIManager.handleSemesterDefaultInputTypeChange(${semester})"
                    class="form-radio text-fuchsia-600 focus:ring-fuchsia-500 text-xs"
                  >
                  <span class="text-xs text-fuchsia-700 dark:text-fuchsia-300 text-caption">Marks</span>
                </label>
                <label class="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="semesterDefaultInputType_${semester}"
                    value="grade"
                    onchange="window.UIManager.handleSemesterDefaultInputTypeChange(${semester})"
                    class="form-radio text-fuchsia-600 focus:ring-fuchsia-500 text-xs"
                  >
                  <span class="text-xs text-fuchsia-700 dark:text-fuchsia-300 text-caption">Grade</span>
                </label>
              </div>
            </div>
            `
                : ''
            }
          </div>
        </td>
      </tr>`;
  }

  /**
   * Generate subject row HTML
   * @param {object} subject - Subject object
   * @param {number} globalIndex - Global index of the subject
   * @param {string} rowClass - CSS class for the row
   * @returns {string} Subject row HTML
   */
  generateSubjectRowHTML(subject, globalIndex, rowClass) {
    return `
    <tr class="${rowClass}">
      <td class="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-numeric">${subject.semester}</td>
      <td class="px-6 py-4 text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 text-caption">${subject.subject_code}</td>
      <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium text-body">${subject.subject_name}</td>
      <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-semibold text-numeric">${subject.credits}</td>
      <td class="px-6 py-4">
        <div class="flex flex-col space-y-2">
          <label class="flex items-center space-x-1">
            <input
              type="radio"
              name="inputType_${globalIndex}"
              value="marks"
              checked
              onchange="window.UIManager.handleInputTypeChange(${globalIndex})"
              class="form-radio text-fuchsia-600 focus:ring-fuchsia-500 text-xs"
            >
            <span class="text-xs text-gray-700 dark:text-gray-300 text-caption">Marks</span>
          </label>
          <label class="flex items-center space-x-1">
            <input
              type="radio"
              name="inputType_${globalIndex}"
              value="grade"
              onchange="window.UIManager.handleInputTypeChange(${globalIndex})"
              class="form-radio text-fuchsia-600 focus:ring-fuchsia-500 text-xs"
            >
            <span class="text-xs text-gray-700 dark:text-gray-300 text-caption">Grade</span>
          </label>
        </div>
      </td>
      <td class="px-6 py-4">
        <input
          type="number"
          id="marks_${globalIndex}"
          name="marks"
          min="0"
          max="${subject.max_marks || 100}"
          required
          class="block w-full px-3 py-2.5 rounded-lg border dark:border-gray-700 focus:border-fuchsia-500 focus:ring-fuchsia-500 text-sm bg-fuchsia-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none min-w-[180px] form-text"
          placeholder="Enter marks (max: ${subject.max_marks || 100})"
        >
        <select
          id="grade_${globalIndex}"
          name="grade"
          required
          style="display: none;"
          class="block w-full px-3 py-2.5 rounded-lg border dark:border-gray-700 focus:border-fuchsia-500 focus:ring-fuchsia-500 text-sm bg-fuchsia-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none min-w-[180px] form-text"
        >
          <option value="">Select Grade</option>
          <option value="O">O • Outstanding (10)</option>
          <option value="A+">A+ • Excellent (9)</option>
          <option value="A">A • Very Good (8)</option>
          <option value="B+">B+ • Good (7)</option>
          <option value="B">B • Above Average (6)</option>
          <option value="C">C • Average (5)</option>
          <option value="P">P • Pass (4)</option>
          <option value="F">F • Fail (0)</option>
        </select>
      </td>
      <input type="hidden" name="credits" value="${subject.credits}">
    </tr>`;
  }

  /**
   * Generate table footer HTML
   * @returns {string} Table footer HTML
   */
  generateTableFooterHTML() {
    return `
        </tbody>
      </table>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-end items-center">
          <button
            type="button"
            id="calculateBtn"
            class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 shadow-lg hover:shadow-xl transition-all duration-200 text-body"
          >
            Calculate GPA
          </button>
        </div>
      </div>
    </form>`;
  }

  /**
   * Scroll to element function
   * @param {string} elementId - ID of the element to scroll to
   */
  scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
