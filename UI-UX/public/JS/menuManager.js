export function setupMenuAnimation() {
  const menuToggleButton = document.querySelector('#more-options-toggle');
  const menu = document.querySelector('.menu');
  const backButton = document.querySelector('#close-menu');
  const homeCard = document.querySelector('.card[href="/"]');
  const uiuxCard = document.querySelector('.card[href="UI-UX/"]');
  const genaiCard = document.querySelector('.card[href="Gen-AI/"]');
  const mlCard = document.querySelector('.card[href="ML/"]');

  if (homeCard) homeCard.classList.add('home-card', 'gradient-card');
  if (uiuxCard) uiuxCard.classList.add('uiux-card', 'gradient-card');
  if (genaiCard) genaiCard.classList.add('genai-card');
  if (mlCard) mlCard.classList.add('ml-card');

  // Toggle menu on mobile more button click
  if (menuToggleButton) {
    menuToggleButton.addEventListener('click', () => {
      menu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Close menu on back button click
  if (backButton) {
    backButton.addEventListener('click', () => {
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}
