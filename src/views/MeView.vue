<template>
  <div class="me">
    <div class="me-content">
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">About<span class="brand-gradient"> You</span></h1>
          <p class="hero-description">This page was created so that <a class="rainbow-shimmer">you could simply find out the characteristics</a> of your device, browser and IP <a class="rainbow-shimmer">without going to different sites.</a></p>
        </div>
      </section>

      <section class="privacy-section" v-if="showPrivacyBanner">
        <button @click="closePrivacyBanner" class="privacy-close-button" aria-label="Close Privacy Banner">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
        <div class="privacy-content">
          <div class="privacy-card">
            <div class="privacy-icon">
              <font-awesome-icon :icon="['fas', 'shield-alt']" />
            </div>
            <h3 class="privacy-title">Privacy</h3>
            <p class="privacy-description">
              <strong>Attention:</strong> We <strong>DO NOT save</strong> any of the information below on our servers
              (currently, we don't have our own servers at all) or files, nor do we use or transfer it to anyone!
            </p>
          </div>
        </div>
      </section>

      <section class="info-section">
        <div class="info-grid">
          <div class="info-card" v-for="(info, index) in systemInfo" :key="info.label"
            :data-aos="info.animation || 'fade-up'" :data-aos-delay="info.delay || 0">
            <div class="info-icon">
              <font-awesome-icon :icon="['fas', info.icon]" />
            </div>
            <div class="info-content">
              <div class="info-label">{{ info.label }}</div>
              <div v-if="info.key === 'browser'" class="info-value">
                <div class="main-browser-value">{{ info.value }}</div>
                <ul class="browser-details-list">
                  <li>Version: {{ browserVersion }}</li>
                  <li>Engine: {{ browserEngine }}</li>
                  <li>Image Support: {{ imageFormatSupport }}</li>
                  <li>WebGL Status: {{ webglStatus }}</li>
                </ul>
              </div>
              <div v-else-if="info.key === 'ip'" class="ip-section">
                <span v-if="showIP && ipFetching" class="status-text loading">Loading...</span>
                <span v-else-if="showIP && info.value" class="status-text">{{ info.value }}</span>
                <span v-else-if="!showIP && ipLoaded && info.value" class="status-text default">Hidden</span>
                <span v-else-if="!showIP && !ipLoaded" class="status-text default">Hidden</span>
                <button @click="toggleIP" class="toggle-button">{{ showIP ? 'Hide' : 'Show' }}</button>
              </div>
              <div v-else class="info-value">{{ info.value }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">
            Your browser helps you see the world, but with an IP address, <a class="rainbow-shimmer">we can see your digital location</a> in the world. Find out where your connection is <a class="rainbow-shimmer">approximately originating from.</a>
          </p>
        </div>
      </section>

      <section class="map-section" v-if="ipLoaded && showIP">
        <h2 class="section-title">Your Approximate Location</h2>
        <div class="map-container">
          <div id="leaflet-map" style="height: 400px; width: 100%;"></div>
        </div>
        <div class="map-info">
          <div class="info-card">
            <div class="info-icon"><font-awesome-icon :icon="['fas', 'city']" /></div>
            <div class="info-content">
              <div class="info-label">City</div>
              <div class="info-value">{{ ipLocation.city }}</div>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon"><font-awesome-icon :icon="['fas', 'flag']" /></div>
            <div class="info-content">
              <div class="info-label">Country</div>
              <div class="info-value">{{ ipLocation.country_name }}</div>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon"><font-awesome-icon :icon="['fas', 'network-wired']" /></div>
            <div class="info-content">
              <div class="info-label">ISP</div>
              <div class="info-value">{{ ipLocation.org }}</div>
            </div>
          </div>
        </div>
      </section>

      <section>
          <div class="chart-container">
            <canvas ref="activityChartRef" id="activityChart" width="400" height="200"></canvas>
          </div>
      </section>
      
      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">
            These are just some of the details available to your browser. We hope this information helps you feel more <a class="rainbow-shimmer">in control and aware of your digital footprint.</a>
          </p>
        </div>
      </section>

      <section class="total-time-section">
        <h2 class="section-title">Your Total Time on Site</h2>
        <div class="total-time-card info-card">
          <div class="info-icon"><font-awesome-icon :icon="['fas', 'history']" /></div>
          <div class="info-content">
            <div class="info-label">Total Time</div>
            <div class="info-value">{{ totalTimeOnSite }}</div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Register the plugin with Chart.js
Chart.register(ChartDataLabels);

// --- Reactive refs for new features ---
const browserVersion = ref('Unknown');
const browserEngine = ref('Unknown');
const imageFormatSupport = ref('Checking...');
const webglStatus = ref('Checking...');
const ipLocation = ref({
  city: 'Unknown',
  country_name: 'Unknown',
  org: 'Unknown',
  latitude: 0,
  longitude: 0,
});
const totalTimeOnSite = ref('0s');
let mapInstance: L.Map | null = null;

// --- Reactive refs for time display ---
const currentTime = ref<string>('--:--');
const currentDate = ref<string>('---');

// --- Chart Ref and Initialization ---
const activityChartRef = ref<HTMLCanvasElement | null>(null);
let myChartInstance: Chart | null = null;

// --- Helper Function to Format Duration ---
const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

const initializeChart = () => {
  if (activityChartRef.value) {
    const ctx = activityChartRef.value.getContext('2d');
    if (ctx) {
      if (myChartInstance) {
        myChartInstance.destroy();
      }

      // Retrieve and process activity data from local storage
      let activityData: { date: string; durationMs: number }[] = [];
      try {
        const data = localStorage.getItem('activityData');
        activityData = data ? JSON.parse(data) : [];
        activityData = activityData.map(entry => ({
          ...entry,
          durationMs: Number(entry.durationMs) ?? 0
        }));
      } catch (e) {
        console.error("Failed to parse activity data from localStorage:", e);
        activityData = [];
      }

      // Keep only the last 7 entries (most recent week)
      if (activityData.length > 7) {
        activityData = activityData.slice(-7);
        // Update localStorage with the trimmed data
        try {
          localStorage.setItem('activityData', JSON.stringify(activityData));
        } catch (e) {
          console.error("Failed to update activity data in localStorage:", e);
        }
      }

      // Prepare chart data
      const labels = activityData.map((entry) => entry.date);
      // Data for Y-axis (in hours) - used for scaling the bar height
      const hoursData = activityData.map((entry) => {
        const hours = entry.durationMs / (1000 * 60 * 60);
        return parseFloat(hours.toFixed(2));
      });
      // Original durationMs data - used for formatting labels on the bars
      const durationMsData = activityData.map((entry) => entry.durationMs);

      const datasets = [{
        label: 'Hours Active',
        data: hoursData, // Y-axis values are hours
        // Pass the original durationMs for formatting
        durationMs: durationMsData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }];

      myChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets,
        },
        plugins: [ChartDataLabels], // Register the plugin for this chart instance
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Week Activity',
            },
            // Configuration for the datalabels plugin
            datalabels: {
              // Display the formatted duration on each bar
              formatter: (value, context) => {
                // Get the durationMs for this specific bar
                const dataset = context.dataset as any; // Cast to any to access custom property
                const durationMs = dataset.durationMs[context.dataIndex];
                // Use the helper function to format it
                return formatDuration(durationMs);
              },
              color: 'white', // Text color
              font: {
                weight: 'bold',
                size: 12
              },
              anchor: 'end', // Anchor point of the label
              align: 'top', // Alignment relative to the anchor point
              offset: -5, // Offset from the anchor point
              // Ensure labels are drawn on top
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Hours',
              },
              min: 0,
              max: 24,
              beginAtZero: true,
              ticks: {
                stepSize: 2
              }
            },
          },
          animation: {
            duration: 500
          }
        },
      });
      console.log("Chart initialized successfully with detailed time data.");
    } else {
      console.error("Could not get 2D context from canvas element.");
    }
  } else {
    console.warn("Canvas element reference is null. Chart initialization skipped.");
  }
};

