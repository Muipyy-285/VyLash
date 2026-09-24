import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock order processing
        setTimeout(() => {
            setIsOrderPlaced(true);
            clearCart();
        }, 1500);
    };

    if (cartItems.length === 0 && !isOrderPlaced) {
        return (
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                <h2 className="text-gradient">Your cart is empty</h2>
                <button className="btn-primary" onClick={() => navigate('/shop')} style={{ marginTop: '1rem' }}>
                    Continue Shopping
                </button>
            </div>
        );
    }

    if (isOrderPlaced) {
        return (
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem', color: 'var(--color-pink-500)' }}>
                    <CheckCircle size={80} />
                </div>
                <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>Order Confirmed!</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Thank you for your purchase. We've sent a confirmation email to you.
                </p>
                <button className="btn-primary" onClick={() => navigate('/shop')}>
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '50px' }}>
            <button
                onClick={() => navigate('/cart')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    marginBottom: '2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                <ArrowLeft size={18} /> Back to Cart
            </button>

            <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>Checkout</h1>

            <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                {/* Shipping & Payment Form */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Shipping Details</h3>
                    <form id="checkout-form" onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                            <input type="text" required style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-black)'
                            }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                            <input type="email" required style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-black)'
                            }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Address</label>
                            <textarea required rows="3" style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-black)',
                                fontFamily: 'inherit'
                            }}></textarea>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone Number</label>
                            <input type="tel" required style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-black)'
                            }} />
                        </div>

                        <h3 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>Payment Method</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <label style={{
                                flex: 1,
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid var(--color-pink-500)',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}>
                                <input type="radio" name="payment" defaultChecked style={{ marginRight: '0.5rem' }} />
                                QR Code (PromptPay)
                            </label>
                            <label style={{
                                flex: 1,
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                opacity: 0.5
                            }}>
                                <input type="radio" name="payment" disabled style={{ marginRight: '0.5rem' }} />
                                Credit Card (Coming Soon)
                            </label>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Order Summary</h3>

                        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                            {cartItems.map((item, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.9rem' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.style} Style</div>
                                    </div>
                                    <div style={{ color: 'var(--color-pink-500)' }}>฿{item.price}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                            <span>Subtotal</span>
                            <span>฿{totalPrice}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <span>Shipping (Standard)</span>
                            <span style={{ color: 'var(--color-pink-500)' }}>Free</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--color-pink-500)' }}>฿{totalPrice}</span>
                        </div>

                        <button type="submit" form="checkout-form" className="btn-primary" style={{ width: '100%' }}>
                            Place Order
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .checkout-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Checkout;
