<template>
  <div class="news">
    <div class="news-content">
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Our
            <span class="brand-gradient">Community</span>
          </h1>
          <p class="hero-description">
            Join our community, get <a class="rainbow-shimmer">interesting information</a> and news about games, devlogs, web developing and IT from our studio <a class="rainbow-shimmer">for you.</a>
          </p>
          <div class="hero-actions">
            <button class="cta-button primary" @click="joinTelegram">
              <font-awesome-icon :icon="['fab', 'telegram']" />
              Join Telegram
            </button>
            <button class="cta-button secondary" @click="getNotificated">
              <font-awesome-icon :icon="['fas', 'bell']" />
              Get Notificated
            </button>
          </div>
        </div>
      </section>

      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">We actively <a class="rainbow-shimmer">communicate with our community, asking you</a> for advice on posts and future games.</p>
        </div>
      </section>

      <section class="hero-section">
        <div class="hero-content">
          <h2 class="section-title">Us Social Networks</h2>
          <p class="hero-description">Join us on your preferred social networks, always stay up to date!</p>
          <div class="social-icons">
            <a v-for="social in socialLinks" :key="social.name" :href="social.url" :aria-label="social.name" target="_blank" rel="noopener noreferrer" class="social-icon">
              <img v-if="social.imageUrl" :src="social.imageUrl" :alt="`${social.name} icon`" class="social-image" draggable="false" @dragstart.prevent>
            </a>
          </div>
        </div>
      </section>

      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">We are <a class="rainbow-shimmer">currently actively developing social networks,</a> and we can add new links <a class="rainbow-shimmer">for you at any time.</a></p>
        </div>
      </section>

      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Our Discussions</h2>
          <p class="cta-description">
            Join the discussion and share your feedback with us!
          </p>
          <div class="hero-actions">
            <button class="cta-button primary" @click="navigateToDiscussion">
              <font-awesome-icon :icon="['fab', 'telegram']" />
              Join Discussion
            </button>
            <button class="cta-button secondary" @click="navigateToFeedback">
              <font-awesome-icon :icon="['fas', 'paper-plane']" />
              Send Feedback
            </button>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const socialLinks = ref([
  { name: 'Telegram', url: 'https://t.me/By_RORlil', imageUrl: new URL('@/assets/icons/telegram.webp', import.meta.url).href },
  { name: 'X (Twitter)', url: 'https://x.com/ByROlilStudio', imageUrl: new URL('@/assets/icons/x.png', import.meta.url).href },
  { name: 'Bluesky', url: 'https://bsky.app/profile/byrolilstudio.bsky.social', imageUrl: new URL('@/assets/icons/bluesky.png', import.meta.url).href }
])

const joinTelegram = () => {
  window.open('https://t.me/By_RORlil', '_blank', 'noopener,noreferrer')
}

const getNotificated = () => {
  // Add your logic for notifications here
}

const navigateToDiscussion = () => {
  window.open('https://t.me/By_RORlil/1', '_blank', 'noopener,noreferrer')
}

// NEW: Function to navigate to the new feedback page
const navigateToFeedback = () => {
  router.push('/feedback');
}
</script>

<style scoped lang="scss">
// All styles from the previous NewsView.vue remain here.
// I've removed the comments and form-related styles.

.news {
  position: relative;
  min-height: calc(100vh - 200px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

// Main Content
.news-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
  flex: 1;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
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

// Channels Section
.channels-section {
  padding: 2rem 0 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem 0 2rem;
  }
}

.section-title {
  text-align: center;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-bottom: 1rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
}

.section-description {
  text-align: center;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;
  line-height: 1.6;
  
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);
  }
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
}

.channels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.channel-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s ease-out both;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 35px rgba(100, 108, 255, 0.3);
    border-color: rgba(100, 108, 255, 0.4);
  }
  
  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(0, 0, 0, 0.1);
    
    &:hover {
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
      border-color: rgba(100, 108, 255, 0.3);
    }
  }
}

.channel-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
}

.channel-content {
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
}

.channel-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #646cff;
  line-height: 1.3;
}

.channel-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.channel-actions {
  display: flex;
  justify-content: center;
}

.channel-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #646cff, #535bf2);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(100, 108, 255, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(100, 108, 255, 0.5);
    background: linear-gradient(135deg, #535bf2, #4c4ff7);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    font-size: 1.1rem;
  }
}

// Animations
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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>