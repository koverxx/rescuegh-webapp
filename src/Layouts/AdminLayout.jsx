import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, AlertOctagon, Map, Radio, Users, 
  Settings, Bell, Search, Menu, X 
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if link is active
  const isActive = (path) => location.pathname === path;

  // The Sidebar Navigation Links
  const navLinks = [
    { name: 'Dashboard', path: '/dispatch', icon: LayoutDashboard },
    { name: 'Active Incidents', path: '/dispatch/incidents', icon: AlertOctagon },
    { name: 'Live Map', path: '/dispatch/map', icon: Map },
    { name: 'Fleet & Units', path: '/dispatch/fleet', icon: Radio },
    { name: 'Citizen Records', path: '/dispatch/records', icon: Users },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-20 flex items-center px-6 border-b border-gray-800 bg-gray-950 shrink-0">
        <AlertOctagon className="w-8 h-8 text-red-500 mr-3" />
        <div>
          <h1 className="text-xl font-black tracking-wider text-white">RESCUE<span className="text-red-500">GH</span></h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Dispatch Center</p>
        </div>
        {/* Mobile Close Button */}
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden ml-auto text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button 
              key={link.name}
              onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${
                isActive(link.path) 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" /> {link.name}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 bg-gray-950 shrink-0">
        <button 
          onClick={() => { navigate('/dispatch/settings'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${
            isActive('/dispatch/settings') 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5 mr-3" /> System Settings
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex-col hidden md:flex z-20 shadow-xl shrink-0">
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="w-64 bg-gray-900 text-white flex flex-col relative z-50 h-full shadow-2xl animate-in slide-in-from-left">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10 shadow-sm shrink-0">
          <div className="flex items-center">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg mr-3"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search ID, Location, or Unit..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 lg:w-80 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-bold text-gray-900">{currentTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <p className="text-xs text-red-600 font-bold font-mono">
                {currentTime.toLocaleTimeString('en-GB', { hour12: false })} (GMT)
              </p>
            </div>
            
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            
            <div className="flex items-center border-l border-gray-200 pl-4 sm:pl-6 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 shrink-0">
                <span className="text-blue-700 font-bold">OP</span>
              </div>
              <div className="ml-3 hidden md:block text-left">
                <p className="text-sm font-bold text-gray-900">Operator 04</p>
                <p className="text-xs text-green-600 font-bold flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Active Shift
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* THIS IS WHERE THE PAGES RENDER */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;