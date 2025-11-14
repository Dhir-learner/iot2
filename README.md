# IoT Door Lock Notification Server

A Node.js server for handling notifications from IoT door lock systems with fingerprint authentication. This server receives notifications from ESP32/Arduino devices and sends alerts via Telegram and Email when unauthorized access attempts are detected.

## 🚀 Features

- **Real-time Notifications**: Receive instant alerts for unauthorized fingerprint detection
- **Multi-channel Alerts**: Support for Telegram Bot and Email notifications  
- **RESTful API**: Easy integration with IoT devices
- **Device Management**: Register and manage multiple door lock devices
- **Notification History**: Track and view notification history
- **Statistics Dashboard**: Monitor system performance and security events
- **Rate Limiting**: Built-in protection against spam requests
- **Secure Authentication**: API key-based authentication
- **Production Ready**: Configured for deployment on Render, Heroku, or Docker

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Telegram Bot Token (optional)
- Email account for SMTP (optional)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd iot-door-lock-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=production
   API_KEY=your-secure-api-key-here
   
   # Telegram Bot Configuration
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
   TELEGRAM_CHAT_ID=your-telegram-chat-id-here
   
   # Email Configuration (optional)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-app-password
   ALERT_EMAIL=your-alert-email@gmail.com
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new device
- `GET /api/auth/validate` - Validate API key

### Notifications  
- `POST /api/notifications/unauthorized` - Report unauthorized access
- `POST /api/notifications/authorized` - Report authorized access
- `GET /api/notifications/history` - Get notification history
- `GET /api/notifications/stats` - Get notification statistics
- `DELETE /api/notifications/clear` - Clear notification history

### System Status
- `GET /health` - Health check endpoint
- `GET /api/status` - System status and configuration
- `POST /api/status/test-notification` - Send test notification

## 📱 IoT Device Integration

### ESP32/Arduino Code Update

Update your ESP32 code to send notifications to the server:

```cpp
// Add this function to your ESP32 code
void sendServerNotification(String type, int fingerprintId = -1) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin("https://your-server-url.render.com/api/notifications/" + type);
        http.addHeader("Content-Type", "application/json");
        http.addHeader("X-API-Key", "your-api-key-here");
        
        String payload = "{";
        payload += "\"deviceId\":\"ESP32-Door-Lock\",";
        payload += "\"location\":\"Main Door\",";
        if (fingerprintId != -1) {
            payload += "\"fingerprintId\":" + String(fingerprintId) + ",";
        }
        payload += "\"timestamp\":\"" + String(millis()) + "\"";
        payload += "}";
        
        int httpResponseCode = http.POST(payload);
        
        if (httpResponseCode > 0) {
            Serial.println("Server notification sent: " + String(httpResponseCode));
        } else {
            Serial.println("Server notification failed: " + String(httpResponseCode));
        }
        
        http.end();
    }
}

// Update your loop function
void loop() {
    Serial.println("Place your finger on the scanner. You have 10 seconds...");
    int id = waitForFingerprint(10000);

    if (id == 1) {  // Authorized fingerprint
        Serial.println("✅ Access Granted!");
        digitalWrite(RELAY_PIN, HIGH);
        sendTelegramMessage("✅ Access Granted - Door Unlocked");
        sendServerNotification("authorized", id);  // Add this line
        delay(5000);
        digitalWrite(RELAY_PIN, LOW);
    } else if (id == -2) {  // Unauthorized fingerprint
        Serial.println("🚨 Unauthorized Access! Sending alert...");
        sendTelegramMessage("⚠ Unauthorized Fingerprint Detected! 🚨");
        sendServerNotification("unauthorized");  // Add this line
    }
    delay(1000);
}
```

### Required ESP32 Libraries
Add these includes to your ESP32 code:
```cpp
#include <HTTPClient.h>  // For HTTP requests
#include <ArduinoJson.h> // For JSON handling (optional)
```

## 🚀 Deployment on Render

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Choose "Node" as the environment
   - Build command: `npm install`
   - Start command: `npm start`

2. **Set Environment Variables**
   - Go to your service settings on Render
   - Add all the environment variables from your `.env` file

3. **Deploy**
   - Render will automatically deploy your service
   - Your server will be available at: `https://your-service-name.onrender.com`

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |
| `API_KEY` | API authentication key | Yes | - |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | No | - |
| `TELEGRAM_CHAT_ID` | Telegram chat ID | No | - |
| `EMAIL_SERVICE` | Email service (gmail, outlook, etc.) | No | - |
| `EMAIL_USER` | Email username | No | - |
| `EMAIL_PASS` | Email password/app password | No | - |
| `ALERT_EMAIL` | Email to receive alerts | No | - |
| `NOTIFY_ACCESS_GRANTED` | Send notifications for authorized access | No | false |

### Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Get your chat ID by messaging [@userinfobot](https://t.me/userinfobot)
4. Add these to your `.env` file

## 📊 API Usage Examples

### Send Unauthorized Access Alert
```bash
curl -X POST https://your-server-url.com/api/notifications/unauthorized \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "deviceId": "ESP32-Door-Lock-01",
    "location": "Main Door",
    "fingerprintId": 999
  }'
```

### Get Notification History
```bash
curl -X GET "https://your-server-url.com/api/notifications/history?limit=20" \
  -H "X-API-Key: your-api-key"
```

### Check System Status
```bash
curl -X GET https://your-server-url.com/api/status
```

## 🔍 Monitoring & Logging

- Logs are stored in the `logs/` directory
- Access logs via `/api/status` endpoint
- Monitor notification statistics via `/api/notifications/stats`
- Health check available at `/health`

## 🛡️ Security Features

- API key authentication
- Rate limiting (100 requests per 15 minutes in production)
- CORS protection
- Input validation
- Secure headers with Helmet.js
- Request logging and monitoring

## 🔧 Development

### Local Development
```bash
npm run dev  # Starts with nodemon for auto-reload
```

### Testing
```bash
# Test notification endpoint
curl -X POST http://localhost:3000/api/status/test-notification \
  -H "X-API-Key: dev-api-key-12345"
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes  
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the logs for error details
- Verify environment variables are correctly set

## 🔄 Updates

- Check the `/health` endpoint for server status
- Monitor the `/api/notifications/stats` for system health
- Update ESP32 firmware when new features are added

---

**Note**: Make sure to replace placeholder values (API keys, tokens, URLs) with your actual configuration before deployment.