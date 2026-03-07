import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebaseClient";
import { setAuthUser } from "./redux/slices/authSlice";
import { fetchContent } from "./redux/slices/contentSlice";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./hooks/useToast";

const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Fetch all content for admin to edit
  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  // Firebase Auth listener
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
    <ErrorBoundary>
      <ToastProvider>
        <Router>
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
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
