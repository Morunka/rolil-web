<template>
  <div class="projects">
    <div class="projects-content">
      <section class="projects-header">
        <div class="header-content">
          <h1 class="page-title">
            Our
            <span class="brand-gradient">Projects</span>
          </h1>
          <p class="page-description">
            Get to <a class="rainbow-shimmer">know our universes</a> in interesting projects from our studio <a class="rainbow-shimmer">for you.</a>
          </p>
        </div>
      </section>

      <section class="channels-section">
        <div class="social-icons">
          <a
            v-for="social in socialLinks"
            :key="social.name"
            :href="social.url"
            :aria-label="social.name"
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon"
          >
            <img
              v-if="social.imageUrl"
              :src="social.imageUrl"
              :alt="`${social.name} icon`"
              class="social-image"
              draggable="false"
              @dragstart.prevent
            />
          </a>
        </div>
      </section>

      <!-- Stats Section: Our Universes -->
      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">
            Explore the diverse <a class="rainbow-shimmer">worlds we've crafted.</a> Each project is a gateway to a unique universe, filled with its own stories, characters, and adventures waiting for <a class="rainbow-shimmer">you to discover.</a>
          </p>
        </div>
      </section>
      <!-- End Stats Section: Our Universes -->

      <!-- NEW Projects Section -->
      <section class="projects-section">
        <h2 class="section-title">
          <a class="rainbow-shimmer">NEW</a> Projects
        </h2>
      <!-- Loading Indicator -->
      <div v-if="loading" class="loading-section animate-on-load">
        <div class="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>
      <!-- Error Message -->
      <div v-else-if="error" class="error-section animate-on-load">
        <p>Failed to load projects. Retrying...</p>
      </div>
        <div class="projects-container" v-else-if="newProjects.length > 0">
          <div class="projects-grid">
            <div
              v-for="project in newProjects"
              :key="project.id"
              class="project-card-full"
            >
              <div class="project-image-full">
                <img
                  v-if="project.image && !imageLoadFailedState[project.id]"
                  :src="project.image"
                  :alt="project.title"
                  class="project-actual-image"
                  @error="() => setImageLoadFailed(project.id)"
                />
                <div v-else class="project-placeholder">
                  <font-awesome-icon :icon="['fas', project.FontawesomeIcon || 'question-circle']" />
                </div>
              </div>
              <div class="project-info">
                <h3 class="project-title">{{ project.title }}</h3>
                <!-- Release Date Display - обновлённый формат -->
                <p v-if="project.releaseDate" class="project-release-date">{{ formatReleaseDate(project.releaseDate) }}</p>
                <p class="project-description">{{ project.description }}</p>
                <div class="project-tags" v-if="project.tags && project.tags.some(tag => tag !== '')">
                  <span
                    v-for="tag in project.tags.filter(tag => tag !== '')"
                    :key="tag"
                    class="project-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
                <!-- Обновлённая секция сообществ -->
                <div class="project-communities" v-if="project.communities && project.communities.length > 0">
                  <span
                    v-for="community in project.communities"
                    :key="community"
                    class="project-community"
                  >
                    {{ community }}
                  </span>
                </div>
                <button class="project-go-button" @click="openProject(project)">
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />Go to Project
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-section">
          <font-awesome-icon :icon="['fas', 'clock']" />
          <h3>Coming Soon!</h3>
          <p>New projects are currently in development.</p>
        </div>
      </section>

      <!-- Popular Projects Section -->
      <section class="projects-section">
        <h2 class="section-title">Popular Projects</h2>
        <!-- Loading Indicator -->
        <div v-if="loading" class="loading-section animate-on-load">
          <div class="loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
        <!-- Error Message -->
        <div v-else-if="error" class="error-section animate-on-load">
          <p>Failed to load projects. Retrying...</p>
        </div>
        <div class="projects-container" v-else-if="popularProjects.length > 0">
           <div class="projects-grid">
            <div
              v-for="project in popularProjects"
              :key="project.id"
              class="project-card-full"
            >
              <div class="project-image-full">
                <img
                  v-if="project.image && !imageLoadFailedState[project.id]"
                  :src="project.image"
                  :alt="project.title"
                  class="project-actual-image"
                  @error="() => setImageLoadFailed(project.id)"
                />
                <div v-else class="project-placeholder">
                  <font-awesome-icon :icon="['fas', project.FontawesomeIcon || 'question-circle']" />
                </div>
              </div>
              <div class="project-info">
                <h3 class="project-title">{{ project.title }}</h3>
                <!-- Release Date Display - обновлённый формат -->
                <p v-if="project.releaseDate" class="project-release-date">{{ formatReleaseDate(project.releaseDate) }}</p>
                <p class="project-description">{{ project.description }}</p>
                <div class="project-tags" v-if="project.tags && project.tags.some(tag => tag !== '')">
                  <span
                    v-for="tag in project.tags.filter(tag => tag !== '')"
                    :key="tag"
                    class="project-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
                <!-- Обновлённая секция сообществ -->
                <div class="project-communities" v-if="project.communities && project.communities.length > 0">
                  <span
                    v-for="community in project.communities"
                    :key="community"
                    class="project-community"
                  >
                    {{ community }}
                  </span>
                </div>
                <button class="project-go-button" @click="openProject(project)">
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />Go to Project
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-section">
          <font-awesome-icon :icon="['fas', 'star']" />
          <h3>Popular Projects Coming Soon</h3>
          <p>Check back for trending projects!</p>
        </div>
      </section>

      <!-- Most Recommended Projects Section -->
      <section class="projects-section">
        <h2 class="section-title">Most Recommended</h2>
        <!-- Loading Indicator -->
        <div v-if="loading" class="loading-section animate-on-load">
          <div class="loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
        <!-- Error Message -->
        <div v-else-if="error" class="error-section animate-on-load">
          <p>Failed to load projects. Retrying...</p>
        </div>
        <div class="projects-container" v-else-if="recommendedProjects.length > 0">
          <div class="projects-grid">
            <div
              v-for="project in recommendedProjects"
              :key="project.id"
              class="project-card-full"
            >
              <div class="project-image-full">
                <img
                  v-if="project.image && !imageLoadFailedState[project.id]"
                  :src="project.image"
                  :alt="project.title"
                  class="project-actual-image"
                  @error="() => setImageLoadFailed(project.id)"
                />
                <div v-else class="project-placeholder">
                  <font-awesome-icon :icon="['fas', project.FontawesomeIcon || 'question-circle']" />
                </div>
              </div>
              <div class="project-info">
                <h3 class="project-title">{{ project.title }}</h3>
                <!-- Release Date Display - обновлённый формат -->
                <p v-if="project.releaseDate" class="project-release-date">{{ formatReleaseDate(project.releaseDate) }}</p>
                <p class="project-description">{{ project.description }}</p>
                <div class="project-tags" v-if="project.tags && project.tags.some(tag => tag !== '')">
                  <span
                    v-for="tag in project.tags.filter(tag => tag !== '')"
                    :key="tag"
                    class="project-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
                <!-- Обновлённая секция сообществ -->
                <div class="project-communities" v-if="project.communities && project.communities.length > 0">
                  <span
                    v-for="community in project.communities"
                    :key="community"
                    class="project-community"
                  >
                    {{ community }}
                  </span>
                </div>
                <button class="project-go-button" @click="openProject(project)">
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />Go to Project
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-section">
          <font-awesome-icon :icon="['fas', 'thumbs-up']" />
          <h3>Recommended Projects Coming Soon</h3>
          <p>Our top picks will appear here!</p>
        </div>
      </section>

      <!-- Stats Section: Our Achievements -->
      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">
            Our journey is marked by <a class="rainbow-shimmer">dedication and creativity.</a> With each project, we learn, grow, and push the boundaries of what's possible, striving to deliver <a class="rainbow-shimmer">unique experiences every time.</a>
          </p>
        </div>
      </section>
      <!-- End Stats Section: Our Achievements -->

      <!-- CTA Section (replaces the simple "View All Projects" button) -->
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Explore Our Full Project Catalog</h2>
          <p class="cta-description">
            Dive deeper into our creative world. <a class="rainbow-shimmer">Discover all our projects,</a> from early access experiments to full releases, and find ideas for <a class="rainbow-shimmer">your own projects.</a>
          </p>
          <div class="hero-actions">
            <button class="cta-button primary large" @click="goToMoreView">
              <font-awesome-icon :icon="['fas', 'th-large']" />
              View All Projects
            </button>
            <button class="cta-button secondary large" @click="goToNews">
              <font-awesome-icon :icon="['fas', 'newspaper']" />
              Read Our Devlogs
            </button>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import contentfulClient from '@/services/contentful'

