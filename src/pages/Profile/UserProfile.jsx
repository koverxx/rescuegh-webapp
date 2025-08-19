import React, { useState } from 'react';
import { User, Phone, Heart, MapPin, Bell, Shield, Edit3, Save, X, Plus, AlertTriangle } from 'lucide-react';
import MainLayout from '../../Layouts/MainLayout';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Sarah Johnson', relationship: 'Spouse', phone: '+1 (555) 123-4567', priority: 1 },
    { id: 2, name: 'Michael Davis', relationship: 'Brother', phone: '+1 (555) 987-6543', priority: 2 },
    { id: 3, name: 'Dr. Amanda Chen', relationship: 'Doctor', phone: '+1 (555) 456-7890', priority: 3 }
  ]);
  
  const [userInfo, setUserInfo] = useState({
    name: 'John Anderson',
    phone: '+1 (555) 234-5678',
    email: 'john.anderson@email.com',
    address: '1234 Main Street, Anytown, ST 12345',
    bloodType: 'A+',
    allergies: 'Penicillin, Shellfish',
    medications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
    medicalConditions: 'Hypertension, Type 2 Diabetes',
    emergencyNotes: 'Diabetic - check blood sugar if unconscious'
  });

  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    locationSharing: true,
    medicalReminders: false,
    weatherAlerts: true
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
  };

  const addEmergencyContact = () => {
    const newContact = {
      id: Date.now(),
      name: '',
      relationship: '',
      phone: '',
      priority: emergencyContacts.length + 1
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
  };

  const removeContact = (id) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
  };

  const updateContact = (id, field, value) => {
    setEmergencyContacts(emergencyContacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  return (
    <MainLayout>
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{userInfo.name}</h1>
                <p className="text-gray-600">{userInfo.email}</p>
                <div className="flex items-center mt-2">
                  <Shield className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">Profile Complete</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={userInfo.address}
                  onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Medical Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <select
                  value={userInfo.bloodType}
                  onChange={(e) => setUserInfo({...userInfo, bloodType: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                <input
                  type="text"
                  value={userInfo.allergies}
                  onChange={(e) => setUserInfo({...userInfo, allergies: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  placeholder="List any allergies..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                <textarea
                  value={userInfo.medications}
                  onChange={(e) => setUserInfo({...userInfo, medications: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  rows={2}
                  placeholder="List current medications..."
                />
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Contacts
              </h2>
              {isEditing && (
                <button
                  onClick={addEmergencyContact}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Contact</span>
                </button>
              )}
            </div>
            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {contact.priority}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                      disabled={!isEditing}
                      className="p-2 border border-gray-300 rounded disabled:bg-gray-50"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={contact.relationship}
                      onChange={(e) => updateContact(contact.id, 'relationship', e.target.value)}
                      disabled={!isEditing}
                      className="p-2 border border-gray-300 rounded disabled:bg-gray-50"
                      placeholder="Relationship"
                    />
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                      disabled={!isEditing}
                      className="p-2 border border-gray-300 rounded disabled:bg-gray-50"
                      placeholder="Phone Number"
                    />
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeContact(contact.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Notes */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              Emergency Notes
            </h2>
            <textarea
              value={userInfo.emergencyNotes}
              onChange={(e) => setUserInfo({...userInfo, emergencyNotes: e.target.value})}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              rows={4}
              placeholder="Any critical information for emergency responders..."
            />
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Settings
            </h2>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <button
                    onClick={() => setNotifications({...notifications, [key]: !value})}
                    disabled={!isEditing}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-red-500' : 'bg-gray-200'
                    } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg transition-colors">
              <Phone className="w-5 h-5" />
              <span>Call Emergency</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors">
              <MapPin className="w-5 h-5" />
              <span>Share Location</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors">
              <Heart className="w-5 h-5" />
              <span>Medical ID</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}
