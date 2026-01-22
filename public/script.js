// Apps data with Bootstrap Icons
const apps = [
  {
    link: 'UI-UX/',
    icon: 'bi-palette',
    name: 'UI/UX Tutorials',
    description: 'A Easy to understand UI/UX design tutorials with some resources'
  },
  {
    link: 'Gen-AI/',
    icon: 'bi-cpu',
    name: 'Generative AI Lab',
    description: 'Learn Genarative AI and its applications (based on VTU subject)'
  },
  {
    link: 'ML/',
    icon: 'bi-diagram-3',
    name: 'Machine Learning Lab',
    description: 'Get Machine Learning Lab Resources (based on VTU subject)'
  },
  {
    link: 'SGPA-Calculator/',
    icon: 'bi-calculator',
    name: 'SGPA Calculator',
    description: 'Calculate Your SGPA or CGPA Easily (based on VTU 2021 scheme)'
  }
];

// Initialize apps when page loads
document.addEventListener('DOMContentLoaded', function() {
  const appsGrid = document.getElementById('apps-grid');

  if (!appsGrid) return;

  apps.forEach(function(app) {
    const appItem = document.createElement('a');
    appItem.className = 'app-item';
    appItem.href = app.link;

    appItem.innerHTML = `
      <div class="app-icon">
        <i class="bi ${app.icon}"></i>
      </div>
      <h3 class="app-title">${app.name}</h3>
      <p class="app-description">${app.description}</p>
    `;

    appsGrid.appendChild(appItem);
  });
});
