// Available coupon codes for VyLash store
export const coupons = [
    {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        description: '10% off your order'
    },
    {
        code: 'SAVE50',
        type: 'fixed',
        value: 50,
        description: '฿50 off your order'
    },
    {
        code: 'VYLASH20',
        type: 'percentage',
        value: 20,
        description: '20% off your order'
    }
];

// Validate and find coupon by code
export const findCoupon = (code) => {
    return coupons.find(coupon => coupon.code.toUpperCase() === code.toUpperCase());
};

// Calculate discount amount based on coupon type
export const calculateDiscount = (coupon, subtotal) => {
    if (!coupon) return 0;

    if (coupon.type === 'percentage') {
        return Math.round(subtotal * (coupon.value / 100));
    } else if (coupon.type === 'fixed') {
        return Math.min(coupon.value, subtotal); // Don't exceed subtotal
    }

    return 0;
};
