<!-- src/views/NewsView.vue -->
<template>
  <div class="news">
    <div class="news-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Stay Updated with
            <span class="brand-gradient">ROlil Studio</span>
          </h1>
          <p class="hero-description">
            Get the <a class="rainbow-shimmer">latest news,</a> insightful <a class="rainbow-shimmer">devlogs,</a> and behind-the-scenes updates from our creative journey.
          </p>
        </div>
      </section>

      <!-- Search Section -->
      <section class="search-section">
        <div class="search-container">
          <div class="search-box">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search news, headings, devlogs..."
              class="search-input"
              @input="onSearchInput"
              @keyup.enter="triggerSearch"
            />
          </div>
        </div>
      </section>

      <!-- Tabs Section -->
      <section class="tabs-section">
        <div class="tabs-container">
          <button
            :class="['tab-button', { 'tab-button--active': activeTab === 'posts' }]"
            @click="switchTab('posts')"
            aria-label="Switch to News Posts"
          >
            <font-awesome-icon :icon="['fas', 'newspaper']" />
            <span class="tab-label">News</span>
          </button>
          <button
            :class="['tab-button', { 'tab-button--active': activeTab === 'headings' }]"
            @click="switchTab('headings')"
            aria-label="Switch to Headings"
          >
            <font-awesome-icon :icon="['fas', 'heading']" />
            <span class="tab-label">Headings</span>
          </button>
          <button
            :class="['tab-button', { 'tab-button--active': activeTab === 'devlogs' }]"
            @click="switchTab('devlogs')"
            aria-label="Switch to Devlogs"
          >
            <font-awesome-icon :icon="['fas', 'book-open']" />
            <span class="tab-label">Devlogs</span>
          </button>
        </div>
      </section>

      <!-- Headings Categories (Only visible when Headings tab is active) -->
      <section v-if="activeTab === 'headings'" class="headings-categories-section">
        <div class="headings-categories-container">
          <div class="headings-categories-card">
            <h3 class="headings-categories-title">
              <font-awesome-icon :icon="['fas', 'filter']" class="title-icon" />
              Available Categories
            </h3>
            <div class="headings-categories">
              <button
                :class="['category-button', { 'active': activeCategory === 'all' }]"
                @click="setActiveCategory('all')"
              >
                <font-awesome-icon :icon="['fas', 'list']" />
                <span>All Headings</span>
              </button>
              <button
                :class="['category-button', { 'active': activeCategory === 'qna' }]"
                @click="setActiveCategory('qna')"
              >
                <font-awesome-icon :icon="['fas', 'question-circle']" />
                <span>Q&A Only</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Content Sections -->
      <!-- Posts Section -->
      <section v-show="activeTab === 'posts'" class="content-section animate-on-load">
        <h2 class="section-title">Latest News</h2>
        <!-- Posts Grid -->
        <div class="content-grid">
          <!-- Loading State -->
          <div v-if="postsLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading news posts...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="postsError" class="error-state">
            <p class="error-message">Oops! Something went wrong: {{ postsError }}</p>
            <button @click="retryFetchPosts" class="cta-button secondary">Retry</button>
          </div>

          <!-- Posts List -->
          <div v-else-if="filteredPosts.length > 0" class="items-grid">
            <div
              v-for="post in filteredPosts"
              :key="post.id"
              class="content-card"
              @click="goToPost(post)"
            >
              <div class="card-image-container">
                <img
                  v-if="post.titleImage"
                  :src="post.titleImage"
                  :alt="post.title"
                  class="card-image"
                  @error="handleImageError(post.id, 'post')"
                />
                <div v-else class="card-placeholder">
                  <font-awesome-icon :icon="['fas', post.icon || 'newspaper']" />
                </div>
              </div>
              <div class="card-info">
                <h3 class="card-title">{{ post.title }}</h3>
                <p class="card-excerpt">{{ post.excerpt }}</p>
                <div class="card-meta">
                  <span class="card-date">{{ formatDate(post.releaseDate) }}</span>
                  <div class="card-tags" v-if="post.tags && post.tags.length">
                    <span
                      v-for="tag in post.tags.slice(0, 2)"
                      :key="tag"
                      class="card-tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="empty-icon" />
            <h3>Nothing found</h3>
            <p>Check back soon.</p>
          </div>
        </div>
      </section>

      <!-- Headings Section -->
      <section v-show="activeTab === 'headings'" class="content-section animate-on-load">
        <h2 class="section-title">Q&A Headings</h2>
        <!-- Headings Grid -->
        <div class="content-grid">
          <!-- Loading State -->
          <div v-if="headingsLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading headings...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="headingsError" class="error-state">
            <p class="error-message">Oops! Something went wrong: {{ headingsError }}</p>
            <button @click="retryFetchHeadings" class="cta-button secondary">Retry</button>
          </div>

          <!-- Headings List -->
          <div v-else-if="filteredHeadings.length > 0" class="items-grid">
            <div
              v-for="heading in filteredHeadings"
              :key="heading.id"
              class="content-card"
              @click="goToHeading(heading)"
            >
              <div class="card-image-container">
                <img
                  v-if="heading.titleImage"
                  :src="heading.titleImage"
                  :alt="heading.title"
                  class="card-image"
                  @error="handleImageError(heading.id, 'heading')"
                />
                <div v-else class="card-placeholder">
                  <font-awesome-icon :icon="['fas', heading.icon || 'question-circle']" />
                </div>
              </div>
              <div class="card-info">
                <h3 class="card-title">{{ heading.title }}</h3>
                <p class="card-excerpt">{{ heading.excerpt }}</p>
                <div class="card-meta">
                  <span class="card-date">{{ formatDate(heading.releaseDate) }}</span>
                  <div class="card-tags" v-if="heading.tags && heading.tags.length">
                    <span
                      v-for="tag in heading.tags.slice(0, 2)"
                      :key="tag"
                      class="card-tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="empty-icon" />
            <h3>Nothing found</h3>
            <p>Check back soon.</p>
          </div>
        </div>
      </section>

      <!-- Devlogs Section -->
      <section v-show="activeTab === 'devlogs'" class="content-section animate-on-load">
        <h2 class="section-title">Development Logs</h2>
        <!-- Devlogs Grid -->
        <div class="content-grid">
          <!-- Loading State -->
          <div v-if="devlogsLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading devlogs...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="devlogsError" class="error-state">
            <p class="error-message">Failed to load devlogs: {{ devlogsError }}</p>
            <button @click="retryFetchDevlogs" class="cta-button secondary">Retry</button>
          </div>

          <!-- Devlogs List -->
          <div v-else-if="filteredDevlogs.length > 0" class="items-grid">
            <div
              v-for="devlog in filteredDevlogs"
              :key="devlog.id"
              class="content-card"
              @click="goToDevlog(devlog)"
            >
              <div class="card-image-container">
                <img
                  v-if="devlog.titleImage"
                  :src="devlog.titleImage"
                  :alt="`Thumbnail for ${devlog.title}`"
                  class="card-image"
                  @error="handleImageError(devlog.id, 'devlog')"
                />
                <div v-else class="card-placeholder">
                  <font-awesome-icon :icon="['fas', devlog.icon || 'terminal']" />
                </div>
              </div>
              <div class="card-info">
                <h3 class="card-title">{{ devlog.title }}</h3>
                <p class="card-excerpt">{{ devlog.excerpt }}</p>
                <div class="card-meta">
                  <span class="card-date">{{ formatDate(devlog.releaseDate) }}</span>
                  <div class="card-tags" v-if="devlog.tags && devlog.tags.length">
                    <span
                      v-for="tag in devlog.tags.slice(0, 2)"
                      :key="tag"
                      class="card-tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="empty-icon" />
            <h3>Nothing found</h3>
            <p>Check back soon.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import contentfulClient from '@/services/contentful';

