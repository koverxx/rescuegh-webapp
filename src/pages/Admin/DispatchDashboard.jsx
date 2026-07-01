import React, { useState, useEffect } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { AlertTriangle, CheckCircle2, Truck, Clock, Activity, ArrowRight, ShieldAlert } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const Dashboard = () => {
  const [emergencies, setEmergencies] = useState([]);
  
 
  const [fleet] = useState([
    { id: 'NAS-01', agency: 'National Ambulance', status: 'Available', color: 'bg-emerald-500' },
    { id: 'GPS-01', agency: 'Ghana Police', status: 'Dispatched', color: 'bg-blue-600' },
    { id: 'GNFS-01', agency: 'Fire Service', status: 'Available', color: 'bg-red-600' },
    { id: 'NAS-02', agency: 'National Ambulance', status: 'Maintenance', color: 'bg-slate-400' },
  ]);

 
  useEffect(() => {
   
    const q = query(collection(db, 'emergencies'), orderBy('createdAt', 'desc'), limit(5));
    const unsub = onSnapshot(q, (snap) => {
      setEmergencies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const activeCount = emergencies.filter(e => e.status !== 'resolved').length;
  const resolvedCount = emergencies.filter(e => e.status === 'resolved').length;

 
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Command Center</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">RescueGH Live Dispatch Overview</p>
          </div>
          <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">System Live</span>
          </div>
        </div>

        {/* 1. TOP KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active SOS</p>
              <h3 className="text-3xl font-black text-red-600 mt-1">{activeCount}</h3>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Units</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">
                {fleet.filter(f => f.status === 'Available').length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Response</p>
              <h3 className="text-3xl font-black text-blue-600 mt-1">8m 42s</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved Today</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{resolvedCount + 12}</h3> {/* +12 just for mock data padding */}
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-slate-500" />
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* 2. LEFT: Live Activity Feed (Takes up 2/3 of the space) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Live Incident Feed
              </h3>
              <a href="/map" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                Open Map <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            
            <div className="divide-y divide-slate-100">
              {emergencies.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm font-medium">No active incidents at the moment.</div>
              ) : (
                emergencies.map((inc) => (
                  <div key={inc.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 w-2 h-2 rounded-full ${inc.status === 'resolved' ? 'bg-slate-300' : 'bg-red-500 animate-pulse'}`}></div>
                      <div>
                        <h4 className="font-bold text-slate-800 capitalize text-sm">{inc.type || 'Emergency Request'}</h4>
                        <p className="text-xs text-slate-500 font-mono mt-1">ID: {inc.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400">{formatTime(inc.createdAt)}</p>
                      <span className={`inline-block mt-2 px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded ${inc.status === 'resolved' ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {inc.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3. RIGHT: Fleet Status (Takes up 1/3 of the space) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-500" />
                Agency Fleet Status
              </h3>
            </div>
            <div className="p-5 space-y-4">
              {fleet.map((unit) => (
                <div key={unit.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black ${unit.color}`}>
                      {unit.id.split('-')[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{unit.id}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{unit.agency}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                    unit.status === 'Available' ? 'text-emerald-600 bg-emerald-50' : 
                    unit.status === 'Dispatched' ? 'text-blue-600 bg-blue-50' : 
                    'text-slate-500 bg-slate-200'
                  }`}>
                    {unit.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;