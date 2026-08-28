import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layouts/AdminLayout';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { 
  AlertTriangle, Truck, Clock, CheckCircle2, 
  MapPin, ArrowRight, ShieldAlert, Activity, Flame, Ban
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [fleet, setFleet] = useState([
    { id: 'NAS-01', agency: 'NAS', name: 'NATIONAL AMBULANCE', status: 'AVAILABLE' },
    { id: 'GPS-01', agency: 'GPS', name: 'GHANA POLICE', status: 'DISPATCHED' },
    { id: 'GNFS-01', agency: 'GNFS', name: 'FIRE SERVICE', status: 'AVAILABLE' },
    { id: 'NAS-02', agency: 'NAS', name: 'NATIONAL AMBULANCE', status: 'MAINTENANCE' },
  ]);

  useEffect(() => {
    const emergenciesQuery = collection(db, 'emergencies');
    
    const unsubscribe = onSnapshot(emergenciesQuery, (snapshot) => {
      const fetchedIncidents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
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

  // --- KPI CALCULATIONS ---
  const activeSOS = incidents.filter(i => (i.status || 'PENDING').toUpperCase() === 'PENDING').length;
  const resolvedToday = incidents.filter(i => (i.status || '').toUpperCase() === 'RESOLVED').length;
  const availableUnits = fleet.filter(f => f.status === 'AVAILABLE').length;

  const getType = (incident) => incident.type || incident.emergencyType || incident.category || incident.title || 'Emergency Request';

  const formatTime = (incident) => {
    const timeVal = incident.createdAt || incident.timestamp || incident.time;
    if (!timeVal) return "N/A";
    if (timeVal.toDate) return timeVal.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    try { return new Date(timeVal).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); } 
    catch (e) { return "Recent"; }
  };

  // --- ACTIONS ---
  const handleAssignDispatch = async (incidentId, agency) => {
    try { await updateDoc(doc(db, 'emergencies', incidentId), { assignedAgency: agency, status: 'EN-ROUTE' }); } 
    catch (error) { console.error("Error updating dispatch:", error); }
  };

  const handleResolveIncident = async (incidentId) => {
    try { await updateDoc(doc(db, 'emergencies', incidentId), { status: 'RESOLVED' }); } 
    catch (error) { console.error("Error resolving incident:", error); }
  };

  // NEW: Handle Pranks/False Alarms
  const handleFalseAlarm = async (incidentId) => {
    try { await updateDoc(doc(db, 'emergencies', incidentId), { status: 'FALSE_ALARM' }); } 
    catch (error) { console.error("Error marking false alarm:", error); }
  };

  const toggleFleetStatus = (fleetId) => {
    setFleet(currentFleet => 
      currentFleet.map(unit => {
        if (unit.id === fleetId) {
          const nextStatus = unit.status === 'AVAILABLE' ? 'DISPATCHED' : unit.status === 'DISPATCHED' ? 'MAINTENANCE' : 'AVAILABLE';
          return { ...unit, status: nextStatus };
        }
        return unit;
      })
    );
  };

  // Filter feed to only show Active/Pending items
  const activeFeed = incidents.filter(i => !['RESOLVED', 'FALSE_ALARM'].includes((i.status || '').toUpperCase()));

  return (
    <AdminLayout>
      <div className="flex-1 bg-[#f8fafc] p-8 pb-32 h-full overflow-y-auto">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Command Center</h1>
            <p className="text-slate-500 font-medium mt-1">RescueGH Live Dispatch Overview</p>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full border border-red-100 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-bold tracking-widest uppercase">System Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl border transition-all duration-500 shadow-sm flex flex-col justify-between ${
            activeSOS > 0 ? 'bg-red-600 border-red-500 shadow-red-500/30 text-white translate-y-[-2px]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-start">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${activeSOS > 0 ? 'text-red-100' : 'text-slate-500'}`}>Active SOS</h3>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeSOS > 0 ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'}`}>
                <AlertTriangle size={20} className={activeSOS > 0 ? 'animate-pulse' : ''} />
              </div>
            </div>
            <p className="text-4xl font-black mt-4">{activeSOS}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Available Units</h3>
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Truck size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-emerald-600 mt-4">{availableUnits}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Avg Response</h3>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Clock size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-blue-600 mt-4">8m 42s</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Resolved Today</h3>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 mt-4">{resolvedToday}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Activity size={18} className="text-blue-500" /> Live Incident Feed
              </h2>
              <button onClick={() => navigate('/active-incidents')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500">Loading feed...</div>
              ) : activeFeed.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No active incidents.</div>
              ) : (
                activeFeed.slice(0, 6).map(incident => {
                  const status = incident.status || 'PENDING';
                  const isPending = status.toUpperCase() === 'PENDING';
                  const isEnRoute = status.toUpperCase() === 'EN-ROUTE';
                  
                  // AI TRUST SIMULATOR: Uses the last character of the ID to randomly assign a low trust score for demo purposes.
                  const lastChar = incident.id.charCodeAt(incident.id.length - 1);
                  const isLowTrust = incident.trustScore !== undefined ? incident.trustScore < 40 : lastChar % 5 === 0;

                  return (
                    <div key={incident.id} className={`p-5 transition-colors group relative flex justify-between items-center ${isLowTrust ? 'bg-red-50/30 hover:bg-red-50/60' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${isPending ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse' : 'bg-amber-400'}`}></div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            {getType(incident)}
                            {/* NEW: Low Trust Warning Badge */}
                            {isLowTrust && (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 border border-red-200 text-[9px] font-black tracking-wider rounded flex items-center gap-1">
                                <ShieldAlert size={10} /> LOW TRUST
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono mt-1">ID: {incident.id.toUpperCase()}</p>
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end">
                        <span className="text-xs font-semibold text-slate-500 mb-1">{formatTime(incident)}</span>
                        
                        <span className={`group-hover:hidden px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-full ${
                          isPending ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {status}
                        </span>

                        <div className="hidden group-hover:flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200">
                          
                          {/* NEW: False Alarm Button */}
                          {isPending && (
                            <button 
                              onClick={() => handleFalseAlarm(incident.id)}
                              title="Mark as False Alarm/Spam"
                              className="px-2 py-1 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 text-[10px] font-bold rounded transition-colors flex items-center gap-1"
                            >
                              <Ban size={10} /> Spam
                            </button>
                          )}

                          {isPending && (
                            <button onClick={() => handleAssignDispatch(incident.id, 'NAS')} className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold rounded transition-colors">
                              + NAS
                            </button>
                          )}

                          {isEnRoute && (
                            <button onClick={() => handleResolveIncident(incident.id)} className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold rounded transition-colors flex items-center gap-1">
                              <CheckCircle2 size={10} /> Resolve
                            </button>
                          )}

                          <button onClick={() => navigate(`/adminmap?incident=${incident.id}`)} className="px-2 py-1 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold rounded transition-colors flex items-center gap-1">
                            <MapPin size={10} /> Map
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-fit">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert size={18} className="text-slate-400" /> Agency Fleet Status
              </h2>
            </div>
            
            <div className="p-4 space-y-3">
              {fleet.map((unit) => {
                const isAvailable = unit.status === 'AVAILABLE';
                const isDispatched = unit.status === 'DISPATCHED';

                return (
                  <div key={unit.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                        unit.agency === 'NAS' ? 'bg-emerald-500' : unit.agency === 'GPS' ? 'bg-blue-600' : unit.agency === 'GNFS' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}>
                        {unit.agency}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{unit.id}</h4>
                        <p className="text-[10px] font-semibold tracking-wider text-slate-500">{unit.name}</p>
                      </div>
                    </div>
                    
                    <button onClick={() => toggleFleetStatus(unit.id)} className={`px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-full cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                        isAvailable ? 'bg-emerald-100 text-emerald-700' : isDispatched ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                      {unit.status}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;