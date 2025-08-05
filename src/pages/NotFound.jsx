import React, { useState, useEffect } from 'react';
import { Home, Phone, MapPin, AlertTriangle, ArrowLeft, Search, Users, Settings } from 'lucide-react';

export default function NotFoundPage() {
  const [countdown, setCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoRedirect && countdown === 0) {
      // In a real app, you'd redirect to home here
      console.log('Redirecting to home...');
    }
  }, [countdown, autoRedirect]);

  const quickActions = [
    { icon: Phone, label: 'Emergency Call', color: 'bg-red-500 hover:bg-red-600', action: () => console.log('Emergency call') },
    { icon: MapPin, label: 'Share Location', color: 'bg-blue-500 hover:bg-blue-600', action: () => console.log('Share location') },
    { icon: Users, label: 'Emergency Contacts', color: 'bg-green-500 hover:bg-green-600', action: () => console.log('Emergency contacts') },
  ];

  const navigationLinks = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Contacts', path: '/contacts' },
    { icon: MapPin, label: 'Location', path: '/location' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Main 404 Visual */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-bold text-red-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Don't worry - you can still access all emergency features from here.
          </p>
        </div>

        {/* Quick Emergency Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Emergency Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`flex items-center justify-center space-x-3 p-4 rounded-lg text-white transition-all duration-200 transform hover:scale-105 ${action.color}`}
              >
                <action.icon className="w-5 h-5" />
                <span className="font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Options */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Where would you like to go?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {navigationLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => console.log(`Navigate to ${link.path}`)}
                className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors"
              >
                <link.icon className="w-6 h-6 text-red-500" />
                <span className="text-sm font-medium text-gray-700">{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Auto-redirect section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Auto-redirect to Home
            </h3>
            <button
              onClick={() => setAutoRedirect(!autoRedirect)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRedirect ? 'bg-red-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRedirect ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {autoRedirect ? (
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Redirecting to home in {countdown} seconds...</span>
            </div>
          ) : (
            <p className="text-gray-500">Auto-redirect disabled</p>
          )}
        </div>

        {/* Manual Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => console.log('Go back')}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          
          <button
            onClick={() => console.log('Go to home')}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for a page or feature..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>If you need immediate assistance, use the emergency actions above.</p>
        </div>
      </div>
    </div>
  );
}