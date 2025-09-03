<!-- src/views/KnowledgeView.vue -->
<template>
  <div class="knowledge">
    <div class="knowledge-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Knowledge
            <span class="brand-gradient">Base</span>
          </h1>
          <p class="hero-description">
            Find guides, tutorials, and insights on our projects and tools. <a class="rainbow-shimmer">Search</a> our knowledge base to get the answers you need.
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
              placeholder="Search articles, guides, FAQs..."
              class="search-input"
              @input="onSearchInput"
            />
          </div>
        </div>
      </section>

      <!-- Posts Section -->
      <section class="posts-section">
        <h2 v-if="searchQuery" class="section-title">Search Results for "{{ searchQuery }}"</h2>
        <h2 v-else class="section-title">Latest Knowledge Articles</h2>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading knowledge base...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p class="error-message">Oops! Something went wrong: {{ error }}</p>
          <button @click="retrySearch" class="cta-button secondary">Retry</button>
        </div>

        <!-- Posts Grid -->
        <div v-else class="posts-grid-container">
          <div class="posts-grid">
            <!-- Post Cards -->
            <div
              v-for="post in displayedPosts"
              :key="post.id"
              class="post-card"
              :class="{ 
                'post-article': post.type === 'Article',
                'post-guide': post.type === 'Guide',
                'post-faq': post.type === 'FAQ'
              }"
              @click="goToPost(post)"
            >
              <div class="post-header">
                <div class="post-icon">
                  <font-awesome-icon :icon="getIconForPost(post)" />
                </div>
                <div class="post-type-badge" v-if="post.type">
                  {{ post.type }}
                </div>
              </div>
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ post.excerpt }}</p>
              <!-- Tags -->
              <div class="post-tags" v-if="post.tags && post.tags.length">
                <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="post-tag">{{ tag }}</span>
                <span v-if="post.tags.length > 3" class="post-tag more-tags">+{{ post.tags.length - 3 }} more</span>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="displayedPosts.length === 0 && !isLoading && searchQuery" class="empty-state">
              <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="empty-icon" />
              <h3>Nothing found</h3>
              <p>Try different keywords or reset filters.</p>
            </div>
            <div v-else-if="displayedPosts.length === 0 && !isLoading && !searchQuery" class="empty-state">
               <font-awesome-icon :icon="['fas', 'book-open']" class="empty-icon" />
              <h3>Knowledge Base is Growing</h3>
              <p>We are actively adding new articles and guides. Check back soon!</p>
            </div>
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

interface Post {
  id: string;
  title: string;
  excerpt: string;
  icon?: string;
  fontawesomeIcon?: string;
  tags: string[];
  slug: string;
  publishDate?: string;
  type?: 'Article' | 'Guide' | 'FAQ';
}

const router = useRouter();
const route = useRoute();

const searchQuery = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);
const posts = ref<Post[]>([]);
const isInitialized = ref(false);

// --- Computed Properties ---
const displayedPosts = computed(() => {
  if (searchQuery.value.trim() === '') {
    return posts.value.sort((a, b) => parseCustomDate(b.publishDate) - parseCustomDate(a.publishDate));
  }
  
  const query = searchQuery.value.toLowerCase();
  return posts.value
    .filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (post.type && post.type.toLowerCase().includes(query))
    )
    .sort((a, b) => parseCustomDate(b.publishDate) - parseCustomDate(a.publishDate));
});

