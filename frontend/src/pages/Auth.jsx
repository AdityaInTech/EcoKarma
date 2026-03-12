import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, Quote } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        navigate('/');

      } else {
        const response = await api.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'user'
        });

        if (response.status === 201) {
          alert("Account created successfully! You can now log in.");
          setIsLogin(true);
          setFormData({ ...formData, password: '' });
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-1 bg-slate-900 text-white flex-col justify-between p-14 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-brand)]/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-brand)]/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10">
          <Link to="/" className="text-3xl font-black tracking-tight italic text-white hover:text-[var(--color-brand)] transition-colors">
            EcoKarma
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-10">
          <Quote size={40} className="text-[var(--color-brand)] mb-6 opacity-80" />
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight mb-6 text-slate-100">
            "Do your little bit of good where you are; it's those little bits of good put together that overwhelm the world."
          </h1>
          <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">
            — Desmond Tutu
          </p>
        </div>
        
        <div className="relative z-10 font-bold uppercase tracking-widest text-[10px] text-slate-500">
          © 2026 EcoKarma • Community First
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8 relative bg-slate-50">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-lg border border-slate-200">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3">
              {isLogin ? 'Enter your credentials to continue' : 'Join EcoKarma and start earning Karma'}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-red-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className={`transition-all duration-300 overflow-hidden ${isLogin ? 'max-h-0 opacity-0 m-0' : 'max-h-24 opacity-100'}`}>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-5 py-4 text-sm font-semibold text-slate-700 focus:bg-white focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required={!isLogin}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-5 py-4 text-sm font-semibold text-slate-700 focus:bg-white focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                {isLogin && (
                  <button type="button" className="text-[10px] font-bold text-[var(--color-brand)] hover:underline">Forgot?</button>
                )}
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-5 py-4 text-sm font-semibold text-slate-700 focus:bg-white focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-brand)] text-white py-4 rounded-xl font-black uppercase tracking-[0.15em] text-xs hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-6 disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg('');
                }}
                className="ml-2 text-[var(--color-brand)] font-bold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;