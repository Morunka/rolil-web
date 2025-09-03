<template>
  <div>
    <!-- Main header with navigation -->
    <header
      class="header"
      :class="{ 'header--sticky': isSticky, 'header--hidden': isHeaderHidden }"
      ref="headerRef"
    >
      <div
        class="header-content"
        :class="{ 'header-content--hidden': isSticky }"
      >
        <div class="brand">
          <img
            :src="logoPath"
            alt="ROlil Studio Logo"
            class="brand-logo"
            @click="navigateToHome"
          />
          <h1 class="brand-title">By ROlil Studio</h1>
          <p class="brand-tagline rainbow-shimmer">Build the games, build the web</p>
        </div>
        <div class="current-page">
          <span class="page-name">{{ page }}</span>
          <img
            :src="getStickerPath(page)"
            :alt="`Sticker for ${page}`"
            class="page-sticker"
            @click="openStickerSet"
          />
        </div>
      </div>

      <nav
        class="navigation"
        :class="{ 'navigation--sticky': isSticky }"
        role="navigation"
        aria-label="Main navigation"
      >
        <div class="nav-content">
          <button
            class="mobile-menu-button"
            :class="{ 'mobile-menu-button--open': isMobileMenuOpen }"
            @click="toggleMobileMenu"
            aria-label="Toggle navigation menu"
          >
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>

          <div
            class="nav-brand"
            :class="{ 'nav-brand--visible': isSticky }"
          >
            <img
              :src="logoPath"
              alt="ROlil Studio Logo"
              class="nav-brand-logo"
              @click="navigateToHome"
              style="width: 3.5rem; height: 3.5rem;"
            />
            <span class="nav-brand-title" style="font-size: 2rem;">By ROlil Studio</span>
          </div>

          <div
            class="nav-mobile-brand"
            :class="{ 'nav-mobile-brand--visible': isSticky && isMobile }"
          >
            <img
              :src="logoPath"
              alt="ROlil Studio Logo"
              class="nav-mobile-brand-logo"
              @click="navigateToHome"
            />
            <span class="nav-mobile-brand-title">By ROlil Studio</span>
          </div>

          <div
            class="nav-buttons-container"
            :class="{ 'nav-buttons-container--hidden': isMobile }"
          >
            <div class="nav-buttons">
              <div
                v-for="item in navItems"
                :key="item.path"
                class="nav-item-wrapper"
              >
                <!-- Support button (special case) -->
                <button
                  v-if="item.path === '/support'"
                  :class="[
                    'nav-button',
                    'nav-button--support'
                  ]"
                  :aria-label="item.label"
                  :title="item.label"
                  @click="openSupportLink"
                >
                  <font-awesome-icon
                    :icon="['fas', getIconName(item.icon)]"
                    size="lg"
                    aria-hidden="true"
                  />
                  <span class="nav-button__label">{{ item.label }}</span>
                </button>

                <!-- Regular navigation buttons -->
                <button
                  v-else
                  :class="[
                    'nav-button',
                    {
                      'nav-button--active': isActiveRoute(item)
                    }
                  ]"
                  :aria-label="item.label"
                  :title="item.label"
                  @click="() => navigateTo(item.path, item.path)"
                >
                  <font-awesome-icon
                    :icon="['fas', getIconName(item.icon)]"
                    size="lg"
                    aria-hidden="true"
                  />
                  <span class="nav-button__label">{{ item.label }}</span>
                </button>

                <!-- Dropdown for items with subItems -->
                <div v-if="item.subItems && item.path !== '/support'" class="projects-dropdown">
                  <!-- "All Projects" link only for Projects -->
                  <button
                    v-if="item.label === 'Projects'"
                    class="nav-button nav-button-sub"
                    @click="navigateTo('/more-projects?type=game', item.path)"
                  >
                    <span class="nav-button__label">All Projects</span>
                  </button>
                  <!-- Submenu items -->
                  <button
                    v-for="subItem in item.subItems"
                    :key="subItem.path"
                    class="nav-button nav-button-sub"
                    @click="navigateToExternalOrInternal(subItem)"
                  >
                    <span class="nav-button__label">{{ subItem.label }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            class="nav-page"
            :class="{ 'nav-page--visible': isSticky }"
          >
            <span class="nav-page-name">{{ page }}</span>
            <img
              :src="getStickerPath(page)"
              :alt="`Sticker for ${page}`"
              class="nav-page-sticker"
              @click="openStickerSet"
              style="width: 3.5rem; height: 3.5rem;"
            />
          </div>
        </div>
      </nav>
    </header>

    <!-- Mobile menu overlay and menu -->
    <div
      class="mobile-menu-overlay"
      :class="{ 'mobile-menu-overlay--open': isMobileMenuOpen }"
      @click="handleOverlayClick"
    ></div>

    <div
      class="mobile-menu"
      :class="{ 'mobile-menu--open': isMobileMenuOpen }"
    >
      <div class="mobile-menu-content">
        <template v-for="item in navItems" :key="item.path">
          <!-- Support button -->
          <button
            v-if="item.path === '/support'"
            :class="[
              'mobile-menu-item',
              'mobile-menu-item--support'
            ]"
            @click="openSupportLink"
          >
            <font-awesome-icon
              :icon="['fas', getIconName(item.icon)]"
              class="mobile-menu-item__icon"
            />
            <span class="mobile-menu-item__label">{{ item.label }}</span>
          </button>

          <!-- Items with submenus -->
          <div v-else-if="item.subItems">
            <button
              :class="[
                'mobile-menu-item',
                {
                  'mobile-menu-item--active':
                    openSubmenuPath === item.path ||
                    (item.path === '/projects' && (route.path === '/projects' || route.path.startsWith('/projects/'))) ||
                    (item.path === '/about' && (route.path === '/about' || route.path.startsWith('/about/'))) ||
                    (item.subItems && item.subItems.some(subItem => subItem.path === route.path)) ||
                    isActiveRouteMobile(item)
                }
              ]"
              @click="toggleSubmenu(item.path)"
            >
              <font-awesome-icon
                :icon="['fas', getIconName(item.icon)]"
                class="mobile-menu-item__icon"
              />
              <span class="mobile-menu-item__label">{{ item.label }}</span>
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="projects-arrow projects-arrow--mobile"
                :class="{ 'projects-arrow--open': openSubmenuPath === item.path }"
              />
            </button>

            <div
              class="projects-submenu-container"
              :class="{ 'projects-submenu-container--open': openSubmenuPath === item.path }"
            >
              <!-- Main links for submenus -->
              <button
                v-if="item.label === 'Projects'"
                class="mobile-menu-item mobile-menu-item-sub"
                @click="navigateToMobile('/projects', item.path)"
              >
                <span class="mobile-menu-item__label">{{ item.label }}</span>
              </button>
              <button
                v-if="item.label === 'Projects'"
                class="mobile-menu-item mobile-menu-item-sub"
                @click="navigateToMobile('/more-projects?type=game', item.path)"
              >
                <span class="mobile-menu-item__label">All Projects</span>
              </button>
              <button
                v-if="item.label === 'About'"
                class="mobile-menu-item mobile-menu-item-sub"
                @click="navigateToMobile('/about', item.path)"
              >
                <span class="mobile-menu-item__label">About</span>
              </button>
              <button
                v-if="item.label === 'Knowledge'"
                class="mobile-menu-item mobile-menu-item-sub"
                @click="navigateToMobile('/knowledge', item.path)"
              >
                <span class="mobile-menu-item__label">Knowledge</span>
              </button>

              <!-- Submenu items -->
              <button
                v-for="subItem in item.subItems"
                :key="subItem.path"
                class="mobile-menu-item mobile-menu-item-sub"
                :class="{ 'mobile-menu-item--active': subItem.path === route.path }"
                @click="navigateToMobileExternalOrInternal(subItem, item.path)"
              >
                <span class="mobile-menu-item__label">{{ subItem.label }}</span>
              </button>
            </div>
          </div>

          <!-- Items without submenus -->
          <button
            v-else-if="item.path !== '/support'"
            :class="[
              'mobile-menu-item',
              {
                'mobile-menu-item--active': isActiveRouteMobile(item)
              }
            ]"
            @click="navigateToMobile(item.path, item.path)"
          >
            <font-awesome-icon
              :icon="['fas', getIconName(item.icon)]"
              class="mobile-menu-item__icon"
            />
            <span class="mobile-menu-item__label">{{ item.label }}</span>
          </button>
        </template>
      </div>
    </div>

    <!-- Placeholder to prevent layout jump when header becomes sticky -->
    <div
      class="header-placeholder"
      :style="{ height: headerHeight + 'px' }"
      v-show="isSticky"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

