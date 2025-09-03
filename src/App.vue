<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderUp from './components/HeaderUp.vue';

const router = useRouter();
const route = useRoute();

const secretImagePath = new URL('@/assets/stickers/golden_rolil.png', import.meta.url).href;

const openStickerSet = () => {
  window.open('https://t.me/addstickers/ByROlilStudio', '_blank');
};

// --- Active Section Tracking ---
const activeSection = ref('');

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    });
  }
};

const updateActiveSection = () => {
  const sections = pageContent.value.sections;
  const scrollPosition = window.scrollY + 150; // Offset for header
  
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    const element = document.getElementById(section.id);
    if (element && element.offsetTop <= scrollPosition) {
      activeSection.value = section.id;
      break;
    }
  }
};

watch(route, () => {
  setTimeout(() => {
    updateActiveSection();
  }, 100);
});

// --- Page Content Structure ---
const pageContent = computed(() => {
  const currentPath = route.path;
  
  const contentMap: Record<string, any> = {
    '/': {
      title: 'Contents',
      sections: [
        { name: 'Welcome', id: 'hero' },
        { name: 'About Us', id: 'stats' },
        { name: 'What We Do', id: 'features' },
        { name: 'What We Use', id: 'tools' },
        { name: 'Latest Videos', id: 'video' },
        { name: 'Get in Touch', id: 'cta' }
      ]
    },
    '/about': {
      title: 'About Us',
      sections: [
        { name: 'Our Story', id: 'story' },
        { name: 'Team', id: 'team' },
        { name: 'Mission', id: 'mission' }
      ]
    },
    '/projects': {
      title: 'Projects',
      sections: [
        { name: 'Current Projects', id: 'current' },
        { name: 'Completed', id: 'completed' },
        { name: 'Upcoming', id: 'upcoming' }
      ]
    },
    '/games': {
      title: 'Games',
      sections: [
        { name: 'Featured Games', id: 'featured' },
        { name: 'Indie Collection', id: 'indie' },
        { name: 'Game Development', id: 'development' }
      ]
    },
    '/news': {
      title: 'News',
      sections: [
        { name: 'Latest Updates', id: 'latest' },
        { name: 'Announcements', id: 'announcements' },
        { name: 'Development Blog', id: 'blog' }
      ]
    },
    '/gallery': {
      title: 'Gallery',
      sections: [
        { name: 'Screenshots', id: 'screenshots' },
        { name: 'Artwork', id: 'artwork' },
        { name: 'Behind the Scenes', id: 'behind' }
      ]
    },
    '/comments': {
      title: 'Comments',
      sections: [
        { name: 'Recent Comments', id: 'recent' },
        { name: 'Leave Feedback', id: 'feedback' },
        { name: 'Community', id: 'community' }
      ]
    },
    '/contact': {
      title: 'Contact',
      sections: [
        { name: 'Get in Touch', id: 'contact' },
        { name: 'Social Media', id: 'social' },
        { name: 'Support', id: 'support' }
      ]
    },
    '/feedback': { // NEW: Add the new feedback page
      title: 'Feedback',
      sections: [
        { name: 'Share Ideas', id: 'feedback' }
      ]
    }
  };

  return contentMap[currentPath] || contentMap['/'];
});

// --- User Activity Tracking Logic ---
let startTime: number | null = null;
interface ActivityEntry {
  date: string;
  durationMs: number;
}
let activityData: ActivityEntry[] = [];

(window as any).addHoursToday = (hours: number) => {
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const durationToAddMs = hours * 60 * 60 * 1000;

  const todayIndex = activityData.findIndex(entry => entry.date === dateString);
  if (todayIndex !== -1) {
    activityData[todayIndex].durationMs += durationToAddMs;
  } else {
    activityData.push({
      date: dateString,
      durationMs: durationToAddMs,
    });
  }
  saveActivityData();
  console.log(`Added ${hours} hours to today's activity.`);
};

