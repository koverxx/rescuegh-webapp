import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layouts/AdminLayout';
import { db } from '../../firebase'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { Search, Filter, AlertCircle, Clock, MapPin, CheckCircle2, Ban, ArchiveX } from 'lucide-react';

const ResolvedIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // NEW: State to toggle between Resolved and False Alarms
  const [activeTab, setActiveTab] = useState('RESOLVED'); 
  
  const navigate = useNavigate();

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

  // FILTER: Show based on the Active Tab
  const filteredIncidents = incidents.filter(incident => {
    const status = (incident.status || '').toUpperCase();
    if (status !== activeTab) return false; 

    const searchStr = searchTerm.toLowerCase();
    return incident.id.toLowerCase().includes(searchStr) || getType(incident).toLowerCase().includes(searchStr);
  });

  // Calculate totals for the tabs
  const totalResolved = incidents.filter(i => (i.status || '').toUpperCase() === 'RESOLVED').length;
  const totalSpam = incidents.filter(i => (i.status || '').toUpperCase() === 'FALSE_ALARM').length;

  return (
    <AdminLayout>
      <div className="flex-1 bg-[#f8fafc] p-8 pb-32 h-full overflow-y-auto">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-slate-900">Incident Archives</h1>
            </div>
            <p className="text-slate-500">Historical database of completed operations and flagged system abuse.</p>
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
          </div>
        </div>

        {/* NEW: Toggle Tabs */}
        <div className="flex gap-3 mb-6">
          <button 
            onClick={() => setActiveTab('RESOLVED')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
              activeTab === 'RESOLVED' 
                ? 'bg-slate-900 text-white' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 size={16} className={activeTab === 'RESOLVED' ? 'text-emerald-400' : 'text-slate-400'} />
            Valid Operations
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'RESOLVED' ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-500'}`}>
              {totalResolved}
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('FALSE_ALARM')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
              activeTab === 'FALSE_ALARM' 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Ban size={16} className={activeTab === 'FALSE_ALARM' ? 'text-red-500' : 'text-slate-400'} />
            Flagged Pranks
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'FALSE_ALARM' ? 'bg-red-200 text-red-800' : 'bg-slate-100 text-slate-500'}`}>
              {totalSpam}
            </span>
          </button>
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
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Agency</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Final Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading archives...</td></tr>
                ) : filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 flex flex-col items-center justify-center">
                      <ArchiveX size={32} className="text-slate-300 mb-3" />
                      No records found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map((incident) => {
                    const isSpam = activeTab === 'FALSE_ALARM';
                    const agency = incident.assignedAgency || (isSpam ? 'NONE (ABORTED)' : 'UNKNOWN');
                    
                    return (
                      <tr key={incident.id} className={`hover:bg-slate-50/50 transition-colors opacity-80 ${isSpam ? 'bg-red-50/10' : ''}`}>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 font-mono text-xs font-bold rounded ${isSpam ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                            {incident.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <AlertCircle size={16} className={`${isSpam ? 'text-red-400' : 'text-slate-400'} shrink-0`} />
                            <span className={`font-semibold ${isSpam ? 'text-red-900' : 'text-slate-600 line-through'}`}>{getType(incident)}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-500 text-sm whitespace-nowrap">
                            <Clock size={14} className="shrink-0" />
                            {formatTime(incident)}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <MapPin size={14} className="text-slate-400 shrink-0" />
                            {getCoordinates(incident)}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`text-sm font-bold ${isSpam ? 'text-slate-400' : 'text-slate-700'}`}>{agency}</span>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-full whitespace-nowrap ${
                            isSpam ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {isSpam ? 'PRANK / SPAM' : 'RESOLVED'}
                          </span>
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

export default ResolvedIncidents;