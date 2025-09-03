<!-- src/views/MoreProjectsView.vue -->
<template>
  <div class="more-projects-view">
    <!-- Page Header with Animation -->
    <section class="page-header animate-on-load">
      <div class="header-content">
        <h1 class="page-title">
          <span class="brand-gradient">All</span> Projects
        </h1>
        <p class="page-description">
          A comprehensive list of all our projects, filtered and sorted by your preferences.
        </p>
      </div>
    </section>

    <!-- Filter Controls with Animation -->
    <div class="filter-controls-container animate-on-load">
      <div class="filter-section">
        <h3 class="filter-section-title">Project Type</h3>
        <div class="type-filters">
          <button
            v-for="type in projectTypes"
            :key="type.value"
            @click="() => toggleTypeFilter(type.value)"
            :class="['filter-button', 'type-filter-button', { 'is-active': activeTypeFilter === type.value }]"
            :aria-label="`Filter by ${type.label}`"
          >
            <font-awesome-icon :icon="type.icon" class="filter-icon" />
            <span class="filter-text">{{ type.label }}</span>
          </button>
        </div>
      </div>

      <div v-if="activeTypeFilter === 'game'" class="filter-section">
        <h3 class="filter-section-title">Game Genre</h3>
        <div class="genre-filters">
          <button
            v-for="genre in gameGenres"
            :key="genre.value"
            @click="() => toggleGenreFilter(genre.value)"
            :class="['filter-button', 'genre-button', { 'is-active': activeGenreFilters.includes(genre.value) }]"
            :aria-label="`Filter by ${genre.label} games`"
          >
            <font-awesome-icon :icon="genre.icon" class="filter-icon" />
            <span class="filter-text">{{ genre.label }}</span>
          </button>
        </div>
      </div>

      <div v-if="activeTypeFilter === 'game'" class="filter-section">
        <h3 class="filter-section-title">Community</h3>
        <div class="communities-filter">
          <button
            v-for="social in socialLinks"
            :key="social.name"
            @click="() => toggleCommunityFilter(social.name)"
            :class="['filter-button', 'community-button', { 'is-active': activeCommunityFilters.includes(social.name) }]"
            :aria-label="`Filter by ${social.name}`"
          >
            <img
              :src="social.imageUrl"
              :alt="`${social.name} icon`"
              class="community-icon"
            />
            <span class="community-name">{{ social.name }}</span>
          </button>
        </div>
      </div>

      <div class="filter-section">
        <h3 class="filter-section-title">Search</h3>
        <div class="search-container">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects..."
            class="search-input"
            @input="onSearchInput"
          />
        </div>
      </div>
    </div>

    <!-- Active Filter Display with Animation -->
    <div v-if="isFiltered" class="active-filter-container">
      <div class="filter-title">
        <span class="filter-label">Filtered by:</span>
        <span class="filter-term">{{ filterTitle }}</span>
      </div>
      <button class="reset-filters" @click="resetFilters" aria-label="Reset Filters">
        <font-awesome-icon :icon="['fas', 'trash']" />
      </button>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="loading-section animate-on-load\">
      <div class="loading-spinner"></div>
      <p>Loading projects...</p>
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="error-section">
      <p>Failed to load projects. Retrying...</p>
    </div>

    <!-- Projects Grid Section with Animation -->
    <section v-else class="projects-grid-section">
      <div v-if="paginatedProjects.length > 0" class="projects-grid-container">
        <div
          v-for="project in paginatedProjects"
          :key="project.id"
          class="project-card-full"
        >
          <div class="project-image-full">
            <img
              v-if="project.image && !imageLoadFailedState[project.id]"
              :src="project.image"
              :alt="project.title"
              class="project-actual-image"
            />
            <div v-else class="project-placeholder">
              <!-- Исправлена иконка: используем project.FontawesomeIcon напрямую -->
              <font-awesome-icon :icon="['fas', project.FontawesomeIcon || 'question-circle']" />
            </div>
          </div>
          <div class="project-info">
            <h3 class="project-title">{{ project.title }}</h3>
            <p v-if="project.releaseDate" class="project-release-date">
              Released: {{ formatReleaseDate(project.releaseDate) }}
            </p>
            <p class="project-description">{{ project.description }}</p>
            <div
              class="project-tags"
              v-if="project.tags && project.tags.some((tag) => tag !== '')"
            >
              <span
                v-for="tag in project.tags.filter((tag) => tag !== '')"
                :key="tag"
                class="project-tag"
              >
                {{ tag }}
              </span>
            </div>
            <div class="project-communities" v-if="project.communities && project.communities.length">
              <span
                v-for="community in project.communities"
                :key="community"
                class="project-community"
              >
                {{ community }}
              </span>
            </div>
            <button class="project-go-button" @click="openProject(project)">
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
              View Project
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty-results">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        <h3>No projects found.</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    </section>

    <!-- Pagination with Animation -->
    <div v-if="totalPages > 1 && !loading && !error" class="pagination-container animate-on-load">
      <button
        class="pagination-button"
        :disabled="currentPage === 1"
        @click="() => changePage(currentPage - 1)"
        aria-label="Previous page"
      >
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <span class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        class="pagination-button"
        :disabled="currentPage === totalPages"
        @click="() => changePage(currentPage + 1)"
        aria-label="Next page"
      >
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import contentfulClient from '@/services/contentful';

