/**
 * Popup Manager Module
 * Handles warning, error, and data not found popups
 */

export class PopupManager {
  /**
   * Show warning popup
   * @param {string[]} warnings - Array of warning messages
   * @param {boolean} allowContinue - Whether to allow continuing with calculation
   */
  static showWarningPopup(warnings, allowContinue = true) {
    const isError = !allowContinue;
    const warningHtml = `
      <div id="warningPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[40rem] overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 bg-white dark:bg-gray-800 rounded-t-lg">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold ${
                isError
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-yellow-600 dark:text-yellow-400'
              } flex items-center text-heading">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mr-3">
                  ${
                    isError
                      ? '<path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />'
                      : '<path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />'
                  }
                </svg>
                ${isError ? 'Validation Errors' : 'Validation Warnings'}
              </h3>
              <button id="closeWarning" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="px-6 py-4">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 text-body">
              ${
                isError
                  ? 'Please fix the following issues before calculation can proceed:'
                  : 'The following issues were found. Calculation will proceed with adjustments:'
              }
            </p>
            <ul class="space-y-3">
              ${warnings
                .map(
                  (warning) => `
                <li class="flex items-start space-x-3">
                  <span class="${
                    isError ? 'text-red-500' : 'text-yellow-500'
                  } font-bold text-lg leading-none">•</span>
                  <span class="text-sm text-gray-700 dark:text-gray-300 text-body">${warning}</span>
                </li>
              `
                )
                .join('')}
            </ul>
          </div>
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
            <button id="acknowledgeWarning" class="w-full px-4 py-3 ${
              isError
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-yellow-600 hover:bg-yellow-700'
            } text-white rounded-xl text-sm font-semibold text-body transition-all duration-200 hover:shadow-lg">
              ${isError ? "OK, I'll Fix These" : 'I Understand, Continue'}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', warningHtml);

    // Add event listeners
    document.getElementById('closeWarning').onclick = this.closeWarningPopup;
    document.getElementById('acknowledgeWarning').onclick =
      this.closeWarningPopup;

    // Close on background click
    document.getElementById('warningPopup').onclick = (e) => {
      if (e.target.id === 'warningPopup') {
        this.closeWarningPopup();
      }
    };
  }

  /**
   * Close warning popup
   */
  static closeWarningPopup() {
    const popup = document.getElementById('warningPopup');
    if (popup) {
      popup.remove();
    }
  }

  /**
   * Show data not found popup
   * @param {string} message - The message to display
   */
  static showDataNotFoundPopup(message) {
    const popupHtml = `
      <div id="dataNotFoundPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 bg-white dark:bg-gray-800 rounded-t-lg">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 flex items-center text-heading">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                No Data Available
              </h3>
              <button id="closeDataNotFound" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="px-6 py-4">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 text-blue-500">
                  <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-600 dark:text-gray-300 text-body">
                  ${message}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-caption">
                  This combination of semester and branch may not be available in the current database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupHtml);

    // Add event listeners
    document.getElementById('closeDataNotFound').onclick =
      this.closeDataNotFoundPopup;

    // Close on background click
    document.getElementById('dataNotFoundPopup').onclick = (e) => {
      if (e.target.id === 'dataNotFoundPopup') {
        this.closeDataNotFoundPopup();
      }
    };
  }

  /**
   * Close data not found popup
   */
  static closeDataNotFoundPopup() {
    const popup = document.getElementById('dataNotFoundPopup');
    if (popup) {
      popup.remove();
    }
  }
}
