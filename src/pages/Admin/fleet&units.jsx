import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
  Search, Filter, Truck, Shield, Flame, AlertTriangle, 
  MapPin, CheckCircle2, Wrench, Radio
} from 'lucide-react';

const FleetUnits = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Expanded Authentic Ghanaian Emergency Fleet Database with Setter
  const [fleetDatabase, setFleetDatabase] = useState([
    // NAS (National Ambulance Service)
    { id: 'NAS-ALS-01', agency: 'NAS', type: 'Sprinter ALS Ambulance', base: 'Ridge Station', status: 'AVAILABLE', crew: '3 Personnel' },
    { id: 'NAS-BLS-14', agency: 'NAS', type: 'Sprinter BLS Ambulance', base: 'Accra Airport Station', status: 'DISPATCHED', crew: '2 Personnel' },
    { id: 'NAS-BLS-42', agency: 'NAS', type: 'Sprinter BLS Ambulance', base: 'Tema Central Station', status: 'MAINTENANCE', crew: 'N/A' },
    { id: 'NAS-BLS-09', agency: 'NAS', type: 'Sprinter BLS Ambulance', base: 'Achimota Station', status: 'AVAILABLE', crew: '2 Personnel' },
    { id: 'NAS-ALS-05', agency: 'NAS', type: 'Sprinter ALS Ambulance', base: 'Jubilee House Station', status: 'AVAILABLE', crew: '4 Personnel' },
    { id: 'NAS-BLS-11', agency: 'NAS', type: 'Sprinter BLS Ambulance', base: 'Adenta Station', status: 'DISPATCHED', crew: '2 Personnel' },
    { id: 'NAS-BLS-22', agency: 'NAS', type: 'Sprinter BLS Ambulance', base: 'Lapaz Station', status: 'AVAILABLE', crew: '2 Personnel' },
    { id: 'NAS-BLS-33', agency: 'NAS', type: 'Sprinter BLS Ambulance', base: 'Weija Station', status: 'AVAILABLE', crew: '2 Personnel' },
    { id: 'NAS-BLS-40', agency: 'NAS', type: 'Sprinter BLS Ambulance', base: 'Atomic Energy Station', status: 'DISPATCHED', crew: '2 Personnel' },
    { id: 'NAS-BLS-18', agency: 'NAS', type: 'Sprinter BLS Ambulance', base: 'Lekma Station', status: 'AVAILABLE', crew: '2 Personnel' },

    // GPS (Ghana Police Service)
    { id: 'GPS-PTR-88', agency: 'GPS', type: 'Toyota Hilux Patrol', base: 'Accra Regional HQ', status: 'AVAILABLE', crew: '4 Officers' },
    { id: 'GPS-FPU-02', agency: 'GPS', type: 'Armored Tactical Unit', base: 'Cantonments Base', status: 'AVAILABLE', crew: '6 Officers' },
    { id: 'GPS-MOT-15', agency: 'GPS', type: 'MTTD Rapid Motorcycle', base: 'East Legon Station', status: 'DISPATCHED', crew: '1 Officer' },
    { id: 'GPS-PTR-22', agency: 'GPS', type: 'Toyota Hilux Patrol', base: 'Osu Police Station', status: 'AVAILABLE', crew: '4 Officers' },
    { id: 'GPS-PTR-45', agency: 'GPS', type: 'Nissan Hardbody Patrol', base: 'Tesano Police Station', status: 'DISPATCHED', crew: '4 Officers' },
    { id: 'GPS-MOT-08', agency: 'GPS', type: 'MTTD Rapid Motorcycle', base: 'Nima Police Station', status: 'AVAILABLE', crew: '1 Officer' },
    { id: 'GPS-SWAT-01', agency: 'GPS', type: 'FPU Tactical Van', base: 'Police Headquarters', status: 'AVAILABLE', crew: '8 Officers' },
    { id: 'GPS-PTR-55', agency: 'GPS', type: 'Toyota Hilux Patrol', base: 'Kasoa Toll Booth', status: 'MAINTENANCE', crew: 'N/A' },

    // GNFS (Ghana National Fire Service)
    { id: 'GNFS-WTR-04', agency: 'GNFS', type: 'Heavy Water Tender', base: 'Makola Fire Station', status: 'DISPATCHED', crew: '5 Personnel' },
    { id: 'GNFS-LAD-01', agency: 'GNFS', type: 'Turntable Ladder', base: 'Trade Fair Station', status: 'AVAILABLE', crew: '4 Personnel' },
    { id: 'GNFS-WTR-09', agency: 'GNFS', type: 'Heavy Water Tender', base: 'Jubilee House Fire Station', status: 'AVAILABLE', crew: '6 Personnel' },
    { id: 'GNFS-WTR-11', agency: 'GNFS', type: 'Light Water Tender', base: 'Madina Fire Station', status: 'AVAILABLE', crew: '5 Personnel' },
    { id: 'GNFS-WTR-15', agency: 'GNFS', type: 'Heavy Water Tender', base: 'Dansoman Fire Station', status: 'DISPATCHED', crew: '5 Personnel' },
    { id: 'GNFS-WTR-22', agency: 'GNFS', type: 'Industrial Foam Tender', base: 'Tema Industrial Station', status: 'AVAILABLE', crew: '6 Personnel' },
    { id: 'GNFS-FOAM-01', agency: 'GNFS', type: 'Aviation Rescue Tender', base: 'Kotoka Airport Station', status: 'MAINTENANCE', crew: 'N/A' },

    // NADMO (National Disaster Management Organisation)
    { id: 'NDM-LOG-12', agency: 'NADMO', type: '4x4 Rescue Truck', base: 'NADMO HQ', status: 'AVAILABLE', crew: '4 Personnel' },
    { id: 'NDM-BOT-03', agency: 'NADMO', type: 'Flood Rescue Boat', base: 'Weija Base', status: 'MAINTENANCE', crew: 'N/A' },
    { id: 'NDM-TRK-05', agency: 'NADMO', type: 'Relief Cargo Truck', base: 'Tema Regional Office', status: 'DISPATCHED', crew: '3 Personnel' },
    { id: 'NDM-LOG-22', agency: 'NADMO', type: '4x4 Command Vehicle', base: 'Adenta Municipal Office', status: 'AVAILABLE', crew: '2 Personnel' },
    { id: 'NDM-CMD-01', agency: 'NADMO', type: 'Mobile Command Center', base: 'Accra Metropolitan Office', status: 'AVAILABLE', crew: '5 Personnel' }
  ]);

  // --- INTERACTIVE FLEET STATUS LOGIC ---
  const toggleFleetStatus = (fleetId) => {
    setFleetDatabase(currentFleet => 
      currentFleet.map(unit => {
        if (unit.id === fleetId) {
          const nextStatus = unit.status === 'AVAILABLE' ? 'DISPATCHED' : 
                             unit.status === 'DISPATCHED' ? 'MAINTENANCE' : 'AVAILABLE';
          return { ...unit, status: nextStatus };
        }
        return unit;
      })
    );
  };

  // Filter Logic
  const filteredFleet = fleetDatabase.filter(unit => {
    const matchesSearch = unit.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          unit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          unit.base.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || unit.agency === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getAgencyStyles = (agency) => {
    switch(agency) {
      case 'NAS': return { icon: <Truck size={18} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', badge: 'bg-emerald-500' };
      case 'GPS': return { icon: <Shield size={18} />, color: 'bg-blue-50 text-blue-600 border-blue-200', badge: 'bg-blue-600' };
      case 'GNFS': return { icon: <Flame size={18} />, color: 'bg-rose-50 text-rose-600 border-rose-200', badge: 'bg-rose-500' };
      case 'NADMO': return { icon: <AlertTriangle size={18} />, color: 'bg-amber-50 text-amber-600 border-amber-200', badge: 'bg-amber-500' };
      default: return { icon: <Truck size={18} />, color: 'bg-slate-50 text-slate-600 border-slate-200', badge: 'bg-slate-500' };
    }
  };

  const getStatusBadge = (unit) => {
    const baseClasses = "px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-full flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 active:scale-95";
    
    if (unit.status === 'AVAILABLE') {
      return (
        <button onClick={() => toggleFleetStatus(unit.id)} className={`${baseClasses} bg-emerald-100 text-emerald-700`} title="Toggle Status">
          <CheckCircle2 size={12}/> {unit.status}
        </button>
      );
    }
    if (unit.status === 'DISPATCHED') {
      return (
        <button onClick={() => toggleFleetStatus(unit.id)} className={`${baseClasses} bg-blue-100 text-blue-700`} title="Toggle Status">
          <Radio size={12}/> {unit.status}
        </button>
      );
    }
    return (
      <button onClick={() => toggleFleetStatus(unit.id)} className={`${baseClasses} bg-slate-200 text-slate-700`} title="Toggle Status">
        <Wrench size={12}/> {unit.status}
      </button>
    );
  };

  return (
    <AdminLayout>
      <div className="flex-1 bg-[#f8fafc] p-8 pb-32 h-full overflow-y-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-slate-900">Fleet & Units</h1>
              <span className="px-3 py-1 bg-slate-200 text-slate-700 text-sm font-semibold rounded-full flex items-center gap-1">
                <Truck size={14} />
                {fleetDatabase.length} Total Assets
              </span>
            </div>
            <p className="text-slate-500">Manage Ghanaian emergency vehicles, base assignments, and operational status.</p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Call Sign or Type..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Agency Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['ALL', 'NAS', 'GPS', 'GNFS', 'NADMO'].map(agency => (
            <button
              key={agency}
              onClick={() => setActiveFilter(agency)}
              className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-colors ${
                activeFilter === agency 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {agency === 'ALL' ? 'ALL AGENCIES' : agency}
            </button>
          ))}
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredFleet.map(unit => {
            const styles = getAgencyStyles(unit.agency);
            
            return (
              <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Card Header */}
                <div className={`px-5 py-4 border-b flex justify-between items-center ${styles.color}`}>
                  <div className="flex items-center gap-2 font-bold">
                    {styles.icon}
                    {unit.agency}
                  </div>
                  {/* Now calling the interactive button component */}
                  {getStatusBadge(unit)}
                </div>
                
                {/* Card Body */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 font-mono tracking-tight">{unit.id}</h3>
                      <p className="text-sm font-semibold text-slate-500 mt-0.5">{unit.type}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <MapPin size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Station / Base</p>
                        <p className="font-semibold text-slate-700">{unit.base}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <Shield size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Crew</p>
                        <p className="font-semibold text-slate-700">{unit.crew}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </AdminLayout>
  );
};

export default FleetUnits;