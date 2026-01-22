export function setupDarkMode() {
  const darkModeToggle = document.getElementById('theme-toggle');
  const systemPrefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  // Function to apply dark mode with view transition
  async function applyDarkMode(isDark) {
    // Check if View Transitions API is supported
    if (!document.startViewTransition || !darkModeToggle) {
      // Fallback for browsers that don't support View Transitions API
      document.body.classList.toggle('dark-mode', isDark);
      darkModeToggle.classList.toggle('dark-mode', isDark);
      return;
    }

    // Use View Transitions API
    const transition = document.startViewTransition(() => {
      document.body.classList.toggle('dark-mode', isDark);
      darkModeToggle.classList.toggle('dark-mode', isDark);
    });

    // Wait for the transition to be ready, then add the circular animation
    try {
      await transition.ready;

      const { top, left, width, height } =
        darkModeToggle.getBoundingClientRect();
      // Use documentElement dimensions to exclude browser UI elements (address bar, etc.) on mobile
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      const right = viewportWidth - left;
      const bottom = viewportHeight - top;
      const maxRadius =
        Math.hypot(Math.max(left, right), Math.max(top, bottom)) + 19; // +19 for the icon size
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${left + width / 2}px ${top + height / 2}px)`,
            `circle(${maxRadius}px at ${left + width / 2}px ${
              top + height / 2
            }px)`
          ]
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    } catch (error) {
      // If view transition fails, just apply the changes normally
    }
  }

  // Check for saved preference or system preference
  const savedDarkMode = localStorage.getItem('darkMode');
  const initialDarkMode =
    savedDarkMode === 'enabled'
      ? true
      : savedDarkMode === 'disabled'
      ? false
      : systemPrefersDarkMode.matches;

  // Apply initial dark mode without transition
  document.body.classList.toggle('dark-mode', initialDarkMode);
  if (darkModeToggle) {
    darkModeToggle.classList.toggle('dark-mode', initialDarkMode);
  }

  // Dark mode toggle event
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', async () => {
      const isDark = !document.body.classList.contains('dark-mode');
      await applyDarkMode(isDark);

      // Save preference
      if (isDark) {
        localStorage.setItem('darkMode', 'enabled');
      } else {
        localStorage.setItem('darkMode', 'disabled');
      }
    });
  }

  // Listen for system dark mode changes
  systemPrefersDarkMode.addEventListener('change', (e) => {
    // Only change if no explicit user preference is set
    if (savedDarkMode === null) {
      applyDarkMode(e.matches);
    }
  });
}
