<template>
    <div class="info">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Our <span class="brand-gradient">Journey</span>
          </h1>
          <p class="hero-description">
            The story of ROlil Studio - from paper prototypes to digital dreams
          </p>
        </div>
      </section>
  
      <!-- Studio Info Section -->
      <section class="studio-info">
        <div class="container">
          <div class="info-card main-card">
            <div class="studio-header">
              <div class="studio-icon">
                <font-awesome-icon :icon="['fas', 'gamepad']" />
              </div>
              <div class="studio-details">
                <h2 class="studio-name">ROlil Studio</h2>
                <p class="studio-tagline">Founded May 1st, 2021 by indie developer Morunka</p>
              </div>
            </div>
            <p class="studio-description">
              A studio specializing in creating indie games and simple programs for all needs! 
              Besides programs and games, we also release extensions for PenguinMod and much more.
            </p>
          </div>
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
            </div>
          </div>
        </div>
      </section>
  
      <!-- Platforms Section -->
      <section class="platforms-section">
        <div class="container">
          <h2 class="section-title">Development Platforms</h2>
          <div class="platforms-grid">
            <div 
              class="platform-card" 
              v-for="platform in platforms" 
              :key="platform.name"
              :class="{ 'deprecated': platform.deprecated }"
            >
              <div class="platform-icon">
                <font-awesome-icon :icon="['fas', platform.icon]" />
              </div>
              <h3 class="platform-name">{{ platform.name }}</h3>
              <p class="platform-description">{{ platform.description }}</p>
              <div v-if="platform.deprecated" class="deprecated-badge">
                <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
                No longer used
              </div>
              <a v-if="platform.link" :href="platform.link" class="platform-link" target="_blank">
                View Games
                <font-awesome-icon :icon="['fas', 'external-link-alt']" />
              </a>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Current Status -->
      <section class="current-status">
        <div class="container">
          <div class="status-card">
            <div class="status-icon">
              <font-awesome-icon :icon="['fas', 'rocket']" />
            </div>
            <h2 class="status-title">Studio Today</h2>
            <p class="status-description">
              In 2025, By ROlil CO became ROlil Studio. As of June 5th, 2025, 
              we continue to actively develop and release new games, constantly pushing 
              the boundaries of indie game development.
            </p>
            <div class="status-actions">
              <button class="cta-button primary" @click="navigateToProjects">
                <font-awesome-icon :icon="['fas', 'folder-open']" />
                View Our Games
              </button>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Note Section -->
      <section class="note-section">
        <div class="container">
          <div class="note-card">
            <div class="note-icon">
              <font-awesome-icon :icon="['fas', 'info-circle']" />
            </div>
            <p class="note-text">
              If you visit our games section, you might not see games released on Kogama 
              because we consider all Kogama games buggy and not representative of what 
              we could create on better engines.
            </p>
            <a href="#" class="note-link" @click="showKogamaInfo">
              Learn more about our Kogama experience
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </a>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const timelineEvents = ref([
    {
      year: '2019',
      title: 'It\'s SvipS - The Beginning',
      icon: 'star',
      description: 'Created my first game on paper - a life simulator inspired by The Sims.',
      details: [
        'Cut-out characters, different locations, and buttons on separate sheets',
        'A parody of The Sims with unique characters, locations, features, and secrets'
      ]
    },
    {
      year: '2021',
      title: 'By ROlil CO Founded',
      icon: 'building',
      description: 'Created a fictional company to publish games, which later became ROlil Studio.',
      details: [
        'Initially focused exclusively on developing It\'s SvipS',
        'Released new parts, expansions, and updates for the game'
      ]
    },
    {
      year: '2022',
      title: 'Kogama Era',
      icon: 'cube',
      description: 'Started creating games on Kogama platform to reach a wider audience.',
      details: [
        'Main account: Morunka_RORlil for company games',
        'Personal account: NKMH7_RORlil',
        'Created mostly FNAF parodies and other games'
      ]
    },
    {
      year: '2023',
      title: 'Discovery of Scratch',
      icon: 'code',
      description: 'Found Scratch - a visual programming platform that became our new home.',
      details: [
        'Initially struggled with understanding Scratch',
        'Gradually improved programming skills through practice',
        'Created games like Flash and Protect Pikacky'
      ]
    },
    {
      year: '2024',
      title: 'Studio Revival',
      icon: 'heart',
      description: 'Company came back to life with new friends and a Telegram channel.',
      details: [
        'Initially focused exclusively on developing It\'s SvipS',
        'Released new parts, expansions, and updates for the game'
      ]
    },
    {
      year: '2025',
      title: 'ROlil Studio',
      icon: 'crown',
      description: 'Rebranded to ROlil Studio and continue active development.',
      details: [
        'Company became a studio',
        'Actively developing and releasing new games',
        'Focused on better engines and higher quality'
      ]
    }
  ])
  
  const platforms = ref([
    {
      name: 'Paper Games',
      icon: 'file-alt',
      description: 'Where it all began - physical prototypes and board game concepts.',
      deprecated: true
    },
    {
      name: 'Kogama',
      icon: 'cube',
      description: '3D game creation platform where we built our first digital games.',
      deprecated: true,
      link: 'https://www.kogama.com/profile/667438867/games/'
    },
    {
      name: 'Scratch',
      icon: 'cat',
      description: 'Visual programming platform - our current primary development environment.',
      deprecated: false
    },
    {
      name: 'PenguinMod',
      icon: 'puzzle-piece',
      description: 'Platform where we create and publish extensions and modifications.',
      deprecated: false
    }
  ])
  
  const navigateToProjects = () => {
    router.push('/projects')
  }
  
  const showKogamaInfo = () => {
    // This could navigate to a detailed page about Kogama experience
    console.log('Navigate to Kogama info page')
  }
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
  
  // Hero Section
  .hero-section {
    padding: 4rem 0 6rem;
    text-align: center;
    background: linear-gradient(135deg, rgba(100, 108, 255, 0.1), rgba(83, 91, 242, 0.05));
    // Add staggered animation for hero content
    animation: fadeInUp 0.8s ease-out 0.1s both;
    
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
  
  // Platforms Section
  .platforms-section {
    padding: 4rem 0;
    background: rgba(255, 255, 255, 0.02);
    // Add staggered animation for platforms
    animation: fadeInUp 0.8s ease-out 0.5s both;
    
    @media (prefers-color-scheme: light) {
      background: rgba(0, 0, 0, 0.02);
    }
  }
  
  .platforms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }
  
  .platform-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    // Add individual animation for platform cards
    animation: fadeInUp 0.6s ease-out calc(0.6s + var(--card-index, 0) * 0.1s) both;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(100, 108, 255, 0.2);
    }
    
    &.deprecated {
      opacity: 0.7;
      border-color: rgba(255, 193, 7, 0.3);
    }
    
    @media (prefers-color-scheme: light) {
      background: rgba(255, 255, 255, 0.8);
      border-color: rgba(0, 0, 0, 0.1);
    }
    
    // Add CSS custom properties for platform card animations
    &:nth-child(1) { --card-index: 0; }
    &:nth-child(2) { --card-index: 1; }
    &:nth-child(3) { --card-index: 2; }
    &:nth-child(4) { --card-index: 3; }
  }
  
  .platform-icon {
    font-size: 2.5rem;
    color: #646cff;
    margin-bottom: 1rem;
  }
  
  .platform-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .platform-description {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    
    @media (prefers-color-scheme: light) {
      color: rgba(0, 0, 0, 0.7);
    }
  }
  
  .deprecated-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
  
  .platform-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #646cff;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      color: #535bf2;
      text-decoration: underline;
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
  
  // CTA Button
  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
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
  }
  
  // Note Section
  .note-section {
    padding: 3rem 0;
    // Add staggered animation for note section
    animation: fadeInUp 0.8s ease-out 0.8s both;
  }
  
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
  </style>