type ProjectType = 'game' | 'app' | 'extension' | 'other';
type GameGenre = 'horror' | 'arcade';

interface Project {
  id: string;
  title: string;
  description: string;
  FontawesomeIcon: string; // Исправлено имя поля на соответствие данным из Contentful
  tags: string[];
  category: GameGenre | 'web' | 'extensions' | 'other';
  projectType: ProjectType;
  image?: string;
  url?: string;
  isNew?: boolean;
  isPopular?: boolean;
  isRecommended?: boolean;
  releaseDate?: string;
  communities?: string[];
}

const route = useRoute();
const router = useRouter();

const searchQuery = ref('');
const activeCommunityFilters = ref<string[]>([]);
const activeTypeFilter = ref<ProjectType | null>(null);
const activeGenreFilters = ref<GameGenre[]>([]);
const currentPage = ref(1);
const PROJECTS_PER_PAGE = 30;

const cmsProjects = ref<Project[]>([]);
const loading = ref(true);
const error = ref(false);
const isInitialized = ref(false);

// Сохраняем позицию прокрутки
const scrollPosition = ref(0);

const socialLinks = ref([
  { name: 'Itch.io', url: 'https://by-rolil-studio.itch.io    ', imageUrl: new URL('@/assets/icons/itchio.png', import.meta.url).href },
  { name: 'Newgrounds', url: 'https://by-rolil-studio.newgrounds.com    ', imageUrl: new URL('@/assets/icons/newgrounds.png', import.meta.url).href },
  { name: 'GameJolt', url: 'https://gamejolt.com/@By-ROlil    ', imageUrl: new URL('@/assets/icons/gamejolt.png', import.meta.url).href },
  { name: 'Kogama', url: 'https://www.kogama.com/profile/667438867    ', imageUrl: new URL('@/assets/icons/kogama.png', import.meta.url).href },
  { name: 'Scratch', url: 'https://scratch.mit.edu/users/By-ROlil-CO    ', imageUrl: new URL('@/assets/icons/scratch.png', import.meta.url).href }
]);

const projectTypes = ref([
  { label: 'Games', value: 'game' as ProjectType, icon: ['fas', 'gamepad'] as const },
  { label: 'Apps', value: 'app' as ProjectType, icon: ['fas', 'mobile-alt'] as const },
  { label: 'Extensions', value: 'extension' as ProjectType, icon: ['fas', 'puzzle-piece'] as const },
  { label: 'Other', value: 'other' as ProjectType, icon: ['fas', 'cubes'] as const },
]);

