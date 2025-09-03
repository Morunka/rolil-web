<template>
  <div class="knowledge-article">
    <div class="article-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 v-if="article" class="hero-title">{{ article.title }}</h1>
          <div v-if="article" class="article-meta">
            <span class="publish-date">{{ formatPublishDate(article.publishDate) }}</span>
            <div class="article-type" v-if="article.type">
              <span class="type-badge" :class="getTypeBadgeClass(article.type)">{{ article.type }}</span>
            </div>
            <div class="article-tags" v-if="article.tags && article.tags.length">
              <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Article Content -->
      <section class="article-body">
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading article...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p class="error-message">Oops! Something went wrong: {{ error }}</p>
          <button @click="retryLoad" class="cta-button secondary">Retry</button>
        </div>

        <div v-else-if="article" class="content-container">
          <!-- Render the rich text content from Contentful -->
          <div class="rich-text-content" v-html="renderRichText(article.content)"></div>
          
          <!-- Back to appropriate section button -->
          <div class="back-button-container">
            <button @click="goBack" class="back-button">
              <font-awesome-icon :icon="['fas', 'arrow-left']" />
              {{ getBackButtonText() }}
            </button>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <font-awesome-icon :icon="['fas', 'file-alt']" />
          <h3>Article Not Found</h3>
          <p>The requested article could not be found.</p>
          <button @click="goBack" class="cta-button">Back to Knowledge Base</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import contentfulClient from '@/services/contentful';

type NodeType = 
  | 'document'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'heading-5'
  | 'heading-6'
  | 'paragraph'
  | 'unordered-list'
  | 'ordered-list'
  | 'list-item'
  | 'hr'
  | 'blockquote'
  | 'hyperlink'
  | 'text'
  | 'embedded-asset-block';

interface NodeData {
  uri?: string;
  target?: {
    sys?: {
      id?: string;
      type?: string;
      linkType?: string;
    };
  };
  [key: string]: any;
}

interface ContentNode {
  nodeType: NodeType;
  data?: NodeData;
  content?: ContentNode[];
  value?: string;
  marks?: Array<{ type: string }>;
}

interface RichTextContent {
  nodeType: 'document';
  data: Record<string, any>;
  content: ContentNode[];
}

interface Article {
  id: string;
  title: string;
  content: RichTextContent;
  tags: string[];
  publishDate: string;
  slug: string;
  type?: 'Article' | 'Guide' | 'FAQ' | 'News' | 'Devlog';
  contentType: 'knowledge' | 'news';
}

const router = useRouter();
const route = useRoute();

const article = ref<Article | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Определяем тип контента на основе пути
const currentContentType = computed((): 'knowledge' | 'news' => {
  const path = route.path;
  if (path.startsWith('/news/post') || path.startsWith('/news/devlog')) {
    return 'news';
  }
  return 'knowledge';
});

// Определяем тип статьи
const currentType = computed((): string => {
  const routeName = route.name as string;
  if (routeName === 'KnowledgeGuide') return 'Guide';
  if (routeName === 'KnowledgeFAQ') return 'FAQ';
  if (routeName === 'NewsPost') return 'News';
  if (routeName === 'Devlog') return 'Devlog';
  return 'Article';
});

// Получаем текущий slug
const currentSlug = computed(() => route.params.slug as string);

// Форматируем дату публикации
const formatPublishDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Получаем класс для бейджа типа
const getTypeBadgeClass = (type?: string) => {
  switch (type) {
    case 'Guide':
      return 'type-guide';
    case 'FAQ':
      return 'type-faq';
    case 'News':
      return 'type-news';
    case 'Devlog':
      return 'type-devlog';
    case 'Article':
    default:
      return 'type-article';
  }
};

// Генератор ID для блоков кода
let codeBlockCounter = 0;

