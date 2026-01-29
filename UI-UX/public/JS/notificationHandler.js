import { db } from './firebaseConfig.js';
import {
  ref,
  onValue,
  push,
  update,
  remove
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js';

export function showUpdateNotification() {
  const notificationsRef = ref(db, 'notifications');
  let notificationContainer = null;

  onValue(notificationsRef, (snapshot) => {
    const titleElement = document.querySelector('.title');
    if (titleElement && titleElement.classList.contains('admin-mode')) {
      if (notificationContainer) {
        notificationContainer.remove();
        notificationContainer = null;
      }
      return;
    }

    const notifications = [];
    snapshot.forEach((childSnapshot) => {
      const notification = childSnapshot.val();
      const currentDate = new Date();
      const expiryDate = new Date(notification.expiryDate);

      if (currentDate < expiryDate) {
        notifications.push(notification);
      }
    });

    if (notifications.length === 0) {
      if (notificationContainer) {
        notificationContainer.remove();
        notificationContainer = null;
      }
      return;
    }

    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.className = 'notification-container';
      document.body.appendChild(notificationContainer);
    }

    notifications.forEach((notificationData, index) => {
      setTimeout(() => {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
                    <p>${notificationData.description} <a href="${notificationData.link}">${notificationData.linkName}</a></p>
                    <button class="close-notification"><i class="bi bi-x-lg"></i></button>
                    <div class="notification-progress-bar">
                      <div class="notification-progress-fill"></div>
                    </div>
                `;

        notificationContainer.appendChild(notification);

        setTimeout(() => {
          notification.classList.add('show');

          // Start the progress bar animation
          const progressFill = notification.querySelector(
            '.notification-progress-fill'
          );
          if (progressFill) {
            progressFill.style.animation =
              'notificationProgress 5s linear forwards';
          }
        }, 10);

        const removeNotification = () => {
          notification.classList.add('hide');
          setTimeout(() => {
            notification.remove();
            const remainingNotifications =
              notificationContainer.querySelectorAll('.update-notification');
            remainingNotifications.forEach((notification, idx) => {
              notification.style.transform =
                idx === 0 ? 'translateY(0)' : `translateY(-${100}%)`;
            });
          }, 1000);
        };

        const timeoutId = setTimeout(removeNotification, 5000);

        notification
          .querySelector('.close-notification')
          .addEventListener('click', () => {
            clearTimeout(timeoutId);
            removeNotification();
          });
      }, index * 1000);
    });
  });
}

export class NotificationManager {
  constructor() {
    this.notificationsRef = ref(db, 'notifications');
  }

  async createNotification(notification) {
    try {
      const newNotificationRef = push(this.notificationsRef);
      await update(newNotificationRef, notification);
      return newNotificationRef.key;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async updateNotification(notificationId, updates) {
    try {
      const notificationRef = ref(db, `notifications/${notificationId}`);
      await update(notificationRef, updates);
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId) {
    try {
      const notificationRef = ref(db, `notifications/${notificationId}`);
      await remove(notificationRef);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  onNotificationsChange(callback) {
    onValue(this.notificationsRef, (snapshot) => {
      const notifications = [];
      snapshot.forEach((childSnapshot) => {
        notifications.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      callback(notifications);
    });
  }
}

export const notificationManager = new NotificationManager();
