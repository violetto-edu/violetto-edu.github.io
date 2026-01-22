/**
 * Theme Manager Module
 * Handles dark mode initialization and toggle functionality
 */

export class ThemeManager {
  constructor() {
    this.initialize();
    this.setupToggle();
  }

  /**
   * Initialize dark mode based on stored preference or system preference
   */
  initialize() {
    if (
      localStorage.getItem('darkMode') === 'enabled' ||
      (localStorage.getItem('darkMode') !== 'disabled' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    }
  }

  /**
   * Setup dark mode toggle button
   */
  setupToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
      });
    }
  }
}