// --- Interfaces ---
interface NewsPost {
  id: string;
  title: string;
  releaseDate: string;
  titleImage?: string;
  ppImages?: string[];
  textContent: any;
  type: string;
  tags: string[];
  slug: string;
  excerpt: string;
  icon?: string;
}

// --- Reactive State ---
const router = useRouter();
const route = useRoute();

const searchQuery = ref('');
const activeTab = ref<'posts' | 'headings' | 'devlogs'>('posts');
const activeCategory = ref<'all' | 'qna'>('all');

const posts = ref<NewsPost[]>([]);
const postsLoading = ref<boolean>(true);
const postsError = ref<string | null>(null);

const headings = ref<NewsPost[]>([]);
const headingsLoading = ref<boolean>(true);
const headingsError = ref<string | null>(null);

const devlogs = ref<NewsPost[]>([]);
const devlogsLoading = ref<boolean>(true);
const devlogsError = ref<string | null>(null);

let isInitialized = ref(false);

// --- Computed Properties ---
const filteredPosts = computed(() => {
  return filterPosts(posts.value);
});

const filteredHeadings = computed(() => {
  let result = filterPosts(headings.value);
  
  if (activeCategory.value !== 'all') {
    result = result.filter(post => 
      post.tags.some(tag => 
        tag.toLowerCase().includes('q&a') || 
        tag.toLowerCase().includes('faq') ||
        tag.toLowerCase().includes('qna')
      )
    );
  }
  
  return result;
});

