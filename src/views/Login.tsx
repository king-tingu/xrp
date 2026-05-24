import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Mail, Lock, LogIn, Globe, UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, signUp, loginWithGoogle, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    console.log('Attempting auth...', { isLogin, email });

    // Diagnostic check
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setError("Supabase credentials not found. Ensure you have a .env file and have restarted your server.");
      return;
    }
    
    if (isLogin) {
      const { error: loginError } = await login(email, password);
      if (loginError) {
        console.error('Login failed:', loginError);
        setError(loginError.message);
      } else {
        console.log('Login request sent successfully');
      }
    } else {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        console.error('Signup failed:', signUpError);
        setError(signUpError.message);
      } else {
        console.log('Signup successful, verification email sent');
        setSuccess('Account created! Please check your email for a verification link to activate your node.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-[2rem] p-8 md:p-10 relative z-10 shadow-2xl overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
          
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 glow-blue border border-accent/30"
            >
              <Cpu className="text-accent" size={32} />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              XRP <span className="text-accent">MINER</span>
            </h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
              {isLogin ? 'Protocol Node Access' : 'Create New Protocol Account'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-xs font-medium"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-400 text-xs font-medium"
              >
                <ShieldCheck size={16} className="shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Protocol Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email"
                  required
                  placeholder="name@cluster.pro"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Access Cipher</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group pt-2"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
              <div className="relative w-full bg-accent hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3">
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <span>{isLogin ? 'Initialize Session' : 'Create Account'}</span>
                    {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-[#0b1121] px-4 text-slate-500">Secure Oauth</span>
            </div>
          </div>

          <button
            onClick={() => loginWithGoogle()}
            disabled={isLoading}
            className="w-full py-4 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 group mb-4"
          >
            <Globe size={18} className="group-hover:text-accent transition-colors" />
            <span>Login with Google</span>
          </button>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center text-[10px] text-accent font-bold uppercase tracking-widest hover:underline transition-all"
          >
            {isLogin ? "Don't have an account? Create one" : "Already have an account? Login"}
          </button>

          <p className="mt-8 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            Authorized Personnel Only<br />
            <span className="text-slate-700">XRP Miner Network v2.5.0</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
