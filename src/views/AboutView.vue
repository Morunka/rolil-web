<template>
  <div class="about">
    <div class="about-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            About <span class="brand-gradient">ROlil Studio</span>
          </h1>
          <p class="hero-description">
            From humble beginnings to crafting unique digital experiences, discover the journey, passion, and people behind <a class="rainbow-shimmer">our creative universe.</a>
          </p>
        </div>
      </section>

      <!-- Studio Story Section -->
      <section class="features-section">
        <h2 class="section-title">Our Studio's Journey</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'seedling']" />
            </div>
            <h3 class="feature-title">Humble Beginnings</h3>
            <p class="feature-description">
              Founded in 2021, ROlil Studio started as a passion project fueled by a love for games and technology.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'users']" />
            </div>
            <h3 class="feature-title">Growing Together</h3>
            <p class="feature-description">
              We've evolved from a solo endeavor into a collaborative team, always focused on learning and creating.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'lightbulb']" />
            </div>
            <h3 class="feature-title">Creative Vision</h3>
            <p class="feature-description">
              Our core is about building immersive universes and sharing our unique creative process with the world.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'bullseye']" />
            </div>
            <h3 class="feature-title">Looking Forward</h3>
            <p class="feature-description">
              We are committed to pushing boundaries, exploring new ideas, and delivering memorable experiences.
            </p>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">
            At the heart of ROlil Studio is a <a class="rainbow-shimmer">dedicated team of two</a>, united by a shared vision and a passion for creation.
          </p>
        </div>
      </section>

      <!-- Values Section -->
      <section class="features-section">
        <h2 class="section-title">What Drives Us</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'heart']" />
            </div>
            <h3 class="feature-title">Passion</h3>
            <p class="feature-description">
              Every project is born from genuine excitement and a deep love for what we do.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'hands-helping']" />
            </div>
            <h3 class="feature-title">Collaboration</h3>
            <p class="feature-description">
              We believe the best ideas come from working together, both within our team and with our community.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'star']" />
            </div>
            <h3 class="feature-title">Quality</h3>
            <p class="feature-description">
              We strive for excellence in every detail, ensuring our creations are polished and meaningful.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'comments']" />
            </div>
            <h3 class="feature-title">Community</h3>
            <p class="feature-description">
              Our fans and followers are integral to our journey. We value feedback and love sharing our progress.
            </p>
          </div>
        </div>
      </section>

      <!-- Journey Section -->
      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">
            Over the past {{ studioYears }} years, we've been on an incredible journey, constantly learning, <a class="rainbow-shimmer">growing, and preparing exciting gifts for you every year.</a>
          </p>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Want to be Part of Our Story?</h2>
          <p class="cta-description">
              Got a project idea or a question? Let's connect!
          </p>
          <div class="hero-actions">
            <button class="cta-button primary large" @click="navigateToContact">
              <font-awesome-icon :icon="['fas', 'envelope']" />
              Contact Us
            </button>
            <button class="cta-button secondary large" @click="navigateToNews">
              <font-awesome-icon :icon="['fas', 'newspaper']" />
              Read Our News
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const currentYear = computed(() => new Date().getFullYear());
const studioYears = computed(() => currentYear.value - 2021);

// Navigation functions
const navigateToContact = () => {
  router.push('/team'); // Ensure this route exists
};
const navigateToNews = () => {
  router.push('/news'); // Ensure this route exists
};
</script>

<style scoped lang="scss">
.about {
  position: relative;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
  overflow: hidden;
}

// Main Content
.about-content {
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
  .about {
    min-height: calc(100vh - 150px);
  }
}
</style>