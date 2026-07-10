export interface IProjectCase {
  id: string;
  title: string;
  category: 'commercial' | 'pet';
  stack: string[];
  commercialPeriod?: string;
  role?: string;
  achievements: string[];
  architectureFeatures?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

const projectsData: Record<string, IProjectCase> = {
  lookmy: {
    id: 'lookmy',
    title: 'LookMy',
    category: 'commercial',
    stack: ['C#', 'ASP.NET Core', 'React', 'TypeScript', 'PostgreSQL', 'Git'],
    commercialPeriod: 'Октябрь 2024 — Сентябрь 2025 (1 год)',
    role: 'Fullstack-разработчик',
    achievements: [
      'Разработал и интегрировал модуль полнотекстового поиска по заголовкам и содержимому страниц на бэкенде с проектированием оптимальных индексов в PostgreSQL.',
      'Провел глубокий редизайн и унификацию 5 устаревших легаси UI-модулей конструктора, переведя их на современную связку React + TypeScript под единые стандарты интерфейса.',
      'Локализовал и устранил критический баг в визуальном редакторе, решив проблему некорректного реактивного обновления и асинхронной загрузки данных без перезагрузки страницы.',
      'Самостоятельно вел продуктовые фичи по методологии End-to-End: от обсуждения бизнес-требований и написания API до верстки, тестирования и релиза.'
    ],
  },
  momentum: {
    id: 'momentum',
    title: 'Momentum',
    category: 'pet',
    stack: ['React 19', 'TypeScript', 'ASP.NET Core', 'PostgreSQL', 'Redis', 'Docker Compose', 'JWT'],
    achievements: [],
    architectureFeatures: [
      'Проект построен по принципам Clean Architecture с разделением на слои: Domain, Application, Infrastructure и Shared Kernel.',
      'Реализована отказоустойчивая JWT-авторизация и сложная бэкенд-логика ежедневных стриков и распределения времени.',
      'Покрыл ключевую бизнес-логику и эндпоинты слоем интеграционных тестов (Integration Tests) для гарантии стабильности системы.',
      'Инфраструктура полностью контейнеризирована через Docker Compose для быстрого локального развертывания.'
    ],
    githubUrl: 'https://github.com/D4cLoves',
  },
  medicare: {
    id: 'medicare',
    title: 'MediCare Management System',
    category: 'pet',
    stack: ['ASP.NET Core 9', 'React 19', 'TypeScript', 'EF Core', 'SQLite'],
    achievements: [],
    architectureFeatures: [
      'Применение паттернов Domain-Driven Design (DDD). Использование Domain Models и Value Objects для изоляции бизнес-логики от инфраструктуры.',
      'Реализовано чистое REST API, полностью задокументированное через Swagger.',
      'Разработано отзывчивое клиентское приложение на React с жесткой типизацией на TypeScript.',
      'Настроена автоматическая генерация тестовых данных (Data Seeding) для быстрой демонстрации работы приложения.'
    ],
    githubUrl: 'https://github.com/D4cLoves',
  },
  sakurachess: {
    id: 'sakurachess',
    title: 'Sakura Chess',
    category: 'pet',
    stack: ['C#', '.NET 8', 'WPF', 'Material Design', 'Lc0 Engine'],
    achievements: [],
    architectureFeatures: [
      'Разработка десктопного интерфейса на базе WPF с применением паттерна MVVM и стилизации под Material Design.',
      'Интеграция нейросетевого шахматного движка Lc0 через CLI и управление асинхронными потоками данных в реальном времени.',
      'Реализована полноценная шахматная логика, поддержка режимов контроля времени (таймеры) и навигация по истории ходов.',
      'Проект упакован в полноценный установщик (Installer) для операционной системы Windows.'
    ],
    githubUrl: 'https://github.com/D4cLoves',
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

    // Build content
    let contentHtml = `
      <div class="portfolio-modal__header">
        <h3 class="portfolio-modal__title">${data.title}</h3>
        ${data.role ? `<p class="portfolio-modal__subtitle">${data.role} | ${data.commercialPeriod}</p>` : ''}
      </div>
      <div class="portfolio-modal__stack">
        ${data.stack.map(tech => `<span class="portfolio-modal__tag">${tech}</span>`).join('')}
      </div>
    `;

    if (data.achievements) {
      contentHtml += `
        <div class="portfolio-modal__section">
          <h4 class="portfolio-modal__section-title">Оцифрованные задачи и достижения:</h4>
          <ul class="portfolio-modal__list">
            ${data.achievements.map(item => `<li class="portfolio-modal__list-item">${item}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    if (data.architectureFeatures) {
      contentHtml += `
        <div class="portfolio-modal__section">
          <h4 class="portfolio-modal__section-title">Архитектурные особенности:</h4>
          <ul class="portfolio-modal__list">
            ${data.architectureFeatures.map(item => `<li class="portfolio-modal__list-item">${item}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    if (data.githubUrl || data.liveUrl) {
      contentHtml += `
        <div class="portfolio-modal__links">
          ${data.githubUrl ? `<a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="portfolio-modal__link">Код на GitHub</a>` : ''}
          ${data.liveUrl ? `<a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="portfolio-modal__link">Live Demo</a>` : ''}
        </div>
      `;
    }

    modalContent.innerHTML = contentHtml;

    // Show modal
    modal.classList.add('portfolio-modal--open');
    document.body.classList.add('body-lock');
    modal.setAttribute('aria-hidden', 'false');
    appContent.setAttribute('aria-hidden', 'true');

    // Focus Trap Setup
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
    
    // Clean up listener on close
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
