import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import FacultyDashboard from "@/components/dashboard/FacultyDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { SignInPage } from "@/components/auth/SignInPage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function AppRoutes() {
  const { user, role, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={!user ? <SignInPage /> : <Navigate to="/" replace />} />

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