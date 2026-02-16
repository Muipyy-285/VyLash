import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const product = useMemo(() => {
        return products.find(p => p.id === parseInt(id));
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        alert(`Added ${product.name} to cart!`);
    };

    if (!product) {
        return (
            <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
                <h1 className="text-gradient">Product Not Found</h1>
                <button className="btn-primary" onClick={() => navigate('/shop')} style={{ marginTop: '2rem' }}>
                    Back to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '50px' }}>
            <button
                onClick={() => navigate('/shop')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', marginBottom: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                ← Back to Shop
            </button>

            <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '3rem', alignItems: 'center' }}>
                {/* Image Section */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 'var(--radius-md)',
                    height: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    <img src={product.image} alt={product.name} style={{ width: '90%', opacity: 0.9 }} />
                </div>

                {/* Info Section */}
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{product.name}</h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-pink-500)', marginBottom: '1.5rem' }}>
                        ฿{product.price}
                    </p>

                    <p style={{ lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                        {product.description}
                    </p>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Style Profile:</h4>
                        <span style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            textTransform: 'capitalize'
                        }}>
                            {product.style} Look
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <button className="btn-primary" style={{ flex: 1, textAlign: 'center' }} onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                        <button
                            className="glass-panel"
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                border: '1px solid var(--color-pink-500)',
                                color: 'var(--color-pink-500)',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                            onClick={() => navigate('/try-on', { state: { style: product.style } })}
                        >
                            <span role="img" aria-label="camera" style={{ marginRight: '0.5rem' }}>📸</span>
                            Virtual Try-On
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
