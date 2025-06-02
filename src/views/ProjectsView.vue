<template>
  <div class="projects">
    <div class="projects-content">
      <section class="projects-header">
        <div class="header-content">
          <h1 class="page-title">
            <span class="brand-gradient">Projects</span>
            Portfolio
          </h1>
          <p class="page-description">
            Explore our diverse collection of games, applications, and digital experiences.
          </p>
        </div>
      </section>

      <section class="category-navigation">
        <div class="nav-container">
          <div class="category-buttons">
            <button 
              v-for="category in categories" 
              :key="category.id"
              :class="['category-button', { 'active': activeCategory === category.id }]"
              @click="setActiveCategory(category.id)"
            >
              <font-awesome-icon :icon="['fas', category.icon]" />
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>
      </section>

      <div class="projects-sections">
        <section v-if="activeCategory === 'games' || activeCategory === 'all'" class="projects-section">
          <h2 class="section-title">Latest Projects</h2>
          <div class="projects-container" v-if="latestProjects.length > 0">
            <div class="projects-grid">
              <div 
                v-for="project in latestProjects" 
                :key="project.id"
                class="project-card"
                @click="openProject(project)"
              >
                <div class="project-image">
                  <img 
                    v-if="project.image && !imageLoadFailedState[project.id]" 
                    :src="project.image" 
                    :alt="project.title" 
                    class="project-actual-image" 
                    @error="() => setImageLoadFailed(project.id)"
                  >
                  <div 
                    v-else 
                    class="project-placeholder"
                  >
                    <font-awesome-icon :icon="['fas', project.icon || 'question-circle']" />
                  </div>
                  <div class="project-overlay">
                    <button class="action-button">
                      <font-awesome-icon :icon="['fas', project.projectType === 'game' ? 'play' : 'download']" />
                    </button>
                  </div>
                </div>
                <div class="project-info">
                  <h3 class="project-title">{{ project.title }}</h3>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-tags" v-if="project.tags && project.tags.some(tag => tag !== '')">
                    <span v-for="tag in project.tags.filter(tag => tag !== '')" :key="tag" class="project-tag">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-section">
            <font-awesome-icon :icon="['fas', 'clock']" />
            <h3>Coming Soon!</h3>
            <p>New game projects are currently in development.</p>
          </div>
        </section>

        <section v-if="activeCategory === 'games' || activeCategory === 'all'" class="projects-section">
          <h2 class="section-title">Horror Games</h2>
          <div class="projects-container" v-if="horrorGames.length > 0">
            <div class="projects-scroll">
               <div 
                v-for="project in horrorGames" 
                :key="project.id"
                class="project-card horizontal"
                @click="openProject(project)"
              >
                <div class="project-image">
                  <img 
                    v-if="project.image && !imageLoadFailedState[project.id]" 
                    :src="project.image" 
                    :alt="project.title" 
                    class="project-actual-image" 
                    @error="() => setImageLoadFailed(project.id)"
                  >
                  <div 
                    v-else 
                    class="project-placeholder"
                  >
                    <font-awesome-icon :icon="['fas', project.icon || 'ghost']" />
                  </div>
                  <div class="project-overlay">
                    <button class="action-button">
                      <font-awesome-icon :icon="['fas', project.projectType === 'game' ? 'play' : 'download']" />
                    </button>
                  </div>
                </div>
                <div class="project-info">
                  <h3 class="project-title">{{ project.title }}</h3>
                  <p class="project-description">{{ project.description }}</p>
                   <div class="project-tags" v-if="project.tags && project.tags.some(tag => tag !== '')">
                    <span v-for="tag in project.tags.filter(tag => tag !== '')" :key="tag" class="project-tag">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
           <div v-else class="empty-section">
            <font-awesome-icon :icon="['fas', 'ghost']" />
            <h3>No Horror Games Yet</h3>
            <p>Check back later for spooky adventures!</p>
          </div>
        </section>

        <section v-if="activeCategory === 'games' || activeCategory === 'all'" class="projects-section">
          <h2 class="section-title">Arcade Games</h2>
          <div class="projects-container" v-if="arcadeGames.length > 0">
            <div class="projects-scroll">
              <div 
                v-for="project in arcadeGames" 
                :key="project.id"
                class="project-card horizontal"
                @click="openProject(project)"
              >
                <div class="project-image">
                  <img 
                    v-if="project.image && !imageLoadFailedState[project.id]" 
                    :src="project.image" 
                    :alt="project.title" 
                    class="project-actual-image" 
                    @error="() => setImageLoadFailed(project.id)"
                  >
                  <div 
                    v-else 
                    class="project-placeholder"
                  >
                    <font-awesome-icon :icon="['fas', project.icon || 'gamepad']" />
                  </div>
                  <div class="project-overlay">
                    <button class="action-button">
                      <font-awesome-icon :icon="['fas', project.projectType === 'game' ? 'play' : 'download']" />
                    </button>
                  </div>
                </div>
                <div class="project-info">
                  <h3 class="project-title">{{ project.title }}</h3>
                  <p class="project-description">{{ project.description }}</p>
                   <div class="project-tags" v-if="project.tags && project.tags.some(tag => tag !== '')">
                    <span v-for="tag in project.tags.filter(tag => tag !== '')" :key="tag" class="project-tag">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-section">
            <font-awesome-icon :icon="['fas', 'gamepad']" />
            <h3>No Arcade Games Yet</h3>
            <p>Classic fun coming soon!</p>
          </div>
        </section>

        <section v-if="activeCategory === 'web' || activeCategory === 'all'" class="projects-section">
          <h2 class="section-title">Web Applications</h2>
          <div class="projects-container" v-if="webApps.length > 0">
            <div class="projects-scroll">
              <div 
                v-for="project in webApps" 
                :key="project.id"
                class="project-card horizontal"
                @click="openProject(project)"
              >
                <div class="project-image">
                  <img 
                    v-if="project.image && !imageLoadFailedState[project.id]" 
                    :src="project.image" 
                    :alt="project.title" 
                    class="project-actual-image" 
                    @error="() => setImageLoadFailed(project.id)"
                  >
                  <div 
                    v-else 
                    class="project-placeholder"
                  >
                    <font-awesome-icon :icon="['fas', project.icon || 'code']" />
                  </div>
                  <div class="project-overlay">
                    <button class="action-button">
                      <font-awesome-icon :icon="['fas', project.projectType === 'game'||'app' ? 'play' : 'download']" />
                    </button>
                  </div>
                </div>
                <div class="project-info">
                  <h3 class="project-title">{{ project.title }}</h3>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-tags" v-if="project.tags && project.tags.some(tag => tag !== '')">
                    <span v-for="tag in project.tags.filter(tag => tag !== '')" :key="tag" class="project-tag">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-section">
            <font-awesome-icon :icon="['fas', 'code']" />
            <h3>Web Applications Under Development</h3>
            <p>New web tools and apps are on their way.</p>
          </div>
        </section>

        <section v-if="activeCategory === 'extensions' || activeCategory === 'all'" class="projects-section">
          <h2 class="section-title">Extensions</h2>
           <div class="projects-container" v-if="extensions.length > 0">
            <div class="projects-scroll">
              <div 
                v-for="project in extensions" 
                :key="project.id"
                class="project-card horizontal"
                @click="openProject(project)"
              >
                <div class="project-image">
                  <img 
                    v-if="project.image && !imageLoadFailedState[project.id]" 
                    :src="project.image" 
                    :alt="project.title" 
                    class="project-actual-image" 
                    @error="() => setImageLoadFailed(project.id)"
                  >
                  <div 
                    v-else 
                    class="project-placeholder"
                  >
                    <font-awesome-icon :icon="['fas', project.icon || 'puzzle-piece']" />
                  </div>
                  <div class="project-overlay">
                    <button class="action-button">
                      <font-awesome-icon :icon="['fas', project.projectType === 'game' ? 'play' : 'download']" />
                    </button>
                  </div>
                </div>
                <div class="project-info">
                  <h3 class="project-title">{{ project.title }}</h3>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-tags" v-if="project.tags && project.tags.some(tag => tag !== '')">
                    <span v-for="tag in project.tags.filter(tag => tag !== '')" :key="tag" class="project-tag">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-section">
            <font-awesome-icon :icon="['fas', 'puzzle-piece']" /> 
            <h3>Extensions Under Development</h3>
            <p>Browser and app extensions are being crafted.</p>
          </div>
        </section>

        <section v-if="activeCategory === 'other' || activeCategory === 'all'" class="projects-section">
          <h2 class="section-title">Other Projects</h2>
          <div class="projects-container" v-if="otherProjects.length > 0">
            <div class="projects-scroll">
              <div 
                v-for="project in otherProjects" 
                :key="project.id"
                class="project-card horizontal"
                @click="openProject(project)"
              >
                <div class="project-image">
                  <img 
                    v-if="project.image && !imageLoadFailedState[project.id]" 
                    :src="project.image" 
                    :alt="project.title" 
                    class="project-actual-image" 
                    @error="() => setImageLoadFailed(project.id)"
                  >
                  <div 
                    v-else 
                    class="project-placeholder"
                  >
                    <font-awesome-icon :icon="['fas', project.icon || 'folder-open']" />
                  </div>
                  <div class="project-overlay">
                    <button class="action-button">
                      <font-awesome-icon :icon="['fas', project.projectType === 'game' ? 'play' : 'download']" />
                    </button>
                  </div>
                </div>
                <div class="project-info">
                  <h3 class="project-title">{{ project.title }}</h3>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-tags" v-if="project.tags && project.tags.some(tag => tag !== '')">
                    <span v-for="tag in project.tags.filter(tag => tag !== '')" :key="tag" class="project-tag">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-section">
            <font-awesome-icon :icon="['fas', 'folder-open']" />
            <h3>More Projects Coming Soon</h3>
            <p>Additional miscellaneous projects will be added here.</p>
          </div>
        </section>
      </div>

      <section class="projects-footer">
        <div class="footer-content">
          <p class="footer-text">
            Looking for Kogama games? 
            <a href="https://www.kogama.com/profile/667438867/games/" class="footer-link" target="_blank" rel="noopener noreferrer">
              <font-awesome-icon :icon="['fas', 'external-link-alt']" />
              Check here
            </a>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
