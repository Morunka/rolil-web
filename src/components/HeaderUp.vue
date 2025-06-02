<script setup lang="ts">
// import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface Props {
  page: string
}

const props = defineProps<Props>()
const router = useRouter()
const route = useRoute()
props

// Navigation items configuration
const navItems = [
  { path: '/comments', icon: 'fa-message', label: 'Comments' },
  { path: '/news', icon: 'fa-newspaper', label: 'News' },
  { path: '/me', icon: 'fa-address-card', label: 'Me' },
  { path: '/about', icon: 'fa-circle-info', label: 'About' },
  { path: '/projects', icon: 'fa-diagram-project', label: 'Projects' },
  { path: '/', icon: 'fa-house', label: 'Home' }
]

// Helper function to extract the icon name from the 'fa-...' string
const getIconName = (faClassName: string): string => {
  // Removes 'fa-' prefix (e.g., 'fa-message' becomes 'message')
  // We assume 'fa-solid' is implied because we import solid icons in main.ts
  return faClassName.substring(3)
}

// Check if current route matches nav item
const isActiveRoute = (path: string): boolean => {
  return route.path === path
}

// Navigate using Vue Router
const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="brand">
        <h1 class="brand-title">By ROlil Studio - {{ page }}</h1>
        <p class="brand-tagline">Build the games, build the web</p>
      </div>
    </div>
    
    <nav class="navigation" role="navigation" aria-label="Main navigation">
      <div class="nav-buttons">
        <button
          v-for="item in navItems"
          :key="item.path"
          :class="['nav-button', { 'nav-button--active': isActiveRoute(item.path) }]"
          :aria-label="item.label"
          :title="item.label"
          @click="navigateTo(item.path)"
        >
          <font-awesome-icon :icon="['fas', getIconName(item.icon)]" :size="'lg'" aria-hidden="true" />
          <span class="nav-button__label">{{ item.label }}</span>
        </button>
      </div>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.header {
  background: linear-gradient(135deg, #50535e 0%, #5a5d68 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  padding: 1rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
}

.brand {
  text-align: left;
  
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
  }
}

.navigation {
  background-color: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  max-width: 1280px;
  margin: 0 auto;
  flex-wrap: wrap;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  min-width: 80px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #646cff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus {
    outline: 2px solid #646cff;
    outline-offset: 2px;
  }
  
  &--active {
    background: linear-gradient(135deg, #646cff, #535bf2);
    border-color: #646cff;
    box-shadow: 0 4px 12px rgba(100, 108, 255, 0.4);
    
    &:hover {
      background: linear-gradient(135deg, #535bf2, #4c4ff7);
      transform: translateY(-1px);
    }
  }
  
  &__label {
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    line-height: 1;
  }
  
  /* Styling for the Font Awesome icon component */
  .fa-icon { /* Add a class to your FontAwesomeIcon if you want to target it directly */
    transition: transform 0.2s ease;
  }
  
  /* Target the icon within the button on hover */
  &:hover .fa-icon {
    transform: scale(1.1);
  }
}

// Responsive design
@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }
  
  .brand {
    text-align: center;
    
    &-title {
      font-size: 1.5rem;
    }
    
    &-tagline {
      font-size: 0.9rem;
    }
  }
  
  .nav-buttons {
    gap: 0.25rem;
    padding: 0.75rem;
  }
  
  .nav-button {
    min-width: 60px;
    padding: 0.5rem 0.75rem;
    
    &__label {
      font-size: 0.7rem;
    }
  }
}

@media (max-width: 480px) {
  .nav-buttons {
    justify-content: space-around;
  }
  
  .nav-button {
    min-width: 50px;
    padding: 0.5rem;
    
    &__label {
      display: none; /* Hide label on small screens */
    }
  }
}

// Dark mode support
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
  
  .nav-button {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
    color: #213547;
    
    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-color: #747bff;
      box-shadow: 0 4px 12px rgba(116, 123, 255, 0.2);
    }
    
    &--active {
      background: linear-gradient(135deg, #747bff, #646cff);
      color: #ffffff;
      
      &:hover {
        background: linear-gradient(135deg, #646cff, #535bf2);
      }
    }
  }
}
</style>