// router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import your page components
import Home from '../src/views/HomeView.vue'
import Comments from '../src/views/CommentsView.vue'
import News from '../src/views/NewsView.vue'
import Me from '../src/views/MeView.vue'
import About from '../src/views/InfoView.vue'
import Projects from '../src/views/ProjectsView.vue'
import Contacts from '../src/views/ContactsView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'Home' } },
  { path: '/comments', name: 'Comments', component: Comments, meta: { title: 'Comments' } },
  { path: '/news', name: 'News', component: News, meta: { title: 'News' } },
  { path: '/me', name: 'Me', component: Me, meta: { title: 'Me' } },
  { path: '/about', name: 'About', component: About, meta: { title: 'About'} },
  { path: '/projects', name: 'Projects', component: Projects, meta: { title: 'Projects' } },
  { path: '/home/contacts', name: 'Contacts', component: Contacts, meta: { title: 'Contacts'} },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../src/views/NotFound.vue'), meta: { title: '404 - Page Not Found'} }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  // Corrected scrollBehavior: prefix unused parameters with '_'
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guard for updating page titles
// Corrected beforeEach: prefix unused parameter with '_'
router.beforeEach((to, _from, next) => {
  document.title = to.meta.title as string || 'ROlil Studio'
  next()
})

export default router