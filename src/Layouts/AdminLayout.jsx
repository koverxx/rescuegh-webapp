import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase'; // Make sure this path is correct
import { collection, onSnapshot } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Map, 
  Radio, 
  Users, 
  Settings, 
  BarChart3,
  CheckCircle,
  Bell,
  BellOff,
  AlertTriangle,
  X
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [globalAlert, setGlobalAlert] = useState(null);

  // Reliable free-to-use notification chime from Mixkit
  const alertSound = useRef(new Audio('/alert.mp3'));

  useEffect(() => {
    let isInitialLoad = true;
    const emergenciesQuery = collection(db, 'emergencies');

    const unsubscribe = onSnapshot(emergenciesQuery, (snapshot) => {
      // 1. Skip the initial data load so it doesn't play for old incidents
      if (isInitialLoad) {
        isInitialLoad = false;
        return;
      }

      // 2. Check if any NEW documents were added
      const newIncidents = snapshot.docChanges().filter(change => change.type === 'added');

      if (newIncidents.length > 0) {
        // 3. Play the audio if sound is enabled
        if (soundEnabled) {
          alertSound.current.currentTime = 0; // Reset audio to start
          alertSound.current.play().catch(err => {
            console.log("Browser blocked autoplay. User must interact with DOM first.", err);
          });
        }

        // 4. Show the global visual alert toast
        setGlobalAlert(`🚨 ${newIncidents.length} New Emergency Request(s) Incoming!`);
        
        // Auto-hide the visual toast after 5 seconds
        setTimeout(() => {
          setGlobalAlert(null);
        }, 5000);
      }
    });

    return () => unsubscribe();
  }, [soundEnabled]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Active Incidents', path: '/active-incidents', icon: <AlertCircle size={20} /> },
    { name: 'Resolved Incidents', path: '/resolved-incidents', icon: <CheckCircle size={20} /> },
    { name: 'Live Map', path: '/adminmap', icon: <Map size={20} /> },
    { name: 'Fleet & Units', path: '/fleet', icon: <Radio size={20} /> },
    { name: 'Citizen Records', path: '/records', icon: <Users size={20} /> },
    { name: 'System Reports', path: '/reports', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans relative">
      
      {/* Global Incident Notification Toast */}
      {globalAlert && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border-2 border-red-400 shadow-red-500/30">
            <AlertTriangle size={18} className="animate-pulse" />
            <span className="font-bold text-sm tracking-wide">{globalAlert}</span>
            <button onClick={() => setGlobalAlert(null)} className="ml-2 hover:bg-red-500 rounded-full p-1 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between shrink-0 z-40 relative shadow-xl">
        
        <div>
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center transform rotate-45 shadow-lg shadow-rose-500/20">
                <div className="transform -rotate-45 text-white font-bold text-lg">!</div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black tracking-wide text-lg leading-tight">RESCUEGH</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest leading-none">DISPATCH CENTER</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Audio Toggle & Settings */}
        <div className="p-4 border-t border-slate-800 space-y-1.5">
          
          {/* Mute/Unmute Button */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              soundEnabled ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {soundEnabled ? <Bell size={20} /> : <BellOff size={20} />}
              Alert Chimes
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
              {soundEnabled ? 'ON' : 'MUTED'}
            </span>
          </button>

          <Link
            to="/system-settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive('/settings')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Settings size={20} />
            System Settings
          </Link>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;