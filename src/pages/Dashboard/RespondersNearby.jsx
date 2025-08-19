import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Radio, 
  Clock, 
  User, 
  Truck,
  Activity,
  Shield,
  Heart,
  Flame,
  Search,
  Filter,
  SortAsc,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Battery,
  Signal,
  Route
} from 'lucide-react';

const RespondersNearby = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [selectedLocation, setSelectedLocation] = useState({ lat: 40.7128, lng: -74.0060, address: 'Times Square, NYC' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Sample responder data
  const responders = [
    {
      id: 'ENG-07',
      name: 'Engine 7',
      type: 'Fire',
      status: 'available',
      location: { lat: 40.7149, lng: -74.0087, address: '45 West 42nd Street' },
      distance: 0.8,
      eta: 3,
      crew: [
        { name: 'Captain Smith', role: 'Captain', years: 12 },
        { name: 'Lt. Johnson', role: 'Lieutenant', years: 8 },
        { name: 'FF Martinez', role: 'Firefighter', years: 4 },
        { name: 'FF Chen', role: 'Firefighter', years: 6 }
      ],
      equipment: ['Pump', 'Hose', 'Ladder', 'Rescue Tools', 'Medical Kit'],
      capabilities: ['Fire Suppression', 'Water Rescue', 'Vehicle Extrication', 'Medical First Aid'],
      lastUpdate: new Date(Date.now() - 5 * 60000),
      radio: 'Fire-1',
      contact: '(555) fire-007',
      batteryLevel: 85,
      signalStrength: 'strong'
    },
    {
      id: 'EMS-12',
      name: 'EMS Unit 12',
      type: 'Medical',
      status: 'available',
      location: { lat: 40.7102, lng: -74.0051, address: '125 Broadway' },
      distance: 0.5,
      eta: 2,
      crew: [
        { name: 'Paramedic Davis', role: 'Paramedic', years: 10 },
        { name: 'EMT Wilson', role: 'EMT', years: 3 }
      ],
      equipment: ['Defibrillator', 'Oxygen', 'Medications', 'Stretcher', 'Trauma Kit'],
      capabilities: ['Advanced Life Support', 'Cardiac Care', 'Trauma Response', 'Patient Transport'],
      lastUpdate: new Date(Date.now() - 2 * 60000),
      radio: 'EMS-12',
      contact: '(555) ems-0012',
      batteryLevel: 92,
      signalStrength: 'excellent'
    },
    {
      id: 'POL-15',
      name: 'Police Unit 15',
      type: 'Police',
      status: 'available',
      location: { lat: 40.7114, lng: -74.0134, address: '200 West 40th Street' },
      distance: 1.2,
      eta: 4,
      crew: [
        { name: 'Officer Brown', role: 'Officer', years: 7 },
        { name: 'Officer Taylor', role: 'Officer', years: 5 }
      ],
      equipment: ['Patrol Vehicle', 'Communications', 'First Aid', 'Traffic Control'],
      capabilities: ['Traffic Control', 'Crowd Management', 'Security', 'First Aid'],
      lastUpdate: new Date(Date.now() - 8 * 60000),
      radio: 'Police-15',
      contact: '(555) pol-0015',
      batteryLevel: 78,
      signalStrength: 'good'
    },
    {
      id: 'LAD-03',
      name: 'Ladder 3',
      type: 'Fire',
      status: 'busy',
      location: { lat: 40.7200, lng: -74.0100, address: '300 West 50th Street' },
      distance: 1.5,
      eta: 6,
      crew: [
        { name: 'Captain Rodriguez', role: 'Captain', years: 15 },
        { name: 'Lt. Anderson', role: 'Lieutenant', years: 9 },
        { name: 'FF Thompson', role: 'Firefighter', years: 2 },
        { name: 'FF Lee', role: 'Firefighter', years: 7 }
      ],
      equipment: ['Aerial Ladder', 'Rescue Tools', 'Ventilation Equipment', 'Hose'],
      capabilities: ['High Angle Rescue', 'Ventilation', 'Search & Rescue', 'Fire Suppression'],
      lastUpdate: new Date(Date.now() - 15 * 60000),
      radio: 'Fire-3',
      contact: '(555) fire-003',
      batteryLevel: 45,
      signalStrength: 'fair',
      currentCall: 'Structure Fire - 456 Main St'
    },
    {
      id: 'EMS-05',
      name: 'EMS Unit 5',
      type: 'Medical',
      status: 'en-route',
      location: { lat: 40.7180, lng: -74.0070, address: '789 8th Avenue' },
      distance: 1.8,
      eta: 7,
      crew: [
        { name: 'Paramedic Garcia', role: 'Paramedic', years: 12 },
        { name: 'EMT Jackson', role: 'EMT', years: 4 }
      ],
      equipment: ['Advanced Life Support', 'Cardiac Monitor', 'Medications', 'Stretcher'],
      capabilities: ['Advanced Life Support', 'Critical Care Transport', 'Pediatric Care'],
      lastUpdate: new Date(Date.now() - 3 * 60000),
      radio: 'EMS-05',
      contact: '(555) ems-0005',
      batteryLevel: 67,
      signalStrength: 'good',
      currentCall: 'Medical Emergency - City Hospital'
    },
    {
      id: 'POL-22',
      name: 'Police Unit 22',
      type: 'Police',
      status: 'available',
      location: { lat: 40.7090, lng: -74.0020, address: '100 Centre Street' },
      distance: 2.1,
      eta: 8,
      crew: [
        { name: 'Sergeant Miller', role: 'Sergeant', years: 11 },
        { name: 'Officer White', role: 'Officer', years: 6 }
      ],
      equipment: ['K-9 Unit', 'Traffic Equipment', 'Communications', 'First Aid'],
      capabilities: ['K-9 Operations', 'Traffic Enforcement', 'Drug Detection', 'Crowd Control'],
      lastUpdate: new Date(Date.now() - 12 * 60000),
      radio: 'Police-22',
      contact: '(555) pol-0022',
      batteryLevel: 89,
      signalStrength: 'excellent'
    },
    {
      id: 'HAZ-01',
      name: 'Hazmat Unit 1',
      type: 'Hazmat',
      status: 'available',
      location: { lat: 40.7050, lng: -74.0100, address: '500 West Street' },
      distance: 2.5,
      eta: 10,
      crew: [
        { name: 'Specialist Murphy', role: 'Hazmat Specialist', years: 14 },
        { name: 'Tech Adams', role: 'Hazmat Tech', years: 8 },
        { name: 'FF Clark', role: 'Firefighter', years: 5 }
      ],
      equipment: ['Detection Equipment', 'Containment Gear', 'Decontamination', 'Protective Suits'],
      capabilities: ['Chemical Spill Response', 'Decontamination', 'Air Monitoring', 'Containment'],
      lastUpdate: new Date(Date.now() - 20 * 60000),
      radio: 'Hazmat-1',
      contact: '(555) haz-0001',
      batteryLevel: 72,
      signalStrength: 'good'
    },
    {
      id: 'RES-04',
      name: 'Rescue 4',
      type: 'Rescue',
      status: 'maintenance',
      location: { lat: 40.7250, lng: -74.0150, address: '800 West 55th Street' },
      distance: 3.2,
      eta: 12,
      crew: [
        { name: 'Captain Lewis', role: 'Captain', years: 16 },
        { name: 'Specialist King', role: 'Rescue Specialist', years: 10 },
        { name: 'Tech Parker', role: 'Rescue Tech', years: 6 }
      ],
      equipment: ['Heavy Rescue Tools', 'Cutting Equipment', 'Lifting Bags', 'Rope Rescue'],
      capabilities: ['Technical Rescue', 'Vehicle Extrication', 'Collapse Rescue', 'Confined Space'],
      lastUpdate: new Date(Date.now() - 45 * 60000),
      radio: 'Rescue-4',
      contact: '(555) res-0004',
      batteryLevel: 58,
      signalStrength: 'fair'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-red-100 text-red-800 border-red-200';
      case 'en-route': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Fire': return <Flame className="h-5 w-5 text-red-500" />;
      case 'Medical': return <Heart className="h-5 w-5 text-red-500" />;
      case 'Police': return <Shield className="h-5 w-5 text-blue-500" />;
      case 'Hazmat': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'Rescue': return <Activity className="h-5 w-5 text-purple-500" />;
      default: return <Truck className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSignalIcon = (strength) => {
    switch (strength) {
      case 'excellent': return <Signal className="h-4 w-4 text-green-500" />;
      case 'good': return <Signal className="h-4 w-4 text-blue-500" />;
      case 'fair': return <Signal className="h-4 w-4 text-yellow-500" />;
      case 'poor': return <Signal className="h-4 w-4 text-red-500" />;
      default: return <Signal className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBatteryColor = (level) => {
    if (level >= 75) return 'text-green-500';
    if (level >= 50) return 'text-yellow-500';
    if (level >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  const filteredResponders = responders.filter(responder => {
    const matchesSearch = responder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         responder.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         responder.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || responder.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || responder.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedResponders = [...filteredResponders].sort((a, b) => {
    switch (sortBy) {
      case 'distance': return a.distance - b.distance;
      case 'eta': return a.eta - b.eta;
      case 'name': return a.name.localeCompare(b.name);
      case 'type': return a.type.localeCompare(b.type);
      case 'status': return a.status.localeCompare(b.status);
      default: return 0;
    }
  });

  const responderTypes = [...new Set(responders.map(r => r.type))];
  const availableCount = responders.filter(r => r.status === 'available').length;
  const busyCount = responders.filter(r => r.status === 'busy').length;

  return (
    <MainLayout>
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 flex items-center gap-2">
                <Navigation className="h-6 w-6 text-blue-500" />
                Responders Nearby
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time location and status of emergency responders
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Current Location</div>
              <div className="text-lg font-semibold text-gray-900">{selectedLocation.address}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Busy</p>
                <p className="text-2xl font-bold text-gray-900">{busyCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-gray-900">{responders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Personnel</p>
                <p className="text-2xl font-bold text-gray-900">
                  {responders.reduce((total, responder) => total + responder.crew.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search responders, units, or locations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                {responderTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="en-route">En Route</option>
                <option value="maintenance">Maintenance</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="distance">Sort by Distance</option>
                <option value="eta">Sort by ETA</option>
                <option value="name">Sort by Name</option>
                <option value="type">Sort by Type</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responders List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedResponders.map((responder) => (
            <div key={responder.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(responder.type)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{responder.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-mono">{responder.id}</span>
                        <span>•</span>
                        <span>{responder.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(responder.status)}`}>
                      {responder.status.charAt(0).toUpperCase() + responder.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Distance and ETA */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Route className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{responder.distance} mi away</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">ETA: {responder.eta} min</span>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{responder.location.address}</span>
                  </div>
                </div>

                {/* Current Call (if busy) */}
                {responder.currentCall && (
                  <div className="mb-4 p-2 bg-red-50 rounded-lg">
                    <div className="text-sm font-medium text-red-800">Current Call:</div>
                    <div className="text-sm text-red-700">{responder.currentCall}</div>
                  </div>
                )}

                {/* Crew */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Crew ({responder.crew.length})</h4>
                  <div className="space-y-1">
                    {responder.crew.map((member, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{member.name}</span>
                        <span className="text-gray-500">{member.role} • {member.years}y</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Capabilities</h4>
                  <div className="flex flex-wrap gap-1">
                    {responder.capabilities.map((capability, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Battery className={`h-4 w-4 ${getBatteryColor(responder.batteryLevel)}`} />
                      <span>{responder.batteryLevel}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getSignalIcon(responder.signalStrength)}
                      <span className="capitalize">{responder.signalStrength}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated {Math.floor((currentTime - responder.lastUpdate) / 60000)}m ago</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <button className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm">
                    <Phone className="h-3 w-3" />
                    Call
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm">
                    <Radio className="h-3 w-3" />
                    Radio
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm">
                    <Navigation className="h-3 w-3" />
                    Navigate
                  </button>
                  <button 
                    className={`flex items-center gap-1 px-3 py-1 rounded transition-colors text-sm ${
                      responder.status === 'available' 
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={responder.status !== 'available'}
                  >
                    <UserCheck className="h-3 w-3" />
                    Dispatch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedResponders.length === 0 && (
          <div className="text-center py-12">
            <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No responders found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  );
};

export default RespondersNearby;