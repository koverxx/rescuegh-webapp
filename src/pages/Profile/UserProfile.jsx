import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layouts/MainLayout';
import { 
  User, Phone, Heart, Activity, Shield, 
  Save, LogOut, Plus, Trash2, CheckCircle, ArrowLeft 
} from 'lucide-react';

// Firebase imports
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    email: '',
    bloodType: '',
    allergies: '',
    medicalConditions: '',
    emergencyContacts: [
      { name: '', relation: '', phone: '' }
    ]
  });

  // 1. Fetch Existing Data on Load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Pre-fill email from Auth
        setProfileData(prev => ({ ...prev, email: user.email }));

        // Check Firestore for a saved profile
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setProfileData(prev => ({
            ...prev,
            ...data,
            // Ensure there is always at least one empty contact row if they deleted them all
            emergencyContacts: data.emergencyContacts?.length > 0 
              ? data.emergencyContacts 
              : [{ name: '', relation: '', phone: '' }]
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...profileData.emergencyContacts];
    updatedContacts[index][field] = value;
    setProfileData(prev => ({ ...prev, emergencyContacts: updatedContacts }));
  };

  const addContactRow = () => {
    if (profileData.emergencyContacts.length >= 3) {
      alert("You can only add up to 3 emergency contacts.");
      return;
    }
    setProfileData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', relation: '', phone: '' }]
    }));
  };

  const removeContactRow = (index) => {
    const updatedContacts = profileData.emergencyContacts.filter((_, i) => i !== index);
    setProfileData(prev => ({ ...prev, emergencyContacts: updatedContacts }));
  };

  // 2. Save to Firebase
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      // Clean up empty contact rows before saving
      const cleanedContacts = profileData.emergencyContacts.filter(
        contact => contact.name.trim() !== '' || contact.phone.trim() !== ''
      );

      const finalDataToSave = {
        ...profileData,
        emergencyContacts: cleanedContacts,
        updatedAt: new Date()
      };

      // setDoc with { merge: true } creates the doc if it doesn't exist, or updates it if it does!
      await setDoc(doc(db, 'users', user.uid), finalDataToSave, { merge: true });
      
      // Update local state to reflect the cleaned contacts so the UI doesn't look broken
      setProfileData(prev => ({
        ...prev,
        emergencyContacts: cleanedContacts.length > 0 ? cleanedContacts : [{ name: '', relation: '', phone: '' }]
      }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3s

    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Logout functionality
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* --- BACK BUTTON --- */}
        <button 
          onClick={() => navigate('/home')} 
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded-full text-sm font-bold hover:bg-white hover:shadow-sm transition-all mb-6 w-fit cursor-pointer"
     >
        <ArrowLeft size={16} />
            Back to Home
        </button>
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Medical ID & Profile</h1>
              <p className="text-gray-600">Keep your emergency data up to date for first responders.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors font-medium shadow-sm"
            >
              <LogOut size={18} className="mr-2" /> Sign Out
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-blue-50/50 p-4 border-b border-gray-100 flex items-center">
                <User className="text-blue-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Legal Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    placeholder="e.g. Kwame Mensah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Primary Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Account Email (Cannot be changed)</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Medical ID Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-red-50/50 p-4 border-b border-gray-100 flex items-center">
                <Activity className="text-red-500 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Medical Data</h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Blood Type</label>
                  <select
                    name="bloodType"
                    value={profileData.bloodType}
                    onChange={handleInputChange}
                    className="w-full md:w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
                  >
                    <option value="">Select Blood Type...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="Unknown">I don't know</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Severe Allergies</label>
                  <textarea
                    name="allergies"
                    value={profileData.allergies}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
                    placeholder="e.g. Penicillin, Peanuts (Leave blank if none)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Existing Medical Conditions</label>
                  <textarea
                    name="medicalConditions"
                    value={profileData.medicalConditions}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
                    placeholder="e.g. Asthma, Type 1 Diabetes, Hypertension (Leave blank if none)"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contacts Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-green-50/50 p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="text-green-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Emergency Contacts</h2>
                </div>
                {profileData.emergencyContacts.length < 3 && (
                  <button 
                    type="button" 
                    onClick={addContactRow}
                    className="flex items-center text-sm text-green-700 font-bold bg-green-100 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Plus size={16} className="mr-1" /> Add
                  </button>
                )}
              </div>
              
              <div className="p-6 space-y-6">
                {profileData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="relative p-4 border border-gray-200 rounded-lg bg-gray-50">
                    {/* Delete button (Only show if there is more than 1 row) */}
                    {profileData.emergencyContacts.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeContactRow(index)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove Contact"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Contact #{index + 1}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                          className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-green-500 outline-none"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Relationship</label>
                        <input
                          type="text"
                          value={contact.relation}
                          onChange={(e) => handleContactChange(index, 'relation', e.target.value)}
                          className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-green-500 outline-none"
                          placeholder="Sister, Spouse, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                          className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-green-500 outline-none"
                          placeholder="+233 XX XXX XXXX"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-col items-center pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className={`w-full md:w-96 flex items-center justify-center py-4 rounded-xl font-bold text-white transition-all shadow-md ${
                  isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg'
                }`}
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Encrypting Data...
                  </div>
                ) : saveSuccess ? (
                  <div className="flex items-center text-green-100">
                    <CheckCircle className="mr-2" size={20} />
                    Profile Secured
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="mr-2" size={20} />
                    Save Medical ID
                  </div>
                )}
              </button>
              
              {saveSuccess && (
                <p className="text-green-600 font-medium mt-4 animate-pulse">Your data has been securely saved to the database.</p>
              )}
            </div>

          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfile;