# Render Deployment Configuration

# Web Service Settings for Render Dashboard:

## Basic Settings
- **Name**: `iot-door-lock-server`
- **Environment**: `Node`
- **Region**: Choose closest to your location
- **Branch**: `main`

## Build & Deploy Settings
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: `18`

## Environment Variables (Add these in Render Dashboard)

### Required Variables
```
NODE_ENV=production
API_KEY=generate-a-secure-random-key-32-chars-min
PORT=3000
```

### Telegram Configuration  
```
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_CHAT_ID=your-chat-id-number
```

### Email Configuration (Optional)
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ALERT_EMAIL=recipient@email.com
```

### Additional Settings
```
ALLOWED_ORIGINS=*
NOTIFY_ACCESS_GRANTED=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

## Deployment Steps

1. **Connect Repository**
   - Go to Render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select repository: `Dhir-learner/iot2`

2. **Configure Service**
   - Copy settings from above
   - Add all environment variables
   - Click "Create Web Service"

3. **Wait for Deployment**
   - Monitor build logs
   - Service will be available at: `https://your-service-name.onrender.com`

## Troubleshooting

### If Build Fails
- Check that all environment variables are set
- Verify Node.js version is 18
- Check build logs for specific errors

### If Service Won't Start  
- Ensure PORT=3000 is set
- Check that API_KEY is defined
- Verify start command is `npm start`

### Testing Deployment
```bash
# Test health endpoint
curl https://your-service-name.onrender.com/health

# Test dashboard
# Visit https://your-service-name.onrender.com in browser
```

## Alternative: Deploy without Docker

If Docker deployment fails, use the web service option which uses the build commands directly without containerization.

## Post-Deployment

1. **Test Web Dashboard**
   - Visit your deployed URL
   - Check system status shows "Online"
   - Test notification sending

2. **Update ESP32 Code**
   ```cpp
   const char* serverURL = "https://your-service-name.onrender.com";
   const char* apiKey = "your-api-key-from-render-env-vars";
   ```

3. **Test Full System**
   - Upload updated ESP32 code
   - Test fingerprint sensor
   - Verify notifications work