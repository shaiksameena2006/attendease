import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

type Role = "student" | "faculty" | "admin";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requireApproval?: boolean;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  requireApproval = true 
}: ProtectedRouteProps) {
  const { user, role, isApproved, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requireApproval && !isApproved) {
    return <Navigate to="/auth/verification-pending" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