const filteredDevlogs = computed(() => {
  return filterPosts(devlogs.value);
});

// --- Methods ---
const filterPosts = (postsList: NewsPost[]) => {
  if (!searchQuery.value.trim()) return postsList;
  
  const query = searchQuery.value.toLowerCase();
  return postsList.filter(post => 
    post.title.toLowerCase().includes(query) ||
    post.excerpt.toLowerCase().includes(query) ||
    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
  );
};

// Tab Switching
const switchTab = (tab: 'posts' | 'headings' | 'devlogs') => {
  activeTab.value = tab;
  updateURL();
  
  if (tab === 'posts' && posts.value.length === 0 && !postsLoading.value) {
    fetchPosts();
  } else if (tab === 'headings' && headings.value.length === 0 && !headingsLoading.value) {
    fetchHeadings();
  } else if (tab === 'devlogs' && devlogs.value.length === 0 && !devlogsLoading.value) {
    fetchDevlogs();
  }
};

const setActiveCategory = (category: 'all' | 'qna') => {
  activeCategory.value = category;
  updateURL();
};

// Date Formatting Helper
const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return 'Date unknown';
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
    console.error('Error parsing date:', error);
    return 'Invalid date format';
  }
};

const generateSlug = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

const extractTextFromRichText = (content: any): string => {
  if (!content) return '';
  
  const extractFromNode = (node: any): string => {
    if (!node) return '';
    
    if (node.nodeType === 'text' && node.value) {
      return node.value;
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractFromNode).join(' ');
    }
    
    return '';
  };
  
  try {
    let textContent = '';
    
    if (content.nodeType && content.content) {
      textContent = extractFromNode(content);
    } else if (content.json && content.json.content) {
      textContent = extractFromNode(content.json);
    } else if (typeof content === 'string') {
      const parsed = JSON.parse(content);
      textContent = extractFromNode(parsed);
    }
    
    return textContent.trim();
  } catch (error) {
    console.error('Error extracting text from rich text:', error);
    return '';
  }
};

const handleImageError = (id: string, type: 'post' | 'heading' | 'devlog') => {
  console.warn(`Failed to load image for ${type} ID: ${id}.`);
};

// --- API Calls ---
const fetchPosts = async () => {
  postsLoading.value = true;
  postsError.value = null;
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'newsPost',
      'fields.type[in]': 'News,Announcement,Update',
      order: ['-sys.createdAt']
    });

    const formattedPosts = response.items.map((item: any) => {
      const contentText = extractTextFromRichText(item.fields.textContent);
      const excerpt = contentText.length > 150 ? contentText.substring(0, 150) + '...' : contentText;
      
      return {
        id: item.sys.id,
        title: item.fields.title,
        releaseDate: item.fields.releaseDate,
        titleImage: item.fields.titleImage?.fields?.file?.url ? `https:${item.fields.titleImage.fields.file.url}` : undefined,
        ppImages: item.fields.ppImages?.map((img: any) => `https:${img.fields.file.url}`) || [],
        textContent: item.fields.textContent,
        type: item.fields.type,
        tags: item.fields.tags ? item.fields.tags.split(',').map((tag: string) => tag.trim()) : [],
        slug: generateSlug(item.fields.title),
        excerpt: excerpt,
        icon: 'newspaper'
      };
    });
    
    posts.value = formattedPosts;
  } catch (err: any) {
    console.error("Error fetching posts:", err);
    postsError.value = err.message || 'Failed to load news articles. Please try again later.';
  } finally {
    postsLoading.value = false;
  }
};

