import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';

const AdminMap = () => {
  return (
    <AdminLayout>
      <div className="p-6 h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Live Dispatch Map</h1>
          <p className="text-gray-500 font-medium">Real-time GPS tracking of incidents and active fleet units.</p>
        </div>

        {/* Placeholder for the actual map we will build next */}
        <div className="flex-1 bg-gray-200 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="z-10 flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <Navigation className="w-12 h-12 text-blue-500 mb-3" />
            <h2 className="text-xl font-bold text-gray-900">Map Module Initializing</h2>
            <p className="text-gray-500 max-w-md mt-2">
              The routing works! In the next step, we will inject the interactive OpenStreetMap here to plot the exact GPS coordinates of the incoming SOS requests.
            </p>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMap;