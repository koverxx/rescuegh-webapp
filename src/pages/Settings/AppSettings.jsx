import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  MapPin, 
  Phone, 
  Volume2, 
  Smartphone, 
  User, 
  Lock, 
  Globe, 
  Moon, 
  Sun, 
  Zap,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Info
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    darkMode: false,
    language: 'en',
    autoLocation: true,
    soundEnabled: true,
    vibrationEnabled: true,
    
    // Emergency Settings
    emergencyMode: 'auto',
    panicButtonEnabled: true,
    silentAlarm: false,
    emergencyNumber: '911',
    locationAccuracy: 'high',
    emergencyTimeout: 30,
    
    // Notification Settings
    emergencyAlerts: true,
    weatherAlerts: true,
    medicalReminders: false,
    testAlerts: true,
    alertSound: 'urgent',
    alertVolume: 80,
    
    // Privacy & Security
    biometricAuth: true,
    autoLock: true,
    lockTimeout: 5,
    shareLocation: true,
    anonymousReporting: false,
    
    // Account Settings
    syncEnabled: true,
    backupEnabled: true,
    dataRetention: 30,
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Save logic would go here
    console.log('Settings saved:', settings);
    setHasChanges(false);
  };

  const resetSettings = () => {
    // Reset to defaults
    setHasChanges(false);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'emergency-app-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: User },
  ];

  const ToggleSwitch = ({ enabled, onToggle, disabled = false }) => (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-red-500' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const SettingItem = ({ icon: Icon, title, description, children, warning }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 mt-1 ${warning ? 'text-yellow-500' : 'text-gray-500'}`} />
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          {warning && (
            <p className="text-xs text-yellow-600 mt-1 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {warning}
            </p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-4">
      <SettingItem
        icon={settings.darkMode ? Moon : Sun}
        title="Dark Mode"
        description="Switch between light and dark themes"
      >
        <ToggleSwitch
          enabled={settings.darkMode}
          onToggle={() => updateSetting('darkMode', !settings.darkMode)}
        />
      </SettingItem>

      <SettingItem
        icon={Globe}
        title="Language"
        description="Select your preferred language"
      >
        <select
          value={settings.language}
          onChange={(e) => updateSetting('language', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </SettingItem>

      <SettingItem
        icon={MapPin}
        title="Auto Location"
        description="Automatically detect your location"
      >
        <ToggleSwitch
          enabled={settings.autoLocation}
          onToggle={() => updateSetting('autoLocation', !settings.autoLocation)}
        />
      </SettingItem>

      <SettingItem
        icon={Volume2}
        title="Sound Effects"
        description="Enable sound effects and alerts"
      >
        <ToggleSwitch
          enabled={settings.soundEnabled}
          onToggle={() => updateSetting('soundEnabled', !settings.soundEnabled)}
        />
      </SettingItem>

      <SettingItem
        icon={Smartphone}
        title="Vibration"
        description="Enable vibration for alerts"
      >
        <ToggleSwitch
          enabled={settings.vibrationEnabled}
          onToggle={() => updateSetting('vibrationEnabled', !settings.vibrationEnabled)}
        />
      </SettingItem>
    </div>
  );

  const renderEmergencySettings = () => (
    <div className="space-y-4">
      <SettingItem
        icon={Zap}
        title="Emergency Mode"
        description="How the app handles emergency situations"
      >
        <select
          value={settings.emergencyMode}
          onChange={(e) => updateSetting('emergencyMode', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        >
          <option value="auto">Auto-detect</option>
          <option value="manual">Manual only</option>
          <option value="assisted">Assisted mode</option>
        </select>
      </SettingItem>

      <SettingItem
        icon={AlertTriangle}
        title="Panic Button"
        description="Enable quick emergency activation"
        warning="Disable only if accidentally triggered frequently"
      >
        <ToggleSwitch
          enabled={settings.panicButtonEnabled}
          onToggle={() => updateSetting('panicButtonEnabled', !settings.panicButtonEnabled)}
        />
      </SettingItem>

      <SettingItem
        icon={Phone}
        title="Emergency Number"
        description="Primary emergency contact number"
      >
        <input
          type="tel"
          value={settings.emergencyNumber}
          onChange={(e) => updateSetting('emergencyNumber', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 w-24"
        />
      </SettingItem>

      <SettingItem
        icon={MapPin}
        title="Location Accuracy"
        description="GPS precision for emergency services"
      >
        <select
          value={settings.locationAccuracy}
          onChange={(e) => updateSetting('locationAccuracy', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        >
          <option value="high">High (GPS)</option>
          <option value="medium">Medium (WiFi)</option>
          <option value="low">Low (Cell tower)</option>
        </select>
      </SettingItem>

      <SettingItem
        icon={AlertTriangle}
        title="Silent Alarm"
        description="Activate emergency without sound"
      >
        <ToggleSwitch
          enabled={settings.silentAlarm}
          onToggle={() => updateSetting('silentAlarm', !settings.silentAlarm)}
        />
      </SettingItem>

      <SettingItem
        icon={Clock}
        title="Emergency Timeout"
        description="Seconds before auto-calling emergency services"
      >
        <input
          type="number"
          value={settings.emergencyTimeout}
          onChange={(e) => updateSetting('emergencyTimeout', parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 w-20"
          min="5"
          max="60"
        />
      </SettingItem>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <SettingItem
        icon={Bell}
        title="Emergency Alerts"
        description="Critical emergency notifications"
      >
        <ToggleSwitch
          enabled={settings.emergencyAlerts}
          onToggle={() => updateSetting('emergencyAlerts', !settings.emergencyAlerts)}
        />
      </SettingItem>

      <SettingItem
        icon={AlertTriangle}
        title="Weather Alerts"
        description="Severe weather warnings"
      >
        <ToggleSwitch
          enabled={settings.weatherAlerts}
          onToggle={() => updateSetting('weatherAlerts', !settings.weatherAlerts)}
        />
      </SettingItem>

      <SettingItem
        icon={Bell}
        title="Medical Reminders"
        description="Medication and appointment alerts"
      >
        <ToggleSwitch
          enabled={settings.medicalReminders}
          onToggle={() => updateSetting('medicalReminders', !settings.medicalReminders)}
        />
      </SettingItem>

      <SettingItem
        icon={Volume2}
        title="Alert Sound"
        description="Sound for emergency notifications"
      >
        <select
          value={settings.alertSound}
          onChange={(e) => updateSetting('alertSound', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        >
          <option value="urgent">Urgent</option>
          <option value="standard">Standard</option>
          <option value="gentle">Gentle</option>
          <option value="silent">Silent</option>
        </select>
      </SettingItem>

      <SettingItem
        icon={Volume2}
        title="Alert Volume"
        description="Volume level for emergency alerts"
      >
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="100"
            value={settings.alertVolume}
            onChange={(e) => updateSetting('alertVolume', parseInt(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-600 w-8">{settings.alertVolume}%</span>
        </div>
      </SettingItem>

      <SettingItem
        icon={Bell}
        title="Test Alerts"
        description="Allow test emergency notifications"
      >
        <ToggleSwitch
          enabled={settings.testAlerts}
          onToggle={() => updateSetting('testAlerts', !settings.testAlerts)}
        />
      </SettingItem>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-4">
      <SettingItem
        icon={Lock}
        title="Biometric Authentication"
        description="Use fingerprint or face recognition"
      >
        <ToggleSwitch
          enabled={settings.biometricAuth}
          onToggle={() => updateSetting('biometricAuth', !settings.biometricAuth)}
        />
      </SettingItem>

      <SettingItem
        icon={Lock}
        title="Auto-Lock"
        description="Automatically lock the app"
      >
        <ToggleSwitch
          enabled={settings.autoLock}
          onToggle={() => updateSetting('autoLock', !settings.autoLock)}
        />
      </SettingItem>

      <SettingItem
        icon={Lock}
        title="Lock Timeout"
        description="Minutes before auto-lock activates"
      >
        <select
          value={settings.lockTimeout}
          onChange={(e) => updateSetting('lockTimeout', parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        >
          <option value={1}>1 minute</option>
          <option value={5}>5 minutes</option>
          <option value={10}>10 minutes</option>
          <option value={30}>30 minutes</option>
        </select>
      </SettingItem>

      <SettingItem
        icon={MapPin}
        title="Share Location"
        description="Allow location sharing with emergency contacts"
      >
        <ToggleSwitch
          enabled={settings.shareLocation}
          onToggle={() => updateSetting('shareLocation', !settings.shareLocation)}
        />
      </SettingItem>

      <SettingItem
        icon={Eye}
        title="Anonymous Reporting"
        description="Report incidents without personal information"
      >
        <ToggleSwitch
          enabled={settings.anonymousReporting}
          onToggle={() => updateSetting('anonymousReporting', !settings.anonymousReporting)}
        />
      </SettingItem>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-4">
      <SettingItem
        icon={Globe}
        title="Sync Settings"
        description="Synchronize settings across devices"
      >
        <ToggleSwitch
          enabled={settings.syncEnabled}
          onToggle={() => updateSetting('syncEnabled', !settings.syncEnabled)}
        />
      </SettingItem>

      <SettingItem
        icon={Download}
        title="Backup Data"
        description="Automatically backup your emergency data"
      >
        <ToggleSwitch
          enabled={settings.backupEnabled}
          onToggle={() => updateSetting('backupEnabled', !settings.backupEnabled)}
        />
      </SettingItem>

      <SettingItem
        icon={Trash2}
        title="Data Retention"
        description="Days to keep emergency logs"
      >
        <select
          value={settings.dataRetention}
          onChange={(e) => updateSetting('dataRetention', parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        >
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
          <option value={365}>1 year</option>
        </select>
      </SettingItem>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Data Management</h3>
        <div className="space-y-2">
          <button
            onClick={exportSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Settings</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import Settings</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors">
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'emergency':
        return renderEmergencySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'account':
        return renderAccountSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Configure your emergency preferences</p>
              </div>
            </div>
            {hasChanges && (
              <div className="flex space-x-2">
                <button
                  onClick={resetSettings}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={saveSettings}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tab Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-50 text-red-600 border-l-4 border-red-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {tabs.find(tab => tab.id === activeTab)?.label} Settings
                </h2>
                <p className="text-gray-600">
                  {activeTab === 'general' && 'Configure basic app preferences and behavior'}
                  {activeTab === 'emergency' && 'Customize emergency response settings'}
                  {activeTab === 'notifications' && 'Manage alert preferences and sounds'}
                  {activeTab === 'privacy' && 'Control privacy and security options'}
                  {activeTab === 'account' && 'Manage account and data settings'}
                </p>
              </div>
              
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Emergency Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mt-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Important</h3>
              <p className="text-yellow-700 text-sm">
                Emergency settings are critical for your safety. Test your configuration regularly and ensure 
                emergency contacts are up to date. Some settings may affect battery life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
