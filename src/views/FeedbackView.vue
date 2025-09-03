<template>
  <div class="feedback-page">
    <div class="page-header">
      <h1 class="page-title">
        Share your
        <span class="brand-gradient">Ideas</span>
      </h1>
      <p class="page-description">
        We are always listening! Your ideas help us improve our projects and our studio.
      </p>
    </div>

    <div class="feedback-content">
      <form @submit.prevent="submitFeedback" class="feedback-form">
        <div class="form-group">
          <label for="name">Your Name / Telegram Username (optional)</label>
          <input type="text" id="name" v-model="form.name" class="form-control" placeholder="John Doe">
        </div>
        <div class="form-group">
          <label for="idea">Your Idea</label>
          <textarea id="idea" v-model="form.idea" class="form-control" rows="8" placeholder="I have an idea for a new game..." required></textarea>
        </div>
        <button type="submit" class="cta-button primary submit-button">
          Send Your Idea
          <font-awesome-icon :icon="['fas', 'paper-plane']" />
        </button>
        <p v-if="successMessage" class="success-message" v-html="sanitizedSuccessMessage"></p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DOMPurify from 'dompurify'; // You will need to install this library

// State for the form
const form = ref({
  name: '',
  idea: '',
});

const successMessage = ref('');

// NEW: Sanitize the success message to prevent XSS attacks
const sanitizedSuccessMessage = computed(() => {
  return DOMPurify.sanitize(successMessage.value);
});

// Logic for handling form submission
const submitFeedback = () => {
  const subject = encodeURIComponent(`New Idea from the Website`);
  const body = encodeURIComponent(
    `Hello, I have an idea!\n\nName/Username: ${form.value.name}\n\nIdea:\n${form.value.idea}`
  );
  window.location.href = `mailto:ror.developer.02@gmail.com?subject=${subject}&body=${body}`;
  
  // Display success message after a brief delay
  setTimeout(() => {
    successMessage.value = 'Your message has been sent to our mail app! Thank you for your feedback.';
    form.value.name = '';
    form.value.idea = '';
  }, 500);
};

</script>

<style scoped lang="scss">
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

.feedback-page {
  animation: fadeInUp 0.8s ease-out;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
}

.page-header {
  max-width: 800px;
  margin-bottom: 2rem;
}

.page-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;

  .brand-gradient {
    background: linear-gradient(135deg, #646cff, #535bf2);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 2s ease-in-out infinite alternate;
  }
}

.page-description {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.6;

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.7);
  }
}

.feedback-content {
  width: 100%;
  max-width: 700px;
  padding: 0 1rem;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-align: left;

  @media (prefers-color-scheme: light) {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    @media (prefers-color-scheme: light) {
      color: rgba(0, 0, 0, 0.7);
    }
  }

  .form-control {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: #646cff;
      box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.2);
    }

    @media (prefers-color-scheme: light) {
      background: rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.1);
      color: black;
    }
  }
}

.submit-button {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  padding: 1rem 1.5rem;
}

.success-message {
  margin-top: 1rem;
  font-size: 1rem;
  color: #4CAF50;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  outline: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  &.primary {
    background: linear-gradient(135deg, #646cff, #535bf2);
    color: white;
    &:hover {
      background: linear-gradient(135deg, #535bf2, #4c4ff7);
    }
  }
}
</style>