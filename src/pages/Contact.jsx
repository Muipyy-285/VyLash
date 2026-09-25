import React, { useState } from 'react';
import { 
    MessageCircle, 
    Instagram, 
    Send, 
    CheckCircle, 
    Clock, 
    Sparkles, 
    HelpCircle, 
    ChevronDown, 
    ChevronUp, 
    ShieldCheck, 
    Truck,
    ExternalLink
} from 'lucide-react';
import paymentConfig from '../utils/paymentConfig';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        topic: 'ปรึกษาเลือกทรงขนตา',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // FAQ Accordion state
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const webhookUrl = paymentConfig.orderWebhookUrl;

        if (webhookUrl) {
            try {
                const payload = {
                    type: 'contact',
                    name: formData.name,
                    contact: formData.contact,
                    topic: formData.topic,
                    message: formData.message,
                    createdAt: new Date().toISOString()
                };

                await fetch(webhookUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                console.warn('Webhook dispatch skipped:', err);
            }
        }

        setIsSubmitted(true);
        setIsSubmitting(false);
    };

    const faqs = [
        {
            q: "ขนตาแม่เหล็ก VyLash ต้องใช้กาวไหม และติดยากไหม?",
            a: "ไม่ต้องใช้กาวติดขนตาเลยแม้แต่น้อยครับ! ขนตาของ VyLash ใช้เทคโนโลยีแม่เหล็กอณูละเอียดรุ่นใหม่ ติดประกบกับขนตาจริงได้ง่ายในไม่กี่วินาที ไม่เลอะเทอะ ไม่เหนียวเหนอะหนะ และไม่ทำลายขนตาจริงครับ"
        },
        {
            q: "ขนตาแม่เหล็ก 1 คู่ สามารถใช้ซ้ำได้กี่ครั้ง?",
            a: "ขนตาของ VyLash ผลิตจากวัสดุเส้นไหมสังเคราะห์เกรดพรีเมียม สามารถนำกลับมาใช้ซ้ำได้มากถึง 30 - 50 ครั้งขึ้นไป เพียงเก็บใส่ตลับกล่องหลังจากใช้งานเสร็จครับ"
        },
        {
            q: "กันน้ำ กันเหงื่อ และลมแรงได้ไหม?",
            a: "กันน้ำและกันเหงื่อได้ 100% ครับ พลังแม่เหล็กยึดเกาะแน่นเป็นพิเศษ โดนลมพัดแรง หรือเหงื่อออกจากการออกกำลังกายก็ไม่หลุดแน่นอนครับ"
        },
        {
            q: "ค่าจัดส่งเท่าไหร่ และใช้เวลากี่วันได้รับสินค้า?",
            a: "ทางร้านจัดส่งฟรีทั่วประเทศแบบด่วน (Standard Delivery) ไม่มีขั้นต่ำ! จัดส่งพัสดุทุกวัน ใช้เวลาจัดส่งเพียง 1 - 2 วันทำการถึงหน้าบ้านคุณครับ"
        }
    ];

    return (
        <div className="container contact-page" style={{ paddingTop: '120px', paddingBottom: '70px' }}>
            {/* Header Title */}
            <div className="contact-header text-center">
                <div className="section-badge">
                    <Sparkles size={14} /> {t.contact.badge}
                </div>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>
                    {t.contact.title}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto' }}>
                    {t.contact.subtitle}
                </p>
            </div>

            {/* Main Contact Grid */}
            <div className="contact-grid">
                {/* Left Column: Direct Contact Cards */}
                <div className="direct-channels-column">
                    {/* LINE Card */}
                    <div className="glass-panel contact-card line-card">
                        <div className="card-top">
                            <div className="icon-badge line-icon">
                                <MessageCircle size={28} color="#ffffff" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>LINE Official</h3>
                                <span className="channel-handle">{paymentConfig.lineId}</span>
                            </div>
                        </div>
                        <p className="card-desc">
                            {t.home.lineDesc}
                        </p>
                        <a 
                            href={paymentConfig.lineOaUrl}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-channel line-btn"
                        >
                            <span>{t.home.lineBtn}</span>
                            <ExternalLink size={16} />
                        </a>
                        <div className="response-time">
                            <Clock size={13} /> {t.contact.serviceHoursTitle}
                        </div>
                    </div>

                    {/* Instagram Card */}
                    <div className="glass-panel contact-card ig-card">
                        <div className="card-top">
                            <div className="icon-badge ig-icon">
                                <Instagram size={26} color="#ffffff" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>Instagram</h3>
                                <span className="channel-handle">{paymentConfig.instagramHandle}</span>
                            </div>
                        </div>
                        <p className="card-desc">
                            {t.home.igDesc}
                        </p>
                        <a 
                            href={paymentConfig.instagramUrl}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-channel ig-btn"
                        >
                            <span>{t.home.igBtn}</span>
                            <ExternalLink size={16} />
                        </a>
                    </div>

                    {/* Store Info Banner */}
                    <div className="glass-panel info-banner">
                        <div className="info-item">
                            <Clock size={20} color="var(--color-pink-500)" />
                            <div>
                                <div className="info-title">{t.contact.serviceHoursTitle}</div>
                                <div className="info-text">{t.contact.serviceHoursText}</div>
                            </div>
                        </div>
                        <div className="info-item">
                            <Truck size={20} color="#16a34a" />
                            <div>
                                <div className="info-title">{t.contact.fastShippingTitle}</div>
                                <div className="info-text">{t.contact.fastShippingText}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Contact Message Form */}
                <div className="glass-panel form-card">
                    {isSubmitted ? (
                        <div className="form-success-state">
                            <div className="success-icon-box">
                                <CheckCircle size={68} color="#16a34a" />
                            </div>
                            <h2 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>
                                {t.contact.sentSuccessTitle}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                {t.contact.sentSuccessDesc}
                            </p>
                            <button 
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setFormData({ name: '', contact: '', topic: 'ปรึกษาเลือกทรงขนตา', message: '' });
                                }}
                                className="btn-primary"
                            >
                                {t.contact.sendBtn}
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="form-header">
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>
                                    {t.contact.formTitle}
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {t.contact.formSubtitle}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label>{t.contact.yourName} <span style={{ color: '#e11d48' }}>*</span></label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        placeholder="Jane Doe / นภาพร" 
                                        required 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>{t.contact.yourContact} <span style={{ color: '#e11d48' }}>*</span></label>
                                    <input 
                                        type="text" 
                                        name="contact" 
                                        value={formData.contact} 
                                        onChange={handleInputChange} 
                                        placeholder="0812345678 / LINE ID" 
                                        required 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>{t.contact.topic}</label>
                                    <select 
                                        name="topic" 
                                        value={formData.topic} 
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="ปรึกษาเลือกทรงขนตา">👁️ ปรึกษาเลือกทรงขนตา / Lash Style Advice</option>
                                        <option value="สอบถามการจัดส่ง/ติดตามพัสดุ">📦 สอบถามการจัดส่ง / Shipping Tracking</option>
                                        <option value="แจ้งปัญหาการใช้งาน/เคลมสินค้า">⚠️ แจ้งปัญหาการใช้งาน / Claim or Support</option>
                                        <option value="สนใจเป็นตัวแทน/สั่งซื้อราคาส่ง">💼 สนใจสั่งซื้อราคาส่ง / Wholesale</option>
                                        <option value="อื่นๆ">💬 เรื่องอื่นๆ / Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>{t.contact.yourMessage} <span style={{ color: '#e11d48' }}>*</span></label>
                                    <textarea 
                                        name="message" 
                                        value={formData.message} 
                                        onChange={handleInputChange} 
                                        rows="4" 
                                        placeholder="..." 
                                        required 
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className="btn-primary submit-btn"
                                >
                                    {isSubmitting ? (
                                        t.contact.sendingBtn
                                    ) : (
                                        <>
                                            <span>{t.contact.sendBtn}</span>
                                            <Send size={16} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <div className="section-badge">
                        <HelpCircle size={14} /> FAQ
                    </div>
                    <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>
                        คำถามที่พบบ่อย (Frequently Asked Questions)
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>คำตอบสำหรับข้อสงสัยที่ลูกค้ามักถามบ่อยที่สุด</p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`glass-panel faq-item ${openFaq === index ? 'active' : ''}`}
                            onClick={() => toggleFaq(index)}
                        >
                            <div className="faq-question">
                                <span>{faq.q}</span>
                                <div className="faq-toggle-icon">
                                    {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>
                            </div>
                            {openFaq === index && (
                                <div className="faq-answer">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .contact-page {
                    max-width: 1050px;
                    margin: 0 auto;
                }

                .contact-header {
                    margin-bottom: 3rem;
                }

                .section-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(244, 63, 94, 0.12);
                    color: var(--color-pink-500);
                    padding: 4px 14px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    margin-bottom: 0.8rem;
                }

                .contact-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 2.5rem;
                    margin-bottom: 5rem;
                }

                /* Direct Channels Column */
                .direct-channels-column {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .contact-card {
                    padding: 1.8rem;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .contact-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(244, 63, 94, 0.15);
                }

                .card-top {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 0.9rem;
                }

                .icon-badge {
                    width: 50px;
                    height: 50px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .line-icon {
                    background: #06c755;
                    box-shadow: 0 4px 14px rgba(6, 199, 85, 0.4);
                }
                .ig-icon {
                    background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
                    box-shadow: 0 4px 14px rgba(214, 36, 159, 0.4);
                }

                .channel-handle {
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--color-pink-500);
                }

                .card-desc {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    line-height: 1.5;
                    margin-bottom: 1.2rem;
                }

                .btn-channel {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.2rem;
                    border-radius: 25px;
                    font-weight: 700;
                    font-size: 0.92rem;
                    text-decoration: none;
                    color: white;
                    transition: transform 0.2s ease, opacity 0.2s ease;
                }
                .btn-channel:hover {
                    transform: scale(1.02);
                    opacity: 0.95;
                }
                .line-btn {
                    background: #06c755;
                    box-shadow: 0 4px 12px rgba(6, 199, 85, 0.3);
                }
                .ig-btn {
                    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
                    box-shadow: 0 4px 12px rgba(220, 39, 67, 0.3);
                }

                .response-time {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-top: 0.8rem;
                    justify-content: center;
                }

                /* Info Banner */
                .info-banner {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.2rem;
                }
                .info-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.8rem;
                }
                .info-title {
                    font-weight: 600;
                    font-size: 0.92rem;
                    margin-bottom: 2px;
                }
                .info-text {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                }

                /* Form Card */
                .form-card {
                    padding: 2.5rem;
                }
                .form-header {
                    margin-bottom: 1.8rem;
                }
                .contact-form .form-group {
                    margin-bottom: 1.2rem;
                }
                .contact-form label {
                    display: block;
                    font-size: 0.92rem;
                    font-weight: 500;
                    margin-bottom: 0.4rem;
                }
                .contact-form input, 
                .contact-form textarea, 
                .form-select {
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
                .contact-form input:focus, 
                .contact-form textarea:focus,
                .form-select:focus {
                    border-color: var(--color-pink-500);
                    box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.15);
                    background: #ffffff;
                }
                .form-select {
                    cursor: pointer;
                }
                .submit-btn {
                    width: 100%;
                    padding: 1rem;
                    font-size: 1.05rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.6rem;
                    margin-top: 1.5rem;
                }

                .form-success-state {
                    padding: 3rem 1.5rem;
                    text-align: center;
                }
                .success-icon-box {
                    margin-bottom: 1.2rem;
                }

                /* FAQ Section */
                .faq-section {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .faq-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .faq-item {
                    padding: 1.2rem 1.6rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .faq-item:hover {
                    border-color: rgba(244, 63, 94, 0.35);
                    background: rgba(255, 255, 255, 0.85);
                }
                .faq-question {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;
                    font-size: 1.02rem;
                }
                .faq-toggle-icon {
                    color: var(--color-pink-500);
                    flex-shrink: 0;
                    margin-left: 1rem;
                }
                .faq-answer {
                    margin-top: 0.8rem;
                    padding-top: 0.8rem;
                    border-top: 1px solid rgba(0,0,0,0.06);
                    color: var(--text-muted);
                    font-size: 0.93rem;
                    line-height: 1.6;
                }

                @media (max-width: 768px) {
                    .contact-grid {
                        grid-template-columns: 1fr;
                    }
                    .form-card {
                        padding: 1.8rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Contact;