const getIconForPost = (post: Post) => {
  if (post.fontawesomeIcon) {
    if (post.fontawesomeIcon.includes(' ')) {
      const parts = post.fontawesomeIcon.split(' ');
      const prefix = parts[0].replace('fa-', '').replace('fa', 'fas');
      const iconName = parts[1] ? parts[1].replace('fa-', '') : parts[0].replace('fa-', '');
      return [prefix, iconName];
    }
    const iconName = post.fontawesomeIcon.replace('fa-', '');
    return ['fas', iconName];
  }
  
  switch (post.type) {
    case 'Guide':
      return ['fas', 'compass'];
    case 'FAQ':
      return ['fas', 'question-circle'];
    case 'Article':
    default:
      return ['fas', 'file-lines'];
  }
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

// --- Improved URL Synchronization (like in NewsView.vue) ---
const updateURL = () => {
  if (!isInitialized.value) return;
  
  const query: any = { ...route.query };
  
  // Update search parameter
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    query.search = searchQuery.value.trim();
  } else {
    delete query.search;
  }
  
  // Build new URL with current hash path and query parameters
  const currentPath = window.location.hash.split('?')[0] || '#/knowledge';
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

const syncSearchFromURL = () => {
  const hashParts = window.location.hash.split('?');
  const searchParams = new URLSearchParams(hashParts[1] || '');
  
  const urlSearch = searchParams.get('search');
  
  if (urlSearch) {
    searchQuery.value = urlSearch;
  } else {
    searchQuery.value = '';
  }
};

// --- Methods ---
let searchTimeout = ref<number | null>(null);
const onSearchInput = () => {
  if (searchTimeout.value !== null) {
    clearTimeout(searchTimeout.value);
  }
  searchTimeout.value = window.setTimeout(() => {
    updateURL();
  }, 300); // 300ms debounce
};

const retrySearch = () => {
  fetchPostsFromCMS();
};

const getPostPath = (post: Post): string => {
  const baseSlug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  
  switch (post.type) {
    case 'Guide':
      return `/knowledge/guide/${baseSlug}`;
    case 'FAQ':
      return `/knowledge/faq/${baseSlug}`;
    case 'Article':
    default:
      return `/knowledge/article/${baseSlug}`;
  }
};

const goToPost = (post: Post) => {
  const path = getPostPath(post);
  router.push(path);
};

const parseCustomDate = (dateStr: string | undefined): number => {
  if (!dateStr) return 0;
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  } catch (error) {
    console.error('Error parsing date:', error);
    return 0;
  }
};

const fetchPostsFromCMS = async (): Promise<void> => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await contentfulClient.getEntries({
      content_type: 'knowledgePost',
      order: ['-sys.createdAt']
    });

    const formattedPosts: Post[] = response.items.map((item: any) => {
      const contentText = extractTextFromRichText(item.fields.textContent);
      
      const excerpt = contentText.length > 150 
        ? contentText.substring(0, 150) + '...' 
        : contentText || 'No content available';
      
      const slug = item.fields.slug || 
                   item.fields.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      return {
        id: item.sys.id,
        title: item.fields.title,
        excerpt: excerpt,
        icon: item.fields.icon?.fields?.name || 'file-lines',
        fontawesomeIcon: item.fields.fontawesomeIcon,
        tags: item.fields.tags || [],
        slug: slug,
        publishDate: item.sys.createdAt,
        type: item.fields.type || 'Article'
      };
    });
    
    posts.value = formattedPosts;
  } catch (err: any) {
    console.error("Error fetching posts from CMS:", err);
    if (err?.response?.status === 422) {
      error.value = "Content structure error: Please check if the required fields exist in Contentful.";
    } else {
      error.value = err.message || 'Failed to load articles. Please try again later.';
    }
  } finally {
    isLoading.value = false;
  }
};

// --- Lifecycle Hooks ---
watch(
  () => window.location.hash,
  () => {
    if (isInitialized.value) {
      syncSearchFromURL();
    }
  }
);

// Watch for browser back/forward navigation
onMounted(async () => {
  await nextTick();
  syncSearchFromURL();
  isInitialized.value = true;
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    if (isInitialized.value) {
      syncSearchFromURL();
    }
  });
  
  // Загружаем посты
  await fetchPostsFromCMS();
});
</script>

<style scoped lang="scss">
.knowledge {
  position: relative;
  min-height: calc(100vh - 200px);
  overflow: hidden;
}

