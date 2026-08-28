import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layouts/AdminLayout';
import { db } from '../../firebase'; 
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Search, Filter, AlertCircle, Clock, MapPin, CheckCircle2, ShieldAlert, Ban, Image } from 'lucide-react';

const ActiveIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const emergenciesQuery = collection(db, 'emergencies');
    
    const unsubscribe = onSnapshot(emergenciesQuery, (snapshot) => {
      const fetchedIncidents = snapshot.docs.map(doc => {
        const data = doc.data();
        // DEBUG: Print out keys to console so you can see your data structure anytime
        console.log(`Incident ${doc.id} keys:`, Object.keys(data));
        return {
          id: doc.id,
          ...data
        };
      });
      
      fetchedIncidents.sort((a, b) => {
         const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || a.timestamp || a.time || 0).getTime();
         const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || b.timestamp || b.time || 0).getTime();
         return timeB - timeA;
      });

      setIncidents(fetchedIncidents);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const getCoordinates = (incident) => {
    if (incident.latitude && incident.longitude) return `${parseFloat(incident.latitude).toFixed(4)}, ${parseFloat(incident.longitude).toFixed(4)}`;
    if (incident.lat && incident.lng) return `${parseFloat(incident.lat).toFixed(4)}, ${parseFloat(incident.lng).toFixed(4)}`;
    if (incident.location?.latitude && incident.location?.longitude) return `${parseFloat(incident.location.latitude).toFixed(4)}, ${parseFloat(incident.location.longitude).toFixed(4)}`;
    if (typeof incident.coordinates === 'string' && incident.coordinates.trim() !== '') return incident.coordinates;
    if (typeof incident.location === 'string' && incident.location.trim() !== '') return incident.location;
    if (typeof incident.address === 'string' && incident.address.trim() !== '') return incident.address;
    return "N/A";
  };

  const getType = (incident) => incident.type || incident.emergencyType || incident.category || incident.title || 'Emergency';

  const formatTime = (incident) => {
    const timeVal = incident.createdAt || incident.timestamp || incident.time;
    if (!timeVal) return "N/A";
    if (timeVal.toDate) return timeVal.toDate().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    try { return new Date(timeVal).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } 
    catch (e) { return String(timeVal); }
  };
  
  const handleAssignDispatch = async (incidentId, agency) => {
    try { await updateDoc(doc(db, 'emergencies', incidentId), { assignedAgency: agency, status: 'EN-ROUTE' }); } 
    catch (error) { console.error("Error updating dispatch:", error); }
  };

  const handleResolveIncident = async (incidentId) => {
    try { await updateDoc(doc(db, 'emergencies', incidentId), { status: 'RESOLVED' }); } 
    catch (error) { console.error("Error resolving incident:", error); }
  };

  const handleFalseAlarm = async (incidentId) => {
    try { await updateDoc(doc(db, 'emergencies', incidentId), { status: 'FALSE_ALARM' }); } 
    catch (error) { console.error("Error marking false alarm:", error); }
  };

  const filteredIncidents = incidents.filter(incident => {
    const status = (incident.status || 'PENDING').toUpperCase();
    if (status === 'RESOLVED' || status === 'FALSE_ALARM') return false; 

    const searchStr = searchTerm.toLowerCase();
    return incident.id.toLowerCase().includes(searchStr) || getType(incident).toLowerCase().includes(searchStr);
  });

  return (
    <AdminLayout>
      <div className="flex-1 bg-[#f8fafc] p-8 pb-32 h-full overflow-y-auto">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-slate-900">Active Incidents</h1>
              {!isLoading && (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  {filteredIncidents.length} Live
                </span>
              )}
            </div>
            <p className="text-slate-500">Comprehensive log of all pending and en-route emergency requests.</p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search ID or Type..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-20 overflow-visible relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Incident ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time Reported</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Coordinates</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading active incidents...</td></tr>
                ) : filteredIncidents.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No active incidents found.</td></tr>
                ) : (
                  filteredIncidents.map((incident) => {
                    const status = incident.status || 'PENDING';
                    
                    // Trust Score Simulator
                    const lastChar = incident.id.charCodeAt(incident.id.length - 1);
                    const isLowTrust = incident.trustScore !== undefined ? incident.trustScore < 40 : lastChar % 5 === 0;

                    // Comprehensive image detector catching any common property name
                    const attachedImage = incident.imageUrl || incident.image || incident.photo || incident.img;

                    return (
                      <tr key={incident.id} className={`transition-colors ${isLowTrust ? 'bg-red-50/30 hover:bg-red-50/60' : 'hover:bg-slate-50/50'}`}>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-xs font-bold rounded">
                            {incident.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-2">
                              <AlertCircle size={16} className={`${isLowTrust ? 'text-red-600' : 'text-red-500'} shrink-0`} />
                              <span className="font-semibold text-slate-900">{getType(incident)}</span>
                              
                              {/* MEDIA BADGE: Appears automatically if any image property is found */}
                              {attachedImage && (
                                <a 
                                  href={attachedImage} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 ml-2 px-2.5 py-0.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 text-[10px] font-black tracking-wider uppercase rounded-full transition-colors shadow-sm"
                                  title="View Attached Evidence"
                                >
                                  <Image size={10} /> Media
                                </a>
                              )}
                            </div>
                            
                            {/* Low Trust Badge */}
                            {isLowTrust && (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 border border-red-200 text-[9px] font-black tracking-wider rounded flex items-center gap-1 w-fit mt-1">
                                <ShieldAlert size={10} /> SUSPECTED PRANK
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-500 text-sm whitespace-nowrap">
                            <Clock size={14} className="shrink-0" />
                            {formatTime(incident)}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                            <MapPin size={14} className="text-slate-400 shrink-0" />
                            {getCoordinates(incident)}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-full whitespace-nowrap ${
                            status.toUpperCase() === 'PENDING' ? 'bg-red-50 text-red-600' :
                            status.toUpperCase() === 'EN-ROUTE' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            
                            {status.toUpperCase() === 'PENDING' && (
                              <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                                <button onClick={() => handleAssignDispatch(incident.id, 'NAS')} className="px-2 py-1 text-[10px] font-bold rounded transition-colors text-emerald-600 bg-emerald-50 hover:bg-emerald-100">NAS</button>
                                <button onClick={() => handleAssignDispatch(incident.id, 'GPS')} className="px-2 py-1 text-[10px] font-bold rounded transition-colors text-blue-600 bg-blue-50 hover:bg-blue-100">GPS</button>
                                <button onClick={() => handleAssignDispatch(incident.id, 'GNFS')} className="px-2 py-1 text-[10px] font-bold rounded transition-colors text-rose-600 bg-rose-50 hover:bg-rose-100">GNFS</button>
                                <button onClick={() => handleAssignDispatch(incident.id, 'NADMO')} className="px-2 py-1 text-[10px] font-bold rounded transition-colors text-amber-600 bg-amber-50 hover:bg-amber-100">NADMO</button>
                              </div>
                            )}

                            {status.toUpperCase() === 'PENDING' ? (
                              <button 
                                onClick={() => handleFalseAlarm(incident.id)}
                                title="Mark as False Alarm/Spam"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700 text-xs font-bold rounded transition-colors shadow-sm whitespace-nowrap"
                              >
                                <Ban size={12} /> False Alarm
                              </button>
                            ) : status.toUpperCase() === 'EN-ROUTE' ? (
                              <button 
                                onClick={() => handleResolveIncident(incident.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded transition-colors shadow-sm whitespace-nowrap"
                              >
                                <CheckCircle2 size={12} /> Resolve
                              </button>
                            ) : null}

                            <button 
                              onClick={() => navigate(`/adminmap?incident=${incident.id}`)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
                            >
                              <MapPin size={12} /> View Map
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ActiveIncidents;