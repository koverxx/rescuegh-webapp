import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase'; // Adjust your Firebase import path
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, AlertCircle, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch the user's profile from Firestore to check their role
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // 3. Role verification check
        if (userData.role === 'admin' || userData.role === 'dispatcher') {
          // Access Granted -> Send to Dashboard
          navigate('/dashboard/');
        } else {
          // Access Denied (Citizen or unknown role)
          await signOut(auth); // Log them immediately back out
          setError('Access Denied: This portal is strictly for authorized dispatch personnel.');
        }
      } else {
        await signOut(auth);
        setError('User record not found in the system database.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      // Clean up Firebase error messages for the UI
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError('An error occurred during authentication. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Area */}
        <div className="bg-slate-900 px-8 py-10 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-rose-600 rounded-xl flex items-center justify-center transform rotate-45 mb-6 shadow-lg shadow-rose-500/30">
            <div className="transform -rotate-45 text-white font-black text-2xl">!</div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider mb-1">RESCUEGH</h1>
          <p className="text-rose-500 font-bold text-xs tracking-[0.2em] uppercase">Dispatch Center</p>
        </div>

        {/* Form Area */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Lock size={20} className="text-slate-400" /> Secure Operator Login
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Operator Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                placeholder="dispatch@rescuegh.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Authenticating...
                </>
              ) : (
                'Access Dispatch Portal'
              )}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default Login;