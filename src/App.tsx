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

  // ⛔ fallback ONLY if something is really wrong
  return <div className="text-center mt-10">Setting up your account...</div>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />

      {/* Smart Home */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Dashboards */}
      <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

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