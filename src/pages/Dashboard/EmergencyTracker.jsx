import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Users, 
  Phone, 
  Navigation,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  Plus,
  Filter,
  RefreshCw
} from 'lucide-react';

const EmergencyTracker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto refresh simulation
  useEffect(() => {
    if (autoRefresh) {
      const refreshTimer = setInterval(() => {
        // Simulate data refresh
        console.log('Refreshing data...');
      }, 30000);
      return () => clearInterval(refreshTimer);
    }
  }, [autoRefresh]);

  // Active emergency incidents
  const [emergencies, setEmergencies] = useState([
    {
      id: 'EMG-2024-001',
      type: 'Fire',
      title: 'Structure Fire - Residential',
      location: '1247 Oak Avenue, Sector 7',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      reportedTime: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      priority: 'critical',
      status: 'active',
      description: 'Large residential fire, multiple units involved. Evacuations in progress.',
      responders: [
        { unit: 'Engine 7', status: 'on-scene', eta: null },
        { unit: 'Ladder 3', status: 'en-route', eta: '2 min' },
        { unit: 'EMS Unit 12', status: 'on-scene', eta: null },
        { unit: 'Battalion Chief 1', status: 'en-route', eta: '5 min' }
      ],
      caller: 'Anonymous',
      contact: '911',
      updates: [
        { time: new Date(Date.now() - 45 * 60000), message: 'Initial report received' },
        { time: new Date(Date.now() - 40 * 60000), message: 'First responders dispatched' },
        { time: new Date(Date.now() - 35 * 60000), message: 'Engine 7 on scene' },
        { time: new Date(Date.now() - 30 * 60000), message: 'Evacuation initiated' }
      ]
    },
    {
      id: 'EMG-2024-002',
      type: 'Medical',
      title: 'Cardiac Emergency',
      location: 'Downtown Shopping Center, Mall Entrance',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      reportedTime: new Date(Date.now() - 20 * 60000), // 20 minutes ago
      priority: 'critical',
      status: 'active',
      description: 'Male, approx. 60 years old, cardiac arrest. CPR in progress by bystanders.',
      responders: [
        { unit: 'EMS Unit 5', status: 'on-scene', eta: null },
        { unit: 'EMS Unit 8', status: 'en-route', eta: '3 min' },
        { unit: 'Police Unit 15', status: 'on-scene', eta: null }
      ],
      caller: 'Sarah Johnson',
      contact: '(555) 123-4567',
      updates: [
        { time: new Date(Date.now() - 20 * 60000), message: 'Emergency reported' },
        { time: new Date(Date.now() - 18 * 60000), message: 'EMS dispatched' },
        { time: new Date(Date.now() - 12 * 60000), message: 'First unit on scene' },
        { time: new Date(Date.now() - 8 * 60000), message: 'Patient stabilized' }
      ]
    },
    {
      id: 'EMG-2024-003',
      type: 'Traffic',
      title: 'Multi-Vehicle Accident',
      location: 'Highway 95, Northbound Mile 23',
      coordinates: { lat: 40.6892, lng: -74.0445 },
      reportedTime: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      priority: 'high',
      status: 'active',
      description: '3-car collision blocking 2 lanes. Possible injuries reported.',
      responders: [
        { unit: 'Police Unit 22', status: 'on-scene', eta: null },
        { unit: 'EMS Unit 9', status: 'on-scene', eta: null },
        { unit: 'Fire Rescue 4', status: 'en-route', eta: '7 min' },
        { unit: 'Tow Truck', status: 'dispatched', eta: '15 min' }
      ],
      caller: 'John Martinez',
      contact: '(555) 987-6543',
      updates: [
        { time: new Date(Date.now() - 15 * 60000), message: 'Accident reported' },
        { time: new Date(Date.now() - 12 * 60000), message: 'Police on scene' },
        { time: new Date(Date.now() - 10 * 60000), message: 'Traffic control established' }
      ]
    },
    {
      id: 'EMG-2024-004',
      type: 'Weather',
      title: 'Storm Damage - Power Lines Down',
      location: 'Elm Street & 5th Avenue',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      reportedTime: new Date(Date.now() - 60 * 60000), // 1 hour ago
      priority: 'medium',
      status: 'monitoring',
      description: 'Multiple power lines down due to storm. Area cordoned off.',
      responders: [
        { unit: 'Utility Crew A', status: 'on-scene', eta: null },
        { unit: 'Police Unit 18', status: 'on-scene', eta: null },
        { unit: 'Fire Safety', status: 'standby', eta: null }
      ],
      caller: 'City Utilities',
      contact: '(555) 111-2222',
      updates: [
        { time: new Date(Date.now() - 60 * 60000), message: 'Power lines reported down' },
        { time: new Date(Date.now() - 55 * 60000), message: 'Area secured' },
        { time: new Date(Date.now() - 30 * 60000), message: 'Utility crew on site' }
      ]
    }
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white border-red-600';
      case 'high': return 'bg-orange-500 text-white border-orange-600';
      case 'medium': return 'bg-yellow-500 text-white border-yellow-600';
      case 'low': return 'bg-green-500 text-white border-green-600';
      default: return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResponderStatusColor = (status) => {
    switch (status) {
      case 'on-scene': return 'text-green-600 bg-green-50';
      case 'en-route': return 'text-blue-600 bg-blue-50';
      case 'dispatched': return 'text-orange-600 bg-orange-50';
      case 'standby': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Fire': return '🔥';
      case 'Medical': return '🚑';
      case 'Traffic': return '🚗';
      case 'Weather': return '⛈️';
      case 'Hazmat': return '☢️';
      case 'Rescue': return '🚁';
      default: return '🚨';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m ago`;
    return date.toLocaleDateString();
  };

  const filteredEmergencies = emergencies.filter(emergency => {
    const matchesPriority = selectedPriority === 'all' || emergency.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || emergency.status === selectedStatus;
    return matchesPriority && matchesStatus;
  });

  const criticalCount = emergencies.filter(e => e.priority === 'critical').length;
  const activeCount = emergencies.filter(e => e.status === 'active').length;

  return (
    <MainLayout>
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="h-6 w-6 text-red-500" />
                Emergency Tracker
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time emergency incident monitoring and response coordination
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-mono font-bold text-gray-900">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-600">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg transition-colors ${
                  autoRefresh ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Incidents</p>
                <p className="text-2xl font-bold text-gray-900">{emergencies.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Units Deployed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {emergencies.reduce((total, emergency) => total + emergency.responders.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Plus className="h-4 w-4" />
              New Emergency
            </button>
          </div>
        </div>

        {/* Emergency Incidents */}
        <div className="space-y-6">
          {filteredEmergencies.map((emergency) => (
            <div key={emergency.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{getTypeIcon(emergency.type)}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{emergency.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <span className="font-mono">{emergency.id}</span>
                        <span>•</span>
                        <span>{emergency.type}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(emergency.reportedTime)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(emergency.status)}`}>
                      {emergency.status.charAt(0).toUpperCase() + emergency.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPriorityColor(emergency.priority)}`}>
                      {emergency.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Location and Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{emergency.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Caller: {emergency.caller} - {emergency.contact}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-gray-700 text-sm">{emergency.description}</p>
                </div>

                {/* Responders */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Response Units</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {emergency.responders.map((responder, index) => (
                      <div key={index} className={`p-2 rounded-lg border text-sm ${getResponderStatusColor(responder.status)}`}>
                        <div className="font-medium">{responder.unit}</div>
                        <div className="text-xs">
                          {responder.status} {responder.eta && `(ETA: ${responder.eta})`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest Updates */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Updates</h4>
                  <div className="space-y-1">
                    {emergency.updates.slice(-3).reverse().map((update, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Clock className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-500 font-mono text-xs">
                          {update.time.toLocaleTimeString()}
                        </span>
                        <span className="text-gray-700">{update.message}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm">
                    <Navigation className="h-3 w-3" />
                    View Map
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm">
                    <Phone className="h-3 w-3" />
                    Contact
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm">
                    <Plus className="h-3 w-3" />
                    Add Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredEmergencies.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active emergencies</h3>
            <p className="text-gray-600">All emergencies matching your filters have been resolved</p>
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  );
};

export default EmergencyTracker;