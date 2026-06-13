import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Shield, AlertTriangle, CheckCircle, ArrowLeft, Activity } from 'lucide-react';
import MainLayout from '../../Layouts/MainLayout';

// Firebase imports
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const EmergencyTrackerPage = () => {
  const { id } = useParams(); // Grabs the emergency ID from the URL
  const navigate = useNavigate();
  
  const [emergencyData, setEmergencyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // The Real-Time Firebase Listener
  useEffect(() => {
    if (!id) return;

    // onSnapshot creates a live connection. If the database changes, this updates instantly!
    const unsub = onSnapshot(doc(db, 'emergencies', id), 
      (doc) => {
        if (doc.exists()) {
          setEmergencyData({ id: doc.id, ...doc.data() });
          setError('');
        } else {
          setError('Emergency record not found.');
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Tracker Error:", err);
        setError('Failed to connect to live tracking.');
        setIsLoading(false);
      }
    );

    // Cleanup the listener when the user leaves the page
    return () => unsub();
  }, [id]);

  // Helper to determine active steps in the progress bar
  const getStatusLevel = (status) => {
    const statuses = ['Pending', 'Dispatched', 'En Route', 'Resolved'];
    return statuses.indexOf(status) !== -1 ? statuses.indexOf(status) : 0;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <Activity className="animate-pulse text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-700">Connecting to secure dispatch...</h2>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !emergencyData) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
          <AlertTriangle className="text-red-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tracking Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate('/report')} className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
            Return to Dashboard
          </button>
        </div>
      </MainLayout>
    );
  }

  const currentStep = getStatusLevel(emergencyData.status);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate('/report')}
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors mb-6 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Reporting
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Header Area */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-1">Live Emergency Tracker</h1>
                <p className="text-red-100 text-sm opacity-90">ID: {emergencyData.id}</p>
              </div>
              <div className={`px-4 py-2 rounded-full font-bold text-sm shadow-sm ${
                emergencyData.priorityLevel === 'critical' ? 'bg-black text-red-400 border border-red-500' :
                emergencyData.priorityLevel === 'high' ? 'bg-orange-500 text-white' :
                emergencyData.priorityLevel === 'medium' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {emergencyData.priorityLevel.toUpperCase()} PRIORITY
              </div>
            </div>

            {/* Live Progress Tracker */}
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-8 text-center">Current Status</h3>
              
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded"></div>
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-red-500 -translate-y-1/2 rounded transition-all duration-700 ease-in-out"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>

                {/* Status Nodes */}
                <div className="relative flex justify-between">
                  {['Pending', 'Dispatched', 'En Route', 'Resolved'].map((status, index) => {
                    const isCompleted = index <= currentStep;
                    const isActive = index === currentStep;
                    
                    return (
                      <div key={status} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 ${
                          isActive ? 'bg-red-500 border-red-200 ring-4 ring-red-50 shadow-lg' : 
                          isCompleted ? 'bg-red-500 border-white' : 'bg-white border-gray-200'
                        }`}>
                          {isCompleted ? <CheckCircle size={18} className="text-white" /> : <div className="w-3 h-3 bg-gray-300 rounded-full"></div>}
                        </div>
                        <span className={`mt-3 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-red-700 font-bold' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <AlertTriangle className="mr-2 text-red-500" size={20} /> Incident Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center mb-2">
                    <Shield className="text-gray-500 mr-2" size={18} />
                    <span className="text-sm font-semibold text-gray-500 uppercase">Emergency Type</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900 capitalize">{emergencyData.emergencyType}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center mb-2">
                    <Clock className="text-gray-500 mr-2" size={18} />
                    <span className="text-sm font-semibold text-gray-500 uppercase">Time Reported</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    {emergencyData.createdAt ? new Date(emergencyData.createdAt.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Logging...'}
                  </p>
                </div>

                <div className="bg-red-50 rounded-xl p-5 border border-red-100 md:col-span-2">
                  <div className="flex items-center mb-2">
                    <MapPin className="text-red-500 mr-2" size={18} />
                    <span className="text-sm font-semibold text-gray-500 uppercase">Location Data</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900">{emergencyData.location}</p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed">
                    {emergencyData.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default EmergencyTrackerPage;