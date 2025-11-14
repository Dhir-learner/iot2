#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Credentials
const char* ssid = "Abc";
const char* password = "123456789";

// Server Configuration
const char* serverURL = "https://your-server-name.onrender.com";  // Replace with your Render URL
const char* apiKey = "your-api-key-here";  // Replace with your API key

// Telegram Bot Credentials (Keep as backup)
const char* botToken = "7809752543:AAFCrmTw32uOQN62gEu0W4PjfQWyHM4LoKs";
const char* chatID = "6592398878";

// Device Configuration
const char* deviceId = "ESP32-Door-Lock-01";
const char* deviceLocation = "Main Door";

WiFiClientSecure client;
HTTPClient http;

// Fingerprint Sensor
SoftwareSerial mySerial(D7, D6); // TX, RX
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

// Relay Signal Pin (ESP to Arduino)
#define RELAY_PIN D5  

// Status LED (optional)
#define STATUS_LED D4

void setup() {
    Serial.begin(9600);
    mySerial.begin(57600);

    pinMode(RELAY_PIN, OUTPUT);
    pinMode(STATUS_LED, OUTPUT);
    
    digitalWrite(RELAY_PIN, LOW);  // Lock is initially locked
    digitalWrite(STATUS_LED, LOW);

    finger.begin(57600);
    if (finger.verifyPassword()) {
        Serial.println("Fingerprint sensor detected!");
        blinkStatusLED(2); // 2 quick blinks for sensor OK
    } else {
        Serial.println("No fingerprint sensor found!");
        while (1) {
            blinkStatusLED(5); // Continuous blinking for error
            delay(1000);
        }
    }

    // Connect to WiFi
    connectToWiFi();
    
    // Register device with server
    registerDevice();
}

void loop() {
    // Check WiFi connection
    if (WiFi.status() != WL_CONNECTED) {
        connectToWiFi();
    }

    Serial.println("Place your finger on the scanner. You have 10 seconds...");
    digitalWrite(STATUS_LED, HIGH); // LED on during scanning
    
    int id = waitForFingerprint(10000);  // Wait for 10 seconds

    digitalWrite(STATUS_LED, LOW); // LED off after scanning

    if (id == 1) {  // Change this to your registered fingerprint ID
        Serial.println("✅ Access Granted!");
        
        // Unlock door
        digitalWrite(RELAY_PIN, HIGH);
        blinkStatusLED(3); // 3 blinks for success
        
        // Send notifications
        sendTelegramMessage("✅ Access Granted - Door Unlocked at " + getCurrentTimestamp());
        sendServerNotification("authorized", id);
        
        delay(5000); // Keep door unlocked for 5 seconds
        digitalWrite(RELAY_PIN, LOW);  // Lock door again
        
        Serial.println("🔒 Door locked again");
        
    } else if (id == -2) {  // Unauthorized fingerprint detected
        Serial.println("🚨 Unauthorized Access! Sending alert...");
        
        // Alert LEDs
        for(int i = 0; i < 10; i++) {
            digitalWrite(STATUS_LED, HIGH);
            delay(100);
            digitalWrite(STATUS_LED, LOW);
            delay(100);
        }
        
        // Send notifications
        sendTelegramMessage("⚠ SECURITY ALERT: Unauthorized Fingerprint Detected at " + getCurrentTimestamp() + " 🚨");
        sendServerNotification("unauthorized", -1);
        
    } else {
        Serial.println("⏳ No fingerprint detected within 10 seconds. Skipping...");
    }
    
    delay(1000);
}

void connectToWiFi() {
    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 30) {
        delay(500);
        Serial.print(".");
        blinkStatusLED(1);
        attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\n✅ Connected to WiFi!");
        Serial.print("IP address: ");
        Serial.println(WiFi.localIP());
        blinkStatusLED(2);
        client.setInsecure();
    } else {
        Serial.println("\n❌ WiFi connection failed!");
    }
}

