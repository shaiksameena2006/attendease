import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { FacultyDashboard } from "@/pages/dashboard/FacultyDashboard";
import { StudentDashboard } from "@/pages/dashboard/StudentDashboard";
import { AdminDashboard } from "@/pages/dashboard/AdminDashboard";
import  Login  from "@/pages/auth/Login";

function AppRoutes() {
  const { user, role, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-bold">
        Loading...
      </div>
    );

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : role === "faculty" ? (
            <FacultyDashboard />
          ) : role === "student" ? (
            <StudentDashboard />
          ) : role === "admin" ? (
            <AdminDashboard />
          ) : (
            <div>Role not recognized</div>
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