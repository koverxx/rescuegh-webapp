import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Home from './pages/Dashboard/Home';
import ReportEmergency from './pages/Dashboard/ReportEmergency';
import EmergencyHistory from './pages/Dashboard/EmergencyHistory';
import EmergencyTracker from './pages/Dashboard/EmergencyTracker';
import RespondersNearby from './pages/Dashboard/RespondersNearby';
import UserProfile from './pages/Profile/UserProfile';
import AppSettings from './pages/Settings/AppSettings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/report" element={<ReportEmergency />} />
        <Route path="/history" element={<EmergencyHistory />} />
        <Route path="/tracker" element={<EmergencyTracker />} />
        <Route path="/responders" element={<RespondersNearby />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/settings" element={<AppSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
