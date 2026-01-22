/**
 * Navigation Manager Module
 * Handles sidebar menu and footer scroll behavior
 */

export class NavigationManager {
  constructor() {
    this.setupSidebarMenu();
  }

  /**
   * Sidebar menu functionality
   */
  setupSidebarMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const closeSidebar = document.getElementById('closeSidebar');

    if (!menuToggle || !sidebarMenu) return;

    const openSidebar = () => {
      sidebarMenu.classList.remove('opacity-0', 'pointer-events-none');
      sidebarMenu.classList.add('opacity-100');
      const sidebarContent = sidebarMenu.querySelector('div');
      if (sidebarContent) {
        sidebarContent.classList.remove('translate-x-full');
        sidebarContent.classList.add('-translate-x-5');
      }
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    };

    const closeSidebarMenu = () => {
      const sidebarContent = sidebarMenu.querySelector('div');
      if (sidebarContent) {
        sidebarContent.classList.remove('-translate-x-5');
        sidebarContent.classList.add('translate-x-full');
      }

      // Wait for animation, then hide overlay
      setTimeout(() => {
        sidebarMenu.classList.remove('opacity-100');
        sidebarMenu.classList.add('opacity-0', 'pointer-events-none');
        // Restore body scroll
        document.body.style.overflow = '';
      }, 300);
    };

    // Toggle sidebar
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      openSidebar();
    });

    // Close sidebar
    if (closeSidebar) {
      closeSidebar.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSidebarMenu();
      });
    }

    // Close on background click
    sidebarMenu.addEventListener('click', (e) => {
      if (e.target === sidebarMenu) {
        closeSidebarMenu();
      }
    });

    // Prevent clicks inside sidebar from closing it
    const sidebarContent = sidebarMenu.querySelector('div');
    if (sidebarContent) {
      sidebarContent.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !sidebarMenu.classList.contains('opacity-0')) {
        closeSidebarMenu();
      }
    });
  }
}
