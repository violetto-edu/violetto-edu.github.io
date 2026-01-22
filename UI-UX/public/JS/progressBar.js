/**
 * Progress Bar Module
 * Tracks scroll progress of tutorial content and displays a progress bar
 */

export function setupProgressBar() {
  const content = document.getElementById('content');
  const tutorialContent = document.getElementById('tutorial-content');

  if (!content || !tutorialContent) {
    console.warn('Progress bar: Required elements not found');
    return;
  }

  // Create progress bar container
  const progressContainer = document.createElement('div');
  progressContainer.id = 'progress-container';
  progressContainer.className = 'progress-container';

  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.id = 'progress-bar';
  progressBar.className = 'progress-bar';

    // Assemble progress bar
  progressContainer.appendChild(progressBar);

  // Insert at the top of content
  content.insertBefore(progressContainer, content.firstChild);

  let isVisible = false;
  let lastScrollTop = 0;

  // Calculate scroll progress
  function calculateProgress() {
    const scrollTop = content.scrollTop;
    const scrollHeight = content.scrollHeight;
    const clientHeight = content.clientHeight;

    if (scrollHeight <= clientHeight) {
      return 0;
    }

    const maxScroll = scrollHeight - clientHeight;
    const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    return progress;
  }

    // Update progress bar
  function updateProgress() {
    const progress = calculateProgress();
    const percentage = Math.round(progress * 100);

    progressBar.style.width = `${percentage}%`;

    // Show/hide based on scroll position
    const shouldShow = progress > 0;

    if (shouldShow && !isVisible) {
      progressContainer.classList.add('show');
      isVisible = true;
    } else if (!shouldShow && isVisible) {
      progressContainer.classList.remove('show');
      isVisible = false;
    }
  }

  // Throttle scroll events for performance
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Event listeners
  content.addEventListener('scroll', requestTick, { passive: true });

  // Update on resize
  window.addEventListener('resize', () => {
    setTimeout(updateProgress, 100);
  }, { passive: true });

  // Initial update
  setTimeout(updateProgress, 100);

  // Update when content changes
  const observer = new MutationObserver(() => {
    setTimeout(updateProgress, 100);
  });

  observer.observe(tutorialContent, {
    childList: true,
    subtree: true,
    characterData: true
  });

  return {
    updateProgress,
    destroy: () => {
      content.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', updateProgress);
      observer.disconnect();
      if (progressContainer.parentNode) {
        progressContainer.parentNode.removeChild(progressContainer);
      }
    }
  };
}
