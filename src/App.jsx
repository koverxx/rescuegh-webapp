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
import DispatchDashboard from './pages/Admin/DispatchDashboard';
import AdminMap from './pages/Admin/AdminMap';
import ActiveIncidents from './pages/Admin/ActiveIncidents';
import FleetAndUnits from './pages/Admin/fleet&units';
import CitizenRecords from './pages/Admin/CitizenRecords';
import SystemReports from './pages/Admin/SystemReports'; 
import AdminLogin from './pages/Admin/AdminLogin';
import DispatchSignup from './pages/Admin/DispatchSignup'; 
import ResolvedIncidents from './pages/Admin/ResolvedIncidents';
import SystemSettings from './pages/Admin/SystemSettings';

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
        
        <Route path="/tracker/:id" element={<EmergencyTracker />} />
        
        <Route path="/nearby" element={<RespondersNearby />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/settings" element={<AppSettings />} />

        <Route path="/dashboard/*" element={<DispatchDashboard />} />
        <Route path="/adminmap" element={<AdminMap />} />
        <Route path="/active-incidents" element={<ActiveIncidents />} />
        <Route path="/fleet" element={<FleetAndUnits />} />
        <Route path="/records" element={<CitizenRecords />} />
        <Route path="/reports" element={<SystemReports />} /> 
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dispatch-signup" element={<DispatchSignup />} />
        <Route path="/resolved-incidents" element={<ResolvedIncidents />} />
        <Route path="/system-settings" element={<SystemSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;