<template>
  <div class="gallery">
    <!-- Page Header with Animation -->
    <section class="page-header animate-on-load">
      <div class="header-content">
        <h1 class="page-title">
          Media <span class="brand-gradient">Gallery</span>
        </h1>
        <p class="page-description">
          Browse our collection of images and screenshots from our projects.
        </p>
      </div>
    </section>

    <!-- Search Section -->
    <div class="filter-controls-container animate-on-load">
      <div class="search-container">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search images by name..."
          class="search-input"
          @input="onSearchInput"
          @keyup.enter="updateUrl"
          @touchstart="handleMobileSearchTouch"
        />
      </div>
    </div>

    <!-- Gallery Grid Section -->
    <section class="gallery-grid-section">
      <div v-if="isLoading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>Loading gallery items...</p>
      </div>
      
      <div v-else-if="error" class="error-section">
        <p>Failed to load gallery. Retrying...</p>
      </div>
      
      <div v-else-if="filteredGalleryItems.length > 0" class="gallery-grid-container">
        <div
          v-for="(item, index) in filteredGalleryItems"
          :key="item.name"
          class="gallery-card"
          @click="openModal(index)"
          @touchstart="handleGalleryCardTouchStart($event, index)"
          @touchmove="handleGalleryCardTouchMove($event)"
          @touchend="handleGalleryCardTouchEnd($event)"
        >
          <div class="gallery-image">
            <img
              :src="item.img"
              :alt="item.name"
              class="gallery-actual-image"
              loading="lazy"
              @load="handleImageLoad"
            />
          </div>
          <div class="gallery-info">
            <h3 class="gallery-title">{{ item.name }}</h3>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-results">
        <font-awesome-icon :icon="['fas', 'image']" />
        <h3>No images found.</h3>
        <p>Try adjusting your search query.</p>
      </div>
    </section>

    <!-- Image Modal -->
    <div 
      v-if="isModalOpen" 
      class="image-modal"
      @click.self="closeModal"
      @keydown.esc="closeModal"
      @keydown.left="goToPreviousImage"
      @keydown.right="goToNextImage"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      tabindex="0"
      ref="modalRef"
    >
      <div class="modal-overlay" @click="closeModal"></div>
      
      <button 
        v-if="filteredGalleryItems.length > 1" 
        class="modal-nav modal-prev" 
        aria-label="Previous image"
        @click="goToPreviousImage"
        :disabled="currentImageIndex === 0"
      >
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      
      <button 
        v-if="filteredGalleryItems.length > 1" 
        class="modal-nav modal-next" 
        aria-label="Next image"
        @click="goToNextImage"
        :disabled="currentImageIndex === filteredGalleryItems.length - 1"
      >
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
      
      <div class="modal-content">
        <img 
          :src="currentImage.img" 
          :alt="currentImage.name"
          class="modal-image"
          @click.stop
        />
        <div class="modal-image-name">
          {{ currentImage.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// --- Импорт изображений из папки assets/gallery/ ---
const galleryImages = import.meta.glob('@/assets/gallery/*.{png,jpg,jpeg,webp,svg}', { eager: true });

// Создаем массив объектов с изображениями
const galleryItems = ref<{ img: string; name: string }[]>([]);
const isLoading = ref(true);
const error = ref(false);
const route = useRoute();
const router = useRouter();
const searchQuery = ref('');

// --- Модальное окно для просмотра изображений ---
const isModalOpen = ref(false);
const currentImageIndex = ref(0);
const modalRef = ref<HTMLElement | null>(null);
const canCloseModal = ref(true); // Track if modal can be closed

// --- Touch handling for mobile navigation ---
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let lastTouchTime = 0;
const MIN_SWIPE_DISTANCE = 50;
const MAX_SWIPE_TIME = 300; // milliseconds
const TAP_THRESHOLD = 250; // milliseconds
const DOUBLE_TAP_INTERVAL = 300; // milliseconds
let isDoubleTapPending = false;
let doubleTapTimer: number | null = null;

// --- New variables for gallery card touch handling ---
let touchStartXForCard = 0;
let touchStartYForCard = 0;
let touchStartTimeForCard = 0;
let isScrolling = false;
const TAP_MOVE_THRESHOLD = 15; // pixels - increased slightly for better scrolling
const SCROLL_DETECT_THRESHOLD = 5; // pixels before we consider it scrolling

const currentImage = computed(() => {
  return filteredGalleryItems.value[currentImageIndex.value];
});

const openModal = (index: number) => {
  currentImageIndex.value = index;
  isModalOpen.value = true;
  canCloseModal.value = false; // Initially cannot close the modal
  
  // Allow closing after 1 second
  setTimeout(() => {
    canCloseModal.value = true;
  }, 1000);
  
  // Даем время на открытие модала перед фокусировкой
  nextTick(() => {
    if (modalRef.value) {
      modalRef.value.focus();
    }
  });
};

const closeModal = () => {
  // Don't close if it's too early
  if (!canCloseModal.value) return;
  
  isModalOpen.value = false;
  currentImageIndex.value = 0;
};

const goToPreviousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const goToNextImage = () => {
  if (currentImageIndex.value < filteredGalleryItems.value.length - 1) {
    currentImageIndex.value++;
  }
};

// --- Обработка клавиатуры ---
const handleKeyDown = (e: KeyboardEvent) => {
  if (!isModalOpen.value) return;
  
  switch (e.key) {
    case 'ArrowLeft':
      goToPreviousImage();
      break;
    case 'ArrowRight':
      goToNextImage();
      break;
    case 'Escape':
      closeModal();
      break;
  }
};

// --- Mobile Touch Handlers ---
const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
  lastTouchTime = Date.now();
};

const handleTouchMove = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
};

