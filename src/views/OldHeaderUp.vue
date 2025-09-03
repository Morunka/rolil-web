<template>
  <div>
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
                <button
                  :class="[
                    'nav-button',
                    {
                      'nav-button--active':
                        lastActiveNavButton === item.path ||
                        (item.path === '/news' && route.path.startsWith('/news')) ||
                        (item.path === '/story' && route.path.startsWith('/story')) ||
                        (item.path === '/jobs' && route.path.startsWith('/jobs'))
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

                <div v-if="item.subItems" class="projects-dropdown">
                  <button
                    class="nav-button nav-button-sub"
                    @click="navigateTo('/more-projects?type=game', item.path)"
                  >
                    <span class="nav-button__label">All Projects</span>
                  </button>
                  <button
                    v-for="subItem in item.subItems"
                    :key="subItem.path"
                    class="nav-button nav-button-sub"
                    @click="navigateTo(subItem.path, item.path)"
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
          <div v-if="item.subItems">
            <button
              :class="[
                'mobile-menu-item',
                 {
                  'mobile-menu-item--active':
                    lastActiveNavButton === item.path ||
                    (item.path === '/news' && route.path.startsWith('/news')) ||
                    (item.path === '/story' && route.path.startsWith('/story')) ||
                    (item.path === '/jobs' && route.path.startsWith('/jobs')) ||
                    isProjectsSubMenuOpen // Highlight if submenu is open
                }
              ]"
              @click="toggleProjectsSubMenu"
            >
              <font-awesome-icon
                :icon="['fas', getIconName(item.icon)]"
                class="mobile-menu-item__icon"
              />
              <span class="mobile-menu-item__label">{{ item.label }}</span> <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="projects-arrow projects-arrow--mobile"
                :class="{ 'projects-arrow--open': isProjectsSubMenuOpen }"
              />
            </button>
            <div
              class="projects-submenu-container"
              :class="{ 'projects-submenu-container--open': isProjectsSubMenuOpen }"
            >
              <button
                class="mobile-menu-item mobile-menu-item-sub"
                @click="navigateToMobile(item.path, item.path)"
              >
                <span class="mobile-menu-item__label">{{ item.label }}</span> </button>
              <button
                class="mobile-menu-item mobile-menu-item-sub"
                 @click="navigateToMobile('/more-projects?type=game', item.path)"
              >
                <span class="mobile-menu-item__label">All Projects</span>
              </button>
              <button
                v-for="subItem in item.subItems"
                :key="subItem.path"
                class="mobile-menu-item mobile-menu-item-sub"
                 @click="navigateToMobile(subItem.path, item.path)"
              >
                <span class="mobile-menu-item__label">{{ subItem.label }}</span>
              </button>
            </div>
          </div>
          <button
            v-else
             :class="[
              'mobile-menu-item',
              {
                'mobile-menu-item--active':
                  lastActiveNavButton === item.path ||
                  (item.path === '/news' && route.path.startsWith('/news')) ||
                  (item.path === '/story' && route.path.startsWith('/story')) ||
                  (item.path === '/jobs' && route.path.startsWith('/jobs'))
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
const isProjectsSubMenuOpen = ref(false); // For mobile submenu toggle
let lastScrollY = ref(0);

// Ref to track the last clicked navigation button
const lastActiveNavButton = ref<string | null>(null);

const navItems = [
  { path: '/me', icon: 'fa-address-card', label: 'Me' },
  { path: '/projects', icon: 'fa-diagram-project', label: 'Projects',
    subItems: [
      { path: '/projects/last-race', label: 'Last Race' },
      { path: '/projects/five-nights-at-stickmans', label: 'Five Nights at Stickmans' },
      { path: '/projects/todo-focus', label: 'ToDo Focus' }
    ]
  },
  {
    path: '/about',
    icon: 'fa-circle-question',
    label: 'About',
    subItems: [
      { path: '/news', label: 'News' },
      { path: '/story', label: 'Story' },
      { path: '/jobs', label: 'Jobs' },
    ],
  },
  { path: '/', icon: 'fa-house', label: 'Home' }
];

const getIconName = (faClassName: string): string => {
  return faClassName.substring(3);
};

const navigateTo = (path: string, buttonPath: string) => {
  // Update the last active button
  lastActiveNavButton.value = buttonPath;
  router.push(path);
};

const navigateToMobile = (path: string, buttonPath: string) => {
   // Update the last active button
  lastActiveNavButton.value = buttonPath;
  router.push(path);
  closeMobileMenu();
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  isProjectsSubMenuOpen.value = false; // Also close submenu when main menu closes
};

const handleOverlayClick = () => {
  closeMobileMenu();
};

// Function to toggle the Projects submenu in mobile menu
const toggleProjectsSubMenu = () => {
  isProjectsSubMenuOpen.value = !isProjectsSubMenuOpen.value;
};

const openStickerSet = () => {
  window.open('https://t.me/addstickers/ByROlilStudio', '_blank');
};

const logoPath = new URL('@/assets/icons/ROlil_Logo.png', import.meta.url).href;

const stickerPaths: { [key: string]: string } = {
  Home: new URL('@/assets/stickers/ddrh.png', import.meta.url).href,
  News: new URL('@/assets/stickers/mille.png', import.meta.url).href,
  Me: new URL('@/assets/stickers/tmo_monster.png', import.meta.url).href,
  Story: new URL('@/assets/stickers/brs.png', import.meta.url).href,
  Projects: new URL('@/assets/stickers/wes.png', import.meta.url).href,
  // Removed Comments sticker path
  Team: new URL('@/assets/stickers/svips.png', import.meta.url).href,
  'Not Found': new URL('@/assets/stickers/lost.png', import.meta.url).href
};

const getStickerPath = (page: string): string => {
  return stickerPaths[page] || '';
};

const navigateToHome = () => {
  lastActiveNavButton.value = '/'; // Set home as last active
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
  const scrollDirection = currentScrollY > lastScrollY.value ? 'down' : 'up';

  const newStickyState = currentScrollY > scrollThreshold;

  if (newStickyState !== isSticky.value) {
    measureHeaderHeight();
    isSticky.value = newStickyState;
  }

  if (window.innerWidth <= 768) {
    if (isSticky.value) {
      if (scrollDirection === 'down' && currentScrollY > lastScrollY.value + 5) {
        isHeaderHidden.value = true;
      } else if (scrollDirection === 'up' && currentScrollY < lastScrollY.value - 5) {
        isHeaderHidden.value = false;
      }
    } else {
      isHeaderHidden.value = false;
    }
  } else {
    isHeaderHidden.value = false;
  }

  lastScrollY.value = currentScrollY;
};

const handleResize = () => {
  measureHeaderHeight();
  checkMobile();
  if (window.innerWidth > 768) {
    isHeaderHidden.value = false;
    closeMobileMenu();
  }
};

// Watch for route changes to potentially update lastActiveNavButton for /news
watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith('/news')) {
      lastActiveNavButton.value = '/news';
    }
    // Optionally, you could add logic here to update lastActiveNavButton
    // if the user navigates directly to a route that corresponds to a nav button
    // and that button wasn't the last one clicked.
    // For example, if they go directly to /projects/last-race, you might want
    // lastActiveNavButton to become '/projects'. This would require mapping
    // routes to their parent nav button path.
  }
);

