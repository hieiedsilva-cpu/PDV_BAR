// Serverless API handler for Vercel
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { parse } = require('url');

// Import backend code
const { app } = require('../backend/dist/server');

// Ensure app is properly imported
if (!app) {
  throw new Error('Failed to import Express app from backend');
}

// Create serverless handler
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Forward the request to the Express app
  return app.handle(req, res);
};