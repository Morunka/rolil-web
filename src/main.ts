// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from '../router'

// 1. Import Font Awesome core and Vue component
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 2. Import specific icons you want to use from the solid style
// You only need to import the icons you'll actually use to keep your bundle size small.
import {
  faMessage,
  faNewspaper,
  faAddressCard,
  faCircleInfo,
  faDiagramProject,
  faHouse,
  faMagnifyingGlass,
  faHandHoldingDollar,
  faPlay,
  faEye,
  faGhost,
  faCar,
  faShieldAlt,
  faFileCode,
  faFolder,
  faCode,
  faGamepad,
  faTh,
  faExternalLinkAlt,
  faBolt,
  faArrowUpRightFromSquare,
  faPuzzlePiece,
  faCrosshairs,
  faKhanda,
  faRocket,
  faUser,
  faEnvelope,
  faPalette,
  faFolderOpen,
  faDownload,
  faPaperPlane,
  faCodeBranch,
  faBrain,
  faShieldVirus,
  faFileAudio,
  faStar,
  faBuilding,
  faCube,
  faHeart,
  faCrown,
  faFileAlt,
  faExclamationTriangle,
  faCat,
  faArrowRight,
  faDesktop,
  faGlobe,
  faTv,
  faMapMarker,
  faLanguage,
  faMobileAlt, // <-- Keep this, it's solid
  faCookieBite,
  faDatabase,
  faClock,
  faFingerprint,
  faMapMarkerAlt,
  faBell,
  faComments,
  faLightbulb,
  faServer,
  faTools,
  faCog,
} from '@fortawesome/free-solid-svg-icons'

// *** FIX START ***
// Import the 'telegram' icon from the brands style
import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
// *** FIX END ***

// 3. Add the imported icons to the Font Awesome library
library.add(
  faMessage,
  faNewspaper,
  faAddressCard,
  faCircleInfo,
  faDiagramProject,
  faHouse,
  faMagnifyingGlass,
  faHandHoldingDollar,
  faPlay,
  faEye,
  faGhost,
  faCar,
  faShieldAlt,
  faFileCode,
  faFolder,
  faCode,
  faGamepad,
  faTh,
  faExternalLinkAlt,
  faBolt,
  faArrowUpRightFromSquare,
  faPuzzlePiece,
  faCrosshairs,
  faKhanda,
  faRocket,
  faUser,
  faEnvelope,
  faPalette,
  faFolderOpen,
  faDownload,
  faPaperPlane,
  faCodeBranch,
  faBrain,
  faShieldVirus,
  faFileAudio,
  faStar,
  faBuilding,
  faCube,
  faHeart,
  faCrown,
  faFileAlt,
  faExclamationTriangle,
  faCat,
  faArrowRight,
  faDesktop,
  faGlobe,
  faTv,
  faMapMarker,
  faLanguage,
  faClock,
  faMobileAlt,
  faCookieBite,
  faDatabase,
  faFingerprint,
  faMapMarkerAlt,
  faBell,
  faTelegram,
  faComments,
  faLightbulb,
  faServer,
  faTools,
  faCog,
  faTwitter,
  faGithub
)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 4. Register the Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')