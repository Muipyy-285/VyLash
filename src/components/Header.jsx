import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.shop, path: '/shop' },
    { name: t.nav.tryOn, path: '/try-on' },
    { name: t.nav.feedback, path: '/feedback' },
    { name: t.nav.contact, path: '/contact' },
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>VyLash</Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {/* Language Switcher Button */}
          <button 
            className="lang-toggle-btn" 
            onClick={toggleLanguage}
            title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
          >
            <Globe size={16} />
            <span className="lang-label">{language === 'th' ? 'EN' : 'TH'}</span>
            <span className="lang-flag">{language === 'th' ? '🇬🇧' : '🇹🇭'}</span>
          </button>

          <Link to="/cart" className="cart-btn">
            <ShoppingBag size={20} color="var(--color-pink-500)" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} color="var(--color-pink-500)" /> : <Menu size={24} color="var(--color-pink-500)" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <nav className="mobile-nav glass-panel">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}

      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.3s ease;
          padding: 1.5rem 0;
        }
        .header.scrolled {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.5);
          box-shadow: 0 4px 20px -5px rgba(255, 182, 193, 0.3);
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          background: linear-gradient(to right, var(--color-pink-400), var(--color-gold));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .desktop-nav {
          display: none;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }
        }
        .nav-link {
          color: var(--color-black);
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--color-pink-500);
          text-shadow: 0 0 15px rgba(255, 105, 180, 0.4);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .lang-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: 20px;
          padding: 5px 11px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-pink-500);
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(244, 63, 94, 0.1);
        }

        .lang-toggle-btn:hover {
          background: var(--color-pink-500);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(244, 63, 94, 0.25);
        }

        .lang-toggle-btn .lang-flag {
          font-size: 0.95rem;
          line-height: 1;
        }
        .cart-btn {
          position: relative;
        }
        .cart-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--color-pink-500);
          color: var(--color-white);
          font-size: 0.7rem;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .mobile-menu-btn {
          display: block;
        }
        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none;
          }
        }
        .mobile-nav {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.5);
          box-shadow: 0 10px 30px -10px rgba(255, 182, 193, 0.3);
        }
        .mobile-nav-link {
          padding: 1rem;
          color: var(--color-black);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          text-align: center;
          font-weight: 700;
          text-transform: uppercase;
          text-decoration: none;
        }
        .mobile-nav-link:last-child {
            border-bottom: none;
        }
      `}</style>
    </header>
  );
};

export default Header;
