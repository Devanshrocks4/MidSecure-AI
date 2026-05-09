# MedSecure AI - Healthcare IoT Security Platform

A comprehensive healthcare IoT security dashboard for monitoring, threat detection, and compliance management in medical facilities.

![MedSecure AI Dashboard](https://img.shields.io/badge/MedSecure-AI-purple)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-6-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **Real-time Dashboard** - Live monitoring of IoT devices and security metrics
- **Device Management** - Track and manage medical IoT devices (monitors, pumps, sensors)
- **Threat Detection** - Visualize security incidents and anomalies
- **ML-Based Detection** - Machine learning traffic analysis for anomaly detection
- **Encryption Tools** - AES-256-GCM encryption for secure data handling
- **Compliance Reporting** - HIPAA compliance checks and reporting
- **Audit Logging** - Complete audit trail of all system activities

## 🛠 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React 18 + Vite 6 |
| Styling | Tailwind CSS 3.4 |
| Animation | Framer Motion 11 |
| Charts | Recharts 2.15 |
| State | Zustand 5 |
| Routing | React Router DOM 7 |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+

### Local Development

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

### Option 1: Netlify (Frontend Only) - Recommended

The frontend works standalone using localStorage - no backend required for basic features!

**Deploy Steps:**

1. Push this project to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select the repository
5. Configure:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy"

**Or using CLI:**

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from client directory
cd client
netlify deploy --prod --dir=dist
```

### Option 2: Netlify + Render (Full Stack)

Deploy both frontend and backend:

**Frontend (Netlify):**
- Same as Option 1

**Backend (Render):**
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Root directory: `server-express`
   - Build command: `npm install`
   - Start command: `npm start`
5. Set environment variables:
   - `PORT`: 4000
   - `JWT_SECRET`: your-secret-key
6. Deploy

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:4000` |
| `VITE_APP_TITLE` | App title | `MedSecure AI` |
| `VITE_APP_VERSION` | App version | `1.0.0` |

Create a `.env.local` file in the `client` directory:

```env
VITE_API_URL=http://localhost:4000
```

## 📁 Project Structure

```
healthcare-iot-security/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   └── utils/        # Utilities and helpers
│   ├── netlify.toml       # Netlify configuration
│   └── package.json
├── server-express/        # Express API (optional)
│   ├── server.js
│   └── package.json
└── README.md
```

## 🔍 Troubleshooting

### Page Refresh Gives 404

Ensure `netlify.toml` has the SPA redirect rule:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true
```

### Styles Not Loading

Make sure Tailwind is imported in your CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Build Fails

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Ensure Node.js version is 18+:
   ```bash
   node --version
   ```

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Credits

- Medical device icons by [Lucide](https://lucide.dev)
- Charts by [Recharts](https://recharts.org)
- Animations by [Framer](https://www.framer.com/motion/)

---

Built with ❤️ for Healthcare Security
