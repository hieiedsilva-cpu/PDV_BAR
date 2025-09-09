// Serverless API handler for Vercel
const express = require('express');
const cors = require('cors');

// Import backend code
let app;
try {
  const backend = require('../backend/dist/server');
  app = backend.default || backend.app;
} catch (error) {
  console.error('Error importing backend app:', error);
  // Create a fallback app if import fails
  app = express();
  app.get('*', (req, res) => {
    res.status(500).json({ error: 'Backend server not available' });
  });
}

// Ensure app is properly imported
if (!app) {
  throw new Error('Failed to import Express app from backend');
}

// Create serverless handler
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Log request for debugging
  console.log(`Vercel serverless function received: ${req.method} ${req.url}`);

  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Forward the request to the Express app
  return app.handle(req, res);
};