// Функция для копирования в буфер обмена
const copyToClipboard = async (text: string, elementId: string) => {
  try {
    await navigator.clipboard.writeText(text);
    const button = document.getElementById(`copy-btn-${elementId}`);
    if (button) {
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    }
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

// Рендеринг rich text контента
const renderRichText = (content: RichTextContent): string => {
  if (!content || !content.content) return '';
  
  const renderNode = (node: ContentNode): string => {
    if (!node) return '';
    
    if (node.nodeType === 'text') {
      let text = node.value || '';
      
      if (node.marks && node.marks.length > 0) {
        for (const mark of node.marks) {
          switch (mark.type) {
            case 'bold':
              text = `<strong>${text}</strong>`;
              break;
            case 'italic':
              text = `<em>${text}</em>`;
              break;
            case 'underline':
              text = `<u>${text}</u>`;
              break;
            case 'code':
              const codeId = `code-${++codeBlockCounter}`;
              text = `
                <code class="code-container code">
                  <a class="fix-font code">${text}</a>
                  <button id="copy-btn-${codeId}" class="copy-button" onclick="copyToClipboard('${text.replace(/'/g, "\\'")}', '${codeId}')">Copy</button>
                </code>
              `;
              break;
          }
        }
      }
      
      return text;
    }
    
    const childContent = node.content ? node.content.map(renderNode).join('') : '';
    
    switch (node.nodeType) {
      case 'document':
        return childContent;
      case 'heading-1':
        return `<h1>${childContent}</h1>`;
      case 'heading-2':
        return `<h2>${childContent}</h2>`;
      case 'heading-3':
        return `<h3>${childContent}</h3>`;
      case 'heading-4':
        return `<h4>${childContent}</h4>`;
      case 'heading-5':
        return `<h5>${childContent}</h5>`;
      case 'heading-6':
        return `<h6>${childContent}</h6>`;
      case 'paragraph':
        return `<p>${childContent}</p>`;
      case 'unordered-list':
        return `<ul>${childContent}</ul>`;
      case 'ordered-list':
        return `<ol>${childContent}</ol>`;
      case 'list-item':
        return `<li>${childContent}</li>`;
      case 'hr':
        return '<hr>';
      case 'blockquote':
        return `<blockquote>${childContent}</blockquote>`;
      case 'hyperlink':
        const uri = node.data?.uri || '#';
        return `<a href="${uri}" target="_blank" rel="noopener noreferrer" class="fix-font">${childContent}</a>`;
      case 'embedded-asset-block':
        // Обработка изображений из Contentful
        const assetId = node.data?.target?.sys?.id;
        if (assetId && (window as any).contentfulAssets?.[assetId]) {
          const asset = (window as any).contentfulAssets[assetId];
          const imageUrl = asset.url;
          const imageTitle = asset.title || '';
          const imageDescription = asset.description || '';
          
          return `
            <div class="image-container">
              <img 
                src="${imageUrl}" 
                alt="${imageDescription || imageTitle || 'Image'}"
                title="${imageTitle || ''}"
                class="article-image"
              />
              ${imageDescription ? `<p class="image-caption">${imageDescription}</p>` : ''}
            </div>
          `;
        }
        return '';
      default:
        return childContent;
    }
  };
  
  return content.content.map(renderNode).join('');
};

// Функция для получения текста кнопки "Назад"
const getBackButtonText = (): string => {
  const type = currentType.value;
  if (type === 'News' || type === 'Devlog') {
    return 'Back to News';
  }
  return 'Back to Knowledge Base';
};

// Функция для получения пути возврата
const getBackPath = (): string => {
  const type = currentType.value;
  if (type === 'News' || type === 'Devlog') {
    return '/news';
  }
  return '/knowledge';
};

// Основная функция загрузки статьи
const fetchArticle = async (): Promise<void> => {
  isLoading.value = true;
  error.value = null;
  article.value = null;

  try {
    const requestedSlug = currentSlug.value;
    const contentType = currentContentType.value;
    
    console.log(`Fetching ${contentType} with slug: ${requestedSlug}`);
    
    // Загружаем записи в зависимости от типа контента
    const response = await contentfulClient.getEntries({
      content_type: contentType === 'knowledge' ? 'knowledgePost' : 'newsPost',
      limit: 100,
      include: 2
    });

    console.log('Contentful response:', response);

    // Сохраняем ассеты
    const assetsMap: Record<string, any> = {};
    if (response.includes?.Asset) {
      response.includes.Asset.forEach(asset => {
        assetsMap[asset.sys.id] = {
          url: asset.fields.file?.url ? `https:${asset.fields.file.url}` : '',
          title: asset.fields.title || '',
          description: asset.fields.description || ''
        };
      });
    }
    
    // Делаем ассеты доступными
    (window as any).contentfulAssets = assetsMap;

    // Поиск статьи
    let foundItem = null;
    
    // Поиск по slug из Contentful
    foundItem = response.items.find(item => {
      const itemSlug = item.fields.slug ? String(item.fields.slug).toLowerCase() : '';
      let itemType = '';
      
      // Определяем тип в зависимости от контента
      if (contentType === 'knowledge') {
        itemType = item.fields.type ? String(item.fields.type).charAt(0).toUpperCase() + String(item.fields.type).slice(1) : 'Article';
      } else {
        itemType = item.fields.type ? String(item.fields.type) : 'news';
      }
      
      const slugMatch = itemSlug === requestedSlug;
      const typeMatch = 
        (contentType === 'knowledge' && itemType === currentType.value) ||
        (contentType === 'news' && 
          ((currentType.value === 'News' && itemType.toLowerCase() === 'news') || 
           (currentType.value === 'Devlog' && itemType.toLowerCase() === 'devlog')));
      
      return slugMatch && typeMatch;
    });
    
    // Если не найдено по полю slug, пробуем генерировать slug из title
    if (!foundItem) {
      foundItem = response.items.find(item => {
        const itemTitle = typeof item.fields.title === 'string' ? item.fields.title : '';
        const itemSlug = itemTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        let itemType = '';
        
        if (contentType === 'knowledge') {
          itemType = item.fields.type ? String(item.fields.type).charAt(0).toUpperCase() + String(item.fields.type).slice(1) : 'Article';
        } else {
          itemType = item.fields.type ? String(item.fields.type) : 'news';
        }
        
        const slugMatch = itemSlug === requestedSlug;
        const typeMatch = 
          (contentType === 'knowledge' && itemType === currentType.value) ||
          (contentType === 'news' && 
            ((currentType.value === 'News' && itemType.toLowerCase() === 'news') || 
             (currentType.value === 'Devlog' && itemType.toLowerCase() === 'devlog')));
        
        return slugMatch && typeMatch;
      });
    }

    if (!foundItem) {
      throw new Error(`${currentType.value} not found for slug: ${requestedSlug}`);
    }

    const item = foundItem;
    
    // Обработка контента
    let content: RichTextContent = { 
      nodeType: 'document', 
      data: {}, 
      content: [] 
    };
    
    const possibleContentFields = ['textContent', 'TextContent', 'content', 'richText', 'body', 'articleBody'];
    let contentField = null;
    
    for (const fieldName of possibleContentFields) {
      if (item.fields[fieldName]) {
        contentField = item.fields[fieldName];
        break;
      }
    }
    
    if (!contentField) {
      content = {
        nodeType: 'document',
        data: {},
        content: [{
          nodeType: 'paragraph',
          content: [{
            nodeType: 'text',
            value: `Content for ${item.fields.title} is not available.`
          }]
        }]
      };
    } else {
      if (typeof contentField === 'object' && contentField.nodeType) {
        content = contentField as RichTextContent;
      }
      else if (typeof contentField === 'object' && 'json' in contentField) {
        const jsonContent = contentField.json as any;
        content = {
          nodeType: jsonContent.nodeType || 'document',
          data: jsonContent.data || {},
          content: jsonContent.content || []
        };
      }
      else if (typeof contentField === 'string') {
        try {
          const parsedContent = JSON.parse(contentField);
          content = {
            nodeType: parsedContent.nodeType || 'document',
            data: parsedContent.data || {},
            content: parsedContent.content || []
          };
        } catch (e) {
          content = {
            nodeType: 'document',
            data: {},
            content: [{
              nodeType: 'paragraph',
              content: [{
                nodeType: 'text',
                value: contentField
              }]
            }]
          };
        }
      }
    }
    
    // Обработка тегов
    let tags: string[] = [];
    if (item.fields.tags) {
      if (Array.isArray(item.fields.tags)) {
        tags = item.fields.tags as string[];
      } else if (typeof item.fields.tags === 'string') {
        tags = item.fields.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      }
    }
    
    // Формирование данных статьи
    const title = typeof item.fields.title === 'string' ? item.fields.title : 'Untitled Article';
    const articleSlug = item.fields.slug ? 
      String(item.fields.slug) : 
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    let articleType = '';
    if (contentType === 'knowledge') {
      articleType = item.fields.type ? 
        (String(item.fields.type).charAt(0).toUpperCase() + String(item.fields.type).slice(1)) as 'Article' | 'Guide' | 'FAQ' : 
        'Article';
    } else {
      articleType = item.fields.type ? 
        (String(item.fields.type).toLowerCase() === 'devlog' ? 'Devlog' : 'News') : 
        'News';
    }

    const articleData: Article = {
      id: item.sys.id,
      title,
      content,
      tags,
      publishDate: item.sys.createdAt,
      slug: articleSlug,
      type: articleType,
      contentType: contentType
    };

    article.value = articleData;
  } catch (err: any) {
    console.error("Error fetching article:", err);
    error.value = err.message || 'Failed to load article. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

// Повторная загрузка
const retryLoad = () => {
  fetchArticle();
};

// Возврат назад
const goBack = () => {
  router.push(getBackPath());
};

// Следим за изменениями параметров маршрута
watch([currentSlug, currentType, currentContentType], ([newSlug, newType, newContentType], [oldSlug, oldType, oldContentType]) => {
  if (newSlug !== oldSlug || newType !== oldType || newContentType !== oldContentType) {
    fetchArticle();
  }
}, { immediate: false });

// Загрузка при монтировании
onMounted(async () => {
  await fetchArticle();
  (window as any).copyToClipboard = copyToClipboard;
});
</script>

<style scoped lang="scss">
.knowledge-article {
  position: relative;
  min-height: calc(100vh - 200px);
  overflow-x: hidden;
  overflow-y: hidden;
}

.article-content {
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
  color: white;
  @media (prefers-color-scheme: light) {
    color: #213547;
  }
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 2rem;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);
  }
}

.publish-date {
  white-space: nowrap;
}

.article-type {
  display: flex;
  align-items: center;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &.type-guide {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }
  
  &.type-faq {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }
  
  &.type-news {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }
  
  &.type-devlog {
    background: rgba(139, 92, 246, 0.15);
    color: #8b5cf6;
  }
  
  &.type-article {
    background: rgba(100, 108, 255, 0.15);
    color: #646cff;
  }
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: rgba(100, 108, 255, 0.15);
  color: #646cff;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  @media (prefers-color-scheme: light) {
    background: rgba(100, 108, 255, 0.1);
    color: #535bf2;
  }
}

.article-body {
  padding: 2rem 0;
  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.rich-text-content {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  font-size: 1.1rem;
  
  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    margin: 2rem 0 1rem 0;
    color: white;
    @media (prefers-color-scheme: light) {
      color: #213547;
    }
  }
  
  :deep(h1) {
    font-size: 2.5rem;
    margin-top: 3rem;
  }
  
  :deep(h2) {
    font-size: 2rem;
    margin-top: 2.5rem;
  }
  
  :deep(h3) {
    font-size: 1.75rem;
    margin-top: 2rem;
  }
  
  :deep(p) {
    margin-bottom: 1.5rem;
  }
  
  :deep(ul), :deep(ol) {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }
  
  :deep(li) {
    margin-bottom: 0.5rem;
  }
  
  :deep(a) {
    color: #646cff;
    text-decoration: underline;
    &:hover {
      color: #535bf2;
    }
  }
  
  :deep(blockquote) {
    margin: 2rem 0;
    padding: 1rem 1.5rem;
    border-left: 4px solid #646cff;
    background: rgba(100, 108, 255, 0.1);
    font-style: italic;
  }
  
  :deep(hr) {
    margin: 3rem 0;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  :deep(strong) {
    font-weight: 600;
    color: white;
    @media (prefers-color-scheme: light) {
      color: #213547;
    }
  }

  :deep(em) {
    font-style: italic;
  }

  :deep(code) {
    position: relative;
    background: rgba(100, 108, 255, 0.15);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Fira Code', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    font-size: 0.9em;
  }

  :deep(.code-container) {
    position: relative;
    display: inline-block;

    .copy-button {
      position: absolute;
      top: -2px;
      right: -2px;
      background: rgba(100, 108, 255, 0.8);
      color: white;
      border: none;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.7rem;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 10;

      &:hover {
        background: rgba(100, 108, 255, 1);
      }
    }

    &:hover .copy-button {
      opacity: 1;
    }
  }

  :deep(.fix-font) {
    font-family: inherit;
  }
  
  :global(.image-container) {
    margin: 2rem 0;
    text-align: center;
    
    .article-image {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      display: block;
      margin: 0 auto;
    }
    
    .image-caption {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      font-style: italic;
      
      @media (prefers-color-scheme: light) {
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
  
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.8);
    
    :deep(a) {
      color: #535bf2;
    }
    
    :deep(blockquote) {
      background: rgba(100, 108, 255, 0.05);
    }
    
    :deep(hr) {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .image-caption {
      color: rgba(0, 0, 0, 0.6);
    }
  }
}

.back-button-container {
  margin-top: 3rem;
  text-align: center;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #646cff;
  }
  
  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
    color: #213547;
    
    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-color: #747bff;
    }
  }
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.error-message {
  color: #ff6b6b;
  font-weight: 500;
  margin-bottom: 1rem;
}

.empty-state {
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: rgba(100, 108, 255, 0.4);
  }
  
  h3 {
    margin-bottom: 0.5rem;
    color: white;
    @media (prefers-color-scheme: light) {
      color: #213547;
    }
  }
  
  .cta-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: rgba(100, 108, 255, 0.15);
    border: 1px solid rgba(100, 108, 255, 0.3);
    color: #646cff;
    border-radius: 8px;
    cursor: pointer;
    
    &:hover {
      background: rgba(100, 108, 255, 0.25);
    }
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
</style>