// Ensure FontAwesomeIcon is globally registered or imported in your main.ts/main.js
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { fas } from '@fortawesome/free-solid-svg-icons'
// import { library } from '@fortawesome/fontawesome-svg-core'
// library.add(fas) // If importing icons directly


type ProjectType = 'game' | 'app' | 'extension' | 'other';

interface Project {
  id: number
  title: string
  description: string
  icon: string 
  tags: string[]
  category: 'horror' | 'arcade' | 'web' | 'extensions' | 'other' 
  projectType: ProjectType 
  image?: string 
  url?: string
}

interface Category {
  id: string
  name: string
  icon: string
}

const activeCategory = ref('all')

const categories: Category[] = [
  { id: 'all', name: 'All', icon: 'th' },
  { id: 'games', name: 'Games', icon: 'gamepad' }, 
  { id: 'web', name: 'Web Apps', icon: 'code' },
  { id: 'extensions', name: 'Extensions', icon: 'puzzle-piece' }, 
  { id: 'other', name: 'Other', icon: 'folder-open' } 
]

// Corrected project data, especially tags
const projects = ref<Project[]>([
  // Horror Games
  {
    id: 1,
    title: 'Five Nights at Stickmans 2',
    description: 'The thrilling sequel to the popular horror game series.',
    icon: 'ghost',
    tags: ['Horror', 'Indie', 'Survival'],
    image: 'https://m.gjcdn.net/game-thumbnail/500/927351-9wkyvrkh-v4.webp',
    category: 'horror',
    projectType: 'game',
    url: 'https://gamejolt.com/games/FNAS2-BYROLILCO-FXCHKENTERTAIMENT/927351'
  },
  {
    id: 2,
    title: 'Five Nights at Stickmans',
    description: 'Original horror game that started the series.',
    icon: 'eye',
    tags: ['Horror', 'Indie', 'Survival'],
    image: 'https://m.gjcdn.net/game-thumbnail/500/927326-nqq7xnxe-v4.webp',
    category: 'horror',
    projectType: 'game',
    url: 'https://gamejolt.com/games/FNAS/927326'
  },
  {
    id: 3,
    title: 'Protect Pikacky',
    description: 'Defend your character in this intense horror experience.',
    icon: 'shield-alt', 
    tags: ['Survival', 'Defense', 'Indie'],
    image: 'https://i.ibb.co/N22vRPYC/Protect-Pikacky.png',
    category: 'horror',
    projectType: 'game',
    url: 'https://scratch.mit.edu/projects/919319419/'
  },
  {
    id: 4,
    title: 'Flash',
    description: 'Quick-paced horror game with jump scares.',
    icon: 'bolt',
    tags: ['Horror', 'Fast-paced', 'Thriller'],
    image: 'https://i.ibb.co/RGhdB00s/Flash.jpg', 
    category: 'horror',
    projectType: 'game',
    url: 'https://scratch.mit.edu/projects/946644846/'
  },
  // Arcade Games
  {
    id: 5,
    title: 'Racing Cars Adventures',
    description: 'High-speed racing with adventure elements, boss battles and puzzles.',
    icon: 'car',
    tags: ['Puzzle', 'Adventure', 'Arcade'], 
    image: 'https://i.ibb.co/Z6RsQhsV/The-Race-RU.png', 
    category: 'arcade',
    projectType: 'game',
    url: 'https://by-rolil-studio.itch.io/racing-cars-adventures'
  },
  // Web Applications
  {
    id: 6,
    title: 'ToDo task list «Focus»',
    description: 'Manage and save your ToDo tasks.',
    icon: 'list-check', 
    tags: ['Utility', 'Productivity', 'Web'], // Corrected tags
    image: 'https://i.ibb.co/TxC2CtGd/preview.png',
    category: 'web',
    projectType: 'app',
    url: 'https://morunka.github.io/todo-focus' // Placeholder URL, likely needs update
  },
  // Extensions
  {
    id: 7,
    title: 'Telegram API Pack Edition',
    description: 'Connect your PenguinMod project to Telegram.',
    icon: 'paper-plane', 
    tags: ['PenguinMod', 'API', 'Telegram'], // Corrected tags
    image: '', 
    category: 'extensions',
    projectType: 'extension',
    url: 'https://github.com/Morunka/penguinmod-turbowarp-extensions/tree/main/turbowarp-penguinmod-telegram-pack'
  },
  {
    id: 8,
    title: 'Scratch API',
    description: 'Use Scratch API in PenguinMod.',
    icon: 'code-branch', 
    tags: ['PenguinMod', 'API', 'Scratch'], // Corrected tags
    image: '',
    category: 'extensions',
    projectType: 'extension',
    url: 'https://github.com/Morunka/penguinmod-turbowarp-extensions/blob/main/Scratch-API-PM.js' 
  },
  {
    id: 9,
    title: 'Gemini API', 
    description: 'Use Gemini powerful AI in PenguinMod.',
    icon: 'brain', 
    tags: ['PenguinMod', 'API', 'AI', 'Gemini'], // Corrected tags
    image: '',
    category: 'extensions',
    projectType: 'extension',
    url: 'https://github.com/Morunka/penguinmod-turbowarp-extensions/blob/main/GeMini-API-PM.js' 
  },
  // Other
  {
    id: 10,
    title: 'Improve Script (.js)',
    description: 'Improve script for packaging your PenguinMod projects.',
    icon: 'file-code', 
    tags: ['Script', 'PenguinMod', 'Tool'],
    image: '',
    category: 'other',
    projectType: 'other',
    url: 'https://github.com/Morunka/penguinmod-turbowarp-extensions/blob/main/codes/improve-script.js'
  },
  {
    id: 11,
    title: 'UNMiner tool (.sb3)', 
    description: 'Disable miners for your Windows OS.',
    icon: 'shield-virus',
    tags: ['Security', 'Tool', 'Windows'],
    image: '', 
    category: 'other',
    projectType: 'other', 
    url: 'https://github.com/Morunka/Morunka.github.io/raw/refs/heads/main/Downloads/UNMinerTool.sb3' 
  },
  {
    id: 12,
    title: 'TS3 Music Downloader (.py)', 
    description: 'Download all music from The Sims 3.',
    icon: 'file-audio',
    tags: ['Python', 'Tool', 'Music', 'Sims 3'],
    image: '', 
    category: 'other',
    projectType: 'other', 
    url: 'https://github.com/Morunka/Morunka.github.io/blob/main/Downloads/TS3-Music-Downloader.py' 
  }
])

