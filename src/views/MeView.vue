<template>
  <div class="me">
    <div class="me-content">
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Information About
            <span class="brand-gradient">Your Device</span>
          </h1>
          <p class="hero-description">
            Below is some information about you:
          </p>
        </div>
      </section>

      <section class="info-section">
        <div class="info-grid">
          <div class="info-card" v-for="(info, index) in systemInfo" :key="info.label" 
               :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="info-icon">
              <font-awesome-icon :icon="['fas', info.icon]" />
            </div>
            <div class="info-content">
              <h3 class="info-label">{{ info.label }}</h3>
              <div class="info-value">
                <span v-if="info.key !== 'ip'" :id="info.id">{{ info.value }}</span>

                <div v-else class="ip-section">
                  <span v-if="showIP && ipLoaded" :id="info.id">{{ info.value }}</span>
                  <span v-else-if="!showIP && !ipLoaded && !ipFetching" class="default">Hidden</span>
                  <span v-else-if="ipFetching" class="status-text loading">Loading</span>
                  <span v-else-if="!showIP && ipLoaded" class="default">Hidden</span> <button @click="toggleIP" class="toggle-button">
                    {{ showIP ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="privacy-section">
        <div class="privacy-content">
          <div class="privacy-card">
            <div class="privacy-icon">
              <font-awesome-icon :icon="['fas', 'shield-alt']" />
            </div>
            <h3 class="privacy-title">Privacy</h3>
            <p class="privacy-description">
              <strong>Attention:</strong> We <strong>DO NOT save</strong> any of the information above on our servers
              (currently, we don't have our own servers at all) or files, nor do we use or transfer it to anyone!
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface SystemInfoItem {
  label: string
  key: string
  value: string | null // Value can be null initially for IP
  icon: string
  id: string
}

const showIP = ref(false)
const ipLoaded = ref(false) // True if IP has been successfully fetched at least once
const ipFetching = ref(false) // True if IP is currently being fetched

const systemInfo = ref<SystemInfoItem[]>([
  {
    label: 'Operating System',
    key: 'os',
    value: '',
    icon: 'desktop',
    id: 'os-info'
  },
  {
    label: 'Browser',
    key: 'browser',
    value: '',
    icon: 'globe',
    id: 'browser-info'
  },
  {
    label: 'Screen Resolution',
    key: 'screen',
    value: '',
    icon: 'tv',
    id: 'screen-size'
  },
  {
    label: 'Your IP',
    key: 'ip',
    value: null, // Start as null, will be 'Hidden' by default in UI
    icon: 'map-marker-alt',
    id: 'ip-address'
  },
  {
    label: 'Browser Language',
    key: 'language',
    value: '',
    icon: 'language',
    id: 'browser-lang'
  },
  {
    label: 'Timezone',
    key: 'timezone',
    value: '',
    icon: 'clock',
    id: 'time-zone'
  },
  {
    label: 'Device Type',
    key: 'device',
    value: '',
    icon: 'mobile-alt',
    id: 'device-type'
  },
  {
    label: 'Color Scheme',
    key: 'colorScheme',
    value: '',
    icon: 'palette',
    id: 'color-scheme'
  },
  {
    label: 'JavaScript',
    key: 'javascript',
    value: '',
    icon: 'code',
    id: 'js-info'
  },
  {
    label: 'Cookies',
    key: 'cookies',
    value: '',
    icon: 'cookie-bite',
    id: 'cookies-info'
  },
  {
    label: 'LocalStorage',
    key: 'localStorage',
    value: '',
    icon: 'database',
    id: 'localstorage-info'
  },
  {
    label: 'User Agent',
    key: 'userAgent',
    value: '',
    icon: 'fingerprint',
    id: 'user-agent'
  }
])

const getSystemInfo = () => {
  const userAgent = navigator.userAgent
  
  let os = "Unknown"
  if (userAgent.includes("Windows")) os = "Windows"
  else if (userAgent.includes("Mac") && !userAgent.includes("iPhone") && !userAgent.includes("iPad")) os = "macOS"
  else if (userAgent.includes("Linux") && !userAgent.includes("Android")) os = "Linux"
  else if (userAgent.includes("Android")) os = "Android"
  else if (userAgent.includes("iPhone")) os = "iOS (iPhone)"
  else if (userAgent.includes("iPad")) os = "iOS (iPad)"
  updateInfo('os', os)

  let browser = "Unknown"
  if (userAgent.includes("Chrome") && !userAgent.includes("Edge") && !userAgent.includes("OPR")) {
    browser = "Chrome"
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox"
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari"
  } else if (userAgent.includes("Edge")) {
    browser = "Edge"
  } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
    browser = "Opera"
  }
  updateInfo('browser', browser)

  const width = window.screen.width
  const height = window.screen.height
  const screenRes = `${width} x ${height}`
  updateInfo('screen', screenRes)

  const language = navigator.language || 'Unknown'
  updateInfo('language', language)

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'
  updateInfo('timezone', timezone)

  let deviceType = "Desktop"
  if (userAgent.includes("Mobile") || 
      /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    deviceType = "Mobile"
  } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    deviceType = "Tablet"
  }
  updateInfo('device', deviceType)

  const colorScheme = getColorSchemePreference()
  updateInfo('colorScheme', colorScheme)

  updateInfo('javascript', 'Enabled')

  const cookiesEnabled = navigator.cookieEnabled ? 'Enabled' : 'Disabled'
  updateInfo('cookies', cookiesEnabled)

  const localStorageSupported = typeof localStorage !== "undefined" ? 'Supported' : 'Not Supported'
  updateInfo('localStorage', localStorageSupported)

  updateInfo('userAgent', userAgent)
}

const getColorSchemePreference = (): string => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'Dark Mode Preferred'
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'Light Mode Preferred'
  } else {
    return 'No Preference Set'
  }
}