const gameGenres = ref([
  { label: 'Horror', value: 'horror' as GameGenre, icon: ['fas', 'skull'] as const },
  { label: 'Arcade', value: 'arcade' as GameGenre, icon: ['fas', 'play-circle'] as const },
  { label: 'Tycoon', value: 'tycoon' as GameGenre, icon: ['fas', 'building'] as const }
]);

const fetchProjects = async (retryCount = 0) => {
  try {
    loading.value = true;
    error.value = false;
    
    const response = await contentfulClient.getEntries({ 
      content_type: 'project',
      limit: 1000 
    });
    
    if (!response.items || response.items.length === 0) {
      if (retryCount < 3) {
        setTimeout(() => fetchProjects(retryCount + 1), 2000);
        return;
      } else {
        cmsProjects.value = [];
      }
    } else {
      cmsProjects.value = response.items.map((item: any) => {
        const communitiesString = item.fields.community || item.fields.communities || '';
        const communitiesArray = communitiesString 
          ? communitiesString.split(',').map((comm: string) => comm.trim()).filter((comm: string) => comm !== '')
          : [];
        
        const tagsString = item.fields.tags || '';
        const tagsArray = tagsString 
          ? tagsString.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '')
          : [];
        
        return {
          id: item.sys.id,
          title: item.fields.title || 'Untitled Project',
          description: item.fields.description || 'No description available',
          // Исправлено имя поля на соответствие данным из Contentful
          FontawesomeIcon: item.fields.fontawesomeIcon || item.fields.FontawesomeIcon || 'question-circle', 
          tags: tagsArray,
          category: item.fields.category || 'other',
          projectType: item.fields.type || 'other',
          image: item.fields.image?.fields?.file?.url ? `https:${item.fields.image.fields.file.url}` : undefined,
          url: item.fields.url || item.fields.link || '',
          isNew: item.fields.isNew || false,
          isPopular: item.fields.isPopular || false,
          isRecommended: item.fields.isRecomended || item.fields.isRecommended || false, // Исправлена опечатка
          releaseDate: item.fields.releaseDate || item.fields.date || undefined,
          communities: communitiesArray
        };
      });
    }
    
    loading.value = false;
  } catch (err) {
    error.value = true;
    loading.value = false;
    
    if (retryCount < 3) {
      setTimeout(() => fetchProjects(retryCount + 1), 5000);
    }
  }
};

onMounted(() => {
  fetchProjects();
  
  // Сохраняем позицию при монтировании
  window.addEventListener('beforeunload', () => {
    scrollPosition.value = window.scrollY;
  });
  
  // --- Анимация при загрузке ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, {
    threshold: 0.1 // Анимация срабатывает, когда элемент на 10% виден
  });

  // Наблюдаем за всеми элементами с классом animate-on-load
  const animatedElements = document.querySelectorAll('.animate-on-load');
  animatedElements.forEach(el => observer.observe(el));

  // Инициализируем URL из текущего хеша
  nextTick(() => {
    syncStateFromURL();
    isInitialized.value = true;
    
    // Обработчик для кнопок "назад/вперед"
    window.addEventListener('popstate', () => {
      if (isInitialized.value) {
        syncStateFromURL();
      }
    });
  });
});

const imageLoadFailedState = reactive<Record<string, boolean>>({});

watch(cmsProjects, (newProjects) => {
  newProjects.forEach((project) => {
    imageLoadFailedState[project.id] = false;
  });
});

const isFiltered = computed(() => {
  return searchQuery.value.length > 0 ||
         activeCommunityFilters.value.length > 0 ||
         activeGenreFilters.value.length > 0;
});