const handleTouchEnd = () => {
  const touchTime = Date.now() - lastTouchTime;
  const touchDistanceX = touchStartX - touchEndX;
  const touchDistanceY = touchStartY - touchEndY;
  
  // Проверяем, является ли это двойным нажатием
  if (touchTime < TAP_THRESHOLD) {
    if (isDoubleTapPending) {
      // Это действительно двойное нажатие
      isDoubleTapPending = false;
      if (doubleTapTimer) {
        clearTimeout(doubleTapTimer);
        doubleTapTimer = null;
      }
      // Здесь можно добавить обработку двойного нажатия (например, увеличение изображения)
    } else {
      // Это первое нажатие, устанавливаем таймер для проверки двойного нажатия
      isDoubleTapPending = true;
      if (doubleTapTimer) {
        clearTimeout(doubleTapTimer);
      }
      doubleTapTimer = window.setTimeout(() => {
        isDoubleTapPending = false;
        doubleTapTimer = null;
      }, DOUBLE_TAP_INTERVAL);
    }
    return;
  }
  
  // Проверяем, является ли это свайпом (горизонтальным)
  if (Math.abs(touchDistanceX) > Math.abs(touchDistanceY) && Math.abs(touchDistanceX) > MIN_SWIPE_DISTANCE) {
    if (touchDistanceX > 0) {
      // Свайп влево - следующее изображение
      goToNextImage();
    } else {
      // Свайп вправо - предыдущее изображение
      goToPreviousImage();
    }
  }
};

// Обработчик для карточек галереи (мобильные устройства)
const handleGalleryCardTouchStart = (e: TouchEvent, index: number) => {
  currentImageIndex.value = index;
  lastTouchTime = Date.now();
  // Store touch start position for tap/swipe detection
  touchStartXForCard = e.touches[0].clientX;
  touchStartYForCard = e.touches[0].clientY;
  touchStartTimeForCard = Date.now();
  isScrolling = false;
};

const handleGalleryCardTouchMove = (e: TouchEvent) => {
  // Calculate distance moved
  const touchEndX = e.touches[0].clientX;
  const touchEndY = e.touches[0].clientY;
  const distanceX = Math.abs(touchEndX - touchStartXForCard);
  const distanceY = Math.abs(touchEndY - touchStartYForCard);
  
  // If moved more than threshold, consider it scrolling
  if (distanceX > SCROLL_DETECT_THRESHOLD || distanceY > SCROLL_DETECT_THRESHOLD) {
    isScrolling = true;
  }
};

