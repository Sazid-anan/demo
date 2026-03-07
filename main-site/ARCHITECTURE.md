# 🏗️ DANVION Project Architecture

## Project Overview

DANVION is a modern React-based SaaS landing page with:

- Public website (Home, Products, Blogs)
- Admin CMS dashboard
- Firebase backend integration
- Real-time content management

**Tech Stack**:

- **Frontend**: React 19 + Vite
- **State**: Redux Toolkit
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Routing**: React Router v7
- **Build**: Vite + Terser optimization

---

## 📁 Project Structure

```
project3/
├── public/                    # Static assets
│   ├── images/
│   ├── robots.txt            # SEO crawler instructions
│   ├── sitemap.xml           # SEO sitemap
│   └── sw.js                 # Service Worker for offline
│
├── src/
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   │
│   ├── admin/               # Admin CMS sections
│   │   ├── pages/
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   └── components/
│   │       ├── EditProductsTab.jsx
│   │       ├── EditTeamTab.jsx
│   │       ├── BlogsTab.jsx
│   │       ├── MessagesTab.jsx
│   │       ├── AnalyticsWidget.jsx
│   │       └── TestimonialsTab.jsx
│   │
│   ├── pages/              # Public pages
│   │   ├── Home.jsx        # Main landing page
│   │   ├── Products.jsx    # Products showcase
│   │   ├── Blogs.jsx       # Blog listing
│   │   └── MobileNav.jsx   # Mobile navigation demo
│   │
│   ├── components/         # Reusable components
│   │   ├── SEO.jsx         # Meta tags & JSON-LD schema
│   │   ├── LazyImage.jsx   # Lazy-load images
│   │   ├── ErrorBoundary.jsx # Error handling
│   │   ├── Skeleton.jsx    # Loading placeholders
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── MobileNavBar.jsx
│   │   ├── common/
│   │   │   ├── Container.jsx
│   │   │   ├── BackToTop.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── StickyContactBar.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Badge.jsx
│   │   ├── HeroTextSection.jsx
│   │   ├── ImageSliderSection.jsx
│   │   ├── CapabilitiesSection.jsx
│   │   └── PhasesSection.jsx
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useResponsive.js      # Device detection
│   │   ├── useSwipe.ts           # Touch gestures
│   │   ├── useAnalytics.ts       # Analytics events
│   │   ├── useFormValidation.js  # Form handling
│   │   └── useToast.jsx          # Notifications
│   │
│   ├── services/           # External integrations
│   │   ├── firebaseClient.js     # Firebase config & setup
│   │   ├── storage.js            # Firebase storage operations
│   │   ├── errorLogger.ts        # Error tracking
│   │   └── apiClient.ts          # HTTP client
│   │
│   ├── redux/              # State management
│   │   ├── store.js
│   │   └── slices/
│   │       ├── contentSlice.js   # Page content (CRUD)
│   │       ├── authSlice.js      # Authentication
│   │       └── adminSlice.js     # Admin UI state
│   │
│   ├── config/             # Configuration files
│   │   ├── content.js      # All website text content
│   │   ├── links.js        # External & internal links
│   │   └── environment.ts  # Environment validation
│   │
│   ├── utils/              # Utility functions
│   │   ├── performance.js  # Performance monitoring
│   │   ├── markdown.js     # Markdown parsing
│   │   ├── eventLogger.ts  # Analytics / Event logging
│   │   └── validators.js   # Validation functions
│   │
│   ├── styles/             # CSS modules
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── responsive.css
│   │   └── utilities.css
│   │
│   └── types/              # TypeScript types
│       └── index.ts
│
├── Configuration Files:
├── package.json            # Dependencies & scripts
├── vite.config.js          # Build & dev server config
├── tailwind.config.js      # Tailwind theme & plugins
├── tsconfig.json           # TypeScript config
├── eslint.config.js        # Code quality rules
├── postcss.config.js       # CSS processing
├── firebase.json           # Firebase hosting config
├── firestore.rules         # Database security rules
├── storage.rules           # File storage rules
├── vercel.json             # Vercel deployment config
└── index.html              # HTML entry point
```

---

## 🔄 Data Flow Architecture

### 1. **Public Users** (Visitors)

```
User → Pages (Home/Products/Blogs)
         ↓
    Redux Store (contentSlice)
         ↓
    Firebase Firestore (READ-ONLY)
         ↓
    Display Content
```

**Flow**:

1. User visits page
2. `useEffect` dispatches `fetchContent()`
3. Redux retrieves data from Firebase
4. Components render from Redux state

---

### 2. **Admin** (Content Manager)

```
Admin → Firebase Auth (login page)
         ↓
    Admin Dashboard
         ↓
    Admin Components (EditProductsTab, etc.)
         ↓
    Firebase Firestore (WRITE access)
         ↓
    Redux Store updates
         ↓
    Changes visible immediately
```

**Flow**:

1. Admin logs in with email/password
2. Firebase verifies admin role
3. Admin dashboard loads
4. Admin edits content (products, blogs, etc.)
5. Changes saved to Firestore
6. Redux state updates
7. Public pages show updated content

---

### 3. **Contact Form** (Lead Capture)

```
Form Input → Validation
     ↓
   useToast (feedback)
     ↓
   Firebase Firestore (contact_messages collection)
     ↓
   Success notification to user
     ↓
   Admin sees in Analytics Widget
```

---

## 🔐 Security Architecture

### 1. **Authentication**

