import { notificationManager } from './notificationHandler.js';

export class DashboardHandler {
  constructor() {
    this.dashboard = null;
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) return;

    this.dashboard = document.createElement('div');
    this.dashboard.id = 'dashboard';
    this.dashboard.className = 'dashboard';

    this.dashboard.innerHTML = `
                <div class="dashboard-header">
                    <h2>Dashboard</h2>
                    <button class="toggle" id="close-dashboard" aria-label="Close dashboard"><i class="bi bi-x-lg"></i></button>
                </div>
                <div class="dashboard-bento">
                    <div class="bento-box notification-form-section">
                        <div class="notification-form">
                            <h3>Add Notification</h3>
                            <form id="notification-form">
                                <div class="form-group">
                                    <label for="description">Description:</label>
                                    <textarea id="description" required></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="link">Link:</label>
                                    <input type="text" id="link" required>
                                </div>
                                <div class="form-group">
                                    <label for="linkName">Link Text:</label>
                                    <input type="text" id="linkName" required>
                                </div>
                                <div class="form-group">
                                    <label for="expiryDate">Expiry Date:</label>
                                    <input type="datetime-local" id="expiryDate" required>
                                </div>
                                <div class="form-actions">
                                    <button type="button" class="button cancel-btn">Cancel</button>
                                    <button type="submit" class="button submit-btn">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="bento-box notifications-section">
                        <h3>Notifications</h3>
                        <button class="button add-notification-btn"><span class="btn-text">Add New Notification</span><i class="bi bi-plus btn-icon"></i></button>
                        <div class="notifications-list-container">
                            <div class="notifications-list"></div>
                        </div>
                    </div>
                    <div class="bento-box stats-section">
                        <h3>Statistics</h3>
                        <div class="stats-content">
                            <p>Active Notifications: <span id="active-notifications">0</span></p>
                            <p>Expired Notifications: <span id="expired-notifications">0</span></p>
                        </div>
                    </div>
                </div>
        `;

    document.body.appendChild(this.dashboard);
    this.setupEventListeners();
    this.setupNotifications();
    this.setupFormListeners();
    this.isInitialized = true;
  }

  setupFormListeners() {
    const form = this.dashboard.querySelector('#notification-form');
    const cancelBtn = form.querySelector('.cancel-btn');

    cancelBtn.addEventListener('click', () => {
      form.reset();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        description: form.description.value,
        link: form.link.value,
        linkName: form.linkName.value,
        expiryDate: new Date(form.expiryDate.value).toISOString()
      };

      try {
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        await notificationManager.createNotification(formData);
        form.reset();

        submitBtn.textContent = 'Saved!';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save';
        }, 2000);
      } catch (error) {
        alert('Error saving notification: ' + error.message);
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save';
      }
    });
  }

  showNotificationForm(notification = null) {
    const form = this.dashboard.querySelector('#notification-form');
    const formTitle = form.closest('.notification-form').querySelector('h3');

    formTitle.textContent = notification
      ? 'Edit Notification'
      : 'Add Notification';
    form.description.value = notification?.description || '';
    form.link.value = notification?.link || '';
    form.linkName.value = notification?.linkName || '';
    if (notification?.expiryDate) {
      const date = new Date(notification.expiryDate);
      const localDateTime = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
      form.expiryDate.value = localDateTime;
    } else {
      form.expiryDate.value = '';
    }

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.dataset.editMode = notification ? notification.id : '';

    newForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        description: newForm.description.value,
        link: newForm.link.value,
        linkName: newForm.linkName.value,
        expiryDate: new Date(newForm.expiryDate.value).toISOString()
      };

      try {
        const submitBtn = newForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        if (newForm.dataset.editMode) {
          await notificationManager.updateNotification(
            newForm.dataset.editMode,
            formData
          );
        } else {
          await notificationManager.createNotification(formData);
        }

        newForm.reset();
        newForm.dataset.editMode = '';
        formTitle.textContent = 'Add Notification';

        submitBtn.disabled = false;
        submitBtn.textContent = 'Saved!';

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.textContent = 'Save';
          }
        }, 1000);
      } catch (error) {
        alert('Error saving notification: ' + error.message);
        const submitBtn = newForm.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save';
      }
    });

    newForm.querySelector('.cancel-btn').addEventListener('click', () => {
      newForm.reset();
      newForm.dataset.editMode = '';
      formTitle.textContent = 'Add Notification';
    });
  }

  setupNotifications() {
    const addBtn = this.dashboard.querySelector('.add-notification-btn');
    addBtn.addEventListener('click', () => this.showNotificationForm());

    const listContainer = this.dashboard.querySelector('.notifications-list');
    listContainer.innerHTML =
      '<div class="loading-spinner"><i class="bi bi-arrow-clockwise"></i></div>';

    notificationManager.onNotificationsChange((notifications) => {
      this.renderNotifications(notifications);
      this.updateNotificationStats(notifications);
    });
  }

  updateNotificationStats(notifications) {
    const activeCount = document.getElementById('active-notifications');
    const expiredCount = document.getElementById('expired-notifications');

    if (!notifications) {
      return;
    }

    this.calculateAndUpdateStats(notifications, activeCount, expiredCount);
  }

  calculateAndUpdateStats(notifications, activeCount, expiredCount) {
    const now = new Date();
    const active = notifications.filter(
      (n) => new Date(n.expiryDate) > now
    ).length;
    const expired = notifications.filter(
      (n) => new Date(n.expiryDate) <= now
    ).length;

    activeCount.textContent = active;
    expiredCount.textContent = expired;
  }

  renderNotifications(notifications) {
    const listContainer = this.dashboard.querySelector('.notifications-list');
    listContainer.innerHTML = notifications
      .map(
        (notification) => `
            <div class="notification-item" data-id="${notification.id}">
                <div class="notification-content">
                    <p>${notification.description}</p>
                    <small>Expires: ${new Date(
          notification.expiryDate
        ).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })}</small>
                </div>
                <div class="notification-actions">
                    <button class="button edit-btn">Edit</button>
                    <button class="button delete-btn">Delete</button>
                </div>
            </div>
        `
      )
      .join('');

    listContainer.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const notificationId =
          e.target.closest('.notification-item').dataset.id;
        const notification = notifications.find((n) => n.id === notificationId);
        this.showNotificationForm(notification);
      });
    });

    listContainer.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        if (confirm('Are you sure you want to delete this notification?')) {
          const notificationId =
            e.target.closest('.notification-item').dataset.id;
          await notificationManager.deleteNotification(notificationId);
        }
      });
    });
  }

  setupEventListeners() {
    const closeDashboard = this.dashboard.querySelector('#close-dashboard');
    closeDashboard.addEventListener('click', () => this.toggle(false));
  }

  toggle(force) {
    if (!this.dashboard) return;

    if (typeof force === 'boolean') {
      this.dashboard.classList.toggle('show', force);
    } else {
      this.dashboard.classList.toggle('show');
    }
  }

  isVisible() {
    return this.dashboard?.classList.contains('show');
  }

  updateContent(content) {
    if (!this.dashboard) return;
    const dashboardBody = this.dashboard.querySelector('.dashboard-body');
    if (dashboardBody) {
      dashboardBody.innerHTML = content;
    }
  }
}

export const dashboardHandler = new DashboardHandler();
