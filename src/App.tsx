import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/NotFound";

// Student pages
import AttendanceTracker from "./pages/student/AttendanceTracker";
import Timetable from "./pages/student/Timetable";
import ClubsHouses from "./pages/student/ClubsHouses";
import Certificates from "./pages/student/Certificates";
import Messages from "./pages/student/Messages";
import Transport from "./pages/student/Transport";

// Faculty pages
import ClassManagement from "./pages/faculty/ClassManagement";
import TimetableManager from "./pages/faculty/TimetableManager";
import CertificateGenerator from "./pages/faculty/CertificateGenerator";
import COPOManagement from "./pages/faculty/COPOManagement";
import EventManagement from "./pages/faculty/EventManagement";

// Admin pages
import UserManagement from "./pages/admin/UserManagement";
import Analytics from "./pages/admin/Analytics";
import AcademicManagement from "./pages/admin/AcademicManagement";
import TransportAdmin from "./pages/admin/TransportAdmin";
import SystemSettings from "./pages/admin/SystemSettings";

// Shared pages
import Notifications from "./pages/shared/Notifications";
import SettingsPage from "./pages/shared/SettingsPage";
import HelpSupport from "./pages/shared/HelpSupport";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RoleProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />

              <BrowserRouter>
                <Routes>

                  {/* ✅ Redirect root → login */}
                  <Route path="/" element={<Navigate to="/auth/login" />} />

                  {/* Auth routes */}
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  <Route path="/auth/reset-password" element={<ResetPassword />} />

                  {/* Main App Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <AppShell><Index /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/schedule" element={
                    <ProtectedRoute>
                      <AppShell><Schedule /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/events" element={
                    <ProtectedRoute>
                      <AppShell><Events /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <AppShell><Profile /></AppShell>
                    </ProtectedRoute>
                  } />

                  {/* Student routes */}
                  <Route path="/student/attendance" element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <AppShell><AttendanceTracker /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/student/timetable" element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <AppShell><Timetable /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/student/clubs" element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <AppShell><ClubsHouses /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/student/certificates" element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <AppShell><Certificates /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/student/messages" element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <AppShell><Messages /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/student/transport" element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <AppShell><Transport /></AppShell>
                    </ProtectedRoute>
                  } />

                  {/* Faculty routes */}
                  <Route path="/faculty/classes" element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                      <AppShell><ClassManagement /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/faculty/timetable" element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                      <AppShell><TimetableManager /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/faculty/certificates" element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                      <AppShell><CertificateGenerator /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/faculty/co-po" element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                      <AppShell><COPOManagement /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/faculty/events" element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                      <AppShell><EventManagement /></AppShell>
                    </ProtectedRoute>
                  } />

                  {/* Admin routes */}
                  <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppShell><UserManagement /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/admin/analytics" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppShell><Analytics /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/admin/academic" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppShell><AcademicManagement /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/admin/transport" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppShell><TransportAdmin /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/admin/settings" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppShell><SystemSettings /></AppShell>
                    </ProtectedRoute>
                  } />

                  {/* Shared routes */}
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <AppShell><Notifications /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <AppShell><SettingsPage /></AppShell>
                    </ProtectedRoute>
                  } />

                  <Route path="/help" element={
                    <ProtectedRoute>
                      <AppShell><HelpSupport /></AppShell>
                    </ProtectedRoute>
                  } />

                  {/* Catch all */}
                  <Route path="*" element={<NotFound />} />

                </Routes>
              </BrowserRouter>

            </TooltipProvider>
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;