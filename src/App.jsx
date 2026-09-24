import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TryOn from './pages/TryOn';

function App() {
  return (
    <Router basename="/VyLash">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/try-on" element={<TryOn />} />
      </Routes>
    </Router>
  );
}

export default App;