const fetchHeadings = async () => {
  headingsLoading.value = true;
  headingsError.value = null;
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'newsPost',
      'fields.type[in]': 'FAQ,Q&A',
      order: ['-sys.createdAt']
    });

    const formattedHeadings = response.items.map((item: any) => {
      const contentText = extractTextFromRichText(item.fields.textContent);
      const excerpt = contentText.length > 150 ? contentText.substring(0, 150) + '...' : contentText;
      
      return {
        id: item.sys.id,
        title: item.fields.title,
        releaseDate: item.fields.releaseDate,
        titleImage: item.fields.titleImage?.fields?.file?.url ? `https:${item.fields.titleImage.fields.file.url}` : undefined,
        ppImages: item.fields.ppImages?.map((img: any) => `https:${img.fields.file.url}`) || [],
        textContent: item.fields.textContent,
        type: item.fields.type,
        tags: item.fields.tags ? item.fields.tags.split(',').map((tag: string) => tag.trim()) : [],
        slug: generateSlug(item.fields.title),
        excerpt: excerpt,
        icon: 'question-circle'
      };
    });
    
    headings.value = formattedHeadings;
  } catch (err: any) {
    console.error("Error fetching headings:", err);
    headingsError.value = err.message || 'Failed to load Q&A articles. Please try again later.';
  } finally {
    headingsLoading.value = false;
  }
};

const fetchDevlogs = async () => {
  devlogsLoading.value = true;
  devlogsError.value = null;
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'newsPost',
      'fields.type': 'Devlog',
      order: ['-sys.createdAt']
    });

    const formattedDevlogs = response.items.map((item: any) => {
      const contentText = extractTextFromRichText(item.fields.textContent);
      const excerpt = contentText.length > 150 ? contentText.substring(0, 150) + '...' : contentText;
      
      return {
        id: item.sys.id,
        title: item.fields.title,
        releaseDate: item.fields.releaseDate,
        titleImage: item.fields.titleImage?.fields?.file?.url ? `https:${item.fields.titleImage.fields.file.url}` : undefined,
        ppImages: item.fields.ppImages?.map((img: any) => `https:${img.fields.file.url}`) || [],
        textContent: item.fields.textContent,
        type: item.fields.type,
        tags: item.fields.tags ? item.fields.tags.split(',').map((tag: string) => tag.trim()) : [],
        slug: generateSlug(item.fields.title),
        excerpt: excerpt,
        icon: 'book-open'
      };
    });
    
    devlogs.value = formattedDevlogs;
  } catch (err: any) {
    console.error("Error fetching devlogs:", err);
    devlogsError.value = err.message || 'Failed to load devlogs. Please try again later.';
  } finally {
    devlogsLoading.value = false;
  }
};

