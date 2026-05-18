/**
 * AI Chat Widget
 *
 * A floating chat button that opens a mini-chat interface.
 * Users can ask questions about the developer and get AI-powered answers.
 * Demonstrates: OpenAI API integration, streaming UX, error handling.
 */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_API_ENDPOINT = '/api/chat';

/**
 * Creates and injects the chat widget DOM elements into the page.
 */
function createChatDOM(): {
  toggle: HTMLButtonElement;
  panel: HTMLDivElement;
  messages: HTMLDivElement;
  input: HTMLInputElement;
  sendBtn: HTMLButtonElement;
} {
  // Toggle button (floating)
  const toggle = document.createElement('button');
  toggle.className = 'chat-widget__toggle';
  toggle.setAttribute('aria-label', 'Открыть AI-ассистент');
  toggle.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  `;

  // Chat panel
  const panel = document.createElement('div');
  panel.className = 'chat-widget__panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="chat-widget__header">
      <span class="chat-widget__title">🤖 AI-ассистент</span>
      <button class="chat-widget__close" aria-label="Закрыть чат">&times;</button>
    </div>
    <div class="chat-widget__messages"></div>
    <div class="chat-widget__input-row">
      <input type="text" class="chat-widget__input" placeholder="Спросите обо мне..." maxlength="500" />
      <button class="chat-widget__send" aria-label="Отправить">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  const messages = panel.querySelector('.chat-widget__messages') as HTMLDivElement;
  const input = panel.querySelector('.chat-widget__input') as HTMLInputElement;
  const sendBtn = panel.querySelector('.chat-widget__send') as HTMLButtonElement;
  const closeBtn = panel.querySelector('.chat-widget__close') as HTMLButtonElement;

  // Add welcome message
  appendMessage(messages, {
    role: 'assistant',
    content: 'Привет! Я AI-ассистент Владислава. Спросите что-нибудь о его опыте, стеке или проектах.',
  });

  // Toggle panel visibility
  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('chat-widget__panel--open');
    panel.setAttribute('aria-hidden', String(!isOpen));
    toggle.classList.toggle('chat-widget__toggle--hidden', isOpen);
    if (isOpen) input.focus();
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('chat-widget__panel--open');
    panel.setAttribute('aria-hidden', 'true');
    toggle.classList.remove('chat-widget__toggle--hidden');
  });

  return { toggle, panel, messages, input, sendBtn };
}

/**
 * Appends a message bubble to the chat messages container.
 */
function appendMessage(container: HTMLDivElement, msg: ChatMessage): HTMLDivElement {
  const bubble = document.createElement('div');
  bubble.className = `chat-widget__bubble chat-widget__bubble--${msg.role}`;
  bubble.textContent = msg.content;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  return bubble;
}

/**
 * Sends a message to the AI API and displays the response.
 */
async function sendMessage(
  message: string,
  messagesContainer: HTMLDivElement,
  input: HTMLInputElement,
  sendBtn: HTMLButtonElement,
): Promise<void> {
  // Show user message
  appendMessage(messagesContainer, { role: 'user', content: message });
  input.value = '';
  input.disabled = true;
  sendBtn.disabled = true;

  // Show typing indicator
  const typingBubble = appendMessage(messagesContainer, { role: 'assistant', content: '...' });
  typingBubble.classList.add('chat-widget__bubble--typing');

  try {
    const response = await fetch(CHAT_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Remove typing indicator
    typingBubble.remove();

    if (response.ok && data.reply) {
      appendMessage(messagesContainer, { role: 'assistant', content: data.reply });
    } else {
      appendMessage(messagesContainer, {
        role: 'assistant',
        content: data.error || 'Не удалось получить ответ. Попробуйте позже.',
      });
    }
  } catch {
    typingBubble.remove();
    appendMessage(messagesContainer, {
      role: 'assistant',
      content: 'Ошибка сети. Проверьте подключение.',
    });
  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

/**
 * Initializes the AI chat widget.
 */
export function initChatWidget(): void {
  const { messages, input, sendBtn } = createChatDOM();

  const handleSend = () => {
    const text = input.value.trim();
    if (!text) return;
    sendMessage(text, messages, input, sendBtn);
  };

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
}
