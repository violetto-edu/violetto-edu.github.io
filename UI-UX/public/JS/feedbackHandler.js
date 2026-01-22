import { emailConfig } from './config.js';

export function feedbackHandler() {
  // Initialize EmailJS
  emailjs.init(emailConfig.PUBLIC_KEY);

  const modal = document.getElementById('feedback-modal');
  const trigger = document.getElementById('feedback-trigger');
  const closeBtn = document.querySelector('#close-modal');
  const feedbackForm = document.getElementById('feedback-form');
  const feedbackSubmit = feedbackForm.querySelector('.feedback-submit-btn');

  // Open modal
  trigger.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  // Close modal
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Handle form submission
  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    feedbackSubmit.disabled = true;
    feedbackSubmit.classList.add('loading');
    feedbackSubmit.textContent = 'Sending...';

    try {
      const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };

      await emailjs.send(
        emailConfig.SERVICE_ID,
        emailConfig.TEMPLATE_ID,
        templateParams
      );

      showMessage('Message sent successfully!', 'success');
      feedbackForm.reset();
    } catch (error) {
      console.error('Error:', error);
      showMessage('Failed to send message. Please try again.', 'error');
    } finally {
      feedbackSubmit.disabled = false;
      feedbackSubmit.classList.remove('loading');
      feedbackSubmit.textContent = 'Send Feedback';
    }
  });
}

function showMessage(text, type) {
  const existingMessage = document.querySelector('.feedback-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  const message = document.createElement('div');
  message.className = `feedback-message ${type}`;
  message.textContent = text;

  const form = document.getElementById('feedback-form');
  form.appendChild(message);

  // Force reflow
  message.offsetHeight;
  message.classList.add('show');

  // Remove message after 5 seconds
  setTimeout(() => {
    message.classList.remove('show');
    setTimeout(() => message.remove(), 1000);
  }, 5000);
}
