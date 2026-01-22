import { setupHexColorHandlers } from './utils.js';

export function setupTooltips() {
  // Check if device has both hover and pointer capabilities
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const hasPointer = window.matchMedia('(pointer: fine)').matches;

  // Only proceed if device supports both hover and pointer
  if (!hasHover || !hasPointer) return;

  // Select both buttons and hex color spans with aria-label, excluding navigation buttons
  const elementsWithTooltips = document.querySelectorAll(
    'button[aria-label]:not(#prev-button):not(#next-button), .hex-color[aria-label]'
  );
  const tooltipMap = new Map(); // Store tooltip references for each element

  // Helper function to calculate and update tooltip position
  function updateTooltipPosition(element, tooltip) {
    const elementRect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Calculate vertical position (centered)
    const top = elementRect.top + (elementRect.height - tooltipRect.height) / 2;

    // Calculate horizontal position
    let left;
    const spaceOnRight =
      window.innerWidth - (elementRect.right + 10 + tooltipRect.width);

    if (spaceOnRight >= 0) {
      // Place on right
      left = elementRect.right + 10;
      tooltip.classList.remove('tooltip-left');
      tooltip.classList.add('tooltip-right');
    } else {
      // Place on left
      left = elementRect.left - tooltipRect.width - 10;
      tooltip.classList.remove('tooltip-right');
      tooltip.classList.add('tooltip-left');
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  elementsWithTooltips.forEach((element) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = element.getAttribute('aria-label');
    tooltipMap.set(element, tooltip);

    // Prevent touch events from triggering the tooltip
    element.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        return;
      },
      { passive: false }
    );

    element.addEventListener('mouseenter', () => {
      // Don't show tooltip if element is active (for buttons)
      if (element.classList.contains('active')) return;

      // Update tooltip text in case aria-label changed
      tooltip.textContent = element.getAttribute('aria-label');

      document.body.appendChild(tooltip);
      updateTooltipPosition(element, tooltip);
    });

    element.addEventListener('mouseleave', () => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    });

    // Add click event listener to refresh tooltip position
    element.addEventListener('click', () => {
      // If tooltip is currently visible, update its position
      if (tooltip.parentNode) {
        // Small delay to allow for any layout changes after click
        setTimeout(() => {
          // Update tooltip text in case aria-label changed
          tooltip.textContent = element.getAttribute('aria-label');
          updateTooltipPosition(element, tooltip);
        }, 10);
      }
    });
  });

  // Store tooltip map globally for updates
  window.tooltipMap = tooltipMap;
}

// Function to update tooltip for a specific element
export function updateElementTooltip(elementId) {
  if (!window.tooltipMap) return;

  const element = document.getElementById(elementId);
  if (!element) return;

  const tooltip = window.tooltipMap.get(element);
  if (tooltip) {
    tooltip.textContent = element.getAttribute('aria-label');

    // If tooltip is currently visible, update its position too
    if (tooltip.parentNode) {
      updateTooltipPosition(element, tooltip);
    }
  }
}

// Function to update tooltip for a specific button (backward compatibility)
export function updateButtonTooltip(buttonId) {
  return updateElementTooltip(buttonId);
}

// Helper function to update tooltip position (available globally)
function updateTooltipPosition(element, tooltip) {
  const elementRect = element.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  // Calculate vertical position (centered)
  const top = elementRect.top + (elementRect.height - tooltipRect.height) / 2;

  // Calculate horizontal position
  let left;
  const spaceOnRight =
    window.innerWidth - (elementRect.right + 10 + tooltipRect.width);

  if (spaceOnRight >= 0) {
    // Place on right
    left = elementRect.right + 10;
    tooltip.classList.remove('tooltip-left');
    tooltip.classList.add('tooltip-right');
  } else {
    // Place on left
    left = elementRect.left - tooltipRect.width - 10;
    tooltip.classList.remove('tooltip-right');
    tooltip.classList.add('tooltip-left');
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

// Function to setup mutation observer for content changes (including hex colors)
export function setupContentObserver() {
  const observer = new MutationObserver((mutations) => {
    let shouldUpdateHexColors = false;
    let shouldUpdateTooltips = false;

    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // Check if any added nodes contain hex colors or are hex colors themselves
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            if (
              element.classList?.contains('hex-color') ||
              element.querySelector?.('.hex-color')
            ) {
              shouldUpdateHexColors = true;
              shouldUpdateTooltips = true;
            }
          }
        });
      }
    });

    if (shouldUpdateHexColors) {
      // Re-setup hex color handlers for the entire document
      setupHexColorHandlers();
    }

    if (shouldUpdateTooltips) {
      // Re-setup tooltips to include new hex colors
      setupTooltips();
    }
  });

  // Observe changes to the tutorial content container
  const tutorialContent = document.getElementById('tutorial-content');
  if (tutorialContent) {
    observer.observe(tutorialContent, {
      childList: true,
      subtree: true
    });
  }
}

// Function to setup mutation observer for aria-label changes
export function setupTooltipObserver() {
  // Check if device has both hover and pointer capabilities
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const hasPointer = window.matchMedia('(pointer: fine)').matches;

  // Only proceed if device supports both hover and pointer
  if (!hasHover || !hasPointer) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'aria-label'
      ) {
        const element = mutation.target;
        if (
          (element.tagName === 'BUTTON' ||
            element.classList.contains('hex-color')) &&
          window.tooltipMap
        ) {
          const tooltip = window.tooltipMap.get(element);
          if (tooltip) {
            tooltip.textContent = element.getAttribute('aria-label');

            // If tooltip is currently visible, update its position too
            if (tooltip.parentNode) {
              updateTooltipPosition(element, tooltip);
            }
          }
        }
      }
    });
  });

  // Observe all buttons and spans with aria-label for attribute changes, excluding navigation buttons
  const elementsWithAriaLabel = document.querySelectorAll(
    'button[aria-label]:not(#prev-button):not(#next-button), .hex-color[aria-label]'
  );
  elementsWithAriaLabel.forEach((element) => {
    observer.observe(element, {
      attributes: true,
      attributeFilter: ['aria-label']
    });
  });
}
