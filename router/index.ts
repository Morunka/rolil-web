import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import your page components
import Home from '../src/views/HomeView.vue'
import News from '../src/views/NewsView.vue'
import Community from '../src/views/CommunityView.vue'
import Me from '../src/views/MeView.vue'
import Story from '../src/views/StoryView.vue'
import Projects from '../src/views/ProjectsView.vue'
import NotFound from '../src/views/NotFound.vue'
import MoreProjectsView from '../src/views/MoreProjectsView.vue'
import Team from '../src/views/TeamView.vue'
import Feedback from '../src/views/FeedbackView.vue'
import Jobs from '../src/views/JobsView.vue'
import About from '../src/views/AboutView.vue'
import Knowledge from '../src/views/KnowledgeView.vue'
import Contact from '../src/views/ContactView.vue'
import KnowledgeArticleView from '../src/components/KnowledgeArticle.vue'
import Gallery from '../src/views/GalleryView.vue'

const routes: RouteRecordRaw[] = [
  // Redirect rules
  { path: '/', redirect: '/home' },
  { path: '/knowledge/article', redirect: '/knowledge?search=article' },
  { path: '/knowledge/guide', redirect: '/knowledge?search=guide' },
  { path: '/knowledge/faq', redirect: '/knowledge?search=faq' },
  
  // Main routes
  { path: '/home', name: 'Home', component: Home, meta: { title: 'Home' } },
  { path: '/news', name: 'News', component: News, meta: { title: 'News' } },
  { path: '/community', name: 'Community', component: Community, meta: { title: 'Community' } },
  { path: '/me', name: 'Me', component: Me, meta: { title: 'Me' } },
  { path: '/story', name: 'Story', component: Story, meta: { title: 'Story'} },
  { path: '/projects', name: 'Projects', component: Projects, meta: { title: 'Projects' } },
  { path: '/more-projects', name: 'More projects', component: MoreProjectsView, meta: { title: 'More projects'} },
  { path: '/team', name: 'Team', component: Team, meta: { title: 'Team'} },
  { path: '/feedback', name: 'Feedback', component: Feedback, meta: { title: 'Feedback'} },
  { path: '/about', name: 'About', component: About, meta: { title: 'About'} },
  { path: '/jobs', name: 'Jobs', component: Jobs, meta: { title: 'Jobs'} },
  { path: '/contact', name: 'Contact', component: Contact, meta: { title: 'Contact'} },
  { path: '/gallery', name: 'Gallery', component: Gallery, meta: { title: 'Gallery'} },
  
  // Knowledge base routes
  { path: '/knowledge', name: 'Knowledge', component: Knowledge, meta: { title: 'Knowledge'} },
  
  // Knowledge article routes - specific types
  { 
    path: '/knowledge/article/:slug', 
    name: 'KnowledgeArticle', 
    component: KnowledgeArticleView, 
    meta: { title: 'Article', type: 'Article' } 
  },
  { 
    path: '/knowledge/guide/:slug', 
    name: 'KnowledgeGuide', 
    component: KnowledgeArticleView, 
    meta: { title: 'Guide', type: 'Guide' } 
  },
  { 
    path: '/knowledge/faq/:slug', 
    name: 'KnowledgeFAQ', 
    component: KnowledgeArticleView, 
    meta: { title: 'FAQ', type: 'FAQ' } 
  },

  // News routes
  { 
    path: '/news/post/:slug', 
    name: 'NewsPost', 
    component: KnowledgeArticleView, 
    meta: { title: 'News Post', type: 'News' } 
  },
  { 
    path: '/news/devlog/:slug', 
    name: 'Devlog', 
    component: KnowledgeArticleView, 
    meta: { title: 'Devlog', type: 'Devlog' } 
  },
  
  // 404 - должен быть последним
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: 'Not Found'} }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guard for updating page titles
router.beforeEach((to, _from, next) => {
  // Для всех типов статей используем только заголовок из CMS
  if (to.name === 'Article' || to.name === 'Guide' || to.name === 'FAQ' ||
      to.name === 'NewsPost' || to.name === 'Devlog') {
    const articleTitle = to.params.title as string;
    document.title = articleTitle ? articleTitle : 'Article';
  } else {
    document.title = to.meta.title as string || 'Article';
  }
  next();
})

export default router