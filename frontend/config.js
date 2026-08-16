// Configuration for different environments
const config = {
    development: {
        API_URL: "http://localhost:5000/api"
    },
    production: {
        // Replace this with your actual deployed backend URL
        API_URL: "https://your-backend-url.herokuapp.com/api" 
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