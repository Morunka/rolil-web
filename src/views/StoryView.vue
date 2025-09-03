<template>
  <div class="info">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Our <span class="brand-gradient">Story</span>
        </h1>
        <p class="hero-description">
          From sketches to full-fledged projects that we create <a class="rainbow-shimmer">for you.</a>
        </p>
      </div>
    </section>
    <section class="stats-section">
      <div class="stats-grid">
        <p class="hero-description center">We are a small studio of <a class="rainbow-shimmer">two people</a> that creates our own game universes, web applications, programs and various utilities <a class="rainbow-shimmer">for you.</a></p>
      </div>
    </section>
    <!-- Timeline Section -->
    <section class="timeline-section">
      <div class="container">
        <h2 class="section-title">How the Studio Was Founded</h2>
        <div class="timeline">
          <div
            class="timeline-item"
            v-for="(event, index) in timelineEvents"
            :key="index"
            :class="{ 'left': index % 2 === 0, 'right': index % 2 === 1 }"
          >
            <div class="timeline-content">
              <div class="timeline-icon">
                <font-awesome-icon :icon="['fas', event.icon]" />
              </div>
              <div class="timeline-card">
                <div class="timeline-year">{{ event.year }}</div>
                <h3 class="timeline-title">{{ event.title }}</h3>
                <p class="timeline-description">{{ event.description }}</p>
                <div v-if="event.details" class="timeline-details">
                  <p v-for="detail in event.details" :key="detail">{{ detail }}</p>
                </div>
              </div>
            </div>
            <!-- Add image to the opposite side -->
            <img
              v-if="event.imagePath && event.imagePath.length > 0"
              :src="event.imagePath[0]"
              alt="Event Image"
              class="timeline-image"
              :class="{ 'left-image': index % 2 === 0, 'right-image': index % 2 === 1 }"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="stats-grid">
        <p class="hero-description center">Below we have prepared <a class="rainbow-shimmer">for you</a> 10 random photos that have accumulated over the entire <a class="rainbow-shimmer">life of our studio.</a></p>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="gallery-section">
      <div class="container">
        <h2 class="section-title">Gallery</h2>
        <div class="gallery-container">
          <div v-if="galleryLoading" class="gallery-loading">Loading gallery...</div>
          <div v-else-if="galleryError" class="gallery-error">{{ galleryError }}</div>
            <div v-else-if="galleryImages.length > 0" class="gallery-wrapper">
              <!-- Move buttons outside the image container -->
              <div class="gallery-navigation">
                <div class="gallery-image-container">
                  <transition name="fade" mode="out-in">
                    <div :key="currentImageIndex" class="gallery-image-wrapper">
                      <img
                        v-if="galleryImages.length && galleryImages[currentImageIndex]"
                        :src="galleryImages[currentImageIndex]"
                        :alt="`Gallery Image ${currentImageIndex + 1}`"
                        class="gallery-image"
                        @error="handleImageError"
                      />
                      <!-- Optional: Placeholder or message if image data is unexpectedly missing for the current index -->
                      <div v-else class="gallery-image-placeholder">Image not available</div>
                    </div>
                  </transition>
                </div>
                <div class="arrows-wrapper">
                  <button @click="prevImage" class="gallery-arrow gallery-arrow-left" aria-label="Previous Image">
                    <font-awesome-icon :icon="['fas', 'chevron-left']" />
                  </button>
                  <div class="gallery-counter">
                    {{ (currentImageIndex % galleryImages.length) + 1 }} / {{ galleryImages.length }}
                  </div>
                  <button @click="nextImage" class="gallery-arrow gallery-arrow-right" aria-label="Next Image">
                    <font-awesome-icon :icon="['fas', 'chevron-right']" />
                  </button>
                </div>
              </div>
            </div>
          <div v-else class="gallery-empty">
            No images found in the gallery.
          </div>
          <div class="hero-actions">
            <button class="cta-button secondary" @click="navigateToGallery">
              <font-awesome-icon :icon="['fas', 'image']" />
              See More
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="stats-grid">
        <p class="hero-description center">The photos change <a class="rainbow-shimmer">every time you visit the page</a>, so <a class="rainbow-shimmer">you won't get bored.</a></p>
      </div>
    </section>

    <!-- Current Status -->
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Studio Today</h2>
          <p class="cta-description">
            Today our studio is studying <a class="rainbow-shimmer">the new game engine "Godot"</a>, we are developing <a class="rainbow-shimmer">a new game Last Race</a> and actively promoting in social networks.
          </p>
          <div class="hero-actions">
            <button class="cta-button primary large" @click="navigateToCommunity">
              <font-awesome-icon :icon="['fas', 'user']" />
              Join our community
            </button>
            <button class="cta-button secondary large" @click="navigateToCommunity">
              <font-awesome-icon :icon="['fas', 'comment']" />
              Give feedback
            </button>
          </div>
        </div>
      </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const timelineEvents = ref([
  {
    year: '2019',
    title: 'Paper It\'s SvipS',
    icon: 'star',
    description: 'Created first game, It\'s SvipS a life simulator like The Sims, but on paper.',
    details: [
      'It\'s SvipS is a paper game inspired by The Sims with special mechanics and features',
      'Hand drawn characters, cities with different locations, cut out interface, neighbors, relationships, character creation, city editing, careers and much more'
    ],
    imagePath: [
      new URL('../assets/photos/paper_svips.jpg', import.meta.url).href
    ]
  },
  {
    year: '2021',
    title: 'By ROlil CO Founded',
    icon: 'building',
    description: 'Created a fictional company to publish games.',
    details: [
      'At first, the company was developing It\'s SvipS, releasing new updates, patches and expansions',
      'Over time, we wanted to take our games to the world level, and to do this, we started looking for a new platform to develop and release real games for the whole world'
    ],
    imagePath: [
      new URL('../assets/photos/svips_alpha.png', import.meta.url).href
    ]
  },
  {
    year: '2022',
    title: 'Kogama',
    icon: 'cube',
    description: 'We started creating games on the Kogama platform for the whole world.',
    details: [
      'Over time, we discovered the Kogama platform, where you can create and share your games with everyone',
      'We thought out universes, plots and developed different games on a new platform for everyone',
      'We decided to take Horror as the main genre, because in Kogama you can create interesting (and sometimes even scary) 3D games'
    ],
    imagePath: [
      new URL('../assets/photos/mille_kogama.png', import.meta.url).href
    ]
  },
  {
    year: '2023',
    title: 'Scratch',
    icon: 'code',
    description: 'We joined the Scratch community and started creating games on Scratch game engine.',
    details: [
      'After some time, we learned about the Scratch game engine and decided to try creating games on it',
      'Scratch allows you to create 2D games with less advanced graphics than Kogama but with the ability to draw the entire game',
      'We released a new Flash game in the FNAF-parody genre and gradually began to improve our skills in creating games on Scratch',
      'We created our own telegram channel and started promoting it in every possible way and publishing the progress of creating new games'
    ],
    imagePath: [
      new URL('../assets/photos/mille_scratch.png', import.meta.url).href
    ]
  },
  {
    year: '2024',
    title: 'FNaS',
    icon: 'heart',
    description: 'We released Protect Pikacky and started developing the most large FNaF parody in our studio called FNaS in Scratch.',
    details: [
      'We spent almost all our time developing FNaS (Five Nights at Stickmans), publishing news in our telegram channel and developing a new game',
      'After some time, we created FNaS, then released FNaS 2 and decided to make a remake of the first part, which took a lot of time'
    ],
    imagePath: [
      new URL('../assets/photos/fnas_scratch.jpg', import.meta.url).href
    ]
  },
  {
    year: '2025',
    title: 'ROlil Studio',
    icon: 'crown',
    description: 'Rebranded to ROlil Studio and continue active development.',
    details: [
      'After some time, our fictitious company became a studio, we understood Scratch very well and could do everything we wanted on it',
      'We decided to temporarily stop developing FNAS and work on a new small game called Racing Cars Adventures (RCA), this game received the horror genre, we released a demo version and it seemed to us that this was not enough',
      'We decided to continue developing the RSA and divided it into 4 chapters, we released the first chapter and started developing the second chapter'
    ],
    imagePath: [
      new URL('../assets/photos/rca_eng_scratch.png', import.meta.url).href
    ]
  }
])

