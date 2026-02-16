# VyLash - Magnetic Eyelashes AR Shop

A modern e-commerce web application for selling magnetic eyelashes with advanced AR virtual try-on features.

## ✨ Features

- 🛍️ **E-commerce Store** - Browse and purchase magnetic eyelash products
- 👁️ **Dual AR Try-On** - Virtual try-on with two AR modes:
  - **Custom AR** - MediaPipe-powered with manual controls (offline capable)
  - **Snap AR** - Professional Snap Camera Kit integration
- 🎨 **Multiple Lash Styles** - Natural, Cat Eye, Dramatic, and more
- 🛒 **Shopping Cart** - Add to cart, apply coupons, checkout flow
- 💳 **Checkout System** - Complete order placement with QR code payment
- 📱 **Responsive Design** - Beautiful UI optimized for all devices
- 🔍 **Debug Mode** - Facial landmark visualization for AR development

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the application.

## 🎯 AR Virtual Try-On Setup

### MediaPipe Mode (Default)

Works out of the box - no configuration needed. Uses custom facial landmark detection for precise lash placement.

### Snap Camera Kit Mode

Requires Snap API credentials. Follow these steps:

1. **Get Snap Credentials**
   - Visit [Snap Camera Kit Portal](https://camera-kit.snapchat.com/)
   - Create an app and get your API token
   - Create or upload a lens in [Lens Studio](https://ar.snap.com/lens-studio)
   - Copy your Lens ID

2. **Configure Environment**
   ```bash
   # Edit .env file in the project root
   VITE_SNAP_API_TOKEN=your_api_token_here
   VITE_SNAP_LENS_ID=your_lens_id_here
   ```

3. **Detailed Setup**
   See [snap-setup.md](./snap-setup.md) for complete instructions

## 📦 Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router
- **Build Tool**: Vite
- **AR Technology**: 
  - MediaPipe Face Mesh
  - Snap Camera Kit SDK
- **Styling**: Vanilla CSS with CSS variables
- **Additional**: QR Code generation, responsive design

## 📂 Project Structure

```
vylah02/
├── src/
│   ├── components/     # Reusable components (Header, ARFilter, etc.)
│   ├── pages/          # Route pages (Home, Shop, TryOn, Cart, etc.)
│   ├── context/        # React context (CartContext)
│   ├── utils/          # Utilities (AR utils, Snap config)
│   ├── data/           # Product and coupon data
│   ├── assets/         # Images and lash textures
│   └── styles/         # Global CSS and variables
├── .env                # Environment variables (not committed)
├── .env.example        # Environment template
└── snap-setup.md       # Snap Camera Kit setup guide
```

## 🎨 Design

The application features a premium, modern design with:
- Gradient text effects
- Glass-morphism UI elements
- Smooth animations and transitions
- Dark theme with gold/pink accent colors
- Responsive layout for mobile and desktop

## 📄 License

Private project - All rights reserved

## 🙏 Acknowledgments

- MediaPipe by Google for facial landmark detection
- Snap Inc. for Camera Kit AR platform
- React and Vite communities
