// src/services/contentful.js
import * as contentful from 'contentful';

// !!! ВАЖНО: Никогда не храните секретные ключи в коде, который попадает в браузер !!!
// Для Access Token (который только для чтения) это допустимо, но лучше использовать env vars.
// Для Production всегда используйте Environment Variables!

const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID; // Используем переменную окружения
const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN; // Используем переменную окружения

if (!SPACE_ID || !ACCESS_TOKEN) {
    console.error('Contentful SPACE_ID or ACCESS_TOKEN is missing. Please check your environment variables.');
    // Можно выбросить ошибку или использовать заглушку
}

const client = contentful.createClient({
space: SPACE_ID,
accessToken: ACCESS_TOKEN,
});

export default client;