function loadActivityData() {
  try {
    const data = localStorage.getItem('activityData');
    activityData = data ? JSON.parse(data) : [];
    activityData = activityData.map((entry: any) => ({
      date: entry.date,
      durationMs: Number(entry.durationMs) ?? 0
    })).filter((entry: ActivityEntry) => entry.date);
  } catch (e) {
    console.error("Failed to load activity data from localStorage:", e);
    activityData = [];
  }
}

function saveActivityData() {
  try {
    localStorage.setItem('activityData', JSON.stringify(activityData));
  } catch (e) {
    console.error("Failed to save activity data to localStorage:", e);
  }
}

function startTracking() {
  if (!startTime) {
    startTime = Date.now();
    console.log("Tracking started at:", new Date(startTime));
  }
}

function stopTracking() {
  if (startTime) {
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const todayIndex = activityData.findIndex(entry => entry.date === dateString);
    if (todayIndex !== -1) {
        activityData[todayIndex].durationMs += durationMs;
    } else {
        activityData.push({
            date: dateString,
            durationMs: durationMs,
        });
    }

    saveActivityData();
    console.log("Activity recorded:", activityData);

    startTime = null;
  }
}

loadActivityData();

onMounted(() => {
  console.log("App mounted, starting tracking.");
  startTracking();

  const handleVisibilityChange = () => {
    if (document.hidden) {
      console.log("Page hidden, stopping tracking.");
      stopTracking();
    } else {
      console.log("Page visible, starting tracking.");
      startTracking();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveSection);
});


const currentYear = computed(() => new Date().getFullYear());

const currentPage = computed(() => {
  return (route.meta?.title as string) || (route.name as string) || 'Home';
});

const navigateToFeedback = () => {
  router.push('/feedback');
};

const navigateToContact = () => {
  router.push('/contact');
};

// NEW: Giscus Comments (moved from NewsView.vue)
const commentsContainer = ref<HTMLElement | null>(null)
let prefersColorSchemeQuery: MediaQueryList | null = null;

const getGiscusTheme = (isDark: boolean) => {
  return isDark ? 'dark_dimmed' : 'light_protanopia'
}

const loadGiscus = () => {
  if (!commentsContainer.value) return

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

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  script.setAttribute('data-theme', getGiscusTheme(isDark));

  script.setAttribute('data-lang', 'en')
  script.setAttribute('data-loading', 'lazy')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true

  commentsContainer.value.appendChild(script)
}

const handleColorSchemeChange = (_event: MediaQueryListEvent) => {
  loadGiscus();
};

// Moved Giscus-related hooks to App.vue
onMounted(async () => {
  await nextTick()
  prefersColorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  prefersColorSchemeQuery.addEventListener('change', handleColorSchemeChange);
  setTimeout(loadGiscus, 500)
})

onBeforeUnmount(() => {
  if (prefersColorSchemeQuery) {
    prefersColorSchemeQuery.removeEventListener('change', handleColorSchemeChange);
  }
});
</script>

<template>
  <div id="app">
    <HeaderUp :page="currentPage" />
    
    <main class="main-content">
      <RouterView />
    </main>
    
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-top">
          <div class="footer-links-main">
            <a @click="navigateToContact" class="footer-link">
              <font-awesome-icon   :icon="['fas', 'paper-plane']" /> Contact
            </a>
            <a class="rainbow-shimmer footer-link" href="https://www.donationalerts.com/r/morunka" target="_blank" rel="noopener noreferrer">
              <font-awesome-icon :icon="['fas', 'heart']" /> Support
            </a>
          </div>

          <div class="footer-secret-container">
            <img
              :src="secretImagePath"
              alt="Secret Found!"
              class="page-sticker secret-sticker"
              @click="openStickerSet"
            />
            <p class="footer-secret-text secret-sticker">You found a secret!</p>
          </div>

          <div class="footer-links-main">
            <a @click="navigateToFeedback" class="rainbow-shimmer footer-link footer-link--clickable">
              <font-awesome-icon :icon="['fas', 'comment']" /> Give Feedback
            </a>
            <a href="https://github.com/Morunka/rolil-web" target="_blank" rel="noopener noreferrer" class="footer-link">
              <font-awesome-icon :icon="['fab', 'github']" /> GitHub
            </a>
          </div>
        </div>
        
        <div class="footer-sections">
          <div class="footer-section">
            <h3 class="footer-section-title">Follow Us</h3>
            <div class="footer-links">
              <a href="https://t.me/By_RORlil" target="_blank" rel="noopener noreferrer" class="footer-link">
                <font-awesome-icon :icon="['fab', 'telegram']" />
                Telegram Channel
              </a>
              <a href="https://t.me/ByROlilStudio" target="_blank" rel="noopener noreferrer" class="footer-link">
                <font-awesome-icon :icon="['fab', 'telegram']" />
                Telegram Discussion
              </a>
              <a href="https://x.com/ByROlilStudio" target="_blank" rel="noopener noreferrer" class="footer-link">
                <font-awesome-icon :icon="['fab', 'twitter']" />
                X (Twitter)
              </a>
              <a href="https://bsky.app/profile/byrolilstudio.bsky.social" target="_blank" rel="noopener noreferrer" class="footer-link">
                <font-awesome-icon :icon="['fab', 'bluesky']" />
                Bluesky
              </a>
              <a href="https://www.youtube.com/@FNABRC" target="_blank" rel="noopener noreferrer" class="footer-link">
                <font-awesome-icon :icon="['fab', 'youtube']" />
                YouTube
              </a>
            </div>
          </div>

          <div class="footer-section">
            <h3 class="footer-section-title">Indie Platforms</h3>
            <div class="footer-links">
              <a href="https://gamejolt.com/@ByROlilStudio" target="_blank" rel="noopener noreferrer" class="footer-link">
                GameJolt
              </a>
              <a href="https://itch.io/profile/morunka" target="_blank" rel="noopener noreferrer" class="footer-link">
                Itch.io
              </a>
              <a href="https://www.newgrounds.com/portal/view/author/morunka" target="_blank" rel="noopener noreferrer" class="footer-link">
                Newgrounds
              </a>
              <a href="https://www.kogama.com/profile/667438867/games/" target="_blank" rel="noopener noreferrer" class="footer-link">
                Kogama
              </a>
              <a href="https://scratch.mit.edu/users/Morunka_RORlil/" target="_blank" rel="noopener noreferrer" class="footer-link">
                Scratch
              </a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="comments-container" ref="commentsContainer"></div>
          <p class="footer-copyright">&copy; 2021 - {{ currentYear }} ROlil Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
    <div class="animated-bg">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
      <div class="floating-orb orb-4"></div>
      <div class="floating-orb orb-5"></div>
    </div>
</template>

<style lang="scss">
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;

  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.2);
  }
}

