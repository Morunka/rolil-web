<template>
  <div class="team-view">
    <div class="team-content">
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Our 
            <span class="brand-gradient">Team</span>
          </h1>
          <p class="hero-description">
            <a class="rainbow-shimmer">Meet people</a> who are turning ideas into reality and <a class="rainbow-shimmer">join them</a> if you want.
          </p>
        </div>
      </section>

      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">
            The only <a class="rainbow-shimmer">impossible journey</a> is the <a class="rainbow-shimmer">one you never begin.</a>
          </p>
        </div>
      </section>

      <section class="features-section">
        <h2 class="section-title">Our Members</h2>
        <div class="features-grid-wrapper">
          <div class="features-grid">
            <div v-for="member in team" :key="member.id" class="feature-card member-card-custom">
              <div class="feature-image-container">
                <img :src="member.photo" :alt="member.name" class="feature-image" />
              </div>
              <h3 class="feature-title">{{ member.name }}</h3>
              <p class="member-role">{{ member.mainRole }}</p>
              <p v-if="member.otherRoles && member.otherRoles.length" class="member-other-roles">
                <span v-for="role in member.otherRoles" :key="role">{{ role }}</span>
              </p>
              <div class="portfolio-links" v-if="member.portfolio.length">
                <a v-for="link in member.portfolio" :key="link.name" :href="link.url" target="_blank" class="portfolio-link rainbow-shimmer">
                  {{ link.name }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">
            We are always looking for new talents to help us create <a class="rainbow-shimmer">the best projects.</a>
          </p>
        </div>
      </section>

      <section class="features-section" id="join-form">
        <h2 class="section-title">Join Our Team</h2>
        <div class="join-form-container">
          <form @submit.prevent="submitForm" class="join-form">
            <div class="form-group">
              <label for="fullName" class="form-label">First and Last Name / Nickname</label>
              <input type="text" id="fullName" v-model="formData.fullName" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" v-model="formData.email" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="reason" class="form-label">Why do you want to join?</label>
              <textarea id="reason" v-model="formData.reason" class="form-input" required></textarea>
            </div>
            <div class="form-group">
              <label for="desiredRole" class="form-label optional">Desired Role (Optional)</label>
              <input type="text" id="desiredRole" v-model="formData.desiredRole" class="form-input">
            </div>
            <div class="form-group">
              <label for="phone" class="form-label optional">Phone Number (Optional)</label>
              <input type="tel" id="phone" v-model="formData.phone" class="form-input">
            </div>
            <div class="form-group">
              <label for="otherContacts" class="form-label optional">Additional Contacts (e.g., Telegram, social media links)</label>
              <input type="text" id="otherContacts" v-model="formData.otherContacts" class="form-input">
            </div>
            <div class="form-group">
              <label for="portfolioUrl" class="form-label optional">Portfolio Link (if any)</label>
              <input type="url" id="portfolioUrl" v-model="formData.portfolioUrl" class="form-input">
            </div>
            <div class="form-group">
              <label for="portfolioFile" class="form-label optional">Portfolio File (if any)</label>
              <input type="file" id="portfolioFile" @change="handleFileUpload" class="form-input">
            </div>
            <div class="hero-actions">
              <button type="submit" class="cta-button primary">
                <font-awesome-icon :icon="['fas', 'paper-plane']" />
                Send Application
              </button>
            </div>
            <p class="security-text">
              Form is protected from hacking, don't even try ;)
            </p>
          </form>
        </div>
      </section>

      <section class="stats-section">
        <div class="stats-grid">
          <p class="hero-description center">
            Our team will review your application and <a class="rainbow-shimmer">contact you as soon as possible.</a>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const getImageUrl = (name: string) => {
  return new URL(`../assets/members/${name}.jpg`, import.meta.url).href;
};

const team = ref([
  {
    id: 1,
    name: "Morunka",
    mainRole: "Founder (Owner)",
    otherRoles: ["game-developer", "program-developer", "web-developer"],
    photo: getImageUrl("morunka"),
    portfolio: [
      { name: "Portfolio", url: "https://morunka.github.io/morunka-portfolio.html" },
      { name: "GitHub", url: "https://github.com/Morunka" }
    ]
  },
  {
    id: 2,
    name: "Asteron",
    mainRole: "Co-owner",
    otherRoles: ["PR", "project-ideas"],
    photo: getImageUrl("asteron"),
    portfolio: [
      { name: "Telegram", url: "https://t.me/EX7R4R0N" }
    ]
  }
]);

const formData = ref({
  fullName: '',
  email: '',
  reason: '',
  desiredRole: '',
  phone: '',
  otherContacts: '',
  portfolioUrl: '',
  portfolioFile: null as File | null
});

// Функция для защиты от XSS (преобразование опасных символов)
const escapeHtml = (unsafe: string) => {
  if (!unsafe) return '';
  const replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return unsafe.replace(/[&<>"']/g, match => replacements[match as keyof typeof replacements]);
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    formData.value.portfolioFile = target.files[0];
  }
};

const submitForm = () => {
  // Перед отправкой очистим и "экранируем" все строковые данные
  const payload = {
    fullName: escapeHtml(formData.value.fullName),
    email: escapeHtml(formData.value.email),
    reason: escapeHtml(formData.value.reason),
    desiredRole: escapeHtml(formData.value.desiredRole),
    phone: escapeHtml(formData.value.phone),
    otherContacts: escapeHtml(formData.value.otherContacts),
    portfolioUrl: escapeHtml(formData.value.portfolioUrl),
    portfolioFile: formData.value.portfolioFile // Файлы не экранируем
  };
  
  // Здесь ты добавишь логику для отправки данных на сервер
  // Например:
  // fetch('https://your-api-endpoint.com/submit', {
  //   method: 'POST',
  //   body: JSON.stringify(payload),
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // });
};
</script>

<style scoped lang="scss">
.team-view {
  position: relative;
  min-height: calc(100vh - 200px);
  overflow: hidden;
}

.team-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out; /* Возвращение анимации */
}

.hero-section {
  padding: 8rem 0;
  text-align: center;
  @media (max-width: 768px) {
    padding: 6rem 0;
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
    animation: shimmer 2s ease-in-out infinite alternate; /* Возвращение анимации */
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
  &.center {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }
}

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

// Контейнер для прокрутки по X
.features-grid-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
  padding: 0 1rem;
}

.features-grid-wrapper::-webkit-scrollbar {
  height: 8px;
}

.features-grid-wrapper::-webkit-scrollbar-thumb {
  background-color: #646cff;
  border-radius: 4px;
}

.features-grid {
  display: flex;
  gap: 2rem;
  padding: 0 1rem;
  min-width: fit-content;
}

// Карточка члена команды
.member-card-custom {
  flex-shrink: 0;
  width: 280px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  &:hover {
    // box-shadow: 0 10px 30px rgba(100, 108, 255, 0.2);
    border-color: rgba(100, 108, 255, 0.3);
  }
  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.1);
    &:hover {
      // box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      border-color: rgba(116, 123, 255, 0.3);
    }
  }
  .feature-image-container {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin: 0 auto 1rem auto;
    overflow: hidden;
    border: 3px solid #646cff;
    transition: transform 0.3s ease; // Убрал box-shadow
  }
}

