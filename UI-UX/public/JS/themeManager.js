const THEMES = {
  light: 'prism-material-light',
  dark: 'prism-material-dark'
};

export function initThemeManager() {
  let themeLink = document.getElementById('prism-theme');
  if (!themeLink) {
    themeLink = document.createElement('link');
    themeLink.id = 'prism-theme';
    themeLink.rel = 'stylesheet';
    document.head.appendChild(themeLink);
  }

  updateTheme();

  // Watch for dark mode class changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        updateTheme();
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  if (window.matchMedia) {
    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );
    darkModeMediaQuery.addEventListener('change', updateTheme);
  }
}

// Update theme based on system preference or class
function updateTheme() {
  try {
    const hasClassDarkMode = document.body.classList.contains('dark-mode');
    const systemDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode =
      hasClassDarkMode !== null ? hasClassDarkMode : systemDarkMode;
    const theme = isDarkMode ? THEMES.dark : THEMES.light;

    const themeLink = document.getElementById('prism-theme');
    if (themeLink) {
      themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/${theme}.min.css`;

      themeLink.onerror = () => {
        // Fallback to default theme
        themeLink.href =
          'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';
      };

      themeLink.onload = () => {};
    } else {
      console.warn('Theme link element not found');
    }
  } catch (error) {
    console.error('Error updating theme:', error);
  }
}
