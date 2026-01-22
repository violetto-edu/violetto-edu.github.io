const THEMES = {
  light: 'prism-atom-dark',
  dark: 'prism-atom-dark'
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

  if (window.matchMedia) {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', updateTheme);
  }
}

// Update theme based on system preference
function updateTheme() {
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = isDarkMode ? THEMES.dark : THEMES.light;

  const themeLink = document.getElementById('prism-theme');
  if (themeLink) {
    themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/${theme}.min.css`;
  }
}