// Убрал box-shadow
.member-card-custom:hover .feature-image-container {
  transform: scale(1.05);
}

.feature-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.member-role {
  font-weight: bold;
  color: #646cff;
  margin-bottom: 0.5rem;
}

.member-other-roles {
  font-size: 0.9rem;
  color: #aaa;
  span {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 2px 8px;
    margin: 0 4px;
  }
}

.portfolio-links {
  margin-top: 1rem;
}

.portfolio-link {
  text-decoration: none;
  font-weight: bold;
  margin: 0 0.5rem;
  transition: color 0.3s ease;
}

.quote-section {
  padding: 3rem 0;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.6);
  }
}

.quote-text {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.quote-author {
  font-size: 1rem;
  font-weight: bold;
}

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
  grid-template-columns: 1fr;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

// Форма
.join-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.1);
  }
}

.join-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  &.optional {
    color: rgba(255, 255, 255, 0.6);
  }
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
    &.optional {
      color: rgba(0, 0, 0, 0.5);
    }
  }
}

.form-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: white;
  transition: border-color 0.3s, box-shadow 0.3s;
  &:focus {
    outline: none;
    border-color: #646cff;
    box-shadow: 0 0 0 2px #646cff;
  }
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.2);
    color: black;
    &::placeholder {
      color: rgba(0, 0, 0, 0.4);
    }
  }
}

textarea.form-input {
  resize: vertical;
  min-height: 120px;
}

// Анимации
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

@keyframes rainbow-shimmer {
  to {
    background-position: 200% center;
  }
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
}

.security-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  margin-top: 1rem;
  font-size: 0.9rem;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.5);
  }
}

.small-quote {
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  margin-top: 1.5rem;
  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.5);
  }
}
</style>