const imageLoadFailedState = reactive<Record<number, boolean>>({});

projects.value.forEach(project => {
  imageLoadFailedState[project.id] = false;
});

const setImageLoadFailed = (projectId: number) => {
  imageLoadFailedState[projectId] = true;
};

const latestProjects = computed(() => {
  return projects.value
      .filter(p => p.projectType === 'game')
      .sort((a, b) => b.id - a.id) 
      .slice(0, 3);
});

const horrorGames = computed(() => {
  return projects.value.filter(p => p.category === 'horror' && p.projectType === 'game');
})

const arcadeGames = computed(() => {
  return projects.value.filter(p => p.category === 'arcade' && p.projectType === 'game');
})

const webApps = computed(() => {
  return projects.value.filter(p => p.category === 'web');
})

const extensions = computed(() => {
  return projects.value.filter(p => p.category === 'extensions');
})

const otherProjects = computed(() => {
  return projects.value.filter(p => p.category === 'other');
})

const setActiveCategory = (categoryId: string) => {
  activeCategory.value = categoryId
}

const openProject = (project: Project) => {
  if (project.url) {
    if (project.url.startsWith('../')) {
      window.open(project.url, '_blank', 'noopener noreferrer');
    } else {
      window.open(project.url, '_blank', 'noopener noreferrer');
    }
  } else {
    alert(`Project ${project.title} URL is not configured.`);
  }
}
</script>

