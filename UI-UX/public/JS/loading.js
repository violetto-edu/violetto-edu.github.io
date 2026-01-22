export function setupLoadingOverlay() {
  const loadingOverlay = document.getElementById('loading-overlay');

  // Function to hide loading overlay with view transition
  async function hideLoadingOverlay() {
    // Check if View Transitions API is supported
    if (!document.startViewTransition || !loadingOverlay) {
      // Fallback for browsers that don't support View Transitions API
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 1500);
      return;
    }

    // Use circular reveal animation directly on the loading overlay
    try {
      // Get viewport center
      const viewportHeight = document.documentElement.clientHeight;
      const viewportWidth = document.documentElement.clientWidth;
      const centerX = viewportWidth / 2;
      const centerY = 0;

      // Calculate maximum radius to cover the entire viewport
      const maxRadius = viewportHeight * 1.5;

      // Apply circular clip-path animation directly to the loading overlay
      // Using inset to create a "hole" that expands from center
      const animation = loadingOverlay.animate(
        {
          clipPath: [
            `circle(${maxRadius}px at ${centerX}px ${centerY}px)`,
            `circle(0px at ${centerX}px ${centerY}px)`
          ]
        },
        {
          duration: 1200,
          easing: 'cubic-bezier(1, 0.04, 0.64, 0.6)',
          fill: 'forwards'
        }
      );

      // Wait for animation to complete, then hide the element
      await animation.finished;
      loadingOverlay.style.display = 'none';
    } catch (error) {
      // If view transition fails, fall back to opacity animation
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 1500);
    }
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      hideLoadingOverlay();
    }, 4500);
  });
}
