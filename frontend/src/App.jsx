import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Users from './pages/Users';
import PayOnline from './pages/PayOnline';
import Settings from './pages/Settings';
import Stats from './pages/Stats';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Estimation from './pages/Estimation';
import Verification from './pages/Verification';
import RecycleBin from './pages/RecycleBin';
import DeveloperOptions from './pages/DeveloperOptions';
import Vibe from './pages/Vibe';
import Moments from './pages/Moments';
import LetsPlay from './pages/LetsPlay';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HiddenProfileProvider } from './context/HiddenProfileContext';
import { initializeAnalytics, trackPageView } from './utils/analytics';
import { LanguageProvider } from './context/LanguageContext';
import Notifications from './pages/Notifications';
import MaintenancePage from './components/developer/MaintenancePage';
import axios from 'axios';
import { API_URL } from './utils/config';

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    checkMaintenanceMode();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/maintenance/status`);
      setMaintenanceMode(data.isEnabled);
    } catch (error) {
      console.error('Failed to check maintenance status:', error);
    }
  };

  // Show maintenance page for all users except default developer
  if (maintenanceMode && user?.email !== 'devvineel@gmail.com') {
    return <MaintenancePage />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/users" element={<Users />} />
          <Route path="/pay-online" element={<PayOnline />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/estimation" element={<Estimation />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/recycle-bin" element={<RecycleBin />} />
          <Route path="/developer-options" element={<DeveloperOptions />} />
          <Route path="/vibe" element={<Vibe />} />
          <Route path="/moments" element={<Moments />} />
          <Route path="/lets-play" element={<LetsPlay />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <HiddenProfileProvider>
          <Router>
            <AppContent />
          </Router>
        </HiddenProfileProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;