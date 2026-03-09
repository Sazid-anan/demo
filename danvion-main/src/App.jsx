import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { fetchContent } from "./redux/slices/contentSlice";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./hooks/useToast";
import { performanceMonitor } from "./services/performanceMonitor";
import { analyticsService } from "./services/analyticsService";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import BackToTop from "./components/common/BackToTop";
import ScrollToTop from "./components/common/ScrollToTop";
import StickyContactBar from "./components/common/StickyContactBar";
import { MobileNavPill } from "./components/layout/MobileNavBar";
import { PAGE_NAMES } from "./config/routes";

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Blogs = lazy(() => import("./pages/Blogs"));

const PageLoader = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ minHeight: "100vh" }}
  >
    <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-orange rounded-full animate-spin"></div>
  </div>
);

function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    analyticsService.trackPageView(
      PAGE_NAMES[location.pathname] || location.pathname,
    );
  }, [location.pathname]);

  return null;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    performanceMonitor.initWebVitals();
    window.addEventListener("load", () => performanceMonitor.logPageLoadTime());
  }, []);

  // Fetch content on app load
  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  // Real-time Firebase listeners — deferred after page is interactive
  useEffect(() => {
    let isActive = true;
    let unsubscribers = [];
    let debounceTimer = null;

    const setupListeners = async () => {
      if (!isActive) return;

      const [{ onSnapshot, doc, collection }, { db }] = await Promise.all([
        import("firebase/firestore"),
        import("./services/firebaseClient"),
      ]);

      if (!isActive) return;

      // Debounced refresh to prevent excessive updates
      const refresh = () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (isActive) dispatch(fetchContent({ force: true }));
        }, 500); // 500ms debounce
      };

      unsubscribers = [
        onSnapshot(doc(db, "home_page", "singleton"), refresh),
        onSnapshot(doc(db, "services_page", "singleton"), refresh),
        onSnapshot(collection(db, "products"), refresh),
        onSnapshot(collection(db, "blogs"), refresh),
      ];
    };

    // Defer until browser is idle (better FID)
    if (document.readyState === "complete") {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => setupListeners(), { timeout: 5000 });
      } else {
        setTimeout(setupListeners, 3000);
      }
    } else {
      window.addEventListener(
        "load",
        () => {
          if ("requestIdleCallback" in window) {
            requestIdleCallback(() => setupListeners(), { timeout: 5000 });
          } else {
            setTimeout(setupListeners, 3000);
          }
        },
        { once: true },
      );
    }

    return () => {
      isActive = false;
      if (debounceTimer) clearTimeout(debounceTimer);
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <PageViewTracker />
          <Header />
          <main style={{ minHeight: "50vh" }}>
            <Routes>
              <Route
                path="/"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Home />
                  </Suspense>
                }
              />
              <Route
                path="/products"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Products />
                  </Suspense>
                }
              />
              <Route
                path="/blogs"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Blogs />
                  </Suspense>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <div className="block sm:hidden">
            <MobileNavPill theme="light" />
          </div>
          <StickyContactBar />
          <BackToTop />
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