// Watch for mobile menu open/close to manage body overflow
watch(isMobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onMounted(() => {
  nextTick(() => {
    measureHeaderHeight();
    checkMobile();
  });

  lastScrollY.value = window.scrollY;
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
/* ... (previous styles remain largely the same) ... */

// Additions and modifications to existing styles

.nav-item-wrapper {
  position: relative;
  &:hover {
    .projects-dropdown {
      display: flex;
    }
  }
}


.projects-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column;
  background-color: rgb(255, 255, 255); // Consider making this theme-aware
  border-radius: 8px;
  padding: 0.5rem;
  z-index: 10;
  min-width: 200px;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  // Ensure the "All Projects" button inside the dropdown IS visible on PC
  .nav-button-sub:first-child { // Selects "All Projects" button
    @media (min-width: 769px) { // Changed from 481px
      display: flex; // Make sure it's displayed
    }
  }
}

.projects-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
  margin-left: auto; // Always push to the right inside mobile menu items

  &--mobile {
    opacity: 1;
    visibility: visible;
  }

  &--open {
    transform: rotate(180deg);
  }
}

// Ensure the mobile menu item containing the arrow behaves correctly
.mobile-menu-item {
  justify-content: flex-start;
}

// Add margin to mobile submenu items
.mobile-menu-item-sub {
  margin: 2px;
}


// Existing styles with modifications for sticky nav size and mobile submenu...
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
    // Removed transitions for sticky/unsticky
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

  @media (max-width: 588px) {
    justify-content: center;
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

  @media (max-width: 588px) {
    display: none;
  }
}

.navigation {
  background-color: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
}

// *** KEY FIX: Removed padding and min-height changes for sticky state ***
.nav-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem; /* Constant padding */
  margin: 0 auto;
  gap: 1rem;
  position: relative;
  min-height: 60px; /* Constant min-height */

  .navigation--sticky & {
    justify-content: center;
    padding: 1rem; /* Same padding */
    min-height: 60px; /* Same min-height */
    /* Removed transition for sticky/unsticky */
  }

  @media (max-width: 480px) {
    padding: 1rem 4rem; /* Constant padding */

    .navigation--sticky & {
      padding: 1rem 4rem; /* Same padding */
    }
  }
}
// *** END KEY FIX ***

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

  @media (max-width: 768px) { // Changed from 480px
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

  &--active {
    background: linear-gradient(135deg, #747bff, #646cff);
    color: #ffffff;
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
    }

    &:active {
      background: rgba(200, 200, 200, 0.15);
      border-color: rgba(200, 200, 200, 0.25);
    }

    &-sub {
      padding-left: 2.5rem;
       margin: 2px;
    }

    &__icon {
      font-size: 1.2rem;
      width: 24px;
      text-align: center;
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
    }
  }
}