interface Props {
  page: string;
}

const props = defineProps<Props>();
const router = useRouter();
const route = useRoute();

const isSticky = ref(false);
const isHeaderHidden = ref(false);
const headerRef = ref<HTMLElement | null>(null);
const headerHeight = ref(0);

const isMobileMenuOpen = ref(false);
const isMobile = ref(false);
const openSubmenuPath = ref<string | null>(null);
let lastScrollY = 0;

const lastActiveNavButton = ref<string | null>(null);

const navItems = [
  { path: '/me', icon: 'fa-address-card', label: 'Me' },
  { path: '/news', icon: 'fa-newspaper', label: 'News' },
  {
    path: '/about',
    icon: 'fa-circle-question', label: 'About',
    subItems: [
      { path: '/story', label: 'Story' },
      { path: '/jobs', label: 'Jobs' },
      { path: '/team', label: 'Team' },
      { path: '/community', label: 'Community' },
      { path: '/feedback', label: 'Feedback' },
      { path: 'https://github.com/Morunka/rolil-web', label: 'Github', external: true },
      { path: '/gallery', label: 'Gallery' },
      { path: 'https://t.me/addstickers/ByROlilStudio', label: 'Telegram Sticker Pack', external: true },
      { path: '/contact', label: 'Contact Us' }
    ],
  },
  {
    path: '/knowledge',
    icon: 'fa-book', label: 'Knowledge',
    subItems: [
      { path: '/knowledge/article/how-to-use-ts3-music-downloader', label: 'How to use TS3 MD' },
      { path: '/knowledge/article/how-to-use-unminer-tool', label: 'How to use UnminerTool' }
    ]
  },
  {
    path: '/projects',
    icon: 'fa-diagram-project', label: 'Projects',
    subItems: [
      { path: 'https://by-rolil-studio.itch.io/racing-cars-adventures', label: 'Racing Cars Adventures', external: true },
      { path: 'https://gamejolt.com/games/FNAS/927326', label: 'Five Nights at Stickamans', external: true },
      { path: 'https://morunka.github.io/search.html', label: 'ROlil Search', external: true },
      { path: 'https://morunka.github.io/todo-focus/#/', label: 'ToDo Focus', external: true },
    ]
  },
  { path: '/', icon: 'fa-house', label: 'Home' },
  { path: '/support', icon: 'fa-heart', label: 'Support', external: true }
];

