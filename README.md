# Kathan Zula — Portfolio

Personal portfolio website built with React + Vite. Dark, minimal, developer aesthetic with smooth animations.

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool
- **Framer Motion** — Animations
- **react-type-animation** — Typewriter effect
- **react-intersection-observer** — Scroll-triggered animations
- **CSS Custom Properties** — Theming

---

## Project Structure

```
kathan-portfolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Cursor.jsx / .css       ← Custom cursor
│   │   ├── Footer.jsx / .css       ← Footer
│   │   ├── Loader.jsx / .css       ← Loading screen
│   │   └── Navbar.jsx / .css       ← Navigation
│   ├── sections/
│   │   ├── Hero.jsx / .css         ← Landing section
│   │   ├── About.jsx / .css        ← About me
│   │   ├── Projects.jsx / .css     ← Projects showcase
│   │   ├── Skills.jsx / .css       ← Skills & tools
│   │   ├── Achievements.jsx / .css ← Awards & highlights
│   │   ├── Education.jsx / .css    ← Academic timeline
│   │   └── Contact.jsx / .css      ← Contact form
│   ├── assets/
│   │   └── images/
│   │       └── profile.jpg         ← ADD YOUR PHOTO HERE
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css                   ← Global styles & design tokens
├── index.html
├── vite.config.js
├── vercel.json
├── netlify.toml
└── package.json
```

---

## 🚀 Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Start dev server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 3. Build for production
```bash
npm run build
```

### 4. Preview production build
```bash
npm run preview
```

---



## 🌐 Deployment (Vercel — Recommended, Free)

### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option B: Deploy via GitHub + Vercel (Recommended)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → Sign up with GitHub

3. Click **"New Project"** → Import your GitHub repository

4. Vercel auto-detects Vite:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Click **Deploy** — you get a free `.vercel.app` domain!

6. **Custom Domain**: In Vercel dashboard → Settings → Domains → Add domain

---

## 🌐 Deployment (Netlify — Alternative)

1. Push to GitHub (same steps as above)
2. Go to [netlify.com](https://netlify.com) → Login
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect GitHub → Select repository
5. Build settings are auto-detected from `netlify.toml`
6. Click **Deploy Site**

---

## 🔧 Customization Checklist

- [ ] Add your photo to `src/assets/images/profile.jpg`
- [ ] Add your resume PDF to `public/Kathan_Resume.pdf`
- [ ] Update GitHub links in `Projects.jsx` with actual repo URLs
- [ ] Update contact phone if needed
- [ ] Optionally integrate Formspree/EmailJS for contact form
- [ ] Add your own project screenshots/demos

---

## 📧 Contact Form Setup (Optional)

To make the contact form send emails directly (without opening mail client):

### Using Formspree (Free)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a form → get your form ID
3. In `Contact.jsx`, replace the `handleSubmit` function:
```js
const handleSubmit = async (e) => {
  e.preventDefault()
  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })
  if (response.ok) setStatus('sent')
}
```

---

## Performance

- Lazy-loaded sections with `react-intersection-observer`
- Canvas particles — auto-cleaned up
- CSS-only animations where possible
- Code splitting via Vite rollup config
- Optimized font loading with `preconnect`
