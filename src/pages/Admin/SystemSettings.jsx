import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
  Settings, Bell, Shield, Database, User, Volume2, 
  Map as MapIcon, CheckCircle2, Save, Loader2, Radio
} from 'lucide-react';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form States (Simulated Preferences)
  const [settings, setSettings] = useState({
    audioAlerts: true,
    desktopPush: true,
    smsFallback: false,
    autoDispatch: false,
    dispatchRadius: '5',
    mapStyle: 'satellite',
    sessionTimeout: '30',
    dataBackup: 'daily'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      setToastMessage('System preferences successfully updated.');
      setTimeout(() => setToastMessage(''), 3000);
    }, 1500);
  };

  // Reusable Toggle Switch Component
  const ToggleSwitch = ({ label, description, isOn, onToggle }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div className="pr-8">
        <h4 className="text-sm font-bold text-slate-800">{label}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button 
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOn ? 'bg-blue-600' : 'bg-slate-200'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex-1 bg-[#f8fafc] p-8 pb-32 h-full overflow-y-auto relative">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
              <span className="px-3 py-1 bg-slate-200 text-slate-700 text-sm font-semibold rounded-full flex items-center gap-1">
                <Settings size={14} /> Configuration
              </span>
            </div>
            <p className="text-slate-500">Manage dispatch protocols, notifications, and operational preferences.</p>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow-sm transition-all disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Settings Sidebar */}
          <div className="w-full lg:w-64 shrink-0 space-y-1">
            <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'notifications' ? 'bg-white border border-slate-200 text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
              <Bell size={18} /> Alerts & Notifications
            </button>
            <button onClick={() => setActiveTab('protocols')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'protocols' ? 'bg-white border border-slate-200 text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
              <Radio size={18} /> Dispatch Protocols
            </button>
            <button onClick={() => setActiveTab('account')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'account' ? 'bg-white border border-slate-200 text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
              <User size={18} /> Operator Account
            </button>
            <button onClick={() => setActiveTab('system')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'system' ? 'bg-white border border-slate-200 text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
              <Database size={18} /> System & Data
            </button>
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
            
            {/* ALERTS & NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="p-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Volume2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Alerts & Notifications</h2>
                    <p className="text-sm text-slate-500">Control how the system notifies you of incoming emergencies.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <ToggleSwitch 
                    label="Master Audio Chimes" 
                    description="Play a siren or chime sound when a new high-priority SOS is received." 
                    isOn={settings.audioAlerts} 
                    onToggle={() => handleToggle('audioAlerts')} 
                  />
                  <ToggleSwitch 
                    label="Desktop Push Notifications" 
                    description="Show browser-level pop-ups even when the dashboard is minimized." 
                    isOn={settings.desktopPush} 
                    onToggle={() => handleToggle('desktopPush')} 
                  />
                  <ToggleSwitch 
                    label="SMS Fallback Alerts" 
                    description="Send a text message to the duty manager if an SOS is pending for over 3 minutes." 
                    isOn={settings.smsFallback} 
                    onToggle={() => handleToggle('smsFallback')} 
                  />
                </div>
              </div>
            )}

            {/* DISPATCH PROTOCOLS TAB */}
            {activeTab === 'protocols' && (
              <div className="p-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <MapIcon size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Dispatch Protocols</h2>
                    <p className="text-sm text-slate-500">Configure routing rules and unit assignment logic.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <ToggleSwitch 
                    label="AI Auto-Dispatch" 
                    description="Automatically assign the closest available unit to an incident without manual confirmation." 
                    isOn={settings.autoDispatch} 
                    onToggle={() => handleToggle('autoDispatch')} 
                  />

                  <div className="py-2">
                    <label className="block text-sm font-bold text-slate-800 mb-2">Default Search Radius (Kilometers)</label>
                    <select 
                      value={settings.dispatchRadius}
                      onChange={(e) => handleChange('dispatchRadius', e.target.value)}
                      className="w-full md:w-1/2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="2">2 km (Dense Urban)</option>
                      <option value="5">5 km (Standard City)</option>
                      <option value="10">10 km (Peri-urban / Outskirts)</option>
                      <option value="25">25+ km (Regional)</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Determines how far the system looks for available NAS or GPS units.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <div className="p-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Operator Account</h2>
                    <p className="text-sm text-slate-500">Manage your dispatcher credentials and assigned sector.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Operator ID</label>
                    <input type="text" disabled value="OPR-774-ACCRA" className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 font-mono font-bold cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" defaultValue="Admin User" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assigned Station / HQ</label>
                    <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Accra Regional Police Command (GPS)</option>
                      <option>National Ambulance Service HQ (NAS)</option>
                      <option>Makola Fire Command (GNFS)</option>
                      <option>NADMO Greater Accra Base</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SYSTEM & DATA TAB */}
            {activeTab === 'system' && (
              <div className="p-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <Database size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">System & Data</h2>
                    <p className="text-sm text-slate-500">Manage security sessions and audit log backups.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="py-2">
                    <label className="block text-sm font-bold text-slate-800 mb-2">Auto-Lock Session Timeout</label>
                    <select 
                      value={settings.sessionTimeout}
                      onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                      className="w-full md:w-1/2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">1 Hour</option>
                      <option value="never">Never (Not Recommended)</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Automatically logs out the dispatcher if no mouse/keyboard activity is detected.</p>
                  </div>

                  <div className="py-2">
                    <label className="block text-sm font-bold text-slate-800 mb-2">Automated Incident Backup</label>
                    <select 
                      value={settings.dataBackup}
                      onChange={(e) => handleChange('dataBackup', e.target.value)}
                      className="w-full md:w-1/2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hourly">Every Hour</option>
                      <option value="daily">End of Day (Midnight GMT)</option>
                      <option value="weekly">End of Week</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Frequency of raw incident data sent to the secure government server.</p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <button className="px-4 py-2 bg-red-50 text-red-700 font-bold text-sm rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                      Clear Local Cache
                    </button>
                    <p className="text-xs text-slate-500 mt-2">Use this if the live feed map gets stuck or out of sync.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300">
            <CheckCircle2 size={20} className="text-emerald-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default SystemSettings;