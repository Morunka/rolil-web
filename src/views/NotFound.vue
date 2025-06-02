<template>
    <div class="not-found">
      <div class="not-found-content">
        <div class="error-animation">
          <div class="error-number">404</div>
          <div class="floating-elements">
            <div class="floating-orb orb-1"></div>
            <div class="floating-orb orb-2"></div>
            <div class="floating-orb orb-3"></div>
          </div>
        </div>
        
        <div class="error-content">
          <h1 class="error-title">
            Oops, you found a 
            <span class="brand-gradient">secret!</span>
          </h1>
          <p class="error-description">
            It seems that this page does not exist yet or has never existed!
          </p>
          <div class="error-code">
            <span class="code-label">Error Code:</span>
            <span class="code-value">404 - Not Found</span>
          </div>
          
          <div class="error-actions">
            <button class="cta-button primary" @click="goHome">
              <font-awesome-icon :icon="['fas', 'home']" />
              Return to Home Page
            </button>
            <button class="cta-button secondary" @click="goBack">
              <font-awesome-icon :icon="['fas', 'arrow-left']" />
              Go Back
            </button>
          </div>
        </div>
        
        <div class="fun-facts">
          <h3 class="facts-title">Did you know?</h3>
          <p class="facts-text">
            The 404 error code was named after room 404 at CERN, where the original web servers were located!
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const goHome = () => {
    router.push('/')
  }
  
  const goBack = () => {
    router.go(-1)
  }
  </script>
  
  <style scoped lang="scss">
  .not-found {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }
  
  .not-found-content {
    max-width: 800px;
    text-align: center;
    animation: fadeInUp 0.8s ease-out;
    position: relative;
    z-index: 2;
  }
  
  // Error Animation Section
  .error-animation {
    position: relative;
    margin-bottom: 3rem;
    
    @media (max-width: 768px) {
      margin-bottom: 2rem;
    }
  }
  
  .error-number {
    font-size: clamp(4rem, 15vw, 8rem);
    font-weight: 900;
    background: linear-gradient(135deg, #646cff, #535bf2);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
    animation: pulse 2s ease-in-out infinite;
    text-shadow: 0 0 30px rgba(100, 108, 255, 0.5);
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  // Floating Elements
  .floating-elements {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
  
  .floating-orb {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(100, 108, 255, 0.3), rgba(135, 206, 235, 0.3));
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &.orb-1 {
      width: 60px;
      height: 60px;
      top: 20%;
      left: 10%;
      animation: float 3s ease-in-out infinite;
    }
    
    &.orb-2 {
      width: 40px;
      height: 40px;
      top: 60%;
      right: 15%;
      animation: float 4s ease-in-out infinite reverse;
    }
    
    &.orb-3 {
      width: 30px;
      height: 30px;
      bottom: 20%;
      left: 20%;
      animation: float 5s ease-in-out infinite;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }
  
  // Error Content
  .error-content {
    margin-bottom: 3rem;
    
    @media (max-width: 768px) {
      margin-bottom: 2rem;
    }
  }
  
  .error-title {
    font-size: clamp(1.75rem, 5vw, 3rem);
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    
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
  
  .error-description {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 2rem;
    line-height: 1.6;
    
    @media (prefers-color-scheme: light) {
      color: rgba(0, 0, 0, 0.7);
    }
  }
  
  .error-code {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
    display: inline-block;
    
    @media (prefers-color-scheme: light) {
      background: rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.1);
    }
  }
  
  .code-label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
    margin-right: 0.5rem;
    
    @media (prefers-color-scheme: light) {
      color: rgba(0, 0, 0, 0.6);
    }
  }
  
  .code-value {
    color: #646cff;
    font-weight: 600;
    font-size: 1rem;
  }
  
  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    
    @media (max-width: 480px) {
      flex-direction: column;
      align-items: center;
    }
  }
  
  // Buttons (matching home page style)
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
    
    &:active {
      transform: translateY(0);
    }
    
    @media (max-width: 480px) {
      width: 100%;
      max-width: 280px;
    }
  }
  
  // Fun Facts Section
  .fun-facts {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
    margin-top: 2rem;
    
    @media (prefers-color-scheme: light) {
      background: rgba(0, 0, 0, 0.03);
      border-color: rgba(0, 0, 0, 0.1);
    }
  }
  
  .facts-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #646cff;
  }
  
  .facts-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
    
    @media (prefers-color-scheme: light) {
      color: rgba(0, 0, 0, 0.6);
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
    .not-found {
      min-height: calc(100vh - 150px);
      padding: 1rem;
    }
    
    .floating-orb {
      &.orb-1 {
        width: 40px;
        height: 40px;
      }
      
      &.orb-2 {
        width: 30px;
        height: 30px;
      }
      
      &.orb-3 {
        width: 25px;
        height: 25px;
      }
    }
  }
  
  @media (max-width: 480px) {
    .error-code {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
    }
    
    .fun-facts {
      padding: 1rem;
    }
  }
  </style>