import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Instagram, Sparkles, ExternalLink } from 'lucide-react';
import { products } from '../data/products';
import paymentConfig from '../utils/paymentConfig';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">
            <span className="block" style={{ animationDelay: '0.2s', color: 'var(--color-pink-500)' }}>Redefine Your</span>
            <span className="text-gradient block" style={{ animationDelay: '0.4s', textShadow: 'none' }}>Gaze</span>
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

      {/* Contact & Connect Section */}
      <section className="home-contact-section" style={{ padding: '4rem 0 6rem' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <div className="section-badge" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(244, 63, 94, 0.12)',
              color: 'var(--color-pink-500)',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '0.8rem'
            }}>
              <Sparkles size={14} /> GET IN TOUCH
            </div>
            <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>
              ติดต่อสอบถาม & ช่องทางติดตาม
            </h2>
            <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
              มีคำถามเกี่ยวกับสินค้า หรือต้องการปรึกษาเลือกทรงขนตา ทักหาเราได้ตลอดเวลาครับ
            </p>
          </div>

          <div className="home-contact-grid">
            {/* LINE OA Card */}
            <div className="glass-panel home-contact-card">
              <div className="home-card-header">
                <div className="home-icon-badge line-badge">
                  <MessageCircle size={28} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>LINE Official</h3>
                  <span className="home-handle">{paymentConfig.lineId}</span>
                </div>
              </div>
              <p className="home-card-desc">
                ปรึกษาทรงขนตา สอบถามข้อมูล หรือแจ้งสลิปโอนเงินกับแอดมินโดยตรง ตอบไวภายในไม่กี่นาที
              </p>
              <a 
                href={paymentConfig.lineOaUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-channel line-btn"
              >
                <span>แชทผ่าน LINE OA</span>
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Instagram Card */}
            <div className="glass-panel home-contact-card">
              <div className="home-card-header">
                <div className="home-icon-badge ig-badge">
                  <Instagram size={28} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>Instagram</h3>
                  <span className="home-handle">{paymentConfig.instagramHandle}</span>
                </div>
              </div>
              <p className="home-card-desc">
                ชมภาพรีวิวสวยๆ ดูคลิปวิดีโอสาธิตการใช้งาน และอัปเดตโปรโมชันล่าสุดผ่านทาง IG
              </p>
              <a 
                href={paymentConfig.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-channel ig-btn"
              >
                <span>ติดตาม & ดูรีวิวบน IG</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Quick link to full contact page */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/contact" className="btn-secondary" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.7)',
              borderColor: 'var(--color-pink-500)',
              color: 'var(--color-pink-500)'
            }}>
              <span>ดูข้อมูลติดต่อเพิ่มเติม & คำถามที่พบบ่อย (FAQ)</span>
              <ArrowRight size={16} />
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
          background-image: url('https://images.unsplash.com/photo-1496096265110-f83ad7f96608?q=80&w=2000&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,240,245,0.6), rgba(255,255,255,1));
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
          color: var(--color-black);
          font-weight: 500;
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

        .glass-panel:hover {
             transform: translateY(-5px);
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

        /* Home Contact Section */
        .home-contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .home-contact-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .home-contact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 35px rgba(244, 63, 94, 0.15);
        }

        .home-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .home-icon-badge {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .line-badge {
          background: #06c755;
          box-shadow: 0 4px 14px rgba(6, 199, 85, 0.4);
        }
        .ig-badge {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
          box-shadow: 0 4px 14px rgba(214, 36, 159, 0.4);
        }

        .home-handle {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-pink-500);
        }

        .home-card-desc {
          color: var(--text-muted);
          font-size: 0.92rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .btn-channel {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.8rem 1.4rem;
          border-radius: 25px;
          font-weight: 700;
          font-size: 0.95rem;
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
      `}</style>
    </div>
  );
};

export default Home;