const getIconName = (faClassName: string): string => {
  return faClassName.substring(3);
};

const isActiveRoute = (item: any): boolean => {
  if (item.path === '/projects') {
    return route.path.startsWith('/projects') || route.path.startsWith('/more-projects');
  }
  if (item.path === '/about') {
    return ['/about', '/story', '/jobs', '/team', '/feedback', '/community', '/gallery', '/contact']
      .some(p => route.path.startsWith(p));
  }
  if (item.path === '/') {
    return route.path === '/' || route.path.startsWith('/home');
  }
  if (item.path === '/knowledge') {
    return route.path.startsWith('/knowledge');
  }
  return (
    lastActiveNavButton.value === item.path ||
    (item.path === '/news' && route.path.startsWith('/news')) ||
    (item.path === '/story' && route.path.startsWith('/story')) ||
    (item.path === '/jobs' && route.path.startsWith('/jobs')) ||
    (item.path === '/contact' && route.path.startsWith('/contact')) ||
    (item.path === '/feedback' && route.path.startsWith('/feedback')) ||
    (item.path === '/team' && route.path === '/team')
  );
};

const isActiveRouteMobile = (item: any): boolean => {
  return isActiveRoute(item);
};

const navigateToExternalOrInternal = (subItem: any) => {
  if (subItem.external) {
    window.open(subItem.path, '_blank', 'noopener,noreferrer');
  } else {
    const parentItem = navItems.find(i => i.subItems?.some(si => si.path === subItem.path));
    const parentPath = parentItem ? parentItem.path : '/';
    navigateTo(subItem.path, parentPath);
  }
};

