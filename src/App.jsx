import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState, Suspense } from "react";
import { lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent } from "./redux/slices/contentSlice";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./services/firebaseClient";
import { setAuthUser } from "./redux/slices/authSlice";

// Main Pages - Lazy loaded
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Blogs = lazy(() => import("./pages/Blogs"));

// Admin Pages - Lazy loaded
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));

// Layout
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import BackToTop from "./components/common/BackToTop";
import ScrollToTop from "./components/common/ScrollToTop";
import StickyContactBar from "./components/common/StickyContactBar";
import RouteMeta from "./components/common/RouteMeta";

// Loading component
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
  const [_isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let isActive = true;
    const triggerRefresh = async () => {
      if (!isActive) return;
      setIsSyncing(true);
      try {
        await dispatch(fetchContent({ force: true }));
      } finally {
        if (isActive) {
          setTimeout(() => {
            if (isActive) setIsSyncing(false);
          }, 800);
        }
      }
    };

    triggerRefresh();

    const unsubscribers = [
      onSnapshot(doc(db, "home_page", "singleton"), triggerRefresh),
      onSnapshot(doc(db, "services_page", "singleton"), triggerRefresh),
      onSnapshot(collection(db, "products"), triggerRefresh),
      onSnapshot(collection(db, "blogs"), triggerRefresh),
    ];

    return () => {
      isActive = false;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        dispatch(setAuthUser({ email: user.email }));
      } else {
        dispatch(setAuthUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Router>
        <RouteMeta />
        <ScrollToTop />
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              isAdminLoggedIn ? (
                <Suspense fallback={<PageLoader />}>
                  <AdminDashboard />
                </Suspense>
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />

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
              </>
            }
          />
        </Routes>
        <StickyContactBar />
        <BackToTop />
      </Router>
    </>
  );
}

export default App;
