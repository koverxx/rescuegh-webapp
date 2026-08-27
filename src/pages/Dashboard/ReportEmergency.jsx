import React, { useState } from 'react';
import { Heart, Flame, Shield, Car, AlertTriangle, Plus, MapPin, Phone, User, FileText, Send, Crosshair, ArrowLeft, Camera, ImagePlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import MainLayout from '../../Layouts/MainLayout';
import { db, auth, storage } from '../../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// MAGIC WIRING: Fixed the Firebase Storage imports!
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 

const ReportEmergencyPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const [formData, setFormData] = useState({
    emergencyType: location.state?.prefilledType || '',
    priority: location.state?.prefilledPriority || '',
    location: '',
    description: '',
    injuries: '',
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFetchingGPS, setIsFetchingGPS] = useState(false); 
  const [selectedImage, setSelectedImage] = useState(null);

  const emergencyTypes = [
    { id: 'medical', label: 'Medical', description: 'Health emergencies', color: 'bg-red-500', icon: Heart },
    { id: 'fire', label: 'Fire', description: 'Fire incidents', color: 'bg-orange-500', icon: Flame },
    { id: 'police', label: 'Police', description: 'Crime & safety', color: 'bg-blue-500', icon: Shield },
    { id: 'accident', label: 'Accident', description: 'Vehicle accidents', color: 'bg-yellow-500', icon: Car },
    { id: 'natural', label: 'Natural', description: 'Natural disasters', color: 'bg-green-500', icon: AlertTriangle },
    { id: 'other', label: 'Other', description: 'Other emergencies', color: 'bg-gray-500', icon: Plus },
  ];

  const priorityLevels = [
    { id: 'critical', label: 'Critical', color: 'bg-red-500', description: 'Life threatening' },
    { id: 'high', label: 'High', color: 'bg-orange-500', description: 'Urgent response needed' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-500', description: 'Prompt attention' },
    { id: 'low', label: 'Low', color: 'bg-green-500', description: 'Non-urgent' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsFetchingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setFormData(prev => ({ ...prev, location: `GPS: ${lat}, ${lng}` }));
        setIsFetchingGPS(false);
      },
      (error) => {
        console.error("GPS Error:", error);
        alert("Unable to retrieve your location. Please type it manually.");
        setIsFetchingGPS(false);
      }
    );
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!formData.emergencyType || !formData.priority || !formData.location || !formData.description) {
      alert("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const currentUser = auth.currentUser;
      
      // --- 1. CONVERT IMAGE TO BASE64 (No Storage Bucket required!) ---
      let base64Image = null;
      if (selectedImage) {
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(selectedImage);
          reader.onloadend = () => resolve(reader.result);
        });
      }

      // --- 2. SAVE TO FIRESTORE ---
      await addDoc(collection(db, 'emergencies'), {
        reporterId: currentUser?.uid || "anonymous",
        emergencyType: formData.emergencyType,
        priorityLevel: formData.priority,
        location: formData.location, 
        description: formData.description,
        imageUrl: base64Image, // <--- SAVING THE IMAGE AS TEXT!
        status: "Pending",
        createdAt: serverTimestamp()
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => navigate(`/tracker`), 2000);

    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting. Please check console.");
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Report Submitted</h2>
          <p className="text-gray-600 mb-4">Your emergency report has been submitted successfully. Response teams have been notified.</p>
          <p className="text-sm text-gray-500">Stay safe. Help is on the way.</p>
        </div>
      </div>
    );
  }

  return (
  <MainLayout>
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* --- BACK BUTTON --- */}
    <button 
     onClick={() => navigate('/home')} 
     className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded-full text-sm font-bold hover:bg-white hover:shadow-sm transition-all mb-6 w-fit cursor-pointer"
    >
    <ArrowLeft size={16} />
     Back to Home
    </button>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Report Emergency</h1>
          <p className="text-gray-600">Provide details about the emergency situation</p>
        </div>

        {/* Emergency Banner */}
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center">
          <p className="font-semibold">🚨 For immediate life-threatening emergencies, call 112 🚨</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          
          {/* Emergency Type Selection */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Type of Emergency *</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {emergencyTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, emergencyType: type.id }))}
                    className={`bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all ${
                      formData.emergencyType === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <div className={`${type.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">{type.label}</h3>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Level */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Priority Level *</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {priorityLevels.map((priority) => (
                <button
                  key={priority.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: priority.id }))}
                  className={`p-4 rounded-lg border transition-all ${
                    formData.priority === priority.id 
                      ? `${priority.color} text-white shadow-md` 
                      : 'bg-white hover:shadow-md'
                  }`}
                >
                  <div className="font-semibold">{priority.label}</div>
                  <div className={`text-sm ${formData.priority === priority.id ? 'text-white' : 'text-gray-500'}`}>
                    {priority.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Location with Live GPS Integration */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <MapPin className="text-gray-600 mr-2" size={20} />
                <h2 className="text-xl font-semibold text-gray-800">Location *</h2>
              </div>
              <button 
                type="button" 
                onClick={getLocation}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
              >
                <Crosshair size={16} className={`mr-1 ${isFetchingGPS ? 'animate-spin' : ''}`} />
                {isFetchingGPS ? 'Locating...' : 'Use Current GPS'}
              </button>
            </div>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Building, floor, room number, address, or click 'Use Current GPS'"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <FileText className="text-gray-600 mr-2" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Description *</h2>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what happened, current status, and any immediate actions taken..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Injuries/Casualties */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Heart className="text-gray-600 mr-2" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Injuries/Casualties</h2>
            </div>
            <textarea
              name="injuries"
              value={formData.injuries}
              onChange={handleInputChange}
              placeholder="Number of people affected, type of injuries, medical attention needed..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Reporter Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <User className="text-gray-600 mr-2" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Reporter Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="tel"
                name="reporterPhone"
                value={formData.reporterPhone}
                onChange={handleInputChange}
                placeholder="Phone number"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <input
              type="email"
              name="reporterEmail"
              value={formData.reporterEmail}
              onChange={handleInputChange}
              placeholder="Email address (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-4"
            />
          </div>

          {/* Media / Evidence (Optional) */}
<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
  <div className="flex items-center gap-2 mb-4">
    <Camera className="text-slate-500" size={20} />
    <h3 className="font-bold text-slate-800">Add Emergency Image (Optional)</h3>
  </div>
  
  <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors">
    <div className="text-center">
      {selectedImage ? (
        <div className="flex flex-col items-center animate-in fade-in">
          <div className="w-16 h-16 mb-3 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            {/* Show a tiny preview of the image */}
            <img 
              src={URL.createObjectURL(selectedImage)} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm text-emerald-600 font-bold mb-2">
            Image Attached: {selectedImage.name}
          </span>
          <button 
            type="button" 
            onClick={() => setSelectedImage(null)} 
            className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <>
          <ImagePlus className="mx-auto h-12 w-12 text-slate-300" strokeWidth={1.5} />
          <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-bold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
            >
              <span>Upload a photo</span>
              <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </label>
            <p className="pl-1 font-medium">or drag and drop</p>
          </div>
          <p className="text-xs font-medium leading-5 text-slate-400 mt-1">PNG, JPG, or GIF up to 10MB</p>
        </>
      )}
    </div>
  </div>
</div>

          {/* Additional Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Any other relevant details, witnesses, or special circumstances..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting || !formData.emergencyType || !formData.priority || !formData.location || !formData.description}
              className={`px-8 py-4 rounded-lg font-semibold text-white transition-all ${
                isSubmitting || !formData.emergencyType || !formData.priority || !formData.location || !formData.description
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Transmitting Payload...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Send className="mr-2" size={20} />
                  Submit Emergency Report
                </div>
              )}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  </MainLayout>
  );
};

export default ReportEmergencyPage;