const filteredProjects = computed(() => {
  let filtered = [...cmsProjects.value];
  
  // Фильтр по типу проекта (не сбрасывается при reset)
  if (activeTypeFilter.value !== null) {
    filtered = filtered.filter(project => {
      return project.projectType === activeTypeFilter.value;
    });
  }
  
  // Фильтр по жанру (только для игр)
  if (activeGenreFilters.value.length > 0) {
    filtered = filtered.filter(project => {
      return project.projectType === 'game' && 
             activeGenreFilters.value.includes(project.category as GameGenre);
    });
  }
  
  // Фильтр по сообществам
  if (activeCommunityFilters.value.length > 0) {
    filtered = filtered.filter(project => {
      if (!project.communities || project.communities.length === 0) {
        return false;
      }
      
      return project.communities.some(community =>
        activeCommunityFilters.value.includes(community)
      );
    });
  }
  
  // Поиск по тексту
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(project => {
      const titleMatch = project.title.toLowerCase().includes(query);
      const descriptionMatch = project.description.toLowerCase().includes(query);
      const urlMatch = (project.url || '').toLowerCase().includes(query);
      const categoryMatch = project.category.toLowerCase().includes(query);
      const communityMatch = project.communities?.some(c => c.toLowerCase().includes(query)) || false;
      const tagsMatch = project.tags.some(tag => tag.toLowerCase().includes(query));
      const typeMatch = project.projectType.toLowerCase().includes(query);
      
      return titleMatch || descriptionMatch || urlMatch || categoryMatch || communityMatch || tagsMatch || typeMatch;
    });
  }
  
  // Сортировка по дате релиза
  filtered.sort((a, b) => parseCustomDate(b.releaseDate) - parseCustomDate(a.releaseDate));
  return filtered;
});

const formatReleaseDate = (dateStr: string | undefined): string => {
  if (!dateStr) return 'Release date unknown';
  
  try {
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  } catch (error) {
    return 'Invalid date format';
  }
};

const parseCustomDate = (dateStr: string | undefined): number => {
  if (!dateStr) return 0;
  
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  } catch (error) {
    return 0;
  }
};

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * PROJECTS_PER_PAGE;
  const end = start + PROJECTS_PER_PAGE;
  return filteredProjects.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / PROJECTS_PER_PAGE);
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    updateURL();
  }
};

const filterTitle = computed(() => {
  let titleParts = [];
  
  if (activeTypeFilter.value !== null) {
    const typeLabel = projectTypes.value.find(t => t.value === activeTypeFilter.value)?.label;
    if (typeLabel) {
      titleParts.push(`Type: ${typeLabel}`);
    }
  }
  
  if (activeGenreFilters.value.length > 0) {
    const genreLabels = gameGenres.value
      .filter(g => activeGenreFilters.value.includes(g.value))
      .map(g => g.label);
    titleParts.push(`Genre: ${genreLabels.join(', ')}`);
  }
  
  if (activeCommunityFilters.value.length > 0) {
    titleParts.push(`Community: ${activeCommunityFilters.value.join(', ')}`);
  }
  
  if (searchQuery.value) {
    titleParts.push(`Search: "${searchQuery.value}"`);
  }
  
  return titleParts.join(' | ');
});

const toggleTypeFilter = (typeValue: ProjectType) => {
  if (activeTypeFilter.value === typeValue) {
    activeTypeFilter.value = null;
  } else {
    activeTypeFilter.value = typeValue;
  }
  
  // Сбросить жанровые фильтры, если снимаем фильтр по играм или меняем тип
  if (activeTypeFilter.value !== 'game') {
    activeGenreFilters.value = [];
    activeCommunityFilters.value = [];
  }
  
  currentPage.value = 1;
  updateURL();
};

const toggleGenreFilter = (genreValue: GameGenre) => {
  const index = activeGenreFilters.value.indexOf(genreValue);
  if (index > -1) {
    activeGenreFilters.value.splice(index, 1);
  } else {
    activeGenreFilters.value.push(genreValue);
  }
  currentPage.value = 1;
  updateURL();
};

const toggleCommunityFilter = (communityName: string) => {
  const index = activeCommunityFilters.value.indexOf(communityName);
  if (index > -1) {
    activeCommunityFilters.value.splice(index, 1);
  } else {
    activeCommunityFilters.value.push(communityName);
  }
  currentPage.value = 1;
  updateURL();
};

