import React, { useState, useEffect } from 'react';
import {
  TrendingUp, ShieldCheck, ChevronLeft, ChevronRight, MapPin, Loader2, X, Play, Heart, Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, leaderRes] = await Promise.all([
          api.get('/posts'),
          api.get('/users/leaderboard')
        ]);

        setPosts(postsRes.data);
        setLeaderboard(leaderRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ UPGRADED: Bulletproof Like Function using _id
  const handleLike = async (postId) => {
    if (!currentUser) return alert("Please log in to like posts!");

    // Check for both _id (MongoDB standard) and id
    const actualUserId = currentUser._id || currentUser.id;

    if (!actualUserId) {
      console.error("User ID is missing from local storage!");
      return;
    }

    // 1. Optimistic UI Update (Instantly turn the heart red on the screen!)
    setPosts(currentPosts => currentPosts.map(post => {
      if (post._id === postId) {
        const currentLikes = post.likes || [];
        const hasLiked = currentLikes.includes(actualUserId);

        const newLikes = hasLiked
          ? currentLikes.filter(id => id !== actualUserId) // Remove like
          : [...currentLikes, actualUserId]; // Add like

        return { ...post, likes: newLikes };
      }
      return post;
    }));

    // 2. Tell the Backend silently in the background
    try {
      await api.put(`/posts/${postId}/like`, { userId: actualUserId });
    } catch (error) {
      console.error("Failed to like post", error);
    }
  };

  const getInitial = (nameString) => {
    if (!nameString) return 'U';
    return nameString.charAt(0).toUpperCase();
  };

  const isVideo = (url) => {
    if (!url) return false;
    return url.toLowerCase().match(/\.(mp4|mov|webm)$/i);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">

      {/* --- TOP NAVBAR --- */}
      <nav className="h-16 bg-white border-b border-slate-100 shrink-0 px-6 lg:px-10 flex items-center justify-between shadow-sm z-50 relative">
        <Link to="/" className="text-2xl font-black tracking-tighter italic text-[#ff4500]">EcoKarma.</Link>

        {/* Desktop Menu (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-12">
          <div className="flex items-center gap-10 font-dashboard-caps">
            <Link to="/" className="text-[#ff4500] border-b-2 border-[#ff4500] pb-1">Home</Link>
            <Link to="/action-hub" className="hover:text-slate-900 transition-colors">ActionHub</Link>
            <Link to="/sos" className="hover:text-slate-900 transition-colors">Community SOS</Link>
            <Link to="/perks" className="hover:text-slate-900 transition-colors">Perks</Link>
            <Link to="/about" className="hover:text-slate-900 transition-colors">About Us</Link>
          </div>
          <div className="flex items-center gap-4 border-l border-slate-100 pl-8">
            <Link to="/profile" className="w-9 h-9 bg-[#ff4500] text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm hover:brightness-110 transition-all cursor-pointer uppercase">
              {currentUser ? currentUser.name.charAt(0) : 'U'}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Controls (Hidden on Desktop) */}
        <div className="flex lg:hidden items-center gap-4">
          <Link to="/profile" className="w-8 h-8 bg-[#ff4500] text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm uppercase">
            {currentUser ? currentUser.name.charAt(0) : 'U'}
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-900 p-1">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`absolute top-16 left-0 w-full bg-white border-b border-slate-100 shadow-xl flex flex-col p-6 gap-6 z-50 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-dashboard-caps text-slate-900 text-lg hover:text-[#ff4500]">Home</Link>
          <Link to="/action-hub" onClick={() => setIsMobileMenuOpen(false)} className="font-dashboard-caps text-slate-900 text-lg hover:text-[#ff4500]">ActionHub</Link>
          <Link to="/sos" onClick={() => setIsMobileMenuOpen(false)} className="font-dashboard-caps text-slate-900 text-lg hover:text-[#ff4500]">Community SOS</Link>
          <Link to="/perks" onClick={() => setIsMobileMenuOpen(false)} className="font-dashboard-caps text-slate-900 text-lg hover:text-[#ff4500]">Perks</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="font-dashboard-caps text-slate-900 text-lg hover:text-[#ff4500]">About Us</Link>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className={`bg-slate-50/50 border-r border-slate-100 transition-all duration-300 relative h-full shrink-0 flex flex-col ${isSidebarOpen ? 'w-72' : 'w-0'}`}>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="absolute top-8 bg-white border-2 border-slate-100 rounded-full p-2 shadow-md hover:text-[#ff4500] hover:border-[#ff4500] z-50 transition-all active:scale-90" style={{ right: '-18px' }}>
            {isSidebarOpen ? <ChevronLeft size={20} strokeWidth={3} /> : <ChevronRight size={20} strokeWidth={3} />}
          </button>
          
          <div className={`p-8 whitespace-nowrap transition-opacity duration-300 flex-1 flex flex-col overflow-hidden ${!isSidebarOpen && 'opacity-0'}`}>
            <div className="flex items-center gap-3 mb-10 shrink-0">
              <TrendingUp size={20} className="text-[#ff4500]" />
              <h3 className="font-dashboard-caps">Karma Board</h3>
            </div>
            
            <div className="space-y-7 overflow-y-auto flex-1 pr-4 pb-20 scrollbar-hide">
              {leaderboard.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold">Loading leaders...</p>
              ) : (
                leaderboard.map((user, index) => (
                  <div key={user._id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-5">
                      <span className={`text-sm font-black ${index === 0 ? 'text-[#ff4500]' : 'text-slate-300'}`}>
                        0{index + 1}
                      </span>
                      <div>
                        <span className="block text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors tracking-tight">
                          {user.name}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          Level {user.level || 1}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-[#ff4500] bg-orange-50 px-2.5 py-1.5 rounded-md border border-orange-100">
                      {user.completedCleanups} {user.completedCleanups === 1 ? 'Mission' : 'Missions'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-white h-full relative">
          <div className="w-full">
            {loading && (
              <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <Loader2 size={40} className="animate-spin text-[#ff4500] mb-4" />
                <p className="font-dashboard-caps">Syncing Impact Feed...</p>
              </div>
            )}
            {!loading && posts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <ShieldCheck size={48} className="text-slate-200 mb-4" />
                <p className="font-dashboard-caps">No verified posts found.</p>
              </div>
            )}

            {!loading && Array.isArray(posts) && posts.map((post) => {
              const mediaItems = [];
              if (post.imageProof1 && !post.imageProof1.includes('dummy')) mediaItems.push({ type: 'image', url: post.imageProof1, id: 'img1' });
              if (post.videoProof && !post.videoProof.includes('dummy')) mediaItems.push({ type: 'video', url: post.videoProof, id: 'vid' });
              if (post.imageProof2 && !post.imageProof2.includes('dummy')) mediaItems.push({ type: 'image', url: post.imageProof2, id: 'img2' });

              // ✅ UPGRADED: Checking the actual User ID here too!
              const actualUserId = currentUser?._id || currentUser?.id;
              const hasLiked = post.likes?.includes(actualUserId);

              return (
                <div key={post._id} className="border-b border-slate-50 py-14 px-12 lg:px-28 hover:bg-slate-50/20 transition-all duration-300">
                  <div className="w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-5 mb-8">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-md">
                        {post.authorId?.name ? post.authorId.name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-slate-900 leading-none">{post.authorId?.name || 'Community Member'}</h4>
                        <p className="flex items-center gap-1 font-dashboard-caps mt-2 opacity-70">
                          <MapPin size={10} className="text-[#ff4500]" /> {post.location}
                        </p>
                      </div>
                      <div className={`ml-auto px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 border ${post.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {post.status === 'approved' && <ShieldCheck size={14} />}
                        {post.status === 'approved' ? `AI Verified (+${post.pointsAwarded} PTS)` : 'Pending Verification'}
                      </div>
                    </div>

                    <h2 className="text-2xl font-post-title text-slate-900 mb-5">{post.workDetail}</h2>
                    <p className="text-slate-600 text-base leading-relaxed mb-10 max-w-6xl font-medium">{post.workDescription}</p>

                    <div className="w-full rounded-3xl border border-slate-200 overflow-hidden relative shadow-sm bg-slate-900">
                      {mediaItems.length > 0 ? (
                        <div className={`grid ${mediaItems.length === 1 ? 'grid-cols-1' : mediaItems.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} h-64 sm:h-72 lg:h-80 divide-x divide-slate-800`}>
                          {mediaItems.map((item, index) => (
                            <div key={item.id} className="relative h-full cursor-pointer group/media overflow-hidden" onClick={() => setSelectedMedia(item.url)}>
                              {item.type === 'video' ? (
                                <>
                                  <video src={item.url} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover/media:opacity-100 group-hover/media:scale-105 transition-all duration-700" autoPlay muted loop playsInline />
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover/media:bg-white/30 transition-all">
                                      <Play size={20} className="fill-white translate-x-0.5" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <img src={item.url} alt={`Proof ${index}`} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover/media:opacity-100 group-hover/media:scale-105 transition-all duration-700" />
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/30 transition-all duration-300 flex items-center justify-end flex-col p-4 opacity-0 group-hover/media:opacity-100 pointer-events-none">
                                <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap mb-2">
                                  {item.type === 'video' ? 'Watch Video' : 'Expand Image'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-64 sm:h-72 lg:h-80 flex flex-col items-center justify-center text-slate-500 gap-3">
                          <ShieldCheck size={32} className="opacity-50" />
                          <span className="font-dashboard-caps text-[10px]">Media Pending</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex items-center gap-8">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-2.5 font-bold text-sm transition-all group ${hasLiked ? 'text-red-500' : 'text-slate-500 hover:text-slate-900'
                          }`}
                      >
                        <Heart
                          size={24}
                          className={`transition-all duration-300 ${hasLiked
                              ? 'fill-red-500 scale-110'
                              : 'group-hover:scale-110 group-active:scale-95'
                            }`}
                        />
                        <span className="min-w-[60px] text-left">
                          {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
                        </span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {selectedMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 p-4 sm:p-12 backdrop-blur-md transition-all" onClick={() => setSelectedMedia(null)}>
          <button className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-[#ff4500] text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md z-50" onClick={(e) => { e.stopPropagation(); setSelectedMedia(null); }}>
            <X size={24} />
          </button>
          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {isVideo(selectedMedia) ? (
              <video src={selectedMedia} controls autoPlay className="max-w-full max-h-full rounded-2xl shadow-2xl border border-slate-700 bg-black" />
            ) : (
              <img src={selectedMedia} alt="Evidence" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
