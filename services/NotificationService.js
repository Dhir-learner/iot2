const TelegramBot = require('node-telegram-bot-api');
const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    this.telegramBot = null;
    this.emailTransporter = null;
    this.notifications = [];
    this.initialize();
  }

  initialize() {
    // Initialize Telegram Bot if token is provided
    if (process.env.TELEGRAM_BOT_TOKEN) {
      this.telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
    }

    // Initialize Email transporter if credentials are provided
    if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.emailTransporter = nodemailer.createTransporter({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
  }

  async sendUnauthorizedAccessAlert(deviceInfo = {}) {
    const timestamp = new Date().toISOString();
    const message = `🚨 SECURITY ALERT 🚨\n\n` +
                   `⚠️ Unauthorized fingerprint detected!\n` +
                   `📅 Time: ${new Date().toLocaleString()}\n` +
                   `🏠 Device: ${deviceInfo.deviceId || 'Door Lock System'}\n` +
                   `📍 Location: ${deviceInfo.location || 'Main Door'}\n\n` +
                   `Please check your premises immediately!`;

    const notification = {
      id: Date.now(),
      type: 'unauthorized_access',
      message,
      timestamp,
      deviceInfo,
      status: 'pending'
    };

    try {
      // Send Telegram notification
      if (this.telegramBot && process.env.TELEGRAM_CHAT_ID) {
        await this.telegramBot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
        console.log('✅ Telegram notification sent successfully');
      }

      // Send Email notification
      if (this.emailTransporter && process.env.ALERT_EMAIL) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.ALERT_EMAIL,
          subject: '🚨 Door Lock Security Alert - Unauthorized Access',
          text: message,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h2 style="color: #d32f2f;">🚨 SECURITY ALERT</h2>
              <div style="background: #ffebee; padding: 20px; border-left: 4px solid #d32f2f; margin: 20px 0;">
                <h3>⚠️ Unauthorized Fingerprint Detected!</h3>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Device:</strong> ${deviceInfo.deviceId || 'Door Lock System'}</p>
                <p><strong>Location:</strong> ${deviceInfo.location || 'Main Door'}</p>
              </div>
              <p style="color: #d32f2f; font-weight: bold;">Please check your premises immediately!</p>
            </div>
          `
        };

        await this.emailTransporter.sendMail(mailOptions);
        console.log('✅ Email notification sent successfully');
      }

      notification.status = 'sent';
      this.notifications.push(notification);
      
      return { success: true, notification };
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
      notification.status = 'failed';
      notification.error = error.message;
      this.notifications.push(notification);
      
      return { success: false, error: error.message, notification };
    }
  }

  async sendAccessGrantedNotification(deviceInfo = {}) {
    const timestamp = new Date().toISOString();
    const message = `✅ ACCESS GRANTED\n\n` +
                   `🔓 Authorized access detected\n` +
                   `📅 Time: ${new Date().toLocaleString()}\n` +
                   `🏠 Device: ${deviceInfo.deviceId || 'Door Lock System'}\n` +
                   `👤 User: ${deviceInfo.userId || 'Authorized User'}\n` +
                   `📍 Location: ${deviceInfo.location || 'Main Door'}`;

    const notification = {
      id: Date.now(),
      type: 'access_granted',
      message,
      timestamp,
      deviceInfo,
      status: 'pending'
    };

    try {
      // Send Telegram notification (optional for access granted)
      if (this.telegramBot && process.env.TELEGRAM_CHAT_ID && process.env.NOTIFY_ACCESS_GRANTED === 'true') {
        await this.telegramBot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
      }

      notification.status = 'sent';
      this.notifications.push(notification);
      
      return { success: true, notification };
    } catch (error) {
      console.error('❌ Failed to send access granted notification:', error);
      notification.status = 'failed';
      notification.error = error.message;
      this.notifications.push(notification);
      
      return { success: false, error: error.message, notification };
    }
  }

  getRecentNotifications(limit = 50) {
    return this.notifications
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  getNotificationStats() {
    const total = this.notifications.length;
    const successful = this.notifications.filter(n => n.status === 'sent').length;
    const failed = this.notifications.filter(n => n.status === 'failed').length;
    const unauthorized = this.notifications.filter(n => n.type === 'unauthorized_access').length;
    const authorized = this.notifications.filter(n => n.type === 'access_granted').length;

    return {
      total,
      successful,
      failed,
      unauthorized_access: unauthorized,
      access_granted: authorized,
      success_rate: total > 0 ? ((successful / total) * 100).toFixed(2) : 0
    };
  }

  clearNotifications() {
    const count = this.notifications.length;
    this.notifications = [];
    return count;
  }
}

module.exports = NotificationService;