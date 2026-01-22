// Last edit date tracker for tutorial files
class LastEditTracker {
  constructor() {
    this.baseApiUrl =
      'https://api.github.com/repos/violetto-edu/violetto-edu.github.io/commits';
    this.cache = new Map();
    this.cacheDuration = 1000 * 60 * 60; // 1 hour cache
  }

  /**
   * Get the last edit date for a tutorial file
   * @param {string} filename - The tutorial filename (e.g., 'introduction.md')
   * @returns {Promise<Date|null>} The last edit date or null if not found
   */
  async getLastEditDate(filename) {
    const cacheKey = filename;
    const cached = this.cache.get(cacheKey);

    // Return cached result if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.date;
    }

    try {
      // Check if user is online
      if (!navigator.onLine) {
        return null;
      }

      const filePath = `UI-UX/tutorials/${filename}`;
      const url = `${this.baseApiUrl}?path=${encodeURIComponent(
        filePath
      )}&per_page=1`;

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/vnd.github.v3+json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle rate limiting
        if (response.status === 403) {
          console.warn(`GitHub API rate limit exceeded for ${filename}`);
          return null;
        }
        console.warn(
          `Failed to fetch last edit date for ${filename}:`,
          response.status
        );
        return null;
      }

      const commits = await response.json();
      if (!Array.isArray(commits) || commits.length === 0) {
        console.warn(`No commits found for ${filename}`);
        return null;
      }

      const lastCommitDate = new Date(commits[0].commit.committer.date);

      // Validate the date
      if (isNaN(lastCommitDate.getTime())) {
        console.warn(`Invalid date received for ${filename}`);
        return null;
      }

      // Cache the result
      this.cache.set(cacheKey, {
        date: lastCommitDate,
        timestamp: Date.now()
      });

      return lastCommitDate;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(`Request timeout for ${filename}`);
      } else {
        console.error(`Error fetching last edit date for ${filename}:`, error);
      }
      return null;
    }
  }

  /**
   * Format date for display
   * @param {Date} date - The date to format
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    if (!date) return 'Unknown';

    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Updated yesterday';
    } else if (diffDays < 7) {
      return `Updated ${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Updated ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Updated ${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
  }

  /**
   * Create and display the last edit info element
   * @param {string} filename - The tutorial filename
   * @param {HTMLElement} container - The container to append the info to
   */
  async displayLastEditDate(filename, container) {
    // Create or find existing last edit info element
    let lastEditInfo = container.querySelector('.last-edit-info');
    if (!lastEditInfo) {
      lastEditInfo = document.createElement('div');
      lastEditInfo.className = 'last-edit-info';
      container.appendChild(lastEditInfo);
    }

    // Show loading state
    lastEditInfo.innerHTML = `
      <div class="last-edit-loading">
        <i class="fas fa-spinner fa-spin-pulse"></i>
        <span>Checking last update...</span>
      </div>
    `;

    try {
      const lastEditDate = await this.getLastEditDate(filename);

      if (lastEditDate) {
        const formattedDate = this.formatDate(lastEditDate);
        const exactDate = lastEditDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        lastEditInfo.innerHTML = `
          <div class="last-edit-content">
            <i class="fas fa-history"></i>
            <span class="last-edit-text" title="Last updated: ${exactDate}">${formattedDate}</span>
          </div>
        `;
      } else {
        // For failed requests, just hide the element to avoid cluttering UI
        lastEditInfo.style.display = 'none';
      }
    } catch (error) {
      console.error('Error displaying last edit date:', error);
      // Hide the element instead of showing error to maintain clean UI
      lastEditInfo.style.display = 'none';
    }
  }
}

export const lastEditTracker = new LastEditTracker();
