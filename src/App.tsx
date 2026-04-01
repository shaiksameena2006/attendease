import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { FacultyDashboard } from "@/pages/dashboard/FacultyDashboard";
import { StudentDashboard } from "@/pages/dashboard/StudentDashboard";
import { AdminDashboard } from "@/pages/dashboard/AdminDashboard";
import Login from "@/pages/auth/Login";

// ✅ Smart redirect component
function HomeRedirect() {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-bold">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role === "faculty") return <Navigate to="/faculty-dashboard" replace />;
  if (role === "admin") return <Navigate to="/admin-dashboard" replace />;
  if (role === "student") return <Navigate to="/student-dashboard" replace />;

  return <div className="text-center mt-10">Setting up your account...</div>;
}

function AppRoutes() {
  const { user, role, isLoading } = useAuth();

  // ✅ VERY IMPORTANT: wait for auth to load
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/" replace />}
      />

      {/* Smart Home Redirect */}
      <Route path="/" element={<HomeRedirect />} />

      {/* ✅ Protected Faculty Dashboard */}
      <Route
        path="/faculty-dashboard"
        element={
          user && role === "faculty" ? (
            <FacultyDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* ✅ Protected Student Dashboard */}
      <Route
        path="/student-dashboard"
        element={
          user && role === "student" ? (
            <StudentDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* ✅ Protected Admin Dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          user && role === "admin" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}