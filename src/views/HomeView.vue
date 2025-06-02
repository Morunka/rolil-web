<template>
  <div class="home">
    
    <!-- Main Content -->
    <div class="home-content">
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Welcome to 
            <span class="brand-gradient">ROlil Studio</span>
          </h1>
          <p class="hero-description">
            Building games and web experiences that push the boundaries of digital creativity.
          </p>
          <div class="hero-actions">
            <button class="cta-button primary" @click="navigateToProjects">
              <font-awesome-icon :icon="['fas', 'rocket']" />
              View Projects
            </button>
            <button class="cta-button secondary" @click="navigateToAbout">
              <font-awesome-icon :icon="['fas', 'user']" />
              About Us
            </button>
          </div>
        </div>
      </section>

      <section class="features-section">
        <h2 class="section-title">What We Do</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', feature.icon]" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Start Your Project?</h2>
          <p class="cta-description">
            Let's collaborate and bring your vision to life with cutting-edge technology.
          </p>
          <button class="cta-button primary large" @click="navigateToContact">
            <font-awesome-icon :icon="['fas', 'envelope']" />
            Get In Touch
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = ref([
  {
    id: 1,
    icon: 'gamepad',
    title: 'Game Development',
    description: 'Creating immersive gaming experiences with modern technologies and engaging gameplay mechanics.'
  },
  {
    id: 2,
    icon: 'code',
    title: 'Web Development',
    description: 'Building responsive, fast, and scalable web applications using the latest frameworks and tools.'
  },
  {
    id: 3,
    icon: 'palette',
    title: 'UI/UX Design',
    description: 'Crafting beautiful and intuitive interfaces that users love to interact with.'
  }
])

const stats = ref([
  { value: '10+', label: 'Projects Completed' },
  { value: '4+', label: 'Years Experience' },
  { value: '80%', label: 'Client Satisfaction' },
])

const navigateToProjects = () => {
  router.push('/projects')
}

const navigateToAbout = () => {
  router.push('/about')
}

const navigateToContact = () => {
  router.push('/home/contacts')
}
</script>

<style scoped lang="scss">
.home {
  position: relative;
  min-height: calc(100vh - 200px);
  overflow: hidden;
}

// Main Content
.home-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
}

.hero-section {
  padding: 4rem 0 6rem;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 2rem 0 4rem;
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

// Buttons
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
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
    }
    
    @media (prefers-color-scheme: light) {
      background: rgba(0, 0, 0, 0.05);
      color: #213547;
      border-color: rgba(0, 0, 0, 0.1);
      
      &:hover {
        background: rgba(0, 0, 0, 0.1);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }
    }
  }
  
  &.large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
  }
}

// Features Section
.features-section {
  padding: 4rem 0;
  
  @media (max-width: 768px) {
    padding: 2rem 0;
  }
}

.section-title {
  text-align: center;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-bottom: 3rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(100, 108, 255, 0.2);
    border-color: rgba(100, 108, 255, 0.3);
  }
  
  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.1);
    
    &:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      border-color: rgba(116, 123, 255, 0.3);
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.feature-icon {
  font-size: 2.5rem;
  color: #646cff;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.feature-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
  
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

// Stats Section
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #646cff;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);
  }
}

// CTA Section
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

// Mobile optimizations
@media (max-width: 768px) {
  .home {
    min-height: calc(100vh - 150px);
  }
  
  .floating-orb {
    &.orb-1, &.orb-4 {
      width: 80px;
      height: 80px;
    }
    
    &.orb-2, &.orb-3 {
      width: 60px;
      height: 60px;
    }
    
    &.orb-5 {
      width: 30px;
      height: 30px;
    }
  }
}

@media (max-width: 480px) {
  .floating-orb {
    &.orb-1, &.orb-4 {
      width: 60px;
      height: 60px;
    }
    
    &.orb-2, &.orb-3 {
      width: 40px;
      height: 40px;
    }
    
    &.orb-5 {
      width: 25px;
      height: 25px;
    }
  }
}
</style>