let searchTimeout: number | null = null;
const onSearchInput = () => {
  if (searchTimeout !== null) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = window.setTimeout(() => {
    currentPage.value = 1;
    updateURL();
  }, 300);
};

const resetFilters = () => {
  searchQuery.value = '';
  activeCommunityFilters.value = [];
  activeGenreFilters.value = [];
  currentPage.value = 1;
  updateURL();
};

const openProject = (project: Project) => {
  if (project.url) {
    window.open(project.url, '_blank', 'noopener noreferrer');
  } else {
    alert(`Project ${project.title} URL is not configured.`);
  }
};

// --- Улучшенная система синхронизации URL (как в NewsView) ---
const updateURL = () => {
  if (!isInitialized.value) return;
  
  const query: any = { ...route.query };
  
  // Update search parameter
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    query.search = searchQuery.value.trim();
  } else {
    delete query.search;
  }
  
  // Update type filter
  if (activeTypeFilter.value) {
    query.type = activeTypeFilter.value;
  } else {
    delete query.type;
  }
  
  // Update genre filters
  if (activeGenreFilters.value.length > 0) {
    query.genre = activeGenreFilters.value;
  } else {
    delete query.genre;
  }
  
  // Update community filters
  if (activeCommunityFilters.value.length > 0) {
    query.community = activeCommunityFilters.value;
  } else {
    delete query.community;
  }
  
  // Update page parameter
  if (currentPage.value > 1) {
    query.page = currentPage.value;
  } else {
    delete query.page;
  }
  
  // Build new URL with current hash path and query parameters
  const currentPath = window.location.hash.split('?')[0] || '#/more-projects';
  const searchParams = new URLSearchParams();
  
  Object.keys(query).forEach(key => {
    if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
      // Handle array values
      if (Array.isArray(query[key])) {
        query[key].forEach((value: string) => {
          searchParams.append(key, value);
        });
      } else {
        searchParams.set(key, query[key]);
      }
    }
  });
  
  const queryString = searchParams.toString();
  const newURL = queryString ? `${currentPath}?${queryString}` : currentPath;
  
  if (window.location.hash !== newURL) {
    window.history.replaceState(null, '', newURL);
  }
};

const syncStateFromURL = () => {
  const hashParts = window.location.hash.split('?');
  const searchParams = new URLSearchParams(hashParts[1] || '');
  
  // Set search query
  const urlSearch = searchParams.get('search');
  if (urlSearch) {
    searchQuery.value = urlSearch;
  } else {
    searchQuery.value = '';
  }
  
  // Set type filter
  const urlType = searchParams.get('type');
  if (urlType && projectTypes.value.some(pt => pt.value === urlType)) {
    activeTypeFilter.value = urlType as ProjectType;
  } else {
    activeTypeFilter.value = null;
  }
  
  // Set genre filters
  const urlGenres = searchParams.getAll('genre');
  if (urlGenres.length > 0) {
    activeGenreFilters.value = urlGenres.filter(g => 
      gameGenres.value.some(gg => gg.value === g)
    ) as GameGenre[];
  } else {
    activeGenreFilters.value = [];
  }
  
  // Set community filters
  const urlCommunities = searchParams.getAll('community');
  if (urlCommunities.length > 0) {
    activeCommunityFilters.value = urlCommunities.filter(c => 
      socialLinks.value.some(s => s.name === c)
    );
  } else {
    activeCommunityFilters.value = [];
  }
  
  // Set current page
  const urlPage = searchParams.get('page');
  if (urlPage) {
    const page = parseInt(urlPage, 10);
    if (!isNaN(page) && page >= 1) {
      currentPage.value = page;
    } else {
      currentPage.value = 1;
    }
  } else {
    currentPage.value = 1;
  }
};

