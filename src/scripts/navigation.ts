/**
 * Navigation module — handles smooth scrolling and active section highlighting.
 * Uses Intersection Observer to detect which section is currently in view
 * and toggles the active class on the corresponding nav link.
 */

export interface NavigationConfig {
  navSelector: string;
  linkSelector: string;
  sectionSelector: string;
  activeClass: string;
  scrollOffset: number;
}

/**
 * Initializes navigation behavior:
 * 1. Smooth scroll on nav link click
 * 2. Intersection Observer to highlight the active section link
 */
export function initNavigation(config: NavigationConfig): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(config.linkSelector);
  const sections = document.querySelectorAll<HTMLElement>(config.sectionSelector);

  if (!navLinks.length || !sections.length) return;

  // Attach click listeners for smooth scrolling
  navLinks.forEach((link) => {
    link.addEventListener('click', (event: Event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      if (!href) return;

      const targetId = href.replace('#', '');
      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Create Intersection Observer to detect active section
  const observerOptions: IntersectionObserverInit = {
    rootMargin: '-20% 0px -80% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;

        // Remove active class from all nav links
        navLinks.forEach((link) => {
          link.classList.remove(config.activeClass);
        });

        // Add active class to the matching nav link
        const activeLink = document.querySelector<HTMLAnchorElement>(
          `${config.linkSelector}[href="#${sectionId}"]`
        );
        if (activeLink) {
          activeLink.classList.add(config.activeClass);
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach((section) => {
    observer.observe(section);
  });
}