// --- Gallery Functionality ---
const galleryImages = ref([
  { default: new URL('@/assets/gallery/a.png', import.meta.url).href },
  { default: new URL('@/assets/gallery/c.jpg', import.meta.url).href },
  // Add more hardcoded paths
]);
const currentImageIndex = ref(0);
const galleryLoading = ref(true);
const galleryError = ref<string | null>(null);

// Function to dynamically import images
const loadGalleryImages = async () => {
  galleryLoading.value = true;
  galleryError.value = null;
  try {
    // Import all images from the gallery directory
    const imageModules = import.meta.glob('@/assets/gallery/*.{jpg,jpeg,png,webp,gif,svg}', { eager: true });
    // console.log('Image Modules:', imageModules); // Debug: Check what modules are imported

    // Convert the modules object into an array of image paths
    const imagePaths = Object.values(imageModules).map((module: any) => module.default);

    // console.log('Image Paths:', imagePaths); // Debug: Check the extracted image paths

    if (imagePaths.length === 0) {
      console.warn('No images found in @/assets/gallery/');
      galleryImages.value = [];
      return;
    }

    // Shuffle the array
    const shuffledImages = [...imagePaths].sort(() => 0.5 - Math.random());

    // Select the first 10 images
    const selectedImages = shuffledImages.slice(0, 10);

    galleryImages.value = selectedImages; // Populate galleryImages with the actual image URLs
    currentImageIndex.value = 0; // Reset index on new load
  } catch (err) {
    console.error('Failed to load gallery images:', err);
    galleryError.value = 'Failed to load gallery images.';
  } finally {
    galleryLoading.value = false;
  }
};

