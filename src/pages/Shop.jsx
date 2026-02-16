import React from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';

const Shop = () => {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <div className="text-center" style={{ marginBottom: '3rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Shop Collections</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Premium Magnetic Eyelashes for every occasion.</p>
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
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{
                            height: '250px',
                            background: 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <img src={product.image} alt={product.name} style={{ width: '80%', opacity: 0.8 }} />
                        </div>

                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
                            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
                                {product.description.substring(0, 60)}...
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-pink-500)' }}>฿{product.price}</span>
                                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                    View Details
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
