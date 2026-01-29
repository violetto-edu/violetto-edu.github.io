import { auth } from './firebaseConfig.js';
import {
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { dashboardHandler } from './dashboardHandler.js';

export function initializeAuth() {
  const authContainer = document.querySelector('.authentication');
  const title = document.querySelector('.title');

  // Initialize with hidden class
  authContainer.classList.add('hidden');
  authContainer.classList.remove('show');

  const createLoginForm = () => `
        <div class="auth-modal">
            <form id="auth-form">
                <div class="form-group">
                    <label for="auth-email">Email:</label>
                    <input type="email" id="auth-email" autocomplete="email" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="auth-password">Password:</label>
                    <input type="password" id="auth-password" autocomplete="current-password" placeholder="Enter your password" required>
                </div>
                <div class="popup"></div>
                <button type="submit" id="submit" class="button">Login</button>
            </form>
            <hr />
        </div>
    `;

  const createSignOutForm = () => `
        <div class="admin-panel">
            <button class="button" id="dashboard-btn">Dashboard</button>
            <button class="button" id="signout-btn">Sign Out</button>
            <hr />
        </div>
    `;

  const updateAuthUI = (user) => {
    authContainer.innerHTML = user ? createSignOutForm() : createLoginForm();

    if (user) {
      dashboardHandler.initialize();
      const dashboardBtn = document.getElementById('dashboard-btn');
      const signOutBtn = document.getElementById('signout-btn');

      dashboardBtn.addEventListener('click', () => {
        dashboardHandler.toggle();
      });

      signOutBtn.addEventListener('click', async () => {
        try {
          await signOut(auth);
          dashboardHandler.toggle(false);
          authContainer.classList.remove('show');
          authContainer.classList.add('hidden');
        } catch (error) {
          const errorPopup = document.querySelector('.popup');
          showError(errorPopup, error.message);
        }
      });
    } else {
      setupLoginForm();
    }
  };

  const showError = (element, message) => {
    let errorMessage;

    switch (message.split('/')[1]?.split(')')[0]) {
      case 'invalid-credential':
        errorMessage = 'Invalid email or password.';
        break;
      case 'too-many-requests':
        errorMessage = 'Too many login attempts.';
        break;
      default:
        errorMessage = 'An error occurred. Please try again.';
    }
    element.innerHTML = `<i class="bi bi-exclamation-triangle"></i><p>${errorMessage}</p>`;
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    setTimeout(() => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(-100%)';
    }, 4000);
  };

  const setupLoginForm = () => {
    const authForm = document.getElementById('auth-form');
    const submitBtn = document.getElementById('submit');
    const errorPopup = authForm.querySelector('.popup');

    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;

      submitBtn.disabled = true;
      submitBtn.classList.add('loading');

      try {
        await signInWithEmailAndPassword(auth, email, password);
        title.classList.add('admin-mode');
        authContainer.classList.remove('show');
        authContainer.classList.add('hidden');
      } catch (error) {
        showError(errorPopup, error.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    });
  };

  title.addEventListener('click', () => {
    if (authContainer.classList.contains('show')) {
      authContainer.classList.remove('show');
      authContainer.classList.add('hidden');
    } else {
      authContainer.classList.remove('hidden');
      authContainer.classList.add('show');
    }
  });

  authContainer.addEventListener('click', (e) => {
    if (e.target === authContainer) {
      authContainer.classList.remove('show');
      authContainer.classList.add('hidden');
    }
  });

  auth.onAuthStateChanged((user) => {
    if (user) {
      title.classList.add('admin-mode');
    } else {
      title.classList.remove('admin-mode');
    }
    updateAuthUI(user);
    authContainer.classList.remove('show');
    authContainer.classList.add('hidden');
  });

  updateAuthUI(auth.currentUser);
}
