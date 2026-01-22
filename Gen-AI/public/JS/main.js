import { populateSidebar, loadProgramsFromHash } from "./sidebar.js";
import { setupSidebar } from "./sidebarToggle.js";
import { setupSearch, setupSearchShortcut } from "./search.js";
import { setupImageViewer } from "./imageHandler.js";
import { configureCodeHighlighting } from "./prismHighlighter.js";
import { initThemeManager } from "./themeManager.js";
import { setupMenuAnimation } from "./menuManager.js";

document.addEventListener("DOMContentLoaded", () => {
  initThemeManager();
  // Configure marked renderer with code highlighting
  const renderer = new marked.Renderer();
  configureCodeHighlighting(renderer);
  const originalLinkRenderer = renderer.link;
  renderer.link = function (href, title, text) {
    const link = originalLinkRenderer.call(this, href, title, text);
    if (!href.href.startsWith("https")) {
      return link
        .replace("<a", '<a target="_self" rel="noopener noreferrer"')
        .replace('href="', 'href="#');
    }
    return link.replace("<a", '<a target="_blank" rel="noopener noreferrer"');
  };
  marked.setOptions({ renderer: renderer });

  // Initialize modules
  populateSidebar();
  loadProgramsFromHash();
  setupSidebar();
  setupSearch();
  setupSearchShortcut();
  setupImageViewer();
  setupMenuAnimation();

  // Listen for hash changes
  window.addEventListener("hashchange", loadProgramsFromHash);
});