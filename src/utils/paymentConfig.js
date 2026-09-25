/**
 * Payment & Store Configuration
 * Configurable via environment variables or default shop parameters.
 */

export const paymentConfig = {
    // PromptPay Configuration
    promptPayId: import.meta.env.VITE_PROMPTPAY_ID || '0923464011',
    promptPayName: import.meta.env.VITE_PROMPTPAY_NAME || 'รุ่งฤดี แซ่เฮอ (VyLash)',

    // Bank Account Transfer Configuration
    bankName: import.meta.env.VITE_BANK_NAME || 'พร้อมเพย์ / PromptPay',
    bankAccountNo: import.meta.env.VITE_BANK_ACCOUNT_NO || '092-346-4011',
    bankAccountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || 'รุ่งฤดี แซ่เฮอ',

    // LINE Official Account / Support Contact
    lineOaUrl: import.meta.env.VITE_LINE_OA_URL || 'https://line.me/R/ti/p/@974xmrmn',
    lineId: import.meta.env.VITE_LINE_ID || '@974xmrmn',

    // Instagram Contact
    instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/vylash.official?stkn=MnVvYWl4cmNtc3Y4',
    instagramHandle: import.meta.env.VITE_INSTAGRAM_HANDLE || '@vylash.official',

    // Order reference prefix
    orderPrefix: 'VY',

    // Webhook URL (Google Apps Script / Vercel API for Google Sheets & LINE Notify)
    orderWebhookUrl: import.meta.env.VITE_ORDER_WEBHOOK_URL || ''
};

export default paymentConfig;
