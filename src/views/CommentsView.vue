<template>
    <div class="comments">
      <div class="page-start">
        <div class="header-content">
          <h1 class="page-title">
            Comments and
            <span class="brand-gradient">Feedback</span>
          </h1>
          <p class="page-description">
            Share your thoughts, suggestions, and ideas with us
          </p>
        </div>
      </div>

      <div class="comments-content">
        <div class="container">
          <section class="feedback-section">
            <div class="feedback-grid">
              <div class="feedback-card telegram" @click="openTelegram">
                <div class="feedback-icon">
                  <font-awesome-icon :icon="['fab', 'telegram-plane']" />
                </div>
                <h3 class="feedback-title">Telegram Feedback</h3>
                <p class="feedback-description">
                  Get in touch with us directly through Telegram for quick responses
                </p>
                <div class="feedback-arrow">
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </div>
              </div>

              <div class="feedback-card form" @click="openForm">
                <div class="feedback-icon">
                  <font-awesome-icon :icon="['fas', 'lightbulb']" />
                </div>
                <h3 class="feedback-title">Website Ideas</h3>
                <p class="feedback-description">
                  Submit your suggestions and ideas for website improvements
                </p>
                <div class="feedback-arrow">
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </div>
              </div>
            </div>
          </section>

          <section class="comments-section">
            <div class="comments-header">
              <h2 class="section-title">
                <font-awesome-icon :icon="['fas', 'comments']" />
                Comments
              </h2>
              <p class="section-description">
                Join the conversation and share your thoughts below
              </p>
            </div>

            <div class="comments-container" ref="commentsContainer">
              </div>
          </section>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'

  const commentsContainer = ref<HTMLElement | null>(null)
  let prefersColorSchemeQuery: MediaQueryList | null = null; // To store the media query listener

  const openTelegram = () => {
    window.open('https://t.me/MEOW_MUR920', '_blank')
  }

  const openForm = () => {
    window.open('https://forms.yandex.ru/u/6818e4e8f47e73bbee8245db/', '_blank')
  }

  const getGiscusTheme = (isDark: boolean) => {
    return isDark ? 'dark_dimmed' : 'light_protanopia'
  }

  const loadGiscus = () => {
    if (!commentsContainer.value) return

    // Clear existing Giscus if any (important for theme changes)
    commentsContainer.value.innerHTML = '';

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'Morunka/morunka.github.io')
    script.setAttribute('data-repo-id', 'R_kgDOOFniEQ')
    script.setAttribute('data-category', 'Announcements')
    script.setAttribute('data-category-id', 'DIC_kwDOOFniEc4CqG8V')
    script.setAttribute('data-mapping', 'title')
    script.setAttribute('data-strict', '1')
    script.setAttribute('data-reactions-enabled', '0')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')

    // Determine the theme based on user's preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    script.setAttribute('data-theme', getGiscusTheme(isDark));

    script.setAttribute('data-lang', 'en')
    script.setAttribute('data-loading', 'lazy')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    commentsContainer.value.appendChild(script)
  }

  // Listener for color scheme changes
  const handleColorSchemeChange = (_event: MediaQueryListEvent) => {
    // When the color scheme changes, reload Giscus to apply the new theme
    loadGiscus();
  };

  onMounted(async () => {
    await nextTick()

    // Initialize the media query listener
    prefersColorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // Add the listener for changes
    prefersColorSchemeQuery.addEventListener('change', handleColorSchemeChange);

    // Initial load of Giscus
    setTimeout(loadGiscus, 500) // Small delay for smooth animation
  })

  onUnmounted(() => {
    if (prefersColorSchemeQuery) {
      prefersColorSchemeQuery.removeEventListener('change', handleColorSchemeChange);
    }
  })
  </script>

  <style scoped lang="scss">
  .comments {
    position: relative;
    min-height: calc(100vh - 200px);
    overflow: hidden;
  }

  // Page Header - matches home page animation pattern
  .page-start {
    padding: 4rem 0 2rem;
    text-align: center;
    animation: fadeInUp 0.8s ease-out;

    @media (max-width: 768px) {
      padding: 2rem 0 1rem;
    }
  }

  .header-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .page-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;

    .brand-gradient {
      background: linear-gradient(135deg, #646cff, #535bf2);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 2s ease-in-out infinite alternate;
    }
  }

  .page-description {
    font-size: clamp(1rem, 2.5vw, 1.125rem);
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    line-height: 1.6;

    @media (prefers-color-scheme: light) {
      color: rgba(0, 0, 0, 0.7);
    }
  }

  // Main Content - matches home page animation pattern
  .comments-content {
    position: relative;
    z-index: 1;
    animation: fadeInUp 0.8s ease-out;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  // Feedback Section
  .feedback-section {
    padding: 2rem 0 4rem;

    @media (max-width: 768px) {
      padding: 1rem 0 2rem;
    }
  }

  .feedback-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .feedback-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.5s ease;
    }

    &:hover {
      transform: translateY(-5px);
      border-color: rgba(100, 108, 255, 0.3);
      box-shadow: 0 10px 30px rgba(100, 108, 255, 0.2);

      &::before {
        left: 100%;
      }

      .feedback-arrow {
        transform: translateX(5px);
      }
    }

    &.telegram:hover {
      border-color: rgba(0, 136, 204, 0.3);
      box-shadow: 0 10px 30px rgba(0, 136, 204, 0.2);
    }

    @media (prefers-color-scheme: light) {
      background: rgba(255, 255, 255, 0.8);
      border-color: rgba(0, 0, 0, 0.1);

      &:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }
    }

    @media (max-width: 768px) {
      padding: 1.5rem;
    }
  }

  .feedback-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;

    .telegram & {
      color: #0088cc;
    }

    .form & {
      color: #fbbf24;
    }

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  .feedback-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: rgba(255, 255, 255, 0.95);

    @media (prefers-color-scheme: light) {
      color: rgba(0, 0, 0, 0.9);
    }
  }

  .feedback-description {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    margin-bottom: 1rem;

    @media (prefers-color-scheme: light) {
      color: rgba(0, 0, 0, 0.6);
    }
  }

  .feedback-arrow {
    display: inline-flex;
    color: #646cff;
    font-size: 1.125rem;
    transition: transform 0.3s ease;
  }

  // Comments Section
  .comments-section {
    padding: 2rem 0;

    @media (max-width: 768px) {
      padding: 1rem 0;
    }
  }

  .comments-header {
    text-align: center;
    margin-bottom: 3rem;

    @media (max-width: 768px) {
      margin-bottom: 2rem;
    }
  }

  .section-title {
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;

    svg {
      color: #646cff;
    }

    @media (max-width: 640px) {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .section-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    margin: 0;

    @media (prefers-color-scheme: light) {
      color: rgba(0, 0, 0, 0.6);
    }
  }

  .comments-container {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    min-height: 400px;

    @media (prefers-color-scheme: light) {
      background: rgba(0, 0, 0, 0.02);
      border-color: rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      padding: 1rem;
      min-height: 300px;
    }
  }

  // Animations - consistent with home page
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shimmer {
    0% {
      background: linear-gradient(135deg, #646cff, #535bf2);
      -webkit-background-clip: text;
      background-clip: text;
    }
    100% {
      background: linear-gradient(135deg, #535bf2, #4c4ff7);
      -webkit-background-clip: text;
      background-clip: text;
    }
  }

  // Mobile optimizations
  @media (max-width: 768px) {
    .comments {
      min-height: calc(100vh - 150px);
    }
  }

  // Dark/Light theme adaptations
  @media (prefers-color-scheme: light) {
    .feedback-card {
      &.telegram:hover {
        border-color: rgba(0, 136, 204, 0.2);
        box-shadow: 0 10px 30px rgba(0, 136, 204, 0.1);
      }
    }
  }

  // Giscus theme integration
  :deep(.giscus) {
    .gsc-main {
      gap: 1rem;
    }

    .gsc-comments {
      background: transparent !important;
    }

    .gsc-comment-box {
      border-radius: 12px !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
  }
  </style>