<template>
    <div class="news">
      <!-- Main Content -->
      <div class="news-content">
        <section class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">
              <span class="brand-gradient">News</span>
              &
              <span class="brand-gradient">Updates</span>
            </h1>
            <p class="hero-description">
              Stay connected with our latest updates and follow our channels for the most current information across various topics.
            </p>
          </div>
        </section>

        <section class="channels-section">
          <h2 class="section-title">Our Official Channels</h2>
          <p class="section-description">
            Below we've pinned our channels where we publish the most current information on various topics
          </p>
          
          <div class="channels-grid">
            <div 
              class="channel-card" 
              v-for="(channel, index) in channels" 
              :key="channel.id"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="channel-image">
                <img :src="channel.image" :alt="channel.title" />
              </div>
              <div class="channel-content">
                <h3 class="channel-title">{{ channel.title }}</h3>
                <p class="channel-description">{{ channel.description }}</p>
                <div class="channel-actions">
                  <button 
                    class="channel-link" 
                    @click="openChannel(channel.url)"
                    :aria-label="`Open ${channel.title} on Telegram`"
                  >
                    <font-awesome-icon :icon="['fab', 'telegram']" />
                    <span>Follow Channel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        <!-- <section class="cta-section">
          <div class="cta-content">
            <h2 class="cta-title">Stay Updated</h2>
            <p class="cta-description">
              Join our community and never miss the latest news, updates, and exclusive content from ROlil Studio.
            </p>
            <button class="cta-button primary large" @click="navigateToContact">
              <font-awesome-icon :icon="['fas', 'bell']" />
              Get Notifications
            </button>
          </div>
        </section> -->
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  router
  
  const channels = ref([
    {
      id: 1,
      title: 'By ROlil Studio',
      description: 'Official Telegram channel By ROlil Studio for studio news',
      image: 'https://i.ibb.co/BK74r3d3/By-ROlil-Studio-Big.jpg',
      url: 'https://t.me/By_RORlil'
    },
    {
      id: 2,
      title: 'IT Sphere',
      description: 'Official Telegram channel By ROlil Studio about IT',
      image: 'https://i.ibb.co/DPGn23nW/IT-Sphere.jpg',
      url: 'https://t.me/CLIP_Project_AI'
    },
    {
      id: 3,
      title: 'By ROlil Studio Characters',
      description: 'Telegram channel about By ROlil Studio characters',
      image: 'https://i.ibb.co/DxP91zp/BRS-Characters.png',
      url: 'https://t.me/CharactersByRORlilCo'
    },
    {
      id: 4,
      title: 'Five Nights at Stickmans',
      description: 'Telegram channel about FNaF parody game series FNaS from By ROlil Studio',
      image: 'https://i.ibb.co/k25HppP4/FNa-S-Logo.jpg',
      url: 'https://t.me/CharactersByRORlilCo'
    }
  ])
  
  const openChannel = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  
  </script>
  
  <style scoped lang="scss">
  .news {
    position: relative;
    min-height: calc(100vh - 200px);
    overflow: hidden;
  }
  
  // Main Content
  .news-content {
    position: relative;
    z-index: 1;
    animation: fadeInUp 0.8s ease-out;
  }
  
  .hero-section {
    padding: 4rem 0 3rem;
    text-align: center;
    
    @media (max-width: 768px) {
      padding: 2rem 0 1.5rem;
    }
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
  
  // CTA Section (same as HomeView)
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
  
  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    border-radius: 12px;
    border: none;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    
    &.primary {
      background: linear-gradient(135deg, #646cff, #535bf2);
      color: white;
      box-shadow: 0 4px 15px rgba(100, 108, 255, 0.4);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(100, 108, 255, 0.6);
        background: linear-gradient(135deg, #535bf2, #4c4ff7);
      }
    }
    
    &.large {
      padding: 1rem 2rem;
      font-size: 1.125rem;
    }
    
    &:active {
      transform: translateY(0);
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
  
  // Mobile optimizations
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
  }
  
  @media (max-width: 480px) {
    .channel-image {
      height: 180px;
    }
    
    .channel-link {
      padding: 0.625rem 1.25rem;
      font-size: 0.85rem;
    }
  }
</style>