<style scoped lang="scss">
.project-actual-image {
  position: absolute; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; 
  z-index: 1; 
}

.project-placeholder {
  position: relative; 
  z-index: 1; 
  display: flex; // Added to center icon
  align-items: center; // Added to center icon
  justify-content: center; // Added to center icon
  width: 100%; // Ensure it takes full space for centering
  height: 100%; // Ensure it takes full space for centering
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease; // Transition only opacity for smoother hover
  z-index: 2;
}

.action-button {
  background: linear-gradient(135deg, #646cff, #535bf2);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  color: white;
  font-size: 1.5rem; 
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease; // Separate transitions
  touch-action: manipulation; 
  display: flex; 
  align-items: center; 
  justify-content: center; 

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  @media (max-width: 320px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  @media (hover: hover) {
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(100, 108, 255, 0.6);
    }
  }

  @media (hover: none) {
    &:active {
      transform: scale(0.9);
      box-shadow: 0 2px 8px rgba(100, 108, 255, 0.4);
    }
  }
}

.projects {
  position: relative;
  min-height: calc(100vh - 200px); 
  overflow-x: hidden; 
  overflow-y: auto; 

  @media (max-width: 768px) {
    min-height: calc(100vh - 120px);
  }

  @media (max-width: 480px) {
    min-height: calc(100vh - 100px);
  }
}

.projects-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
}

