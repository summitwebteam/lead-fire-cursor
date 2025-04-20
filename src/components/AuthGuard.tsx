
import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While checking authentication status, show loading indicator
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Enforce authentication - redirect to login page if not authenticated
  if (!user) {
    // Pass the current location to redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
