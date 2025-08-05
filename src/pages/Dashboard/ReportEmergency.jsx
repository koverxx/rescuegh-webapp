import React, { useState } from 'react';
import { Heart, Flame, Shield, Car, AlertTriangle, Plus, MapPin, Phone, User, Clock, FileText, Send } from 'lucide-react';

const ReportEmergencyPage = () => {
  const [formData, setFormData] = useState({
    emergencyType: '',
    priority: '',
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

  const emergencyTypes = [
    { 
      id: 'medical', 
      label: 'Medical', 
      description: 'Health emergencies',
      color: 'bg-red-500',
      icon: Heart
    },
    { 
      id: 'fire', 
      label: 'Fire', 
      description: 'Fire incidents',
      color: 'bg-orange-500',
      icon: Flame
    },
    { 
      id: 'police', 
      label: 'Police', 
      description: 'Crime & safety',
      color: 'bg-blue-500',
      icon: Shield
    },
    { 
      id: 'accident', 
      label: 'Accident', 
      description: 'Vehicle accidents',
      color: 'bg-yellow-500',
      icon: Car
    },
    { 
      id: 'natural', 
      label: 'Natural', 
      description: 'Natural disasters',
      color: 'bg-green-500',
      icon: AlertTriangle
    },
    { 
      id: 'other', 
      label: 'Other', 
      description: 'Other emergencies',
      color: 'bg-gray-500',
      icon: Plus
    },
  ];

  const priorityLevels = [
    { id: 'critical', label: 'Critical', color: 'bg-red-500', description: 'Life threatening' },
    { id: 'high', label: 'High', color: 'bg-orange-500', description: 'Urgent response needed' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-500', description: 'Prompt attention' },
    { id: 'low', label: 'Low', color: 'bg-green-500', description: 'Non-urgent' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.emergencyType || !formData.priority || !formData.location || !formData.description) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Emergency Report Submitted:', {
      ...formData,
      timestamp: new Date().toISOString(),
      reportId: 'EMR-' + Date.now()
    });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        emergencyType: '',
        priority: '',
        location: '',
        description: '',
        injuries: '',
        reporterName: '',
        reporterPhone: '',
        reporterEmail: '',
        additionalInfo: ''
      });
    }, 3000);
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
          <p className="text-sm text-gray-500">Report ID: EMR-{Date.now()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Report Emergency</h1>
          <p className="text-gray-600">Provide details about the emergency situation</p>
        </div>

        {/* Emergency Banner */}
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center">
          <p className="font-semibold">🚨 For immediate life-threatening emergencies, call 911 🚨</p>
        </div>

        <div className="space-y-8">
          {/* Emergency Type Selection */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Type of Emergency</h2>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Priority Level</h2>
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

          {/* Location */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <MapPin className="text-gray-600 mr-2" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Location</h2>
            </div>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Building, floor, room number, or address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <FileText className="text-gray-600 mr-2" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Description</h2>
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
                required
              />
              <input
                type="tel"
                name="reporterPhone"
                value={formData.reporterPhone}
                onChange={handleInputChange}
                placeholder="Phone number"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
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
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.emergencyType || !formData.priority || !formData.location || !formData.description}
              className={`px-8 py-4 rounded-lg font-semibold text-white transition-all ${
                isSubmitting || !formData.emergencyType || !formData.priority || !formData.location || !formData.description
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Report...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="mr-2" size={20} />
                  Submit Emergency Report
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportEmergencyPage;