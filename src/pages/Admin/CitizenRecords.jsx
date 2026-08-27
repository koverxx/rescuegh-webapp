import React, { useState, useEffect } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { db } from '../../firebase'; // Make sure this path is correct
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { 
  Search, Filter, User, Phone, Droplets, Activity, 
  MoreHorizontal, AlertCircle, Loader2, X, HeartPulse, Contact2, ShieldAlert
} from 'lucide-react';

const CitizenRecords = () => {
  const [citizens, setCitizens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Modal States
  const [selectedCitizen, setSelectedCitizen] = useState(null); // For View Dossier
  const [editingCitizen, setEditingCitizen] = useState(null);   // For Edit Record
  const [editForm, setEditForm] = useState({ phone: '', bloodType: '' });

  useEffect(() => {
    const usersQuery = collection(db, 'users');

    const safeArray = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (typeof data === 'string') return data.split(',').map(item => item.trim()).filter(Boolean);
      return [];
    };

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      try {
        const fetchedCitizens = snapshot.docs.map(doc => {
          const data = doc.data();
          
          let formattedDate = 'N/A';
          const dateField = data.createdAt || data.updatedAt;
          
          if (dateField) {
            if (typeof dateField.toDate === 'function') {
              formattedDate = dateField.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            } else if (typeof dateField === 'string') {
              formattedDate = new Date(dateField).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
          }

          return {
            id: doc.id,
            name: data.fullName || 'Anonymous Account',
            phone: data.phone || '',
            bloodType: data.bloodType || 'N/A',
            allergies: safeArray(data.allergies),
            conditions: safeArray(data.medicalConditions),
            emergencyContacts: data.emergencyContacts || [],
            registered: formattedDate,
            accountStatus: data.accountStatus || 'active' // Added for Suspend feature
          };
        });
        
        setCitizens(fetchedCitizens);
      } catch (err) {
        console.error("Error mapping users:", err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Admin Actions ---

  // 1. Toggle Suspend Status in Firebase
  const handleToggleSuspend = async (citizen) => {
    setOpenDropdown(null);
    const isSuspending = citizen.accountStatus !== 'suspended';
    const actionText = isSuspending ? 'suspend' : 'reactivate';
    
    if (window.confirm(`Are you sure you want to ${actionText} ${citizen.name}'s account?`)) {
      try {
        const userRef = doc(db, 'users', citizen.id);
        await updateDoc(userRef, { 
          accountStatus: isSuspending ? 'suspended' : 'active' 
        });
      } catch (error) {
        console.error("Error updating account status:", error);
        alert("Failed to update status. Check your database permissions.");
      }
    }
  };

  // 2. Open Edit Form
  const handleOpenEdit = (citizen) => {
    setOpenDropdown(null);
    setEditForm({ phone: citizen.phone, bloodType: citizen.bloodType });
    setEditingCitizen(citizen);
  };

  // 3. Save Edits to Firebase
  const handleSaveEdit = async () => {
    try {
      const userRef = doc(db, 'users', editingCitizen.id);
      await updateDoc(userRef, {
        phone: editForm.phone,
        bloodType: editForm.bloodType
      });
      setEditingCitizen(null); // Close modal on success
    } catch (error) {
      console.error("Error saving edits:", error);
      alert("Failed to save changes.");
    }
  };


  const filteredCitizens = citizens.filter(citizen => {
    return citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           citizen.phone.includes(searchTerm) ||
           citizen.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="flex-1 bg-[#f8fafc] p-8 pb-48 h-full overflow-y-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-slate-900">Citizen Records</h1>
              {!isLoading && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  {citizens.length} Live Profiles
                </span>
              )}
            </div>
            <p className="text-slate-500">Securely managing user accounts, automated contact parsing, and critical medical payloads.</p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Name, Phone, or ID..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Loading & Empty States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-3 text-slate-500">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-sm font-medium">Loading Firestore database...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-20 relative">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider font-semibold text-slate-500">
                  <th className="px-6 py-4">Citizen Profile</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Blood Type</th>
                  <th className="px-6 py-4">Medical Alerts</th>
                  <th className="px-6 py-4">Registered</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredCitizens.length > 0 ? (
                  filteredCitizens.map((citizen, index) => (
                    <tr key={citizen.id} className={`hover:bg-slate-50/50 transition-colors group ${citizen.accountStatus === 'suspended' ? 'opacity-60 bg-slate-50' : ''}`}>
                      
                      {/* Name & UID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${citizen.accountStatus === 'suspended' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {citizen.accountStatus === 'suspended' ? <ShieldAlert size={18} /> : <User size={18} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-900">{citizen.name}</p>
                              {citizen.accountStatus === 'suspended' && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Suspended</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-mono font-medium">{citizen.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <Phone size={14} className="text-slate-400" />
                          {citizen.phone || 'N/A'}
                        </div>
                      </td>

                      {/* Blood Type */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-md w-max">
                          <Droplets size={14} />
                          {citizen.bloodType}
                        </div>
                      </td>

                      {/* Medical Conditions & Allergies */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                          {citizen.conditions.map((condition, idx) => (
                            <span key={`cond-${idx}`} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                              <Activity size={10} /> {condition}
                            </span>
                          ))}
                          {citizen.allergies.map((allergy, idx) => (
                            <span key={`alg-${idx}`} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                              <AlertCircle size={10} /> {allergy}
                            </span>
                          ))}
                          {citizen.conditions.length === 0 && citizen.allergies.length === 0 && (
                            <span className="text-slate-400 italic text-xs">No entries reported</span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-500 font-medium">{citizen.registered}</td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === citizen.id ? null : citizen.id)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {/* Popup Dropdown Menu */}
                        {openDropdown === citizen.id && (
                          <div className="absolute right-10 top-10 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 text-left overflow-hidden">
                            <button 
                              onClick={() => { setSelectedCitizen(citizen); setOpenDropdown(null); }}
                              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center"
                            >
                              View Dossier
                            </button>
                            <button 
                              onClick={() => handleOpenEdit(citizen)}
                              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center"
                            >
                              Edit Record
                            </button>
                            <div className="h-px bg-slate-200 my-1"></div>
                            <button 
                              onClick={() => handleToggleSuspend(citizen)}
                              className={`w-full px-4 py-2 text-sm transition-colors flex items-center ${citizen.accountStatus === 'suspended' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-red-600 hover:bg-red-50'}`}
                            >
                              {citizen.accountStatus === 'suspended' ? 'Reactivate User' : 'Suspend User'}
                            </button>
                          </div>
                        )}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium">
                      No matching database profiles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- MODAL 1: VIEW DOSSIER --- */}
        {selectedCitizen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                    <User size={20} className="text-blue-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{selectedCitizen.name}</h2>
                    <p className="text-slate-400 text-xs font-mono">{selectedCitizen.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCitizen(null)} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Medical Card */}
                  <div className="col-span-2 md:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider"><HeartPulse size={16} className="text-rose-500" /> Medical Profile</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Blood Type</p>
                        <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-md"><Droplets size={14} /> {selectedCitizen.bloodType}</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Pre-existing Conditions</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedCitizen.conditions.length > 0 ? selectedCitizen.conditions.map((c, i) => (<span key={i} className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md">{c}</span>)) : <span className="text-xs text-slate-400 italic">None reported</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Known Allergies</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedCitizen.allergies.length > 0 ? selectedCitizen.allergies.map((a, i) => (<span key={i} className="text-xs font-semibold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-md">{a}</span>)) : <span className="text-xs text-slate-400 italic">None reported</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contacts Card */}
                  <div className="col-span-2 md:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider"><Contact2 size={16} className="text-blue-500" /> Emergency Contacts</h3>
                    <div className="space-y-3">
                      {selectedCitizen.emergencyContacts.length > 0 ? selectedCitizen.emergencyContacts.map((contact, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                          <p className="font-semibold text-slate-800 text-sm">{contact.name}</p>
                          <p className="text-xs text-blue-600 font-medium mb-1 capitalize">{contact.relation}</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600"><Phone size={12} className="text-slate-400" /> {contact.phone}</div>
                        </div>
                      )) : <div className="bg-white p-4 rounded-lg border border-slate-200 border-dashed text-center"><p className="text-xs text-slate-400 italic">No emergency contacts registered.</p></div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL 2: EDIT RECORD --- */}
        {editingCitizen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Edit Record: {editingCitizen.name}</h2>
                <button onClick={() => setEditingCitizen(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={editForm.phone} 
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 0554260540"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Blood Type</label>
                  <select 
                    value={editForm.bloodType} 
                    onChange={(e) => setEditForm({...editForm, bloodType: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="N/A">Select Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                <button onClick={() => setEditingCitizen(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default CitizenRecords;