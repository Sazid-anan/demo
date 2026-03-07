# 👨‍💻 Developer Quick Reference

## 🚀 Quick Start

```bash
# Clone & setup
git clone <repo>
cd danvion
npm install

# Configure Firebase
cp .env.example .env.local
# Edit .env.local with your Firebase keys

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 🔥 Common Tasks

### Add a new page

```jsx
// 1. Create page in src/pages/NewPage.jsx
export default function NewPage() {
  return <div>New Page</div>;
}

// 2. Add route in App.jsx
import NewPage from './pages/NewPage';
// ...
<Route path="/new-page" element={<NewPage />} />

// 3. Add to nav in Header.jsx
{ path: "/new-page", label: "New Page" }
```

### Add a new component

```jsx
// src/components/MyComponent.jsx
export default function MyComponent({ title, children }) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Use it
import MyComponent from "../components/MyComponent";
<MyComponent title="Hello">Content</MyComponent>;
```

### Add form with validation

```jsx
// Import hook
import { useFormValidation } from "../hooks/useFormValidation";

// In component
const form = useFormValidation(
  { email: "", name: "" },
  async (values) => {
    // Submit logic
    await sendData(values);
  },
  (values) => {
    const errors = {};
    if (!values.email) errors.email = "Required";
    return errors;
  },
);

// Render
<form onSubmit={form.handleSubmit}>
  <input
    name="email"
    value={form.values.email}
    onChange={form.handleChange}
    onBlur={form.handleBlur}
  />
  {form.touched.email && form.errors.email && (
    <span className="text-red-500">{form.errors.email}</span>
  )}
</form>;
```

### Show toast notification

```jsx
import { useToastStore } from "../hooks/useToast";

function MyComponent() {
  const toast = useToastStore();

  const handleClick = () => {
    toast.success("Done!");
    toast.error("Something wrong");
    toast.warning("Be careful");
    toast.info("FYI");
  };
}
```

### Fetch data from Redux

```jsx
import { useSelector, useDispatch } from "react-redux";
import { fetchContent } from "../redux/slices/contentSlice";

function Products() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {products.map((p) => (
        <p key={p.id}>{p.name}</p>
      ))}
    </div>
  );
}
```

### Upload image

```jsx
import { uploadImage } from "../services/storage";

async function handleImageUpload(file) {
  try {
    const url = await uploadImage(file, "products");
    console.log("Image URL:", url);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}
```

### Lazy load images

```jsx
import LazyImage from "../components/LazyImage";

<LazyImage
  src="/images/product.jpg"
  alt="Product description"
  className="w-full h-auto"
  width={800}
  height={600}
/>;
```

### Responsive design

```jsx
import { useResponsive } from "../hooks/useResponsive";

function MyComponent() {
  const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

### Use Framer Motion animations

```jsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>;
```

### Error handling

```jsx
import { errorLogger } from "../services/errorLogger";

try {
  // code
} catch (error) {
  errorLogger.captureException(error, {
    context: "my-feature",
    userId: user.id,
  });
}
```

---

## 📁 File Locations

| What         | Where                   |
| ------------ | ----------------------- |
| Pages        | `src/pages/`            |
| Components   | `src/components/`       |
| Hooks        | `src/hooks/`            |
| Services     | `src/services/`         |
| Redux        | `src/redux/slices/`     |
| Styles       | `src/styles/`           |
| Content text | `src/config/content.js` |
| Types        | `src/types/index.ts`    |
| Utils        | `src/utils/`            |

---

## 🎨 Tailwind CSS

### Common classes

```jsx
// Flexbox
<div className="flex gap-4 items-center justify-between">

// Grid
<div className="grid grid-cols-3 gap-4">

// Responsive
<div className="text-sm md:text-base lg:text-lg">

// Colors
<div className="bg-brand-orange text-white">

// Shadows
<div className="shadow-lg hover:shadow-xl">

// Spacing
<div className="p-4 mt-8 mb-2">

// Rounded
<div className="rounded-lg">
```

### Custom colors

In `tailwind.config.js`:

```javascript
colors: {
  'brand-orange': '#ff6b35',
  'brand-dark': '#1a1a2e',
}
```

Use: `<div className="bg-brand-orange">`

---

## 🔧 Redux Patterns

### Dispatch action

```jsx
const dispatch = useDispatch();
dispatch(saveProduct(productData));
dispatch(fetchContent());
```

### Async thunk

```javascript
export const fetchContent = createAsyncThunk("content/fetchContent", async () => {
  const data = await db.fetchAll();
  return data;
});
```

---

## 🐛 Debugging

### Console logging

```javascript
// DEV only
if (import.meta.env.DEV) {
  console.log("Debug info");
}
```

### Check Redux state

```javascript
// In browser console
store.getState();
// or use Redux DevTools extension
```

### Check performance

```javascript
// In DevTools Performance tab
// Record → perform action → Stop
```

---

## ✅ Code Quality

### Lint code

```bash
npm run lint

# Fix automatically
npm run lint -- --fix
```

### Format code

```bash
npm run format  # (if set up)
```

### Run tests

```bash
npm test

# Watch mode
npm test -- --watch
```

---

## 📚 Documentation

- [React Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Firebase](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

Local docs:

- `ARCHITECTURE.md` - Project structure
- `IMPROVEMENT_ROADMAP.md` - What to do next
- `DEPLOYMENT.md` - How to deploy
- `SEO_OPTIMIZATION.md` - SEO setup

---

## 🚀 Environment Variables

```env
# Your .env.local
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
# ... more vars
```

**Never commit `.env.local` to git!**

---

## 🚦 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# Get review
# Merge to main
```

---

## 🎯 Performance Tips

1. Use `lazy()` and `Suspense` for pages
2. Use `LazyImage` for images
3. Memoize expensive computations with `useMemo`
4. Use `useCallback` for event handlers
5. Split Redux slices
6. Avoid inline styles
7. Use CSS classes instead

---

## 📱 Mobile Testing

```bash
# Run dev server
npm run dev

# On phone:
# 1. Find your computer IP
ipconfig getifaddr en0  # Mac
ipconfig  # Windows

# 2. Visit http://<your-ip>:5173 on phone
```

---

## 🔐 Security

- ✅ Never commit `.env` files
- ✅ Never hardcode API keys
- ✅ Sanitize user input with DOMPurify
- ✅ Use Firebase rules
- ✅ Validate on frontend AND backend
- ✅ Don't trust user data

---

## 🆘 Common Issues

### "Module not found"

- Check import path
- Run `npm install`

### "Firebase not initialized"

- Check `.env.local` has keys
- Check `firebaseClient.js` config

### "Type errors in TypeScript"

- Check `tsconfig.json`
- Hover over error for hint
- Check `src/types/index.ts`

### "Styles not applying"

- Check class name spelling
- Check Tailwind config
- Run `npm run build` (sometimes needed)

### "Redux state not updating"

- Check Redux DevTools
- Verify reducer logic
- Check action is dispatched

---

## 💡 Pro Tips

1. Use VS Code extensions: ESLint, Prettier, Tailwind CSS IntelliSense
2. Enable Redux DevTools for debugging
3. Use React DevTools to inspect component state
4. Keep components small and focused
5. Comment complex logic
6. Write meaningful commit messages
7. Test on real devices before deploy

---

**Last Updated**: February 24, 2026