const navigateTo = (path: string, buttonPath: string) => {
  lastActiveNavButton.value = buttonPath;
  const item = navItems.find(i => i.path === path);
  if (item?.external) {
    window.open(path, '_blank', 'noopener,noreferrer');
  } else {
    router.push(path);
  }
};

const navigateToMobileExternalOrInternal = (subItem: any, parentPath: string) => {
  if (subItem.external) {
    window.open(subItem.path, '_blank', 'noopener,noreferrer');
  } else {
    navigateToMobile(subItem.path, parentPath);
  }
};

const navigateToMobile = (path: string, buttonPath: string) => {
  lastActiveNavButton.value = buttonPath;
  const item = navItems.find(i => i.path === path);
  if (item?.external) {
    window.open(path, '_blank', 'noopener,noreferrer');
  } else {
    router.push(path);
  }
  closeMobileMenu();
};

const openSupportLink = () => {
  window.open('https://www.donationalerts.com/r/morunka', '_blank', 'noopener,noreferrer');
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  openSubmenuPath.value = null;
};

const handleOverlayClick = () => {
  closeMobileMenu();
};

const toggleSubmenu = (path: string) => {
  openSubmenuPath.value = openSubmenuPath.value === path ? null : path;
};

const openStickerSet = () => {
  window.open('https://t.me/addstickers/ByROlilStudio', '_blank', 'noopener,noreferrer');
};

const logoPath = new URL('@/assets/icons/ROlil_Logo.png', import.meta.url).href;

const stickerPaths: { [key: string]: string } = {
  Home: new URL('@/assets/stickers/ddrh.png', import.meta.url).href,
  News: new URL('@/assets/stickers/mille.png', import.meta.url).href,
  Me: new URL('@/assets/stickers/tmo_monster.png', import.meta.url).href,
  Story: new URL('@/assets/stickers/brs.png', import.meta.url).href,
  Projects: new URL('@/assets/stickers/wes.png', import.meta.url).href,
  Team: new URL('@/assets/stickers/svips.png', import.meta.url).href,
  Knowledge: new URL('@/assets/stickers/pp.png', import.meta.url).href,
  About: new URL('@/assets/stickers/rolil.png', import.meta.url).href,
  'Not Found': new URL('@/assets/stickers/lost.png', import.meta.url).href,
  'More projects': new URL('@/assets/stickers/ro.png', import.meta.url).href,
  Article: new URL('@/assets/stickers/gbam.png', import.meta.url).href,
  Jobs: new URL('@/assets/stickers/mm.png', import.meta.url).href,
  Community: new URL('@/assets/stickers/evil_mister_facilator.png', import.meta.url).href,
  Feedback: new URL('@/assets/stickers/cup.png', import.meta.url).href,
  Gallery: new URL('@/assets/stickers/ai_folder.png', import.meta.url).href,
  Contact: new URL('@/assets/stickers/wibbi.png', import.meta.url).href,
  'News Post': new URL('@/assets/stickers/robot_tmo_eye.png', import.meta.url).href
};

const getStickerPath = (page: string): string => {
  return stickerPaths[page] || stickerPaths['Not Found'];
};

const navigateToHome = () => {
  lastActiveNavButton.value = '/';
  router.push('/');
};

const measureHeaderHeight = () => {
  if (headerRef.value) {
    headerHeight.value = headerRef.value.offsetHeight;
  }
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const handleScroll = () => {
  const scrollThreshold = 140;
  const currentScrollY = window.scrollY;
  const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

  const newStickyState = currentScrollY > scrollThreshold;
  if (newStickyState !== isSticky.value) {
    measureHeaderHeight();
    isSticky.value = newStickyState;
  }

  if (isMobile.value && isSticky.value) {
    if (scrollDirection === 'down' && currentScrollY > lastScrollY + 5) {
      isHeaderHidden.value = true;
    } else if (scrollDirection === 'up' && currentScrollY < lastScrollY - 5) {
      isHeaderHidden.value = false;
    }
  } else {
    isHeaderHidden.value = false;
  }

  lastScrollY = currentScrollY;
};

const handleResize = () => {
  measureHeaderHeight();
  checkMobile();
  if (window.innerWidth > 768) {
    isHeaderHidden.value = false;
    closeMobileMenu();
  }
};

watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/projects') || newPath === '/more-projects') {
    lastActiveNavButton.value = '/projects';
  } else if (newPath.startsWith('/news')) {
    lastActiveNavButton.value = '/news';
  } else if (newPath.startsWith('/knowledge')) {
    lastActiveNavButton.value = '/knowledge';
  } else if (['/about', '/story', '/jobs', '/team', '/feedback', '/community', '/gallery'].some(p => newPath.startsWith(p))) {
    lastActiveNavButton.value = '/about';
  } else if (newPath.startsWith('/contact')) {
    lastActiveNavButton.value = '/contact';
  } else if (newPath === '/' || newPath.startsWith('/home')) {
    lastActiveNavButton.value = '/';
  }
});

