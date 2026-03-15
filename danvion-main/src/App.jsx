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

  // Poll API periodically to keep public content fresh (every 5 minutes to reduce bandwidth).
  useEffect(() => {
    const pollInterval = window.setInterval(() => {
      dispatch(fetchContent({ force: true }));
    }, 300000);

    return () => {
      window.clearInterval(pollInterval);
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
