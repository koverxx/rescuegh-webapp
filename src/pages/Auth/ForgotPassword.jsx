import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Shield, Clock } from 'lucide-react';
import MainLayout from '../../Layouts/MainLayout';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - show confirmation
      setEmailSent(true);
      startResendCooldown();
      
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      startResendCooldown();
    } catch (error) {
      setError('Failed to resend email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    // Navigate back to login
    console.log('Navigate to login');
  };

  if (emailSent) {
    return (
      <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            
            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                What to do next:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check your email inbox (and spam folder)</li>
                <li>• Click the reset link in the email</li>
                <li>• Create a new secure password</li>
                <li>• Sign in with your new password</li>
              </ul>
            </div>
            
            {/* Resend Email */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Didn't receive the email?</p>
              <button
                onClick={handleResendEmail}
                disabled={resendCooldown > 0 || isSubmitting}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  resendCooldown > 0 || isSubmitting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-[1.02]'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : resendCooldown > 0 ? (
                  <div className="flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Resend in {resendCooldown}s
                  </div>
                ) : (
                  'Resend Email'
                )}
              </button>
            </div>
            
            {/* Back to Login */}
            <button
              onClick={handleBackToLogin}
              className="w-full py-2 px-4 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">No worries, we'll send you reset instructions</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    error ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
                {error && (
                  <div className="absolute -bottom-5 left-0 text-red-500 text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Reset Link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>

            {/* Security Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800 mb-1">Security Note</h4>
                  <p className="text-xs text-amber-700">
                    For your security, the reset link will expire in 15 minutes. 
                    If you don't see the email, check your spam folder.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToLogin}
              className="text-gray-600 hover:text-gray-800 font-medium hover:underline flex items-center justify-center w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Still having trouble?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default ForgotPasswordPage;