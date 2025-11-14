# IoT Door Lock Security System - Quick Start

## 🚀 Deploy in 5 Minutes

### 1. Fork & Deploy
```bash
# Fork this repository on GitHub
# Deploy to Render: https://render.com
# Connect your forked repository
```

### 2. Set Environment Variables in Render
```
API_KEY=your-secure-random-key-here
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_CHAT_ID=your-chat-id
```

### 3. Update ESP32 Code
```cpp
const char* serverURL = "https://your-app-name.onrender.com";
const char* apiKey = "your-api-key-from-step-2";
```

### 4. Test Your System
- Visit: `https://your-app-name.onrender.com`
- Test unauthorized fingerprint on ESP32
- Check Telegram for alerts

## 📋 What You Get

- ✅ **Real-time Security Alerts** - Instant notifications via Telegram & Email
- ✅ **Web Dashboard** - Monitor system status and view notification history  
- ✅ **Multi-device Support** - Connect multiple door locks
- ✅ **Production Ready** - Deployed on Render with full monitoring
- ✅ **Mobile Friendly** - Responsive web interface for any device

## 🔧 Hardware Requirements

- ESP32 or ESP8266 microcontroller
- Fingerprint sensor (compatible with Adafruit library)
- Relay module for door lock control
- WiFi connection

## 📱 Software Features

- **Unauthorized Access Alerts** - Instant notifications when unknown fingerprints are detected
- **Access Logging** - Track all authorized and unauthorized access attempts
- **System Monitoring** - Real-time dashboard showing system health and statistics
- **Device Management** - Register and manage multiple door lock devices
- **Notification History** - View detailed logs of all security events
- **API Integration** - RESTful API for custom integrations

## 🌟 Key Benefits

1. **Enhanced Security** - Know immediately when someone tries unauthorized access
2. **Remote Monitoring** - Check door lock status from anywhere in the world
3. **Easy Setup** - Deploy in minutes with minimal configuration
4. **Scalable** - Add more door locks and sensors as needed
5. **Reliable** - Production-grade server with automatic failover
6. **Cost Effective** - Free tier deployment options available

## 🔗 Quick Links

- **[Full Deployment Guide](DEPLOYMENT.md)** - Complete step-by-step instructions
- **[Hardware Setup](arduino-code/README_Arduino.md)** - ESP32 wiring and code setup
- **[API Documentation](README.md#-api-endpoints)** - Integration guide for developers

## 🆘 Need Help?

1. Check the [troubleshooting section](DEPLOYMENT.md#troubleshooting)
2. Verify all environment variables are set correctly
3. Test each component individually (ESP32, server, notifications)
4. Check server logs in your Render dashboard

## 📞 Support

- 📖 Read the full documentation in `README.md`
- 🚀 Follow deployment guide in `DEPLOYMENT.md`  
- 🔧 Hardware setup in `arduino-code/README_Arduino.md`

---

**Get your IoT door lock security system up and running in just 5 minutes!** 🔐🏠