const router = useRouter()

type ProjectType = 'game' | 'app' | 'extension' | 'other';

interface Project {
  id: string
  title: string
  description: string
  FontawesomeIcon: string 
  tags: string[]
  category: 'horror' | 'arcade' | 'web' | 'extensions' | 'other' 
  projectType: ProjectType 
  image?: string 
  url?: string
  isNew?: boolean
  isPopular?: boolean
  isRecommended?: boolean
  releaseDate?: string
  communities: string[]
}

const socialLinks = ref([
  { name: 'Itch.io', url: 'https://by-rolil-studio.itch.io', imageUrl: new URL('@/assets/icons/itchio.png', import.meta.url).href },
  { name: 'Newgrounds', url: 'https://by-rolil-studio.newgrounds.com', imageUrl: new URL('@/assets/icons/newgrounds.png', import.meta.url).href },
  { name: 'GameJolt', url: 'https://gamejolt.com/@By-ROlil', imageUrl: new URL('@/assets/icons/gamejolt.png', import.meta.url).href },
  { name: 'Kogama', url: 'https://www.kogama.com/profile/667438867', imageUrl: new URL('@/assets/icons/kogama.png', import.meta.url).href },
  { name: 'Scratch', url: 'https://scratch.mit.edu/users/By-ROlil-CO', imageUrl: new URL('@/assets/icons/scratch.png', import.meta.url).href }
])

