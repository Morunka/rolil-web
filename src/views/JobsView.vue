<!-- src/views/JobsView.vue -->
<template>
  <div class="jobs">
    <div class="jobs-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Join the
            <span class="brand-gradient">ROlil Studio</span> Team
          </h1>
          <p class="hero-description">
            We're always <a class="rainbow-shimmer">looking for passionate individuals to help us create amazing games and web experiences.</a> If you share our vision and want to be part of our journey, <a class="rainbow-shimmer">we'd love to hear from you!</a>
          </p>
        </div>
      </section>

      <!-- Open Positions Section -->
      <section class="features-section">
        <h2 class="section-title">Current Openings</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'gamepad']" />
            </div>
            <h3 class="feature-title">Godot Developer</h3>
            <p class="feature-description">Help us bring our game ideas to life using the Godot game engine. Experience with 2D/3D game development preferred.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'paint-brush']" />
            </div>
            <h3 class="feature-title">Pixel Artist/Sprite Designer</h3>
            <p class="feature-description">Create charming pixel arts and animate it to bring our characters and worlds to life. Experience with GIMP is a plus.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'code']" />
            </div>
            <h3 class="feature-title">Fullstack Web Developer (Vue.js)</h3>
            <p class="feature-description">Build and maintain our web presence. Proficiency in Vue.js, Node.js, and modern web technologies is a plus.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'palette']" />
            </div>
            <h3 class="feature-title">Studio Logo Designer</h3>
            <p class="feature-description">We're looking for a talented designer to create a fresh, new logo that represents the spirit of ROlil Studio.</p>
          </div>
        </div>
      </section>

      <!-- Initiative Section -->
      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">
            <a class="rainbow-shimmer">We are always open to initiatives!</a> If you have skills or ideas you want to contribute, even if there isn't a specific role listed, <a class="rainbow-shimmer">please reach out</a>. We value passion and creativity above all.
          </p>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Make an Impact?</h2>
          <p class="cta-description">
            Get in touch with us to discuss opportunities or express your interest. Budget details will be discussed directly upon contact.
          </p>
          <div class="hero-actions">
            <button class="cta-button primary large" @click="goToContact">
              <font-awesome-icon :icon="['fas', 'envelope']" />
              Contact Us
            </button>
            <button class="cta-button secondary large" @click="goToJoinForm">
              <font-awesome-icon :icon="['fas', 'user-plus']" />
              Apply to Join
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Импортируем nextTick
import { nextTick } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToContact = () => {
  router.push('/contact');
};

const goToJoinForm = async () => {
  await router.push('/team#join-form');
  
  const scrollToElement = async (id: string, retries: number = 10, delay: number = 100) => {
    await nextTick();
    
    const element = document.getElementById(id);
    if (element) {
      console.log(`Element with id '${id}' found. Attempting to scroll...`);
      
      try {
        const headerHeight = 80;
        
        // Получаем абсолютную позицию элемента относительно документа
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        
        // Вычисляем финальную позицию с учетом хедера
        const targetScrollPosition = absoluteElementTop - headerHeight;
        
        console.log('Current scroll position:', window.pageYOffset);
        console.log('Element absolute top:', absoluteElementTop);
        console.log('Target scroll position:', targetScrollPosition);
        
        // Скроллим к целевой позиции
        window.scrollTo({
          top: Math.max(0, targetScrollPosition), // Не скроллим выше начала страницы
          behavior: 'smooth'
        });
        
        console.log('Scroll initiated to position:', Math.max(0, targetScrollPosition));
        
      } catch (scrollError) {
        console.error("Error during scroll attempt:", scrollError);
        
        // Fallback метод без компенсации хедера
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    } else if (retries > 0) {
      console.log(`Element with id '${id}' not found. Retrying in ${delay}ms... (${retries} retries left)`);
      setTimeout(() => {
        scrollToElement(id, retries - 1, delay);
      }, delay);
    } else {
      console.warn(`Element with id '${id}' not found after all retries.`);
    }
  };

  // Добавляем небольшую задержку для завершения навигации
  setTimeout(() => {
    scrollToElement('join-form');
  }, 50);
};
</script>

<style scoped lang="scss">
.jobs {
  position: relative;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
  overflow: hidden;
}

// Main Content
.jobs-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center; /* Center hero text */
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

// Features Section (Reusable from Home)
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

.center {
  text-align: center;
}

// Stats Section (Reusable from Home)
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
  grid-template-columns: 1fr; /* Single column for text */
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
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
  .jobs {
    min-height: calc(100vh - 150px);
  }
}
</style>