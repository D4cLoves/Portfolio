import './styles/main.scss';
import { initForm } from './scripts/form';
import { initModals } from './scripts/modals';
import { initAnimations } from './scripts/animations';

function init() {
  // Initialize contact form with validation and submission handling
  initForm({
    formSelector: '.contact__form',
    apiEndpoint: '/api/contact',
  });

  // Initialize Project Modals
  initModals();

  // Initialize scroll-triggered entrance animations
  initAnimations({
    sectionSelector: '.hero, .stack, .projects, .approach, .contact',
    animateClass: 'animate-in',
    threshold: 0.1,
    duration: 500,
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
