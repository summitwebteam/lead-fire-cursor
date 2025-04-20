import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Dashboard from "@/pages/Dashboard";
import Campaigns from "@/pages/Campaigns";
import CampaignDetails from "@/pages/CampaignDetails";
import CampaignSettings from "@/pages/CampaignSettings";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import Callback from "@/pages/Callback";
import NotFound from "@/pages/NotFound";
import { AuthGuard } from "@/components/AuthGuard";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/hooks/useAuth";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes need to be outside AuthGuard */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<Callback />} />
            
            {/* Dashboard as the default home route */}
            <Route path="/" element={
              <AuthGuard>
                <div className="flex h-screen w-full overflow-hidden">
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16">
                    <AppSidebar />
                    <Dashboard />
                  </main>
                </div>
              </AuthGuard>
            } />
            
            <Route path="/campaigns" element={
              <AuthGuard>
                <div className="flex h-screen w-full overflow-hidden">
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16">
                    <AppSidebar />
                    <Campaigns />
                  </main>
                </div>
              </AuthGuard>
            } />
            <Route path="/campaigns/:id" element={
              <AuthGuard>
                <div className="flex h-screen w-full overflow-hidden">
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16">
                    <AppSidebar />
                    <CampaignDetails />
                  </main>
                </div>
              </AuthGuard>
            } />
            <Route path="/campaigns/:id/settings" element={
              <AuthGuard>
                <div className="flex h-screen w-full overflow-hidden">
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16">
                    <AppSidebar />
                    <CampaignSettings />
                  </main>
                </div>
              </AuthGuard>
            } />
            <Route path="/users" element={
              <AuthGuard>
                <div className="flex h-screen w-full overflow-hidden">
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16">
                    <AppSidebar />
                    <Users />
                  </main>
                </div>
              </AuthGuard>
            } />
            <Route path="/settings" element={
              <AuthGuard>
                <div className="flex h-screen w-full overflow-hidden">
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16">
                    <AppSidebar />
                    <Settings />
                  </main>
                </div>
              </AuthGuard>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
