import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { products } from '../data/products';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">
            <span className="block" style={{ animationDelay: '0.2s', color: 'var(--color-pink-500)' }}>Redefine Your</span>
            <span className="text-gradient block" style={{ animationDelay: '0.4s' }}>Gaze</span>
          </h1>
          <p className="hero-subtitle">
            Experience the future of beauty with our premium magnetic eyelashes.
            Try them on instantly with our AR filter.
          </p>
          <div className="hero-actions">
            <Link to="/try-on" className="btn-primary">
              Virtual Try-On
            </Link>
            <Link to="/shop" className="btn-secondary">
              Shop Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Featured Collection</h2>
            <p className="text-muted">Our most popular styles, designed for you.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {products.slice(0, 3).map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="glass-panel" style={{
                display: 'block',
                padding: '1.5rem',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.3s ease'
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  height: '200px',
                  background: 'rgba(255,255,255,0.05)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img src={product.image} alt={product.name} style={{ width: '80%', opacity: 0.8 }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-muted" style={{ textTransform: 'capitalize' }}>{product.style} Style</span>
                  <span style={{ color: 'var(--color-pink-500)', fontWeight: 'bold' }}>฿{product.price}</span>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/shop" className="btn-secondary" style={{
              display: 'inline-flex',
              borderBottom: '1px solid var(--color-gold)',
              color: 'var(--color-pink-500)',
              borderColor: 'var(--color-pink-500)',
              background: 'rgba(255,255,255,0.5)'
            }}>
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Styles (Inline for now, could move to CSS modules) */}
      <style>{`
        .hero {
          position: relative;
          height: 100vh;
          width: 100%;
          background-image: url('https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2000&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8));
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          padding-top: 60px;
        }
        .hero-title {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        @media (min-width: 768px) {
          .hero-title {
            font-size: 5rem;
          }
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .block {
          display: block;
          animation: fadeInUp 0.8s ease backwards;
        }

        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
