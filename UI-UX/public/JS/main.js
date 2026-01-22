import { setupLoadingOverlay } from './loading.js';
import { populateSidebar, loadTutorialFromHash } from './sidebar.js';
import { setupDarkMode } from './darkMode.js';
import { setupSidebar } from './sidebarToggle.js';
import { setupStructureView } from './structureView.js';
import { setupSearch, setupSearchShortcut } from './search.js';
import { configureCodeHighlighting } from './prismHighlighter.js';
import { initThemeManager } from './themeManager.js';
import { setupImageViewer } from './imageHandler.js';
import { setupMenuAnimation } from './menuManager.js';
import { enterFullscreen } from './fullScreen.js';
import { feedbackHandler } from './feedbackHandler.js';
import {
  setupTooltips,
  setupContentObserver,
  setupTooltipObserver
} from './tooltipHandler.js';
import { setupSounds } from './soundHandler.js';
import { showUpdateNotification } from './notificationHandler.js';
import { initializeAuth } from './auth.js';
import { setupProgressBar } from './progressBar.js';
import './lastEditTracker.js';

// Initialize critical modules before DOM content loads
setupLoadingOverlay();
initThemeManager();
setupDarkMode();
setupSounds();

document.addEventListener('DOMContentLoaded', () => {
  // Configure marked renderer with code highlighting
  const renderer = new marked.Renderer();
  configureCodeHighlighting(renderer);
  const originalLinkRenderer = renderer.link;
  renderer.link = function (href, title, text) {
    const link = originalLinkRenderer.call(this, href, title, text);
    if (!href.href.startsWith('http://') && !href.href.startsWith('https://')) {
      return link
        .replace('<a', '<a target="_self" rel="noopener noreferrer"')
        .replace('href="', 'href="#');
    }
    return link.replace('<a', '<a target="_blank" rel="noopener noreferrer"');
  };

  marked.setOptions({ renderer: renderer });

  // Initialize UI components
  setupSidebar();
  setupStructureView();
  setupMenuAnimation();
  enterFullscreen();

  // Initialize content and functionality
  populateSidebar();
  loadTutorialFromHash();
  setupSearch();
  setupSearchShortcut();

  // Initialize content-dependent modules (after content is loaded)
  setTimeout(() => {
    setupImageViewer();
    setupTooltips();
    setupContentObserver();
    setupTooltipObserver();
    feedbackHandler();
    initializeAuth();
    setupProgressBar();
  }, 100);

  // Show notifications after everything is loaded
  setTimeout(() => {
    showUpdateNotification();
  }, 7000);

  // Listen for hash changes
  window.addEventListener('hashchange', loadTutorialFromHash);
});
