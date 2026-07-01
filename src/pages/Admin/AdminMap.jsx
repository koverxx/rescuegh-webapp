import React, { useState, useEffect } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Clock, Navigation2, CheckCircle2, MapPinOff, ShieldAlert } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useSearchParams, useNavigate } from 'react-router-dom';


const parseLocation = (loc) => {
  if (!loc) return null;


  if (typeof loc === 'object') {
    if (loc.lat !== undefined && loc.lng !== undefined) {
      return { lat: Number(loc.lat), lng: Number(loc.lng) };
    }
    if (loc.latitude !== undefined && loc.longitude !== undefined) {
      return { lat: Number(loc.latitude), lng: Number(loc.longitude) }; 
    }
    if (Array.isArray(loc) && loc.length >= 2) {
      return { lat: Number(loc[0]), lng: Number(loc[1]) }; 
    }
  }


  if (typeof loc === 'string') {
   
    const cleanString = loc.replace(/[a-zA-Z:]/g, '').trim();
    const parts = cleanString.split(',');
    
    if (parts.length >= 2) {
      const parsedLat = parseFloat(parts[0].trim());
      const parsedLng = parseFloat(parts[1].trim());
      
    
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        return { lat: parsedLat, lng: parsedLng };
      }
    }
  }

 
  return null;
};

const emergencyIcon = new L.divIcon({
  className: 'bg-transparent',
  html: `<div class="relative flex items-center justify-center w-10 h-10"><div class="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-60"></div><div class="relative w-4 h-4 bg-red-600 border-2 border-white rounded-full shadow-[0_0_15px_rgba(220,38,38,0.8)]"></div></div>`,
  iconSize: [40, 40]
});

const createUnitIcon = (label, colorClass) => new L.divIcon({
  className: 'bg-transparent',
  html: `<div class="w-10 h-10 ${colorClass} border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white text-xs font-black ring-4 ring-black/10">${label}</div>`,
  iconSize: [40, 40]
});

const TrackingController = ({ unit, incident }) => {
  const map = useMap();
  useEffect(() => {
    const coords = parseLocation(incident?.location);
    if (unit && coords) {
      const bounds = L.latLngBounds([unit.lat, unit.lng], [coords.lat, coords.lng]);
      map.fitBounds(bounds, { paddingTopLeft: [50, 50], paddingBottomRight: [400, 50], animate: true, duration: 1.2 });
    }
  }, [unit, incident, map]);
  return null;
};

