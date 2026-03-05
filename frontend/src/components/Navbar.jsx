import React from 'react';
import { Leaf, Map, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2.5">
        <div className="bg-brand rounded-lg p-1.5 shadow-lg shadow-brand/20">
          <Leaf className="text-white" size={18} />
        </div>
        <Link to="/" className="text-lg font-semibold tracking-tight text-white">
          Impact<span className="text-brand">Platform</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-10 text-[13px] font-medium text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">Overview</Link>
        <Link to="/map" className="hover:text-white transition-colors flex items-center gap-2">
          <Map size={15} /> SOS Map
        </Link>
        <Link to="/marketplace" className="hover:text-white transition-colors flex items-center gap-2">
          <ShoppingBag size={15} /> Rewards
        </Link>
      </div>

      <Link to="/login" className="px-6 py-2 bg-white text-slate-950 rounded-full text-sm font-semibold hover:bg-brand hover:text-white transition-all duration-300">
        Sign In
      </Link>
    </nav>
  );
};

export default Navbar;