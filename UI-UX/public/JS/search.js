import { tutorials } from './sidebar.js';
import { loadTutorial, updateActiveLink } from './utils.js';

function closeSearch() {
  const searchInput = document.getElementById('search-input');
  const searchHint = document.querySelector('.search-shortcut-hint');
  const searchContainer = document.querySelector('.search-container');
  const searchResults = document.getElementById('search-results');

  searchContainer.classList.remove('open');
  searchContainer.classList.add('hidden');
  searchInput.value = '';
  if (searchResults) {
    searchResults.classList.remove('glass');
  }
  if (searchHint && window.innerWidth >= 1080) {
    searchHint.style.opacity = '0.7';
  }
  searchInput.blur();
}

export function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const searchHint = document.querySelector('.search-shortcut-hint');
  const searchResults = document.getElementById('search-results');
  const searchContainer = document.querySelector('.search-container');
  let searchTimeout;

  // Ensure search container starts hidden
  if (searchContainer) {
    searchContainer.classList.add('hidden');
    searchContainer.classList.remove('open');
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();

      // Clear previous timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      // Hide search hint immediately when typing starts
      if (searchTerm.length > 0 && searchHint) {
        searchHint.style.opacity = '0';
      }

      // Add delay to allow for result fetching and appending
      searchTimeout = setTimeout(() => {
        const filteredTutorials = tutorials.filter((tutorial) =>
          tutorial.name.toLowerCase().includes(searchTerm)
        );

        // Clear results first
        searchResults.innerHTML = '';

        // Show/hide search results based on input
        if (searchTerm.length > 0 && filteredTutorials.length > 0) {
          // Populate results
          filteredTutorials.forEach((tutorial) => {
            const div = document.createElement('div');
            div.innerHTML = `${tutorial.name}`;
            div.onclick = () => {
              loadTutorial(tutorial.file);
              updateActiveLink(
                document.querySelector(
                  `#tutorial-list a[href="#${tutorial.file}"]`
                )
              );
              closeSearch();
            };
            searchResults.appendChild(div);
          });

          // Show container only after results are populated
          searchContainer.classList.remove('hidden');
          searchContainer.classList.add('open');
          searchResults.classList.add('glass');
        } else {
          // Hide container when no results or empty search
          searchContainer.classList.remove('open');
          searchContainer.classList.add('hidden');
          searchResults.classList.remove('glass');
        }
      }, 150); // 150ms delay to allow for smooth result population
    });
  }

  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
    if (
      searchInput &&
      searchResults &&
      !searchInput.contains(e.target) &&
      !searchResults.contains(e.target)
    ) {
      closeSearch();
    }
  });

  // Handle focus/blur events
  if (searchInput && searchHint) {
    searchInput.addEventListener('focus', () => {
      searchHint.style.opacity = '0';
    });

    searchInput.addEventListener('blur', () => {
      if (
        !searchInput.value &&
        !searchContainer.classList.contains('open') &&
        window.innerWidth >= 1080
      ) {
        searchHint.style.opacity = '0.7';
      }
    });
  }

  // Close sidebar when search result is clicked (mobile only)
  if (searchResults) {
    searchResults.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        toggleSidebar();
      }
    });
  }
}

// Function for CTRL + K
export function setupSearchShortcut() {
  const searchInput = document.getElementById('search-input');
  const searchHint = document.querySelector('.search-shortcut-hint');

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
      if (searchHint) searchHint.style.opacity = '0';
    }

    if (event.key === 'Escape' && document.activeElement === searchInput) {
      closeSearch();
    }
  });
}
