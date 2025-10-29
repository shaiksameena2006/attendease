import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppShell } from "@/components/layout/AppShell";
import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import VerificationPending from "./pages/auth/VerificationPending";
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

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RoleProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              {/* Auth routes without AppShell */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/verification-pending" element={<VerificationPending />} />
              
              {/* App routes with AppShell */}
              <Route path="/" element={<AppShell><Index /></AppShell>} />
              <Route path="/schedule" element={<AppShell><Schedule /></AppShell>} />
              <Route path="/events" element={<AppShell><Events /></AppShell>} />
              <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
              
              {/* Student routes */}
              <Route path="/student/attendance" element={<AppShell><AttendanceTracker /></AppShell>} />
              <Route path="/student/timetable" element={<AppShell><Timetable /></AppShell>} />
              <Route path="/student/clubs" element={<AppShell><ClubsHouses /></AppShell>} />
              <Route path="/student/certificates" element={<AppShell><Certificates /></AppShell>} />
              <Route path="/student/messages" element={<AppShell><Messages /></AppShell>} />
              <Route path="/student/transport" element={<AppShell><Transport /></AppShell>} />
              
              {/* Faculty routes */}
              <Route path="/faculty/classes" element={<AppShell><ClassManagement /></AppShell>} />
              <Route path="/faculty/timetable" element={<AppShell><TimetableManager /></AppShell>} />
              <Route path="/faculty/certificates" element={<AppShell><CertificateGenerator /></AppShell>} />
              <Route path="/faculty/co-po" element={<AppShell><COPOManagement /></AppShell>} />
              <Route path="/faculty/events" element={<AppShell><EventManagement /></AppShell>} />
              
              {/* Admin routes */}
              <Route path="/admin/users" element={<AppShell><UserManagement /></AppShell>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RoleProvider>
    </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
