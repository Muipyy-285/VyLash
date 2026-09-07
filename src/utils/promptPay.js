/**
 * PromptPay EMVCo QR Code Payload Generator
 * Generates official Bank of Thailand standard QR payload with dynamic amount and CRC-16 checksum.
 */

/**
 * Calculate CRC16-CCITT (polynomial 0x1021, initial value 0xFFFF)
 * Standard checksum used in EMVCo QR codes.
 * @param {string} data - Input string
 * @returns {string} 4-character uppercase hexadecimal checksum
 */
export function crc16(data) {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= (data.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
            } else {
                crc = (crc << 1) & 0xFFFF;
            }
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Helper to build an EMVCo TLV (Tag-Length-Value) field
 * @param {string} tag - 2-digit tag ID
 * @param {string} value - field value
 * @returns {string} Formatted TLV string
 */
function tlv(tag, value) {
    const len = String(value.length).padStart(2, '0');
    return `${tag}${len}${value}`;
}

/**
 * Generates an EMVCo PromptPay QR code string for Thailand PromptPay system.
 * Compatible with all Thai banking apps (K PLUS, SCB EASY, Krungthai NEXT, Bangkok Bank, etc.).
 * 
 * @param {string} target - PromptPay Mobile (e.g. "0812345678") or National ID / Tax ID (13 digits)
 * @param {number|string|null} amount - Exact transaction amount in THB (optional, e.g. 159.00)
 * @returns {string} Complete EMVCo QR Code string
 */
export function generatePromptPayPayload(target, amount = null) {
    if (!target) {
        target = '0812345678';
    }

    const cleaned = target.replace(/[^0-9]/g, '');

    // Tag 01: Mobile number (0066 + 9 digits), Tag 02: National ID / Tax ID (13 digits)
    let targetType = cleaned.length >= 13 ? '02' : '01';
    let formattedTarget = cleaned;

    if (targetType === '01') {
        formattedTarget = '0066' + cleaned.replace(/^0/, '');
    }

    // Tag 29: Merchant Account Information - PromptPay
    // Sub-tag 00: AID "A000000677010111"
    // Sub-tag 01 (Mobile) or 02 (National ID): formatted target
    const aid = tlv('00', 'A000000677010111');
    const targetField = tlv(targetType, formattedTarget);
    const merchantInfo = aid + targetField;
    const tag29 = tlv('29', merchantInfo);

    // Payload format indicator: Tag 00 -> "01"
    const tag00 = tlv('00', '01');

    // Point of Initiation Method: 11 = static, 12 = dynamic (with specific amount)
    const hasAmount = amount !== null && amount !== undefined && Number(amount) > 0;
    const tag01 = tlv('01', hasAmount ? '12' : '11');

    // Country Code: Tag 58 -> "TH"
    const tag58 = tlv('58', 'TH');

    // Transaction Currency: Tag 53 -> "764" (THB)
    const tag53 = tlv('53', '764');

    let payload = tag00 + tag01 + tag29 + tag58 + tag53;

    // Transaction Amount: Tag 54 -> formatted amount (e.g. "159.00")
    if (hasAmount) {
        const amtStr = Number(amount).toFixed(2);
        payload += tlv('54', amtStr);
    }

    // Checksum: Tag 63 -> 04 + CRC-16
    payload += '6304';
    const checksum = crc16(payload);

    return payload + checksum;
}
