# CodePilot AI Landing Page

A premium, minimal SaaS landing page built with Next.js, TypeScript, and Tailwind CSS.

## Design Philosophy

- Inspired by Apple.com, Linear, and Notion
- Extremely minimal with large white space
- Soft neutral tones and clean typography
- Elegant, calm, and intelligent feel

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React Icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Showcase.tsx
│   ├── CTA.tsx
│   └── Footer.tsx
└── lib/
    └── utils.ts
```

## Color System

- Background: `#ffffff`
- Secondary: `#f8f8f8`
- Primary Text: `#0a0a0a`
- Accent: `#2563EB`
- Borders: `gray-200`

## Features

- Fully responsive design
- Smooth scroll animations
- Sticky navigation with backdrop blur
- Clean, production-ready code
- Accessible components
