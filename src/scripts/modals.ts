export interface IProjectCase {
  id: string;
  title: string;
  category: 'commercial' | 'pet';
  stack: string[];
  description: string;
  achievements: string[];
  architectureFeatures?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

const projectsData: Record<string, IProjectCase> = {
  'poll-system': {
    id: 'poll-system',
    title: 'Poll System',
    category: 'pet',
    stack: ['PHP 8.2', 'Symfony 7', 'PostgreSQL', 'Redis', 'Docker'],
    description: 'Масштабируемая система создания и прохождения опросов с развитой ролевой моделью и REST API.',
    achievements: [
      'Спроектировал реляционную схему базы данных для хранения сложных зависимостей между вопросами.',
      'Реализовал систему кэширования результатов опросов с использованием Redis для снижения нагрузки.',
      'Настроил CI/CD для автоматического линтинга и прогона PHPUnit тестов.'
    ],
    architectureFeatures: [
      'Использование Symfony Messenger для асинхронной обработки тяжелых задач (например, генерация отчетов).',
      'Строгое соблюдение SOLID и принципов чистой архитектуры (выделение Use Cases).'
    ],
    githubUrl: 'https://github.com/D4cLoves'
  },
  'ege-simulator': {
    id: 'ege-simulator',
    title: 'EGE Simulator',
    category: 'pet',
    stack: ['React', 'Redux Toolkit', 'TypeScript', 'SCSS'],
    description: 'Игровая платформа для подготовки к ЕГЭ. Интерактивные тесты, таймеры и система рейтингов.',
    achievements: [
      'Разработал сложный UI с множеством интерактивных элементов (drag-and-drop, таймеры, графики прогресса).',
      'Оптимизировал рендеринг списков с помощью мемоизации, что повысило производительность на слабых устройствах.',
      'Внедрил глобальное управление состоянием через Redux Toolkit.'
    ],
    architectureFeatures: [
      'Feature-Sliced Design (FSD) для организации структуры проекта.',
      'Кастомные хуки для инкапсуляции сложной логики (например, хук таймера экзамена).'
    ],
    githubUrl: 'https://github.com/D4cLoves'
  },
  'online-store': {
    id: 'online-store',
    title: 'E-Commerce Store',
    category: 'pet',
    stack: ['Vue 3', 'Vuex', 'TailwindCSS', 'Node.js'],
    description: 'Полноценный интернет-магазин с каталогом, корзиной и панелью администратора.',
    achievements: [
      'Реализовал корзину покупок с синхронизацией состояния между вкладками через LocalStorage.',
      'Разработал панель администратора для управления товарами и заказами.',
      'Интегрировал заглушку платежного шлюза для симуляции транзакций.'
    ],
    architectureFeatures: [
      'Использование Vue Composition API для переиспользования логики фильтрации товаров.',
      'Ленивая загрузка (Lazy Loading) компонентов и изображений для ускорения TTI.'
    ],
    githubUrl: 'https://github.com/D4cLoves'
  }
};

export function initModals() {
  const modal = document.getElementById('portfolio-modal');
  const modalContent = document.getElementById('portfolio-modal-content');
  const closeBtn = document.querySelector('.portfolio-modal__close-btn');
  const backdrop = document.querySelector('.portfolio-modal__backdrop');
  const projectCards = document.querySelectorAll('.project-card');
  const appContent = document.getElementById('app-content');

  if (!modal || !modalContent || !closeBtn || !backdrop || !appContent) return;

  let previouslyFocusedElement: HTMLElement | null = null;

  const openModal = (projectId: string) => {
    const data = projectsData[projectId];
    if (!data) return;

    previouslyFocusedElement = document.activeElement as HTMLElement;

    // Build content using new BEM classes
    let contentHtml = `
      <h3 class="modal-case__title">${data.title}</h3>
      <div class="modal-case__category">${data.category === 'pet' ? 'Пет-проект' : 'Коммерческий проект'}</div>
      
      <div class="modal-case__tags">
        ${data.stack.map(tech => `<span class="tag tag--accent">${tech}</span>`).join('')}
      </div>

      <p class="modal-case__desc">${data.description}</p>
    `;

    if (data.achievements && data.achievements.length > 0) {
      contentHtml += `
        <h4 class="modal-case__section-title">Ключевые достижения:</h4>
        <ul class="modal-case__achievements">
          ${data.achievements.map(item => `<li>${item}</li>`).join('')}
        </ul>
      `;
    }

    if (data.architectureFeatures && data.architectureFeatures.length > 0) {
      contentHtml += `
        <h4 class="modal-case__section-title">Архитектура и решения:</h4>
        <ul class="modal-case__achievements">
          ${data.architectureFeatures.map(item => `<li>${item}</li>`).join('')}
        </ul>
      `;
    }

    if (data.githubUrl || data.liveUrl) {
      contentHtml += `
        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          ${data.githubUrl ? `<a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--primary">GitHub Repository</a>` : ''}
          ${data.liveUrl ? `<a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--outline">Live Demo</a>` : ''}
        </div>
      `;
    }

    modalContent.innerHTML = contentHtml;

    // Show modal
    modal.classList.add('portfolio-modal--open');
    document.body.classList.add('body-lock');
    modal.setAttribute('aria-hidden', 'false');
    appContent.setAttribute('aria-hidden', 'true');

    setupFocusTrap(modal as HTMLElement);
  };

  const closeModal = () => {
    modal.classList.remove('portfolio-modal--open');
    document.body.classList.remove('body-lock');
    modal.setAttribute('aria-hidden', 'true');
    appContent.setAttribute('aria-hidden', 'false');
    
    setTimeout(() => {
      modalContent.innerHTML = '';
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    }, 300); // Wait for transition
  };

  const setupFocusTrap = (modalEl: HTMLElement) => {
    const focusableElements = modalEl.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0] as HTMLElement;
    const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    };

    modalEl.addEventListener('keydown', handleTab);
    
    const cleanup = () => {
      modalEl.removeEventListener('keydown', handleTab);
      closeBtn.removeEventListener('click', cleanup);
      backdrop.removeEventListener('click', cleanup);
    };

    closeBtn.addEventListener('click', cleanup);
    backdrop.addEventListener('click', cleanup);
  };

  // Event Listeners
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      if (projectId) openModal(projectId);
    });

    card.addEventListener('keydown', (e) => {
      const event = e as KeyboardEvent;
      if (event.key === 'Enter' || event.key === ' ') {
        e.preventDefault();
        const projectId = card.getAttribute('data-project-id');
        if (projectId) openModal(projectId);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('portfolio-modal--open')) {
      closeModal();
    }
  });
}
