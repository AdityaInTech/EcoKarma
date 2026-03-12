import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronDown, 
  MapPin, AlertTriangle, Camera, Send, Plus, X, Target, Clock, User, CheckCircle2, Loader2, Phone, Menu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';

const CommunitySOS = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const location = useLocation();

  const [activeMissions, setActiveMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState(null);

  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [formData, setFormData] = useState({
    reporterName: currentUser ? currentUser.name : '',
    phoneNo: '',
    title: '',
    description: '',
    locationName: '',
    evidenceImage: null, 
    urgency: 'medium'
  });

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/missions');
      setActiveMissions(response.data);
    } catch (error) {
      console.error("Failed to fetch missions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.evidenceImage) {
      alert("Please upload a site photo before submitting.");
      return;
    }

    if (!currentUser) {
      alert("You must be logged in to submit a mission.");
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('reporterId', currentUser.id);
    formDataToSend.append('reporterName', formData.reporterName); 
    formDataToSend.append('phoneNo', formData.phoneNo);           
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('locationName', formData.locationName);
    formDataToSend.append('lat', 0); 
    formDataToSend.append('lng', 0);
    formDataToSend.append('urgency', formData.urgency);
    formDataToSend.append('bountyPoints', 100);
    formDataToSend.append('evidenceImage', formData.evidenceImage); 
    
    try {
      const response = await fetch('http://localhost:5000/api/missions/create', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Backend rejected the upload.');
      }
      
      alert("Mission posted! It is now live on the Community Feed.");
      setIsFormOpen(false);
      
      setFormData({ 
        reporterName: currentUser ? currentUser.name : '',
        phoneNo: '',
        title: '', 
        description: '', 
        locationName: '', 
        evidenceImage: null, 
        urgency: 'medium' 
      }); 
      
      fetchMissions(); 
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Failed to submit mission. Check your backend terminal!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptMission = async (missionId) => {
    try {
      const payload = { userId: currentUser.id }; 
      await api.put(`/missions/${missionId}/claim`, payload);
      alert("Mission Accepted! It has been added to your profile.");
      fetchMissions(); 
    } catch (error) {
      console.error("Claim Error:", error);
      alert("Failed to claim mission.");
    }
  };

  const getInitial = (nameString) => {
    if (!nameString) return 'U';
    return nameString.charAt(0).toUpperCase();
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      
      {/* --- TOP NAVBAR --- */}
<nav className="h-16 bg-white border-b border-slate-100 shrink-0 px-6 lg:px-10 flex items-center justify-between shadow-sm z-50 relative">
  <Link to="/" className="text-2xl font-black tracking-tighter italic text-[#ff4500]">EcoKarma.</Link>
  
  {/* --- DESKTOP VIEW (Hidden on Mobile) --- */}
  <div className="hidden lg:flex items-center gap-12">
    <div className="flex items-center gap-10 font-dashboard-caps">
      <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
      <Link to="/action-hub" className="hover:text-slate-900 transition-colors">ActionHub</Link>
      <Link to="/sos" className="hover:text-slate-900 transition-colors">Community SOS</Link>
      <Link to="/perks" className="hover:text-slate-900 transition-colors">Perks</Link>
      <Link to="/about" className="hover:text-slate-900 transition-colors">About Us</Link>
    </div>
    <div className="flex items-center gap-6 border-l border-slate-100 pl-8">
      {/* Moved Sign Out Button Here */}
      <button 
        onClick={handleSignOut}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
      >
        <LogOut size={16} /> <span className="hidden sm:block">Sign Out</span>
      </button>

      {/* Dynamic Initial Avatar in Navbar */}
      <div className="w-10 h-10 bg-[#ff4500] text-white rounded-xl flex items-center justify-center font-black text-lg shadow-sm border-2 border-slate-900">
        {getInitial(userData?.name || currentUser?.name)}
      </div>
    </div>
  </div>

  {/* --- MOBILE VIEW (Hidden on Desktop) --- */}
  <div className="flex lg:hidden items-center gap-4">
    <button onClick={handleSignOut} className="text-slate-400 hover:text-red-500 transition-colors">
      <LogOut size={20} />
    </button>
    <div className="w-8 h-8 bg-[#ff4500] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm border-2 border-slate-900">
      {getInitial(userData?.name || currentUser?.name)}
    </div>
    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-900 p-1 ml-2">
      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  </div>

  {/* --- MOBILE DROPDOWN MENU --- */}
  <div className={`absolute top-16 left-0 w-full bg-white border-b border-slate-100 shadow-xl flex flex-col p-6 gap-6 z-50 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-dashboard-caps text-slate-900 text-lg hover:text-[#ff4500]">Home</Link>
    <Link to="/action-hub" onClick={() => setIsMobileMenuOpen(false)} className="font-dashboard-caps text-slate-900 text-lg hover:text-[#ff4500]">ActionHub</Link>
    <Link to="/sos" onClick={() => setIsMobileMenuOpen(false)} className="font-dashboard-caps text-slate-900 text-lg hover:text-[#ff4500]">Community SOS</Link>
    <Link to="/perks" onClick={() => setIsMobileMenuOpen(false)} className="font-dashboard-caps text-slate-900 text-lg hover:text-[#ff4500]">Perks</Link>
    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="font-dashboard-caps text-slate-900 text-lg hover:text-[#ff4500]">About Us</Link>
  </div>
</nav>

      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8 lg:p-12 h-full relative">
          <div className="max-w-5xl mx-auto pb-20">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">Community <span className="text-[#ff4500]">SOS</span></h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Select problem. Accept a mission. Earn Karma PTS.</p>
              </div>
              
              <button 
                onClick={() => setIsFormOpen(!isFormOpen)} 
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${
                  isFormOpen 
                  ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' 
                  : 'bg-[#ff4500] text-white shadow-md hover:bg-orange-600 hover:shadow-xl hover:shadow-[#ff4500]/20'
                }`}
              >
                {isFormOpen ? <X size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                {isFormOpen ? 'Cancel Report' : 'Post a Problem'}
              </button>
            </div>

            <div className={`transition-all duration-500 overflow-hidden ${isFormOpen ? 'max-h-[2000px] opacity-100 mb-12' : 'max-h-0 opacity-0'}`}>
              <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
                
                <div className="absolute top-0 right-0 bg-slate-100 px-6 py-2 rounded-bl-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                   Reporting securely as <span className="text-[#ff4500]">{currentUser?.name || "User"}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10 mt-4">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <AlertTriangle size={20} className="text-[#ff4500]" />
                      <h2 className="font-dashboard-caps text-slate-900 text-sm">Mission Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-3 md:col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reporter</label>
                        <div className="relative">
                          <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input type="text" value={formData.reporterName} placeholder="Your Name" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-semibold text-slate-700 focus:border-[#ff4500] outline-none" onChange={(e) => setFormData({...formData, reporterName: e.target.value})} required />
                        </div>
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mission Title</label>
                        <input type="text" value={formData.title} placeholder="e.g. Heavy Plastic Buildup" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-700 focus:border-[#ff4500] outline-none" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Threat Level</label>
                        <div className="relative">
                          <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-700 focus:border-[#ff4500] outline-none cursor-pointer appearance-none" value={formData.urgency} onChange={(e) => setFormData({...formData, urgency: e.target.value})} required>
                            <option value="low">Low - General Litter</option>
                            <option value="medium">Medium - Ecosystem Risk</option>
                            <option value="high">High - Critical Hazard</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Condition Report</label>
                        <input type="text" value={formData.description} placeholder="Briefly describe the mess..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-700 focus:border-[#ff4500] outline-none" onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Area / Landmark</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ff4500] pointer-events-none" />
                          <input type="text" value={formData.locationName} placeholder="Enter exact location or landmark" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:border-[#ff4500] outline-none" onChange={(e) => setFormData({...formData, locationName: e.target.value})} required />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Number</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ff4500] pointer-events-none" />
                          <input type="tel" value={formData.phoneNo} placeholder="e.g. 9876543210" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:border-[#ff4500] outline-none" onChange={(e) => setFormData({...formData, phoneNo: e.target.value})} required />
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8 pt-6 border-t border-slate-100">
                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors w-full md:w-1/2 cursor-pointer group flex flex-col items-center justify-center text-center overflow-hidden">
                      <Camera size={24} className="text-slate-300 group-hover:text-[#ff4500] mb-2 transition-colors relative z-10" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 relative z-10">
                        {formData.evidenceImage ? formData.evidenceImage.name : 'Upload Site Photo (Required)'}
                      </span>
                      <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onChange={(e) => setFormData({...formData, evidenceImage: e.target.files[0]})} />
                    </div>

                    <button disabled={isSubmitting} type="submit" className={`w-full md:w-1/2 text-white px-10 py-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-[#ff4500] active:scale-95'}`}>
                      {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting</> : <><Send size={16} /> Submit Problem</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center py-24 gap-4">
                <Loader2 size={40} className="animate-spin text-[#ff4500]" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading SOS Feed...</p>
              </div>
            ) : activeMissions.length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">No active missions right now! The city is clean.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {activeMissions.map((mission) => (
                  <div key={mission._id} className="bg-white border border-slate-100 rounded-[32px] overflow-hidden hover:shadow-xl hover:shadow-slate-200 transition-all flex flex-col group">
                    
                    <div 
                      className="h-64 sm:h-72 bg-slate-900 relative flex items-center justify-center overflow-hidden cursor-pointer group/img"
                      onClick={() => setSelectedImage(mission.evidenceImage && mission.evidenceImage !== "dummy_sos_image.jpg" ? mission.evidenceImage : null)}
                    >
                      {mission.evidenceImage && mission.evidenceImage !== "dummy_sos_image.jpg" ? (
                        <img 
                          src={mission.evidenceImage} 
                          alt={mission.title} 
                          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-500" 
                        />
                      ) : (
                        <div className="absolute inset-0 w-full h-full bg-slate-800 flex items-center justify-center opacity-80">
                           <span className="text-white/30 text-[10px] font-black uppercase tracking-widest flex flex-col items-center gap-2">
                             <AlertTriangle size={24} /> Image Pending
                           </span>
                        </div>
                      )}

                      <div className="absolute top-4 left-4 flex gap-2 z-10">
                        <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm backdrop-blur-md ${mission.urgency === 'high' ? 'bg-red-500/90 text-white border-red-400' : mission.urgency === 'medium' ? 'bg-orange-500/90 text-white border-orange-400' : 'bg-emerald-500/90 text-white border-emerald-400'}`}>
                          {mission.urgency} Priority
                        </span>
                      </div>
                      
                      {mission.evidenceImage && mission.evidenceImage !== "dummy_sos_image.jpg" && (
                        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                          <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                            Click to expand
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ✅ UPGRADED: Tighter padding, smaller text, and removed the "Open" badge! */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex flex-col gap-1.5 mb-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          <MapPin size={12} className="text-[#ff4500]" /> {mission.locationName}
                        </div>
                        
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Posted: {mission.createdAt 
                            ? `${new Date(mission.createdAt).toLocaleDateString()} • ${new Date(mission.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
                            : 'Just now'}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{mission.title}</h3>
                      <p className="text-slate-500 text-xs mb-5 flex-1 line-clamp-3">{mission.description}</p>

                      <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl mb-5 border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-[#ff4500] text-white rounded-md flex items-center justify-center font-bold text-[10px] shadow-sm">
                            {getInitial(mission.reporterName || "C")}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Reported By</span>
                            <span className="text-[11px] font-bold text-slate-900">{mission.reporterName || "Community Member"}</span>
                          </div>
                        </div>
                        
                        {mission.phoneNo && (
                          <a href={`tel:${mission.phoneNo}`} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#ff4500] bg-orange-50 px-2.5 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">
                            <Phone size={10} /> {mission.phoneNo}
                          </a>
                        )}
                      </div>

                      <div className="flex items-center justify-end pt-4 border-t border-slate-100 mt-auto">
                        {mission.status === 'open' ? (
                          <button onClick={() => handleAcceptMission(mission._id)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#ff4500] transition-colors flex items-center gap-2">
                            Accept Mission <Target size={12} />
                          </button>
                        ) : (
                          <span className="bg-slate-100 text-slate-400 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 cursor-not-allowed">
                            In Progress <Clock size={12} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </main>
      </div>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 p-4 sm:p-8 backdrop-blur-sm transition-all" 
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-[#ff4500] text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
            onClick={(e) => {
              e.stopPropagation(); 
              setSelectedImage(null);
            }}
          >
            <X size={24} />
          </button>
          <img 
            src={selectedImage} 
            alt="Enlarged Evidence" 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

    </div>
  );
};

export default CommunitySOS;













// import React, { useState, useEffect } from 'react';
// import { 
//   ChevronLeft, ChevronRight, ChevronDown, 
//   MapPin, AlertTriangle, Camera, Send, Plus, X, Target, Clock, User, CheckCircle2, Loader2, Phone
// } from 'lucide-react';
// import { Link, useLocation } from 'react-router-dom';
// import api from '../api/axios';

// const CommunitySOS = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const location = useLocation();

//   const [activeMissions, setActiveMissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const storedUser = localStorage.getItem('user');
//   const currentUser = storedUser ? JSON.parse(storedUser) : null;

//   const [formData, setFormData] = useState({
//     reporterName: currentUser ? currentUser.name : '',
//     phoneNo: '',
//     title: '',
//     description: '',
//     locationName: '',
//     evidenceImage: null, 
//     urgency: 'medium'
//   });

//   useEffect(() => {
//     fetchMissions();
//   }, []);

//   const fetchMissions = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/missions');
//       setActiveMissions(response.data);
//     } catch (error) {
//       console.error("Failed to fetch missions:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.evidenceImage) {
//       alert("Please upload a site photo before submitting.");
//       return;
//     }

//     if (!currentUser) {
//       alert("You must be logged in to submit a mission.");
//       return;
//     }

//     setIsSubmitting(true);

//     const formDataToSend = new FormData();
//     formDataToSend.append('reporterId', currentUser.id);
//     formDataToSend.append('reporterName', formData.reporterName); 
//     formDataToSend.append('phoneNo', formData.phoneNo);           
//     formDataToSend.append('title', formData.title);
//     formDataToSend.append('description', formData.description);
//     formDataToSend.append('locationName', formData.locationName);
//     formDataToSend.append('lat', 0); 
//     formDataToSend.append('lng', 0);
//     formDataToSend.append('urgency', formData.urgency);
//     formDataToSend.append('bountyPoints', 100);
//     formDataToSend.append('evidenceImage', formData.evidenceImage); 
    
//     try {
//       // 🚀 ULTIMATE FIX: Bypass Axios entirely and use native fetch!
//       // This stops Axios from secretly deleting your image file.
//       const response = await fetch('http://localhost:5000/api/missions/create', {
//         method: 'POST',
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         throw new Error('Backend rejected the upload.');
//       }
      
//       alert("Mission posted! It is now live on the Community Feed.");
//       setIsFormOpen(false);
      
//       setFormData({ 
//         reporterName: currentUser ? currentUser.name : '',
//         phoneNo: '',
//         title: '', 
//         description: '', 
//         locationName: '', 
//         evidenceImage: null, 
//         urgency: 'medium' 
//       }); 
      
//       fetchMissions(); 
//     } catch (error) {
//       console.error("Submit Error:", error);
//       alert("Failed to submit mission. Check your backend terminal!");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAcceptMission = async (missionId) => {
//     try {
//       const payload = { userId: currentUser.id }; 
//       await api.put(`/missions/${missionId}/claim`, payload);
//       alert("Mission Accepted! It has been added to your profile.");
//       fetchMissions(); 
//     } catch (error) {
//       console.error("Claim Error:", error);
//       alert("Failed to claim mission.");
//     }
//   };

//   const getInitial = (nameString) => {
//     if (!nameString) return 'U';
//     return nameString.charAt(0).toUpperCase();
//   };

//   return (
//     <div className="h-screen flex flex-col bg-white overflow-hidden">
      
//       <nav className="h-16 bg-white border-b border-slate-100 shrink-0 px-10 flex items-center justify-between shadow-sm z-50">
//         <Link to="/" className="text-2xl font-black tracking-tighter italic text-[#ff4500]">EcoKarma.</Link>
//         <div className="flex items-center gap-12">
//           <div className="hidden lg:flex items-center gap-10 font-dashboard-caps">
//             <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
//             <Link to="/action-hub" className="hover:text-slate-900 transition-colors">ActionHub</Link>
//             <Link to="/sos" className="text-[#ff4500] border-b-2 border-[#ff4500] pb-1">Community SOS</Link>
//             <Link to="/perks" className="hover:text-slate-900 transition-colors">Perks</Link>
//           </div>
//           <div className="flex items-center gap-4 border-l border-slate-100 pl-8">
//             <Link to="/profile" className="w-9 h-9 bg-[#ff4500] text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm hover:brightness-110 transition-all cursor-pointer">
//               {getInitial(currentUser?.name)}
//             </Link>
//           </div>
//         </div>
//       </nav>

//       <div className="flex flex-1 overflow-hidden relative">
//         <main className="flex-1 overflow-y-auto bg-slate-50 p-8 lg:p-12 h-full relative">
//           <div className="max-w-5xl mx-auto pb-20">
            
//             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
//               <div>
//                 <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">Community <span className="text-[#ff4500]">SOS</span></h1>
//                 <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Find a problem. Accept a mission. Earn Karma.</p>
//               </div>
              
//               <button 
//                 onClick={() => setIsFormOpen(!isFormOpen)} 
//                 className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${
//                   isFormOpen 
//                   ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' 
//                   : 'bg-[#ff4500] text-white shadow-md hover:bg-orange-600 hover:shadow-xl hover:shadow-[#ff4500]/20'
//                 }`}
//               >
//                 {isFormOpen ? <X size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
//                 {isFormOpen ? 'Cancel Report' : 'Post a Problem'}
//               </button>
//             </div>

//             <div className={`transition-all duration-500 overflow-hidden ${isFormOpen ? 'max-h-[2000px] opacity-100 mb-12' : 'max-h-0 opacity-0'}`}>
//               <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
                
//                 <div className="absolute top-0 right-0 bg-slate-100 px-6 py-2 rounded-bl-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
//                    Reporting securely as <span className="text-[#ff4500]">{currentUser?.name || "User"}</span>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-10 mt-4">
//                   <div className="space-y-6">
//                     <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
//                       <AlertTriangle size={20} className="text-[#ff4500]" />
//                       <h2 className="font-dashboard-caps text-slate-900 text-sm">Mission Details</h2>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                       <div className="space-y-3 md:col-span-1">
//                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reporter</label>
//                         <div className="relative">
//                           <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                           <input type="text" value={formData.reporterName} placeholder="Your Name" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-semibold text-slate-700 focus:border-[#ff4500] outline-none" onChange={(e) => setFormData({...formData, reporterName: e.target.value})} required />
//                         </div>
//                       </div>
//                       <div className="space-y-3 md:col-span-2">
//                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mission Title</label>
//                         <input type="text" value={formData.title} placeholder="e.g. Heavy Plastic Buildup" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-700 focus:border-[#ff4500] outline-none" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                       <div className="space-y-3">
//                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Threat Level</label>
//                         <div className="relative">
//                           <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-700 focus:border-[#ff4500] outline-none cursor-pointer appearance-none" value={formData.urgency} onChange={(e) => setFormData({...formData, urgency: e.target.value})} required>
//                             <option value="low">Low - General Litter</option>
//                             <option value="medium">Medium - Ecosystem Risk</option>
//                             <option value="high">High - Critical Hazard</option>
//                           </select>
//                           <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                         </div>
//                       </div>
//                       <div className="space-y-3">
//                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Condition Report</label>
//                         <input type="text" value={formData.description} placeholder="Briefly describe the mess..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-700 focus:border-[#ff4500] outline-none" onChange={(e) => setFormData({...formData, description: e.target.value})} required />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-6 pt-6 border-t border-slate-100">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                      
//                       <div className="space-y-3">
//                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Area / Landmark</label>
//                         <div className="relative">
//                           <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ff4500] pointer-events-none" />
//                           <input type="text" value={formData.locationName} placeholder="Enter exact location or landmark" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:border-[#ff4500] outline-none" onChange={(e) => setFormData({...formData, locationName: e.target.value})} required />
//                         </div>
//                       </div>

//                       <div className="space-y-3">
//                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Number</label>
//                         <div className="relative">
//                           <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ff4500] pointer-events-none" />
//                           <input type="tel" value={formData.phoneNo} placeholder="e.g. 9876543210" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:border-[#ff4500] outline-none" onChange={(e) => setFormData({...formData, phoneNo: e.target.value})} required />
//                         </div>
//                       </div>

//                     </div>
//                   </div>

//                   <div className="flex flex-col md:flex-row items-center gap-8 pt-6 border-t border-slate-100">
//                     <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors w-full md:w-1/2 cursor-pointer group flex flex-col items-center justify-center text-center overflow-hidden">
//                       <Camera size={24} className="text-slate-300 group-hover:text-[#ff4500] mb-2 transition-colors relative z-10" />
//                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 relative z-10">
//                         {formData.evidenceImage ? formData.evidenceImage.name : 'Upload Site Photo (Required)'}
//                       </span>
//                       <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onChange={(e) => setFormData({...formData, evidenceImage: e.target.files[0]})} />
//                     </div>

//                     <button disabled={isSubmitting} type="submit" className={`w-full md:w-1/2 text-white px-10 py-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-[#ff4500] active:scale-95'}`}>
//                       {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting</> : <><Send size={16} /> Submit Problem</>}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>

//             {loading ? (
//               <div className="flex flex-col justify-center items-center py-24 gap-4">
//                 <Loader2 size={40} className="animate-spin text-[#ff4500]" />
//                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading SOS Feed...</p>
//               </div>
//             ) : activeMissions.length === 0 ? (
//               <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">No active missions right now! The city is clean.</div>
//             ) : (
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {activeMissions.map((mission) => (
//                   <div key={mission._id} className="bg-white border border-slate-100 rounded-[32px] overflow-hidden hover:shadow-xl hover:shadow-slate-200 transition-all flex flex-col group">
//                     <div className={`h-48 bg-slate-800 relative flex items-center justify-center overflow-hidden`}>
                      
//                       {mission.evidenceImage && mission.evidenceImage !== "dummy_sos_image.jpg" ? (
//                         <img src={mission.evidenceImage} alt={mission.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
//                       ) : (
//                         <div className="absolute inset-0 w-full h-full bg-slate-800 flex items-center justify-center opacity-80">
//                            <span className="text-white/30 text-[10px] font-black uppercase tracking-widest flex flex-col items-center gap-2">
//                              <AlertTriangle size={24} /> Image Pending
//                            </span>
//                         </div>
//                       )}

//                       <div className="absolute top-4 left-4 flex gap-2 z-10">
//                         <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm backdrop-blur-md ${mission.urgency === 'high' ? 'bg-red-500/90 text-white border-red-400' : mission.urgency === 'medium' ? 'bg-orange-500/90 text-white border-orange-400' : 'bg-emerald-500/90 text-white border-emerald-400'}`}>
//                           {mission.urgency} Priority
//                         </span>
//                       </div>
//                     </div>

//                     <div className="p-8 flex-1 flex flex-col">
//                       <div className="flex flex-col gap-2 mb-4">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
//                             <MapPin size={12} className="text-[#ff4500]" /> {mission.locationName}
//                           </div>
//                           <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-1 rounded">
//                             <Clock size={10} /> {mission.status}
//                           </span>
//                         </div>
                        
//                         <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//                           Posted: {mission.createdAt 
//                             ? `${new Date(mission.createdAt).toLocaleDateString()} • ${new Date(mission.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
//                             : 'Just now'}
//                         </div>
//                       </div>

//                       <h3 className="text-xl font-bold text-slate-900 mb-2">{mission.title}</h3>
//                       <p className="text-slate-500 text-sm mb-6 flex-1">{mission.description}</p>

//                       <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl mb-6 border border-slate-100">
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 bg-[#ff4500] text-white rounded-md flex items-center justify-center font-bold text-xs shadow-sm">
//                             {getInitial(mission.reporterName || "C")}
//                           </div>
//                           <div className="flex flex-col">
//                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Reported By</span>
//                             <span className="text-xs font-bold text-slate-900">{mission.reporterName || "Community Member"}</span>
//                           </div>
//                         </div>
                        
//                         {mission.phoneNo && (
//                           <a href={`tel:${mission.phoneNo}`} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#ff4500] bg-orange-50 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors">
//                             <Phone size={12} /> {mission.phoneNo}
//                           </a>
//                         )}
//                       </div>

//                       <div className="flex items-center justify-end pt-6 border-t border-slate-100 mt-auto">
//                         {mission.status === 'open' ? (
//                           <button onClick={() => handleAcceptMission(mission._id)} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ff4500] transition-colors flex items-center gap-2">
//                             Accept Mission <Target size={14} />
//                           </button>
//                         ) : (
//                           <span className="bg-slate-100 text-slate-400 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 cursor-not-allowed">
//                             In Progress <Clock size={14} />
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
            
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default CommunitySOS;
