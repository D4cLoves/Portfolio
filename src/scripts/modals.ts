export interface IProjectCase {
  id: string;
  title: string;
  type: 'commercial' | 'pet';
  badge: string;
  shortDescription: string;
  stack: string[];
  metrics: string[];
  engineeringTasks: string[];
  githubUrl?: string;
  liveUrl?: string;
  commercialMeta?: {
    role: string;
    period: string;
  };
}

const projectsData: Record<string, IProjectCase> = {
  'lookmy-commercial': {
    id: "lookmy-commercial",
    title: "LookMy (Платформа-конструктор сайтов)",
    type: "commercial",
    badge: "Коммерческий опыт",
    shortDescription: "Развитие и оптимизация fullstack-части крупного SaaS-конструктора сайтов в продуктовой команде. Закрытие задач уровня End-to-End.",
    stack: ["C#", "ASP.NET Core", "PostgreSQL", "React", "TypeScript", "JavaScript", "Docker", "Git"],
    commercialMeta: {
      role: "Fullstack-разработчик",
      period: "Октябрь 2024 — Сентябрь 2025 (1 год)"
    },
    metrics: [
      "Успешно переведены на современную UI-архитектуру 5 ключевых легаси-модулей управления.",
      "Локализован и устранен критический баг реактивного обновления данных в визуальном редакторе.",
      "Оптимизирована скорость поиска по внутреннему контенту за счет кастомных индексов в БД."
    ],
    engineeringTasks: [
      "Проектирование и интеграция модуля полнотекстового поиска по заголовкам и содержимому пользовательских страниц на стороне бэкенда с использованием возможностей PostgreSQL.",
      "Глубокий рефакторинг, редизайн и унификация устаревших UI-компонентов конструктора с переводом их на стек React + TypeScript под единую дизайн-систему приложения.",
      "Устранение архитектурной проблемы с асинхронным обновлением описаний модулей в визуальном редакторе, обеспечив стабильную реактивную загрузку данных без перезагрузки страниц.",
      "Самостоятельное сквозное (End-to-End) ведение продуктовых фич: от сбора и анализа бизнес-требований до проектирования схем данных, написания Web API, верстки и релиза.",
      "Настройка локального окружения и контейнеризации зависимостей сервиса с помощью Docker и Docker-compose."
    ]
  },
  'momentum-tracker': {
    id: "momentum-tracker",
    title: "Momentum — Платформа продуктивности",
    type: "pet",
    badge: "Личный проект",
    shortDescription: "SaaS-платформа для трекинга фокуса, сессий и персональной статистики с микросервисной архитектурой и JWT-авторизацией.",
    stack: ["React 19", "TypeScript", "Tailwind CSS", "ASP.NET Core", "PostgreSQL", "Redis", "Docker Compose", "JWT"],
    githubUrl: "https://github.com/D4cLoves",
    metrics: [
      "Архитектура полностью разделена по стандарту Clean Architecture.",
      "Обеспечена высокая отказоустойчивость сессий за счет кэширования токенов в Redis.",
      "Проект полностью контейнеризирован для мгновенного развертывания в любой среде."
    ],
    engineeringTasks: [
      "Реализация комплексной серверной бизнес-логики: трекинг фокус-сессий, вычисление ежедневных стриков (активности) и аналитическое распределение времени по проектам.",
      "Разработка защищенного механизма аутентификации и авторизации (Authentication Flow) на базе JWT (Access/Refresh tokens) со строгим контролем жизненного цикла сессий.",
      "Создание отзывчивого пользовательского интерфейса (Личный кабинет, графики статистики, таймеры) на базе React 19 с жесткой типизацией на TypeScript.",
      "Покрытие ключевых эндпоинтов и бизнес-логики слоем интеграционных тестов (Integration Tests) для предотвращения регрессий при масштабировании кода.",
      "Проектирование чистой слоистой архитектуры приложения с четким разделением на слои: Domain, Application, Infrastructure и Shared Kernel."
    ]
  },
  'medicare-system': {
    id: "medicare-system",
    title: "MediCare Management System",
    type: "pet",
    badge: "Личный проект",
    shortDescription: "Медицинская учетная система корпоративного уровня, демонстрирующая применение паттернов DDD и проектирование чистых REST API.",
    stack: ["ASP.NET Core 9", "React 19", "TypeScript", "Entity Framework Core", "SQLite", "Swagger"],
    githubUrl: "https://github.com/D4cLoves/MediCareManagementSystem",
    metrics: [
      "100% изоляция доменной логики от инфраструктурных зависимостей.",
      "Интерфейс спроектирован как строго типизированное SPA-приложение.",
      "REST API полностью задокументировано в соответствии со стандартами OpenAPI."
    ],
    engineeringTasks: [
      "Разработка архитектуры по методологии Domain-Driven Design (DDD). Использование Domain Models и Value Objects для инкапсуляции бизнес-правил медицинской системы.",
      "Реализация гибкого слоя работы с базой данных через Entity Framework Core, настройка механизмов автоматической генерации тестовых данных (Data Seeding).",
      "Проектирование публичного REST API, включающего модули управления медицинскими картами пациентов и умный поиск практикующих врачей по узким специализациям.",
      "Интеграция и интерактивная визуализация данных на клиенте с использованием экосистемы React 19 и TypeScript."
    ]
  },
  'sakura-chess': {
    id: "sakura-chess",
    title: "Sakura Chess (Шахматы с AI)",
    type: "pet",
    badge: "Личный проект",
    shortDescription: "Высокопроизводительное десктопное шахматное приложение со встроенной нейросетевой интеграцией ИИ-движка.",
    stack: ["C#", ".NET 8", "WPF", "Material Design", "Lc0 Engine", "Asynchronous Streams"],
    githubUrl: "https://github.com/D4cLoves/SacuraChess",
    metrics: [
      "Обеспечен асинхронный UI-поток, исключающий фризы интерфейса при расчетах ИИ.",
      "Реализована поддержка классических шахмат и режима Chess960 (Шахматы Фишера).",
      "Проект полностью упакован в дистрибутив для конечного пользователя Windows."
    ],
    engineeringTasks: [
      "Разработка настольного интерфейса на платформе WPF с применением паттерна MVVM (Model-View-ViewModel) и стилизацией под гайдлайны Material Design.",
      "Интеграция нейросетевого шахматного движка Lc0 (Leela Chess Zero) через CLI‑интерфейс с организацией асинхронной обработки потоков данных в реальном времени.",
      "Реализация движка внутренней шахматной логики, валидации корректности ходов, контроля лимитов времени (таймеры) и навигации по истории сыгранной партии.",
      "Сборка, конфигурирование зависимостей и упаковка готового продукта в полноценный Windows-установщик (Installer)."
    ]
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
      <div class="modal-case__category">${data.badge}</div>
      
      <div class="modal-case__tags">
        ${data.stack.map(tech => `<span class="tag tag--accent">${tech}</span>`).join('')}
      </div>

      <p class="modal-case__desc">${data.shortDescription}</p>
    `;

    if (data.metrics && data.metrics.length > 0) {
      contentHtml += `
        <h4 class="modal-case__section-title">Ключевые метрики / Результаты:</h4>
        <ul class="modal-case__achievements">
          ${data.metrics.map(item => `<li>${item}</li>`).join('')}
        </ul>
      `;
    }

    if (data.engineeringTasks && data.engineeringTasks.length > 0) {
      contentHtml += `
        <h4 class="modal-case__section-title">Инженерные задачи и архитектура:</h4>
        <ul class="modal-case__achievements">
          ${data.engineeringTasks.map(item => `<li>${item}</li>`).join('')}
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
