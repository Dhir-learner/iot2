# 🚀 IoT Door Lock System - Complete Deployment Guide

This comprehensive guide will walk you through deploying your IoT Door Lock notification system from start to finish.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [Telegram Bot Setup](#telegram-bot-setup)
4. [Email Configuration (Optional)](#email-configuration-optional)
5. [Deploy to Render](#deploy-to-render)
6. [ESP32/Arduino Configuration](#esp32arduino-configuration)
7. [Testing Your Setup](#testing-your-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Node.js 18+ installed
- ✅ Git installed
- ✅ A GitHub account
- ✅ A Render account (free tier available)
- ✅ ESP32/ESP8266 with fingerprint sensor
- ✅ Telegram account (for notifications)

## 🔧 Local Setup

### Step 1: Clone and Setup Project

```bash
# Clone the repository
git clone <your-repo-url>
cd iot-door-lock-server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit the `.env` file with your settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
API_KEY=your-secure-api-key-here

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# Email Configuration (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ALERT_EMAIL=alert-recipient@gmail.com
```

### Step 3: Test Locally

```bash
# Start development server
npm run dev

# Test the server
curl http://localhost:3000/health
```

Visit `http://localhost:3000` to see the dashboard.

## 📱 Telegram Bot Setup

### Step 1: Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "Door Lock Alert Bot")
4. Choose a username (e.g., "door_lock_alert_bot")
5. Copy the bot token provided

### Step 2: Get Chat ID

1. Start a chat with your new bot
2. Send any message to the bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":XXXXXXXXX}` in the response
5. Copy the chat ID (the number)

### Step 3: Test Telegram Integration

```bash
# Test telegram notification (replace with your details)
curl -X GET "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage?chat_id=<YOUR_CHAT_ID>&text=Test message from IoT Door Lock"
```

## 📧 Email Configuration (Optional)

### Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

### Other Email Providers

Update `EMAIL_SERVICE` in `.env`:
- `gmail` - Gmail
- `outlook` - Outlook/Hotmail
- `yahoo` - Yahoo Mail
- Or use custom SMTP settings

## 🌐 Deploy to Render

### Step 1: Prepare for Deployment

```bash
# Initialize git repository (if not done already)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: IoT Door Lock Server"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/iot-door-lock-server.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose the repository you just created

3. **Configure Service Settings**
   ```
   Name: iot-door-lock-server
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables**
   
   In Render dashboard, go to Environment tab and add:
   
   ```
   NODE_ENV=production
   API_KEY=your-secure-random-api-key-here
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   TELEGRAM_CHAT_ID=your-telegram-chat-id
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ALERT_EMAIL=alert-recipient@gmail.com
   NOTIFY_ACCESS_GRANTED=false
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your service will be available at: `https://your-service-name.onrender.com`

### Step 3: Verify Deployment

```bash
# Test your deployed server
curl https://your-service-name.onrender.com/health

# Test web interface
# Visit https://your-service-name.onrender.com in browser
```

## 🔌 ESP32/Arduino Configuration

### Step 1: Install Required Libraries

In Arduino IDE, install these libraries:
1. **Adafruit Fingerprint Sensor Library** (by Adafruit)
2. **ArduinoJson** (by Benoit Blanchon, v6.21+)
3. **ESP8266WiFi** (comes with ESP8266 board package)
4. **ESP8266HTTPClient** (comes with ESP8266 board package)

### Step 2: Configure ESP32 Code

Update the Arduino code with your settings:

```cpp
// WiFi Credentials
const char* ssid = "Your_WiFi_Name";
const char* password = "Your_WiFi_Password";

// Server Configuration  
const char* serverURL = "https://your-service-name.onrender.com";
const char* apiKey = "your-api-key-from-render";

// Device Configuration
const char* deviceId = "ESP32-Door-Lock-01";
const char* deviceLocation = "Main Door";
```

### Step 3: Upload Code

1. Select your ESP32/ESP8266 board
2. Select correct COM port
3. Upload the updated code
4. Open Serial Monitor to see connection status

## ✅ Testing Your Setup

### 1. Test Server Health

```bash
curl https://your-service-name.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

### 2. Test Web Dashboard

Visit: `https://your-service-name.onrender.com`

You should see:
- ✅ Server status showing "Online"
- ✅ System statistics
- ✅ Telegram/Email status
- ✅ Empty notification history (initially)

### 3. Test Notifications

```bash
# Send test unauthorized access alert
curl -X POST https://your-service-name.onrender.com/api/notifications/unauthorized \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "deviceId": "TEST-DEVICE",
    "location": "Test Location"
  }'
```

### 4. Test ESP32 Integration

1. Power on your ESP32 with the updated code
2. Check Serial Monitor for connection messages
3. Test with fingerprint sensor
4. Verify notifications appear in:
   - Telegram chat
   - Web dashboard
   - Email (if configured)

## 📊 Monitoring & Maintenance

### Dashboard Features

Access your dashboard at: `https://your-service-name.onrender.com`

**Available Features:**
- 📊 Real-time system status
- 📈 Security statistics
- 🔔 Notification history
- 📱 Device registration
- 🧪 Test notifications

### API Endpoints for Monitoring

```bash
# System status
GET /api/status

# Notification statistics
GET /api/notifications/stats

# Recent notifications
GET /api/notifications/history?limit=20

# Health check
GET /health
```

### Log Monitoring

Access logs through Render dashboard:
1. Go to your service in Render
2. Click "Logs" tab
3. Monitor real-time server activity

## 🔧 Troubleshooting

### Common Issues

#### 1. Server Won't Start
```bash
# Check logs in Render dashboard
# Common causes:
- Missing environment variables
- Port binding issues
- Dependency installation failures
```

#### 2. ESP32 Can't Connect to Server
```cpp
// Debug steps:
1. Check WiFi connection
2. Verify server URL is correct
3. Check API key matches
4. Test with curl command first
```

#### 3. Notifications Not Sending
```bash
# Check:
- Telegram bot token is correct
- Chat ID is correct
- Email credentials are valid
- Server has internet access
```

#### 4. Web Dashboard Not Loading
```bash
# Verify:
- Server is running (check /health endpoint)
- Static files are being served
- No JavaScript console errors
```

### Debug Commands

```bash
# Test server connectivity
curl -v https://your-service-name.onrender.com/health

# Test API with authentication
curl -X GET https://your-service-name.onrender.com/api/status \
  -H "X-API-Key: your-api-key"

# Send test notification
curl -X POST https://your-service-name.onrender.com/api/status/test-notification

# Check notification history
curl -X GET https://your-service-name.onrender.com/api/notifications/history \
  -H "X-API-Key: your-api-key"
```

## 🔐 Security Best Practices

### Environment Variables Security

1. **Never commit `.env` files to Git**
2. **Use strong API keys** (generate random 32+ character strings)
3. **Rotate API keys regularly**
4. **Use HTTPS only** (Render provides this automatically)

### Network Security

1. **Enable rate limiting** (already configured)
2. **Use CORS properly** (configure `ALLOWED_ORIGINS`)
3. **Monitor logs regularly**
4. **Update dependencies regularly**

## 📱 Mobile Integration

### Telegram Commands

Set up these commands with @BotFather:

```
/start - Start receiving notifications
/status - Check door lock status
/history - View recent access attempts
/help - Show available commands
```

### Email Filters

Set up email filters to:
- Mark security alerts as important
- Forward to security team
- Create separate folder for door lock alerts

## 🚀 Advanced Configuration

### Multiple Devices

To support multiple door locks:

1. **Register each device with unique ID:**
```cpp
const char* deviceId = "ESP32-Front-Door";
const char* deviceId = "ESP32-Back-Door";
```

2. **Use location-specific settings:**
```cpp
const char* deviceLocation = "Front Door";
const char* deviceLocation = "Back Door";
```

### Custom Notifications

Modify notification messages:

```javascript
// In NotificationService.js
const message = `🚨 SECURITY ALERT - ${deviceInfo.location}\n` +
               `⚠️ Unauthorized access at ${deviceInfo.location}!\n` +
               `📅 ${new Date().toLocaleString()}`;
```

### Database Integration

For persistent storage, add MongoDB or PostgreSQL:

```bash
npm install mongoose
# or
npm install pg
```

## 📞 Support & Updates

### Getting Help

1. **Check troubleshooting section above**
2. **Review server logs in Render dashboard**
3. **Test each component individually**
4. **Check GitHub issues** (if using a public repo)

### Updating the System

```bash
# Update dependencies
npm update

# Deploy updates
git add .
git commit -m "Update dependencies"
git push

# Render will auto-deploy the changes
```

### Backup & Recovery

1. **Export notification data** via API
2. **Backup environment variables**
3. **Document device configurations**
4. **Keep ESP32 code versions**

---

## 🎉 Deployment Complete!

Your IoT Door Lock Security System is now fully deployed and operational!

### Quick Links:
- **Dashboard:** `https://your-service-name.onrender.com`
- **API Docs:** `https://your-service-name.onrender.com/api`
- **Health Check:** `https://your-service-name.onrender.com/health`

### What's Working:
- ✅ Real-time unauthorized access alerts
- ✅ Telegram notifications
- ✅ Email alerts (if configured)
- ✅ Web dashboard monitoring
- ✅ Device registration
- ✅ Notification history
- ✅ System statistics

Enjoy your secure, monitored IoT door lock system! 🔐🏠