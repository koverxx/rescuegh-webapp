import React, { useState } from 'react';
import { Calendar, MapPin, Clock, AlertTriangle, CheckCircle, XCircle, Filter, Search } from 'lucide-react';
import MainLayout from '../../Layouts/MainLayout';

const EmergencyHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Sample emergency data
  const emergencies = [
    {
      id: 1,
      type: 'Fire',
      title: 'Apartment Building Fire',
      location: '123 Main St, Downtown',
      date: '2024-07-10',
      time: '14:30',
      status: 'resolved',
      priority: 'high',
      description: 'Kitchen fire in apartment 4B, evacuated building, fire contained within 45 minutes.',
      responders: ['Fire Department', 'EMS', 'Police'],
      duration: '2 hours 15 minutes'
    },
    {
      id: 2,
      type: 'Medical',
      title: 'Cardiac Emergency',
      location: 'Central Park, North Entrance',
      date: '2024-07-09',
      time: '09:15',
      status: 'resolved',
      priority: 'critical',
      description: 'Male, 55, cardiac arrest during morning jog. CPR administered, transported to hospital.',
      responders: ['EMS', 'Police'],
      duration: '35 minutes'
    },
    {
      id: 3,
      type: 'Traffic',
      title: 'Multi-Vehicle Accident',
      location: 'Highway 101, Mile Marker 45',
      date: '2024-07-08',
      time: '17:45',
      status: 'resolved',
      priority: 'medium',
      description: '3-car collision during rush hour. Two injuries, both non-life threatening.',
      responders: ['Police', 'EMS', 'Fire Department'],
      duration: '1 hour 30 minutes'
    },
    {
      id: 4,
      type: 'Weather',
      title: 'Storm Damage Response',
      location: 'Oak Street Neighborhood',
      date: '2024-07-07',
      time: '22:00',
      status: 'in-progress',
      priority: 'medium',
      description: 'Multiple trees down, power lines damaged due to severe thunderstorm.',
      responders: ['Fire Department', 'Utility Company'],
      duration: 'Ongoing'
    },
    {
      id: 5,
      type: 'Hazmat',
      title: 'Chemical Spill',
      location: 'Industrial District, Factory Row',
      date: '2024-07-06',
      time: '11:20',
      status: 'resolved',
      priority: 'high',
      description: 'Minor chemical spill contained, area evacuated as precaution.',
      responders: ['Fire Department', 'Hazmat Team', 'Police'],
      duration: '4 hours 10 minutes'
    },
    {
      id: 6,
      type: 'Rescue',
      title: 'Water Rescue',
      location: 'Riverside Park, Boat Launch',
      date: '2024-07-05',
      time: '16:30',
      status: 'cancelled',
      priority: 'low',
      description: 'Reported person in distress in river. False alarm - was a training exercise.',
      responders: ['Fire Department', 'Water Rescue Team'],
      duration: '25 minutes'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Fire': return '🔥';
      case 'Medical': return '🏥';
      case 'Traffic': return '🚗';
      case 'Weather': return '⛈️';
      case 'Hazmat': return '☢️';
      case 'Rescue': return '🚁';
      default: return '🚨';
    }
  };

  const filteredEmergencies = emergencies.filter(emergency => {
    const matchesSearch = emergency.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emergency.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emergency.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emergency.status === statusFilter;
    const matchesType = typeFilter === 'all' || emergency.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const emergencyTypes = [...new Set(emergencies.map(e => e.type))];

  return (
    <MainLayout>
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">Emergency History</h1>
          <p className="text-gray-600">Track and review past emergency incidents and responses</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search emergencies..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="resolved">Resolved</option>
                <option value="in-progress">In Progress</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {emergencyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Emergency List */}
        <div className="space-y-4">
          {filteredEmergencies.map((emergency) => (
            <div key={emergency.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getTypeIcon(emergency.type)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{emergency.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className="font-medium">{emergency.type}</span>
                        <span>•</span>
                        <span>ID: {emergency.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emergency.status)}`}>
                      {emergency.status.charAt(0).toUpperCase() + emergency.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(emergency.priority)}`}>
                      {emergency.priority.charAt(0).toUpperCase() + emergency.priority.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{emergency.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{emergency.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{emergency.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Duration: {emergency.duration}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-gray-700 text-sm">{emergency.description}</p>
                </div>

                {/* Responders */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 font-medium">Responders:</span>
                  {emergency.responders.map((responder, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                      {responder}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredEmergencies.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No emergencies found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-gray-900">{emergencies.length}</div>
            <div className="text-sm text-gray-600">Total Incidents</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-green-600">{emergencies.filter(e => e.status === 'resolved').length}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-yellow-600">{emergencies.filter(e => e.status === 'in-progress').length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-red-600">{emergencies.filter(e => e.priority === 'critical').length}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default EmergencyHistory;