.projects-header {
  padding: 3rem 0;
  text-align: center;

  @media (max-width: 1024px) {
    padding: 2.5rem 0;
  }

  @media (max-width: 768px) {
    padding: 2rem 0;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 0;
  }

  @media (max-width: 320px) {
    padding: 1rem 0;
  }
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 480px) {
    padding: 0 0.75rem;
  }

  @media (max-width: 320px) {
    padding: 0 0.5rem;
  }
}

.page-title {
  font-size: clamp(1.75rem, 8vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.1;
  word-break: break-word; 
  hyphens: auto; 

  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
    line-height: 1.2;
  }

  @media (max-width: 320px) {
    margin-bottom: 0.5rem;
    font-size: clamp(1.5rem, 10vw, 2.5rem);
  }

  .brand-gradient {
    background: linear-gradient(135deg, #646cff, #535bf2);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 2s ease-in-out infinite alternate;

    @supports not (-webkit-background-clip: text) {
      color: #646cff;
    }
  }
}

.page-description {
  font-size: clamp(0.875rem, 3vw, 1.125rem);
  color: rgba(255, 255, 255, 0.8); 
  line-height: 1.6;
  margin: 0;
  max-width: 600px; 
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 480px) {
    line-height: 1.5;
    text-align: left; 
  }

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7); 
  }
}

.category-navigation {
  padding: 2rem 0;
  background: rgba(255, 255, 255, 0.03); 
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }

  @media (max-width: 480px) {
    padding: 1rem 0;
  }

  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }
}