const handleGalleryCardTouchEnd = (e: TouchEvent) => {
  const touchTime = Date.now() - touchStartTimeForCard;
  
  // Only open modal if it's a short tap (not a swipe) and not scrolling
  if (touchTime < TAP_THRESHOLD && !isScrolling) {
    openModal(currentImageIndex.value);
  }
};

// Обработчик для поиска на мобильных устройствах
const handleMobileSearchTouch = () => {
  // Для мобильных устройств, при касании к полю поиска, прокручиваем к нему
  if (window.innerWidth <= 768) {
    const searchContainer = document.querySelector('.filter-controls-container');
    if (searchContainer) {
      searchContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

onMounted(() => {
  // Инициализация галереи
  const items: { img: string; name: string }[] = [];
  
  for (const key in galleryImages) {
    const fileName = key.split('/').pop() || '';
    const cleanName = fileName.split('.').slice(0, -1).join('.');
    
    // Используем .default для eager import
    const imageModule = galleryImages[key] as { default: string };
    
    items.push({
      img: imageModule.default,
      name: cleanName
    });
  }
  
  galleryItems.value = items;
  initializeFromUrl();
  isLoading.value = false;
  
  // Инициализируем анимацию загрузки
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, {
    threshold: 0.1
  });

  // Наблюдаем за всеми элементами с классом animate-on-load
  const animatedElements = document.querySelectorAll('.animate-on-load');
  animatedElements.forEach(el => observer.observe(el));
  
  // Добавляем обработчик клавиатуры
  window.addEventListener('keydown', handleKeyDown);
  
  // Для мобильных устройств добавляем обработку тач-событий
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    // Устанавливаем метатег для корректного отображения на мобильных устройствах
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }
  }
});

// --- Computed Properties ---
const filteredGalleryItems = computed(() => {
  if (!searchQuery.value) return galleryItems.value;
  
  const query = searchQuery.value.toLowerCase();
  return galleryItems.value.filter(item => 
    item.name.toLowerCase().includes(query)
  );
});

// --- Методы ---

// Обработчик загрузки изображения
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.classList.add('loaded');
};

// Функция для обработки поиска с debounce
let searchTimeout: number | null = null;
const onSearchInput = () => {
  if (searchTimeout !== null) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = window.setTimeout(() => {
    updateUrl();
  }, 300); // 300ms debounce
};

// Функция для обновления URL
const updateUrl = async () => {
  // Сохраняем текущую позицию прокрутки
  const currentScrollPosition = window.scrollY;
  
  // Формируем новый query
  const newQuery: { [key: string]: string | undefined } = {};
  if (searchQuery.value) {
    newQuery.search = searchQuery.value;
  }
  
  // Сохраняем высоту контейнера перед обновлением
  const container = document.querySelector('.gallery-grid-container');
  const containerHeight = container ? container.scrollHeight : 0;
  
  // Обновляем URL без скролла вверх
  await router.replace({ query: newQuery });
  
  // Даем время на обновление компонента
  await nextTick();
  
  // Получаем новую высоту контейнера
  const newContainerHeight = container ? container.scrollHeight : 0;
  
  // Рассчитываем разницу в высоте
  const heightDifference = newContainerHeight - containerHeight;
  
  // Корректируем позицию прокрутки с учетом изменения высоты
  let adjustedScrollPosition = currentScrollPosition;
  
  // Если контент стал короче и мы были ниже нового контента, прокручиваем до конца
  if (heightDifference < 0 && currentScrollPosition > document.documentElement.scrollHeight - window.innerHeight) {
    adjustedScrollPosition = document.documentElement.scrollHeight - window.innerHeight;
  } 
  // Если контент стал длиннее и мы были внизу, добавляем разницу к текущей позиции
  else if (heightDifference > 0 && currentScrollPosition >= containerHeight - window.innerHeight) {
    adjustedScrollPosition = currentScrollPosition + heightDifference;
  }
  
  // Восстанавливаем позицию прокрутки
  window.scrollTo({ top: adjustedScrollPosition, behavior: 'auto' });
};

