/**
 * iframeHandler.js
 * Replaces all iframes in a content container with lazy-load placeholders.
 * - Iframes do NOT load on page render.
 * - Clicking "Load Preview" loads the iframe for that entry.
 * - Only one iframe can be active at a time; opening a new one unloads the previous.
 * - A reload button is shown at the top-right while the iframe is active.
 */

let activeWrapper = null; // Tracks the currently loaded iframe wrapper

/**
 * Converts all <iframe> elements inside `container` into lazy-load wrappers.
 * @param {HTMLElement} container
 */
export function setupIframeHandlers(container) {
  const iframes = container.querySelectorAll('iframe');

  iframes.forEach((iframe) => {
    const src = iframe.src || iframe.getAttribute('src');
    const title = iframe.title || iframe.getAttribute('title') || 'Preview';

    if (!src) return;

    // HTTP iframes cannot be embedded inside a secure page
    const isEmbedBlocked = src.startsWith('http://');

    // Wrapper replaces the original iframe
    const wrapper = document.createElement('div');
    wrapper.className = 'iframe-lazy-wrapper';
    wrapper.dataset.src = src;
    wrapper.dataset.title = title;

    // ── Placeholder ───────────────────────────────────────────────
    const placeholder = document.createElement('div');
    placeholder.className = 'iframe-placeholder';

    const titleEl = document.createElement('span');
    titleEl.className = 'iframe-placeholder-title';
    titleEl.textContent = title;

    const actions = document.createElement('div');
    actions.className = 'iframe-placeholder-actions';

    // "Open in new tab" button
    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'button';
    openBtn.textContent = 'Open in new tab';
    openBtn.addEventListener('click', () =>
      window.open(src, '_blank', 'noopener,noreferrer')
    );
    actions.appendChild(openBtn);

    // "Load Preview" button — hidden for embed-blocked HTTP srcs
    if (!isEmbedBlocked) {
      const loadBtn = document.createElement('button');
      loadBtn.type = 'button';
      loadBtn.className = 'button';
      loadBtn.textContent = 'Load Preview';
      loadBtn.addEventListener('click', () => loadIframe(wrapper));
      actions.appendChild(loadBtn);
    }

    placeholder.appendChild(titleEl);
    placeholder.appendChild(actions);
    wrapper.appendChild(placeholder);

    // ── Reload button overlay (top-right, shown while active) ─────
    const reloadBtn = document.createElement('button');
    reloadBtn.className = 'iframe-reload-btn';
    reloadBtn.type = 'button';
    reloadBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
    reloadBtn.hidden = true;
    reloadBtn.addEventListener('click', () => reloadIframe(wrapper));
    wrapper.appendChild(reloadBtn);

    // Replace original iframe with wrapper
    iframe.parentNode.replaceChild(wrapper, iframe);
  });
}

/**
 * Loads the iframe inside the given wrapper. Unloads any previously active one.
 * @param {HTMLElement} wrapper
 */
function loadIframe(wrapper) {
  // Unload previous if different wrapper
  if (activeWrapper && activeWrapper !== wrapper) {
    unloadIframe(activeWrapper);
  }

  const src = wrapper.dataset.src;
  const title = wrapper.dataset.title;

  // Remove old iframe if present (reload scenario)
  const existingIframe = wrapper.querySelector('iframe');
  if (existingIframe) existingIframe.remove();

  // Build the actual iframe
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = title;
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('allowfullscreen', '');
  iframe.className = 'iframe-loaded';

  // Show loading state
  wrapper.classList.add('iframe-loading');

  iframe.addEventListener('load', () => {
    wrapper.classList.remove('iframe-loading');
    wrapper.classList.add('iframe-active');
  });

  iframe.addEventListener('error', () => {
    wrapper.classList.remove('iframe-loading');
  });

  wrapper.appendChild(iframe);

  // Hide placeholder, show reload button
  const placeholder = wrapper.querySelector('.iframe-placeholder');
  const reloadBtn = wrapper.querySelector('.iframe-reload-btn');
  placeholder.hidden = true;
  reloadBtn.hidden = false;

  activeWrapper = wrapper;
}

/**
 * Reloads the iframe inside the given wrapper.
 * @param {HTMLElement} wrapper
 */
function reloadIframe(wrapper) {
  const reloadBtn = wrapper.querySelector('.iframe-reload-btn');
  reloadBtn.classList.add('spinning');
  setTimeout(() => reloadBtn.classList.remove('spinning'), 800);
  loadIframe(wrapper);
}

/**
 * Unloads (removes) the iframe from the given wrapper, restoring the placeholder.
 * @param {HTMLElement} wrapper
 */
function unloadIframe(wrapper) {
  const iframe = wrapper.querySelector('iframe');
  if (iframe) iframe.remove();

  wrapper.classList.remove('iframe-active', 'iframe-loading');

  const placeholder = wrapper.querySelector('.iframe-placeholder');
  const reloadBtn = wrapper.querySelector('.iframe-reload-btn');
  placeholder.hidden = false;
  reloadBtn.hidden = true;

  if (activeWrapper === wrapper) {
    activeWrapper = null;
  }
}
