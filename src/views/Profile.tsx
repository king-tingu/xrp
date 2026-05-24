import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, ShieldCheck, ShieldAlert, Zap, Globe, Clock, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, toggle2FA } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h2 className="text-3xl font-black tracking-tight">Identity <span className="text-accent">Node</span></h2>
        <p className="text-slate-500 font-medium">Authentication and security configuration</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
               <User size={150} className="text-accent" />
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
              <div className="relative">
                <div className="w-32 h-32 bg-slate-950 rounded-[2rem] border-2 border-slate-800 flex items-center justify-center overflow-hidden">
                   <div className="w-full h-full bg-gradient-to-br from-accent/20 to-blue-600/20 flex items-center justify-center">
                     <User size={60} className="text-accent" />
                   </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-slate-900 flex items-center justify-center">
                   <Zap size={18} className="text-white" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h3 className="text-4xl font-black tracking-tight">{user.username}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                    <span className="px-3 py-0.5 bg-accent/10 text-accent text-[10px] font-black uppercase rounded-full border border-accent/20">
                      {user.level} Member
                    </span>
                    <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">• Verified Miner</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                    <Mail size={18} className="text-slate-500" />
                    <div className="text-left">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Email Address</p>
                      <p className="text-sm font-bold">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                    <Globe size={18} className="text-slate-500" />
                    <div className="text-left">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Region</p>
                      <p className="text-sm font-bold">Cloud Cluster-7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] space-y-4">
               <div className="p-3 bg-slate-950 w-fit rounded-xl border border-slate-800">
                  <Clock size={20} className="text-accent" />
               </div>
               <div>
                  <h4 className="font-bold">Last Session</h4>
                  <p className="text-xs text-slate-500">Connected 14 minutes ago from 192.168.1.104</p>
               </div>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] space-y-4">
               <div className="p-3 bg-slate-950 w-fit rounded-xl border border-slate-800">
                  <Smartphone size={20} className="text-emerald-400" />
               </div>
               <div>
                  <h4 className="font-bold">Active Device</h4>
                  <p className="text-xs text-slate-500">Desktop Terminal v2.4.0-Live</p>
               </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="text-accent" size={24} />
            <h3 className="text-xl font-bold">Security Center</h3>
          </div>

          <div className="space-y-8 flex-1">
            <div className="flex items-center justify-between p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${user.is2FAEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                   {user.is2FAEnabled ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                </div>
                <div>
                  <p className="font-bold text-sm">Two-Factor Auth</p>
                  <p className="text-[10px] text-slate-500 font-medium">Hardware keys supported</p>
                </div>
              </div>
              
              <button 
                onClick={toggle2FA}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${user.is2FAEnabled ? 'bg-emerald-500' : 'bg-slate-800'}`}
              >
                <motion.div 
                  animate={{ x: user.is2FAEnabled ? 26 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Data Protection</h4>
               <p className="text-xs text-slate-400 leading-relaxed px-2">
                 Your mining keys are protected using a decentralized security layer. No private keys are stored on the hardware.
               </p>
            </div>
          </div>

          <div className="pt-8 mt-auto">
            <button className="w-full py-4 bg-slate-950 border border-slate-800 hover:border-accent hover:text-accent text-slate-400 font-bold rounded-2xl transition-all text-sm">
              Change Protocol Password
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
