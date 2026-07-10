import './styles/main.scss';
import { initForm } from './scripts/form';
import { initModals } from './scripts/modals';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize contact form with validation and submission handling
  initForm({
    formSelector: '.contact__form',
    apiEndpoint: '/api/contact',
  });

  // Initialize Project Modals
  initModals();
});
