/**
 * GPA Calculator Module
 * Handles GPA calculation logic and result display
 */

import {
  getGradePoint,
  getMarksFromGrade,
  letterGradeMapping
} from './gradeUtils.js';
import { PopupManager } from './popupManager.js';

export class GPACalculator {
  /**
   * Calculate GPA from the form data
   */
  calculateGPA() {
    const subjects = document.querySelectorAll('tbody tr');
    let totalCredits = 0;
    let totalGradePoints = 0;
    let totalMarks = 0;
    let warnings = [];
    let subjectIndex = 0; // Separate index for actual subject rows

    subjects.forEach((row) => {
      const creditInput = row.querySelector('input[name="credits"]');

      // Skip rows that don't have credit inputs (semester separator rows)
      if (!creditInput) {
        return;
      }

      const credit = Number.parseFloat(creditInput.value);
      const subjectCode =
        row.querySelector('td:nth-child(2)')?.textContent ||
        `Subject ${subjectIndex + 1}`;

      const inputTypeRadio = document.querySelector(
        `input[name="inputType_${subjectIndex}"]:checked`
      );
      const marksInput = document.getElementById(`marks_${subjectIndex}`);
      const gradeSelect = document.getElementById(`grade_${subjectIndex}`);

      let gradePoint = 0;
      let markValue = 0;

      if (inputTypeRadio && inputTypeRadio.value === 'marks') {
        if (!marksInput.value) {
          if (credit !== 0) {
            warnings.push(`${subjectCode}: Marks field is empty`);
          }
        } else {
          markValue = Number.parseFloat(marksInput.value);
          if (markValue < 0 || markValue > 100) {
            warnings.push(
              `${subjectCode}: Marks should be between 0 and 100 (current: ${markValue})`
            );
            // Use 0 as fallback for invalid marks
            markValue = Math.max(0, Math.min(100, markValue));
          }
          gradePoint = getGradePoint(markValue);
        }
      } else if (inputTypeRadio) {
        if (!gradeSelect.value) {
          if (credit !== 0) {
            warnings.push(`${subjectCode}: Grade not selected`);
          }
        } else {
          gradePoint = letterGradeMapping[gradeSelect.value];
          markValue = getMarksFromGrade(gradePoint);
        }
      } else {
        warnings.push(`${subjectCode}: Input type not selected`);
      }

      if (credit !== 0) {
        totalCredits += credit;
        totalGradePoints += gradePoint * credit;
      }
      totalMarks += markValue;

      subjectIndex++; // Increment only for actual subject rows
    });

    // Show warnings if any and stop calculation
    if (warnings.length > 0) {
      PopupManager.showWarningPopup(warnings, false); // false = don't continue with calculation
      return;
    }

    this.displayResult(totalCredits, totalGradePoints, totalMarks);
    this.scrollToElement('result');
  }

  /**
   * Display the calculated result
   * @param {number} totalCredits - Total credits
   * @param {number} totalGradePoints - Total grade points
   * @param {number} totalMarks - Total marks
   */
  displayResult(totalCredits, totalGradePoints, totalMarks) {
    const resultDiv = document.getElementById('result');
    if (!resultDiv) return;

    resultDiv.classList.remove('hidden');

    if (totalCredits > 0) {
      const gpa = totalGradePoints / totalCredits;
      const gradeType = document.querySelector(
        'input[name="gradeType"]:checked'
      )?.value;

      let resultHTML = `
        <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 text-display">
          Your ${gradeType.toUpperCase()} is: <span class="text-numeric text-fuchsia-600 dark:text-fuchsia-400">${gpa.toFixed(
        2
      )}</span>
        </h2>`;

      // Only show total marks for SGPA, not for CGPA
      if (gradeType === 'sgpa') {
        resultHTML += `
          <h3 class="text-xl text-gray-700 dark:text-gray-300 text-heading">
            Total Marks: <span class="text-numeric font-semibold">${totalMarks}</span>
          </h3>`;
      }

      resultDiv.innerHTML = resultHTML;
    } else {
      resultDiv.innerHTML = `
        <h2 class="text-xl text-red-600 dark:text-red-400 font-semibold text-heading">
          Invalid input for calculation.
        </h2>`;
    }
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
