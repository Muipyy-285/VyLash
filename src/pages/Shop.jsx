import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { products } from '../data/products';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const Shop = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const [addedId, setAddedId] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedId(product.id);
        setToastMessage(`${product.name} - ${t.shop.addedToast}`);

        setTimeout(() => {
            setAddedId(null);
        }, 1800);

        setTimeout(() => {
            setToastMessage('');
        }, 2600);
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
            {/* Toast Notification */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    top: '90px',
                    right: '24px',
                    background: '#16a34a',
                    color: 'white',
                    padding: '12px 22px',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    boxShadow: '0 8px 25px rgba(22, 163, 74, 0.4)',
                    zIndex: 9999
                }}>
                    <Check size={20} />
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="text-center" style={{ marginBottom: '3rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t.shop.title}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>{t.shop.subtitle}</p>
            </div>

            <div className="grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2.5rem',
                padding: '1rem'
            }}>
                {products.map(product => (
                    <div key={product.id} className="glass-panel product-card" style={{
                        padding: '0',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer'
                    }}
                        onClick={() => navigate(`/product/${product.id}`)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{
                            height: '250px',
                            background: 'linear-gradient(to bottom, #fff0f5, #fff)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <img src={product.image} alt={product.name} style={{ width: '80%', opacity: 1, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }} />
                        </div>

                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
                            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.2rem', flex: 1 }}>
                                {product.description.substring(0, 60)}...
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-pink-500)' }}>฿{product.price}</span>
                            </div>

                            {/* Action Buttons: View Details & Add to Cart */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.6rem' }}>
                                <button 
                                    className="btn-secondary" 
                                    style={{ 
                                        padding: '0.6rem 0.5rem', 
                                        fontSize: '0.85rem', 
                                        borderRadius: '30px',
                                        borderColor: 'var(--color-pink-500)', 
                                        color: 'var(--color-pink-500)', 
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        justifyContent: 'center',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        width: '100%'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/product/${product.id}`);
                                    }}
                                >
                                    {t.shop.viewDetails}
                                </button>
                                
                                <button 
                                    className="btn-primary" 
                                    style={{ 
                                        padding: '0.6rem 0.5rem', 
                                        fontSize: '0.85rem', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '6px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        width: '100%',
                                        background: addedId === product.id ? '#16a34a' : undefined
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
                                >
                                    {addedId === product.id ? (
                                        <>
                                            <Check size={16} />
                                            <span>✓</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag size={16} />
                                            <span>{t.shop.addToCart}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;
