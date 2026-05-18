import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initNavigation, NavigationConfig } from '../../src/scripts/navigation';

const defaultConfig: NavigationConfig = {
  navSelector: '.nav',
  linkSelector: '.nav__link',
  sectionSelector: 'section[id]',
  activeClass: 'nav__link--active',
  scrollOffset: 0,
};

/**
 * Sets up a minimal DOM structure matching the portfolio navigation and sections.
 */
function setupDOM(): void {
  document.body.innerHTML = `
    <header class="header">
      <nav class="nav">
        <ul class="nav__list">
          <li class="nav__item"><a href="#about" class="nav__link">Обо мне</a></li>
          <li class="nav__item"><a href="#approach" class="nav__link">Подход</a></li>
          <li class="nav__item"><a href="#cases" class="nav__link">Кейсы</a></li>
          <li class="nav__item"><a href="#contact" class="nav__link">Контакты</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <section id="hero" class="hero"><h1>Hero</h1></section>
      <section id="about" class="about"><h2>About</h2></section>
      <section id="approach" class="approach"><h2>Approach</h2></section>
      <section id="cases" class="cases"><h2>Cases</h2></section>
      <section id="contact" class="contact"><h2>Contact</h2></section>
    </main>
  `;
}

// Mock IntersectionObserver for jsdom
let observerCallback: IntersectionObserverCallback;
let observedElements: Element[] = [];

class MockIntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  readonly scrollMargin: string = '';

  constructor(callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
    observerCallback = callback;
  }

  observe(target: Element): void {
    observedElements.push(target);
  }

  unobserve(_target: Element): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

function createMockEntry(target: Element, isIntersecting: boolean): IntersectionObserverEntry {
  return {
    isIntersecting,
    target,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    time: Date.now(),
  };
}

describe('navigation.ts', () => {
  beforeEach(() => {
    setupDOM();
    observedElements = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  describe('initNavigation', () => {
    it('does nothing when no nav links are found', () => {
      document.body.innerHTML = '<main><section id="about"></section></main>';
      // Should not throw
      initNavigation(defaultConfig);
      expect(observedElements).toHaveLength(0);
    });

    it('does nothing when no sections are found', () => {
      document.body.innerHTML = '<a href="#about" class="nav__link">About</a>';
      initNavigation(defaultConfig);
      expect(observedElements).toHaveLength(0);
    });

    it('observes all sections matching the sectionSelector', () => {
      initNavigation(defaultConfig);
      // 5 sections: hero, about, approach, cases, contact
      expect(observedElements).toHaveLength(5);
    });

    it('prevents default on nav link click', () => {
      // Mock scrollIntoView since jsdom doesn't support it
      const sections = document.querySelectorAll<HTMLElement>('section[id]');
      sections.forEach((section) => {
        section.scrollIntoView = vi.fn();
      });

      initNavigation(defaultConfig);
      const link = document.querySelector<HTMLAnchorElement>('.nav__link[href="#about"]')!;
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const prevented = !link.dispatchEvent(event);
      expect(prevented).toBe(true);
    });

    it('calls scrollIntoView on the target section when a link is clicked', () => {
      initNavigation(defaultConfig);
      const targetSection = document.getElementById('about')!;
      targetSection.scrollIntoView = vi.fn();

      const link = document.querySelector<HTMLAnchorElement>('.nav__link[href="#about"]')!;
      link.click();

      expect(targetSection.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('does not throw when clicking a link with no matching section', () => {
      const link = document.querySelector<HTMLAnchorElement>('.nav__link[href="#about"]')!;
      link.setAttribute('href', '#nonexistent');
      initNavigation(defaultConfig);
      // Should not throw
      link.click();
    });
  });

  describe('Intersection Observer — active section highlighting', () => {
    it('adds active class to the link matching the intersecting section', () => {
      initNavigation(defaultConfig);

      const aboutSection = document.getElementById('about')!;
      // Simulate intersection
      observerCallback(
        [createMockEntry(aboutSection, true)],
        {} as IntersectionObserver
      );

      const aboutLink = document.querySelector<HTMLAnchorElement>('.nav__link[href="#about"]')!;
      expect(aboutLink.classList.contains('nav__link--active')).toBe(true);
    });

    it('removes active class from all other links when a new section intersects', () => {
      initNavigation(defaultConfig);

      const aboutLink = document.querySelector<HTMLAnchorElement>('.nav__link[href="#about"]')!;
      aboutLink.classList.add('nav__link--active');

      const approachSection = document.getElementById('approach')!;
      observerCallback(
        [createMockEntry(approachSection, true)],
        {} as IntersectionObserver
      );

      expect(aboutLink.classList.contains('nav__link--active')).toBe(false);
      const approachLink = document.querySelector<HTMLAnchorElement>('.nav__link[href="#approach"]')!;
      expect(approachLink.classList.contains('nav__link--active')).toBe(true);
    });

    it('does not add active class when entry is not intersecting', () => {
      initNavigation(defaultConfig);

      const aboutSection = document.getElementById('about')!;
      observerCallback(
        [createMockEntry(aboutSection, false)],
        {} as IntersectionObserver
      );

      const aboutLink = document.querySelector<HTMLAnchorElement>('.nav__link[href="#about"]')!;
      expect(aboutLink.classList.contains('nav__link--active')).toBe(false);
    });

    it('handles section with no matching nav link gracefully', () => {
      initNavigation(defaultConfig);

      const heroSection = document.getElementById('hero')!;
      // hero has no nav link — should not throw
      observerCallback(
        [createMockEntry(heroSection, true)],
        {} as IntersectionObserver
      );

      // All links should have active class removed
      const links = document.querySelectorAll('.nav__link');
      links.forEach((link) => {
        expect(link.classList.contains('nav__link--active')).toBe(false);
      });
    });
  });
});
