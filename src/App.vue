<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderUp from './components/HeaderUp.vue'

const route = useRoute()

// Compute current page title from route meta or name
const currentPage = computed(() => {
  return (route.meta?.title as string) || route.name as string || 'Home'
})
</script>

<template>
  <div id="app">
    <HeaderUp :page="currentPage" />
    
    <main class="main-content">
      <RouterView />
    </main>
    
    <footer class="footer">
      <p><a href="https://t.me/MEOW_MUR920" target="_blank" rel="noopener noreferrer">Contact</a> | <a href="https://www.donationalerts.com/r/morunka" target="_blank" rel="noopener noreferrer">Support</a> | <a href="https://github.com/Morunka/Morunka.github.io" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      <p>&copy; 2025 ROlil Studio. All rights reserved.</p>
    </footer>
  </div>
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
      <div class="floating-orb orb-4"></div>
      <div class="floating-orb orb-5"></div>
    </div>
</template>

/* app.vue */
<style lang="scss">

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* Removed max-width, margin, padding as main-content handles this */
  width: 100%; /* Ensure #app takes full width */
}

.main-content {
  flex: 1; /* Allows main content to grow and push footer down */
  max-width: 1280px; /* Max width for larger screens */
  margin: 0 auto; /* Center content */
  padding: 2rem; /* Default padding for larger screens */
  width: 100%; /* Ensure it takes full width within max-width */

  @media (max-width: 768px) {
    padding: 1rem; /* Reduced padding for mobile screens */
  }
  @media (max-width: 480px) {
    padding: 0.75rem; /* Even smaller padding for very small screens */
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

// Animations
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
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
</style>