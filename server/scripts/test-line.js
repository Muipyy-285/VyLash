import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the server directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const lineAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const lineUserId = process.env.LINE_USER_ID;

async function testLineNotification() {
    console.log("🧪 Testing LINE Messaging API Integration...");

    if (!lineAccessToken || !lineUserId) {
        console.error("❌ Error: LINE_CHANNEL_ACCESS_TOKEN or LINE_USER_ID is missing in server/.env");
        process.exit(1);
    }

    console.log(`📡 Sending test message to User ID: ${lineUserId.substring(0, 10)}...`);

    const orderText = `🧪 VyLash Test Notification 🧪\n` +
        `------------------------\n` +
        `Status: Integration Test\n` +
        `Time: ${new Date().toLocaleString()}\n` +
        `------------------------\n` +
        `✅ If you see this message, your LINE API integration is working correctly!`;

    try {
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${lineAccessToken}`
            },
            body: JSON.stringify({
                to: lineUserId,
                messages: [
                    {
                        type: 'text',
                        text: orderText
                    }
                ]
            })
        });

        if (response.ok) {
            console.log("✅ Success! Test notification sent to LINE.");
        } else {
            const errorData = await response.text();
            console.error("❌ Failed to send LINE notification.");
            console.error("Status:", response.status);
            console.error("Error Body:", errorData);

            if (lineAccessToken.length < 50) {
                console.warn("⚠️ Warning: Your Channel Access Token looks short. Ensure it's a 'long-lived' token.");
            }
        }
    } catch (error) {
        console.error("❌ Network Error:", error.message);
    }
}

testLineNotification();
