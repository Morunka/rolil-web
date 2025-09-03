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
            We create games, web experiences, and unique universes, sharing our creative experience <a class="rainbow-shimmer">with you.</a>
          </p>
          <div class="hero-actions">
            <button class="cta-button primary" @click="navigateToProjects">
              <font-awesome-icon :icon="['fas', 'rocket']" />
              View Projects
            </button>
            <button class="cta-button secondary" @click="navigateToAbout">
              <font-awesome-icon :icon="['fas', 'circle-info']" />
              Our Story
            </button>
          </div>
        </div>
      </section>
      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">We are a <a class="rainbow-shimmer">studio from Russian</a>, at the moment our team consists of <a class="rainbow-shimmer">two developers.</a></p>
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
          <p class="hero-description center">Our studio is {{ studioYears }} years old and we never stop preparing <a class="rainbow-shimmer">gifts for you every year.</a></p>
        </div>
      </section>
      <section class="features-section">
        <h2 class="section-title">What We Use</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="tool in tools" :key="tool.id">
            <div class="feature-image-container">
              <img :src="tool.imagePath" :alt="tool.title" class="feature-image" />
            </div>
            <h3 class="feature-title">{{ tool.title }}</h3>
            <p class="feature-description">{{ tool.description }}</p>
          </div>
        </div>
      </section>
      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">Our team is ready for discoveries and can <a class="rainbow-shimmer">help you with your projects.</a></p>
        </div>
      </section>
      <section class="youtube-section">
        <h2 class="section-title">Check Out Our Latest Videos</h2>
        <div class="video-container">
          <div v-if="isLoading">Loading video...</div>
          <div v-else-if="error" class="error-message">Error loading video: {{ error }}</div>
          <div v-else-if="randomVideoId" class="video-wrapper">
            <iframe
              :src="`https://www.youtube.com/embed/${randomVideoId}`"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="youtube-iframe"
            ></iframe>
          </div>
          <div v-else>No videos found.</div>
        </div>
        <p class="hero-description"><a class="rainbow-shimmer">Be the first</a> to watch our videos by subscribing to <a class="rainbow-shimmer">our YouTube channel!</a></p>
        <div class="social-icons">
          <a v-for="social in socialLinks"  :key="social.name" :href="social.url"  :aria-label="social.name" target="_blank"  rel="noopener noreferrer" class="social-icon">
            <img v-if="social.imageUrl" :src="social.imageUrl" :alt="`${social.name} icon`" class="social-image" draggable="false" @dragstart.prevent>
          </a>
        </div>
      </section>
      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">We <a class="rainbow-shimmer">post interesting content every day</a> and can <a class="rainbow-shimmer">collaborate with you for advertising purposes.</a></p>
        </div>
      </section>
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Interested in our work?</h2>
          <p class="cta-description">
            Want to collaborate or just say hello? We'd love to hear from you!
          </p>
          <div class="hero-actions">
            <button class="cta-button primary large" @click="navigateToContact">
              <font-awesome-icon :icon="['fas', 'envelope']" />
              Contact us team
            </button>
            <button class="cta-button secondary large" @click="navigateToCommunity">
              <font-awesome-icon :icon="['fas', 'user']" />
              Join our community
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'; // Import onMounted
import { useRouter } from 'vue-router';

const router = useRouter();

const currentYear = computed(() => new Date().getFullYear());
const studioYears = computed(() => currentYear.value - 2021);

// Features data
const features = ref([
  {
    id: 1,
    icon: 'gamepad',
    title: 'Game Development',
    description: 'Creating interesting games with cool mechanics and exciting plots.'
  },
  {
    id: 2,
    icon: 'code',
    title: 'Web Applications',
    description: 'Building responsive, fast, and scalable web applications using the latest frameworks.'
  },
  {
    id: 3,
    icon: 'globe',
    title: 'Universes Creation',
    description: 'Crafting original universes with unique plots and characters.'
  },
  {
    id: 4,
    icon: 'book-open',
    title: 'Devlog Sharing',
    description: 'Sharing development insights and progress through regular devlogs.'
  }
]);

