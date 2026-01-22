/**
 * Configures Marked.js renderer to use Prism.js for code highlighting
 * @param {marked.Renderer} renderer - The Marked renderer instance
 */
export function configureCodeHighlighting(renderer) {
  const originalCodeRenderer = renderer.code;

  renderer.code = function (code, infostring, escaped) {
    const originalHtml = originalCodeRenderer.call(this, code, infostring, escaped);

    if (!infostring) {
      return originalHtml.replace('<pre>', '<pre class="language-none">');
    }

    const language = infostring.split(/\s+/)[0];

    return originalHtml
      .replace('<pre>', `<pre class="line-numbers">`)
      .replace(`<code>`, `<code class="language-${language}">`);
  };

  return renderer;
}

/**
 * Initializes code highlighting for dynamically loaded content
 * @param {HTMLElement} container - The container where code blocks are found
 */
export function initCodeHighlighting(container) {
  const codeBlocks = container.querySelectorAll('pre code');

  if (codeBlocks.length > 0 && window.Prism) {
    window.Prism.highlightAllUnder(container);
  }
}

/**
 * Adds copy button to code blocks
 * @param {HTMLElement} container - The container where code blocks are found
 */
export function addCopyButtons(container) {
  const codeBlocks = container.querySelectorAll('pre');

  codeBlocks.forEach(block => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';

    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy';

    copyButton.addEventListener('click', () => {
      const code = block.querySelector('code');
      navigator.clipboard.writeText(code.textContent).then(() => {
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';

        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 2000);
      });
    });

    wrapper.insertBefore(copyButton, block);
  });
}