void registerDevice() {
    if (WiFi.status() != WL_CONNECTED) return;
    
    Serial.println("Registering device with server...");
    
    http.begin(String(serverURL) + "/api/auth/register");
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["deviceId"] = deviceId;
    doc["deviceType"] = "ESP32";
    doc["location"] = deviceLocation;
    
    String payload;
    serializeJson(doc, payload);
    
    int httpResponseCode = http.POST(payload);
    
    if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("Device registration response: " + String(httpResponseCode));
        Serial.println("Response: " + response);
    } else {
        Serial.println("Device registration failed: " + String(httpResponseCode));
    }
    
    http.end();
}

void sendServerNotification(String type, int fingerprintId) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("⚠ WiFi not connected! Cannot send server notification.");
        return;
    }
    
    String endpoint = String(serverURL) + "/api/notifications/" + type;
    
    http.begin(endpoint);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-API-Key", apiKey);
    
    // Create JSON payload
    StaticJsonDocument<300> doc;
    doc["deviceId"] = deviceId;
    doc["location"] = deviceLocation;
    doc["timestamp"] = getCurrentTimestamp();
    
    if (fingerprintId > 0) {
        doc["fingerprintId"] = fingerprintId;
        doc["userId"] = "User-" + String(fingerprintId);
    } else if (fingerprintId == -1) {
        doc["fingerprintId"] = 999; // Unknown/unauthorized ID
    }
    
    String payload;
    serializeJson(doc, payload);
    
    Serial.println("Sending to server: " + endpoint);
    Serial.println("Payload: " + payload);
    
    int httpResponseCode = http.POST(payload);
    
    if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("✅ Server notification sent successfully!");
        Serial.println("Response code: " + String(httpResponseCode));
        Serial.println("Response: " + response);
    } else {
        Serial.println("❌ Server notification failed!");
        Serial.println("Error code: " + String(httpResponseCode));
    }
    
    http.end();
}

// Function to wait for a fingerprint for a specified time (milliseconds)
int waitForFingerprint(unsigned long timeout) {
    unsigned long startTime = millis();
    
    while (millis() - startTime < timeout) {
        int id = getFingerprintID();
        if (id > 0) return id; // Valid fingerprint detected
        if (id == -2) return -2; // Unauthorized fingerprint detected
        delay(50); // Small delay to prevent overwhelming the sensor
    }
    return 0; // No fingerprint detected in the given time
}

void sendTelegramMessage(String message) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("⚠ WiFi not connected! Cannot send Telegram message.");
        return;
    }
    
    String url = "https://api.telegram.org/bot" + String(botToken) + "/sendMessage?chat_id=" + String(chatID) + "&text=" + urlEncode(message);

    client.connect("api.telegram.org", 443);
    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: api.telegram.org\r\n" +
                 "Connection: close\r\n\r\n");

    delay(2000);
    Serial.println("✅ Telegram message sent!");
    
    // Read and discard response
    while (client.available()) {
        client.read();
    }
    client.stop();
}

int getFingerprintID() {
    uint8_t p = finger.getImage();
    if (p != FINGERPRINT_OK) return -1;  // No fingerprint detected

    p = finger.image2Tz();
    if (p != FINGERPRINT_OK) return -1;  

    p = finger.fingerFastSearch();
    if (p == FINGERPRINT_OK) {
        return finger.fingerID; // Return recognized fingerprint ID
    } else {
        return -2;  // Unauthorized fingerprint detected
    }
}

void blinkStatusLED(int times) {
    for (int i = 0; i < times; i++) {
        digitalWrite(STATUS_LED, HIGH);
        delay(200);
        digitalWrite(STATUS_LED, LOW);
        delay(200);
    }
}

String getCurrentTimestamp() {
    return String(millis()); // Simple timestamp - you can enhance this with NTP time
}

String urlEncode(String str) {
    String encodedString = "";
    char c;
    char code0;
    char code1;
    
    for (int i = 0; i < str.length(); i++) {
        c = str.charAt(i);
        if (c == ' ') {
            encodedString += '+';
        } else if (isalnum(c)) {
            encodedString += c;
        } else {
            code1 = (c & 0xf) + '0';
            if ((c & 0xf) > 9) {
                code1 = (c & 0xf) - 10 + 'A';
            }
            c = (c >> 4) & 0xf;
            code0 = c + '0';
            if (c > 9) {
                code0 = c - 10 + 'A';
            }
            encodedString += '%';
            encodedString += code0;
            encodedString += code1;
        }
        yield();
    }
    
    return encodedString;
}