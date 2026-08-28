import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layouts/MainLayout';
import { 
  MapPin, Navigation, Phone, Radio, Clock, User, Truck,
  Activity, Shield, Heart, Flame, Search, Filter,
  UserCheck, AlertCircle, CheckCircle, XCircle, Battery, Signal, Route, Crosshair, ArrowLeft
} from 'lucide-react';

const RespondersNearby = () => {
  const routerState = useLocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(routerState.state?.crisisType || 'all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  
  const [userLocation, setUserLocation] = useState({ lat: 5.6037, lng: -0.1870, address: 'System Default (Accra)' });
  const [isLocating, setIsLocating] = useState(false);
  
  const [liveResponders, setLiveResponders] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1)); 
  };

  const fetchOpenStreetData = async (userLat, userLng) => {
    setIsFetchingData(true);
    setLiveResponders([]); 

    const radius = 10000;
    
    // A clean, single-line query formatted for a GET request URL
    const query = `[out:json][timeout:25];(node["amenity"="hospital"](around:${radius},${userLat},${userLng});node["amenity"="clinic"](around:${radius},${userLat},${userLng});node["amenity"="police"](around:${radius},${userLat},${userLng});node["amenity"="fire_station"](around:${radius},${userLat},${userLng}););out body;`;

    try {
      // Switching to a GET request bypasses the strict POST CORS blocks on live domains
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`OSM Server Error: ${response.status}`);
      
      const data = await response.json();
      
      if (!data || !data.elements) throw new Error("Invalid data structure returned");

      const formattedResults = data.elements.map(place => {
        const dist = calculateDistance(userLat, userLng, place.lat, place.lon);
        
        let type = 'Medical';
        if (place.tags.amenity === 'police') type = 'Police';
        if (place.tags.amenity === 'fire_station') type = 'Fire';

        const facilityName = place.tags.name || `Unnamed ${type} Facility`;
        const address = place.tags['addr:street'] || place.tags['addr:city'] || place.tags['addr:full'] || 'Address unavailable';
        const phone = place.tags.phone || place.tags['contact:phone'] || 'N/A';

        return {
          id: place.id.toString().substring(0, 8), 
          name: facilityName,
          type: type,
          status: 'available', 
          location: { lat: place.lat, lng: place.lon, address: address },
          phone: phone,
          distance: dist,
          eta: Math.ceil(dist * 3), 
          crew: [{ name: 'OSM Open Data', role: 'Source', years: 'Verified' }],
          capabilities: ['Public Facility'],
          lastUpdate: new Date(),
          batteryLevel: 100, 
          signalStrength: 'excellent'
        };
      });

      const validResults = formattedResults.filter(r => !r.name.includes('Unnamed'));
      setLiveResponders(validResults);

    } catch (error) {
      console.error("Overpass API Error:", error);
      alert(`Failed to pull map data: ${error.message}. The public OSM server might be temporarily busy.`);
    } finally {
      setIsFetchingData(false);
    }
  };

  const grabLiveLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setUserLocation({ lat, lng, address: 'Your Live GPS Location' });
          setIsLocating(false);
          fetchOpenStreetData(lat, lng);
        },
        (error) => {
          console.error("GPS Error:", error);
          alert("Could not access GPS. Please enable location services.");
          setIsLocating(false);
        },
        { enableHighAccuracy: false, timeout: 30000, maximumAge: 0 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'fire': return <Flame className="h-5 w-5 text-red-500" />;
      case 'medical': return <Heart className="h-5 w-5 text-red-500" />;
      case 'police': return <Shield className="h-5 w-5 text-blue-500" />;
      default: return <Truck className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleCallUnit = (responder) => {
    if (responder.phone && responder.phone !== 'N/A') {
      window.location.href = `tel:${responder.phone}`;
      return;
    }

    let dispatchNumber = '112'; 
    if (responder.type === 'Police') dispatchNumber = '191';
    else if (responder.type === 'Fire') dispatchNumber = '192';
    else if (responder.type === 'Medical') dispatchNumber = '193';

    alert(`No direct line listed for ${responder.name}. Redirecting to National ${responder.type} Dispatch (${dispatchNumber}).`);
    window.location.href = `tel:${dispatchNumber}`;
  };

  const filteredResponders = liveResponders.filter(responder => {
    const matchesSearch = responder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         responder.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || responder.type.toLowerCase() === selectedType.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || responder.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedResponders = [...filteredResponders].sort((a, b) => {
    switch (sortBy) {
      case 'distance': return a.distance - b.distance; 
      case 'eta': return a.eta - b.eta;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const responderTypes = [...new Set(liveResponders.map(r => r.type))];
  const availableCount = liveResponders.filter(r => r.status === 'available').length;

  const navigate = useNavigate();

  return (
    <MainLayout>
    <div className="min-h-screen">
          <button 
            onClick={() => navigate('/home')} 
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded-full text-sm font-bold hover:bg-white hover:shadow-sm transition-all mb-6 w-fit cursor-pointer"
          >
          <ArrowLeft size={16} />
             Back to Home
          </button>
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 flex items-center gap-2">
                <Navigation className="h-6 w-6 text-blue-500 shrink-0" />
                Responders Nearby
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time mapping via OpenStreetMap Data
              </p>
            </div>
            
            <div className="self-start md:text-right">
              <div className="text-sm text-gray-600 mb-1 flex items-center md:justify-end">
                <MapPin size={14} className="mr-1 text-red-500" /> 
                System Reference Point 
              </div>
              <button 
                onClick={grabLiveLocation}
                disabled={isLocating || isFetchingData}
                className="flex items-center w-full md:w-auto justify-center text-sm font-semibold bg-blue-50 text-blue-700 px-4 py-2 rounded-lg md:rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                <Crosshair size={14} className={`mr-2 ${(isLocating || isFetchingData) ? 'animate-spin' : ''}`} />
                {isLocating ? 'Acquiring GPS...' : isFetchingData ? 'Querying OSM Database...' : userLocation.address}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {liveResponders.length === 0 && !isFetchingData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center mb-6">
            <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Awaiting Coordinates</h3>
            <p className="text-gray-600 text-sm md:text-base">Click the "System Reference Point" button to locate your coordinates and ping the database.</p>
          </div>
        )}

        {liveResponders.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500 shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Verified Units</p>
                    <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <Truck className="h-8 w-8 text-blue-500 shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total Pulled from API</p>
                    <p className="text-2xl font-bold text-gray-900">{liveResponders.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter exact facilities..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 lg:gap-4">
                  <select
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${selectedType !== 'all' ? 'bg-red-50 border-red-300 font-bold text-red-700' : 'border-gray-300'}`}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">All Disciplines</option>
                    {responderTypes.map(type => (
                      <option key={type} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </select>

                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm md:text-base"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="distance">📍 Sort by Closest</option>
                    <option value="eta">⏱ Sort by Fastest ETA</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedResponders.map((responder) => (
                <div key={responder.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all">
                  <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 shrink-0">
                          {getTypeIcon(responder.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight truncate" title={responder.name}>{responder.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-1">
                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">ID: {responder.id}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="font-semibold uppercase tracking-wider text-[10px]">{responder.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 ml-2">
                        <span className={`px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold border uppercase tracking-wider ${getStatusColor(responder.status)}`}>
                          {responder.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 text-xs md:text-sm">
                        <Route className="h-4 w-4 md:h-5 md:w-5 text-blue-600 shrink-0" />
                        <span className="text-gray-900 font-bold truncate">{responder.distance} km away</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm border-l border-gray-200 pl-3 md:pl-4">
                        <Clock className="h-4 w-4 md:h-5 md:w-5 text-orange-500 shrink-0" />
                        <span className="text-gray-900 font-bold truncate">ETA: {responder.eta} min</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-start gap-2 text-xs md:text-sm text-gray-700 font-medium">
                        <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{responder.location.address}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleCallUnit(responder)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition-colors text-sm w-full justify-center"
                      >
                        <Phone className="h-4 w-4 shrink-0" /> 
                        {responder.phone !== 'N/A' ? 'Call Direct Line' : 'Call Dispatch'}
                      </button>
                      
                      <button 
                        onClick={() => window.open(`http://maps.google.com/?q=${responder.location.lat},${responder.location.lng}`)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 shadow-sm transition-colors text-sm w-full justify-center"
                      >
                        <Navigation className="h-4 w-4 shrink-0" /> Map Route
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
    </MainLayout>
  );
};

export default RespondersNearby;