import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, Phone, MapPin, Users, Heart, Shield, 
  Bell, User, Plus, Activity, PhoneCall, Car, 
  Flame, Stethoscope, AlertCircle, CheckCircle, X, Navigation
} from 'lucide-react';
import logo from '../../assets/rescueGH-Logo.png';
import MainLayout from '../../Layouts/MainLayout.jsx';

import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const EmergencyHomePage = () => {
  const navigate = useNavigate();

  const [sosPressed, setSosPressed] = useState(false);
  const [userName, setUserName] = useState('Citizen'); 
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const nameToDisplay = user.displayName || user.email.split('@')[0];
        setUserName(nameToDisplay);
      } else {
        navigate('/login'); 
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Dynamic Rotating Alerts
  const activeAlerts = [
    {
      id: 1,
      type: 'weather',
      title: '🌧 GMet Heavy Rain Alert',
      message: 'Flash flood warnings in Accra Central and Circle until 8 PM.',
      severity: 'high',
      time: '1 hour ago'
    },
    {
      id: 2,
      type: 'traffic',
      title: '🚧 Road Closure Notice',
      message: 'Major accident on the N1 Highway near Dzorwulu. Expect severe delays.',
      severity: 'medium',
      time: '15 mins ago'
    },
    {
      id: 3,
      type: 'utility',
      title: '⚡ ECG Emergency Outage',
      message: 'Unplanned grid maintenance affecting Madina and East Legon.',
      severity: 'low',
      time: '3 hours ago'
    }
  ];

  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  // Rotate alerts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % activeAlerts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeAlerts.length]);

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'update',
      title: 'Profile Updated',
      time: 'Today 10:24 AM',
      status: 'completed'
    }
  ]);

  const [sosTimer, setSosTimer] = useState(null);
  const [countdown, setCountdown] = useState(5);

  const emergencyCategories = [
    { id: 'medical', name: 'Medical', icon: Stethoscope, color: 'bg-red-500', description: 'Health emergencies' },
    { id: 'fire', name: 'Fire', icon: Flame, color: 'bg-orange-500', description: 'Fire incidents' },
    { id: 'police', name: 'Police', icon: Shield, color: 'bg-blue-500', description: 'Crime & safety' },
    { id: 'accident', name: 'Accident', icon: Car, color: 'bg-yellow-500', description: 'Vehicle accidents' },
    { id: 'natural', name: 'Natural', icon: AlertTriangle, color: 'bg-green-500', description: 'Natural disasters' },
    { id: 'other', name: 'Other', icon: Plus, color: 'bg-gray-500', description: 'Other emergencies' }
  ];

  // INTERACTIVE QUICK ACTIONS
  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const shareText = `EMERGENCY: This is my current exact location. Please check on me: ${mapLink}`;

          // If on mobile, open native sharing (WhatsApp, SMS, etc)
          if (navigator.share) {
            try {
              await navigator.share({
                title: 'My Emergency Location',
                text: shareText,
              });
            } catch (err) {
              console.log('Share cancelled');
            }
          } else {
            // Fallback for desktop
            navigator.clipboard.writeText(shareText);
            alert('Live GPS Link copied to clipboard! Paste it to your contacts.');
          }
        },
        () => alert('Please enable GPS to share your live location.')
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSafetyCheck = () => {
    const confirmCheck = window.confirm("Do you want to broadcast an 'I am Safe' status to all your saved Emergency Contacts?");
    if (confirmCheck) {
      // Simulate network request
      setTimeout(() => {
        alert("✅ Safety Check-in successful! Your contacts have been notified.");
      }, 800);
    }
  };

  const quickActions = [
    { id: 'call-112', name: 'Call 112', icon: Phone, color: 'bg-red-600', action: () => window.location.href = 'tel:112' },
    { id: 'share-location', name: 'Share Location', icon: MapPin, color: 'bg-blue-600', action: handleShareLocation },
    { id: 'medical-id', name: 'Medical ID', icon: Heart, color: 'bg-pink-600', action: () => navigate('/profile') },
    { id: 'safe-check', name: 'Safety Check', icon: CheckCircle, color: 'bg-green-600', action: handleSafetyCheck }
  ];

  const handleSOSPress = () => {
    setSosPressed(true);
    setCountdown(5);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/report', { state: { prefilledPriority: 'critical' } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setSosTimer(timer);
  };

  const handleSOSCancel = () => {
    if (sosTimer) {
      clearInterval(sosTimer);
      setSosTimer(null);
    }
    setSosPressed(false);
    setCountdown(5);
  };

  const handleEmergencyCategory = (category) => {
    navigate('/report', { state: { prefilledType: category.id } });
  };

  const currentAlert = activeAlerts[currentAlertIndex];

  return (
    <MainLayout>
      {/* UPGRADED HEADER */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            
            {/* MASSIVE LOGO */}
            <div className="flex items-center">
               <img src={logo} alt="RescueGH Logo" className="h-20 md:h-24 w-auto drop-shadow-sm transition-all" />
            </div>
            
            {/* Interactive Icons */}
            <div className="flex items-center space-x-6">
              
              {/* Dynamic Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-8 h-8 text-gray-700" />
                  <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white text-[10px] font-bold text-white">
                    {activeAlerts.length}
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-4">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                    </div>
                    {activeAlerts.map(alert => (
                      <div key={alert.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">
                        <p className="text-sm font-bold text-gray-800 truncate">{alert.title}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{alert.message}</p>
                      </div>
                    ))}
                    <div className="px-4 py-2 text-center">
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-800">View All</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Prominent Profile Avatar Button */}
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-full hover:bg-blue-100 transition-all border-2 border-blue-200 hover:border-blue-400 shadow-sm"
              >
                <User className="w-7 h-7 text-blue-600" />
              </button>

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Personalized Greeting */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Stay Safe, {userName}</h1>
          <p className="text-gray-600 text-lg mt-1">Your emergency dashboard is active and monitoring.</p>
        </div>

        {/* ROTATING LIVE ALERTS */}
        <div className="mb-8 h-28 relative">
          <div key={currentAlert.id} className={`absolute w-full rounded-xl border-l-4 p-5 shadow-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 ${
            currentAlert.severity === 'high' ? 'bg-red-50 border-red-500' :
            currentAlert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
            'bg-blue-50 border-blue-500'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <AlertCircle className={`w-6 h-6 mt-0.5 mr-4 shrink-0 ${
                  currentAlert.severity === 'high' ? 'text-red-600' :
                  currentAlert.severity === 'medium' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{currentAlert.title}</h3>
                  <p className="text-gray-700 mt-1 line-clamp-1">{currentAlert.message}</p>
                  <p className="text-gray-500 text-xs mt-2 font-medium uppercase tracking-wider">{currentAlert.time}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SOS Button Section */}
        <div className="mb-12">
          <div className="text-center">
            <div className="relative inline-block">
              <button
                onClick={sosPressed ? handleSOSCancel : handleSOSPress}
                className={`relative w-48 h-48 rounded-full border-8 font-bold text-white text-2xl transition-all duration-300 transform ${
                  sosPressed 
                    ? 'bg-red-600 border-red-400 animate-pulse scale-110 shadow-2xl' 
                    : 'bg-red-500 border-red-200 hover:bg-red-600 hover:scale-105 active:scale-95 shadow-xl hover:border-red-300'
                }`}
              >
                {sosPressed ? (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl font-black mb-1">{countdown}</span>
                    <span className="text-xs tracking-widest opacity-90">TAP TO CANCEL</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <AlertTriangle className="w-12 h-12 mb-2" />
                    <span className="tracking-wider">SOS</span>
                  </div>
                )}
              </button>
              
              {sosPressed && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
              )}
            </div>
            
            <p className="text-gray-600 mt-6 font-medium text-lg">
              {sosPressed ? 'Connecting to emergency dispatch...' : 'Press and hold for immediate assistance'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map(action => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`${action.color} text-white rounded-xl p-5 text-center hover:opacity-90 transition-all transform hover:-translate-y-1 shadow-md`}
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-3 opacity-90" />
                  <span className="text-sm font-bold tracking-wide">{action.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Emergency Categories */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Report Specific Emergency</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {emergencyCategories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleEmergencyCategory(category)}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all transform hover:-translate-y-1 text-left"
                >
                  <div className={`${category.color} w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-inner`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Grid for Resources & Activity */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="font-bold text-gray-900 p-5 bg-gray-50/50 border-b border-gray-100 flex items-center text-lg">
              <Activity className="w-6 h-6 mr-3 text-blue-600" />
              Recent Activity
            </h3>
            {recentActivity.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4 border border-blue-100">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => navigate('/history')}
                  className="w-full p-4 text-sm text-blue-600 font-bold hover:bg-blue-50 transition-colors"
                >
                  View Full History
                </button>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No recent activity</p>
              </div>
            )}
          </div>

          {/* Safety Resources */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center text-lg">
              <MapPin className="w-6 h-6 mr-3 text-red-500" />
              Resources Near You
            </h3>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/nearby')}
                className="w-full flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:bg-red-50 hover:border-red-100 transition-colors group"
              >
                <div className="flex items-center text-gray-700">
                  <Stethoscope className="w-5 h-5 mr-4 text-red-500" />
                  <span className="font-bold group-hover:text-red-700 transition-colors">Nearest Hospital</span>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/nearby')}
                className="w-full flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-colors group"
              >
                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 mr-4 text-blue-500" />
                  <span className="font-bold group-hover:text-blue-700 transition-colors">Police Station</span>
                </div>
              </button>

              <button 
                onClick={() => navigate('/nearby')}
                className="w-full flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:bg-orange-50 hover:border-orange-100 transition-colors group"
              >
                <div className="flex items-center text-gray-700">
                  <Flame className="w-5 h-5 mr-4 text-orange-500" />
                  <span className="font-bold group-hover:text-orange-700 transition-colors">Fire Station</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </MainLayout>
  );
};

export default EmergencyHomePage;