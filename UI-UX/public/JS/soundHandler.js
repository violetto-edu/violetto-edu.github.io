// Sound state management
let soundEnabled = true;
let clickSound = null;

// Initialize sound settings from localStorage
function initSoundSettings() {
  const savedSoundState = localStorage.getItem('soundEnabled');
  if (savedSoundState !== null) {
    soundEnabled = JSON.parse(savedSoundState);
  }
  updateSoundToggleUI();
}

// Update the sound toggle button appearance
function updateSoundToggleUI() {
  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    const volumeHighIcon = soundToggle.querySelector('.bi-volume-up');
    const volumeXmarkIcon = soundToggle.querySelector('.bi-volume-mute');

    if (soundEnabled) {
      if (volumeHighIcon) volumeHighIcon.style.display = 'block';
      if (volumeXmarkIcon) volumeXmarkIcon.style.display = 'none';
      soundToggle.setAttribute('aria-label', 'Mute Sound');
    } else {
      if (volumeHighIcon) volumeHighIcon.style.display = 'none';
      if (volumeXmarkIcon) volumeXmarkIcon.style.display = 'block';
      soundToggle.setAttribute('aria-label', 'Unmute Sound');
    }
  }
}

// Toggle sound on/off
function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  updateSoundToggleUI();

  // Play a test sound when enabling
  if (soundEnabled && clickSound) {
    const testSound = clickSound.cloneNode();
    testSound.volume = 0.5;
    testSound.play().catch(() => {
      // Silently fail if audio can't be played
    });
  }
}

// Play click sound if enabled
function playClickSound() {
  if (soundEnabled && clickSound) {
    const soundClone = clickSound.cloneNode();
    soundClone.volume = 0.5;
    soundClone.play().catch(() => {
      // Silently fail if audio can't be played
    });
  }
}

export function setupSounds() {
  // Initialize sound settings
  initSoundSettings();

  // Expose playClickSound globally for modules that use stopPropagation
  window.playClickSound = playClickSound;

  // Create audio element for click sound
  clickSound = new Audio();
  clickSound.src = './public/assets/click.ogg';
  if (!clickSound.src) {
    console.error('Click sound not found');
    return;
  }
  clickSound.preload = 'auto';
  clickSound.volume = 0.5;

  // Setup sound toggle button
  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', toggleSound);
  }

  // Add click event listeners to all interactive elements
  document.addEventListener('click', (e) => {
    // Skip if the clicked element is the sound toggle itself
    if (e.target.closest('#sound-toggle')) {
      return;
    }

    if (
      e.target.closest('button') ||
      e.target.closest('.title') ||
      e.target.closest('.structure-item') ||
      e.target.closest('.structure-section') ||
      e.target.closest('.structure-subsection') ||
      (e.target.closest('a') &&
        e.target.closest('li') &&
        e.target.closest('ul') &&
        e.target.closest('#tutorial-list'))
    ) {
      playClickSound();
    }
  });
}
