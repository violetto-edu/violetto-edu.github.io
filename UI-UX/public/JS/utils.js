import { generateStructureView } from './structureView.js';
import { lazyLoadImages } from './imageHandler.js';
import { tutorials } from './sidebar.js';
import { initCodeHighlighting, addCopyButtons } from './prismHighlighter.js';
import { lastEditTracker } from './lastEditTracker.js';

// Function to load tutorial content with lazy loading
export async function loadTutorial(filename) {
  const tutorialContent = document.getElementById('tutorial-content');
  const structureContent = document.getElementById('structure-content');

  // Show loading skeleton
  tutorialContent.innerHTML = `
    <div class="skeleton skeleton-header"></div>
    <div class="skeleton-paragraph">
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
    </div>
    <br />
    <div class="skeleton skeleton-header"></div>
    <div class="skeleton-paragraph">
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
    </div>
  `;

  structureContent.innerHTML = `
    <div class="skeleton skeleton-header"></div>
    <div class="skeleton-paragraph">
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
    </div>
  `;

  try {
    const response = await fetch(`tutorials/${filename}`);
    if (!response.ok) {
      throw new Error('Failed to load tutorial');
    }
    let markdown = await response.text();

    // Preprocess markdown to handle aspect ratio attribute
    markdown = markdown.replace(
      /!\[([^\]]*)\]\(([^)]+)\){data-aspect-ratio="([^"]+)"}/g,
      '![$1]($2 "{data-aspect-ratio=$3}")'
    );

    markdown = markdown.replace(
      /!\[([^\]]*)\]\(images\//g,
      '![$1](/UI-UX/tutorials/images/'
    );

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'tutorial-content-wrapper';

    const parsedContent = marked.parse(markdown);
    const processedContent = wrapHexColors(parsedContent);
    contentWrapper.innerHTML = wrapTables(processedContent);

    // Initialize code highlighting on the new content
    initCodeHighlighting(contentWrapper);
    addCopyButtons(contentWrapper);

    // Setup hex color click handlers
    setupHexColorHandlers(contentWrapper);

    // After parsing, process images to add aspect ratio
    const images = contentWrapper.querySelectorAll('img');
    images.forEach((img) => {
      const aspectRatioMatch = img.title.match(/\{data-aspect-ratio=([^}]+)\}/);
      if (aspectRatioMatch) {
        img.setAttribute('data-aspect-ratio', aspectRatioMatch[1]);
        img.removeAttribute('title');
      }
    });

    tutorialContent.innerHTML = '';
    tutorialContent.appendChild(contentWrapper);

    if (filename === 'about-course.md') {
      adjustTableHeader(filename);
    }

    const navigationContainer = document.createElement('div');
    navigationContainer.className = 'navigation-buttons';
    tutorialContent.appendChild(navigationContainer);

    // Generate structure view after content is loaded
    generateStructureView(contentWrapper);

    // Update URL
    updateURL(filename);

    // Update the active link in the sidebar
    const sidebarLink = document.querySelector(
      `#tutorial-list a[href="#${filename}"]`
    );
    if (sidebarLink) {
      updateActiveLink(sidebarLink);
    }

    // Add navigation buttons
    addNavigationButtons(filename, navigationContainer);

    // Lazy load images
    lazyLoadImages(contentWrapper);

    // Add last edit date information to the top of content
    lastEditTracker.displayLastEditDate(filename, contentWrapper);

    window.addEventListener('resize', () => adjustTableHeader(filename));
  } catch (error) {
    tutorialContent.innerHTML = `
      <div class="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>We encountered an error while loading the tutorial content.</p>
        <p class="error-details">Error: ${error.message}</p>
        <button onclick="window.location.reload()">Try Again</button>
      </div>
    `;
  }
}

// Function to setup hex color click handlers
export function setupHexColorHandlers(container = document) {
  const hexColors = container.querySelectorAll('.hex-color');
  hexColors.forEach((span) => {
    // Remove any existing event listeners to prevent duplicates
    span.removeEventListener('click', hexColorClickHandler);
    span.addEventListener('click', hexColorClickHandler);
  });
}

// Hex color click handler function (extracted for reuse)
function hexColorClickHandler() {
  const color = this.getAttribute('data-color');
  navigator.clipboard.writeText(color);

  const originalText = this.textContent;
  this.textContent = 'Copied!';
  this.setAttribute('aria-label', 'Good job!');
  setTimeout(() => {
    this.textContent = originalText;
    this.setAttribute('aria-label', 'Click to copy');
  }, 1000);
}

// Function to wrap hex colors in clickable spans
function wrapHexColors(content) {
  return content.replace(
    /#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\b/g,
    (match, color) => {
      const fullColor =
        color.length === 3
          ? `#${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`
          : `#${color}`;
      const textColor = getContrastColor(fullColor);
      return `<span class="hex-color"
        data-color="${fullColor}"
        style="background-color: ${fullColor}; color: ${textColor};"
        aria-label="Click to copy">${match}</span>`;
    }
  );
}

// Helper function to determine contrasting text color
function getContrastColor(hexcolor) {
  // Convert hex to RGB
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on background luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Function to wrap table
function wrapTables(content) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  const tables = tempDiv.querySelectorAll('table');
  tables.forEach((table) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  return tempDiv.innerHTML;
}

// Function to adjust table for mobile devices
export function adjustTableHeader(filename) {
  const isMobile = window.innerWidth <= 640;
  const applicableFiles = ['introduction.md', 'about-course.md'];

  if (isMobile && applicableFiles.includes(filename)) {
    const firstTh = document.querySelector('#tutorial-content th:first-child');
    if (firstTh) {
      firstTh.style.display = 'none';
    }

    const secondTh = document.querySelector('#tutorial-content th:last-child');
    if (secondTh) {
      secondTh.setAttribute('colspan', '2');
    }
  } else {
    const firstTh = document.querySelector('#tutorial-content th:first-child');
    if (firstTh) {
      firstTh.style.display = '';
    }

    const secondTh = document.querySelector('#tutorial-content th:last-child');
    if (secondTh) {
      secondTh.removeAttribute('colspan');
    }
  }
}

// Function to update URL
function updateURL(filename) {
  history.pushState(null, '', `#${filename}`);
}

// Function to update active link in sidebar
export async function updateActiveLink(clickedLink) {
  document.querySelectorAll('#tutorial-list a').forEach((link) => {
    link.classList.remove('active');
  });
  clickedLink.classList.add('active');
}

// Function to add navigation buttons
function addNavigationButtons(currentFile, navigationContainer) {
  const currentIndex = tutorials.findIndex(
    (tutorial) => tutorial.file === currentFile
  );

  const prevButton =
    currentIndex > 0
      ? `<button id="prev-button" aria-label="Previous tutorial">Previous: ${
          tutorials[currentIndex - 1].name
        }</button>`
      : `<button id="prev-button" disabled class="invisible">Previous</button>`;

  const nextButton =
    currentIndex < tutorials.length - 1
      ? `<button id="next-button" aria-label="Next tutorial">Next: ${
          tutorials[currentIndex + 1].name
        }</button>`
      : `<button id="next-button" disabled class="invisible">Next</button>`;

  navigationContainer.innerHTML = `${prevButton}${nextButton}`;

  // Add event listeners for buttons with sidebar link updates
  const prevButtonElement = document.getElementById('prev-button');
  const nextButtonElement = document.getElementById('next-button');

  if (currentIndex > 0 && prevButtonElement) {
    prevButtonElement.addEventListener('click', () => {
      const prevFile = tutorials[currentIndex - 1].file;
      loadTutorial(prevFile);
      const prevLink = document.querySelector(
        `#tutorial-list a[href="#${prevFile}"]`
      );
      if (prevLink) {
        updateActiveLink(prevLink);
      }
    });
  }

  if (currentIndex < tutorials.length - 1 && nextButtonElement) {
    nextButtonElement.addEventListener('click', () => {
      const nextFile = tutorials[currentIndex + 1].file;
      loadTutorial(nextFile);
      const nextLink = document.querySelector(
        `#tutorial-list a[href="#${nextFile}"]`
      );
      if (nextLink) {
        updateActiveLink(nextLink);
      }
    });
  }
}
