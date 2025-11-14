const express = require('express');
const router = express.Router();

// Middleware to validate API key
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!process.env.API_KEY) {
    return next(); // If no API key is set, allow access (development mode)
  }
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Valid API key required' 
    });
  }
  
  next();
};

// POST /api/notifications/unauthorized - Report unauthorized access
router.post('/unauthorized', validateApiKey, async (req, res) => {
  try {
    const { deviceId, location, fingerprintId, confidence } = req.body;
    const notificationService = req.app.locals.notificationService;
    const logger = req.app.locals.logger;

    const deviceInfo = {
      deviceId: deviceId || 'ESP32-Door-Lock',
      location: location || 'Main Door',
      fingerprintId,
      confidence,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    logger.info('Unauthorized access attempt detected', { deviceInfo });

    const result = await notificationService.sendUnauthorizedAccessAlert(deviceInfo);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Unauthorized access alert sent successfully',
        notificationId: result.notification.id,
        timestamp: result.notification.timestamp
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: 'Failed to send unauthorized access alert'
      });
    }
  } catch (error) {
    req.app.locals.logger.error('Error processing unauthorized access notification:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process notification'
    });
  }
});

// POST /api/notifications/authorized - Report authorized access
router.post('/authorized', validateApiKey, async (req, res) => {
  try {
    const { deviceId, location, userId, fingerprintId } = req.body;
    const notificationService = req.app.locals.notificationService;
    const logger = req.app.locals.logger;

    const deviceInfo = {
      deviceId: deviceId || 'ESP32-Door-Lock',
      location: location || 'Main Door',
      userId: userId || 'User-' + fingerprintId,
      fingerprintId,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    logger.info('Authorized access granted', { deviceInfo });

    const result = await notificationService.sendAccessGrantedNotification(deviceInfo);

    res.status(200).json({
      success: true,
      message: 'Access granted notification processed',
      notificationId: result.notification.id,
      timestamp: result.notification.timestamp
    });
  } catch (error) {
    req.app.locals.logger.error('Error processing authorized access notification:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process notification'
    });
  }
});

// GET /api/notifications/history - Get notification history
router.get('/history', validateApiKey, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const notificationService = req.app.locals.notificationService;

    const notifications = notificationService.getRecentNotifications(limit);

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    req.app.locals.logger.error('Error fetching notification history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notification history'
    });
  }
});

// GET /api/notifications/stats - Get notification statistics
router.get('/stats', validateApiKey, (req, res) => {
  try {
    const notificationService = req.app.locals.notificationService;
    const stats = notificationService.getNotificationStats();

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    req.app.locals.logger.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notification statistics'
    });
  }
});

// DELETE /api/notifications/clear - Clear notification history
router.delete('/clear', validateApiKey, (req, res) => {
  try {
    const notificationService = req.app.locals.notificationService;
    const clearedCount = notificationService.clearNotifications();

    req.app.locals.logger.info(`Cleared ${clearedCount} notifications`);

    res.status(200).json({
      success: true,
      message: `Cleared ${clearedCount} notifications`,
      clearedCount
    });
  } catch (error) {
    req.app.locals.logger.error('Error clearing notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear notifications'
    });
  }
});

module.exports = router;