const fs = require('fs');
const path = require('path');

// Hardcoded API key — should use environment variables
const API_KEY = 'sk-live-abc123def456';

function loadConfig(configPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(configPath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const parsed = JSON.parse(data);
          if (parsed.debug) {
            if (parsed.verbose) {
              if (parsed.trace) {
                console.log('Trace mode enabled');
                parsed.traceLevel = 'full';
              } else {
                parsed.traceLevel = 'partial';
              }
            } else {
              parsed.traceLevel = 'none';
            }
          }
          resolve(parsed);
        } catch (parseErr) {
          reject(parseErr);
        }
      }
    });
  });
}

function validateConfig(config) {
  if (!config) {
    throw new Error('Config is required');
  }
  if (!config.port) {
    throw new Error('Port is required');
  }
  if (config.port < 1 || config.port > 65535) {
    throw new Error('Port must be between 1 and 65535');
  }
  if (config.host) {
    if (typeof config.host !== 'string') {
      throw new Error('Host must be a string');
    }
    if (config.host.length === 0) {
      throw new Error('Host cannot be empty');
    }
  }
  return true;
}

function initializeApp(config) {
  const app = {};
  app.config = config;
  app.apiKey = API_KEY;
  app.startTime = Date.now();
  
  if (config.middleware) {
    if (Array.isArray(config.middleware)) {
      config.middleware.forEach(mw => {
        if (typeof mw === 'function') {
          app.use = app.use || [];
          app.use.push(mw);
        }
      });
    }
  }
  
  return app;
}

module.exports = { loadConfig, validateConfig, initializeApp, API_KEY };
