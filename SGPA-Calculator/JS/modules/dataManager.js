/**
 * Data Manager Module
 * Handles fetching and processing subject data from JSON files
 */

import { PopupManager } from './popupManager.js';

export class DataManager {
  /**
   * Derive branch scope from a data URL
   * @param {string} url - JSON URL
   * @returns {string}
   */
  static getBranchScopeFromUrl(url) {
    if (url.includes('/one.json') || url.includes('/two.json')) {
      return 'common';
    }

    const match = url.match(/\/([a-z0-9]+)\.json$/i);
    return match ? match[1].toLowerCase() : 'unknown';
  }

  /**
   * Attach branch scope metadata to subjects
   * @param {any[]} subjects - Raw subjects
   * @param {string} url - Source JSON URL
   * @returns {any[]}
   */
  static attachBranchScope(subjects, url) {
    const branchScope = this.getBranchScopeFromUrl(url);
    return subjects.map((subject) => ({
      ...subject,
      branch_scope: subject.branch_scope || branchScope
    }));
  }

  /**
   * Fetch subjects from JSON file
   * @param {string} url - The URL of the JSON file
   * @param {string|null} semester - Optional semester filter
   * @returns {Promise<any[]>} Array of subjects
   */
  static fetchSubjects(url, semester = null) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 1) {
          const subjects = semester
            ? data.filter((subject) => subject.semester == semester)
            : data;
          if (subjects.length > 0) {
            return this.attachBranchScope(subjects, url);
          } else {
            throw new Error('No subjects found for the selected criteria.');
          }
        } else {
          throw new Error('No data found for the selected criteria.');
        }
      })
      .catch((error) => {
        console.error(error);
        const errorMessage =
          error.message || 'An error occurred while fetching data.';

        // Check if it's a data availability issue vs a validation error
        if (
          errorMessage.includes('No subjects found') ||
          errorMessage.includes('No data found')
        ) {
          PopupManager.showDataNotFoundPopup(
            "Data for this criteria doesn't exist."
          );
        } else {
          PopupManager.showWarningPopup([errorMessage], false);
        }
        throw error;
      });
  }

  /**
   * Handle CGPA data fetching - combines all semester subjects including branch-specific data
   * @param {string} branch - The branch code for fetching branch-specific subjects
   * @returns {Promise<any[]>} Array of subjects for CGPA calculation (all semesters)
   */
  static fetchCGPAData(branch) {
    // For CGPA, we fetch both common subjects and branch-specific data
    const commonUrls = ['data/one.json', 'data/two.json'];
    let branchUrl = null;
    let shouldCheckBranchData = false;

    // Add branch-specific data if branch is provided and valid
    if (branch && branch.trim() !== '') {
      branchUrl = `data/${branch.toLowerCase()}.json`;
      shouldCheckBranchData = true;
    }

    // Prepare all URLs to fetch
    const urls = [...commonUrls];
    if (branchUrl) {
      urls.push(branchUrl);
    }

    return Promise.all(
      urls.map((url, index) =>
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch ${url}`);
            }
            return response.json();
          })
          .then((data) => {
            // Check if JSON is empty or invalid
            if (!Array.isArray(data) || data.length === 0) {
              console.warn(`${url} is empty or invalid, ignoring...`);
              return { data: [], isEmpty: true, url };
            }
            // Check if data has valid subjects (not just empty objects)
            const validSubjects = data.filter(
              (subject) =>
                subject &&
                Object.keys(subject).length > 0 &&
                subject.subject_code &&
                subject.subject_name
            );
            if (validSubjects.length === 0) {
              console.warn(`${url} contains no valid subjects, ignoring...`);
              return { data: [], isEmpty: true, url };
            }
            return { data: validSubjects, isEmpty: false, url };
          })
          .catch((error) => {
            console.warn(`Failed to fetch ${url}, ignoring...`, error);
            return { data: [], isEmpty: true, url, error: true };
          })
      )
    )
      .then((results) => {
        // Branch-specific data is required for CGPA beyond the common semesters.
        if (shouldCheckBranchData && branchUrl) {
          const branchResult = results.find(
            (result) => result.url === branchUrl
          );
          if (branchResult && (branchResult.isEmpty || branchResult.error)) {
            throw new Error('CGPA_BRANCH_DATA_NOT_FOUND');
          }
        }

        // Filter out empty arrays and combine valid data
        const validDataArrays = results
          .filter((result) => result.data.length > 0)
          .map((result) => this.attachBranchScope(result.data, result.url));

        if (validDataArrays.length === 0) {
          throw new Error('No valid data found for CGPA calculation.');
        }

        // Combine all subjects from valid semester data
        const allSubjects = validDataArrays.flat();

        // Remove duplicates if any (based on subject_code)
        const uniqueSubjects = allSubjects.filter(
          (subject, index, self) =>
            index ===
            self.findIndex((s) => s.subject_code === subject.subject_code)
        );

        return uniqueSubjects;
      })
      .catch((error) => {
        console.error('Error:', error);
        const errorMessage =
          error.message || 'An error occurred while fetching CGPA data.';

        // Check if it's a data availability issue vs a validation error
        if (
          errorMessage.includes('CGPA_BRANCH_DATA_NOT_FOUND') ||
          errorMessage.includes('No valid data found') ||
          errorMessage.includes('No data found')
        ) {
          PopupManager.showDataNotFoundPopup(
            "Data for this criteria doesn't exist."
          );
        } else {
          PopupManager.showWarningPopup([errorMessage], false);
        }
        throw error;
      });
  }
}