.nav-container {
  max-width: 1200px; 
  margin: 0 auto;
  padding: 0 1rem; 

  @media (max-width: 480px) {
    padding: 0 0.75rem;
  }

  @media (max-width: 320px) {
    padding: 0 0.5rem;
  }
}

.category-buttons {
  display: flex;
  gap: 1rem; 
  justify-content: center; 
  flex-wrap: wrap; 

  @media (max-width: 768px) {
    gap: 0.75rem;
    justify-content: flex-start; 
    overflow-x: auto; 
    flex-wrap: nowrap; 
    padding-bottom: 0.5rem; 
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch; 
    touch-action: pan-x; 

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(100, 108, 255, 0.6);
      border-radius: 2px;
    }
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
}

.category-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px; 
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  white-space: nowrap; 
  min-width: fit-content; 
  font-size: 0.875rem;

  @media (max-width: 768px) {
    flex-shrink: 0; 
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 8px;
    gap: 0.375rem;
  }

  @media (max-width: 320px) {
    padding: 0.375rem 0.625rem;
  }

  @media (hover: hover) {
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px); 
    }
  }

  @media (hover: none) {
    &:active {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(100, 108, 255, 0.3);
      transform: scale(0.95); 
    }
  }

  &.active {
    background: linear-gradient(135deg, #646cff, #535bf2); 
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 15px rgba(100, 108, 255, 0.4); 

    @media (max-width: 480px) {
      box-shadow: 0 2px 8px rgba(100, 108, 255, 0.3);
    }
  }

  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.8); 
    border-color: rgba(0, 0, 0, 0.1);
    color: #213547; 

    @media (hover: hover) {
      &:hover {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(116, 123, 255, 0.3);
      }
    }
     &.active {
      background: linear-gradient(135deg, #535bf2, #646cff);
      color: white;
     }
  }

  svg {
    @media (max-width: 480px) {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 320px) {
      width: 14px;
      height: 14px;
    }
  }

  span {
    @media (max-width: 480px) { 
      display: none; 
    }
  }
}

.projects-sections {
  padding: 2rem 0; 

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }

  @media (max-width: 480px) {
    padding: 1rem 0;
  }
}

.projects-section {
  margin-bottom: 4rem; 

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 2.5rem;
  }

  &:last-child {
    margin-bottom: 2rem; 

    @media (max-width: 768px) {
      margin-bottom: 1.5rem;
    }

    @media (max-width: 480px) {
      margin-bottom: 1rem;
    }
  }
}

.section-title {
  text-align: center;
  font-size: clamp(1.25rem, 5vw, 2rem); 
  margin-bottom: 2rem; 
  font-weight: 600;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
    text-align: left; 
    padding-left: 1rem; 
  }
}

// Ensure the parent container doesn't interfere
.projects-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem; 
  overflow: visible; // Changed from hidden to visible

  @media (max-width: 480px) {
    padding: 0 0.75rem;
  }

  @media (max-width: 320px) {
    padding: 0 0.5rem;
  }
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
  gap: 2rem; 

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 640px) { 
    grid-template-columns: 1fr; 
    gap: 1.25rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
}