watch(isMobileMenuOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

onMounted(() => {
  nextTick(() => {
    measureHeaderHeight();
    checkMobile();
  });
  lastScrollY = window.scrollY;
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
  document.body.style.overflow = '';
});
</script>

<style scoped lang="scss">
.nav-item-wrapper {
  position: relative;
  &:hover {
    .projects-dropdown {
      display: flex;
    }
  }
}

.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  backdrop-filter: blur(10px);
  min-width: 80px;
  flex-shrink: 0;
  position: relative;

  &--active {
    background: linear-gradient(135deg, #5a5d68, #50535e);
    border-color: #535bf2;
  }

  &--support {
    background: linear-gradient(135deg, #ff6b6b, #ff5252);
    border-color: rgba(255, 255, 255, 0.3);
    animation: shimmer 3s infinite;
    &:hover {
      background: linear-gradient(135deg, #ff5252, #ff0000);
      border-color: #ff9999;
    }
    &.nav-button--active {
      background: linear-gradient(135deg, #ff5252, #cc0000);
      border-color: #ff3333;
    }
    &:active {
      background: rgba(200, 0, 0, 0.3);
      border-color: rgba(255, 100, 100, 0.5);
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #646cff;
  }

  &:active {
    background: rgba(200, 200, 200, 0.15);
    border-color: rgba(200, 200, 200, 0.25);
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    line-height: 1;
    flex-shrink: 0;
  }

  .fa-icon {
    font-size: 1rem;
  }
}

@keyframes shimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.nav-button--support {
  background-size: 200% 200%;
  animation: shimmer 3s ease-in-out infinite;
}

.projects-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  padding: 0.5rem;
  z-index: 10;
  min-width: 200px;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.projects-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
  margin-left: auto;
  &--mobile {
    opacity: 1;
    visibility: visible;
  }
  &--open {
    transform: rotate(180deg);
  }
}

.mobile-menu-item {
  justify-content: flex-start;
  display: flex;
  align-items: center;
  &--support {
    background: linear-gradient(135deg, #ff6b6b, #ff5252);
    border-color: rgba(255, 255, 255, 0.3);
    animation: shimmer 3s infinite;
    &:hover {
      background: linear-gradient(135deg, #ff5252, #ff0000);
      border-color: #ff9999;
    }
    &.mobile-menu-item--active {
      background: linear-gradient(135deg, #ff5252, #cc0000);
      border-color: #ff3333;
    }
    &:active {
      background: rgba(200, 0, 0, 0.3);
      border-color: rgba(255, 100, 100, 0.5);
    }
  }
}

.mobile-menu-item-sub {
  margin: 2px;
}

.header {
  background: linear-gradient(135deg, #50535e 0%, #5a5d68 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1000;

  &--sticky {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  &--hidden {
    @media (max-width: 768px) {
      transform: translateY(-100%);
    }
  }
}

.header-placeholder {
  width: 100%;
}

.header-content {
  padding: 1rem 2rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  &--hidden {
    opacity: 0;
    visibility: hidden;
    height: 0;
    padding: 0 2rem;
    overflow: hidden;
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  &-logo {
    height: 60px;
    width: auto;
    cursor: pointer;
    border-radius: 8px;
  }

  &-title {
    margin: 0;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 600;
    color: #ffffff;
    line-height: 1.2;
  }

  &-tagline {
    margin: 0.25rem 0 0 0;
    font-size: 1rem;
    color: #9ea084;
    font-family: "Dancing Script", cursive;
    font-weight: 400;
    flex-basis: 100%;
  }
}

.current-page {
  display: flex;
  align-items: center;
  gap: 1rem;

  .page-name {
    font-size: 1.5rem;
    font-weight: 600;
    color: #ffffff;
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
}

.navigation {
  background-color: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
}

.nav-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin: 0 auto;
  gap: 1rem;
  position: relative;
  min-height: 60px;

  .navigation--sticky & {
    justify-content: center;
    padding: 1rem;
    min-height: 60px;
  }

  @media (max-width: 480px) {
    padding: 1rem 4rem;
    .navigation--sticky & {
      padding: 1rem 4rem;
    }
  }
}

.mobile-menu-button {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  position: absolute;
  left: 1rem;
  z-index: 1002;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.1);
  color: #213547;
  outline: none;

  @media (max-width: 768px) {
    display: flex;
  }

  &--open {
    position: fixed;
    top: 1rem;
    left: 1rem;
    background: linear-gradient(135deg, #50535e, #5a5d68);
    border-color: rgba(255, 255, 255, 0.2);
    display: none;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    border-color: #747bff;
  }

  .hamburger-line {
    width: 20px;
    height: 2px;
    background-color: #ffffff;
    margin: 2px 0;
    transition: background-color 0.2s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #646cff, #535bf2);
  }

  &:active {
    background: rgba(200, 200, 200, 0.2);
    border-color: rgba(200, 200, 200, 0.3);
  }

  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
    .hamburger-line {
      background-color: #213547;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-color: #747bff;
    }
    &:active {
      background: rgba(0, 0, 0, 0.15);
      border-color: rgba(0, 0, 0, 0.2);
    }
    &--open {
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border-color: rgba(0, 0, 0, 0.1);
      .hamburger-line {
        background-color: #213547;
      }
    }
  }
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &--open {
    opacity: 1;
    visibility: visible;
  }
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: linear-gradient(135deg, #50535e 0%, #5a5d68 100%);
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.1);

  &--open {
    transform: translateX(0);
  }

  &-content {
    padding: 1rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
    text-align: left;
    width: 100%;
    font-size: 1rem;
    font-weight: 500;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: #646cff;
    }

    &--active {
      background: linear-gradient(135deg, #5a5d68, #50535e);
      border-color: #535bf2;
      color: #ffffff;
    }

    &:active {
      background: rgba(200, 200, 200, 0.15);
      border-color: rgba(200, 200, 200, 0.25);
    }

    &__icon {
      font-size: 1.2rem;
      width: 24px;
      text-align: center;
      flex-shrink: 0;
    }

    &__label {
      font-size: 1rem;
      font-weight: 500;
      line-height: 1;
      flex-grow: 1;
    }

    .projects-arrow--mobile {
      opacity: 1;
      visibility: visible;
      margin-left: auto;
      flex-shrink: 0;
    }
  }
}

.projects-submenu-container {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;

  &--open {
    max-height: 1000px;
    transition: max-height 0.5s ease-in;
  }
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  visibility: hidden;
  position: absolute;
  left: 2rem;

  &--visible {
    opacity: 1;
    visibility: visible;
  }

  &-logo {
    height: 40px;
    width: auto;
    cursor: pointer;
    border-radius: 8px;
  }

  &-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.2;
    white-space: nowrap;
  }
}

.nav-mobile-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  visibility: hidden;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001;

  &--visible {
    opacity: 1;
    visibility: visible;
  }

  &-logo {
    height: 40px;
    width: 40px;
    cursor: pointer;
    border-radius: 8px;
  }

  &-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.2;
    white-space: nowrap;
  }

  @media (min-width: 769px) {
    display: none;
  }
}

.nav-buttons-container {
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &--hidden {
    @media (max-width: 768px) {
      opacity: 0;
      visibility: hidden;
      width: 0;
      overflow: hidden;
    }
  }
}

.nav-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  min-width: max-content;
}

.nav-button-sub {
  justify-content: center;
  margin: 2px;

  &:hover {
    background: #474a53;
    color: #ffffff;
  }

  @media (prefers-color-scheme: light) {
    &:hover {
      background: #d0d0d0;
      color: #213547;
    }
  }
}

.nav-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  visibility: hidden;
  position: absolute;
  right: 2rem;

  &--visible {
    opacity: 1;
    visibility: visible;
  }

  &-name {
    font-size: 1.8rem;
    font-weight: 600;
    color: #ffffff;
    white-space: nowrap;
  }

  &-sticker {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s ease, width 0.3s ease, height 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
}

@media (max-width: 1300px) {
  .nav-content {
    .navigation--sticky & {
      gap: 0.5rem;
      padding: 1rem;
    }
  }
  .nav-brand,
  .nav-page {
    @media (max-width: 820px) {
      .navigation--sticky & {
        position: static;
        left: auto;
        right: auto;
        opacity: 1;
        visibility: visible;
      }
    }
    &.nav-brand--visible,
    &.nav-page--visible {
      @media (max-width: 1300px) {
        .nav-brand-title,
        .nav-page-name {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
    align-items: stretch;

    &--hidden {
      padding: 0 1rem;
    }
  }
  .brand {
    &-logo {
      height: 50px;
    }
    &-title {
      font-size: 1.5rem;
    }
    &-tagline {
      font-size: 0.9rem;
    }
  }
  .current-page {
    .page-name {
      text-align: center;
    }
    .page-sticker {
      width: 50px;
      height: 50px;
    }
  }
  .navigation {
    .nav-buttons-container, .nav-brand, .nav-page {
      display: none;
    }
  }
}

@media (max-width: 512px) {
  .page-sticker {
    display: none;
  }
}

@media (max-width: 830px) {
  .page-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-content {
    justify-content: center;
    padding: 1rem 4rem;
    .navigation--sticky & {
      padding: 1rem 4rem;
    }
  }
  .brand-logo {
    height: 40px;
  }
  .current-page .page-sticker {
    width: 40px;
    height: 40px;
  }
}

@media (prefers-color-scheme: light) {
  .header {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .brand {
    &-title {
      color: #213547;
    }
    &-tagline {
      color: #666;
    }
  }
  .navigation {
    background-color: rgba(255, 255, 255, 0.5);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  .nav-brand-title {
    color: #213547;
  }
  .nav-mobile-brand-title {
    color: #213547;
  }
  .nav-page-name {
    color: #213547;
  }
  .page-name {
    color: black !important;
  }
  .mobile-menu {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    &-item {
      background: rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.1);
      color: #213547;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
        border-color: #747bff;
      }
      &--active {
        background: linear-gradient(135deg, #747bff, #646cff);
        color: #ffffff;
        border-color: #646cff;
      }
      &:active {
        background: rgba(0, 0, 0, 0.15);
        border-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
  .nav-button {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
    color: #213547;
    outline: none;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-color: #747bff;
    }
    &--active {
      background: linear-gradient(135deg, #747bff, #646cff);
      color: #ffffff;
      &:hover {
        background: linear-gradient(135deg, #646cff, #535bf2);
      }
    }
    &--support {
      background: linear-gradient(135deg, #ff6b6b, #ff5252);
      border-color: rgba(0, 0, 0, 0.1);
      color: white;
      &:hover {
        background: linear-gradient(135deg, #ff5252, #ff0000);
        border-color: #ff3333;
      }
      &.nav-button--active {
        background: linear-gradient(135deg, #ff5252, #cc0000);
        border-color: #ff0000;
      }
      &:active {
        background: rgba(200, 0, 0, 0.2);
        border-color: rgba(255, 50, 50, 0.3);
      }
    }
  }
  .projects-dropdown {
    background-color: #ffffff;
  }
  .nav-button-sub {
    background: rgba(0, 0, 0, 0.05);
    color: #213547;
    border-color: rgba(0, 0, 0, 0.1);
    &:hover {
      background: #d0d0d0;
      color: #213547;
      border-color: #747bff;
    }
  }
  .mobile-menu-item--support {
    background: linear-gradient(135deg, #ff6b6b, #ff5252);
    border-color: rgba(0, 0, 0, 0.1);
    color: white;
    &:hover {
      background: linear-gradient(135deg, #ff5252, #ff0000);
      border-color: #ff3333;
    }
    &.mobile-menu-item--active {
      background: linear-gradient(135deg, #ff5252, #cc0000);
      border-color: #ff0000;
    }
    &:active {
      background: rgba(200, 0, 0, 0.2);
      border-color: rgba(255, 50, 50, 0.3);
    }
  }
}
</style>