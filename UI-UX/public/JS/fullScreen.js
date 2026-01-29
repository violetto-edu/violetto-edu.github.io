export function enterFullscreen() {
  const fullscreenToggle = document.getElementById('fullscreen-toggle');
  const closeModal = document.querySelector('#close-modal');

  // Early return if fullscreen is not supported or element not found
  if (
    !fullscreenToggle ||
    !(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    )
  ) {
    return;
  }

  // Enhanced mobile device detection
  const isMobileDevice =
    // Check for touch capability
    window.matchMedia('(pointer: coarse)').matches ||
    // Check for small screen size
    window.matchMedia('(max-width: 640px)').matches ||
    // Check for touch events support
    'ontouchstart' in window ||
    // Check user agent for mobile indicators
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Handle mobile devices - hide fullscreen button and return early
  if (isMobileDevice) {
    fullscreenToggle.style.display = 'none';
    if (closeModal) {
      closeModal.style.top = '20px';
    }
    return;
  }

  // Make button visible for desktop/PC browsers only
  fullscreenToggle.style.display = 'flex';

  // Use standardized API with vendor prefixes as fallback
  const doc = document;
  const docEl = document.documentElement;

  // Create normalized fullscreen methods
  const requestFullscreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullscreen ||
    docEl.msRequestFullscreen;

  const exitFullscreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  // Single event handler for toggle button
  fullscreenToggle.addEventListener('click', () => {
    const isFullscreen =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    if (isFullscreen) {
      exitFullscreen.call(doc);
    } else {
      requestFullscreen.call(docEl);
    }
  });

  // Use function reference for consistent event handling
  function handleFullscreenChange() {
    const upIcon = fullscreenToggle.querySelector('.bi-fullscreen');
    const downIcon = fullscreenToggle.querySelector('.bi-fullscreen-exit');

    const isFullscreen =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    upIcon.style.display = isFullscreen ? 'none' : 'block';
    downIcon.style.display = isFullscreen ? 'block' : 'none';
  }

  // Add event listeners using a single function reference
  [
    'fullscreenchange',
    'webkitfullscreenchange',
    'mozfullscreenchange',
    'MSFullscreenChange'
  ].forEach((event) => {
    doc.addEventListener(event, handleFullscreenChange);
  });
}