.projects-submenu-container {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;

  &--open {
    max-height: 500px; /* Adjust if more items are added */
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

  @media (min-width: 481px) {
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
    @media (max-width: 768px) { // Changed from 480px
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

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #646cff;
  }

  &--active {
    background: linear-gradient(135deg, #5a5d68, #50535e);
    border-color: #535bf2;
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
    transition: font-size 0.3s ease;
  }
}

@media (max-width: 1200px) {
  .nav-content {
    .navigation--sticky & {
      gap: 0.5rem;
      padding: 1rem; /* Same padding */
    }
  }

  .nav-brand,
  .nav-page {
    .navigation--sticky & {
      position: static;
      left: auto;
      right: auto;
    }

    &.nav-brand--visible,
    &.nav-page--visible {
      @media (max-width: 1200px) {
        opacity: 0;
        visibility: hidden;
        position: absolute;
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
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    .page-name {
      text-align: center;
    }

    .page-sticker {
      width: 50px;
      height: 50px;
    }
  }

  .navigation {
    .nav-buttons-container {
      display: none;
    }
  }

  .nav-brand,
  .nav-page {
    display: none;
  }
}

@media (max-width: 588px) {
  .page-sticker,
  .page-name {
    display: none;
  }

  .brand {
    align-items: center;
  }

  .header-content {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .nav-content {
    justify-content: center;
    padding: 1rem 4rem; /* Same padding */

    .navigation--sticky & {
      padding: 1rem 4rem; /* Same padding */
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
}
</style>