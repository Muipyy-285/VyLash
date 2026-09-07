import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
    ArrowLeft, 
    CheckCircle, 
    Copy, 
    Check, 
    QrCode, 
    Download, 
    UploadCloud, 
    Building2, 
    Clock, 
    FileText, 
    MessageCircle, 
    ExternalLink,
    ShieldCheck,
    Truck
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { generatePromptPayPayload } from '../utils/promptPay';
import paymentConfig from '../utils/paymentConfig';
import { supabase } from '../utils/supabaseClient';

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    // Step state: 'shipping' | 'payment' | 'confirmed'
    const [currentStep, setCurrentStep] = useState('shipping');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);

    // Form inputs
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        note: '',
        paymentMethod: 'promptpay' // 'promptpay' | 'bank' | 'cod'
    });

    // Active order information
    const [orderInfo, setOrderInfo] = useState(null);

    // Slip upload state
    const [slipImage, setSlipImage] = useState(null);
    const fileInputRef = useRef(null);

    // 15-minute countdown timer for payment screen
    const [timeLeft, setTimeLeft] = useState(15 * 60);

    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

    // Countdown effect during payment step
    useEffect(() => {
        if (currentStep !== 'payment') return;
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [currentStep]);

    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Step 1 -> Step 2: Validate shipping info & generate order
    const handleProceedToPayment = (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
            alert('กรุณากรอกข้อมูลชื่อ เบอร์โทรศัพท์ และที่อยู่จัดส่งให้ครบถ้วน');
            return;
        }

        const now = new Date();
        const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        const orderId = `${paymentConfig.orderPrefix}-${datePart}-${randomPart}`;

        const newOrder = {
            id: orderId,
            customer: {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                note: formData.note.trim()
            },
            items: [...cartItems],
            totalPrice,
            paymentMethod: formData.paymentMethod,
            status: formData.paymentMethod === 'cod' ? 'pending_delivery' : 'waiting_verification',
            createdAt: now.toISOString()
        };

        setOrderInfo(newOrder);

        if (formData.paymentMethod === 'cod') {
            // For COD, finalize order directly
            finalizeOrder(newOrder, null);
        } else {
            // Move to Payment channel
            setCurrentStep('payment');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Handle slip image upload & preview
    const handleSlipUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('กรุณาอัปโหลดไฟล์รูปภาพสลิป (PNG, JPG, JPEG)');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setSlipImage({
                file,
                previewUrl: reader.result,
                name: file.name
            });
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveSlip = () => {
        setSlipImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Copy to clipboard helper
    const handleCopy = (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Download PromptPay QR Code as an image for phone banking app scanning
    const handleDownloadQr = () => {
        const svg = document.getElementById('promptpay-qr-svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const padding = 40;
            canvas.width = image.width + padding * 2;
            canvas.height = image.height + padding * 2 + 60;
            const ctx = canvas.getContext('2d');

            // White background
            ctx.fillStyle = '#ffffff';
            ctx.roundRect ? ctx.roundRect(0, 0, canvas.width, canvas.height, 20) : ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fill();

            // Title
            ctx.fillStyle = '#1e3a8a';
            ctx.font = 'bold 20px "Kanit", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('PromptPay QR Code - VyLash', canvas.width / 2, 35);

            // Draw QR
            ctx.drawImage(image, padding, 50);

            // Amount footer
            ctx.fillStyle = '#e11d48';
            ctx.font = 'bold 22px "Kanit", sans-serif';
            ctx.fillText(`฿${orderInfo ? orderInfo.totalPrice.toLocaleString() : totalPrice.toLocaleString()}`, canvas.width / 2, canvas.height - 20);

            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `PromptPay-VyLash-${orderInfo ? orderInfo.id : 'order'}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(blobURL);
        };
        image.src = blobURL;
    };

    // Finalize order, save to localStorage & attempt Supabase sync
    const finalizeOrder = async (orderToSave, slip) => {
        setIsSubmitting(true);

        const completeOrder = {
            ...orderToSave,
            hasSlip: Boolean(slip),
            slipName: slip ? slip.name : null,
            confirmedAt: new Date().toISOString()
        };

        // 1. Fail-safe persistence to localStorage (guarantees order is never lost on GitHub Pages)
        try {
            const existingOrders = JSON.parse(localStorage.getItem('vylash_orders') || '[]');
            existingOrders.unshift(completeOrder);
            localStorage.setItem('vylash_orders', JSON.stringify(existingOrders));
        } catch (err) {
            console.warn('Could not save to localStorage:', err);
        }

        // 2. Background attempt to insert to Supabase if configured (fails gracefully without blocking user)
        if (supabase) {
            try {
                const supabaseOrderData = {
                    customer_name: completeOrder.customer.name,
                    customer_phone: completeOrder.customer.phone,
                    customer_address: completeOrder.customer.address,
                    payment_method: completeOrder.paymentMethod,
                    items: completeOrder.items,
                    total_price: completeOrder.totalPrice,
                    status: completeOrder.status,
                    created_at: completeOrder.createdAt
                };
                // Fire and forget without blocking confirmation
                supabase.from('orders').insert([supabaseOrderData]).then(({ error }) => {
                    if (error) {
                        console.warn('Background Supabase Sync Notice:', error.message);
                    } else {
                        console.log('Order synced to Supabase successfully');
                    }
                }).catch(err => {
                    console.warn('Background Supabase connection skipped:', err.message);
                });
            } catch (err) {
                console.warn('Supabase client skip:', err);
            }
        }

        // 3. Send automated order notification to Webhook (Google Sheets + LINE Notify)
        const webhookUrl = paymentConfig.orderWebhookUrl;
        if (webhookUrl) {
            try {
                const webhookPayload = {
                    orderId: completeOrder.id,
                    customer: completeOrder.customer,
                    items: completeOrder.items,
                    totalPrice: completeOrder.totalPrice,
                    paymentMethod: completeOrder.paymentMethod,
                    status: completeOrder.status,
                    createdAt: completeOrder.createdAt,
                    slipBase64: slip ? slip.previewUrl : null,
                    slipName: slip ? slip.name : null
                };

                fetch(webhookUrl, {
                    method: 'POST',
                    mode: 'no-cors', // Enables seamless communication with Google Apps Script Web Apps
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(webhookPayload)
                }).then(() => {
                    console.log('Order sent to notification webhook successfully');
                }).catch(err => {
                    console.warn('Webhook notification dispatch notice:', err);
                });
            } catch (err) {
                console.warn('Webhook dispatch skipped:', err);
            }
        }

        // 4. Clear shopping cart & switch to Confirmed view
        clearCart();
        setOrderInfo(completeOrder);
        setCurrentStep('confirmed');
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleConfirmPayment = (e) => {
        e.preventDefault();
        if (!orderInfo) return;
        finalizeOrder(orderInfo, slipImage);
    };

    // Generate formatted LINE message for one-click notification
    const getLineShareUrl = () => {
        if (!orderInfo) return '#';
        const itemsText = orderInfo.items
            .map((item, idx) => `${idx + 1}. ${item.name} (${item.style}) - ฿${item.price}`)
            .join('\n');

        const message = 
`📦 แจ้งคำสั่งซื้อและชำระเงิน VyLash 📦
รหัสคำสั่งซื้อ: #${orderInfo.id}
------------------------
👤 ชื่อลูกค้า: ${orderInfo.customer.name}
📞 เบอร์โทร: ${orderInfo.customer.phone}
🏠 ที่อยู่จัดส่ง: ${orderInfo.customer.address}
${orderInfo.customer.note ? `📝 หมายเหตุ: ${orderInfo.customer.note}\n` : ''}------------------------
🛒 รายการสินค้า:
${itemsText}
------------------------
💰 ยอดชำระ: ฿${orderInfo.totalPrice.toLocaleString()} บาท
💳 ช่องทางชำระเงิน: ${orderInfo.paymentMethod === 'promptpay' ? 'พร้อมเพย์ QR Code' : orderInfo.paymentMethod === 'bank' ? 'โอนเงินผ่านบัญชีธนาคาร' : 'เก็บเงินปลายทาง (COD)'}
📌 สถานะ: ${slipImage ? 'แนบสลิปเรียบร้อยแล้ว' : 'แจ้งชำระเงินแล้ว'}`;

        return `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
    };

    // Empty Cart guard (only on shipping step)
    if (cartItems.length === 0 && currentStep === 'shipping') {
        return (
            <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px', textAlign: 'center' }}>
                <div style={{ marginBottom: '1.5rem', color: 'var(--color-pink-500)' }}>
                    <QrCode size={64} />
                </div>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>ตะกร้าสินค้าว่างเปล่า (Your Cart is Empty)</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    คุณยังไม่มีสินค้าในตะกร้า เลือกชมขนตาแม่เหล็กสไตล์ต่างๆ ได้เลย
                </p>
                <button className="btn-primary" onClick={() => navigate('/shop')}>
                    ไปที่หน้าร้านค้า (Browse Shop)
                </button>
            </div>
        );
    }

    // Dynamic PromptPay payload
    const effectiveAmount = orderInfo ? orderInfo.totalPrice : totalPrice;
    const promptPayPayload = generatePromptPayPayload(paymentConfig.promptPayId, effectiveAmount);

    return (
        <div className="container checkout-page" style={{ paddingTop: '110px', paddingBottom: '70px' }}>
            {/* Step Progress Bar */}
            <div className="step-progress-wrapper">
                <div className={`step-item ${currentStep === 'shipping' ? 'active' : 'completed'}`}>
                    <div className="step-circle">{currentStep !== 'shipping' ? <Check size={16} /> : '1'}</div>
                    <span className="step-text">ที่อยู่จัดส่ง</span>
                </div>
                <div className={`step-line ${currentStep !== 'shipping' ? 'active' : ''}`}></div>
                <div className={`step-item ${currentStep === 'payment' ? 'active' : currentStep === 'confirmed' ? 'completed' : ''}`}>
                    <div className="step-circle">{currentStep === 'confirmed' ? <Check size={16} /> : '2'}</div>
                    <span className="step-text">ชำระเงิน (QR Code)</span>
                </div>
                <div className={`step-line ${currentStep === 'confirmed' ? 'active' : ''}`}></div>
                <div className={`step-item ${currentStep === 'confirmed' ? 'active completed' : ''}`}>
                    <div className="step-circle">3</div>
                    <span className="step-text">ยืนยันสำเร็จ</span>
                </div>
            </div>

            {/* ----------------- STEP 1: SHIPPING & PAYMENT SELECTION ----------------- */}
            {currentStep === 'shipping' && (
                <>
                    <button
                        onClick={() => navigate('/cart')}
                        className="back-link"
                    >
                        <ArrowLeft size={18} /> ย้อนกลับไปตะกร้าสินค้า
                    </button>

                    <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>เช็คเอาท์และสั่งซื้อ (Checkout)</h1>

                    <div className="checkout-grid">
                        {/* Left Column: Form */}
                        <div className="glass-panel" style={{ padding: '2.2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <Truck size={20} color="var(--color-pink-500)" /> ข้อมูลการจัดส่ง (Shipping Details)
                            </h3>

                            <form id="checkout-shipping-form" onSubmit={handleProceedToPayment}>
                                <div className="form-group">
                                    <label>ชื่อ-นามสกุล ผู้รับ <span style={{ color: '#e11d48' }}>*</span></label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        placeholder="เช่น นภาพร ใจดี" 
                                        required 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>เบอร์โทรศัพท์ติดต่อ <span style={{ color: '#e11d48' }}>*</span></label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleInputChange} 
                                        placeholder="เช่น 0812345678" 
                                        required 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>ที่อยู่จัดส่งพัสดุ <span style={{ color: '#e11d48' }}>*</span></label>
                                    <textarea 
                                        name="address" 
                                        value={formData.address} 
                                        onChange={handleInputChange} 
                                        rows="3" 
                                        placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์" 
                                        required 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>หมายเหตุเพิ่มเติม (ถ้ามี)</label>
                                    <input 
                                        type="text" 
                                        name="note" 
                                        value={formData.note} 
                                        onChange={handleInputChange} 
                                        placeholder="เช่น ฝากไว้กับป้อมยาม, โทรแจ้งก่อนส่ง" 
                                    />
                                </div>

                                <h3 style={{ marginTop: '2.5rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <QrCode size={20} color="var(--color-pink-500)" /> เลือกช่องทางการชำระเงิน
                                </h3>

                                <div className="payment-options-grid">
                                    <label className={`payment-option-card ${formData.paymentMethod === 'promptpay' ? 'selected' : ''}`}>
                                        <div className="payment-card-header">
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value="promptpay" 
                                                checked={formData.paymentMethod === 'promptpay'} 
                                                onChange={handleInputChange} 
                                            />
                                            <span className="payment-title">📱 สแกน QR Code พร้อมเพย์</span>
                                            <span className="badge-recommend">แนะนำ</span>
                                        </div>
                                        <p className="payment-desc">
                                            สแกนจ่ายได้ทุกแอปธนาคารไทย (K PLUS, SCB, Krungthai ฯลฯ) ยอดเงินตรงทันที
                                        </p>
                                    </label>

                                    <label className={`payment-option-card ${formData.paymentMethod === 'bank' ? 'selected' : ''}`}>
                                        <div className="payment-card-header">
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value="bank" 
                                                checked={formData.paymentMethod === 'bank'} 
                                                onChange={handleInputChange} 
                                            />
                                            <span className="payment-title">🏦 โอนผ่านบัญชีธนาคาร</span>
                                        </div>
                                        <p className="payment-desc">
                                            โอนผ่านเลขบัญชีธนาคารกสิกรไทย แล้วแนบสลิปยืนยัน
                                        </p>
                                    </label>

                                    <label className={`payment-option-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                                        <div className="payment-card-header">
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value="cod" 
                                                checked={formData.paymentMethod === 'cod'} 
                                                onChange={handleInputChange} 
                                            />
                                            <span className="payment-title">📦 เก็บเงินปลายทาง (COD)</span>
                                        </div>
                                        <p className="payment-desc">
                                            ชำระเงินสดกับเจ้าหน้าที่จัดส่งเมื่อพัสดุถึงบ้านคุณ
                                        </p>
                                    </label>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn-primary" 
                                    style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.05rem' }}
                                >
                                    {formData.paymentMethod === 'cod' ? 'ยืนยันการสั่งซื้อ (ชำระเงินปลายทาง)' : 'ไปที่หน้าชำระเงิน (Proceed to Payment) →'}
                                </button>
                            </form>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div>
                            <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                                    สรุปรายการสั่งซื้อ
                                </h3>

                                <div style={{ maxHeight: '320px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '5px' }}>
                                    {cartItems.map((item, index) => (
                                        <div key={`${item.id}-${index}`} className="summary-item">
                                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                                {item.image && (
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name} 
                                                        style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '6px', background: 'rgba(255,255,255,0.8)' }} 
                                                    />
                                                )}
                                                <div>
                                                    <div style={{ fontSize: '0.92rem', fontWeight: '600' }}>{item.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>สไตล์ {item.style}</div>
                                                </div>
                                            </div>
                                            <div style={{ color: 'var(--color-pink-500)', fontWeight: '600' }}>
                                                ฿{item.price}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="summary-row">
                                    <span>ยอดรวมสินค้า</span>
                                    <span>฿{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>ค่าจัดส่ง (Standard Delivery)</span>
                                    <span style={{ color: '#16a34a', fontWeight: '600' }}>ส่งฟรีทั่วประเทศ</span>
                                </div>
                                <div className="summary-total">
                                    <span>ยอดสุทธิที่ต้องชำระ</span>
                                    <span style={{ color: 'var(--color-pink-500)' }}>฿{totalPrice.toLocaleString()}</span>
                                </div>

                                <div className="security-notice">
                                    <ShieldCheck size={18} color="#16a34a" />
                                    <span>ชำระเงินปลอดภัย สแกนตรงผ่านบัญชีร้านค้า VyLash</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ----------------- STEP 2: INTERACTIVE PAYMENT CHANNEL ----------------- */}
            {currentStep === 'payment' && orderInfo && (
                <div className="payment-channel-container">
                    <button 
                        onClick={() => setCurrentStep('shipping')}
                        className="back-link"
                    >
                        <ArrowLeft size={18} /> ย้อนกลับไปแก้ไขข้อมูลจัดส่ง
                    </button>

                    <div className="payment-header-card glass-panel">
                        <div className="payment-header-info">
                            <span className="order-id-badge">รหัสคำสั่งซื้อ #{orderInfo.id}</span>
                            <h2 style={{ fontSize: '1.6rem', marginTop: '0.5rem', marginBottom: '0.3rem' }}>
                                ช่องทางการชำระเงิน (Payment Channel)
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                ลูกค้า: <strong>{orderInfo.customer.name}</strong> ({orderInfo.customer.phone})
                            </p>
                        </div>
                        <div className="payment-amount-box">
                            <span className="amount-label">ยอดที่ต้องชำระทั้งสิ้น</span>
                            <span className="amount-value">฿{orderInfo.totalPrice.toLocaleString()}</span>
                            <div className="timer-pill">
                                <Clock size={14} /> ชำระภายใน {formatTimer(timeLeft)} นาที
                            </div>
                        </div>
                    </div>

                    <div className="payment-content-grid">
                        {/* Payment Method Details (PromptPay / Bank) */}
                        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                            {orderInfo.paymentMethod === 'promptpay' ? (
                                <div className="promptpay-section">
                                    <div className="promptpay-badge">
                                        <span style={{ color: '#00427A', fontWeight: 'bold' }}>Prompt</span>
                                        <span style={{ color: '#0085CA', fontWeight: 'bold' }}>Pay</span>
                                        <span style={{ fontSize: '0.8rem', marginLeft: '6px', color: '#666' }}>พร้อมเพย์</span>
                                    </div>

                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
                                        เปิดแอปธนาคารของคุณ แล้วสแกน QR Code ด้านล่างเพื่อชำระเงินได้ทันที
                                    </p>

                                    {/* Real EMVCo PromptPay QR Code */}
                                    <div className="qr-card-wrapper">
                                        <div className="qr-box">
                                            <QRCodeSVG 
                                                id="promptpay-qr-svg"
                                                value={promptPayPayload}
                                                size={220}
                                                level="M"
                                                includeMargin={true}
                                            />
                                        </div>

                                        <div className="qr-amount-tag">
                                            ฿{orderInfo.totalPrice.toLocaleString()} บาท
                                        </div>
                                    </div>

                                    {/* Action to Save / Download QR */}
                                    <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'center', gap: '0.8rem' }}>
                                        <button 
                                            type="button" 
                                            onClick={handleDownloadQr}
                                            className="action-btn-outline"
                                        >
                                            <Download size={16} /> บันทึกภาพ QR Code (Save QR)
                                        </button>
                                    </div>

                                    <div className="account-details-box">
                                        <div className="account-row">
                                            <span className="label">ชื่อบัญชีผู้รับ:</span>
                                            <span className="value"><strong>{paymentConfig.promptPayName}</strong></span>
                                        </div>
                                        <div className="account-row">
                                            <span className="label">หมายเลขพร้อมเพย์:</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span className="value-code">{paymentConfig.promptPayId}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleCopy(paymentConfig.promptPayId)}
                                                    className="copy-btn"
                                                    title="คัดลอกหมายเลขพร้อมเพย์"
                                                >
                                                    {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bank-section">
                                    <div style={{ marginBottom: '1.5rem', color: 'var(--color-pink-500)' }}>
                                        <Building2 size={54} />
                                    </div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>โอนเงินผ่านบัญชีธนาคาร</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                        กรุณาโอนเงินยอด <strong>฿{orderInfo.totalPrice.toLocaleString()}</strong> เข้าบัญชีด้านล่าง:
                                    </p>

                                    <div className="bank-card">
                                        <div className="bank-name">{paymentConfig.bankName}</div>
                                        <div className="bank-acc-row">
                                            <span className="bank-acc-no">{paymentConfig.bankAccountNo}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => handleCopy(paymentConfig.bankAccountNo)}
                                                className="copy-btn"
                                                title="คัดลอกเลขบัญชี"
                                            >
                                                {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                        <div className="bank-acc-name">ชื่อบัญชี: {paymentConfig.bankAccountName}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Slip Upload & Confirmation Form */}
                        <div className="glass-panel" style={{ padding: '2.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <UploadCloud size={22} color="var(--color-pink-500)" /> แนบสลิปหลักฐานการโอนเงิน
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                เมื่อโอนเงินเรียบร้อยแล้ว แนบสลิปการโอนเงินเพื่อการจัดส่งที่รวดเร็วยิ่งขึ้น
                            </p>

                            <div 
                                className={`slip-dropzone ${slipImage ? 'has-file' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleSlipUpload} 
                                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                                    style={{ display: 'none' }} 
                                />

                                {slipImage ? (
                                    <div className="slip-preview-box">
                                        <img src={slipImage.previewUrl} alt="Slip preview" className="slip-thumbnail" />
                                        <div className="slip-meta">
                                            <span className="slip-filename">{slipImage.name}</span>
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.stopPropagation(); handleRemoveSlip(); }}
                                                className="remove-slip-btn"
                                            >
                                                เปลี่ยนรูปภาพ (Change)
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="dropzone-empty">
                                        <UploadCloud size={40} color="var(--color-pink-500)" style={{ margin: '0 auto 0.8rem' }} />
                                        <p style={{ fontWeight: '600', marginBottom: '0.2rem' }}>คลิกเพื่ออัปโหลดสลิปการโอนเงิน</p>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>รองรับไฟล์ JPG, PNG</span>
                                    </div>
                                )}
                            </div>

                            <div className="payment-guarantee">
                                <ShieldCheck size={18} color="#16a34a" />
                                <span>ทางร้านจะเริ่มจัดส่งสินค้าทันทีหลังจากตรวจสอบยอดเงิน (1-2 วันทำการ)</span>
                            </div>

                            <form onSubmit={handleConfirmPayment} style={{ marginTop: '2rem' }}>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className="btn-primary" 
                                    style={{ width: '100%', padding: '1.1rem', fontSize: '1.08rem' }}
                                >
                                    {isSubmitting ? 'กำลังบันทึกคำสั่งซื้อ...' : 'ยืนยันการชำระเงิน (Confirm Payment) ✓'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ----------------- STEP 3: ORDER CONFIRMED & RECEIPT ----------------- */}
            {currentStep === 'confirmed' && orderInfo && (
                <div className="confirmed-view-container">
                    <div className="glass-panel confirmed-card">
                        <div className="success-icon-wrapper">
                            <CheckCircle size={76} color="#16a34a" />
                        </div>
                        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>
                            สั่งซื้อสำเร็จ! ขอบคุณสำหรับการสั่งซื้อ
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
                            คำสั่งซื้อของคุณได้รับการบันทึกเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการจัดส่งขนตาแม่เหล็กให้คุณโดยเร็วที่สุด
                        </p>

                        {/* Complete Order Receipt */}
                        <div className="order-receipt-box">
                            <div className="receipt-header">
                                <div>
                                    <div className="receipt-title">ใบเสร็จรับเงิน / สรุปคำสั่งซื้อ</div>
                                    <div className="receipt-id">รหัส: <strong>#{orderInfo.id}</strong></div>
                                </div>
                                <div className="receipt-status-badge">
                                    {orderInfo.paymentMethod === 'cod' ? 'ชำระเงินปลายทาง' : orderInfo.hasSlip ? 'แนบสลิปแล้ว (รอจัดส่ง)' : 'แจ้งชำระเงินแล้ว'}
                                </div>
                            </div>

                            <div className="receipt-info-grid">
                                <div>
                                    <span className="info-label">ข้อมูลผู้สั่งซื้อ:</span>
                                    <div className="info-val">{orderInfo.customer.name}</div>
                                    <div className="info-val">{orderInfo.customer.phone}</div>
                                </div>
                                <div>
                                    <span className="info-label">ที่อยู่สำหรับจัดส่ง:</span>
                                    <div className="info-val">{orderInfo.customer.address}</div>
                                </div>
                            </div>

                            <div className="receipt-items-table">
                                <div className="table-heading">
                                    <span>รายการสินค้า</span>
                                    <span>ราคา</span>
                                </div>
                                {orderInfo.items.map((item, idx) => (
                                    <div key={idx} className="table-row">
                                        <span>{item.name} ({item.style})</span>
                                        <span>฿{item.price}</span>
                                    </div>
                                ))}
                                <div className="table-total-row">
                                    <span>ยอดชำระสุทธิ (ส่งฟรี)</span>
                                    <span className="total-highlight">฿{orderInfo.totalPrice.toLocaleString()} บาท</span>
                                </div>
                            </div>
                        </div>

                        {/* LINE OA Notification / Share Button */}
                        <div className="line-notify-banner">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textAlign: 'left' }}>
                                <div className="line-icon-box">
                                    <MessageCircle size={28} color="#ffffff" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '1rem', color: '#06c755' }}>
                                        แจ้งเตือนคำสั่งซื้อไปยัง LINE ร้านค้า
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        ส่งสลิปหรือรายละเอียดออเดอร์เข้า LINE ของแอดมิน เพื่อความรวดเร็วในการจัดส่ง
                                    </div>
                                </div>
                            </div>

                            <a 
                                href={getLineShareUrl()} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="line-action-btn"
                            >
                                แจ้งทาง LINE ทันที <ExternalLink size={16} />
                            </a>
                        </div>

                        <div className="confirmed-actions-row">
                            <button 
                                onClick={() => window.print()} 
                                className="action-btn-outline"
                            >
                                <FileText size={18} /> พิมพ์ใบเสร็จ (Print Receipt)
                            </button>
                            <button 
                                onClick={() => navigate('/shop')} 
                                className="btn-primary"
                                style={{ padding: '0.85rem 2rem' }}
                            >
                                ช้อปปิ้งสินค้าต่อ (Continue Shopping)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .checkout-page {
                    max-width: 1050px;
                    margin: 0 auto;
                }

                .back-link {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    margin-bottom: 1.5rem;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.95rem;
                    transition: color 0.2s ease;
                }
                .back-link:hover {
                    color: var(--color-pink-500);
                }

                /* Step Progress Bar */
                .step-progress-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2.5rem;
                    padding: 1.2rem;
                    background: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(16px);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-md);
                }
                .step-item {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    font-weight: 500;
                }
                .step-item.active {
                    color: var(--color-pink-500);
                    font-weight: 700;
                }
                .step-item.completed {
                    color: #16a34a;
                }
                .step-circle {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0,0,0,0.06);
                    color: var(--text-muted);
                    font-weight: bold;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                }
                .step-item.active .step-circle {
                    background: var(--color-pink-500);
                    color: white;
                    box-shadow: 0 4px 12px rgba(244, 63, 94, 0.4);
                }
                .step-item.completed .step-circle {
                    background: #16a34a;
                    color: white;
                }
                .step-line {
                    flex: 1;
                    max-width: 80px;
                    height: 2px;
                    background: rgba(0,0,0,0.1);
                    margin: 0 1rem;
                    transition: background 0.3s ease;
                }
                .step-line.active {
                    background: var(--color-pink-500);
                }

                /* Forms */
                .checkout-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 2.5rem;
                }
                .form-group {
                    margin-bottom: 1.2rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.92rem;
                    font-weight: 500;
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 0.85rem 1rem;
                    background: rgba(255, 255, 255, 0.7);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-sm);
                    color: var(--color-black);
                    font-family: inherit;
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }
                .form-group input:focus, .form-group textarea:focus {
                    border-color: var(--color-pink-500);
                    box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.15);
                    background: #ffffff;
                }

                /* Payment Options Selection Cards */
                .payment-options-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .payment-option-card {
                    padding: 1.2rem;
                    background: rgba(255, 255, 255, 0.5);
                    border: 2px solid var(--glass-border);
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: block;
                }
                .payment-option-card:hover {
                    border-color: rgba(244, 63, 94, 0.4);
                    background: rgba(255, 255, 255, 0.85);
                }
                .payment-option-card.selected {
                    border-color: var(--color-pink-500);
                    background: rgba(255, 241, 242, 0.6);
                    box-shadow: 0 4px 15px rgba(244, 63, 94, 0.12);
                }
                .payment-card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    margin-bottom: 0.4rem;
                }
                .payment-title {
                    font-weight: 600;
                    font-size: 1.02rem;
                }
                .badge-recommend {
                    background: var(--color-pink-500);
                    color: white;
                    font-size: 0.7rem;
                    padding: 2px 8px;
                    border-radius: 20px;
                    font-weight: 600;
                }
                .payment-desc {
                    margin: 0;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    padding-left: 1.8rem;
                }

                /* Sidebar Summary */
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.8rem;
                    font-size: 0.95rem;
                    color: var(--text-muted);
                }
                .summary-total {
                    display: flex;
                    justify-content: space-between;
                    margin: 1.5rem 0;
                    padding-top: 1rem;
                    border-top: 1px solid var(--glass-border);
                    font-weight: 700;
                    font-size: 1.3rem;
                }
                .security-notice {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.82rem;
                    color: #16a34a;
                    background: rgba(22, 163, 74, 0.08);
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                }

                /* Step 2: Payment Channel Styles */
                .payment-channel-container {
                    max-width: 950px;
                    margin: 0 auto;
                }
                .payment-header-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.8rem 2.2rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                }
                .order-id-badge {
                    display: inline-block;
                    background: rgba(244, 63, 94, 0.12);
                    color: var(--color-pink-500);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }
                .payment-amount-box {
                    text-align: right;
                }
                .amount-label {
                    display: block;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                }
                .amount-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: var(--color-pink-500);
                }
                .timer-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.82rem;
                    color: #d97706;
                    background: rgba(217, 119, 6, 0.1);
                    padding: 3px 10px;
                    border-radius: 20px;
                    font-weight: 600;
                    margin-top: 0.3rem;
                }
                .payment-content-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
                .promptpay-badge {
                    display: inline-flex;
                    align-items: center;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    padding: 6px 16px;
                    border-radius: 20px;
                    margin-bottom: 0.8rem;
                    font-size: 1.1rem;
                }
                .qr-card-wrapper {
                    display: inline-block;
                    background: #ffffff;
                    padding: 1.5rem;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.06);
                }
                .qr-box {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .qr-amount-tag {
                    margin-top: 0.8rem;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #e11d48;
                }
                .account-details-box {
                    margin-top: 1.8rem;
                    background: rgba(255, 255, 255, 0.6);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-sm);
                    padding: 1rem 1.4rem;
                    text-align: left;
                }
                .account-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                }
                .account-row:not(:last-child) {
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }
                .value-code {
                    font-family: monospace;
                    font-size: 1.05rem;
                    font-weight: 600;
                    color: var(--color-black);
                }
                .copy-btn {
                    background: rgba(0,0,0,0.05);
                    border: none;
                    border-radius: 6px;
                    padding: 5px 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s ease;
                }
                .copy-btn:hover {
                    background: rgba(244, 63, 94, 0.15);
                }

                /* Bank Card */
                .bank-card {
                    background: linear-gradient(135deg, #107c41, #0a5229);
                    color: white;
                    padding: 1.8rem;
                    border-radius: 16px;
                    text-align: left;
                    box-shadow: 0 10px 25px rgba(16, 124, 65, 0.25);
                }
                .bank-name {
                    font-size: 1.15rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                .bank-acc-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.8rem;
                }
                .bank-acc-no {
                    font-size: 1.4rem;
                    font-weight: bold;
                    letter-spacing: 1px;
                }
                .bank-acc-name {
                    font-size: 0.92rem;
                    opacity: 0.9;
                }

                /* Slip Dropzone */
                .slip-dropzone {
                    border: 2px dashed var(--color-pink-400);
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: var(--radius-sm);
                    padding: 1.8rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-bottom: 1.5rem;
                }
                .slip-dropzone:hover {
                    background: rgba(255, 241, 242, 0.8);
                    border-color: var(--color-pink-500);
                }
                .slip-dropzone.has-file {
                    border-style: solid;
                    border-color: #16a34a;
                    background: rgba(240, 253, 244, 0.7);
                }
                .slip-preview-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.8rem;
                }
                .slip-thumbnail {
                    max-height: 180px;
                    max-width: 100%;
                    border-radius: 8px;
                    object-fit: contain;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                .slip-filename {
                    font-size: 0.88rem;
                    font-weight: 500;
                    color: #16a34a;
                }
                .remove-slip-btn {
                    background: none;
                    border: none;
                    color: var(--color-pink-500);
                    text-decoration: underline;
                    cursor: pointer;
                    font-size: 0.82rem;
                }
                .payment-guarantee {
                    display: flex;
                    gap: 0.6rem;
                    align-items: center;
                    font-size: 0.82rem;
                    color: #16a34a;
                    background: rgba(22, 163, 74, 0.08);
                    padding: 0.8rem;
                    border-radius: var(--radius-sm);
                }
                .action-btn-outline {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.65rem 1.2rem;
                    border: 1px solid var(--glass-border);
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 30px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--color-black);
                    transition: all 0.2s ease;
                }
                .action-btn-outline:hover {
                    background: #ffffff;
                    border-color: var(--color-pink-500);
                    color: var(--color-pink-500);
                    box-shadow: 0 4px 12px rgba(244, 63, 94, 0.15);
                }

                /* Step 3: Confirmed View */
                .confirmed-view-container {
                    max-width: 750px;
                    margin: 0 auto;
                }
                .confirmed-card {
                    padding: 3rem 2.5rem;
                    text-align: center;
                }
                .success-icon-wrapper {
                    margin-bottom: 1.5rem;
                    animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes scaleIn {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .order-receipt-box {
                    background: rgba(255, 255, 255, 0.85);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                    padding: 1.8rem;
                    text-align: left;
                    margin-bottom: 2rem;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.04);
                }
                .receipt-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding-bottom: 1.2rem;
                    border-bottom: 1px solid rgba(0,0,0,0.08);
                    margin-bottom: 1.2rem;
                }
                .receipt-title {
                    font-weight: 700;
                    font-size: 1.15rem;
                }
                .receipt-id {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }
                .receipt-status-badge {
                    background: #f0fdf4;
                    color: #16a34a;
                    border: 1px solid #bbf7d0;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.82rem;
                    font-weight: 600;
                }
                .receipt-info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    margin-bottom: 1.2rem;
                    padding-bottom: 1.2rem;
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                }
                .info-label {
                    display: block;
                    font-size: 0.82rem;
                    color: var(--text-muted);
                    margin-bottom: 0.3rem;
                }
                .info-val {
                    font-size: 0.92rem;
                    font-weight: 500;
                }
                .receipt-items-table .table-heading {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    margin-bottom: 0.6rem;
                }
                .receipt-items-table .table-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.92rem;
                    padding: 0.4rem 0;
                }
                .receipt-items-table .table-total-row {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 2px dashed rgba(0,0,0,0.1);
                    font-weight: 700;
                    font-size: 1.1rem;
                }
                .total-highlight {
                    color: var(--color-pink-500);
                    font-size: 1.25rem;
                }
                .line-notify-banner {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #f0fdf4;
                    border: 1px solid #86efac;
                    padding: 1.2rem 1.6rem;
                    border-radius: 14px;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .line-icon-box {
                    width: 44px;
                    height: 44px;
                    background: #06c755;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 10px rgba(6, 199, 85, 0.3);
                }
                .line-action-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #06c755;
                    color: white;
                    padding: 0.75rem 1.4rem;
                    border-radius: 30px;
                    font-weight: 700;
                    font-size: 0.92rem;
                    text-decoration: none;
                    box-shadow: 0 4px 12px rgba(6, 199, 85, 0.3);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .line-action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(6, 199, 85, 0.4);
                }
                .confirmed-actions-row {
                    display: flex;
                    justify-content: center;
                    gap: 1.2rem;
                    flex-wrap: wrap;
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .checkout-grid {
                        grid-template-columns: 1fr;
                    }
                    .payment-content-grid {
                        grid-template-columns: 1fr;
                    }
                    .payment-header-card {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .payment-amount-box {
                        text-align: left;
                    }
                    .receipt-info-grid {
                        grid-template-columns: 1fr;
                    }
                    .line-notify-banner {
                        flex-direction: column;
                        align-items: stretch;
                        text-align: center;
                    }
                    .line-action-btn {
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default Checkout;
