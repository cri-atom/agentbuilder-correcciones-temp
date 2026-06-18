// This module loads all components from the bundle
// Each component is wrapped in an IIFE and exposes itself via window.*

// Import the raw component modules (they run their IIFEs immediately)
// We import them in the correct order to satisfy dependencies

// NOTE: These imports must be evaluated in browser context and React must be available globally
// The components will populate window.ComponentName when imported

import '../lib/bundle-loader';
