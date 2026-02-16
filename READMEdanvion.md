# DANVION - Edge AI & Product Development Website

A modern, production-ready website for **DANVION Ltd.** focusing on Edge AI solutions and product development services.

## 🎯 Overview

This is a fully-featured React application with:

- **Main Website** with 5 key pages (Home, Products, Product Development, About, Contact)
- **Admin CMS Panel** for managing all content
- **Real-time Updates** using Redux state management
- **Firebase Integration** for data persistence
- **Modern UI** with Tailwind CSS and Framer Motion animations
- **Fully Responsive** design for all devices

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project and a Web app
2. Enable Authentication (Email/Password)
3. Enable Firestore and Storage
4. Optional: set environment variables in `.env.local`:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 🔐 Admin Access

**URL**: http://localhost:5173/admin/login

```
Email: sazid@danvion.com
Password: S@zid123456
```

## 📄 Pages

### Main Website

1. **Home** - Hero section with image slider, features, CTA
2. **Product Development** - Services, process, tech stack
3. **Products** - Product catalog with detail modals
4. **About Us** - Company info, mission, vision, team
5. **Contact** - Contact form, FAQ, company details

### Admin Panel

- **Dashboard** with tabs for managing:
  - Home page content & headlines
  - Image sliders (add/remove/reorder)
  - Product catalog (CRUD)
  - About page content

## 🛠 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router 7** - Routing
- **Firebase** - Backend & database
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

## 📊 Database Schema

### Collections

- `home_page` (document: `singleton`)
- `image_sliders`
- `products`
- `about_page` (document: `singleton`)
- `team_members`
- `services_page` (document: `singleton`)
- `contact_messages`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Website pages
├── admin/              # Admin panel
├── redux/              # State management
├── services/           # API & services
└── App.jsx             # Main component
```

## 🎨 Features

✅ Hero image slider (auto-rotating)
✅ Smooth animations & transitions
✅ Responsive design (mobile, tablet, desktop)
✅ Real-time content updates
✅ Admin CMS for all content
✅ Contact form
✅ Product catalog
✅ Company information pages

## 🚀 Build & Deploy

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Deploy

- **Vercel**: `vercel`
- **Netlify**: Drag `dist` folder

## 📖 Documentation

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🔒 Security Notes

- Admin authentication uses Firebase Auth
- Multi-email admin support via `VITE_ADMIN_EMAILS` env variable
- Firestore security rules enforce read/write access
- All secrets stored in `.env.local` (never commit)
- Contact messages securely stored in Firestore
- Real-time updates via Firestore snapshots

## 💡 Key Components

### Reusable Components

- `Button` - Styled button with variants
- `Container` - Centered content wrapper
- `ImageSlider` - Auto-rotating image carousel
- `ContactForm` - Reusable contact form

### Pages

- All pages use Redux for state management
- Animations via Framer Motion
- Fully responsive Tailwind CSS

### Admin Panel

- Tab-based interface
- Real-time updates to Redux store
- Form validation
- Success feedback messages

## 🤝 Support

For questions or issues:

- Email: admin@danvion.com
- Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for troubleshooting

---

**Built with React, Redux, Firebase, and Tailwind CSS**
# danvion-website
