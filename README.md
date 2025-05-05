# Anime Sauce Finder

Anime Sauce Finder is a modern web app that helps you identify the source of any anime screenshot or video clip. Upload an image or paste a URL, and instantly find the anime title, episode, and timestamp using the powerful [trace.moe](https://trace.moe/) API.

![Anime Sauce Finder Screenshot](public/preview.png)

---

## 🚀 Features
- **Find Anime by Screenshot/Clip:** Upload or paste a URL to identify the anime scene.
- **Episode & Timestamp Detection:** Get episode number and exact scene time.
- **Meme Generator:** Instantly create memes from any found scene.
- **Modern UI:** Clean, responsive design with dark mode.
- **No Account Needed:** 100% free and privacy-friendly.

---

## 🛠️ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Build for Production
```bash
npm run build
npm start
```

---

## 🌐 Deploy
- **Vercel:** [Deploy instantly](https://vercel.com/new)
- **Static Export:**
  ```bash
  npm run build
  npx next export
  # Upload the 'out/' folder to your static host
  ```

---

## 📦 Tech Stack
- [Next.js](https://nextjs.org/) (React)
- [Tailwind CSS](https://tailwindcss.com/)
- [trace.moe API](https://trace.moe/)
- [html2canvas](https://github.com/niklasvh/html2canvas) (for meme export)

---

## 🙏 Credits
- [trace.moe](https://trace.moe/) for the anime search API
- [Masab Farooque](https://github.com/masab12) (project author)

---

## 📄 License
MIT
