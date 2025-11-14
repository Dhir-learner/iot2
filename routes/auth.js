const express = require('express');
const router = express.Router();

// Simple authentication endpoint for device registration
router.post('/register', (req, res) => {
  const { deviceId, deviceType, location } = req.body;
  
  if (!deviceId) {
    return res.status(400).json({
      success: false,
      error: 'Device ID is required'
    });
  }

  // In a real application, you would save this to a database
  const deviceInfo = {
    deviceId,
    deviceType: deviceType || 'ESP32',
    location: location || 'Main Door',
    registeredAt: new Date().toISOString(),
    status: 'active'
  };

  req.app.locals.logger.info('Device registered', { deviceInfo });

  res.status(200).json({
    success: true,
    message: 'Device registered successfully',
    device: deviceInfo,
    apiKey: process.env.API_KEY || 'dev-key-12345'
  });
});

// Validate API key endpoint
router.get('/validate', (req, res) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!process.env.API_KEY) {
    return res.status(200).json({
      valid: true,
      message: 'Development mode - API key validation disabled'
    });
  }
  
  const isValid = apiKey === process.env.API_KEY;
  
  res.status(isValid ? 200 : 401).json({
    valid: isValid,
    message: isValid ? 'API key is valid' : 'Invalid API key'
  });
});

module.exports = router;