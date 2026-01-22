import { programs } from "./sidebar.js";
import { lazyLoadImages } from "./imageHandler.js"
import { initCodeHighlighting, addCopyButtons } from "./prismHighlighter.js";

export async function loadProgram(filename) {
  const programContent = document.getElementById("program-content");
  try {
    const response = await fetch(`programs/${filename}`);
    if (!response.ok) {
      throw new Error("Failed to load program");
    }
    let markdown = await response.text();

    markdown = markdown.replace(
      /!\[([^\]]*)\]\(images\//g,
      "![$1](/Gen-AI/programs/images/"
    );

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "program-content-wrapper";

    const parsedContent = marked.parse(markdown);
    contentWrapper.innerHTML = wrapTables(parsedContent);

    programContent.innerHTML = "";
    programContent.appendChild(contentWrapper);

    // Initialize code highlighting on the new content
    initCodeHighlighting(contentWrapper);
    addCopyButtons(contentWrapper);

    if (filename === "getting-started.md") {
      adjustTableHeader(filename);
    }

    const navigationContainer = document.createElement("div");
    navigationContainer.className = "navigation-buttons";
    programContent.appendChild(navigationContainer);

    const contentContainer = document.getElementById("content");
    scrollToTop(contentContainer);
    updateURL(filename);
    const sidebarLink = document.querySelector(
      `#program-list a[href="#${filename}"]`
    );
    if (sidebarLink) {
      updateActiveLink(sidebarLink);
    }
    addNavigationButtons(filename, navigationContainer);
    lazyLoadImages(contentWrapper);
    window.addEventListener("resize", () => adjustTableHeader(filename));
  } catch (error) {
    console.error("Error:", error);
    programContent.innerHTML =
      "<p>Error loading program content. Please try again later.</p>";
  }
}

// Function to wrap table
function wrapTables(content) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;

  const tables = tempDiv.querySelectorAll("table");
  tables.forEach((table) => {
    const wrapper = document.createElement("div");
    wrapper.className = "table-wrapper";
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  return tempDiv.innerHTML;
}

// Function to adjust table for mobile devices
export function adjustTableHeader(filename) {
  const isMobile = window.innerWidth <= 640;
  const applicableFiles = ["getting-started.md"];

  if (isMobile && applicableFiles.includes(filename)) {
    const firstTh = document.querySelector("#program-content th:first-child");
    if (firstTh) {
      firstTh.style.display = "none";
    }

    const secondTh = document.querySelector("#program-content th:last-child");
    if (secondTh) {
      secondTh.setAttribute("colspan", "2");
    }
  } else {
    const firstTh = document.querySelector("#program-content th:first-child");
    if (firstTh) {
      firstTh.style.display = "";
    }

    const secondTh = document.querySelector("#program-content th:last-child");
    if (secondTh) {
      secondTh.removeAttribute("colspan");
    }
  }
}

// Function to scroll to top
function scrollToTop(container) {
  if (container) {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

    if (isFirefox) {
      const startTime = performance.now();
      const duration = 300;
      const startPosition = container.scrollTop;

      function smoothScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease out quad)
        const easedProgress = progress * (2 - progress);

        container.scrollTop = startPosition * (1 - easedProgress);

        if (elapsed < duration) {
          requestAnimationFrame(smoothScroll);
        }
      }

      requestAnimationFrame(smoothScroll);
    } else {
      // For other browsers, use native smooth scroll
      container.scroll({
        top: 0,
        behavior: "smooth",
      });
    }
  }
}

// Function to update URL
function updateURL(filename) {
  history.pushState(null, "", `#${filename}`);
}

// Function to update active link in sidebar
export async function updateActiveLink(clickedLink) {
  document.querySelectorAll("#program-list a").forEach((link) => {
    link.classList.remove("active");
  });
  clickedLink.classList.add("active");
}

// Function to add navigation buttons
function addNavigationButtons(currentFile, navigationContainer) {
  const currentIndex = programs.findIndex(
    (program) => program.file === currentFile
  );

  const prevButton =
    currentIndex > 0
      ? `<button id="prev-button">Previous: ${programs[currentIndex - 1].name
      }</button>`
      : `<button id="prev-button" disabled class="invisible">Previous</button>`;

  const nextButton =
    currentIndex < programs.length - 1
      ? `<button id="next-button">Next: ${programs[currentIndex + 1].name
      }</button>`
      : `<button id="next-button" disabled class="invisible">Next</button>`;

  navigationContainer.innerHTML = `${prevButton}${nextButton}`;

  // Add event listeners for buttons with sidebar link updates
  const prevButtonElement = document.getElementById("prev-button");
  const nextButtonElement = document.getElementById("next-button");

  if (currentIndex > 0 && prevButtonElement) {
    prevButtonElement.addEventListener("click", () => {
      const prevFile = programs[currentIndex - 1].file;
      loadProgram(prevFile);
      const prevLink = document.querySelector(
        `#program-list a[href="#${prevFile}"]`
      );
      if (prevLink) {
        updateActiveLink(prevLink);
      }
    });
  }

  if (currentIndex < programs.length - 1 && nextButtonElement) {
    nextButtonElement.addEventListener("click", () => {
      const nextFile = programs[currentIndex + 1].file;
      loadProgram(nextFile);
      const nextLink = document.querySelector(
        `#program-list a[href="#${nextFile}"]`
      );
      if (nextLink) {
        updateActiveLink(nextLink);
      }
    });
  }
}