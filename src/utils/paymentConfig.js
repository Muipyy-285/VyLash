/**
 * Payment & Store Configuration
 * Configurable via environment variables or default shop parameters.
 */

export const paymentConfig = {
    // PromptPay Configuration
    promptPayId: import.meta.env.VITE_PROMPTPAY_ID || '0812345678',
    promptPayName: import.meta.env.VITE_PROMPTPAY_NAME || 'VyLash Official (บัญชีร้านค้า)',

    // Bank Account Transfer Configuration
    bankName: import.meta.env.VITE_BANK_NAME || 'ธนาคารกสิกรไทย (KBANK)',
    bankAccountNo: import.meta.env.VITE_BANK_ACCOUNT_NO || '123-4-56789-0',
    bankAccountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || 'VyLash Official',

    // LINE Official Account / Support Contact
    lineOaUrl: import.meta.env.VITE_LINE_OA_URL || 'https://line.me/R/ti/p/@vylash',
    lineId: import.meta.env.VITE_LINE_ID || '@vylash',

    // Order reference prefix
    orderPrefix: 'VY'
};

export default paymentConfig;