// --- Watch for browser URL changes ---
watch(
  () => window.location.hash,
  () => {
    if (isInitialized.value) {
      syncStateFromURL();
    }
  }
);
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

// --- More Projects View Specific Styles ---
.more-projects-view {
  min-height: calc(100vh - 200px);
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;
  z-index: 1;
  padding: 0 1rem;

  @media (max-width: 768px) {
    min-height: calc(100vh - 120px);
    padding: 0 0.5rem;
  }
}

/* --- Filter Controls --- */
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
  }
}

/* --- Type Filters --- */
.type-filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 0.5rem;
  }
}

/* --- Genre Filters --- */
.genre-filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 0.5rem;

  @media (prefers-color-scheme: light) {
    border-color: rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    justify-content: center;
    gap: 0.5rem;
  }
}

/* --- Filter Button Styles --- */
.filter-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 0.875rem;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #646cff;
  }

  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.05);
    color: #213547;
    border-color: rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-color: #535bf2;
    }
  }

  &.is-active {
    background: linear-gradient(135deg, #5a5d68, #50535e);
    border-color: #535bf2;
    color: white;

    &:hover {
      background: linear-gradient(135deg, #646cff, #535bf2);
    }

    @media (prefers-color-scheme: light) {
      background: linear-gradient(135deg, #747bff, #646cff);
      color: white;
      &:hover {
        background: linear-gradient(135deg, #646cff, #535bf2);
      }
    }
  }
  
  .filter-icon {
    font-size: 0.9em;
  }
}

/* --- Community Filters --- */
.communities-filter {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 0.5rem;

  @media (prefers-color-scheme: light) {
    border-color: rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    justify-content: center;
    gap: 0.5rem;
  }
}

.community-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  font-size: 0.875rem;
  z-index: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #646cff;
  }

  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.05);
    color: #213547;
    border-color: rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-color: #535bf2;
    }
  }

  &.is-active {
    background: linear-gradient(135deg, #5a5d68, #50535e);
    border-color: #535bf2;
    color: white;

    &:hover {
      background: linear-gradient(135deg, #646cff, #535bf2);
    }

    @media (prefers-color-scheme: light) {
      background: linear-gradient(135deg, #747bff, #646cff);
      color: white;
      &:hover {
        background: linear-gradient(135deg, #646cff, #535bf2);
      }
    }
  }

  .community-icon {
    width: 20px;
    height: 20px;
    filter: invert(1);

    @media (prefers-color-scheme: light) {
       filter: invert(0);
    }
  }
}

/* --- Search --- */
.search-container {
  position: relative;
  width: 100%;
  max-width: none;

  @media (max-width: 768px) {
    max-width: none;
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
}

/* --- Active Filter Display --- */
.active-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem 2rem;
  max-width: 1280px;
  margin: 0 auto 2rem;
  background: rgba(100, 108, 255, 0.1);
  border-left: 3px solid #646cff;
  border-radius: 8px;
  position: relative;
  z-index: 1;

  @media (prefers-color-scheme: light) {
    background: rgba(100, 108, 255, 0.08);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0 auto 1rem;
  }
}

.filter-title {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 1;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.9);
  }
}

.filter-label {
  font-weight: 600;
  margin-right: 0.5rem;
}

.filter-term {
  font-weight: 500;
  color: #646cff;
}

.reset-filters {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s ease, transform 0.2s ease;
  position: relative;
  z-index: 1;

  &:hover {
    color: #ff6b6b;
    transform: scale(1.1);
  }

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);

    &:hover {
      color: #e55050;
    }
  }
}

/* --- Empty Results --- */
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

/* --- Pagination --- */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
}

.pagination-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: #646cff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.05);
    color: #213547;
    border-color: rgba(0, 0, 0, 0.1);

    &:hover:not(:disabled) {
      background: rgba(0, 0, 0, 0.1);
      border-color: #535bf2;
    }
  }
}

.pagination-info {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  position: relative;
  z-index: 1;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.8);
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
}

</style>