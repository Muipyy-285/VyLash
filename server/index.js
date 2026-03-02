import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the VyLash Express backend!' });
});

// Endpoint for receiving orders and sending via LINE Messaging API
app.post('/api/orders', async (req, res) => {
    try {
        const { customer, items, total, paymentMethod } = req.body;

        // 1. Format the message for LINE Messaging API
        let orderText = `📦 มียอดสั่งซื้อใหม่! 📦\n`;
        orderText += `------------------------\n`;
        orderText += `👤 ชื่อลูกค้า: ${customer.name}\n`;
        orderText += `📞 เบอร์โทร: ${customer.phone}\n`;
        orderText += `📧 อีเมล: ${customer.email}\n`;
        orderText += `🏠 ที่อยู่: ${customer.address}\n`;
        orderText += `💳 วิธีชำระเงิน: ${paymentMethod}\n`;
        orderText += `------------------------\n`;
        orderText += `🛒 รายการสินค้า:\n`;
        items.forEach((item, index) => {
            orderText += `${index + 1}. ${item.name} (${item.style}) - ฿${item.price}\n`;
        });
        orderText += `------------------------\n`;
        orderText += `💰 ยอดชำระรวม: ฿${total}`;

        // 2. Send to LINE Messaging API
        const lineAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        const lineUserId = process.env.LINE_USER_ID;

        if (lineAccessToken && lineUserId) {
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

            if (!response.ok) {
                const errorData = await response.text();
                console.error("❌ LINE Messaging API Error Status:", response.status);
                console.error("❌ LINE Messaging API Error Body:", errorData);

                // Alert if token seems like it might be the wrong type (e.g. 32 chars instead of long-lived token)
                if (lineAccessToken.length < 50) {
                    console.error("⚠️  WARNING: Your LINE_CHANNEL_ACCESS_TOKEN looks shorter than expected. Please use a 'Channel access token (long-lived)' from the Messaging API tab.");
                }

                return res.status(500).json({
                    success: false,
                    message: 'Order submission reached backend, but LINE notification failed.',
                    error: response.statusText
                });
            }
            console.log("✅ LINE notification sent successfully");
        } else {
            console.log("⚠️ No LINE_CHANNEL_ACCESS_TOKEN or LINE_USER_ID found in .env, skipping LINE notification.");
        }

        res.status(200).json({ success: true, message: 'Order created successfully' });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Endpoint for receiving feedback and sending via LINE Messaging API
app.post('/api/feedback', async (req, res) => {
    try {
        const { name, rating, message } = req.body;

        // 1. Format the message for LINE Messaging API
        let feedbackText = `💬 มีความคิดเห็นใหม่จากลูกค้า! 💬\n`;
        feedbackText += `------------------------\n`;
        feedbackText += `👤 ชื่อ: ${name || 'ไม่ระบุ'}\n`;
        feedbackText += `⭐ คะแนน: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)\n`;
        feedbackText += `------------------------\n`;
        feedbackText += `📝 ข้อความ:\n${message}\n`;
        feedbackText += `------------------------`;

        // 2. Send to LINE Messaging API
        const lineAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        const lineUserId = process.env.LINE_USER_ID;

        if (lineAccessToken && lineUserId) {
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
                            text: feedbackText
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("❌ LINE Messaging API Error Status:", response.status);
                console.error("❌ LINE Messaging API Error Body:", errorData);

                return res.status(500).json({
                    success: false,
                    message: 'Feedback received, but LINE notification failed.',
                    error: response.statusText
                });
            }
            console.log("✅ LINE feedback notification sent successfully");
        } else {
            console.log("⚠️ No LINE_CHANNEL_ACCESS_TOKEN or LINE_USER_ID found in .env, skipping LINE notification.");
        }

        res.status(200).json({ success: true, message: 'Feedback sent successfully' });
    } catch (error) {
        console.error('Error processing feedback:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
