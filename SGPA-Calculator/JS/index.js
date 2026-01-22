/**
 * Landing Page Module
 * Handles upload functionality and coordination of existing modules for the SGPA Calculator landing page
 */

import { ThemeManager } from './modules/themeManager.js';
import { NavigationManager } from './modules/navigationManager.js';
import { NotificationManager } from './modules/notificationManager.js';
import { PDFReader } from './modules/pdfReader.js';

class LandingPageManager {
  constructor() {
    this.uploadArea = null;
    this.fileInput = null;
    this.uploadCard = null;
    this.pdfReader = null;

    this.initialize();
  }

  /**
   * Initialize the landing page functionality
   */
  initialize() {
    // Initialize existing modules
    new ThemeManager();
    new NavigationManager();

    // Initialize PDF reader
    this.pdfReader = new PDFReader();

    // Setup landing page specific functionality
    this.setupUploadArea();
    this.setupPrivacyPolicy();
  }

  /**
   * Setup upload area functionality
   */
  setupUploadArea() {
    this.uploadArea = document.getElementById('uploadArea');
    this.fileInput = document.getElementById('fileInput');
    this.uploadCard = document.getElementById('uploadCard');

    if (this.uploadArea && this.fileInput) {
      // Click to upload
      this.uploadArea.addEventListener('click', () => {
        this.fileInput.click();
      });

      // File input change
      this.fileInput.addEventListener('change', (e) => {
        this.handleFileSelect(e.target.files[0]);
      });

      // Drag and drop functionality
      this.setupDragAndDrop();
    }
  }

  /**
   * Setup drag and drop functionality
   */
  setupDragAndDrop() {
    if (!this.uploadArea) return;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      this.uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach((eventName) => {
      this.uploadArea.addEventListener(eventName, () => {
        this.uploadCard.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      this.uploadArea.addEventListener(eventName, () => {
        this.uploadCard.classList.remove('drag-over');
      });
    });

    // Handle dropped files
    this.uploadArea.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileSelect(files[0]);
      }
    });
  }

  /**
   * Handle file selection
   * @param {File} file - The selected file
   */
  async handleFileSelect(file) {
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      NotificationManager.showError('Please select a PDF file only.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      NotificationManager.showError('File size should be less than 10MB.');
      return;
    }

    try {
      // Process the PDF file
      const parsedData = await this.pdfReader.readPDF(file);

      if (parsedData && parsedData.subjects.length > 0) {
        // Store parsed data for calculator page
        this.redirectToCalculatorWithData(parsedData);
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      NotificationManager.showError(
        'Failed to process PDF. Please try again or use manual entry.'
      );
    }
  }

  /**
   * Redirect to calculator with parsed PDF data
   * @param {Object} parsedData - Parsed subject data
   */
  redirectToCalculatorWithData(parsedData) {
    try {
      // Store the parsed data in sessionStorage for the calculator page
      sessionStorage.setItem('pdfParsedData', JSON.stringify(parsedData));

      // Show transition message
      NotificationManager.showInfo(
        'Redirecting to calculator with your PDF data...'
      );

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = 'calculator.html?source=pdf';
      }, 2000);
    } catch (error) {
      console.error('Error storing PDF data:', error);
      NotificationManager.showError(
        'Failed to store PDF data. Please try manual entry.'
      );
    }
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LandingPageManager();
});

// Export for potential use in other modules
export default LandingPageManager;
