import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, 
  Globe, Target, Users, Zap, Heart, Leaf, Shield, Code, MapPin, Sparkles, GraduationCap, Gift, Quote,Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const coreValues = [
    { icon: <Leaf size={16} />, title: "Eco-First", desc: "Planet over profit." },
    { icon: <Users size={16} />, title: "Community", desc: "Powered by the people." },
    { icon: <Shield size={16} />, title: "Transparent", desc: "Verified impact." },
    { icon: <Zap size={16} />, title: "Rewarding", desc: "Karma pays off." }
  ];

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

        {/* --- LEFT SIDEBAR (Core Values & Quote) --- */}
        <aside className={`bg-slate-50/50 border-r border-slate-100 transition-all duration-300 relative h-full shrink-0 flex flex-col ${isSidebarOpen ? 'w-72' : 'w-0'}`}>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="absolute top-8 bg-white border-2 border-slate-100 rounded-full p-2 shadow-md hover:text-[#ff4500] z-50 transition-all" style={{ right: '-18px' }}>
            {isSidebarOpen ? <ChevronLeft size={20} strokeWidth={3}/> : <ChevronRight size={20} strokeWidth={3}/>}
          </button>

          <div className={`p-8 overflow-hidden transition-opacity duration-300 flex-1 flex flex-col ${!isSidebarOpen && 'opacity-0'}`}>
            <div className="flex items-center gap-3 mb-10 text-slate-900 whitespace-nowrap">
              <Heart size={20} className="text-[#ff4500]" />
              <h3 className="font-dashboard-caps">Our DNA</h3>
            </div>
            
            <div className="space-y-6 flex-1 pr-2 whitespace-nowrap">
              {coreValues.map((value, idx) => (
                 <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[#ff4500] shrink-0">
                      {value.icon}
                    </div>
                    <div className="flex flex-col mt-1">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-900">{value.title}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{value.desc}</span>
                    </div>
                 </div>
              ))}
            </div>

            
            <div className="mt-4 mb-8 pl-2 pr-4 border-l-2 border-orange-200">
               <Quote size={16} className="text-orange-300 mb-2" />
               <p className="text-xs font-bold text-slate-600 italic leading-relaxed">
                 "Small acts, when multiplied by millions of people, can transform the world."
               </p>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">
                 — Howard Zinn
               </p>
            </div>

            <div className="p-5 bg-slate-900 rounded-2xl text-white shrink-0 relative overflow-hidden whitespace-nowrap">
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#ff4500]/20 blur-2xl rounded-full pointer-events-none"></div>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Global Goal</p>
               <h2 className="text-xl font-black italic tracking-tighter text-white">1M+ Actions</h2>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8 lg:p-12 h-full relative">
          <div className="max-w-5xl mx-auto pb-20">
            
            {/* 1. HEADER SECTION */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-black italic text-slate-900 mb-4">
                The <span className="text-[#ff4500] ml-2 mr-2">EcoKarma</span> Story
              </h1>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] max-w-2xl leading-relaxed">
                We believe civic duty shouldn't feel like a chore. It should be an adventure. By crowdsourcing environmental hazards and gamifying the cleanup process, we are turning everyday citizens into local heroes.
              </p>
            </div>

            {/* 2. WHY ECOKARMA? */}
            <div className="bg-orange-50 border border-orange-100 rounded-[32px] p-8 md:p-10 mb-20 relative overflow-hidden shadow-sm">
               <div className="absolute -top-10 -right-10 text-orange-200/50 pointer-events-none">
                 <Sparkles size={180} />
               </div>
               <div className="relative z-10">
                 <h3 className="text-2xl font-black italic tracking-tight text-[#ff4500] mb-4">Why "EcoKarma"?</h3>
                 <div className="space-y-4 text-slate-700 font-medium leading-relaxed max-w-3xl text-sm md:text-base">
                   <p>
                     <span className="font-bold text-slate-900 uppercase tracking-wider">Eco</span> represents our unwavering commitment to the Earth. Our cities are dealing with illegal dumping, plastic pollution, and neglected public spaces. We needed a digital solution for a physical problem.
                   </p>
                   <p>
                     <span className="font-bold text-slate-900 uppercase tracking-wider">Karma</span> reflects the universal truth that good deeds should be rewarded. We built this platform on a simple, powerful philosophy: <span className="italic text-[#ff4500]">When you put good energy into cleaning up the planet, good things should come back to you.</span>
                   </p>
                 </div>
               </div>
            </div>

            {/* 3. THE KARMA LOOP (How it works) */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                 <Zap size={24} className="text-[#ff4500] fill-[#ff4500]" />
                 <h2 className="font-dashboard-caps text-slate-900 text-2xl">The Karma Loop</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Step 1 */}
                 <div className="bg-white border border-slate-100 rounded-[32px] p-8 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-200/50">
                    <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                      <Target size={24} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-black italic tracking-tight text-slate-900 mb-3">1. Find & Report</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      Spot an environmental hazard? Drop a pin on the <span className="font-bold text-slate-700">Community SOS</span> map. Alert the network and set the bounty.
                    </p>
                 </div>

                 {/* Step 2 */}
                 <div className="bg-white border border-slate-100 rounded-[32px] p-8 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-200/50">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                      <Users size={24} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-black italic tracking-tight text-slate-900 mb-3">2. Take Action</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      Accept missions from the <span className="font-bold text-slate-700">ActionHub</span>. Head to the site, clean it up, and submit your photographic evidence.
                    </p>
                 </div>

                 {/* Step 3 */}
                 <div className="bg-white border border-slate-100 rounded-[32px] p-8 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-200/50">
                    <div className="w-14 h-14 bg-orange-50 text-[#ff4500] rounded-2xl flex items-center justify-center mb-6">
                      <Gift size={24} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-black italic tracking-tight text-slate-900 mb-3">3. Earn Perks</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      Verified cleanups reward you with Karma Points. Spend them in the <span className="font-bold text-slate-700">Vault</span> on eco-friendly gear and premium discounts.
                    </p>
                 </div>
              </div>
            </div>

            {/* 4. FOUNDER & BUILD SECTION */}
            <div className="bg-slate-900 rounded-[40px] p-10 md:p-14 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 shadow-2xl">
               <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-[#ff4500]/10 blur-3xl rounded-full pointer-events-none"></div>
               
               {/* Founder Image / Avatar Placeholder */}
               <div className="relative z-10 w-full md:w-1/3 flex justify-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 bg-slate-800 rounded-full border-4 border-slate-700 overflow-hidden relative group">
                     <img 
                       src="/Adityaimg.jpg" 
                       alt="Aditya Parmale" 
                       className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                  </div>
               </div>

               {/* Founder Details */}
               <div className="relative z-10 w-full md:w-2/3">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-[#ff4500] text-[10px] font-black uppercase tracking-widest mb-6">
                    <Code size={14} /> Lead Developer
                 </div>
                 
                 <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter mb-2">Aditya Parmale</h2>
                 <p className="text-[#ff4500] font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5"><GraduationCap size={14} /> Engineering Student</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><MapPin size={14} /> Built in Mumbai</span>
                 </p>

                 <p className="text-slate-400 leading-relaxed mb-8">
                   EcoKarma was engineered from the ground up out of a passion for software development and a vision for cleaner communities. Built robustly to handle complex data relationships, file uploads, and community interactions, the platform proves that modern web technologies can be used to drive massive, positive physical impact in the real world.
                 </p>

                 <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Tech Stack</p>
                      <p className="text-sm font-bold text-white tracking-wide">MERN Stack </p>
                    </div>
                 </div>
               </div>
            </div>

            {/* 5. FOOTER */}
            <div className="mt-20 text-center flex flex-col items-center justify-center">
               <Globe size={32} className="text-slate-300 mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                 EcoKarma. Platform © 2026 <br/>
                 Engineered for the Earth.
               </p>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;
