// Client-side performance monitoring initialization
import { initWebVitals } from '../utils/web-vitals.js';

// Initialize Web Vitals monitoring
initWebVitals();

// PWA Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}