import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MapPin, Shield, Flame, Heart, ChevronRight, Activity, X, CheckCircle, Truck, Radio } from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout'; 

// Firebase imports
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const DispatchDashboard = () => {
  const [activeEmergencies, setActiveEmergencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isDispatching, setIsDispatching] = useState(false);

  // REAL-TIME FIREBASE LISTENER (Bulletproofed)
  useEffect(() => {
    const q = query(collection(db, 'emergencies'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const emergenciesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // BULLETPROOF DATE PARSER: Handles both Firebase Timestamps and standard strings
        let parsedDate = new Date();
        if (data.createdAt) {
          if (typeof data.createdAt.toDate === 'function') {
            parsedDate = data.createdAt.toDate(); // It's a Firebase Timestamp
          } else {
            parsedDate = new Date(data.createdAt); // It's a string or number
          }
        }

        return {
          id: doc.id,
          type: data.emergencyType || 'General',
          priority: data.priorityLevel || 'medium',
          location: data.location || 'Location Unknown',
          status: data.status || 'pending',
          createdAt: parsedDate,
          description: data.description || 'No description provided.',
          reporterName: data.reporterName || 'Anonymous Citizen',
          phone: data.reporterPhone || 'N/A'
        };
      });
      
      setActiveEmergencies(emergenciesData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching live emergencies:", error);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Safe stat calculations
  const activeUnresolved = activeEmergencies.filter(e => e.status !== 'resolved' && e.status !== 'cancelled');
  const criticalCount = activeUnresolved.filter(e => e.priority === 'critical').length;
  const pendingCount = activeUnresolved.filter(e => e.status === 'pending').length;
  const deployedCount = activeUnresolved.filter(e => ['dispatching', 'en-route', 'on-scene'].includes(e.status)).length;

  const formatTimeAgo = (date) => {
    if (!date || isNaN(date)) return "Unknown time";
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return "Just now";
  };

  const getTypeIcon = (type) => {
    switch(String(type).toLowerCase()) {
      case 'medical': return <Heart className="w-5 h-5 text-red-500" />;
      case 'fire': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'police': return <Shield className="w-5 h-5 text-blue-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(String(priority).toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200 animate-pulse';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleIncidentClick = (incident) => {
    setSelectedIncident(incident);
    setIsDrawerOpen(true);
  };

  const handleManualDispatch = () => {
    if (activeUnresolved.length === 0) {
      alert("No pending incidents to dispatch to.");
      return;
    }
    const pending = activeUnresolved.filter(e => e.status === 'pending');
    setSelectedIncident(pending.length > 0 ? pending[pending.length - 1] : activeUnresolved[0]);
    setIsDrawerOpen(true);
  };

  // REAL FIREBASE UPDATE FUNCTION
  const executeDispatch = async () => {
    if (!selectedIncident) return;
    setIsDispatching(true);
    
    try {
      const incidentRef = doc(db, 'emergencies', selectedIncident.id);
      
      await updateDoc(incidentRef, {
        status: 'en-route',
        updatedAt: new Date()
      });

      setIsDrawerOpen(false);
      alert(`Unit successfully dispatched! Status updated to En-Route.`);
      
    } catch (error) {
      console.error("Error updating dispatch status:", error);
      alert("Failed to update status in the database. Ensure you have proper permissions.");
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 relative">
        
        {/* SLIDE-OUT DISPATCH DRAWER */}
        {isDrawerOpen && selectedIncident && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-black text-gray-900">Incident Details</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">ID: {selectedIncident.id?.substring(0,8) || 'UNKNOWN'}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getPriorityColor(selectedIncident.priority)}`}>
                    {selectedIncident.priority} Priority
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Emergency Type</h3>
                  <div className="flex items-center text-lg font-bold text-gray-900 capitalize">
                    {getTypeIcon(selectedIncident.type)}
                    <span className="ml-2">{selectedIncident.type} Emergency</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-blue-600" /> Location
                  </h3>
                  <p className="text-blue-800 font-medium">{selectedIncident.location}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Citizen Report</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                    <p className="text-gray-700 text-sm">{selectedIncident.description}</p>
                    <div className="pt-3 border-t border-gray-200 flex justify-between text-sm">
                      <span className="font-bold text-gray-900">{selectedIncident.reporterName}</span>
                      <span className="text-gray-500">{selectedIncident.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Assign Available Unit</h3>
                  <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-4 bg-white">
                    <option value="">Select a responder unit...</option>
                    <option value="amb-1">🚑 Ambulance Alpha-1 (Stationed 2km away)</option>
                    <option value="pol-42">🚓 Police Cruiser 42 (Patrolling Area)</option>
                    <option value="fire-9">🚒 Fire Engine 09 (Available)</option>
                  </select>

                  <button 
                    onClick={executeDispatch}
                    disabled={isDispatching}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center ${
                      isDispatching ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:-translate-y-1'
                    }`}
                  >
                    {isDispatching ? (
                      <><Activity className="w-5 h-5 mr-2 animate-spin" /> Transmitting...</>
                    ) : (
                      <><Truck className="w-5 h-5 mr-2" /> Dispatch Unit Now</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Overview</h2>
            <p className="text-gray-500 font-medium mt-1">Live national dispatch matrix</p>
          </div>
          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center text-sm">
            <Activity className="w-4 h-4 mr-2" /> Generate Report
          </button>
        </div>

        {/* DYNAMIC STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-l-red-500">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Critical SOS</p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-gray-900">{criticalCount}</h3>
              <span className="text-red-600 font-bold text-sm bg-red-50 px-2 py-1 rounded">Action Required</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-l-yellow-500">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Active Incidents</p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-gray-900">{activeUnresolved.length}</h3>
              <span className="text-yellow-600 font-bold text-sm bg-yellow-50 px-2 py-1 rounded">{pendingCount} Pending</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-l-blue-500">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Units Deployed</p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-gray-900">{deployedCount}</h3>
              <span className="text-blue-600 font-bold text-sm bg-blue-50 px-2 py-1 rounded">En-route</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-l-green-500">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Available Units</p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-gray-900">45</h3>
              <span className="text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded">Ready</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* LIVE INCOMING SOS FEED */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping mr-3"></div>
                <h3 className="font-bold text-gray-900 text-lg">Live Emergency Feed</h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100 flex-1 overflow-auto max-h-[500px]">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                  <Activity className="w-8 h-8 animate-pulse text-blue-500 mb-2" />
                  Fetching secure logs...
                </div>
              ) : activeUnresolved.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No active emergencies at this time. All clear.
                </div>
              ) : (
                activeUnresolved.map((req) => (
                  <div 
                    key={req.id} 
                    onClick={() => handleIncidentClick(req)}
                    className="p-4 sm:p-6 hover:bg-blue-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl border transition-colors group-hover:bg-white shrink-0 ${String(req.priority).toLowerCase() === 'critical' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200'}`}>
                          {getTypeIcon(req.type)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900 capitalize truncate">{req.type} Emergency</h4>
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">{req.id.substring(0,8)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400 shrink-0" />
                            <span className="truncate">{req.location}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 font-medium">
                            <Clock className="w-3.5 h-3.5 mr-1 shrink-0" /> Reported {formatTimeAgo(req.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 ml-14 sm:ml-0 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${getPriorityColor(req.priority)}`}>
                          {req.priority}
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                          {req.status}
                        </span>
                      </div>
                      
                      <div className="hidden sm:flex items-center text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1 shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* QUICK ACTIONS & MINI MAP */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
                <Radio className="w-32 h-32" />
              </div>
              <h3 className="font-bold text-lg mb-2 relative z-10">Manual Dispatch</h3>
              <p className="text-gray-400 text-sm mb-6 relative z-10">Assign units directly to pending coordinate zones.</p>
              <button 
                onClick={handleManualDispatch}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all hover:-translate-y-1 active:scale-95 relative z-10 shadow-lg"
              >
                Assign Responder
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[300px]">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Unit Status</h3>
              </div>
              <div className="p-5 space-y-4 overflow-auto">
                <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded transition-colors">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 shrink-0"></div>
                    <span className="text-sm font-bold text-gray-700 truncate">Ambulance Alpha-1</span>
                  </div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 shrink-0">Station</span>
                </div>
                <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded transition-colors">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 shrink-0"></div>
                    <span className="text-sm font-bold text-gray-700 truncate">Police Cruiser 42</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 shrink-0">Patrol</span>
                </div>
                <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded transition-colors">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse shrink-0"></div>
                    <span className="text-sm font-bold text-gray-700 truncate">Fire Engine 09</span>
                  </div>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 shrink-0">En Route</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default DispatchDashboard;