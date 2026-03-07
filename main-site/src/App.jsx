import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { fetchContent } from "./redux/slices/contentSlice";

// Error Handling & Notifications
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./hooks/useToast";
import { performanceMonitor } from "./services/performanceMonitor";
import { analyticsService } from "./services/analyticsService";

// Main Pages - Lazy loaded (in separate chunks)
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Blogs = lazy(() => import("./pages/Blogs"));

// Layout
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import BackToTop from "./components/common/BackToTop";
import ScrollToTop from "./components/common/ScrollToTop";
import StickyContactBar from "./components/common/StickyContactBar";
import { MobileNavPill } from "./components/layout/MobileNavBar";
import { PAGE_NAMES, SCROLL_CHECKPOINTS } from "./config/routes";

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-orange rounded-full animate-spin"></div>
      <p className="text-muted-foreground font-medium">Loading...</p>
    </div>
  </div>
);

function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    const pageName = PAGE_NAMES[location.pathname] || location.pathname;
    analyticsService.trackPageView(pageName);
  }, [location.pathname]);

  return null;
}

function ScrollDepthTracker() {
  const location = useLocation();

  useEffect(() => {
    const scrollDepthTracked = SCROLL_CHECKPOINTS.reduce(
      (acc, val) => ({ ...acc, [val]: false }),
      {},
    );
    const pageName = PAGE_NAMES[location.pathname] || location.pathname;

    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

      [25, 50, 75, 100].forEach((percent) => {
        if (scrolled >= percent && !scrollDepthTracked[percent]) {
          scrollDepthTracked[percent] = true;
          analyticsService.trackScrollDepth(pageName, percent);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return null;
}

/**
 * Conditional Mobile Navigation
 * Simple 3-icon navigation for mobile devices (Home, Products, Blogs)
 * Hidden on desktop (md and up), visible only on mobile
 */
function ConditionalMobileNav() {
  // Use CSS to show/hide based on screen size - hidden on tablets and desktop
  return (
    <div className="block sm:hidden">
      <MobileNavPill theme="light" />
    </div>
  );
}

/**
 * App Component
 * Main routing and layout for the entire application
 */
function App() {
  const dispatch = useDispatch();

  // Initialize performance monitoring
  useEffect(() => {
    performanceMonitor.initWebVitals();
    window.addEventListener("load", () => {
      performanceMonitor.logPageLoadTime();
    });

    return () => {
      window.removeEventListener("load", () => {
        performanceMonitor.logPageLoadTime();
      });
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    let unsubscribers = [];
    let loadHandler = null;

    const triggerRefresh = () => {
      if (isActive) {
        dispatch(fetchContent({ force: true }));
      }
    };

    dispatch(fetchContent());

    const setupRealtimeListeners = async () => {
      if (!isActive) return;

      const [{ onSnapshot, doc, collection }, { db }] = await Promise.all([
        import("firebase/firestore"),
        import("./services/firebaseClient"),
      ]);

      if (!isActive) return;

      unsubscribers = [
        onSnapshot(doc(db, "home_page", "singleton"), triggerRefresh),
        onSnapshot(doc(db, "services_page", "singleton"), triggerRefresh),
        onSnapshot(collection(db, "products"), triggerRefresh),
        onSnapshot(collection(db, "blogs"), triggerRefresh),
      ];
    };

    const scheduleRealtimeSetup = () => {
      window.setTimeout(() => {
        setupRealtimeListeners().catch(() => {
          // Keep app usable even if realtime listeners fail.
        });
      }, 3000);
    };

    if (document.readyState === "complete") {
      scheduleRealtimeSetup();
    } else {
      loadHandler = () => scheduleRealtimeSetup();
      window.addEventListener("load", loadHandler, { once: true });
    }

    return () => {
      isActive = false;
      if (loadHandler) {
        window.removeEventListener("load", loadHandler);
      }
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <PageViewTracker />
          <ScrollDepthTracker />
          <Routes>
            {/* Main Website Routes */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
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
                  <Footer />
                  {/* Mobile Navigation Bar - Only shows on mobile devices */}
                  <ConditionalMobileNav />
                </>
              }
            />
          </Routes>
          <StickyContactBar />
          <BackToTop />
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
