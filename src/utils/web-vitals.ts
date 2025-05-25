export const reportWebVitals = (metric: any) => {
  // Log to console for development
  console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating);
  
  // Send to analytics in production
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
};

export const initWebVitals = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
    
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);
  } catch (error) {
    console.error('Failed to load web-vitals:', error);
  }
};