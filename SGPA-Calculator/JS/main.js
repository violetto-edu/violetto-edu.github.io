/**
 * Main Application Module
 * Coordinates all modules and initializes the application
 */

import { ThemeManager } from './modules/themeManager.js';
import { UIManager } from './modules/uiManager.js';
import { NavigationManager } from './modules/navigationManager.js';

/**
 * Application Class
 * Main application controller that initializes all modules
 */
class Application {
  constructor() {
    this.themeManager = null;
    this.uiManager = null;
    this.navigationManager = null;
  }

  /**
   * Initialize the application
   */
  initialize() {
    try {
      // Initialize theme management
      this.themeManager = new ThemeManager();

      // Initialize UI management
      this.uiManager = new UIManager();

      // Initialize navigation management
      this.navigationManager = new NavigationManager();

      // Setup privacy policy functionality
      this.setupPrivacyPolicy();

      // Make UIManager methods globally accessible for HTML onclick handlers
      window.UIManager = UIManager;
    } catch (error) {
      console.error('Failed to initialize application:', error);
    }
  }

  /**
   * Handle PDF data if available from landing page
   */
  handlePDFData() {
    try {
      // Check URL parameters for PDF source
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('source');

      if (source === 'pdf') {
        // Retrieve PDF data from sessionStorage
        const pdfDataString = sessionStorage.getItem('pdfParsedData');

        if (pdfDataString) {
          const pdfData = JSON.parse(pdfDataString);

          // Show PDF data notification
          import('./modules/notificationManager.js').then(
            ({ NotificationManager }) => {
              NotificationManager.showSuccess(
                `Loaded ${pdfData.subjects.length} subjects from PDF`
              );
            }
          );

          // Auto-populate the form with PDF data
          this.populateFromPDFData(pdfData);

          // Clear the session storage to prevent reuse
          sessionStorage.removeItem('pdfParsedData');
        }
      }
    } catch (error) {
      console.error('Error handling PDF data:', error);
      import('./modules/notificationManager.js').then(
        ({ NotificationManager }) => {
          NotificationManager.showError(
            'Failed to load PDF data. Please try manual entry.'
          );
        }
      );
    }
  }

  /**
   * Populate calculator with PDF data
   * @param {Object} pdfData - Parsed PDF data
   */
  populateFromPDFData(pdfData) {
    try {
      const { subjects, studentInfo } = pdfData;

      // Determine if this is SGPA or CGPA based on semesters
      const semesters = [...new Set(subjects.map((s) => s.semester))];
      const isMultipleSemesters = semesters.length > 1;

      // Set grade type
      const gradeTypeRadio = document.querySelector(
        `input[name="gradeType"][value="${
          isMultipleSemesters ? 'cgpa' : 'sgpa'
        }"]`
      );
      if (gradeTypeRadio) {
        gradeTypeRadio.checked = true;
      }

      // Hide form controls since we have data
      const formControls = document.querySelector(
        '.bg-white.dark\\:bg-gray-800.rounded-lg.shadow-lg'
      );
      if (formControls) {
        formControls.style.display = 'none';
      }

      // Show a banner with PDF info
      this.showPDFBanner(pdfData);

      // Display subjects directly
      if (this.uiManager) {
        this.uiManager.displaySubjects(subjects);
        this.uiManager.scrollToElement('subjectTableContainer');
      }

      // Auto-select input types based on available data
      setTimeout(() => {
        this.autoSelectInputTypes(subjects);
      }, 500);
    } catch (error) {
      console.error('Error populating PDF data:', error);
    }
  }

  /**
   * Show PDF information banner
   * @param {Object} pdfData - Parsed PDF data
   */
  showPDFBanner(pdfData) {
    const { subjects, format, studentInfo, confidence } = pdfData;

    const banner = document.createElement('div');
    banner.className =
      'bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 border border-green-300 dark:border-green-600 rounded-lg p-4 mb-6';
    banner.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-green-800 dark:text-green-200">PDF Successfully Processed</h3>
          <div class="mt-2 text-sm text-green-700 dark:text-green-300">
            <p><strong>Subjects Found:</strong> ${subjects.length}</p>
            <p><strong>Format Detected:</strong> ${format}</p>
            <p><strong>Confidence:</strong> ${Math.round(confidence * 100)}%</p>
            ${
              studentInfo.name
                ? `<p><strong>Student:</strong> ${studentInfo.name}</p>`
                : ''
            }
            ${
              studentInfo.usn
                ? `<p><strong>USN:</strong> ${studentInfo.usn}</p>`
                : ''
            }
            ${
              studentInfo.branch
                ? `<p><strong>Branch:</strong> ${studentInfo.branch}</p>`
                : ''
            }
          </div>
          <p class="mt-3 text-xs text-green-600 dark:text-green-400">
            Review the extracted data below and make any necessary corrections before calculating your GPA.
          </p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    // Insert banner before the main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.insertBefore(banner, mainContent.firstChild);
    }
  }

  /**
   * Auto-select input types based on available data in subjects
   * @param {Array} subjects - Array of subjects
   */
  autoSelectInputTypes(subjects) {
    const subjectRows = document.querySelectorAll('tbody tr');
    let subjectIndex = 0;

    subjectRows.forEach((row) => {
      const creditInput = row.querySelector('input[name="credits"]');

      // Skip rows that don't have credit inputs (semester separator rows)
      if (!creditInput) {
        return;
      }

      const subject = subjects[subjectIndex];
      if (subject) {
        const marksRadio = document.querySelector(
          `input[name="inputType_${subjectIndex}"][value="marks"]`
        );
        const gradeRadio = document.querySelector(
          `input[name="inputType_${subjectIndex}"][value="grade"]`
        );
        const marksInput = document.getElementById(`marks_${subjectIndex}`);
        const gradeSelect = document.getElementById(`grade_${subjectIndex}`);

        // Prefer marks if available, otherwise use grades
        if (subject.marks !== null && subject.marks !== undefined) {
          if (marksRadio) marksRadio.checked = true;
          if (marksInput) marksInput.value = subject.marks;
          window.UIManager.handleInputTypeChange(subjectIndex);
        } else if (subject.grade) {
          if (gradeRadio) gradeRadio.checked = true;
          if (gradeSelect) gradeSelect.value = subject.grade;
          window.UIManager.handleInputTypeChange(subjectIndex);
        }
      }

      subjectIndex++;
    });
  }

  /**
   * Setup privacy policy modal functionality
   */
  setupPrivacyPolicy() {
    const privacyBtn = document.getElementById('privacyPolicyBtn');
    const privacyModal = document.getElementById('privacyModal');
    const closeBtn = document.getElementById('closePrivacyModal');

    if (privacyBtn && privacyModal && closeBtn) {
      // Open modal
      privacyBtn.addEventListener('click', () => {
        privacyModal.classList.remove('hidden');
        privacyModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      });

      // Close modal
      const closeModal = () => {
        privacyModal.classList.add('hidden');
        privacyModal.classList.remove('flex');
        document.body.style.overflow = '';
      };

      closeBtn.addEventListener('click', closeModal);

      // Close modal when clicking outside
      privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
          closeModal();
        }
      });

      // Close modal with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !privacyModal.classList.contains('hidden')) {
          closeModal();
        }
      });
    }
  }
}

/**
 * Initialize the application when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  const app = new Application();
  app.initialize();

  // Check if we have PDF data from the landing page
  app.handlePDFData();
});
