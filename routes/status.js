const express = require('express');
const router = express.Router();

// System status endpoint
router.get('/', (req, res) => {
  const notificationService = req.app.locals.notificationService;
  const stats = notificationService.getNotificationStats();
  
  res.status(200).json({
    server: {
      status: 'running',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    },
    services: {
      telegram: {
        enabled: !!process.env.TELEGRAM_BOT_TOKEN,
        configured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
      },
      email: {
        enabled: !!process.env.EMAIL_SERVICE,
        configured: !!(process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS)
      }
    },
    notifications: stats,
    timestamp: new Date().toISOString()
  });
});

// Test notification endpoint
router.post('/test-notification', async (req, res) => {
  try {
    const notificationService = req.app.locals.notificationService;
    
    const testDeviceInfo = {
      deviceId: 'TEST-DEVICE',
      location: 'Test Location',
      fingerprintId: 999,
      ip: req.ip
    };

    const result = await notificationService.sendUnauthorizedAccessAlert(testDeviceInfo);

    res.status(200).json({
      success: result.success,
      message: 'Test notification sent',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;