.knowledge-content {
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

.search-section {
  padding: 2rem 0;
  @media (max-width: 768px) {
    padding: 1.5rem 0;
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

.posts-section {
  padding: 2rem 0 4rem 0;
  @media (max-width: 768px) {
    padding: 1.5rem 0 3rem 0;
  }
}

.section-title {
  text-align: center;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  margin-bottom: 2rem;
  font-weight: 600;
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
}

.posts-grid-container {
  max-width: 100%;
  overflow-x: auto;
  padding: 0 1rem;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(100, 108, 255, 0.5);
    border-radius: 4px;
    
    &:hover {
      background: rgba(100, 108, 255, 0.7);
    }
  }
}

.posts-grid {
  display: flex;
  gap: 2rem;
  min-width: fit-content;
  padding-bottom: 1rem;
  
  @media (min-width: 1200px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    max-width: 1200px;
    margin: 0 auto;
  }
  
  @media (max-width: 640px) {
    gap: 1.5rem;
  }
}

.post-card {
  flex: 0 0 320px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  text-align: left;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #646cff, #535bf2);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }

  &:hover {
    border-color: rgba(100, 108, 255, 0.3);

    &::before {
      transform: scaleX(1);
    }
  }

  &.post-guide {
    &::before {
      background: linear-gradient(90deg, #10b981, #059669);
    }
    
    .post-type-badge {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }
    
    .post-icon {
      color: #10b981;
    }
  }

  &.post-faq {
    &::before {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }
    
    .post-type-badge {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
    }
    
    .post-icon {
      color: #f59e0b;
    }
  }

  &.post-article {
    &::before {
      background: linear-gradient(90deg, #646cff, #535bf2);
    }
    
    .post-type-badge {
      background: rgba(100, 108, 255, 0.15);
      color: #646cff;
    }
    
    .post-icon {
      color: #646cff;
    }
  }

  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(0, 0, 0, 0.1);
    
    &:hover {
      border-color: rgba(116, 123, 255, 0.3);
    }
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    flex: 0 0 280px;
  }
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.post-icon {
  font-size: 2rem;
  color: #646cff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  background: rgba(100, 108, 255, 0.1);
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
    width: 2.5rem;
    height: 2.5rem;
  }
}

.post-type-badge {
  background: rgba(100, 108, 255, 0.15);
  color: #646cff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: white;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (prefers-color-scheme: light) {
    color: #213547;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
}

.post-excerpt {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
  
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.post-tag {
  background: rgba(100, 108, 255, 0.15);
  color: #646cff;
  padding: 0.3rem 0.6rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(100, 108, 255, 0.25);
    transform: translateY(-1px);
  }

  &.more-tags {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    
    @media (prefers-color-scheme: light) {
      background: rgba(0, 0, 0, 0.05);
      color: rgba(0, 0, 0, 0.7);
    }
  }

  @media (prefers-color-scheme: light) {
    background: rgba(100, 108, 255, 0.1);
    color: #535bf2;
    
    &:hover {
      background: rgba(100, 108, 255, 0.2);
    }
  }
}

.loading-state,
.error-state,
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 1rem;
  
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
    background: rgba(255, 255, 255, 0.5);
    border-color: rgba(0, 0, 0, 0.1);
  }
}

.loading-state p,
.error-state p,
.empty-state p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.error-message {
  color: #ef4444;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.cta-button {
  background: linear-gradient(135deg, #646cff, #535bf2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(100, 108, 255, 0.3);
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    @media (prefers-color-scheme: light) {
      background: rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.2);
      color: #213547;
      
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: rgba(100, 108, 255, 0.4);
}

.empty-state h3 {
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  
  @media (prefers-color-scheme: light) {
    color: #213547;
  }
}

.empty-state p {
  font-size: 1.1rem;
  opacity: 0.8;
}

@media (max-width: 1199px) {
  .posts-grid {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 768px) {
  .posts-grid-container {
    padding: 0 0.5rem;
  }
  
  .posts-grid {
    gap: 1rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .post-card {
    flex: 0 0 280px;
    padding: 1rem;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
    padding: 2rem 1rem;
    margin: 0 0.5rem;
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

@media (prefers-color-scheme: light) {
  .posts-grid-container {
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(100, 108, 255, 0.4);
      
      &:hover {
        background: rgba(100, 108, 255, 0.6);
      }
    }
  }
}
</style>