html {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

  @media (prefers-color-scheme: light) {
     scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  }
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main-content {
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;

  @media (max-width: 768px) {
    padding: 1rem;
  }
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
}

.footer {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;

  @media (prefers-color-scheme: light) {
    background-color: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.6);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform:translateY (20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.rainbow-shimmer {
  background: linear-gradient(90deg,
    #ff0000, #ff8000, #ffff00, #80ff00,
    #00ff00, #00ff80, #00ffff, #0080ff,
    #0000ff, #8000ff, #ff00ff, #ff0080,
    #ff0000);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  animation: rainbow-shimmer 3s linear infinite;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
}
// Ensure rainbow-shimmer class is available or import it
.rainbow-shimmer {
  background: linear-gradient(90deg, #ff6b6b, #646cff, #535bf2, #4c4ff7, #646cff, #ff6b6b);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbowShimmer 3s ease-in-out infinite;
}

@keyframes rainbowShimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.fix-font {
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
}
.hero-section {
  padding: 4rem 0 6rem;
  text-align: center;
  @media (max-width: 768px) {
    padding: 2rem 0 4rem;
  }
}
.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  outline: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  &.primary {
    background: linear-gradient(135deg, #646cff, #535bf2);
    color: white;
    &:hover {
      background: linear-gradient(135deg, #535bf2, #4c4ff7);
    }
  }
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    @media (prefers-color-scheme: light) {
      background: rgba(0, 0, 0, 0.05);
      color: #213547;
      border-color: rgba(0, 0, 0, 0.1);
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
  &.large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 600px) {
  .hero-content,
  .stats-section,
  .cta-section {
    padding: 0 1rem;
    text-align: center;
  }

  .hero-description.center {
    font-size: 1rem;
    line-height: 1.5;
  }

  .cta-button {
    width: 100%;
    max-width: 280px;
  }
}

.cta-section {
  padding: 4rem 0;
  text-align: center;
  @media (max-width: 768px) {
    padding: 2rem 0;
  }
}
.cta-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}
.cta-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  margin-bottom: 1rem;
}
.cta-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.125rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.stats-section {
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem 0;
  margin: 4rem 0;
  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }
  @media (max-width: 768px) {
    padding: 2rem 0;
    margin: 2rem 0;
  }
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
}

.social-icons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: inherit;
  transition: all 0.3s ease;
  box-shadow: none;
  border-radius: 0;

  &:hover {
    background: none;
    color: inherit;
    box-shadow: none;

    .social-image {
       transform: scale(1.1);
    }
  }

  @media (prefers-color-scheme: light) {
    background: none;
  }
}

.social-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  cursor: pointer;
  transition: transform 0.3s ease;
  pointer-events: none;
}

@media (max-width: 768px) {
  .news {
    min-height: calc(100vh - 150px);
  }
  
  .channels-grid {
    padding: 0 0.5rem;
  }
  
  .channel-card {
    margin: 0 0.5rem;
  }
  
  .social-icons {
    gap: 1rem;
  }
  
  .social-icon {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .channel-image {
    height: 180px;
  }
  
  .channel-link {
    padding: 0.625rem 1.25rem;
    font-size: 0.85rem;
  }
  
  .social-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

.footer {
  background-color: rgba(0, 0, 0, 0.15);
  padding: 2rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  @media (prefers-color-scheme: light) {
    background-color: rgba(0, 0, 0, 0.07);
    color: rgba(0, 0, 0, 0.7);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    padding: 1.5rem 0.75rem;
  }
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1.25rem;
    padding: 0 0.5rem;
  }
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    text-align: center;
  }
}

.footer-links-main {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  flex: 0 1 auto;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 1rem;
  }
}

.footer-secret-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
}

