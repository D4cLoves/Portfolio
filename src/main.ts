import './styles/main.scss';
import { initNavigation } from './scripts/navigation';
import { initAnimations } from './scripts/animations';
import { initForm } from './scripts/form';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation with smooth scroll and active section highlighting
  initNavigation({
    navSelector: '.nav',
    linkSelector: '.nav__link',
    sectionSelector: 'section[id]',
    activeClass: 'nav__link--active',
    scrollOffset: 60, // offset for fixed nav height
  });

  // Initialize scroll-triggered entrance animations
  initAnimations({
    sectionSelector: '.hero, .about, .approach, .cases, .contact',
    animateClass: 'animate-in',
    threshold: 0.1,
    duration: 500,
  });

  // Initialize contact form with validation and submission handling
  initForm({
    formSelector: '.contact__form',
    apiEndpoint: '/api/contact',
  });
});
