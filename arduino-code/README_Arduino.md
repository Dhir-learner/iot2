/*
 * ESP32 Door Lock Libraries Installation Guide
 * 
 * Install the following libraries through Arduino IDE Library Manager:
 * 
 * 1. Adafruit Fingerprint Sensor Library
 *    - By: Adafruit
 *    - Version: 2.1.0 or newer
 * 
 * 2. ESP8266WiFi Library
 *    - Comes with ESP8266 Board Package
 * 
 * 3. ArduinoJson Library  
 *    - By: Benoit Blanchon
 *    - Version: 6.21.0 or newer
 * 
 * 4. ESP8266HTTPClient Library
 *    - Comes with ESP8266 Board Package
 * 
 * Board Manager URL for ESP8266:
 * http://arduino.esp8266.com/stable/package_esp8266com_index.json
 * 
 * Configuration Steps:
 * 1. Install ESP8266 board package in Arduino IDE
 * 2. Select Board: "NodeMCU 1.0 (ESP-12E Module)" or your specific ESP32/ESP8266 board
 * 3. Select correct COM Port
 * 4. Set Upload Speed to 115200
 * 5. Update WiFi credentials, server URL, and API key in the code
 * 6. Upload the code to your ESP32/ESP8266
 */

// Pin Configuration for ESP32/ESP8266
/*
 * Fingerprint Sensor Connections:
 * - VCC -> 3.3V or 5V
 * - GND -> GND  
 * - TX -> D6 (GPIO12)
 * - RX -> D7 (GPIO13)
 * 
 * Relay Module Connections:
 * - VCC -> 5V
 * - GND -> GND
 * - IN -> D5 (GPIO14)
 * 
 * Status LED Connections (Optional):
 * - Anode (+) -> D4 (GPIO2) through 220Ω resistor
 * - Cathode (-) -> GND
 */

// Configuration Checklist:
/*
 * Before uploading, make sure to update:
 * 
 * 1. WiFi Credentials:
 *    - ssid = "Your_WiFi_Name"
 *    - password = "Your_WiFi_Password"
 * 
 * 2. Server Configuration:
 *    - serverURL = "https://your-app-name.onrender.com"
 *    - apiKey = "your-api-key-from-server"
 * 
 * 3. Telegram Bot (Backup notifications):
 *    - botToken = "your-telegram-bot-token"
 *    - chatID = "your-telegram-chat-id"
 * 
 * 4. Device Settings:
 *    - deviceId = "unique-device-identifier"
 *    - deviceLocation = "door-location-description"
 * 
 * 5. Fingerprint ID:
 *    - Update line: if (id == 1) to match your enrolled fingerprint ID
 */