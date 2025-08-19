import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Users, 
  Heart, 
  Shield, 
  Navigation,
  Clock,
  Battery,
  Wifi,
  Signal,
  Bell,
  Settings,
  User,
  Plus,
  Zap,
  Activity,
  PhoneCall,
  Car,
  Flame,
  Stethoscope,
  Home,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import logo from '../../assets/rescueGH-Logo.png';
import kenteBg from '../../assets/kente.png';
import MainLayout from '../../Layouts/MainLayout.jsx';

const EmergencyHomePage = () => {
  const [locationStatus, setLocationStatus] = useState('active');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [sosPressed, setSosPressed] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      type: 'weather',
      title: '🌧 Ghana Meteorological Agency (GMet) flood/rain alerts',
      message: 'Flood warning in your area until 6 PM',
      severity: 'medium',
      time: '2 hours ago'
    }
  ]);
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'test',
      title: 'Emergency Test Call',
      time: 'Yesterday 3:45 PM',
      status: 'completed'
    }
  ]);

  const [sosTimer, setSosTimer] = useState(null);
  const [countdown, setCountdown] = useState(0);

  // Emergency categories
  const emergencyCategories = [
    {
      id: 'medical',
      name: 'Medical',
      icon: Stethoscope,
      color: 'bg-red-500',
      description: 'Health emergencies'
    },
    {
      id: 'fire',
      name: 'Fire',
      icon: Flame,
      color: 'bg-orange-500',
      description: 'Fire incidents'
    },
    {
      id: 'police',
      name: 'Police',
      icon: Shield,
      color: 'bg-blue-500',
      description: 'Crime & safety'
    },
    {
      id: 'accident',
      name: 'Accident',
      icon: Car,
      color: 'bg-yellow-500',
      description: 'Vehicle accidents'
    },
    {
      id: 'natural',
      name: 'Natural',
      icon: AlertTriangle,
      color: 'bg-green-500',
      description: 'Natural disasters'
    },
    {
      id: 'other',
      name: 'Other',
      icon: Plus,
      color: 'bg-gray-500',
      description: 'Other emergencies'
    }
  ];

  // Quick actions
  const quickActions = [
    {
      id: 'call-112',
      name: 'Call 112',
      icon: Phone,
      color: 'bg-red-600',
      action: () => handleQuickCall('911')
    },
    {
      id: 'share-location',
      name: 'Share Location',
      icon: MapPin,
      color: 'bg-blue-600',
      action: () => handleShareLocation()
    },
    {
      id: 'medical-id',
      name: 'Medical ID',
      icon: Heart,
      color: 'bg-pink-600',
      action: () => handleMedicalId()
    },
    {
      id: 'safe-check',
      name: 'Safety Check',
      icon: CheckCircle,
      color: 'bg-green-600',
      action: () => handleSafetyCheck()
    }
  ];

  const handleSOSPress = () => {
    setSosPressed(true);
    setCountdown(5);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Trigger emergency call
          handleEmergencyCall();
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
    setCountdown(0);
  };

  const handleEmergencyCall = () => {
    // Simulate emergency call
    console.log('Emergency call initiated');
    setSosPressed(false);
    alert('Emergency services have been contacted. Help is on the way!');
  };

  const handleQuickCall = (number) => {
    console.log(`Calling ${number}`);
    alert(`Calling ${number}...`);
  };

  const handleShareLocation = () => {
    console.log('Sharing location');
    alert('Location shared with emergency contacts');
  };

  const handleMedicalId = () => {
    console.log('Opening medical ID');
    alert('Medical ID displayed for first responders');
  };

  const handleSafetyCheck = () => {
    console.log('Safety check');
    alert('Safety check-in sent to emergency contacts');
  };

  const handleEmergencyCategory = (category) => {
    console.log(`Selected emergency category: ${category.name}`);
    alert(`Reporting ${category.name} emergency...`);
  };

  const dismissAlert = (alertId) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <MainLayout>
    {/* <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 bg-opacity-80 backdrop-blur-sm p-6"> */}
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center">
               <img src={logo} alt="RescueGH Logo" className="h-30 w-auto" />
                {/* <h1 className="text-xl font-bold text-gray-900">Rescue GH</h1> */}
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  locationStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <MapPin className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <Wifi className="w-4 h-4 text-gray-500" />
              </div>
              <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              <User className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Active Alerts</h2>
            <div className="space-y-3">
              {activeAlerts.map(alert => (
                <div key={alert.id} className={`rounded-lg border-l-4 p-4 ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-500' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <AlertCircle className={`w-5 h-5 mt-0.5 mr-3 ${
                        alert.severity === 'high' ? 'text-red-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <div>
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <p className="text-gray-700 text-sm mt-1">{alert.message}</p>
                        <p className="text-gray-500 text-xs mt-2">{alert.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOS Button Section */}
        <div className="mb-8">
          <div className="text-center">
            <div className="relative inline-block">
              <button
                onClick={sosPressed ? handleSOSCancel : handleSOSPress}
                className={`relative w-40 h-40 rounded-full border-8 font-bold text-white text-xl transition-all duration-300 transform ${
                  sosPressed 
                    ? 'bg-red-600 border-red-400 animate-pulse scale-110' 
                    : 'bg-red-500 border-red-300 hover:bg-red-600 hover:scale-105 active:scale-95'
                }`}
              >
                {sosPressed ? (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{countdown}</span>
                    <span className="text-sm">TAP TO CANCEL</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <AlertTriangle className="w-8 h-8 mb-2" />
                    <span>SOS</span>
                  </div>
                )}
              </button>
              
              {sosPressed && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
              )}
            </div>
            
            <p className="text-gray-600 mt-4 text-sm">
              {sosPressed 
                ? 'Canceling emergency call...' 
                : 'Press and hold for emergency assistance'
              }
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map(action => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`${action.color} text-white rounded-lg p-4 text-center hover:opacity-90 transition-opacity transform hover:scale-105 active:scale-95`}
                >
                  <IconComponent className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{action.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Emergency Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Emergency</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {emergencyCategories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleEmergencyCategory(category)}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors transform hover:scale-105 active:scale-95"
                >
                  <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg border border-gray-200">
            {recentActivity.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <Activity className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Safety Resources */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Nearby Resources
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nearest Hospital</span>
                <span className="text-sm font-medium text-blue-600">0.8 mi</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Police Station</span>
                <span className="text-sm font-medium text-blue-600">1.2 mi</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fire Station</span>
                <span className="text-sm font-medium text-blue-600">0.5 mi</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              Emergency Contacts
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Primary Contact</span>
                <PhoneCall className="w-4 h-4 text-green-600 cursor-pointer" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Secondary Contact</span>
                <PhoneCall className="w-4 h-4 text-green-600 cursor-pointer" />
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                + Add Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    {/* </div> */}
     </MainLayout>
  );
};

export default EmergencyHomePage;