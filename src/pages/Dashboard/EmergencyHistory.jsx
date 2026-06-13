import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, AlertTriangle, 
  CheckCircle, XCircle, Filter, Search, Activity, ArrowRight 
} from 'lucide-react';
import MainLayout from '../../Layouts/MainLayout';

// Firebase imports
import { db, auth } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const EmergencyHistory = () => {
  const navigate = useNavigate();
  
  const [emergencies, setEmergencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Fetch data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const q = query(
          collection(db, 'emergencies'),
          where('reporterId', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        
        const fetchedEmergencies = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const dateObj = data.createdAt ? data.createdAt.toDate() : new Date();
          
          return {
            id: doc.id,
            type: data.emergencyType 
              ? data.emergencyType.charAt(0).toUpperCase() + data.emergencyType.slice(1) 
              : 'Other',
            title: `${data.emergencyType || 'General'} Emergency`,
            location: data.location || 'Location not specified',
            date: dateObj.toLocaleDateString('en-GB'), // e.g., 10/07/2024
            time: dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            status: data.status ? data.status.toLowerCase() : 'pending',
            priority: data.priorityLevel || 'medium',
            description: data.description || 'No description provided.',
            responders: ['Dispatch Notified'], // Placeholder until dispatch system is built
            duration: data.status?.toLowerCase() === 'resolved' ? 'Resolved' : 'Ongoing',
            rawDate: dateObj.getTime() // Used for sorting
          };
        });

        // Sort newest to oldest locally to prevent Firebase index errors
        fetchedEmergencies.sort((a, b) => b.rawDate - a.rawDate);
        setEmergencies(fetchedEmergencies);
        
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': 
      case 'pending': return 'bg-yellow-100 text-yellow-800';
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
    switch (type.toLowerCase()) {
      case 'fire': return '🔥';
      case 'medical': return '🏥';
      case 'traffic': 
      case 'accident': return '🚗';
      case 'weather': 
      case 'natural': return '⛈️';
      case 'hazmat': return '☢️';
      case 'rescue': 
      case 'police': return '🚨';
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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your reported emergencies..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 capitalize"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 capitalize"
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Activity className="animate-pulse text-red-500 mb-4" size={48} />
            <p className="text-gray-500 font-medium">Retrieving your secure logs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEmergencies.map((emergency) => (
              <div key={emergency.id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all duration-200 group">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl bg-gray-50 p-2 rounded-lg">{getTypeIcon(emergency.type)}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 capitalize">{emergency.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="font-bold uppercase tracking-wider">{emergency.type}</span>
                          <span>•</span>
                          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">ID: {emergency.id.substring(0,8)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(emergency.status)}`}>
                        {emergency.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getPriorityColor(emergency.priority)}`}>
                        {emergency.priority}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <span>{emergency.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span>{emergency.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                      <span className="truncate">{emergency.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span>Status: {emergency.duration}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4 pl-1 border-l-2 border-red-100">
                    <p className="text-gray-700 text-sm pl-3">{emergency.description}</p>
                  </div>

                  {/* Responders & Action Button */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gray-500 font-bold uppercase tracking-wider text-[10px]">Action Status:</span>
                      {emergency.responders.map((responder, index) => (
                        <span key={index} className="px-2 py-1 bg-red-50 text-red-700 font-bold rounded text-xs">
                          {responder}
                        </span>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/tracker/${emergency.id}`)}
                      className="flex items-center justify-center px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm w-full sm:w-auto"
                    >
                      Live Tracker <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredEmergencies.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm">
            <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No emergencies found</h3>
            <p className="text-gray-500">You have no active reports or none match your search criteria.</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:border-red-200 transition-colors">
            <div className="text-3xl font-black text-gray-900">{emergencies.length}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Total Incidents</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:border-green-200 transition-colors">
            <div className="text-3xl font-black text-green-600">{emergencies.filter(e => e.status === 'resolved').length}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Resolved</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:border-yellow-200 transition-colors">
            <div className="text-3xl font-black text-yellow-500">{emergencies.filter(e => e.status === 'pending').length}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:border-red-200 transition-colors">
            <div className="text-3xl font-black text-red-600">{emergencies.filter(e => e.priority === 'critical').length}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Critical</div>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default EmergencyHistory;