// Navigation functions
const nextImage = () => {
  if (galleryImages.value.length === 0) return;
  currentImageIndex.value = (currentImageIndex.value + 1) % galleryImages.value.length;
};

const prevImage = () => {
  if (galleryImages.value.length === 0) return;
  // Handle negative index correctly for looping
  currentImageIndex.value = (currentImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length;
};

// Handle image loading errors
const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement;
    console.warn(`Failed to load gallery image: ${target.src}`);
    target.alt = "Image failed to load";
    // Optionally, you could set a placeholder image here
    // target.src = '/path/to/placeholder.jpg';
};

const navigateToProjects = () => {
  router.push('/projects')
}

const navigateToGallery = () => {
  router.push('/gallery');
};

const navigateToCommunity = () => {
  router.push('/community'); // Ensure this route exists
};

// Load images when the component is mounted
onMounted(() => {
  loadGalleryImages();
});
</script>

<style scoped lang="scss">
.info {
  min-height: 100vh;
  padding-bottom: 2rem;
  // Add the main animation to the entire info component
  animation: fadeInUp 0.8s ease-out;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
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
.hero-description {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}
// Studio Info Section
.studio-info {
  padding: 3rem 0;
  // Add staggered animation for studio info
  animation: fadeInUp 0.8s ease-out 0.2s both;
}
.info-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.1);
  }
}
.studio-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
.studio-icon {
  font-size: 3rem;
  color: #646cff;
  flex-shrink: 0;
}
.studio-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #646cff, #535bf2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.studio-tagline {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin: 0;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);
  }
}
.studio-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}
// Timeline Section
.timeline-section {
  padding: 4rem 0;
  // Add staggered animation for timeline
  animation: fadeInUp 0.8s ease-out 0.3s both;
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
.timeline {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(135deg, #646cff, #535bf2);
    transform: translateX(-50%);
    @media (max-width: 768px) {
      left: 30px;
    }
  }
}
.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  // Add individual animation for each timeline item
  animation: fadeInUp 0.6s ease-out calc(0.4s + var(--item-index, 0) * 0.1s) both;
  &.left .timeline-content {
    padding-right: calc(50% + 2rem);
    text-align: right;
    @media (max-width: 768px) {
      padding-right: 0;
      padding-left: 4rem;
      text-align: left;
    }
  }
  &.right .timeline-content {
    padding-left: calc(50% + 2rem);
    @media (max-width: 768px) {
      padding-left: 4rem;
    }
  }
  // Add CSS custom properties for staggered animations
  &:nth-child(1) { --item-index: 0; }
  &:nth-child(2) { --item-index: 1; }
  &:nth-child(3) { --item-index: 2; }
  &:nth-child(4) { --item-index: 3; }
  &:nth-child(5) { --item-index: 4; }
  &:nth-child(6) { --item-index: 5; }
}
.timeline-icon {
  position: absolute;
  left: 50%;
  top: 0;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #646cff, #535bf2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  transform: translateX(-50%);
  z-index: 2;
  @media (max-width: 768px) {
    left: 30px;
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}
.timeline-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(100, 108, 255, 0.15);
  }
  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.1);
  }
}
.timeline-year {
  color: #646cff;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}
.timeline-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.timeline-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1rem;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}
.timeline-details {
  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    border-left: 2px solid rgba(100, 108, 255, 0.3);
    @media (prefers-color-scheme: light) {
      color: rgba(0, 0, 0, 0.5);
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
// Gallery Section (formerly Platforms Section)
.gallery-section {
  padding: 4rem 0;
  background: rgba(255, 255, 255, 0.02);
  animation: fadeInUp 0.8s ease-out 0.5s both;
  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.02);
  }
}

// --- Gallery Styles ---
.gallery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-height: 300px; // Provide a minimum height for loading/error states
}

.gallery-loading,
.gallery-error,
.gallery-empty {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.gallery-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px; /* Adjust max width as needed */
}

.gallery-image-container {
  width: 100%;
  aspect-ratio: 16 / 9; /* Maintain a consistent aspect ratio */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.1); /* Background while loading or if image fails */
  margin-bottom: 1rem; /* Space for the counter */
}

.gallery-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  display: block;
  object-fit: contain; /* Fit the image within the container, maintaining aspect ratio */
}

/* .gallery-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white !important;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  outline: none;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }
  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(0, 0, 0, 0.3);
    color: black;
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
  @media (max-width: 600px) {
    position: relative;
  }
} */

.arrows-wrapper {
  display: flex;
  justify-content: space-between; /* This pushes children to opposite ends */
  align-items: center; /* Aligns items vertically in the center */
  width: 100%; /* Takes full width to span the container */
  /* No 'position: relative' needed here unless arrows need specific absolute positioning within this wrapper */
  margin-bottom: 1rem; /* Add some space below the arrows */
}

.gallery-counter {
  position: relative;
  margin-bottom: 1rem;
  width: 4.4rem;
  background: rgba(0, 0, 0, 0.5); // Semi-transparent background for contrast
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 5;
  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.7);
    color: black;
  }
}

// Current Status Section
.current-status {
  padding: 4rem 0;
  // Add staggered animation for current status
  animation: fadeInUp 0.8s ease-out 0.7s both;
}
.status-card {
  background: linear-gradient(135deg, rgba(100, 108, 255, 0.1), rgba(83, 91, 242, 0.05));
  border: 1px solid rgba(100, 108, 255, 0.2);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  @media (max-width: 768px) {
    padding: 2rem;
  }
}
.status-icon {
  font-size: 3rem;
  color: #646cff;
  margin-bottom: 1.5rem;
}
.status-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}
.status-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}
.status-actions {
  margin-top: 2rem;
}

// Note Section
.note-card {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}
.note-icon {
  font-size: 1.5rem;
  color: #ffc107;
  flex-shrink: 0;
  margin-top: 0.25rem;
}
.note-text {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1rem;
  flex-grow: 1;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}
.note-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffc107;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  &:hover {
    color: #ffcd39;
    text-decoration: underline;
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
  // Mobile optimizations
  @media (max-width: 768px) {
    .timeline-item {
      &.left .timeline-content,
      &.right .timeline-content {
        padding-left: 4rem;
        padding-right: 0;
        text-align: left;
      }
    }
  }
  // Images style
.timeline {
  .timeline-item {
    &.left {
      .timeline-image {
        position: absolute;
        top: 0;
        right: -0rem;
        max-width: 29rem;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%; // Same width as the timeline-card
        height: 100%; // Same height as the timeline-card
        object-fit: cover; // Ensures the image fills the space without distortion
        @media (max-width: 1080px) {
          display: none;
        }
      }
    }
    &.right {
      .timeline-image {
        position: absolute;
        top: 0;
        left: -0rem;
        max-width: 29rem;
        height: 18rem;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%; // Same width as the timeline-card
        height: 100%; // Same height as the timeline-card
        object-fit: cover; // Ensures the image fills the space without distortion
        @media (max-width: 1080px) {
          display: none;
        }
      }
    }
  }
  .timeline-card {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  .timeline-image {
    max-width: 150px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(100, 108, 255, 0.6);
    }
  }
}
</style>