const socialLinks = ref([
    { name: 'YouTube', url: 'https://www.youtube.com/@FNABRC', imageUrl: new URL('@/assets/icons/youtube.webp', import.meta.url).href }
  ])

// Dynamically import image paths
const GodotImagePath = new URL('@/assets/icons/Godot.png', import.meta.url).href;
const BlenderImagePath = new URL('@/assets/icons/Blender.png', import.meta.url).href;
const GIMPImagePath = new URL('@/assets/icons/GIMP.png', import.meta.url).href;
const VueJsImagePath = new URL('@/assets/icons/Vue.js.png', import.meta.url).href;

// Tools data with updated image paths
const tools = ref([
  {
    id: 1,
    imagePath: GodotImagePath,
    title: 'Godot',
    description: 'Powerful, simple game engine that allows you to create 2D and 3D games.'
  },
  {
    id: 2,
    imagePath: BlenderImagePath,
    title: 'Blender',
    description: 'Powerful editor for creating 3D models.'
  },
  {
    id: 3,
    imagePath: GIMPImagePath,
    title: 'GIMP',
    description: 'A powerful image editor that allows you to edit and create images.'
  },
  {
    id: 4,
    imagePath: VueJsImagePath,
    title: 'Vue.js',
    description: 'A powerful, lightweight framework for building responsive web applications.'
  }
]);

// Navigation functions
const navigateToProjects = () => {
  router.push('/projects');
};
const navigateToAbout = () => {
  router.push('/story');
};
const navigateToContact = () => {
  router.push('/team'); // Ensure this route exists
};
const navigateToCommunity = () => {
  router.push('/community'); // Ensure this route exists
};

// YouTube Video Section
const randomVideoId = ref<string | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
const YOUTUBE_API_KEY = 'AIzaSyDBDQFyuKaDPiZih6yA_66JqTsh7PU72W8';
const YOUTUBE_CHANNEL_ID = 'UC435b8DrrtjxOuL-uS1ZFZg';

const fetchRandomYouTubeVideo = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=10&type=video`
    );
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      // Select a random video from the fetched results
      const randomIndex = Math.floor(Math.random() * data.items.length);
      const selectedVideo = data.items[randomIndex];
      randomVideoId.value = selectedVideo.id.videoId;
    } else {
      console.warn("No videos found for the channel.");
      // randomVideoId.value remains null
    }
  } catch (err: any) {
    console.error("Error fetching YouTube videos:", err);
    error.value = err.message || 'Failed to load video.';
    // randomVideoId.value remains null
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchRandomYouTubeVideo();
});
</script>

<style scoped lang="scss">
.home {
  position: relative;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
  overflow: hidden;
}
// Main Content
.home-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
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
  // Changed to 2 columns for the 2 remaining stats
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 480px) {
     // Stack on very small screens
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
  // Removed uppercase and letter spacing for potentially better readability
  // text-transform: uppercase;
  // letter-spacing: 0.5px;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);
  }
}

.feature-image-container {
  width: 100px; /* Adjust size as needed */
  height: 100px; /* Adjust size as needed */
  margin: 0 auto 1rem auto; /* Center the image container */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Ensures image doesn't overflow the container */
  border-radius: 8px; /* Optional: rounded corners for the container */
}

.feature-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  display: block;
  object-fit: contain; /* Ensures the image scales correctly within the container */
}

.youtube-section {
  padding: 4rem 2rem; /* Add padding similar to other sections */
  text-align: center;
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
}

.video-container {
  max-width: 800px; /* Limit the width of the video player */
  margin: 2rem auto 0; /* Center the container */
  border-radius: 12px; /* Optional: rounded corners */
  overflow: hidden; /* Contain the iframe */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Optional: shadow */
  background-color: #000; /* Background while loading */
  aspect-ratio: 16 / 9; /* Maintain 16:9 aspect ratio */
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-wrapper {
  width: 100%;
  height: 100%;
}

.youtube-iframe {
  width: 100%;
  height: 100%;
  border: none; /* Remove default border */
}

.error-message {
  color: #ff6b6b; /* Red color for errors */
  padding: 1rem;
  background-color: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  display: inline-block;
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
}
</style>