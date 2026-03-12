
import React, { useState } from 'react';
import { 
  TrendingUp, ChevronLeft, ChevronRight, 
  Video, Image as ImageIcon, Send, MapPin, ShieldCheck, FileText, AlertCircle, User, Phone, Loader2, Menu
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ActionHub = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Grab the real logged-in EcoKarma user from memory
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [formData, setFormData] = useState({
    name: '',
    phoneNo: '',
    workDetail: '', 
    location: '',
    workDescription: '', 
    videoProof: null,
    imageProof1: null,
    imageProof2: null,
    isPublic: true 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Security Check
    if (!currentUser) {
      alert("You must be logged in to submit an EcoKarma report!");
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Use the REAL User ID!
      formDataToSend.append('authorId', currentUser.id); 
      
      // We leave the Organization ID as a dummy for now until we build the Org Dashboard
      formDataToSend.append('assignedOrgId', "650c1f1e1c9d440000a1b1c2"); 
      
      formDataToSend.append('workDetail', formData.workDetail);
      formDataToSend.append('workDescription', formData.workDescription); 
      formDataToSend.append('location', formData.location);
      formDataToSend.append('isPublic', formData.isPublic);

      if (formData.videoProof) formDataToSend.append('videoProof', formData.videoProof);
      if (formData.imageProof1) formDataToSend.append('imageProof1', formData.imageProof1);
      if (formData.imageProof2) formDataToSend.append('imageProof2', formData.imageProof2);

      const response = await api.post('/posts/create', formDataToSend);

      if (response.status === 201) {
        alert("EcoKarma recorded! Your work is now pending approval.");
        navigate('/'); 
      }
    } catch (error) {
      // ✅ THE TRAP IS SET: This will catch the exact error message from the backend!
      const backendReason = error.response?.data?.error || error.message || "Unknown Error";
      console.error("🚨 BACKEND SHOUTED:", backendReason);
      alert(`Backend crashed! Exact Reason: ${backendReason}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
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

      <div className="flex flex-1 overflow-hidden">
        
        {/* 3. MAIN FORM AREA */}
        <main className="flex-1 overflow-y-auto bg-white p-12">
          <div className="max-w-4xl mx-auto">
            
            <header className="mb-12 border-l-4 border-[#ff4500] pl-6">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">
                Karma <span className="text-[#ff4500]">Submission</span>
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">
                Share work evidence for Organization approval
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* === SECTION 1: USER INFO === */}
              <section className="space-y-8">
                <div className="flex items-center gap-2 mb-2">
                  <User size={18} className="text-[#ff4500]" />
                  <h3 className="font-dashboard-caps text-slate-900">User Info</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Enter your full name" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-semibold text-slate-700 focus:border-[#ff4500] outline-none" 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone No.</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="tel" 
                        placeholder="Enter your contact number" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-semibold text-slate-700 focus:border-[#ff4500] outline-none" 
                        onChange={(e) => setFormData({...formData, phoneNo: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* === SECTION 2: WORK INFO === */}
              <section className="space-y-8">
                <div className="flex items-center gap-2 mb-2 border-t border-slate-100 pt-8">
                  <FileText size={18} className="text-[#ff4500]" />
                  <h3 className="font-dashboard-caps text-slate-900">Work Info</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Work Detail (Title)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Plastic Removal at Lake" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:border-[#ff4500] outline-none" 
                      onChange={(e) => setFormData({...formData, workDetail: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ff4500]" />
                      <input 
                        type="text" 
                        placeholder="e.g. Shivaji Bridge North Bank" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:border-[#ff4500] outline-none" 
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Methodology (Description)</label>
                  <textarea 
                    rows="4" 
                    placeholder="Describe your process, the tools used, and the volume of waste collected..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-sm font-medium focus:border-[#ff4500] outline-none resize-none"
                    onChange={(e) => setFormData({...formData, workDescription: e.target.value})}
                    required
                  ></textarea>
                </div>
              </section>

              {/* === SECTION 3: MEDIA PROOF === */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-t border-slate-100 pt-8 pb-4">
                  <ShieldCheck size={20} className="text-[#ff4500]" />
                  <h3 className="font-dashboard-caps text-slate-900">Media Proof</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center">
                    <Video size={28} className="text-slate-300 group-hover:text-[#ff4500] mb-3 transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">1 Video Proof<br/>(30sec - 2min)</span>
                    <input type="file" accept="video/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFormData({...formData, videoProof: e.target.files[0]})} />
                  </div>
                  
                  <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center">
                    <ImageIcon size={28} className="text-slate-300 group-hover:text-[#ff4500] mb-3 transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Image Proof 1<br/>(Required)</span>
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFormData({...formData, imageProof1: e.target.files[0]})} />
                  </div>

                  <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center">
                    <ImageIcon size={28} className="text-slate-300 group-hover:text-[#ff4500] mb-3 transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Image Proof 2<br/>(Required)</span>
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFormData({...formData, imageProof2: e.target.files[0]})} />
                  </div>
                </div>
              </section>

              {/* === SECTION 4: PUBLIC FEED & SUBMIT === */}
              <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 gap-6">
                
                <label className="flex items-center gap-4 cursor-pointer group">
                   <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.isPublic ? 'bg-[#ff4500]' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isPublic ? 'left-7' : 'left-1'}`}></div>
                   </div>
                   <input 
                     type="checkbox" 
                     className="hidden" 
                     checked={formData.isPublic}
                     onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                   />
                   <div>
                     <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Want to post?</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Show on Home Page</p>
                   </div>
                </label>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#ff4500] hover:shadow-xl hover:shadow-[#ff4500]/20 transition-all active:scale-95 flex items-center gap-3"
                >
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Transmitting</> : <>Submit for Approval <Send size={16} /></>}
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActionHub;
