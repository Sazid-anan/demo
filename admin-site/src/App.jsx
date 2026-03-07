import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent } from "./redux/slices/contentSlice";
import { setAuthUser } from "./redux/slices/authSlice";

// Error Handling & Notifications
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./hooks/useToast";
import { performanceMonitor } from "./services/performanceMonitor";

// Admin Pages - Lazy loaded in separate chunk (only loaded when needed)
// These are grouped together so they load only once when admin section is accessed
const AdminLogin = lazy(() => import(/* webpackChunkName: "admin" */ "./admin/pages/AdminLogin"));
const AdminDashboard = lazy(
  () => import(/* webpackChunkName: "admin" */ "./admin/pages/AdminDashboard"),
);
import BackToTop from "./components/common/BackToTop";
import ScrollToTop from "./components/common/ScrollToTop";

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-orange rounded-full animate-spin"></div>
      <p className="text-muted-foreground font-medium">Loading...</p>
    </div>
  </div>
);

/**
 * App Component
 * Main routing and layout for the entire application
 */
function App() {
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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

  useEffect(() => {
    let unsubscribe = () => {};
    let isMounted = true;
    let loadHandler = null;

    const setupAuth = async () => {
      const [{ onAuthStateChanged }, { auth }] = await Promise.all([
        import("firebase/auth"),
        import("./services/firebaseClient"),
      ]);

      if (!isMounted) return;

      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user?.email) {
          dispatch(setAuthUser({ email: user.email }));
        } else {
          dispatch(setAuthUser(null));
        }
      });
    };

    if (document.readyState === "complete") {
      setupAuth().catch(() => {
        // Keep app usable even if auth listener fails.
      });
    } else {
      loadHandler = () => {
        setupAuth().catch(() => {
          // Keep app usable even if auth listener fails.
        });
      };
      window.addEventListener("load", loadHandler, { once: true });
    }

    return () => {
      isMounted = false;
      if (loadHandler) {
        window.removeEventListener("load", loadHandler);
      }
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/login"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminLogin />
                </Suspense>
              }
            />
            <Route
              path="/dashboard"
              element={
                isAdminLoggedIn ? (
                  <Suspense fallback={<PageLoader />}>
                    <AdminDashboard />
                  </Suspense>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <BackToTop />
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