const AdminMap = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlIncidentId = searchParams.get('incident');
  const urlUnitId = searchParams.get('unit');

  const [emergencies, setEmergencies] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [routePath, setRoutePath] = useState(null);
  const [routeStats, setRouteStats] = useState(null); 
  
  const [isDispatching, setIsDispatching] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(urlUnitId || 'NAS-01');

  const [ghanaUnits] = useState([
    { id: 'NAS-01', label: 'NAS', name: 'National Ambulance', lat: 5.6150, lng: -0.1900, color: 'bg-emerald-600', routeColor: '#059669' },
    { id: 'GPS-01', label: 'GPS', name: 'Ghana Police', lat: 5.5950, lng: -0.1800, color: 'bg-blue-800', routeColor: '#1e40af' },
    { id: 'GNFS-01', label: 'GNFS', name: 'Fire Service', lat: 5.6020, lng: -0.1700, color: 'bg-red-700', routeColor: '#b91c1c' },
    { id: 'NADMO-01', label: 'NADMO', name: 'Disaster Management', lat: 5.6050, lng: -0.1750, color: 'bg-amber-500', routeColor: '#f59e0b' }
  ]);

  const activeUnit = ghanaUnits.find(u => u.id === selectedUnitId) || ghanaUnits[0];
  const displayUnits = urlUnitId ? ghanaUnits.filter(u => u.id === urlUnitId) : ghanaUnits;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'emergencies'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setEmergencies(data);

      if (urlIncidentId) {
        const target = data.find(e => e.id === urlIncidentId);
        if (target) setSelectedIncident(target);
      }
    });
    return unsub;
  }, [urlIncidentId]);

  const displayEmergencies = urlIncidentId ? emergencies.filter(e => e.id === urlIncidentId) : emergencies;

  // Use the parsed location for the routing engine
  const selectedCoords = selectedIncident ? parseLocation(selectedIncident.location) : null;

  useEffect(() => {
    if (!selectedIncident || !selectedCoords) {
      setRoutePath(null);
      setRouteStats(null);
      return;
    }

    const fetchRealRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${activeUnit.lng},${activeUnit.lat};${selectedCoords.lng},${selectedCoords.lat}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          setRoutePath(route.geometry.coordinates.map(coord => [coord[1], coord[0]]));
          setRouteStats({ distance: (route.distance / 1000).toFixed(1), time: Math.ceil(route.duration / 60) });
        }
      } catch (error) { console.error("Routing error:", error); }
    };
    fetchRealRoute();
  }, [selectedIncident, activeUnit, selectedCoords]);

  const handleCloseCard = () => {
    setSelectedIncident(null);
    setIsDispatching(false);
    navigate('/active-incidents'); 
  };

  const handleExecuteDispatch = async () => {
    setIsDispatching(true);
    
    try {
      const emergencyRef = doc(db, 'emergencies', selectedIncident.id);
      await updateDoc(emergencyRef, {
        status: 'en-route',
        assignedUnit: activeUnit.label, 
        assignedUnitName: activeUnit.name,
        dispatchTime: new Date().toISOString()
      });

      setTimeout(() => {
        navigate('/active-incidents');
      }, 3000);

    } catch (error) {
      console.error("Firebase Update Error:", error);
      alert("Failed to connect to database. Check your Firebase rules.");
      setIsDispatching(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full h-[85vh] bg-gray-900 p-1 rounded-xl shadow-2xl relative overflow-hidden flex">
        
        <MapContainer center={[5.6037, -0.1869]} zoom={13} dragging={true} scrollWheelZoom={true} className="z-0" style={{ height: "100%", width: "100%", borderRadius: "10px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {displayUnits.map(unit => (
            <Marker key={unit.id} position={[unit.lat, unit.lng]} icon={createUnitIcon(unit.label, unit.color)}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1}><span className="font-bold">{unit.name}</span></Tooltip>
            </Marker>
          ))}

          {/* Plotting all valid emergencies using the parser */}
          {displayEmergencies.map(inc => {
            const coords = parseLocation(inc.location);
            return coords ? (
              <Marker key={inc.id} position={[coords.lat, coords.lng]} icon={emergencyIcon} eventHandlers={{ click: () => setSelectedIncident(inc) }} />
            ) : null;
          })}

          {selectedIncident && selectedCoords && (
            <>
              <TrackingController unit={activeUnit} incident={selectedIncident} />
              {routePath && (
                <Polyline positions={routePath} color={activeUnit.routeColor} weight={6} opacity={0.9} lineCap="round" lineJoin="round" />
              )}
            </>
          )}
        </MapContainer>

        {selectedIncident && (
          <div className="absolute top-6 right-6 z-[1000] w-80 bg-white/95 backdrop-blur-md shadow-2xl rounded-xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-8">
            
            <div className="bg-slate-900 text-white p-4 flex justify-between items-start border-b-[4px]" style={{ borderColor: activeUnit.routeColor }}>
              <div>
                <h3 className="font-black text-lg tracking-wide flex items-center gap-2 m-0">
                  <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" /> 
                  {selectedIncident.status === 'en-route' ? 'ACTIVE DEPLOYMENT' : 'ACTIVE SOS'}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1 mb-0">ID: {selectedIncident.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <button onClick={handleCloseCard} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>

            {isDispatching ? (
              <div className="p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-bounce" />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Unit Dispatched</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  <span className="font-bold text-slate-700">{activeUnit.name}</span> is en-route. Citizen app has been updated.
                </p>
              </div>
            ) : selectedIncident.status === 'en-route' ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldAlert className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Unit En-Route</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  <span className="font-bold text-slate-700">{selectedIncident.assignedUnitName || 'An emergency unit'}</span> is currently handling this incident.
                </p>
                {routeStats && (
                  <div className="mt-4 pt-4 border-t border-slate-200 w-full flex justify-between text-slate-600">
                    <span className="text-xs font-bold">{routeStats.distance} km remaining</span>
                    <span className="text-xs font-bold text-orange-500">{routeStats.time} mins ETA</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">1. Assign Agency</p>
                  <div className="grid grid-cols-4 gap-1">
                    {ghanaUnits.map(u => (
                      <button key={u.id} onClick={() => setSelectedUnitId(u.id)} className={`py-2 text-[10px] font-black rounded transition-all ${selectedUnitId === u.id ? u.color + ' text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">2. Route Logistics</p>
                  {!selectedCoords ? (
                    <div className="flex flex-col items-center justify-center py-3 text-red-500">
                      <MapPinOff className="w-6 h-6 mb-2 opacity-50" />
                      <span className="text-xs font-bold uppercase tracking-wider">No GPS Data Available</span>
                    </div>
                  ) : routeStats ? (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2"><Navigation2 className="w-5 h-5" style={{ color: activeUnit.routeColor }} /><span className="font-bold text-slate-700">{routeStats.distance} km</span></div>
                      <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-orange-500" /><span className="font-bold text-slate-700">{routeStats.time} mins</span></div>
                    </div>
                  ) : ( 
                    <div className="text-center py-2 text-xs font-bold text-slate-400 animate-pulse">Calculating optimal route...</div> 
                  )}
                </div>

                <div className="p-4">
                  <button 
                    className="w-full py-3 rounded-lg font-black text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95" 
                    style={{ backgroundColor: activeUnit.routeColor }} 
                    onClick={handleExecuteDispatch}
                  >
                    <CheckCircle2 className="w-5 h-5" /> DISPATCH NOW
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMap;