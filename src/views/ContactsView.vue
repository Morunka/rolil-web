<template>
    <div class="contacts">
      
      <!-- Main Content -->
      <div class="contacts-content">
        <section class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">
              Meet 
              <span class="brand-gradient">Morunka</span>
            </h1>
            <p class="hero-description">
              Our team has only one developer named Morunka - a passionate full-stack developer crafting digital experiences.
            </p>
            <div class="hero-actions">
              <button class="cta-button primary" @click="downloadPortfolio">
                <font-awesome-icon :icon="['fas', 'download']" />
                Download Portfolio
              </button>
              <button class="cta-button secondary" @click="scrollToContact">
                <font-awesome-icon :icon="['fas', 'envelope']" />
                Get In Touch
              </button>
            </div>
          </div>
        </section>
  
        <section class="stack-section">
          <h2 class="section-title">Technology Stack</h2>
          <div class="stack-grid">
            <div class="stack-category" v-for="category in techStack" :key="category.name">
              <div class="category-icon">
                <font-awesome-icon :icon="['fas', category.icon]" />
              </div>
              <h3 class="category-title">{{ category.name }}</h3>
              <div class="tech-list">
                <span class="tech-item" v-for="tech in category.technologies" :key="tech">
                  {{ tech }}
                </span>
              </div>
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
  
        <section class="contact-section" id="contact">
          <div class="contact-content">
            <h2 class="section-title">Let's Connect</h2>
            <p class="contact-description">
              Ready to discuss your project? Reach out through any of these platforms and let's bring your ideas to life.
            </p>
            
            <div class="contact-links">
              <a 
                v-for="link in contactLinks" 
                :key="link.name"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="contact-link"
              >
                <div class="link-icon">
                  <font-awesome-icon :icon="['fab', link.icon]" v-if="link.iconType === 'fab'" />
                  <font-awesome-icon :icon="['fas', link.icon]" v-else />
                </div>
                <div class="link-content">
                  <h4 class="link-title">{{ link.name }}</h4>
                  <p class="link-description">{{ link.description }}</p>
                </div>
              </a>
            </div>
          </div>
        </section>
  
        <section class="cta-section">
          <div class="cta-content">
            <h2 class="cta-title">Ready to Start Your Project?</h2>
            <p class="cta-description">
              Let's collaborate and turn your vision into reality with modern web technologies.
            </p>
            <button class="cta-button primary large" @click="openTelegram">
              <font-awesome-icon :icon="['fab', 'telegram']" />
              Message on Telegram
            </button>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const techStack = ref([
    {
      name: 'Frontend',
      icon: 'code',
      technologies: ['HTML5', 'CSS3', 'JavaScript (ES6)', 'Vue.js', 'Vue Router', 'Axios', 'Fetch']
    },
    {
      name: 'Backend',
      icon: 'server',
      technologies: ['Node.js', 'Express.js', 'REST API', 'JSON']
    },
    {
      name: 'Tools',
      icon: 'tools',
      technologies: ['Git', 'npm', 'VS Code', 'Docker', 'Docker Compose', 'Konsole']
    },
    {
      name: 'Other',
      icon: 'cog',
      technologies: ['Markdown', 'Bash', 'Linux system administration']
    }
  ])
  
  const stats = ref([
    { value: '1', label: 'Team Member' },
    { value: '4+', label: 'Years Experience' },
    { value: '90%', label: 'Dedication' },
    { value: '8/7', label: 'Availability' }
  ])
  
  const contactLinks = ref([
    {
      name: 'Telegram',
      url: 'https://t.me/MEOW_MUR920',
      icon: 'telegram',
      iconType: 'fab',
      description: 'Quick messages and project discussions'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Morunka',
      icon: 'github',
      iconType: 'fab',
      description: 'Check out my latest projects and code'
    },
    {
      name: 'TenChat',
      url: 'https://tenchat.ru/Morunka',
      icon: 'comments',
      iconType: 'fas',
      description: 'Professional networking and discussions'
    },
    {
      name: 'hh.ru',
      url: 'https://novorossiysk.hh.ru/resume/fb573192ff0ee4b48e0039ed1f3734574e4a53',
      icon: 'file-alt',
      iconType: 'fas',
      description: 'Professional resume and experience'
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/MEOW_MUR920',
      icon: 'twitter',
      iconType: 'fab',
      description: 'Latest updates and tech insights'
    }
  ])
  
  const downloadPortfolio = () => {
    // Create a mock portfolio download
    const link = document.createElement('a')
    link.href = 'https://github.com/Morunka/Morunka.github.io/raw/refs/heads/main/Downloads/%D0%9C%D0%BE%D1%81%D1%82%D0%BE%D0%B2%D0%BE%D0%B9%D0%98%D0%A1.docx'
    link.download = 'Morunka-Portfolio.pdf'
    link.click()
    
  }
  
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  const openTelegram = () => {
    window.open('https://t.me/MEOW_MUR920', '_blank')
  }
  </script>
  
  <style scoped lang="scss">
  .contacts {
    position: relative;
    min-height: calc(100vh - 200px);
    overflow: hidden;
  }
  
  // Main Content
  .contacts-content {
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
  
  // Stack Section
  .stack-section {
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
  
  .stack-grid {
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
  
  .stack-category {
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
  
  .category-icon {
    font-size: 2.5rem;
    color: #646cff;
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  .category-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }
  
  .tech-item {
    background: rgba(100, 108, 255, 0.1);
    color: #646cff;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid rgba(100, 108, 255, 0.2);
    
    @media (prefers-color-scheme: light) {
      background: rgba(100, 108, 255, 0.1);
      color: #535bf2;
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
    max-width: 1000px;
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
  
  // Contact Section
  .contact-section {
    padding: 4rem 0;
    
    @media (max-width: 768px) {
      padding: 2rem 0;
    }
  }
  
  .contact-content {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;
  }
  
  .contact-description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.125rem;
    margin-bottom: 3rem;
    line-height: 1.6;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 3rem;
    
    @media (prefers-color-scheme: light) {
      color: rgba(0, 0, 0, 0.7);
    }
  }
  
  .contact-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }
  
  .contact-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(100, 108, 255, 0.2);
      border-color: rgba(100, 108, 255, 0.3);
    }
    
    @media (prefers-color-scheme: light) {
      background: rgba(255, 255, 255, 0.8);
      border-color: rgba(0, 0, 0, 0.1);
      
      &:hover {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        border-color: rgba(116, 123, 255, 0.3);
      }
    }
  }
  
  .link-icon {
    font-size: 1.5rem;
    color: #646cff;
    flex-shrink: 0;
  }
  
  .link-content {
    text-align: left;
    flex: 1;
  }
  
  .link-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
  }
  
  .link-description {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    line-height: 1.4;
    
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
    .contacts {
      min-height: calc(100vh - 150px);
    }
  }
  </style>