// Fix for projects-scroll container
.projects-scroll {
  display: flex; 
  gap: 1.5rem; 
  overflow-x: auto; 
  overflow-y: hidden;
  padding-bottom: 1.5rem; // Increased to accommodate scrollbar
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; 
  scroll-snap-type: x mandatory; 
  touch-action: pan-x; 
  
  // Ensure scrollbar is always visible
  scrollbar-width: auto; // Firefox - use auto instead of thin
  scrollbar-color: rgba(100, 108, 255, 0.8) rgba(255, 255, 255, 0.2);

  margin-left: -1rem; 
  margin-right: -1rem; 
  padding-left: 1rem; 
  padding-right: 1rem;

  @media (max-width: 768px) {
    gap: 1rem;
    padding-bottom: 1.25rem;
    margin-left: -0.75rem; 
    margin-right: -0.75rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
    padding-bottom: 1rem;
    margin-left: -0.5rem; 
    margin-right: -0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  // Force scrollbar to always show
  &::-webkit-scrollbar {
    height: 12px; // Increased size for better visibility
    -webkit-appearance: none;

    @media (max-width: 480px) {
      height: 10px;
    }
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05);

    @media (max-width: 480px) {
      border-radius: 5px;
    }

    @media (prefers-color-scheme: light) {
      background: rgba(0, 0, 0, 0.1);
      border-color: rgba(0, 0, 0, 0.05);
    }
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, rgba(100, 108, 255, 0.8), rgba(83, 91, 242, 0.8));
    border-radius: 6px;
    border: 1px solid rgba(100, 108, 255, 0.3);
    min-width: 30px;

    @media (max-width: 480px) {
      border-radius: 5px;
      min-width: 25px;
    }

    &:hover {
      background: linear-gradient(90deg, rgba(100, 108, 255, 1), rgba(83, 91, 242, 1));
      border-color: rgba(100, 108, 255, 0.5);
    }

    &:active {
      background: linear-gradient(90deg, rgba(83, 91, 242, 1), rgba(100, 108, 255, 1));
    }
  }
}

.project-card {
  background: rgba(255, 255, 255, 0.05); 
  backdrop-filter: blur(10px); 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  border-radius: 16px; 
  overflow: hidden; 
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  scroll-snap-align: start; 

  @media (max-width: 480px) {
    border-radius: 12px;
    backdrop-filter: blur(8px);
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-5px); 
      box-shadow: 0 10px 30px rgba(100, 108, 255, 0.2); 
      border-color: rgba(100, 108, 255, 0.3); 

      .project-overlay {
        opacity: 1; 
      }
    }
  }

  @media (hover: none) { 
    &:active {
      transform: scale(0.98); 
      box-shadow: 0 5px 15px rgba(100, 108, 255, 0.15);

      .project-overlay {
        opacity: 1; 
      }
    }
  }

  &.horizontal {
    flex-shrink: 0; 
    min-width: 280px; 
    width: 280px; 

    @media (max-width: 480px) {
      min-width: 260px;
      width: 260px; 
    }

    @media (max-width: 320px) {
      min-width: 240px;
      width: 240px; 
    }
  }

  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.8); 
    border-color: rgba(0, 0, 0, 0.1);

    @media (hover: hover) {
      &:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border-color: rgba(116, 123, 255, 0.3);
      }
    }

    @media (hover: none) {
      &:active {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      }
    }
  }
}

.project-image {
  position: relative; 
  height: 200px; 
  background: linear-gradient(135deg, rgba(100, 108, 255, 0.05), rgba(83, 91, 242, 0.05)); // Softer placeholder bg
  display: flex; 
  align-items: center; 
  justify-content: center; 

  @media (max-width: 768px) {
    height: 160px;
  }

  @media (max-width: 480px) {
    height: 140px;
  }

  @media (max-width: 320px) {
    height: 120px;
  }
}

.project-placeholder {
  font-size: 3rem; 
  color: rgba(100, 108, 255, 0.5); // Slightly softer placeholder icon

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }

  @media (max-width: 320px) {
    font-size: 1.75rem;
  }
}

.project-info {
  padding: 1.5rem; 

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }

  @media (max-width: 320px) {
    padding: 0.75rem;
  }
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white; 
  line-height: 1.3;
  word-break: break-word;
  hyphens: auto;
  // Truncate title if too long
  display: -webkit-box;
  line-clamp: 2; // Show max 2 lines
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(1.25rem * 1.3 * 2); // Reserve space for 2 lines

  @media (max-width: 480px) {
    font-size: 1.125rem;
    margin-bottom: 0.375rem;
    min-height: calc(1.125rem * 1.3 * 2);
  }

  @media (max-width: 320px) {
    font-size: 1rem;
     min-height: calc(1rem * 1.3 * 2);
  }

  @media (prefers-color-scheme: light) {
    color: #213547; 
  }
}

