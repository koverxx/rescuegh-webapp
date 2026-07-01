import React, { useState, useEffect } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { AlertCircle, MapPin, Clock, Search, Filter, X, User, Phone, FileText, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActiveIncidents = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // NEW: State to manage the Details Modal
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'emergencies'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setEmergencies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filteredEmergencies = emergencies.filter(inc => 
    inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inc.type && inc.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAssignDispatch = (e, incidentId, unitId) => {
    e.stopPropagation(); // Prevents the row click event from firing when clicking a button
    navigate(`/adminmap?incident=${incidentId}&unit=${unitId}`);
  };

  // Add this right above the return statement!
  console.log("RAW FIREBASE DATA:", selectedIncident);

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto flex flex-col h-[90vh] relative"> 
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              Active Incidents
              <span className="bg-red-100 text-red-600 text-sm py-1 px-3 rounded-full font-bold">
                {emergencies.filter(e => e.status !== 'resolved').length} Live
              </span>
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Comprehensive log of all emergency requests.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search ID or Type..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 shadow-sm">
              <tr className="text-xs uppercase tracking-wider text-slate-500 font-black">
                <th className="p-4">Incident ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Time Reported</th>
                <th className="p-4">Coordinates</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Assign Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmergencies.map((inc) => (
                <tr 
                  key={inc.id} 
                  onClick={() => setSelectedIncident(inc)} // Click row to open modal
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <td className="p-4"><span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{inc.id.slice(0, 8).toUpperCase()}</span></td>
                  <td className="p-4"><div className="flex items-center gap-2"><AlertCircle className={`w-4 h-4 ${inc.status === 'resolved' ? 'text-slate-400' : 'text-red-500'}`} /><span className="font-bold text-slate-800 capitalize text-sm">{inc.type || 'Emergency'}</span></div></td>
                  <td className="p-4"><div className="flex items-center gap-2 text-slate-500 text-sm font-medium"><Clock className="w-4 h-4 text-slate-400" />{formatTime(inc.createdAt)}</div></td>
                  <td className="p-4"><div className="flex items-center gap-2 text-slate-500 text-sm font-mono"><MapPin className="w-4 h-4 text-slate-400" />{inc.location?.lat ? `${inc.location.lat.toFixed(4)}, ${inc.location.lng.toFixed(4)}` : 'N/A'}</div></td>
                  <td className="p-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${inc.status === 'resolved' ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-600 border border-red-100 animate-pulse'}`}>{inc.status || 'Pending'}</span></td>
                  
                  {/* Action Buttons (Stop Propagation prevents row click from firing) */}
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={(e) => handleAssignDispatch(e, inc.id, 'NAS-01')} className="px-2 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white rounded text-[10px] font-black transition-colors">NAS</button>
                      <button onClick={(e) => handleAssignDispatch(e, inc.id, 'GPS-01')} className="px-2 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded text-[10px] font-black transition-colors">GPS</button>
                      <button onClick={(e) => handleAssignDispatch(e, inc.id, 'GNFS-01')} className="px-2 py-1.5 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded text-[10px] font-black transition-colors">GNFS</button>
                      {/* ADDED NADMO BUTTON */}
                      <button onClick={(e) => handleAssignDispatch(e, inc.id, 'NADMO-01')} className="px-2 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white rounded text-[10px] font-black transition-colors">NADMO</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NEW: Incident Details Modal Overlay */}
        {selectedIncident && (
          <div className="fixed inset-0 z-[2000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedIncident(null)}>
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()} 
            >
              {/* Modal Header */}
              <div className="bg-slate-900 p-5 flex justify-between items-center text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">INCIDENT DOSSIER</h3>
                    <p className="text-xs text-slate-400 font-mono">ID: {selectedIncident.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedIncident(null)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body with Citizen Details (Now scrollable if content is long) */}
              <div className="p-6 space-y-6 overflow-y-auto">
                
                {/* 1. Main Description Box */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Reported Description
                  </h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-800 text-sm font-medium">
                    {selectedIncident.description || 'No description provided.'}
                  </div>
                </div>

                {/* 2. New: Additional Info & Casualties Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                      Additional Information
                    </h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 text-sm italic min-h-[4rem]">
                      {/* Checks multiple common field names you might have used in Firebase */}
                      {selectedIncident.additionalInfo || selectedIncident.additionalInformation || selectedIncident.info || 'None provided.'}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" /> Injuries / Casualties
                    </h4>
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-red-700 text-sm font-bold min-h-[4rem]">
                       {/* Checks multiple common field names */}
                      {selectedIncident.injuries || selectedIncident.casualties || selectedIncident.injuryDetails || 'None reported.'}
                    </div>
                  </div>
                </div>

                {/* 3. Grid for Quick Stats (Reporter, Contact, Severity) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1"><User className="w-3 h-3" /> Reporter Name</p>
                    <p className="font-bold text-slate-800 text-sm">
                      {selectedIncident.reporterName || selectedIncident.name || 'Anonymous'}
                    </p>
                  </div>
                 <div className="border border-slate-100 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1"><Phone className="w-3 h-3" /> Contact Info</p>
                    <p className="font-bold text-slate-800 text-sm font-mono">
                      {/* Updated to reporterPhone */}
                      {selectedIncident.reporterPhone || 'Unknown'}
                    </p>
                  </div>
                  <div className="border border-slate-100 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" /> Location Type</p>
                    <p className="font-bold text-slate-800 text-sm">
                      {selectedIncident.locationType || 'GPS Coordinate Pin'}
                    </p>
                  </div>
                  <div className="border border-red-100 bg-red-50/50 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1 mb-1"><AlertCircle className="w-3 h-3" /> Severity</p>
                    <p className="font-black text-red-600 text-sm uppercase">
                      {/* Updated to priorityLevel */}
                      {selectedIncident.priorityLevel || 'Unverified'}
                    </p>
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end shrink-0 gap-3">
                <button 
                  onClick={() => setSelectedIncident(null)} 
                  className="px-6 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Close Dossier
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default ActiveIncidents;