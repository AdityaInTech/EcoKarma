import React, { useState, useEffect } from 'react';
import { 
  User, MapPin, Zap, Award, LogOut, Camera, CheckCircle2, Clock, Shield, Target, Menu
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Profile = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Grab the real logged-in EcoKarma user from memory
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userRes = await api.get(`/users/${currentUser.id}`);
        setUserData(userRes.data);

        const postsRes = await api.get(`/posts/user/${currentUser.id}`);
        setUserPosts(postsRes.data);
      } catch (error) {
        console.error("Backend not connected yet. Loading fallback data...", error);
        
        // Fallback Data
        setUserData({
          name: currentUser.name, 
          rollNo: "Pending",
          location: "Unknown",
          points: 0,
          level: 1,
          completedCleanups: 0,
          joinDate: new Date().toISOString()
        });
        setUserPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser?.id]);

  // Sign Out Functionality
  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/auth'); 
  };

  // Get the First Letter of the name and force it to be Capitalized
  const getInitial = (nameString) => {
    if (!nameString) return 'U';
    return nameString.charAt(0).toUpperCase();
  };

  const cleanupsTowardsNextLevel = userData ? (userData.completedCleanups % 5) : 0;
  const progressPercentage = (cleanupsTowardsNextLevel / 5) * 100;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-[#ff4500]">
        <Zap size={40} className="animate-pulse" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      
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
      {/* --- MAIN CONTENT AREA (Full Width Now) --- */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
        <div className="max-w-5xl mx-auto pb-20">
          
          {/* 1. HERO PROFILE SECTION */}
          <div className="bg-slate-900 rounded-[40px] p-10 relative overflow-hidden mb-10 shadow-xl">
             <div className="absolute right-0 top-0 w-96 h-96 bg-[#ff4500]/10 blur-3xl rounded-full pointer-events-none"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Dynamic Avatar Container */}
                <div className="relative">
                  <div className="w-32 h-32 bg-slate-800 rounded-full border-4 border-slate-700 overflow-hidden flex items-center justify-center text-5xl font-black text-[#ff4500]">
                    {getInitial(userData?.name || currentUser?.name)}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#ff4500] text-white rounded-full border-4 border-slate-900 flex items-center justify-center hover:scale-110 transition-transform">
                    <Camera size={16} />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ff4500]/20 text-[#ff4500] text-[10px] font-black uppercase tracking-widest mb-3">
                    <Shield size={12} /> Level {userData?.level || 1} Eco-Warrior
                  </div>
                  <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">{userData?.name || "Loading..."}</h1>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {userData?.location || "Global Citizen"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">Role: {currentUser?.role || "User"}</span>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="max-w-md bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">
                      <span>Level {userData?.level || 1}</span>
                      <span>Level {(userData?.level || 1) + 1}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-[#ff4500] rounded-full transition-all duration-1000 relative"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-2 text-center font-bold tracking-widest uppercase">
                      {5 - cleanupsTowardsNextLevel} cleanups until level up
                    </p>
                  </div>

                </div>
             </div>
          </div>

          {/* 2. STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
             <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-5">
               <div className="w-14 h-14 bg-orange-50 text-[#ff4500] rounded-2xl flex items-center justify-center">
                 <Zap size={24} className="fill-[#ff4500]" />
               </div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Karma</p>
                 <h3 className="text-2xl font-black text-slate-900 italic">{userData?.points || 0} <span className="text-sm not-italic text-slate-400">PTS</span></h3>
               </div>
             </div>

             <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-5">
               <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                 <CheckCircle2 size={24} />
               </div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Impact Actions</p>
                 <h3 className="text-2xl font-black text-slate-900 italic">{userData?.completedCleanups || 0} <span className="text-sm not-italic text-slate-400">Done</span></h3>
               </div>
             </div>

             <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-5">
               <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                 <Target size={24} />
               </div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Member Since</p>
                 <h3 className="text-lg font-black text-slate-900 italic">
                   {userData?.joinDate ? new Date(userData.joinDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Today'}
                 </h3>
               </div>
             </div>
          </div>

          {/* 3. RECENT ACTIVITY FEED */}
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
               <Clock size={20} className="text-[#ff4500]" />
               <h2 className="font-dashboard-caps text-slate-900 text-xl">Recent Activity</h2>
            </div>

            {userPosts.length === 0 ? (
              <div className="text-center py-10 bg-white border border-slate-100 rounded-[24px]">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No missions completed yet. Head to the ActionHub!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div key={post._id} className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-12 rounded-full ${post.status === 'approved' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{post.workDetail}</h4>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span className="flex items-center gap-1"><MapPin size={12} className="text-[#ff4500]" /> {post.location}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 sm:pl-4 sm:border-l sm:border-slate-100">
                      <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                        {post.status === 'approved' ? (
                          <span className="text-emerald-500 font-bold text-xs uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12}/> Verified</span>
                        ) : (
                          <span className="text-amber-500 font-bold text-xs uppercase tracking-wider flex items-center gap-1"><Clock size={12}/> Pending</span>
                        )}
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Earned</p>
                        <p className="text-lg font-black italic text-[#ff4500] tracking-tighter">
                          {post.status === 'approved' ? `+${post.pointsAwarded}` : '---'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
      
    </div>
  );
};

export default Profile;
