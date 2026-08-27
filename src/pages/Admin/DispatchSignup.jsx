import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase'; // Adjust your Firebase import path
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2, AlertCircle, ShieldPlus, CheckCircle2 } from 'lucide-react';

const DispatchSignup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    badgeNumber: '',
    role: 'dispatcher' // Defaults to dispatcher
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Save their specific role and details to the Firestore 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        badgeNumber: formData.badgeNumber,
        role: formData.role, // 'dispatcher' or 'admin'
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
      });

      // 3. Show success and redirect to the operator login
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin-login');
      }, 2000);

    } catch (err) {
      console.error('Signup Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Area */}
        <div className="bg-slate-900 px-8 py-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center transform rotate-45 mb-4 shadow-lg shadow-rose-500/30">
            <div className="transform -rotate-45 text-white font-black text-xl">!</div>
          </div>
          <h1 className="text-xl font-black text-white tracking-wider mb-1">RESCUEGH</h1>
          <p className="text-rose-500 font-bold text-[10px] tracking-[0.2em] uppercase">Operator Registration</p>
        </div>

        {/* Form Area */}
        <div className="p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ShieldPlus size={20} className="text-blue-600" /> Register New Dispatcher
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-800 font-medium">Account provisioned successfully! Redirecting to login...</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Badge ID</label>
                <input
                  type="text"
                  required
                  value={formData.badgeNumber}
                  onChange={(e) => setFormData({...formData, badgeNumber: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  placeholder="OP-001"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">System Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors cursor-pointer appearance-none"
                >
                  <option value="dispatcher">Dispatcher</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Operator Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                placeholder="dispatch@rescuegh.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Temporary Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Provisioning Account...
                </>
              ) : (
                'Create Dispatch Account'
              )}
            </button>
          </form>

          {/* Link back to login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an operator account?{' '}
              <Link to="/admin-login" className="text-blue-600 font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DispatchSignup;