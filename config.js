// Configuration for different environments
const config = {
    development: {
        API_URL: "http://localhost:5000/api"
    },
    production: {
        // GitHub Pages deployment - use your deployed backend URL
        // For demo purposes, this shows the UI but API calls will fail without backend
        // Replace with your actual deployed backend URL when available
        API_URL: "https://tonogram-backend.herokuapp.com/api" 
    }
};

// Determine current environment
const hostname = window.location.hostname;
const environment = (hostname === 'localhost' || hostname === '127.0.0.1') 
    ? 'development' 
    : 'production';

// Export configuration
window.API_CONFIG = config[environment];

// Log current configuration for debugging
console.log('Tonogram Configuration:', {
    environment,
    hostname,
    API_URL: window.API_CONFIG.API_URL
});

// Show warning for GitHub Pages deployment without backend
if (environment === 'production' && hostname.includes('github.io')) {
    console.warn('⚠️ GitHub Pages Deployment: This is a frontend-only deployment.');
    console.warn('⚠️ API calls will fail without a deployed backend.');
    console.warn('⚠️ For full functionality, deploy the backend and update API_URL in config.js');
    
    // Add demo mode flag
    window.DEMO_MODE = true;
    console.log('🎨 Demo mode enabled - UI available for showcase');
} else {
    window.DEMO_MODE = false;
}