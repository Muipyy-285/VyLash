import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart } = useCart();

    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
                    <ShoppingBag size={64} />
                </div>
                <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>Your Cart is Empty</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added any lashes yet.</p>
                <Link to="/shop" className="btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '50px' }}>
            <h1 className="text-gradient" style={{ marginBottom: '2rem', textAlign: 'center' }}>Your Shopping Bag</h1>

            <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Cart Items List */}
                <div className="cart-items">
                    {cartItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="glass-panel" style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '1.5rem',
                            marginBottom: '1rem',
                            gap: '1.5rem'
                        }}>
                            {/* Product Image */}
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(to bottom, #fff0f5, #fff)',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '5px'
                            }}>
                                <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>

                            {/* Product Details */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{item.style} Style</p>
                            </div>

                            {/* Price */}
                            <div style={{ fontWeight: 'bold', color: 'var(--color-pink-500)', fontSize: '1.1rem' }}>
                                ฿{item.price}
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => removeFromCart(item.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    transition: 'color 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--color-pink-500)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                                title="Remove item"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                    <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Order Summary</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                            <span>฿{totalPrice}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                            <span style={{ color: 'var(--color-pink-500)', fontSize: '0.9rem' }}>Calculated at checkout</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--color-pink-500)' }}>฿{totalPrice}</span>
                        </div>

                        <button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                            Checkout <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .cart-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Cart;
