/**
 * Performance utilities for monitoring and optimization
 */

// Resource hints for critical resources
export const preloadCriticalResources = () => {
  if (typeof document === 'undefined') return;
  
  // Preload critical fonts
  const fontPreloads = [
    { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' }
  ];
  
  fontPreloads.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Intersection Observer for lazy loading
export const createLazyObserver = (callback: IntersectionObserverCallback) => {
  if (typeof window === 'undefined') return null;
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });
};

// Image lazy loading utility
export const lazyLoadImages = () => {
  if (typeof window === 'undefined') return;
  
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = createLazyObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
        img.classList.remove('lazy');
        imageObserver?.unobserve(img);
      }
    });
  });
  
  if (imageObserver) {
    images.forEach(img => imageObserver.observe(img));
  }
};

// Performance mark utilities
export const performanceMark = (name: string) => {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
};

export const performanceMeasure = (name: string, startMark: string, endMark?: string) => {
  if (typeof performance !== 'undefined' && performance.measure) {
    performance.measure(name, startMark, endMark);
  }
};

// Critical CSS detection
export const extractCriticalCSS = () => {
  if (typeof document === 'undefined') return '';
  
  const criticalElements = document.querySelectorAll('header, nav, main > *:first-child, .hero, .above-fold');
  const criticalSelectors: string[] = [];
  
  criticalElements.forEach(el => {
    if (el.className) {
      el.className.split(' ').forEach(cls => {
        if (cls.trim()) criticalSelectors.push(`.${cls.trim()}`);
      });
    }
    if (el.id) {
      criticalSelectors.push(`#${el.id}`);
    }
  });
  
  return criticalSelectors.join(', ');
};

// Bundle size monitoring
export const monitorBundleSize = () => {
  if (typeof window === 'undefined') return;
  
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && !resource.name.includes('node_modules')
    );
    
    const cssResources = resources.filter(resource => 
      resource.name.includes('.css')
    );
    
    console.group('Bundle Size Analysis');
    console.log('JS Resources:', jsResources.map(r => ({ 
      name: r.name.split('/').pop(), 
      size: Math.round(r.transferSize || 0) 
    })));
    console.log('CSS Resources:', cssResources.map(r => ({ 
      name: r.name.split('/').pop(), 
      size: Math.round(r.transferSize || 0) 
    })));
    console.groupEnd();
  }
};