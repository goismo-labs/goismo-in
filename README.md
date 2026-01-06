# Goismo Technologies Website

Official website for **Goismo Technologies India Private Limited** - Empowering Innovation Through Technology.

![Goismo](https://img.shields.io/badge/Goismo-Technologies-FF5722?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=flat-square&logo=vite)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/goismo/website.git
cd goismo-website

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
goismo-website/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles & Tailwind
├── index.html           # HTML template
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Design System

### Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#FF5722` | Main brand color, CTAs, accents |
| Primary Dark | `#E64A19` | Hover states, gradients |
| Primary Light | `#FF8A65` | Highlights |
| Accent | `#1E90FF` | Tech elements, links |
| Dark 900 | `#0D0D0D` | Background |
| Dark 800 | `#1A1A1A` | Cards, sections |
| Dark 700 | `#2F4F4F` | Slate accents |

### Typography
- **Headings**: Space Grotesk (300-700 weights)
- **Code/Technical**: JetBrains Mono

### Components
- **Glass Cards**: Glassmorphism with backdrop blur
- **Gradient Buttons**: Primary to dark gradient with hover effects
- **Animated Counters**: Intersection observer triggered
- **Scroll Reveal**: Fade-in-up animations on scroll

## 📄 Pages

1. **Home** - Hero section, three pillars, stats, CTA
2. **About** - Company story, Cyber Cake visualization, timeline
3. **Portfolio** - Security Guard App showcase, features grid
4. **Products** - Fintech & Education domains
5. **Team** - Team members across 3 global offices
6. **Careers** - Benefits, open positions
7. **Contact** - Office locations, contact form

## 🌍 Office Locations

- **India**: 441, 9th Main, AECS B Block, Singasandra, Bangalore - 560068
- **Sweden**: Herkulesgatan 3A, 417 03 Göteborg
- **USA**: 1999 Harrison St, Suite 1800, Oakland, CA 94612

## 📧 Contact

- **Email**: info@goismo.in
- **Website**: [goismo.in](https://goismo.in)

## 🚀 Deployment

### GitHub Pages

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (using gh-pages)
npm install -D gh-pages
npx gh-pages -d dist
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

Simply connect your GitHub repository and set:
- Build command: `npm run build`
- Publish directory: `dist`

## 📝 License

© 2025 Goismo Technologies India Private Limited. All rights reserved.

---

Built with ❤️ by Goismo Technologies