// --- Improved URL Synchronization ---
const updateURL = () => {
  if (!isInitialized.value) return;
  
  const query: any = { ...route.query };
  
  // Update tab parameter
  if (activeTab.value !== 'posts') {
    query.tab = activeTab.value;
  } else {
    delete query.tab;
  }
  
  // Update category parameter
  if (activeTab.value === 'headings' && activeCategory.value !== 'all') {
    query.category = activeCategory.value;
  } else {
    delete query.category;
  }
  
  // Update search parameter
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    query.search = searchQuery.value.trim();
  } else {
    delete query.search;
  }
  
  // Build new URL with current hash path and query parameters
  const currentPath = window.location.hash.split('?')[0] || '#/news';
  const searchParams = new URLSearchParams();
  
  Object.keys(query).forEach(key => {
    if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
      searchParams.set(key, query[key]);
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
  
  const urlTab = searchParams.get('tab');
  const urlSearch = searchParams.get('search');
  const urlCategory = searchParams.get('category');
  
  if (urlTab && ['posts', 'headings', 'devlogs'].includes(urlTab)) {
    activeTab.value = urlTab as 'posts' | 'headings' | 'devlogs';
  }
  
  if (urlSearch) {
    searchQuery.value = urlSearch;
  } else {
    searchQuery.value = '';
  }
  
  if (urlCategory && urlCategory === 'qna' && activeTab.value === 'headings') {
    activeCategory.value = 'qna';
  } else if (activeTab.value === 'headings') {
    activeCategory.value = 'all';
  }
};

let searchTimeout: number | null = null;
const onSearchInput = () => {
  if (searchTimeout !== null) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = window.setTimeout(() => {
    updateURL();
  }, 300);
};

const triggerSearch = async () => {
  updateURL();
  
  if (activeTab.value === 'posts' && posts.value.length === 0 && !postsLoading.value) {
    fetchPosts();
  } else if (activeTab.value === 'headings' && headings.value.length === 0 && !headingsLoading.value) {
    fetchHeadings();
  } else if (activeTab.value === 'devlogs' && devlogs.value.length === 0 && !devlogsLoading.value) {
    fetchDevlogs();
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  updateURL();
};

const retryFetchPosts = () => {
  fetchPosts();
};

const retryFetchHeadings = () => {
  fetchHeadings();
};

const retryFetchDevlogs = () => {
  fetchDevlogs();
};

const getPostPath = (post: NewsPost): string => {
  switch (post.type) {
    case 'News':
    case 'Announcement':
    case 'Update':
      return `/news/post/${post.slug}`;
    case 'FAQ':
    case 'Q&A':
      return `/news/heading/${post.slug}`;
    case 'Devlog':
      return `/news/devlog/${post.slug}`;
    default:
      return `/news/post/${post.slug}`;
  }
};

const goToPost = (post: NewsPost) => {
  const path = getPostPath(post);
  router.push(path);
};

const goToHeading = (heading: NewsPost) => {
  const path = getPostPath(heading);
  router.push(path);
};

const goToDevlog = (devlog: NewsPost) => {
  const path = getPostPath(devlog);
  router.push(path);
};

// --- Lifecycle Hooks ---
watch(
  () => route.query,
  () => {
    if (isInitialized.value) {
      syncStateFromURL();
    }
  },
  { immediate: false }
);

// Watch for browser back/forward navigation
watch(
  () => window.location.hash,
  () => {
    if (isInitialized.value) {
      syncStateFromURL();
    }
  }
);

onMounted(async () => {
  await nextTick();
  syncStateFromURL();
  isInitialized.value = true;
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    if (isInitialized.value) {
      syncStateFromURL();
    }
  });
  
  if (activeTab.value === 'posts') {
    fetchPosts();
  } else if (activeTab.value === 'headings') {
    fetchHeadings();
  } else {
    fetchDevlogs();
  }
});
</script>

<style scoped lang="scss">
.news {
  position: relative;
  min-height: calc(100vh - 200px);
  overflow: hidden;
}

.news-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
}

.hero-section {
  padding: 3rem 0;
  text-align: center;
  @media (max-width: 768px) {
    padding: 2rem 0;
  }
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-title {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  .brand-gradient {
    background: linear-gradient(135deg, #646cff, #535bf2);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 2s ease-in-out infinite alternate;
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

.hero-description {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

// --- Search Section Styles ---
.search-section {
  padding: 1.5rem 0;
  @media (max-width: 768px) {
    padding: 1rem 0;
  }
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.4);
  font-size: 1rem;
  z-index: 1;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.4);
  }
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: #646cff;
    box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.3);
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.2);
    color: black;

    &:focus {
      background: rgba(0, 0, 0, 0.1);
      border-color: #747bff;
      box-shadow: 0 0 0 2px rgba(116, 123, 255, 0.3);
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.5);
    }
  }
}

.clear-button {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      color: black;
    }
  }
}

// --- Tabs Section Styles ---
.tabs-section {
  padding: 1rem 0 2rem 0;
  text-align: center;
  @media (max-width: 768px) {
    padding: 1rem 0;
  }
}

