import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { initGA, trackPageView } from './utils/analytics';
import Header from './components/Header';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import TryOn from './pages/TryOn';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';

const AppContent = () => {
  const location = useLocation();
  const hideHeaderOn = ['/try-on'];
  const shouldHideHeader = hideHeaderOn.includes(location.pathname);

  // Initialize Google Analytics on mount
  useEffect(() => {
    initGA();
  }, []);

  // Track page view on route change
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <div className="app">
      {!shouldHideHeader && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/try-on" element={<TryOn />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
