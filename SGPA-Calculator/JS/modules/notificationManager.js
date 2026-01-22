/**
 * Notification Manager Module
 * Handles toast notifications and extends PopupManager functionality
 */

export class NotificationManager {
  // Global notification queue system
  static notificationQueue = [];
  static isProcessingQueue = false;
  static notificationDelay = 300; // Delay between notifications in milliseconds

  /**
   * Add notification to queue for ordered display
   * @param {string} message - The message to show
   * @param {string} type - The type of notification ('info', 'success', 'error', 'warning')
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  static addToQueue(message, type = 'info', duration = 5000) {
    this.notificationQueue.push({ message, type, duration });
    this.processQueue();
  }

  /**
   * Process the notification queue with proper timing
   */
  static async processQueue() {
    if (this.isProcessingQueue || this.notificationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift();
      this.showNotificationImmediate(
        notification.message,
        notification.type,
        notification.duration
      );

      // Wait before showing next notification
      await new Promise((resolve) =>
        setTimeout(resolve, this.notificationDelay)
      );
    }

    this.isProcessingQueue = false;
  }

  /**
   * Show a toast notification immediately (internal method)
   * @param {string} message - The message to show
   * @param {string} type - The type of notification ('info', 'success', 'error', 'warning')
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  static showNotificationImmediate(message, type = 'info', duration = 5000) {
    // Create notification element first
    const notification = document.createElement('div');
    notification.className = `notification-toast fixed right-0 z-[70] max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;

    // Calculate position - new notifications append at the bottom to maintain order
    const existingNotifications = document.querySelectorAll(
      '.notification-toast'
    );
    const notificationHeight = navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edg') ? 100 : 90; // Chrome: 100px, Edge/others: 90px

    // Set position for new notification at bottom of existing notifications
    const newTop = 16 + existingNotifications.length * notificationHeight;
    notification.style.top = `${newTop}px`;

    // Set notification style based on type
    const styles = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-white',
      info: 'bg-blue-500 text-white'
    };

    notification.classList.add(...styles[type].split(' '));

    // Set notification content
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          ${this.getNotificationIcon(type)}
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">${message}</p>
        </div>
        <button class="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-white/20 transition-colors duration-200" onclick="NotificationManager.removeNotification(this.parentElement.parentElement)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
      notification.classList.add('-translate-x-4');
    }, 100);

    // Auto remove after specified duration
    setTimeout(() => {
      notification.classList.remove('translate-x-0');
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
          // Reposition remaining notifications after auto-removal
          this.repositionNotifications();
        }
      }, 300);
    }, duration);
  }

  /**
   * Get notification icon based on type
   * @param {string} type - The notification type
   * @returns {string} SVG icon HTML
   */
  static getNotificationIcon(type) {
    const icons = {
      success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>`,
      error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>`,
      warning: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>`,
      info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`
    };

    return icons[type] || icons.info;
  }

  /**
   * Remove a notification with animation
   * @param {HTMLElement} notification - The notification element to remove
   */
  static removeNotification(notification) {
    if (!notification) return;

    // Animate out
    notification.classList.remove('translate-x-0');
    notification.classList.add('translate-x-full');

    // Remove after animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
        // Reposition remaining notifications
        this.repositionNotifications();
      }
    }, 300);
  }

  /**
   * Reposition all remaining notifications after one is removed
   */
  static repositionNotifications() {
    const remainingNotifications = document.querySelectorAll(
      '.notification-toast'
    );
    const notificationHeight = 76; // Height + margin between notifications
    const baseTop = 16; // Top margin

    remainingNotifications.forEach((notification, index) => {
      const newTop = baseTop + index * notificationHeight;
      // Add transition for smooth movement
      notification.style.transition = 'top 0.3s ease-out';
      notification.style.top = `${newTop}px`;
    });
  }

  /**
   * Show a toast notification (public method that uses queue)
   * @param {string} message - The message to show
   * @param {string} type - The type of notification ('info', 'success', 'error', 'warning')
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  static showNotification(message, type = 'info', duration = 5000) {
    this.addToQueue(message, type, duration);
  }

  /**
   * Show a success notification
   * @param {string} message - The message to show
   */
  static showSuccess(message) {
    this.addToQueue(message, 'success');
  }

  /**
   * Show an error notification
   * @param {string} message - The message to show
   */
  static showError(message) {
    this.addToQueue(message, 'error');
  }

  /**
   * Show a warning notification
   * @param {string} message - The message to show
   */
  static showWarning(message) {
    this.addToQueue(message, 'warning');
  }

  /**
   * Show an info notification
   * @param {string} message - The message to show
   */
  static showInfo(message) {
    this.addToQueue(message, 'info');
  }

  /**
   * Clear all pending notifications from the queue
   */
  static clearQueue() {
    this.notificationQueue = [];
  }

  /**
   * Get the number of pending notifications in the queue
   * @returns {number} Number of pending notifications
   */
  static getQueueLength() {
    return this.notificationQueue.length;
  }
}

// Make NotificationManager globally accessible for onclick handlers
window.NotificationManager = NotificationManager;