// CMS Data Fetching with Retry Logic
const cmsProjects = ref<Project[]>([])
const loading = ref(true)
const error = ref(false)

const fetchProjects = async () => {
  try {
    loading.value = true
    error.value = false
    
    const response = await contentfulClient.getEntries({ content_type: 'project' })
    
    cmsProjects.value = response.items.map((item: any) => {
      const communitiesString = item.fields.community || '';
      const communitiesArray = communitiesString 
        ? communitiesString.split(',').map((comm: string) => comm.trim()).filter((comm: string) => comm !== '')
        : [];
      
      return {
        id: item.sys.id,
        title: item.fields.title || '',
        description: item.fields.description || '',
        FontawesomeIcon: item.fields.fontawesomeIcon || 'question-circle',
        tags: item.fields.tags ? item.fields.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '') : [],
        category: item.fields.category || 'other',
        projectType: item.fields.projectType || 'other',
        image: item.fields.image?.fields?.file?.url ? `https:${item.fields.image.fields.file.url}` : undefined,
        url: item.fields.url || '',
        isNew: item.fields.isNew || false,
        isPopular: item.fields.isPopular || false,
        isRecommended: item.fields.isRecomended || false,
        releaseDate: item.fields.releaseDate || undefined,
        communities: communitiesArray
      };
    });
    
    cmsProjects.value.forEach(project => {
      imageLoadFailedState[project.id] = false;
    });
    
    loading.value = false
  } catch (err) {
    console.error('Error fetching projects from Contentful:', err)
    error.value = true
    loading.value = false
    
    setTimeout(() => {
      fetchProjects()
    }, 5000)
  }
}

onMounted(() => {
  fetchProjects()
})

const imageLoadFailedState = reactive<Record<string, boolean>>({});

const setImageLoadFailed = (projectId: string) => {
  imageLoadFailedState[projectId] = true;
};

// Обновлённая функция форматирования даты для формата 2024-09-18T00:00+03:00
const formatReleaseDate = (dateStr: string | undefined): string => {
  if (!dateStr) return 'Release date unknown';
  
  try {
    // Создаём объект Date из строки формата ISO 8601
    const date = new Date(dateStr);
    
    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Получаем компоненты даты
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' }); // Полное название месяца на английском
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'Invalid date format';
  }
};

// Обновлённая функция для сортировки с учётом нового формата даты
const parseCustomDate = (dateStr: string | undefined): number => {
  if (!dateStr) return 0;
  
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  } catch (error) {
    console.error('Error parsing date for sorting:', error);
    return 0;
  }
};

const newProjects = computed(() => {
  return cmsProjects.value
    .filter(p => p.isNew === true)
    .sort((a, b) => parseCustomDate(b.releaseDate) - parseCustomDate(a.releaseDate));
});

const popularProjects = computed(() => {
  return cmsProjects.value
    .filter(p => p.isPopular === true)
    .sort((a, b) => parseCustomDate(b.releaseDate) - parseCustomDate(a.releaseDate));
});

const recommendedProjects = computed(() => {
  return cmsProjects.value
    .filter(p => p.isRecommended === true)
    .sort((a, b) => parseCustomDate(b.releaseDate) - parseCustomDate(a.releaseDate));
});

const goToMoreView = () => {
  router.push('/more-projects?type=game');
};

const goToNews = () => {
  router.push('/news?tab=devlogs');
};

const openProject = (project: Project) => {
  if (project.url) {
    window.open(project.url, '_blank', 'noopener noreferrer');
  } else {
    alert(`Project ${project.title} URL is not configured.`);
  }
}
</script>

<style scoped lang="scss">