// Функция для инициализации из URL
const initializeFromUrl = () => {
  const query = route.query;
  
  // Устанавливаем поисковый запрос из URL
  if (query.search && typeof query.search === 'string') {
    searchQuery.value = query.search;
  } else {
    searchQuery.value = '';
  }
};

// --- Watchers ---
// Следим за изменениями URL
watch(route, (newRoute) => {
  if (newRoute.name === 'gallery') {
    // Сохраняем текущую позицию прокрутки
    const currentScrollPosition = window.scrollY;
    
    // Инициализируем из URL
    initializeFromUrl();
    
    // Восстанавливаем позицию прокрутки через nextTick
    nextTick(() => {
      window.scrollTo({ top: currentScrollPosition, behavior: 'auto' });
    });
  }
});
</script>

<style scoped lang="scss">
// --- Импортированные стили и анимации из HomeView.vue ---
// Анимации
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

// Общие стили для анимации загрузки
.animate-on-load {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;

  &.animated {
    opacity: 1;
    transform: translateY(0);
  }
}

// --- Конец импортированных стилей ---

// --- Common Styles ---
.brand-gradient {
  background: linear-gradient(135deg, #646cff, #535bf2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2s ease-in-out infinite alternate;
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

// --- Gallery View Specific Styles ---
.gallery {
  min-height: calc(100vh - 200px);
  overflow-x: hidden;
  position: relative;
  z-index: 1;
  padding: 0 1rem;
  padding-bottom: 2rem; // Добавляем отступ снизу для мобильных устройств

  @media (max-width: 768px) {
    min-height: calc(100vh - 120px);
  }
}

/* --- Search Controls --- */
.filter-controls-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 2rem;
  max-width: 1280px;
  margin: 0 auto 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;

  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0 auto 1rem;
    margin-bottom: 0.5rem; // Уменьшаем отступ снизу для мобильных
  }
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.4);
  z-index: 2;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.4);
  }
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    border-color: #646cff;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.3);
  }

  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.05);
    color: #213547;
    border-color: rgba(0, 0, 0, 0.1);
    &::placeholder {
      color: rgba(0, 0, 0, 0.5);
    }
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 0.7rem 0.9rem 0.7rem 2.8rem;
    
    &:focus {
      // Для мобильных, увеличиваем размер поля при фокусе
      font-size: 1rem;
    }
  }
}

/* --- Gallery Grid --- */
.gallery-grid-section {
  padding: 0 2rem;
  max-width: 1280px;
  margin: 0 auto 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
    margin: 0 auto 1rem;
  }
}

.gallery-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    padding: 0 0.75rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding: 0 0.5rem;
  }
}

.gallery-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s ease;
  touch-action: manipulation; // Для лучшей обработки тач-событий

  @media (max-width: 768px) {
    border-radius: 12px;
  }

  &:hover {
    box-shadow: 0 10px 30px rgba(100, 108, 255, 0.2);
    border-color: rgba(100, 108, 255, 0.3);
    transform: translateY(-3px);
  }

  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.1);

    &:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      border-color: rgba(116, 123, 255, 0.3);
    }
  }
  
  @media (max-width: 768px) {
    // Увеличиваем размер карточки для мобильных устройств
    &:active {
      transform: scale(0.98);
    }
  }
}

.gallery-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(100, 108, 255, 0.05), rgba(83, 91, 242, 0.05));

  @media (max-width: 768px) {
    height: 200px;
  }

  @media (max-width: 480px) {
    height: 180px;
  }
}

.gallery-actual-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-actual-image.loaded {
  opacity: 1;
}

.gallery-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
}

.gallery-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
  line-height: 1.3;
  word-break: break-word;
  hyphens: auto;

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }

  @media (prefers-color-scheme: light) {
    color: #213547;
  }
}

/* --- Image Modal --- */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  outline: none;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
}