.project-description {
  color: rgba(255, 255, 255, 0.7); // Softer description text
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem; 
  word-break: break-word;
  hyphens: auto;
  display: -webkit-box;
  line-clamp: 3; 
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(0.875rem * 1.5 * 3); // Reserve space for 3 lines to prevent layout shifts

  @media (max-width: 480px) {
    font-size: 0.8125rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
    -webkit-line-clamp: 2; // Adjust for smaller cards
    min-height: calc(0.8125rem * 1.4 * 2);
  }

  @media (max-width: 320px) {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
    min-height: calc(0.75rem * 1.4 * 2);
  }

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.65); 
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap; 
  gap: 0.5rem; 
  min-height: 24px; // Consistent height if tags are present or not
  margin-top: auto; // Push tags to the bottom if info area has extra space

  @media (max-width: 480px) {
    gap: 0.375rem;
  }

  @media (max-width: 320px) {
    gap: 0.25rem;
  }
}

.project-tag {
  background: rgba(100, 108, 255, 0.2); 
  color: rgba(100, 108, 255, 1); 
  padding: 0.25rem 0.5rem; 
  border-radius: 6px; 
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap; 

  @media (max-width: 480px) {
    padding: 0.1875rem 0.375rem;
    font-size: 0.6875rem;
    border-radius: 4px;
  }

  @media (max-width: 320px) {
    padding: 0.125rem 0.25rem;
    font-size: 0.625rem;
  }
}

.empty-section {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.6); 

  @media (max-width: 768px) {
    padding: 2.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 0.75rem;
  }

  svg { 
    font-size: 3rem;
    margin-bottom: 1rem;
    color: rgba(100, 108, 255, 0.4); 

    @media (max-width: 480px) {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }

    @media (max-width: 320px) {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
  }

  h3 { 
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.8);

    @media (max-width: 480px) {
      font-size: 1.125rem;
      margin-bottom: 0.375rem;
    }

    @media (max-width: 320px) {
      font-size: 1rem;
    }
  }

  p { 
    font-size: 0.875rem;
    margin: 0;

    @media (max-width: 480px) {
      font-size: 0.8125rem;
    }

    @media (max-width: 320px) {
      font-size: 0.75rem;
    }
  }

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);

    h3 {
      color: rgba(0, 0, 0, 0.8);
    }
    svg {
      color: rgba(100,108,255,0.3);
    }
  }
}

.projects-footer {
  text-align: center;
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1); 

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }

  @media (max-width: 480px) {
    padding: 1rem 0;
  }

  @media (prefers-color-scheme: light) {
    border-color: rgba(0, 0, 0, 0.1);
  }
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 480px) {
    padding: 0 0.75rem;
  }

  @media (max-width: 320px) {
    padding: 0 0.5rem;
  }
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 0.875rem;

  @media (max-width: 480px) {
    font-size: 0.8125rem;
    text-align: left;
  }

  @media (max-width: 320px) {
    font-size: 0.75rem;
  }

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.footer-link {
  color: #646cff; 
  text-decoration: none;
  font-weight: 500;
  display: inline-flex; 
  align-items: center;
  gap: 0.25rem; 
  margin-left: 0.5rem;
  transition: color 0.3s ease, text-decoration 0.3s ease;
  touch-action: manipulation; 

  @media (max-width: 480px) {
    margin-left: 0.375rem;
    gap: 0.1875rem;
  }

  @media (hover: hover) {
    &:hover {
      color: #535bf2; 
      text-decoration: underline;
    }
  }

  @media (hover: none) {
    &:active {
      color: #535bf2;
      transform: scale(0.95);
    }
  }
}

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

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { // Apply to all elements and pseudo-elements
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media (prefers-contrast: high) {
  .project-card, .category-button {
    border: 2px solid currentColor; 
  }

  .project-tag {
    border: 1px solid currentColor;
  }
  .brand-gradient { // Ensure gradient text is visible in high contrast
      -webkit-text-fill-color: currentColor;
      background: none;
      color: currentColor; // Fallback to a solid color
  }
}

.category-button:focus-visible,
.project-card:focus-visible,
.action-button:focus-visible, 
.footer-link:focus-visible {
  outline: 2px solid #8c9eff; // Lighter outline for dark bg
  outline-offset: 2px;
   @media (prefers-color-scheme: light) {
      outline-color: #535bf2; // Darker outline for light bg
   }
}

@media (max-width: 768px) {
  .category-button,
  .action-button, 
  .footer-link {
    min-height: 44px; 
    min-width: 44px;  
  }
}

.projects {
    overflow-y: hidden !important;
  }
</style>