.projects-grid {
  display: grid !important;
  grid-auto-flow: column !important;
  grid-auto-columns: minmax(280px, 1fr) !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  gap: 0.8rem !important;
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 1rem 1rem 1rem !important;
  scroll-behavior: smooth !important;
  -webkit-overflow-scrolling: touch !important;

  // Custom scrollbar styling
  &::-webkit-scrollbar {
    height: 8px !important;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 4px !important;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(100, 108, 255, 0.6) !important;
    border-radius: 4px !important;
    
    &:hover {
      background: rgba(100, 108, 255, 0.8) !important;
    }
  }

  // Firefox scrollbar
  scrollbar-width: thin !important;
  scrollbar-color: rgba(100, 108, 255, 0.6) rgba(255, 255, 255, 0.1) !important;

  @media (max-width: 768px) {
    gap: 0.6rem !important;
    padding: 0 0.75rem 1rem 0.75rem !important;
    grid-auto-columns: minmax(250px, 1fr) !important;
  }

  @media (max-width: 480px) {
    gap: 0.5rem !important;
    padding: 0 0.5rem 1rem 0.5rem !important;
    grid-auto-columns: minmax(220px, 1fr) !important;
  }
}

.projects-container {
  max-width: 1200px !important;
  margin: 0 auto !important;
  overflow: visible !important;
}

// Add scroll indicators
.scroll-indicator {
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  background: rgba(100, 108, 255, 0.8) !important;
  border: none !important;
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: white !important;
  cursor: pointer !important;
  z-index: 20 !important;
  opacity: 0.7 !important;
  transition: opacity 0.3s ease !important;

  &:hover {
    opacity: 1 !important;
  }

  &.scroll-left {
    left: 10px !important;
  }

  &.scroll-right {
    right: 10px !important;
  }

  @media (max-width: 768px) {
    width: 35px !important;
    height: 35px !important;
  }

  @media (max-width: 480px) {
    display: none !important;
  }
}

// --- Rest of the styles remain largely the same ---
.project-actual-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.projects {
  position: relative;
  min-height: calc(100vh - 200px);
  overflow-x: hidden !important;
  overflow-y: auto;

  @media (max-width: 768px) {
    min-height: calc(100vh - 120px);
  }

  @media (max-width: 480px) {
    min-height: calc(100vh - 100px);
  }
}

.projects-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
}

.projects-header {
  padding: 3rem 0;
  text-align: center;

  @media (max-width: 1024px) {
    padding: 2.5rem 0;
  }

  @media (max-width: 768px) {
    padding: 2rem 0;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 0;
  }

  @media (max-width: 320px) {
    padding: 1rem 0;
  }
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 480px) {
    padding: 0 0.75rem;
  }

  @media (max-width: 320px) {
    padding: 0 0.5rem;
  }
}

.page-title {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  text-align: center;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
    text-align: left;
  }
}

.brand-gradient {
  background: linear-gradient(135deg, #646cff, #535bf2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2s ease-in-out infinite alternate;

  @supports not (-webkit-background-clip: text) {
    color: #646cff;
  }
}

.page-description {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 480px) {
    line-height: 1.5;
    text-align: left;
  }

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.channels-section {
  padding: 2rem 0;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }

  @media (max-width: 480px) {
    padding: 1rem 0;
  }
}

.projects-sections {
  padding: 2rem 0;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }

  @media (max-width: 480px) {
    padding: 1rem 0;
  }
}

.projects-section {
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 2.5rem;
  }

  &:last-child {
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      margin-bottom: 1.5rem;
    }

    @media (max-width: 480px) {
      margin-bottom: 1rem;
    }
  }
}

.section-title {
  text-align: center;
  font-size: clamp(1.25rem, 5vw, 2rem);
  margin-bottom: 2rem;
  font-weight: 600;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
    text-align: left;
    padding-left: 1rem;
  }
}

.empty-section {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.6);

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem;
  }

  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: rgba(100, 108, 255, 0.4);

    @media (max-width: 480px) {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.8);

    @media (max-width: 480px) {
      font-size: 1.25rem;
    }
  }

  p {
    font-size: 1rem;
    margin: 0;

    @media (max-width: 480px) {
      font-size: 0.875rem;
    }
  }

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.5);

    h3 {
      color: rgba(0, 0, 0, 0.7);
    }
    svg {
      color: rgba(100,108,255,0.3);
    }
  }
}

.stats-section {
  padding: 2rem 0;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }

  @media (max-width: 480px) {
    padding: 1rem 0;
  }
}

.stats-grid {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 480px) {
    padding: 0 0.75rem;
  }

  @media (max-width: 320px) {
    padding: 0 0.5rem;
  }
}

.hero-description {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.center {
  text-align: center;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
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

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>