const express = require('express');
const { loadConfig, validateConfig, initializeApp } = require('./config');
const os = require('os'); // unused import

const app = express();

function startServer() {
  const configPath = process.env.CONFIG_PATH || './config.json';
  
  // Mixed async: callback-style read in loadConfig, but we don't handle the promise
  const configPromise = loadConfig(configPath);
  
  // Missing error handling — if loadConfig rejects, this crashes
  configPromise.then(config => {
    validateConfig(config);
    const serverApp = initializeApp(config);
    
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.env || 'development'}`);
      
      if (config.debug) {
        console.log('Debug mode is ON');
        console.log('Config loaded:', JSON.stringify(config, null, 2));
      }
    });
  });
  
  // No catch() — unhandled rejection
}

function setupRoutes() {
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });
  
  app.get('/config', (req, res) => {
    // Returns config without sanitization — potential info leak
    res.json({ env: process.env.NODE_ENV });
  });
}

setupRoutes();
startServer();

module.exports = app;
