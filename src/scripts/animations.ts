// ==========================================================================
// Animation Engine — Scroll-triggered entrance animations
// Uses Intersection Observer to add animation class when sections enter viewport.
// Graceful degradation: if IntersectionObserver is unavailable, all sections
// receive the animation class immediately (content is always visible).
// Validates: Requirements 9.1, 9.2, 9.3
// ==========================================================================

/**
 * Configuration for the animation engine.
 */
export interface AnimationConfig {
  /** CSS selector for sections to animate */
  sectionSelector: string;
  /** Class to add when section enters viewport */
  animateClass: string;
  /** Intersection threshold — fraction of element visible to trigger (0.1 = 10%) */
  threshold: number;
  /** Maximum animation duration in ms (enforced via CSS, documented here) */
  duration: number;
}

/**
 * Initializes scroll-triggered entrance animations on all elements
 * matching the configured selector.
 *
 * If IntersectionObserver is not supported by the browser, applies the
 * animation class to all sections immediately so content remains visible
 * (graceful degradation).
 */
export function initAnimations(config: AnimationConfig): void {
  const sections = document.querySelectorAll<HTMLElement>(config.sectionSelector);

  if (sections.length === 0) {
    return;
  }

  // Graceful degradation: if IntersectionObserver is not available,
  // show all sections immediately without animation.
  if (typeof IntersectionObserver === 'undefined') {
    sections.forEach((section) => {
      section.classList.add(config.animateClass);
    });
    return;
  }

  // Create observer that triggers when threshold percentage of element is visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(config.animateClass);
          // Unobserve after animating — each section animates only once
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: config.threshold,
      rootMargin: '0px',
    }
  );

  // Observe all target sections
  sections.forEach((section) => {
    observer.observe(section);
  });
}
