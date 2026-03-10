import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./hooks/useToast";
import { setAuthUser } from "./redux/slices/authSlice";
import apiClient from "./services/apiClient";

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

  useEffect(() => {
    let mounted = true;
    const token =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("danvion_admin_token")
        : null;

    if (!token) {
      return () => {
        mounted = false;
      };
    }

    const verifySession = async () => {
      try {
        apiClient.setToken(token);
        const response = await apiClient.get("/auth/verify.php");

        if (!mounted) return;

        const user = response?.data?.user;
        if (response?.success && user?.email) {
          dispatch(
            setAuthUser({
              email: user.email,
              role: user.role,
            }),
          );
          return;
        }
      } catch {
        // Invalid/expired tokens are cleared below.
      }

      if (!mounted) return;
      apiClient.clearToken();
    };

    verifySession();

    return () => {
      mounted = false;
    };
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