.tabs-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.tab-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  text-decoration: none;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #646cff;
  }

  &--active {
    background: linear-gradient(135deg, #646cff, #535bf2);
    color: white;
    border-color: #535bf2;

    &:hover {
      background: linear-gradient(135deg, #535bf2, #4349e0);
    }
  }

  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.05);
    color: #213547;
    border-color: rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-color: #747bff;
    }

    &--active {
      background: linear-gradient(135deg, #747bff, #646cff);
      color: #ffffff;
      border-color: #646cff;

      &:hover {
        background: linear-gradient(135deg, #646cff, #535bf2);
      }
    }
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

// --- Improved Headings Categories Section ---
.headings-categories-section {
  padding: 0 0 2rem 0;
  display: flex;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 0 0 1.5rem 0;
  }
}

.headings-categories-container {
  max-width: 500px;
  width: 100%;
  padding: 0 1rem;
}

.headings-categories-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 40px rgba(100, 108, 255, 0.15);
    border-color: rgba(100, 108, 255, 0.2);
  }
  
  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
    
    &:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
      border-color: rgba(116, 123, 255, 0.2);
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 16px;
  }
}

.headings-categories-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  @media (prefers-color-scheme: light) {
    color: #213547;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.title-icon {
  font-size: 1rem;
  color: #646cff;
  
  @media (prefers-color-scheme: light) {
    color: #747bff;
  }
}

.headings-categories {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.category-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #646cff;
    color: white;
  }
  
  &.active {
    background: linear-gradient(135deg, #646cff, #535bf2);
    border-color: #535bf2;
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #535bf2, #4349e0);
    }
  }
  
  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.15);
    color: rgba(0, 0, 0, 0.7);
    
    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-color: #747bff;
      color: #213547;
    }
    
    &.active {
      background: linear-gradient(135deg, #747bff, #646cff);
      border-color: #646cff;
      color: white;
      
      &:hover {
        background: linear-gradient(135deg, #646cff, #535bf2);
      }
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
}

// --- Content Section Styles ---
.content-section {
  padding: 2rem 0 4rem 0;
  @media (max-width: 768px) {
    padding: 1.5rem 0 3rem 0;
  }
}

.section-title {
  text-align: center;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-bottom: 3rem;
  font-weight: 600;
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
}

// --- Content Grid Styles ---
.content-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  overflow: visible;
}

// --- Items Grid Styles ---
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

// --- Content Card Styles ---
.content-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    border-color: rgba(100, 108, 255, 0.3);
  }

  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.1);
    &:hover {
      border-color: rgba(116, 123, 255, 0.3);
    }
  }

  @media (max-width: 768px) {
    border-radius: 12px;
  }
}

.card-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(100, 108, 255, 0.05), rgba(83, 91, 242, 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  @media (max-width: 768px) {
    height: 160px;
  }
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;

  .content-card:hover & {
    transform: scale(1.05);
  }
}

.card-placeholder {
  font-size: 3rem;
  color: rgba(100, 108, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.card-info {
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

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: white;
  line-height: 1.3;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }

  @media (prefers-color-scheme: light) {
    color: #213547;
  }
}

.card-excerpt {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex-grow: 1;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  flex-shrink: 0;
}

.card-date {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);
  }
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.card-tag {
  background: rgba(100, 108, 255, 0.2);
  color: rgba(100, 108, 255, 1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;

  @media (prefers-color-scheme: light) {
    background: rgba(116, 123, 255, 0.15);
    color: #747bff;
  }
}

// --- States: Loading, Error, Empty ---
.loading-state,
.error-state,
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
    background: rgba(255, 255, 255, 0.5);
    border-color: rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
}

.loading-state p,
.error-state p,
.empty-state p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.error-message {
  color: #ff6b6b;
  font-weight: 500;
  margin-bottom: 1rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: rgba(100, 108, 255, 0.5);

  @media (prefers-color-scheme: light) {
    color: rgba(116, 123, 255, 0.5);
  }
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: white;

  @media (prefers-color-scheme: light) {
    color: #213547;
  }
}

// --- Button Styles ---
.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  text-decoration: none;
  justify-content: center;
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: #646cff;
    }
    
    @media (prefers-color-scheme: light) {
      background: rgba(0, 0, 0, 0.05);
      color: #213547;
      border-color: rgba(0, 0, 0, 0.2);
      
      &:hover {
        background: rgba(0, 0, 0, 0.1);
        border-color: #747bff;
      }
    }
  }
}

// --- Animations ---
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

.animate-on-load {
  animation: fadeInUp 0.5s ease-out;
}

// --- Mobile optimizations ---
@media (max-width: 768px) {
  .news {
    min-height: calc(100vh - 150px);
  }
}

</style>