import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Phone, MapPin, AlertTriangle, ArrowLeft, Search, Users, Settings } from 'lucide-react';
import MainLayout from "../Layouts/MainLayout";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);

  // Auto-redirect logic wired to React Router
  useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoRedirect && countdown === 0) {
      navigate('/home');
    }
  }, [countdown, autoRedirect, navigate]);

  // Real hardware sharing logic for the "Share Location" button
  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const mapLink = `http://googleusercontent.com/maps.google.com/?q=${latitude},${longitude}`;
          const shareText = `EMERGENCY: This is my current exact location: ${mapLink}`;

          if (navigator.share) {
            try {
              await navigator.share({ title: 'My Emergency Location', text: shareText });
            } catch (err) {
              console.log('Share cancelled');
            }
          } else {
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

  const quickActions = [
    { icon: Phone, label: 'Emergency Call', color: 'bg-red-500 hover:bg-red-600', action: () => window.location.href = 'tel:112' },
    { icon: MapPin, label: 'Share Location', color: 'bg-blue-500 hover:bg-blue-600', action: handleShareLocation },
    { icon: Users, label: 'Emergency Contacts', color: 'bg-green-500 hover:bg-green-600', action: () => navigate('/profile') },
  ];

  const navigationLinks = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Users, label: 'Contacts', path: '/profile' },
    { icon: MapPin, label: 'Location', path: '/nearby' },
    { icon: Settings, label: 'Settings', path: '/profile' },
  ];

  return (
    <MainLayout>
      <div className="min-h-[90vh] bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center py-8">
          {/* Main 404 Visual */}
          <div className="relative mb-8">
            <div className="text-8xl md:text-9xl font-bold text-red-200 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg border-4 border-white">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-gray-500 font-medium">
              Don't worry - you can still access all emergency features from here.
            </p>
          </div>

          {/* Quick Emergency Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Emergency Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`flex items-center justify-center space-x-3 p-4 rounded-xl text-white transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1 ${action.color}`}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="font-bold">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Options */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Where would you like to go?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {navigationLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => navigate(link.path)}
                  className="flex flex-col items-center space-y-2 p-4 rounded-xl border border-gray-100 hover:border-red-300 hover:bg-red-50 transition-all"
                >
                  <link.icon className="w-6 h-6 text-red-500" />
                  <span className="text-sm font-bold text-gray-700">{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Auto-redirect section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Auto-redirect to Home
              </h3>
              <button
                onClick={() => setAutoRedirect(!autoRedirect)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoRedirect ? 'bg-red-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    autoRedirect ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {autoRedirect ? (
              <div className="flex items-center justify-center space-x-3 text-red-600 font-medium bg-red-50 py-3 rounded-lg">
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Redirecting to home in <span className="font-bold text-red-700">{countdown}</span> seconds...</span>
              </div>
            ) : (
              <p className="text-gray-500 font-medium py-3">Auto-redirect disabled</p>
            )}
          </div>

          {/* Manual Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
            
            <button
              onClick={() => navigate('/home')}
              className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-gray-900 hover:bg-gray-800 shadow-sm text-white font-bold rounded-xl transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Go to Home</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}