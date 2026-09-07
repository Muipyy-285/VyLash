/**
 * =========================================================================
 * Google Apps Script for VyLash: Google Sheets Order Storage + LINE Notify
 * =========================================================================
 * 
 * วิธีการติดตั้ง (ใช้เวลาเพียง 2 นาที):
 * 1. ไปที่ https://sheets.new เพื่อสร้าง Google Sheet ใหม่ (ตั้งชื่อว่า "VyLash Orders")
 * 2. ไปที่เมนู "ส่วนขยาย" (Extensions) > "Apps Script"
 * 3. ลบโค้ดเดิมทั้งหมดในไฟล์ Code.gs แล้ววางโค้ดชุดนี้ลงไป
 * 4. กรอก LINE_CHANNEL_ACCESS_TOKEN และ LINE_USER_ID ของคุณด้านล่าง
 * 5. กดปุ่ม "ทำให้ใช้งานได้" (Deploy) > "การทำให้ใช้งานได้รายการใหม่" (New deployment)
 * 6. เลือกประเภท: "เว็บแอป" (Web app)
 *    - คำอธิบาย: VyLash Webhook
 *    - ปฏิบัติการในฐานะ: "ฉัน" (Me)
 *    - ผู้ที่มีสิทธิ์เข้าถึง: "ทุกคน" (Anyone) **สำคัญมาก ต้องเลือก Anyone**
 * 7. กด "ทำให้ใช้งานได้" (Deploy) แล้วคัดลอก "URL เว็บแอป" (Web App URL)
 * 8. นำ URL มาใส่ในไฟล์ .env ในโปรเจกต์:
 *    VITE_ORDER_WEBHOOK_URL=https://script.google.com/macros/s/xxxx/exec
 */

// ---------------------- ตั้งค่า LINE API ----------------------
const LINE_CHANNEL_ACCESS_TOKEN = "4sXVj/SB5iidB4U1LDp4jPwZgZWCUu9BM30DZKX0mIaI04FahQ3VYimMVEKGBI31q6r/hud/KpUvFy2cUBP8z8WwMvbgsUU3Mj8SiYAnWkujgczGgeETNsKQnY4D6lKheWJ0xNTfRvP/O+VCGllGHAdB04t89/1O/w1cDnyilFU=";
const LINE_USER_ID = "U05f8a8498d8e15ca45e00822975af157";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 1. สร้างหัวตารางอัตโนมัติหากยังไม่มี
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "วันที่/เวลา",
        "รหัสคำสั่งซื้อ",
        "ชื่อลูกค้า",
        "เบอร์โทรศัพท์",
        "ที่อยู่จัดส่ง",
        "รายการสินค้า",
        "ยอดชำระ (บาท)",
        "ช่องทางชำระ",
        "สถานะ",
        "ลิงก์สลิปโอนเงิน"
      ]);
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#ffe4e6");
    }

    // 2. แปลงข้อมูล JSON ที่ส่งมาจากหน้าเว็บ
    const data = JSON.parse(e.postData.contents);
    const orderId = data.orderId || "-";
    const customer = data.customer || {};
    const items = data.items || [];
    const totalPrice = data.totalPrice || 0;
    const paymentMethod = data.paymentMethod === 'promptpay' ? 'พร้อมเพย์ (PromptPay)' 
                        : data.paymentMethod === 'bank' ? 'โอนผ่านบัญชีธนาคาร' 
                        : 'เก็บเงินปลายทาง (COD)';
    const status = data.status === 'pending_delivery' ? 'รอจัดส่ง (COD)' : 'รอตรวจสอบยอด/จัดส่ง';
    
    // สรุปรายการสินค้าเป็นข้อความ
    let itemsText = "";
    items.forEach((item, idx) => {
      itemsText += `${idx + 1}. ${item.name} (${item.style}) ฿${item.price}\n`;
    });

    // จัดการไฟล์สลิป (บันทึกลง Google Drive ถ้ามี)
    let slipUrl = "ไม่มีสลิป";
    if (data.slipBase64) {
      try {
        const splitData = data.slipBase64.split(",");
        const contentType = splitData[0].match(/:(.*?);/)[1];
        const bytes = Utilities.base64Decode(splitData[1]);
        const blob = Utilities.newBlob(bytes, contentType, `Slip-${orderId}.png`);
        
        // บันทึกรูปลง Google Drive
        const file = DriveApp.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        slipUrl = file.getUrl();
      } catch (err) {
        slipUrl = "ข้อผิดพลาดบันทึกสลิป: " + err.message;
      }
    }

    // 3. บันทึกแถวใหม่ลง Google Sheet
    const dateFormatted = Utilities.formatDate(new Date(), "Asia/Bangkok", "dd/MM/yyyy HH:mm:ss");
    sheet.appendRow([
      dateFormatted,
      orderId,
      customer.name || "-",
      customer.phone || "-",
      customer.address || "-",
      itemsText.trim(),
      totalPrice,
      paymentMethod,
      status,
      slipUrl
    ]);

    // 4. ส่งแจ้งเตือนเข้า LINE Messaging API หาแอดมิน
    if (LINE_CHANNEL_ACCESS_TOKEN && LINE_USER_ID) {
      let lineText = `📦 มียอดสั่งซื้อใหม่! 📦\n` +
        `รหัส: #${orderId}\n` +
        `------------------------\n` +
        `👤 ชื่อลูกค้า: ${customer.name}\n` +
        `📞 เบอร์โทร: ${customer.phone}\n` +
        `🏠 ที่อยู่: ${customer.address}\n` +
        (customer.note ? `📝 หมายเหตุ: ${customer.note}\n` : '') +
        `💳 วิธีชำระ: ${paymentMethod}\n` +
        `------------------------\n` +
        `🛒 รายการสินค้า:\n${itemsText}` +
        `------------------------\n` +
        `💰 ยอดชำระรวม: ฿${totalPrice.toLocaleString()} บาท\n`;

      if (slipUrl && slipUrl !== "ไม่มีสลิป") {
        lineText += `📎 ดูสลิปโอนเงิน: ${slipUrl}`;
      }

      UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + LINE_CHANNEL_ACCESS_TOKEN
        },
        payload: JSON.stringify({
          to: LINE_USER_ID,
          messages: [{ type: "text", text: lineText }]
        }),
        muteHttpExceptions: true
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", orderId: orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
