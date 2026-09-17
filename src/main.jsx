// Google Analytics 4 Script
const script1 = document.createElement('script');
script1.async = true;
script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-KNZ6KBCG48';
document.head.appendChild(script1);

window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-KNZ6KBCG48');
import './styles/global.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
