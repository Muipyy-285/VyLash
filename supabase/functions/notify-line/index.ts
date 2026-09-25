import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const LINE_CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN")!
const LINE_USER_ID = Deno.env.get("LINE_USER_ID")!

serve(async (req) => {
  try {
    const payload = await req.json()
    const { table, record, type } = payload

    // Only process new inserts
    if (type !== 'INSERT') {
       return new Response("Not an INSERT, skipping", { status: 200 })
    }

    let message = ""

    if (table === 'orders') {
      message = `📦 มียอดสั่งซื้อใหม่! 📦\n` +
        `------------------------\n` +
        `👤 ชื่อลูกค้า: ${record.customer_name}\n` +
        `📞 เบอร์โทร: ${record.customer_phone}\n` +
        `🏠 ที่อยู่: ${record.customer_address}\n` +
        `💳 วิธีชำระเงิน: ${record.payment_method}\n` +
        `------------------------\n` +
        `🛒 รายการสินค้า:\n`;
      
      if (Array.isArray(record.items)) {
        record.items.forEach((item: any, index: number) => {
          message += `${index + 1}. ${item.name} (${item.style}) - ฿${item.price}\n`;
        });
      }
      
      message += `------------------------\n` +
        `💰 ยอดชำระรวม: ฿${record.total_price}`;

    } else if (table === 'feedback') {
      message = `💬 มีความคิดเห็นใหม่จากลูกค้า! 💬\n` +
        `------------------------\n` +
        `👤 ชื่อ: ${record.customer_name || 'ไม่ระบุ'}\n` +
        `⭐ คะแนน: ${'★'.repeat(record.rating)}${'☆'.repeat(5 - record.rating)} (${record.rating}/5)\n` +
        `------------------------\n` +
        `📝 ข้อความ:\n${record.content}\n` +
        `------------------------`;
    }

    if (message) {
      const res = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          to: LINE_USER_ID,
          messages: [
            {
              type: 'text',
              text: message
            }
          ]
        })
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("LINE API Error:", errorText)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    })
  } catch (error) {
    console.error("Function Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400
    })
  }
})
