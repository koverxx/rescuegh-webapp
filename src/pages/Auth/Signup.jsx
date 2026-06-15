import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, Lock, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import logo from '../../assets/rescueGH-Logo.png';
import MainLayout from '../../Layouts/MainLayout';

// Firebase imports
import { auth, db } from '../../firebase'; 
import { createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SignUpPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setGlobalError('');
  };

  // Google Authentication Logic
  const handleGoogleSignup = async () => {
    setIsSubmitting(true);
    setGlobalError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const nameParts = user.displayName ? user.displayName.split(' ') : ['Citizen', ''];
        await setDoc(userDocRef, {
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          role: 'citizen',
          createdAt: new Date().toISOString()
        });
      }
      navigate('/home');
    } catch (error) {
      console.error("Google Auth Error:", error);
      setGlobalError('Failed to authenticate with Google. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setGlobalError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: 'citizen',
        createdAt: new Date().toISOString()
      });

      await signOut(auth);
      setShowSuccessModal(true);
      setTimeout(() => navigate('/login'), 3000);

    } catch (error) {
      console.error("Signup Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setGlobalError('This email is already registered. Please log in.');
      } else {
        setGlobalError('Failed to create account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
    <div className="relative min-h-screen flex items-center justify-center p-4 py-12">
      
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center transform animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard!</h3>
            <p className="text-gray-600 mb-8 font-medium">Your account has been created successfully. Redirecting you to sign in...</p>
            <div className="flex items-center space-x-2 text-blue-600 font-bold">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Routing...</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full relative z-10">
        <div className="flex justify-center mb-6">
         <img src={logo} alt="RescueGH Logo" className="h-40 md:h-60 w-auto drop-shadow-sm" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-md">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and start your journey today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isSubmitting}
            className="w-full mb-6 flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm rounded-xl bg-white hover:bg-gray-50 font-bold text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-medium">Or sign up with email</span>
            </div>
          </div>

          {globalError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
              {globalError}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6" noValidate>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.firstName && <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-bold flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{errors.firstName}</div>}
                </div>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.lastName && <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-bold flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{errors.lastName}</div>}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="w-5 h-5 text-gray-400" /></div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.email && <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-bold flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{errors.email}</div>}
              </div>
            </div>

            <div className="pt-2">
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="w-5 h-5 text-gray-400" /></div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.phone && <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-bold flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{errors.phone}</div>}
              </div>
            </div>

            <div className="pt-2">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="w-5 h-5 text-gray-400" /></div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" /> : <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />}
                </button>
                {errors.password && <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-bold flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{errors.password}</div>}
              </div>
            </div>

            <div className="pt-2">
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="w-5 h-5 text-gray-400" /></div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" /> : <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />}
                </button>
                {errors.confirmPassword && <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-bold flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{errors.confirmPassword}</div>}
              </div>
            </div>

            <div className="relative pt-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    name="termsAccepted"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="text-gray-700 cursor-pointer">
                    I agree to the <a href="#" className="text-blue-600 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-bold hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>
              {errors.termsAccepted && <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-bold flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{errors.termsAccepted}</div>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-4 rounded-xl font-bold text-white transition-all shadow-md ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1'}`}
              >
                {isSubmitting ? 'Securing Account...' : 'Create Account'}
              </button>
            </div>
          </form> 
          
          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-gray-600 font-medium">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-800 font-bold hover:underline ml-1">
                Sign in securely
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default SignUpPage;