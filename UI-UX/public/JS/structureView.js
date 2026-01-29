export function setupStructureView() {
  const structureToggle = document.getElementById('structure-toggle');

  if (window.innerWidth > 1280) {
    toggleStructureView();
  }

  structureToggle.addEventListener('click', () => {
    toggleStructureView();
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('open')) {
      window.toggleSidebar();
    }
  });
}

function toggleStructureView() {
  const structureToggle = document.getElementById('structure-toggle');
  const structureView = document.getElementById('structure-view');

  structureToggle.classList.toggle('open');
  structureView.classList.toggle('open');

  // Move the content area only for screens wider than 768px
  const main = document.querySelector('main');
  if (window.innerWidth > 1280) {
    main.classList.toggle('shifted');
  }
}

export function closeStructureView() {
  const structureToggle = document.getElementById('structure-toggle');
  const structureView = document.getElementById('structure-view');
  const main = document.querySelector('main');

  structureToggle.classList.remove('open');
  structureView.classList.remove('open');
  main.classList.remove('shifted');
}

// Store scroll handlers globally to allow cleanup
let currentScrollHandler = null;
let currentMainElement = null;

export function generateStructureView(content) {
  const structureView = document.getElementById('structure-view');
  const structureContent = document.createElement('div');
  structureContent.id = 'structure-content';
  structureContent.setAttribute('tabindex', '-1');
  structureView.innerHTML = ''; // Clear previous structure
  structureView.appendChild(structureContent);

  // Create headings structure
  const headings = content.querySelectorAll('h1, h2, h3');

  if (headings.length === 0) {
    structureContent.innerHTML = '<p>No structure found</p>';
    return;
  }

  // Clean up previous event listeners
  if (currentScrollHandler) {
    window.removeEventListener('scroll', currentScrollHandler);
    if (currentMainElement) {
      currentMainElement.removeEventListener('scroll', currentScrollHandler);
    }
  }

  const structureItems = new Map(); // Store references to structure items
  const observedHeadings = []; // Store all headings for querying
  let updateTimeout = null;

  // Function to update the active heading highlight
  function updateActiveHeading() {
    if (observedHeadings.length === 0) return;

    // Define the detection zone - top 30% of viewport
    const viewportHeight = window.innerHeight;
    const detectionThreshold = viewportHeight * 0.3;

    // Find the active heading: the last heading whose top is above the threshold
    let targetHeading = null;

    for (const heading of observedHeadings) {
      const rect = heading.getBoundingClientRect();

      // If heading is above or within the detection zone
      if (rect.top <= detectionThreshold) {
        targetHeading = heading;
      } else {
        // Once we find a heading below the threshold, stop
        break;
      }
    }

    // If no heading is above threshold, use the first heading
    if (!targetHeading && observedHeadings.length > 0) {
      targetHeading = observedHeadings[0];
    }

    if (targetHeading) {
      const structureItem = structureItems.get(targetHeading);
      if (structureItem && !structureItem.classList.contains('active')) {
        // Remove highlight from all items
        document
          .querySelectorAll(
            '.structure-item, .structure-section, .structure-subsection'
          )
          .forEach((item) => {
            item.classList.remove('active');
          });
        // Add highlight to target item
        structureItem.classList.add('active');

        // Scroll the structure view to keep the active item in view
        const itemRect = structureItem.getBoundingClientRect();
        const containerRect = structureContent.getBoundingClientRect();

        // Calculate if the item is outside the visible area
        if (
          itemRect.top < containerRect.top ||
          itemRect.bottom > containerRect.bottom
        ) {
          // Calculate the scroll position to keep the item in the upper portion of the viewport
          const scrollTop = structureItem.offsetTop - 100; // Offset from top to keep it visible
          structureContent.scrollTo({
            top: Math.max(0, scrollTop), // Ensure we don't scroll past the top
            behavior: 'smooth'
          });
        }
      }
    }
  }

  // Use scroll event instead of IntersectionObserver for more consistent behavior
  let scrollTimeout = null;
  function handleScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveHeading, 50);
  }

  // Store handler globally for cleanup
  currentScrollHandler = handleScroll;

  // Find the scrollable element - it's #content, not main
  currentMainElement = document.getElementById('content');

  // Listen to scroll events on the content area (which is the actual scrollable element)
  if (currentMainElement) {
    currentMainElement.addEventListener('scroll', handleScroll);
  }
  window.addEventListener('scroll', handleScroll);

  headings.forEach((heading) => {
    const level = heading.tagName.toLowerCase();
    const text = heading.textContent;

    // Handle h1 (top-level section)
    if (level === 'h1') {
      const section = createStructureItem(text, heading);
      structureContent.appendChild(section);
      structureItems.set(heading, section);
    }

    // Handle h2 (section)
    if (level === 'h2') {
      const section = createStructureSection(text, heading);
      structureContent.appendChild(section);
      structureItems.set(heading, section);
    }

    // Handle h3 (subsection)
    if (level === 'h3') {
      const subsection = createStructureSubsection(text, heading);
      structureContent.appendChild(subsection);
      structureItems.set(heading, subsection);
    }

    // Store heading in order
    observedHeadings.push(heading);
  });

  // Initial update to highlight the first visible heading
  updateActiveHeading();
}

function createStructureItem(text, heading) {
  const item = document.createElement('div');
  item.classList.add('structure-item');
  item.textContent = text.replace(/:/g, '');
  item.onclick = (e) => {
    e.stopPropagation();
    // Trigger sound manually since stopPropagation prevents bubbling
    if (window.playClickSound) {
      window.playClickSound();
    }
    scrollToHeading(heading);
  };
  return item;
}

function createStructureSection(text, heading) {
  const section = document.createElement('div');
  section.classList.add('structure-section');
  section.textContent = text.replace(/:/g, '');
  section.onclick = (e) => {
    e.stopPropagation();
    // Trigger sound manually since stopPropagation prevents bubbling
    if (window.playClickSound) {
      window.playClickSound();
    }
    scrollToHeading(heading);
  };
  return section;
}

function createStructureSubsection(text, heading) {
  const subsection = document.createElement('div');
  subsection.classList.add('structure-subsection');
  subsection.textContent = text.replace(/:/g, '');
  subsection.onclick = (e) => {
    e.stopPropagation();
    // Trigger sound manually since stopPropagation prevents bubbling
    if (window.playClickSound) {
      window.playClickSound();
    }
    scrollToHeading(heading);
  };
  return subsection;
}

function scrollToHeading(heading) {
  let attempts = 0;
  const maxAttempts = 5;
  const delay = 50;

  function attemptScroll() {
    attempts++;
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const rect = heading.getBoundingClientRect();
    const isScrolledToView = rect.top >= 0 && rect.top <= window.innerHeight;

    if (!isScrolledToView && attempts < maxAttempts) {
      setTimeout(attemptScroll, delay);
    } else if (window.innerWidth <= 768) {
      closeStructureView();
    }
  }

  attemptScroll();
}
