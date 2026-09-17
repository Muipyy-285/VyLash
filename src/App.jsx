import React, { useEffect } from 'react';

const GA_MEASUREMENT_ID = 'G-KNZ6KBCG48';

function App() {
  useEffect(() => {
    if (!window.gtag) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID);
    }
  }, []);

  return (
    <div>
      {/* ส่วนประกอบหลักของแอปพลิเคชัน VyLash */}
    </div>
  );
}

export default App;