.modal-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2005;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateY(-50%) scale(1);
    
    &:hover {
      background: rgba(0, 0, 0, 0.5);
      transform: translateY(-50%) scale(1);
    }
  }
  
  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 1.1rem;
  }
}

.modal-prev {
  left: 2rem;
  
  @media (max-width: 768px) {
    left: 1rem;
  }
  
  @media (max-width: 480px) {
    left: 0.5rem;
  }
}

.modal-next {
  right: 2rem;
  
  @media (max-width: 768px) {
    right: 1rem;
  }
  
  @media (max-width: 480px) {
    right: 0.5rem;
  }
}

.modal-content {
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2001;
}

.modal-image {
  max-width: 100%;
  max-height: calc(90vh - 100px); /* Учитываем пространство для названия */
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 480px) {
    max-height: calc(90vh - 80px); /* На мобильных меньше места для названия */
  }
}

.modal-image-name {
  margin-top: 1rem;
  color: white;
  font-size: 1.25rem;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    white-space: normal;
    line-height: 1.2;
    margin-top: 0.75rem;
    padding: 0 0.75rem;
  }
}

/* --- Loading, Error & Empty States --- */
.loading-section, .error-section {
  text-align: center;
  padding: 4rem 1rem;
  color: rgba(255, 255, 255, 0.6);
  grid-column: 1 / -1;
  position: relative;
  z-index: 1;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);
  }

  .loading-spinner {
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top: 4px solid #646cff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}

.empty-results {
  text-align: center;
  padding: 4rem 1rem;
  color: rgba(255, 255, 255, 0.6);
  grid-column: 1 / -1;
  position: relative;
  z-index: 1;

  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: rgba(100, 108, 255, 0.4);
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
  }

  p {
    font-size: 1rem;
    margin: 0;
  }

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);
    h3 {
      color: rgba(0, 0, 0, 0.8);
    }
    svg {
      color: rgba(100, 108, 255, 0.3);
    }
  }
}

/* --- Header --- */
.page-header {
  padding: 3rem 0;
  text-align: center;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 2.5rem 0;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 0;
  }
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: clamp(1.75rem, 8vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.1;
  word-break: break-word;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: clamp(1.5rem, 8vw, 2.5rem);
  }
}

.page-description {
  font-size: clamp(0.875rem, 3vw, 1.125rem);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
  
  @media (max-width: 768px) {
    font-size: clamp(0.8125rem, 3vw, 1rem);
  }
}

// --- Mobile-specific styles ---
@media (max-width: 768px) {
  // Увеличиваем размеры элементов для мобильных устройств
  .gallery-card {
    min-height: 300px; // Минимальная высота для мобильных
    
    .gallery-image {
      height: 200px !important;
    }
    
    .gallery-info {
      padding: 1rem !important;
      
      .gallery-title {
        font-size: 1.1rem !important;
        min-height: 2.5em; // Гарантируем высоту для названия
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
  
  // Стили для мобильного модального окна
  .modal-image {
    max-height: calc(85vh - 60px) !important;
  }
  
  .modal-image-name {
    font-size: 0.9rem !important;
    margin-top: 0.5rem !important;
  }
  
  // Увеличиваем размеры кнопок для мобильных
  .modal-nav {
    width: 45px !important;
    height: 45px !important;
    font-size: 1.3rem !important;
    
    @media (max-width: 480px) {
      width: 40px !important;
      height: 40px !important;
      font-size: 1.1rem !important;
    }
  }
  
  // Для очень маленьких экранов
  @media (max-width: 480px) {
    .gallery-card {
      min-height: 250px;
      
      .gallery-image {
        height: 160px !important;
      }
      
      .gallery-info {
        padding: 0.75rem !important;
        
        .gallery-title {
          font-size: 1rem !important;
          -webkit-line-clamp: 2;
        }
      }
    }
    
    .modal-image {
      max-height: calc(80vh - 50px) !important;
    }
    
    .modal-image-name {
      font-size: 0.85rem !important;
      padding: 0 0.5rem !important;
    }
  }
}
</style>