.footer-sections {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2.5rem;
  width: 100%;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (prefers-color-scheme: light) {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.75rem;
    align-items: center;
    text-align: center;
    padding-top: 1rem;
  }
}

.footer-section {
  flex: 1;
  min-width: 280px;
  text-align: center;

  &.footer-section-main {
    max-width: 400px;
  }

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
}

.studio-mission {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 1rem;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.footer-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  display: inline-block;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.9);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }
}

.footer-links {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-link {
  color: #8486ff;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;

  &:hover {
    color: #ffffff;
    cursor: pointer;

    @media (prefers-color-scheme: light) {
      color: #2a2f97;
    }
  }

  &:focus-visible {
    outline: 2px solid #8c9eff;
    outline-offset: 2px;

    @media (prefers-color-scheme: light) {
      outline-color: #535bf2;
    }
  }

  @media (prefers-color-scheme: light) {
    color: #7e81ff;

    &:hover {
      color: #3a3fff;
    }
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
  }
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;

  @media (prefers-color-scheme: light) {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
}

.footer-copyright {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8125rem;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
}

.comments-container {
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  min-height: 400px;
  text-align: left;

  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 300px;
  }
}


.footer-secret-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
}

.footer-link--clickable {
  cursor: pointer;
}

.footer-secret-text {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  font-style: italic;
  text-align: center;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.8);
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
}

.page-sticker {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
}

@media (max-width: 786px) {
  .page-sticker {
    width: 50px;
    height: 50px;
  }
}
@media (max-width: 712px) {
  .secret-sticker {
    display: none;
  }
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1.25rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
}