const updateInfo = (key: string, value: string | null) => {
  const item = systemInfo.value.find(info => info.key === key)
  if (item) {
    item.value = value
  }
}

const toggleIP = async () => {
  // If we are currently showing IP, then hide it
  if (showIP.value) {
    showIP.value = false;
  } 
  // If we are currently hiding IP
  else {
    // If IP hasn't been loaded yet AND we are not currently fetching
    if (!ipLoaded.value && !ipFetching.value) {
      ipFetching.value = true; // Indicate loading has started
      try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        updateInfo('ip', data.ip)
        ipLoaded.value = true // Mark as loaded
      } catch (error) {
        updateInfo('ip', 'Failed to load IP')
        ipLoaded.value = true // Still mark as loaded to prevent re-fetching on subsequent clicks
        console.error('Error fetching IP:', error);
      } finally {
        ipFetching.value = false; // Loading finished
      }
    }
    showIP.value = true; // Show the IP (or loading text if still fetching)
  }
}

onMounted(() => {
  getSystemInfo()
  
  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)')
    
    const updateColorScheme = () => {
      const colorScheme = getColorSchemePreference()
      updateInfo('colorScheme', colorScheme)
    }
    
    darkModeQuery.addEventListener('change', updateColorScheme)
    lightModeQuery.addEventListener('change', updateColorScheme)
  }
})
</script>

<style scoped lang="scss">
/* Existing styles (no changes needed for layout, only for the new status classes) */

.me {
  position: relative;
  min-height: calc(100vh - 200px);
  overflow: hidden;
}

.me-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
}

.hero-section {
  padding: 4rem 0 2rem;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 2rem 0 1rem;
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

.info-section {
  padding: 2rem 0 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem 0 2rem;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
  animation: slideInUp 0.6s ease-out both;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(100, 108, 255, 0.15);
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
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
}

.info-icon {
  font-size: 1.5rem;
  color: #646cff;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-label {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.8);
  }
}

.info-value {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  word-break: break-all;
  
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.ip-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* NEW/MODIFIED STYLES FOR IP STATUS */
.status-text {
  // Base style for all status texts
  color: rgba(255, 255, 255, 0.6); // Default lighter color
  
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.5);
  }

  &.default {
    font-style: normal; // Ensure non-italic for 'Hidden'
    font-weight: normal; // Ensure normal weight
  }

  &.loading {
    font-style: italic; // Italic for 'Loading'
  }
}

.toggle-button {
  background: linear-gradient(135deg, #646cff, #535bf2);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #535bf2, #4c4ff7);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(100, 108, 255, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.privacy-section {
  padding: 2rem 0 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem 0 2rem;
  }
}

.privacy-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.privacy-card {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  animation: slideInUp 1.2s ease-out;
  
  @media (prefers-color-scheme: light) {
    background: rgba(255, 193, 7, 0.1);
    border-color: rgba(255, 193, 7, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.privacy-icon {
  font-size: 2rem;
  color: #ffd700;
  margin-bottom: 1rem;
}

.privacy-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffd700;
}

.privacy-description {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
  
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.8);
  }
}

.privacy-link {
  color: #646cff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  
  &:hover {
    color: #535bf2;
    text-decoration: underline;
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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .me {
    min-height: calc(100vh - 150px);
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>