- Firebase Email/Password for admin
- Custom claims for role-based access
- Session tokens managed by Firebase
- Protected routes in App.jsx

**Current**: Basic auth check  
**TODO**: Add role-based access control (RBAC)

### 2. **Authorization** (Firestore Rules)

```javascript
// Who can access what?
- Anyone: can READ products, blogs, testimonials
- Authenticated Admin: can WRITE to all collections
- Anonymous: can CREATE contact messages only

// Custom: Admin email hardcoded in rules (⚠️ needs fixing)
```

**TODO**: Move to custom claims instead of email checking

### 3. **Data Protection**

- Firebase Rules restrict write access
- Environment variables protect API keys
- Service Worker caches safely
- DOMPurify sanitizes HTML content

---

## 🎯 Component Communication Patterns

### Pattern 1: Parent → Child Props

```jsx
// Home.jsx
<HeroTextSection title={homePage.headline} />

// Pass data down through props
```

### Pattern 2: Global State (Redux)

```jsx
// Anywhere in app
const { products } = useSelector((state) => state.content);

// Automatic updates when Redux state changes
```

### Pattern 3: Custom Hooks

```jsx
// In any component
const { isMobile } = useResponsive();

// Shared logic without prop drilling
```

### Pattern 4: Context (Planned but not used yet)

```jsx
// For: Toast notifications, Theme, etc.
// Currently using Redux instead
```

---

## 🚀 Performance Optimizations

### 1. **Code Splitting** (Vite)

```javascript
// Automatic: Split vendor, Redux, Firebase into chunks
// Lazy load: Pages with Suspense
const Home = lazy(() => import("./pages/Home"));
```

**Result**: Initial bundle ~150KB (vs 300KB without splitting)

### 2. **Image Optimization**

```javascript
// LazyImage component:
- Intersection Observer for lazy loading
- WebP with fallback
- Blur-up placeholder effect
- Responsive srcSet support
```

### 3. **Service Worker**

```javascript
// Offline support
- Cache static assets
- Network-first strategy
- Automatic cache invalidation
```

### 4. **CSS Optimization**

```javascript
// Tailwind v4:
- Only includes used classes
- CSS-in-JS support
- No unused CSS shipped
```

### 5. **Caching Strategy** (Firebase)

```json
// Cache Headers:
- HTML: no-cache (always fresh)
- JS/CSS: 1 year (immutable, hash-based)
- Images: 1 year (immutable)
```

---

## 📊 Redux Store Structure

```javascript
store = {
  content: {
    // Pages
    homePage: { headline, section_title, ... },

    // Collections
    products: [ { id, name, category, image_url, ... }, ... ],
    blogs: [ { id, title, category, content, ... }, ... ],
    testimonials: [ { id, text, author, ... }, ... ],
    team: [ { id, name, role, bio, ... }, ... ],

    // Status
    loading: false,
    error: null,
  },

  auth: {
    isLoggedIn: false,
    adminEmail: null,
    userId: null,
    loading: false,
  },

  admin: {
    activeTab: 'products',
    selectedProduct: null,
  }
}
```

---

## 🔄 Redux Actions (contentSlice)

**Queries**:

- `fetchContent()` - Get all data
- `getProduct(id)` - Get single product
- `getBlog(id)` - Get single blog

**Mutations**:

- `saveProduct(product)` - Create/Update
- `deleteProduct(id)` - Delete
- Similar for blogs, testimonials, team

---

## 🧪 Testing Strategy

```
Unit Tests          Integration Tests       E2E Tests
└─ Utilities       └─ Redux + Firebase    └─ User flows
└─ Components      └─ API calls           └─ Admin panel
└─ Hooks           └─ Form validation     └─ Checkout (if added)
```

**Setup**: Vitest + React Testing Library

---

## 📈 Analytics & Monitoring

### Google Analytics Events

- Page views
- Product clicks
- Form submissions
- Error events

### Custom Events

- Admin actions
- Content updates
- Image uploads
- API performance

### Performance Metrics

- Core Web Vitals (LCP, FID, CLS)
- Time to Interactive (TTI)
- First Contentful Paint (FCP)

---

## 🚀 Deployment Pipeline

```
Git Push
   ↓
GitHub Actions (or CI/CD)
   ↓
npm run build --> Vite bundler
   ↓
npm run lint --> ESLint check
   ↓
npm test --> Run tests
   ↓
Firebase Deploy
   └─ Hosting (dist/)
   └─ Firestore Rules
   └─ Storage Rules
   └─ Functions (if any)
```

**Environments**:

- **Development**: localhost:5173 (Vite dev server)
- **Staging**: firebase staging deployment
- **Production**: danvion-ltd.web.app

---

## 🎯 Next Steps for Scaling

1. **Add Backend Functions** (Firebase Cloud Functions)
   - Email notifications
   - Image resizing
   - Advanced validation

2. **Add Comments/Reviews** (Firestore)
   - Blog comments
   - Product reviews
   - Rating system

3. **Add E-commerce** (if needed)
   - Shopping cart
   - Payment integration (Stripe)
   - Order tracking

4. **Add Real-time Features** (Firestore listeners)
   - Admin notifications
   - Live analytics
   - Activity feed

5. **Migrate to Next.js** (optional)
   - Server-Side Rendering (SSR)
   - Static Site Generation (SSG)
   - API routes built-in
   - Better SEO

---

## 📚 Key Resources

- [React Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Firebase Docs](https://firebase.google.com/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

---

**Last Updated**: February 24, 2026  
**Version**: 1.0