.social-icon {
  display: inline-block;
  transition: transform 0.3s ease, opacity 0.3s ease;
  
  @media (hover: hover) {
    &:hover {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }

  @media (hover: none) {
    &:active {
      transform: scale(0.95);
    }
  }
}

.social-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    border-radius: 6px;
  }

  @media (max-width: 320px) {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 595px) {
  .footer-top {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    text-align: center;
  }

  .footer-links-main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex: 0 1 auto;
    flex-wrap: wrap;
  }

  .footer-secret-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    padding: 0 0.5rem;
  }
}

// CTA Section (Reusable from Home)
.cta-section {
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(100, 108, 255, 0.1), rgba(83, 91, 242, 0.1));
  border-radius: 20px;
  margin: 4rem auto;
  max-width: 900px;
  @media (prefers-color-scheme: light) {
    background: linear-gradient(135deg, rgba(116, 123, 255, 0.15), rgba(100, 108, 255, 0.15));
  }
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin: 2rem auto;
  }
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
  @media (prefers-color-scheme: light) {
    color: #213547;
  }
}

.cta-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.8);
  }
}

/* --- Projects Grid --- */
.projects-grid-section {
  padding: 0 2rem;
  max-width: 1280px;
  margin: 0 auto 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
    margin: 0 auto 1rem;
  }
}

.projects-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  justify-content: flex-start;

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }
}

.project-card-full {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: rgba(100, 108, 255, 0.5);

    @media (prefers-color-scheme: light) {
      border-color: rgba(116, 123, 255, 0.5);
    }
  }

  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.1);
  }
}

.project-image-full {
  position: relative;
  height: 200px;
  width: 100%;
  background: linear-gradient(135deg, rgba(100, 108, 255, 0.05), rgba(83, 91, 242, 0.05));
  flex-shrink: 0;

  @media (max-width: 480px) {
    height: 180px;
  }

  @media (prefers-color-scheme: light) {
     background: linear-gradient(135deg, rgba(100, 108, 255, 0.03), rgba(83, 91, 242, 0.03));
  }
}

.project-actual-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.project-placeholder {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 3rem;
  color: rgba(100, 108, 255, 0.5);

  @media (prefers-color-scheme: light) {
     color: rgba(83, 91, 242, 0.5);
  }
}

.project-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: white;
  line-height: 1.3;
  word-break: break-word;
  hyphens: auto;

  @media (prefers-color-scheme: light) {
     color: #213547;
  }
}

/* Добавлен стиль для даты релиза */
.project-release-date {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.25rem 0;
  font-weight: 500;
  
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);
  }
}

.project-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  word-break: break-word;
  hyphens: auto;
  flex-grow: 1;

  @media (prefers-color-scheme: light) {
     color: rgba(0, 0, 0, 0.7);
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  margin-bottom: 0.75rem;
}

.project-tag {
  background: rgba(100, 108, 255, 0.2);
  color: rgba(100, 108, 255, 1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;

  @media (prefers-color-scheme: light) {
     background: rgba(100, 108, 255, 0.1);
     color: #535bf2;
  }
}

.project-communities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.project-community {
  background: rgba(255, 215, 0, 0.2);
  color: gold;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid rgba(255, 215, 0, 0.3);

  @media (prefers-color-scheme: light) {
     background: rgba(255, 215, 0, 0.1);
     color: #b8860b;
     border-color: rgba(184, 134, 11, 0.3);
  }
}

.project-go-button {
  background: linear-gradient(135deg, #ffed4e, #f4d03f);
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  &:hover {
    background: linear-gradient(135deg, #ffd700, #daa520);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: scale(0.98);
    background: linear-gradient(135deg, #d4ac0d, #b7950b);
  }

  .fa-icon {
    font-size: 0.875rem;
    transition: transform 0.3s ease;
  }

  &:hover .fa-icon {
    transform: translateX(2px);
  }
}


/* --- Loading & Error --- */
.loading-section, .error-section {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  position: relative;
  z-index: 1;
}

.error-section {
  color: #ff6b6b;
}

// --- Loading Spinner ---
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(100, 108, 255, 0.3);
  border-top: 3px solid #646cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>