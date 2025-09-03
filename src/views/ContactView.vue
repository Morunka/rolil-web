<!-- src/views/ContactView.vue -->
<template>
  <div class="contact">
    <div class="contact-content">
      <!-- Hero Section -->
      <section class="hero-section animate-once">
        <div class="hero-content">
          <h1 class="hero-title">
            Connect with
            <span class="brand-gradient">ROlil Studio</span>
          </h1>
          <p class="hero-description">
            Want to make a collaboration or discuss something? <a class="rainbow-shimmer">We will be glad to hear from you!</a> Contact us, <a class="rainbow-shimmer">we will respond as soon as possible.</a>
          </p>
        </div>
      </section>

      <!-- Contact Options Section -->
      <section class="features-section animate-once">
        <h2 class="section-title">How to Reach Us</h2>
        <div class="features-grid">

          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fab', 'telegram']" />
            </div>
            <h3 class="feature-title">Russian Telegram channel</h3>
            <p class="feature-description">Write comments under our posts, send a message to the channel's PM or contact the administration.</p>
            <a href="https://t.me/By_RORlil" target="_blank" rel="noopener noreferrer" class="contact-link fix-font">@By_RORlil</a>
          </div>


          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'users']" />
            </div>
            <h3 class="feature-title">Our Team</h3>
            <p class="feature-description">Contact our team members.</p>
            <router-link to="/team" class="contact-link fix-font">To team</router-link>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon :icon="['fas', 'user-tie']" />
            </div>
            <h3 class="feature-title">Studio Owner</h3>
            <p class="feature-description">Contact the Russian and English speaking studio owner in telegram.</p>
            <a href="https://t.me/MEOW_MUR920" target="_blank" rel="noopener noreferrer" class="contact-link fix-font">@MEOW_MUR920</a>
          </div>

        </div>
      </section>

      <!-- Sticker Pack Section -->
      <section class="stats-section animate-once">
        <div class="stats-grid">
          <p class="hero-description center">
            We have <a class="rainbow-shimmer">a lot of interesting content,</a> as well as our own  <a class="fix-font" href="https://t.me/addstickers/ByROlilStudio" target="_blank" rel="noopener noreferrer">sticker pack in Telegram</a>  <a class="rainbow-shimmer">for you!</a>
          </p>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section animate-once">
        <div class="cta-content">
          <h2 class="cta-title">Stay Connected</h2>
          <p class="cta-description">
            Follow us on our social channels and never miss an update!
          </p>
          <div class="hero-actions">
            <button class="cta-button primary large" @click="goToNews">
              <font-awesome-icon :icon="['fas', 'newspaper']" />
              Read Our Latest News
            </button>
            <button class="cta-button secondary large" @click="goToProjects">
              <font-awesome-icon :icon="['fas', 'rocket']" />
              Explore Our Projects
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToNews = () => {
  router.push('/news');
};

const goToProjects = () => {
  router.push('/projects');
};
</script>

<style scoped lang="scss">
.contact {
  position: relative;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
  overflow: hidden;
}

// Main Content
.contact-content {
  position: relative;
  z-index: 1;
}

// --- Fade In Up Animation ---
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

// Apply animation to sections
.hero-section,
.features-section,
.stats-section,
.cta-section {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0; // Start hidden
}

// Stagger the animation delays for a sequential effect
// Using CSS classes for simplicity, but nth-child or JS could be used for more control
.hero-section.animate-once {
  animation-delay: 0.1s; // Slight initial delay
}
.features-section.animate-once {
  animation-delay: 0.3s;
}
.stats-section.animate-once {
  animation-delay: 0.5s;
}
.cta-section.animate-once {
  animation-delay: 0.7s;
}
// --- End Fade In Up Animation ---

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
    // Removed shimmer animation from title text itself as it was conflicting
    // animation: shimmer 2s ease-in-out infinite alternate;
  }
}

// Optional: Shimmer animation for brand text if desired (uncomment if needed)
// @keyframes shimmer {
//   0% {
//     background: linear-gradient(135deg, #646cff, #535bf2);
//     -webkit-background-clip: text;
//     background-clip: text;
//   }
//   100% {
//     background: linear-gradient(135deg, #535bf2, #4c4ff7);
//     -webkit-background-clip: text;
//     background-clip: text;
//   }
// }
// .brand-gradient {
//    animation: shimmer 2s ease-in-out infinite alternate;
// }

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
  margin-bottom: 1rem; /* Add margin below description */
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.contact-link {
  display: inline-block; /* Make link behave like a block for padding/margin */
  color: #646cff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  word-break: break-word; /* Break long words/emails */

  &:hover {
    color: #535bf2;
    text-decoration: underline;
  }

  @media (prefers-color-scheme: light) {
    color: #747bff;

    &:hover {
      color: #646cff;
    }
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

// Mobile optimizations
@media (max-width: 768px) {
  .contact {
    min-height: calc(100vh - 150px);
  }
}

@keyframes rainbowShimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>