const calculateTotalTime = () => {
  try {
    const data = localStorage.getItem('activityData');
    if (data) {
      const activityData = JSON.parse(data);
      const totalMs = activityData.reduce((sum: number, entry: any) => sum + (Number(entry.durationMs) || 0), 0);
      totalTimeOnSite.value = formatDuration(totalMs);
    }
  } catch (e) {
    console.error("Failed to calculate total time from localStorage:", e);
  }
};

const updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}`;

  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDate.value = now.toLocaleDateString('en-US', options);
};

// --- Existing System Info Logic Interfaces/Refs/Functions ---
interface SystemInfoItem {
  label: string
  key: string
  value: string | null
  icon: string
  id: string
  animation?: string
  delay?: number
}

const showIP = ref(false)
const ipLoaded = ref(false)
const ipFetching = ref(false)
const showPrivacyBanner = ref(true)
const systemInfo = ref<SystemInfoItem[]>([
  { label: 'Operating System', key: 'os', value: '', icon: 'desktop', id: 'os-info', animation: 'fade-up', delay: 100 },
  { label: 'Browser', key: 'browser', value: '', icon: 'globe', id: 'browser-info', animation: 'fade-up', delay: 150 },
  { label: 'Screen Resolution', key: 'screen', value: '', icon: 'tv', id: 'screen-size', animation: 'fade-up', delay: 200 },
  { label: 'Your IP', key: 'ip', value: null, icon: 'map-marker-alt', id: 'ip-address', animation: 'fade-up', delay: 250 },
  { label: 'Browser Language', key: 'language', value: '', icon: 'language', id: 'browser-lang', animation: 'fade-up', delay: 300 },
  { label: 'Timezone', key: 'timezone', value: '', icon: 'clock', id: 'time-zone', animation: 'fade-up', delay: 350 },
  { label: 'Device Type', key: 'device', value: '', icon: 'mobile-alt', id: 'device-type', animation: 'fade-up', delay: 400 },
  { label: 'Color Scheme', key: 'colorScheme', value: '', icon: 'palette', id: 'color-scheme', animation: 'fade-up', delay: 450 },
  { label: 'JavaScript', key: 'javascript', value: '', icon: 'code', id: 'js-info', animation: 'fade-up', delay: 500 },
  { label: 'Cookies', key: 'cookies', value: '', icon: 'cookie-bite', id: 'cookies-info', animation: 'fade-up', delay: 550 },
  { label: 'LocalStorage', key: 'localStorage', value: '', icon: 'database', id: 'localstorage-info', animation: 'fade-up', delay: 600 },
  { label: 'User Agent', key: 'userAgent', value: '', icon: 'fingerprint', id: 'user-agent', animation: 'fade-up', delay: 650 }
])

const MAX_IP_RETRIES = 20;
const IP_RETRY_DELAY = 2000;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  if (userAgent.includes("Mobile") || /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
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

// NEW: Function to get detailed browser info
const getDetailedBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  const versionMatch = userAgent.match(/(?:Chrome|Firefox|Safari|Opera|Edge)\/(\d+(\.\d+)?)/);
  if (versionMatch && versionMatch[1]) {
    browserVersion.value = versionMatch[1];
  } else {
    browserVersion.value = 'Unknown';
  }

  const engineMatch = userAgent.match(/(?:Gecko|AppleWebKit|Trident)/);
  if (engineMatch) {
    browserEngine.value = engineMatch[0];
  } else {
    browserEngine.value = 'Unknown';
  }

  const canvas = document.createElement('canvas');
  const supportsWebP = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  const supportsAvif = canvas.toDataURL('image/avif').startsWith('data:image/avif');
  
  const formats = [];
  if (supportsWebP) formats.push('WebP');
  if (supportsAvif) formats.push('AVIF');
  
  if (formats.length > 0) {
    imageFormatSupport.value = formats.join(', ');
  } else {
    imageFormatSupport.value = 'None Found';
  }

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  webglStatus.value = gl ? 'Supported' : 'Not Supported';
};

// NEW: Functions for the Leaflet Map
const initMap = () => {
  if (mapInstance) {
    mapInstance.remove();
  }
  mapInstance = L.map('leaflet-map').setView([ipLocation.value.latitude, ipLocation.value.longitude], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapInstance);
  
  L.marker([ipLocation.value.latitude, ipLocation.value.longitude]).addTo(mapInstance)
    .bindPopup(`<b>Your approximate location</b><br>IP: ${systemInfo.value.find(i => i.key === 'ip')?.value}`).openPopup();
};

const getIPLocationInfo = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    ipLocation.value = data;
    await nextTick();
    if (showIP.value) {
      initMap();
    }
  } catch (error) {
    console.error('Failed to fetch IP location data:', error);
  }
};

const toggleIP = async () => {
    if (showIP.value) {
    showIP.value = false;
    return;
  }
  
  if (!ipLoaded.value && !ipFetching.value) {
    ipFetching.value = true;
    let attempts = 0;
    let success = false;
    
    while (attempts < MAX_IP_RETRIES && !success) {
      attempts++;
      try {
        console.log(`Attempting to fetch IP (Attempt ${attempts}/${MAX_IP_RETRIES})...`);
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        updateInfo('ip', data.ip);
        ipLoaded.value = true;
        success = true;
        console.log("IP successfully fetched:", data.ip);
      } catch (error) {
        console.error(`Error fetching IP (Attempt ${attempts}):`, error);
        if (attempts < MAX_IP_RETRIES) {
          console.log(`Retrying in ${IP_RETRY_DELAY / 1000} seconds...`);
          await delay(IP_RETRY_DELAY);
        }
      }
    }
    
    if (!success) {
        console.warn(`Failed to load IP after ${MAX_IP_RETRIES} attempts.`);
        updateInfo('ip', 'Failed to load IP');
    }
    ipFetching.value = false;
  }
  showIP.value = true;
  await nextTick();
  if (mapInstance) {
    mapInstance.invalidateSize();
  } else {
    getIPLocationInfo();
  }
};

const resetPrivacyBanner = () => {
    showPrivacyBanner.value = true;
  try {
    localStorage.removeItem('hidePrivacyBanner');
  } catch (e) {
    console.warn('Could not remove privacy banner preference from localStorage:', e);
  }
};

const closePrivacyBanner = () => {
    showPrivacyBanner.value = false
  try {
    localStorage.setItem('hidePrivacyBanner', 'true')
  } catch (e) {
    console.warn('Could not save privacy banner preference to localStorage:', e)
  }
}

// --- Consolidated onMounted Hook ---
onMounted(async () => {
  // --- Privacy Banner Logic ---
  try {
    const hideBanner = localStorage.getItem('hidePrivacyBanner');
    if (hideBanner === 'true') {
      showPrivacyBanner.value = false;
    }
  } catch (e) {
    console.warn('Could not read privacy banner preference from localStorage:', e);
  }
  (window as any).resetPrivacyBanner = resetPrivacyBanner;

  // --- System Info Logic ---
  getSystemInfo();
  getDetailedBrowserInfo();
  getIPLocationInfo();
  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');
    const updateColorScheme = () => {
      const colorScheme = getColorSchemePreference();
      updateInfo('colorScheme', colorScheme);
    };
    darkModeQuery.addEventListener('change', updateColorScheme);
    lightModeQuery.addEventListener('change', updateColorScheme);
  }

  updateTime();
  const timeInterval = setInterval(updateTime, 60 * 1000);

  // --- Chart Initialization Logic ---
  await nextTick();
  console.log("DOM updated, canvas ref:", activityChartRef.value);
  initializeChart();
  
  // --- Calculate total time on mount ---
  calculateTotalTime();
});
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

.hero-description {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.section-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 600;
  text-align: center;
  margin: 2rem 0;
  color: #646cff;

  @media (prefers-color-scheme: light) {
    color: #535bf2;
  }
}

// System Info Section
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
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);
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

.main-browser-value {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: white;

  @media (prefers-color-scheme: light) {
    color: black;
  }
}

.browser-details-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.5);
  }

  li {
    margin-bottom: 0.25rem;
  }
}

.ip-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.status-text {
  color: rgba(255, 255, 255, 0.6);

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.5);
  }

  &.default {
    font-style: normal;
    font-weight: normal;
  }

  &.loading {
    font-style: italic;
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
  flex-shrink: 0;

  &:hover {
    background: linear-gradient(135deg, #535bf2, #4c4ff7);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(100, 108, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

// Privacy Section (Updated)
.privacy-section {
  padding: 2rem 0 4rem;
  background: rgba(255, 215, 0, 0.1);
  border-top: 1px solid rgba(255, 215, 0, 0.3);
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  position: relative;
  animation: slideInUp 1.2s ease-out;

  @media (prefers-color-scheme: light) {
    background: rgba(255, 193, 7, 0.1);
    border-color: rgba(255, 193, 7, 0.3);
  }

  @media (max-width: 768px) {
    padding: 1rem 0 2rem;
  }
}

.privacy-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
}

.privacy-card {
  background: transparent;
  border: none;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;

  @media (prefers-color-scheme: light) {
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

.privacy-close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.25rem;
  transition: all 0.2s ease;
  z-index: 2;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
    &:hover {
      color: black;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}

.chart-container {
  width: 100%;
  height: 400px;
  margin: 2rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

.browser-info-section, .map-section, .total-time-section {
  padding: 2rem 0;
  @media (max-width: 768px) {
    padding: 1rem 0;
  }
}

.map-container {
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
}

#leaflet-map {
  width: 100%;
  height: 400px;
}

.map-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;
}

.total-time-section {
  padding: 2rem 0 4rem;
  text-align: center;
}

.total-time-card {
  max-width: 400px;
  margin: 0 auto;
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

// Responsive adjustments
@media (max-width: 768px) {
  .me {
    min-height: calc(100vh - 150px);
  }

  .hero-title {
    font-size: clamp(1.75rem, 6vw, 2.5rem);
  }

  .hero-description {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  }

  .info-card {
    padding: 1rem;
  }

  .info-icon {
    font-size: 1.25rem;
  }

  .info-label {
    font-size: 0.9rem;
  }

  .info-value {
    font-size: 1rem;
  }
}

</style>