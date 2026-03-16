import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, 
  Gift, ShoppingBag, Zap, Sparkles, CheckCircle2, Ticket, X, Loader2, Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Perks = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  
  const [userPoints, setUserPoints] = useState(0); 
  const [isLoadingPoints, setIsLoadingPoints] = useState(true);

  const [spinTier, setSpinTier] = useState(250);
  const spinOptions = [250, 500, 750, 1000];

  const [storeItems, setStoreItems] = useState([
    { id: 1, name: "Bamboo Coffee Travel Cup", cost: 500, desc: "A sleek, reusable cup for cafe runs.", img: "/1.jpg" },
    { id: 2, name: "Stainless Steel Water Bottle", cost: 700, desc: "Insulated bottle to stop plastic waste.", img: "/2.jpg" },
    { id: 3, name: "Beeswax Food Wraps", cost: 250, desc: "Natural alternative to plastic cling wrap.", img: "/3.jpg" },
    { id: 4, name: "Organic Cotton Tote Bag", cost: 400, desc: "A stylish, heavy-duty grocery bag.", img: "/4.jpg" },
    { id: 5, name: "Reusable Metal Straw Set", cost: 350, desc: "Comes with a little cleaning brush.", img: "/5.jpg" },
    { id: 6, name: "Bamboo Utensil Travel Set", cost: 1000, desc: "Fork, knife, and spoon for eating on the go.", img: "/6.jpg" },
    { id: 7, name: "Swedish Dishcloths", cost: 150, desc: "Replaces paper towels; fully compostable.", img: "/7.jpg" },
    { id: 8, name: "Silicone Food Storage Bags", cost: 200, desc: "Reusable alternative to Ziploc bags.", img: "/8.jpg" },
    { id: 9, name: "Solar-Powered Power Bank", cost: 1000, desc: "Charge your phone using the sun!", img: "/9.jpg" },
    { id: 10, name: "Biodegradable Phone Case", cost: 300, desc: "Made from compostable plant materials.", img: "/10.jpg" },
    { id: 11, name: "Smart LED Lightbulbs", cost: 750, desc: "Energy-saving bulbs controlled via an app.", img: "/11.jpg" },
    { id: 12, name: "Rechargeable AA/AAA Batteries", cost: 800, desc: "Reduces toxic battery waste.", img: "/12.jpg" },
    { id: 13, name: "DIY Herb Garden Kit", cost: 350, desc: "Grow basil and mint on a windowsill.", img: "/13.jpg" },
    { id: 14, name: "Seed Bombs", cost: 200, desc: "Wildflower seeds to throw in empty dirt lots.", img: "/14.jpg" },
    { id: 15, name: "Desk Succulent / Air Plant", cost: 750, desc: "A low-maintenance plant to purify indoor air.", img: "/15.jpg" },
    { id: 16, name: "Kitchen Compost Bin", cost: 350, desc: "A sleek, odor-blocking bin for food scraps.", img: "/16.jpg" },
    { id: 17, name: "Organic Heirloom Seeds Bundle", cost: 250, desc: "Start your own vegetable garden.", img: "/17.jpg" },
    { id: 18, name: "Shampoo & Conditioner Bars", cost: 250, desc: "Zero-plastic packaging hair care.", img: "/18.jpg" },
    { id: 19, name: "Bamboo Toothbrush Pack", cost: 300, desc: "100% biodegradable handles.", img: "/19.jpg" },
    { id: 20, name: "Natural Loofah Sponges", cost: 450, desc: "Grown from plants, not made of plastic.", img: "/20.jpg" },
    { id: 21, name: "Vegan/Cruelty-Free Lip Balm", cost: 400, desc: "Packaged in cardboard tubes.", img: "/21.jpg" },
    { id: 22, name: "Reusable Cotton Makeup Pads", cost: 350, desc: "Washable pads to replace single-use wipes.", img: "/22.jpg" },
    { id: 23, name: "Plant a Tree Certificate", cost: 200, desc: "We donate to plant a tree in your name.", img: "/23.jpg" },
    { id: 24, name: "Local Transit Pass Credit", cost: 300, desc: "$10 loaded onto your city bus/subway card.", img: "/24.jpg" },
    { id: 25, name: "Digital E-Book Voucher", cost: 650, desc: "Zero shipping, zero paper waste.", img: "/25.jpg" },
    { id: 26, name: "Thrift Store Gift Card", cost: 550, desc: "Voucher for second-hand clothing stores.", img: "/26.jpg" },
    { id: 27, name: "Vegan Restaurant Voucher", cost: 1000, desc: "$15 off at a local plant-based cafe.", img: "/27.jpg" },
    { id: 28, name: "National/State Park Pass", cost: 950, desc: "Entry ticket to a local nature reserve.", img: "/28.jpg" },
    { id: 29, name: "Carbon Offset Donation", cost: 600, desc: "We buy carbon offsets on your behalf.", img: "/29.jpg" },
    { id: 30, name: "Sustainable Coffee Beans", cost: 500, desc: "A bag of Fairtrade, bird-friendly coffee.", img: "/30.jpg" }
  ]);

  const premiumPool = [
    { name: "Bamboo Coffee Travel Cup", minTier: 250, desc: "A sleek, reusable cup for cafe runs.", img: "/1.jpg" },
    { name: "Organic Cotton Tote Bag", minTier: 250, desc: "A stylish, heavy-duty grocery bag.", img: "/4.jpg" },
    { name: "Stainless Steel Water Bottle", minTier: 500, desc: "Insulated bottle to stop plastic waste.", img: "/2.jpg" },
    { name: "Digital E-Book Voucher", minTier: 500, desc: "Zero shipping, zero paper waste.", img: "/25.jpg" },
    { name: "Smart LED Lightbulbs", minTier: 750, desc: "Energy-saving bulbs controlled via an app.", img: "/11.jpg" },
    { name: "Desk Succulent / Air Plant", minTier: 750, desc: "A low-maintenance plant to purify indoor air.", img: "/15.jpg" },
    { name: "National/State Park Pass", minTier: 750, desc: "Entry ticket to a local nature reserve.", img: "/28.jpg" },
    { name: "Bamboo Utensil Travel Set", minTier: 1000, desc: "Fork, knife, and spoon for eating on the go.", img: "/6.jpg" },
    { name: "Solar-Powered Power Bank", minTier: 1000, desc: "Charge your phone using the sun!", img: "/9.jpg" },
    { name: "Vegan Restaurant Voucher", minTier: 1000, desc: "$15 off at a local plant-based cafe.", img: "/27.jpg" }
  ];

  const [isSpinning, setIsSpinning] = useState(false);
  const [gachaResult, setGachaResult] = useState(null);

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!currentUser) {
        setIsLoadingPoints(false);
        return;
      }

      try {
        const response = await api.get(`/users/${currentUser.id}`);
        setUserPoints(response.data.points);
      } catch (error) {
        console.error("Failed to fetch real user points:", error);
        setUserPoints(0); 
      } finally {
        setIsLoadingPoints(false);
      }
    };

    fetchUserPoints();
  }, [currentUser?.id]);

  const handleBuy = async (item) => {
    if (userPoints >= item.cost) {
      setUserPoints(prev => prev - item.cost);
      alert(`Success! You bought the ${item.name}. Check your email for shipping details.`);
    } else {
      alert("Not enough Karma points! Keep completing missions.");
    }
  };

  const handleSpinGacha = async () => {
    if (userPoints < spinTier) {
      alert(`You need ${spinTier} Points to play this tier!`);
      return;
    }
    
    setUserPoints(prev => prev - spinTier);
    setIsSpinning(true);
    setGachaResult(null);

    setTimeout(() => {
      const availablePrizes = premiumPool.filter(p => p.minTier === spinTier || p.minTier <= spinTier);
      const randomPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
      
      setGachaResult({ 
        ...randomPrize, 
        id: Date.now(),
        cost: spinTier * 1.5 
      }); 
      
      setIsSpinning(false);
    }, 2000);
  };

  const handleClaimGift = () => {
    alert(`Awesome! You claimed the ${gachaResult.name}. It has been added to your inventory.`);
    setGachaResult(null); 
  };

  const handleRejectGift = () => {
    const isDuplicate = storeItems.some(item => item.name === gachaResult.name);

    if (isDuplicate) {
      alert(`The ${gachaResult.name} is already in the public store! It was discarded.`);
    } else {
      setStoreItems(prev => [gachaResult, ...prev]);
      alert(`${gachaResult.name} was rejected and successfully moved to the public store!`);
    }
    
    setGachaResult(null); 
  };

  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800";
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      
      {/* --- TOP NAVBAR --- */}
      <nav className="h-16 bg-white border-b border-slate-100 shrink-0 px-6 lg:px-10 flex items-center justify-between shadow-sm z-50 relative">
        <Link to="/" className="text-2xl font-black tracking-tighter italic text-[#ff4500]">EcoKarma.</Link>
        
        {/* Desktop Menu (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-12">
          <div className="flex items-center gap-10 font-dashboard-caps">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link to="/action-hub" className="hover:text-slate-900 transition-colors">ActionHub</Link>
            <Link to="/sos" className="hover:text-slate-900 transition-colors">Community SOS</Link>
            <Link to="/perks" className="text-[#ff4500] border-b-2 border-[#ff4500] pb-1">Perks</Link>
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
          <Link to="/perks" onClick={() => setIsMobileMenuOpen(false)} className="font-dashboard-caps text-[#ff4500] text-lg">Perks</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="font-dashboard-caps text-slate-900 text-lg hover:text-[#ff4500]">About Us</Link>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">

        {/* --- LEFT SIDEBAR (Prize Rules) --- */}
        <aside className={`bg-slate-50/50 border-r border-slate-100 transition-all duration-300 relative h-full shrink-0 flex flex-col ${isSidebarOpen ? 'w-72' : 'w-0'}`}>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="absolute top-8 bg-white border-2 border-slate-100 rounded-full p-2 shadow-md hover:text-[#ff4500] z-50 transition-all" style={{ right: '-18px' }}>
            {isSidebarOpen ? <ChevronLeft size={20} strokeWidth={3}/> : <ChevronRight size={20} strokeWidth={3}/>}
          </button>

          <div className={`p-8 whitespace-nowrap overflow-hidden transition-opacity duration-300 flex-1 flex flex-col ${!isSidebarOpen && 'opacity-0'}`}>
            <div className="flex items-center gap-3 mb-10 text-slate-900">
              <Sparkles size={20} className="text-[#ff4500]" />
              <h3 className="font-dashboard-caps">Premium Vault</h3>
            </div>
            
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 leading-relaxed whitespace-normal">
              Sample of rewards currently in the vault:
            </p>

            <div className="space-y-4 text-xs font-bold text-slate-600 tracking-wider flex-1 overflow-y-auto pr-2">
              {premiumPool.slice(0, 5).map((prize, idx) => (
                 <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <img src={prize.img} alt="prize" onError={handleImageError} className="w-8 h-8 rounded-md object-cover" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate">{prize.name}</span>
                      <span className="text-[9px] text-[#ff4500] italic">Min Tier: {prize.minTier} PTS</span>
                    </div>
                 </div>
              ))}
            </div>

            <div className="p-5 bg-slate-900 rounded-2xl text-white mt-6 shrink-0 relative overflow-hidden">
               {isLoadingPoints && (
                 <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center backdrop-blur-sm z-10">
                   <Loader2 size={24} className="animate-spin text-[#ff4500]" />
                 </div>
               )}
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Your Wallet</p>
               <h2 className="text-3xl font-black italic tracking-tighter text-[#ff4500]">{userPoints} PTS</h2>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8 lg:p-12 h-full relative">
          <div className="max-w-6xl mx-auto pb-20">
            
            <div className="mb-10">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">Karma <span className="text-[#ff4500]">Rewards</span></h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Spend your hard-earned impact points.</p>
            </div>

            {/* --- LUCKY DRAW SECTION --- */}
            <div className="bg-slate-900 rounded-[32px] p-10 mb-16 shadow-xl relative overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-10">
               <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#ff4500]/20 blur-3xl rounded-full pointer-events-none"></div>
               
               <div className="relative z-10 w-full xl:w-1/2">
                 <div className="flex items-center gap-2 mb-3">
                   <Zap size={20} className="text-[#ff4500] fill-[#ff4500]" />
                   <h2 className="font-dashboard-caps text-white text-xl">Lucky Draw Vault</h2>
                 </div>
                 <p className="text-slate-400 text-sm mb-6 font-medium">Select your risk tier. Higher points guarantee access to better eco-rewards!</p>
                 
                 {/* SPIN TIER SELECTORS */}
                 <div className="flex flex-wrap gap-3 mb-8">
                   {spinOptions.map(tier => (
                     <button 
                       key={tier}
                       onClick={() => setSpinTier(tier)}
                       disabled={isSpinning || gachaResult !== null || isLoadingPoints}
                       className={`px-4 py-2 rounded-xl text-xs font-black italic tracking-widest transition-all ${
                         spinTier === tier 
                         ? 'bg-[#ff4500] text-white border-2 border-[#ff4500] scale-105' 
                         : 'bg-transparent text-slate-400 border-2 border-slate-700 hover:border-slate-500'
                       } ${(isSpinning || gachaResult || isLoadingPoints) && 'opacity-50 cursor-not-allowed'}`}
                     >
                       {tier}
                     </button>
                   ))}
                 </div>

                 <button 
                   onClick={handleSpinGacha}
                   disabled={isSpinning || gachaResult !== null || isLoadingPoints}
                   className={`px-10 py-5 w-full sm:w-auto rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 ${
                     isSpinning || gachaResult !== null || isLoadingPoints
                     ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                     : 'bg-[#ff4500] text-white hover:bg-orange-600 active:scale-95 shadow-lg shadow-[#ff4500]/20'
                   }`}
                 >
                   {isSpinning ? <><Loader2 size={16} className="animate-spin" /> Rolling Vault...</> : <><Ticket size={16} /> Spin for {spinTier} PTS</>}
                 </button>
               </div>

               {/* Gacha Result Display Area */}
               <div className="relative z-10 w-full xl:w-1/2 min-h-[260px] flex items-center justify-center bg-slate-800 rounded-3xl border border-slate-700 p-6 overflow-hidden">
                 {!isSpinning && !gachaResult && (
                   <span className="text-slate-500 font-bold uppercase tracking-widest text-xs flex flex-col items-center gap-3">
                      <Gift size={32} className="opacity-50" /> 
                      Select tier & Spin to unlock
                   </span>
                 )}

                 {isSpinning && (
                    <div className="text-[#ff4500] flex flex-col items-center gap-4">
                       <Loader2 size={40} className="animate-spin" />
                       <span className="font-dashboard-caps animate-pulse">Unlocking Vault...</span>
                    </div>
                 )}

                 {gachaResult && (
                   <div className="w-full animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                     <img src={gachaResult.img} alt={gachaResult.name} onError={handleImageError} className="w-24 h-24 object-cover rounded-full border-4 border-[#ff4500] shadow-lg mb-4" />
                     <div className="text-center mb-5">
                        <h3 className="text-[#ff4500] font-dashboard-caps text-sm mb-1">You Won!</h3>
                        <p className="text-white font-bold text-2xl tracking-tight">{gachaResult.name}</p>
                     </div>
                     <div className="flex w-full gap-3 mt-2">
                        <button onClick={handleClaimGift} className="flex-1 bg-emerald-500 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors flex justify-center items-center gap-2">
                          Keep It <CheckCircle2 size={14} />
                        </button>
                        <button onClick={handleRejectGift} className="flex-1 bg-slate-700 text-slate-300 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-600 transition-colors flex justify-center items-center gap-2">
                          To Store <X size={14} />
                        </button>
                     </div>
                   </div>
                 )}
               </div>
            </div>

            {/* --- STANDARD STORE SECTION --- */}
            <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
               <ShoppingBag size={24} className="text-[#ff4500]" />
               <h2 className="font-dashboard-caps text-slate-900 text-2xl">Standard Market</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {storeItems.map((item, index) => (
                <div key={index} className="bg-white border border-slate-100 rounded-[24px] hover:shadow-xl hover:shadow-slate-200 transition-all group flex flex-col overflow-hidden">
                   
                   <div className="w-full h-40 bg-slate-100 relative overflow-hidden">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black italic tracking-tighter text-[#ff4500] shadow-sm">
                        {item.cost} PTS
                      </div>
                   </div>
                   
                   <div className="p-5 flex-1 flex flex-col">
                     <h3 className="font-bold text-slate-900 mb-1 leading-tight">{item.name}</h3>
                     <p className="text-xs text-slate-500 mb-6 flex-1">{item.desc}</p>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                         In Stock
                       </span>
                       <button 
                         onClick={() => handleBuy(item)}
                         disabled={userPoints < item.cost}
                         className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                           userPoints >= item.cost 
                           ? 'bg-slate-900 text-white hover:bg-[#ff4500]' 
                           : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                         }`}
                       >
                         {userPoints >= item.cost ? 'Buy' : 'Locked'} <ShoppingBag size={12} />
                       </button>
                     </div>
                   </div>
                </div>
              ))}
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Perks;
