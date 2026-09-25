// Google Analytics 4 (GA4) Utility for VyLash
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-KNZ6KBCG48';

/**
 * Initialize Google Analytics 4
 */
export const initGA = () => {
    if (typeof window === 'undefined') return;
    
    // Check if GA is configured
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.info('ℹ️ Google Analytics Measurement ID is not configured yet. Set VITE_GA_MEASUREMENT_ID in .env');
        return;
    }

    // Check if script is already added
    if (document.getElementById('ga-gtag-script')) return;

    // Load gtag script
    const script = document.createElement('script');
    script.id = 'ga-gtag-script';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false // Managed manually for React HashRouter SPA
    });

    console.log('✅ Google Analytics 4 initialized (' + GA_MEASUREMENT_ID + ')');
};

/**
 * Track Page Views on SPA Route Changes
 */
export const trackPageView = (path, title) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'page_view', {
        page_path: path || window.location.hash || window.location.pathname,
        page_title: title || document.title,
        page_location: window.location.href
    });
};

/**
 * Track Custom Events
 */
export const trackEvent = (action, params = {}) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', action, params);
};

export default {
    initGA,
    trackPageView,
    trackEvent
};
