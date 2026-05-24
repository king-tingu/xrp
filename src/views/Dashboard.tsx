import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Cpu, TrendingUp, ChevronRight, X, Copy, AlertCircle, Activity } from 'lucide-react';
import { useMining, PLANS } from '../context/MiningContext';
import type { PlanType } from '../context/MiningContext';
import { DEPOSIT_ADDRESSES, EXCHANGE_LOGOS } from '../lib/constants';

const MiningAnimation = () => {

const MiningAnimation = () => {
  return (
    <div className="relative w-full h-32 bg-slate-950/50 rounded-2xl border border-slate-900 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 grid grid-cols-12 gap-1 opacity-20">
        {[...Array(48)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() * 2 }}
            className="w-full h-8 bg-accent rounded-sm"
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <Activity className="text-accent animate-pulse mb-2" size={32} />
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [4, 16, 4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 bg-accent rounded-full"
            />
          ))}
        </div>
        <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mt-2">Active Extraction</p>
      </div>
    </div>
  );
};

const AddressGenerator = ({ address }: { address: string }) => {
  const [displayAddress, setDisplayAddress] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    let iteration = 0;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
    
    const interval = setInterval(() => {
      setDisplayAddress(
        address
          .split('')
          .map((char, index) => {
            if (index < iteration) return address[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= address.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
      iteration += 1;
    }, 40);

    return () => clearInterval(interval);
  }, [address]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block ml-1">
          {isGenerating ? 'Generating Secure Node Address...' : 'USDT Deposit Address (TRC20)'}
        </label>
        {isGenerating && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3 border border-accent border-t-transparent rounded-full"
          />
        )}
      </div>
      <div className={`flex items-center gap-3 p-4 bg-slate-900 border rounded-xl md:rounded-2xl group transition-all ${isGenerating ? 'border-accent/30 animate-pulse' : 'border-slate-800 hover:border-accent/50'}`}>
        <span className={`text-[10px] md:text-xs font-mono break-all flex-1 ${isGenerating ? 'text-accent/70' : 'text-slate-300'}`}>
          {displayAddress}
        </span>
        <button 
          onClick={() => {
            if (!isGenerating) {
              navigator.clipboard.writeText(address);
              // You could add a toast notification here
            }
          }}
          disabled={isGenerating}
          className={`${isGenerating ? 'opacity-20 cursor-not-allowed' : 'text-slate-500 hover:text-accent'} p-1 transition-colors`}
        >
          <Copy size={18} />
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { balance, currentPlan } = useMining();
  const [selectedUpgrade, setSelectedUpgrade] = useState<PlanType | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const progress = (balance % 1) * 100;
  const usdtDepositAddress = DEPOSIT_ADDRESSES.USDT_TRC20;

  const handleUpgradeClick = (planName: PlanType) => {
    setSelectedUpgrade(planName);
    setShowUpgradeModal(true);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">System <span className="text-accent">Overview</span></h2>
          <p className="text-slate-500 text-sm md:text-base font-medium">Monitoring real-time node performance</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full w-fit">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse glow-emerald" />
          <span className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase tracking-wider">Network Active</span>
        </div>
      </header>

      {/* Main Stats Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Cpu size={120} className="text-accent" />
          </div>
          
          <div className="relative z-10">
            <p className="text-slate-400 font-bold text-[10px] md:text-sm uppercase tracking-widest mb-2">Total Accumulated Balance</p>
            <div className="flex items-baseline gap-2 md:gap-3 mb-6 md:mb-8 flex-wrap">
              <span className="text-4xl md:text-6xl font-black tracking-tighter tabular-nums">
                {balance.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
              </span>
              <span className="text-xl md:text-2xl font-bold text-accent">XRP</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-slate-800/50">
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Daily Yield</p>
                <p className="text-lg md:text-xl font-bold text-white">+{currentPlan.dailyYield} XRP</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Hash Rate</p>
                <p className="text-lg md:text-xl font-bold text-white">{(currentPlan.perSecondYield * 1000000).toFixed(2)} GH/s</p>
              </div>
              <div className="hidden md:block">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Node Efficiency</p>
                <p className="text-lg md:text-xl font-bold text-emerald-400">99.98%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Ring & Animation Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-between relative gap-6">
          <p className="w-full text-slate-400 font-bold text-[10px] uppercase tracking-widest text-left">Mining Cycle</p>
          
          <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-slate-800" />
              <motion.circle
                cx="50%" cy="50%" r="45%" fill="transparent" stroke="currentColor" strokeWidth="10" strokeDasharray="283"
                animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                className="text-accent drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl md:text-3xl font-black">{Math.floor(progress)}%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Current Block</span>
            </div>
          </div>

          <MiningAnimation />
        </div>
      </div>

      {/* Plans Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <TrendingUp size={20} className="text-accent" />
            Active Mining Plans
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.keys(PLANS) as PlanType[]).map((planName) => {
            const plan = PLANS[planName];
            const isActive = currentPlan.name === planName;

            return (
              <div 
                key={planName}
                className={`relative p-6 rounded-2xl md:rounded-3xl border transition-all duration-300 ${
                  isActive 
                    ? 'bg-accent/5 border-accent shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]' 
                    : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-accent text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                    Active
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-bold">{plan.name}</h4>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">Plan Level</p>
                  </div>
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-accent text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <Zap size={18} />
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">{plan.dailyYield}</span>
                    <span className="text-sm font-bold text-slate-500">XRP/Day</span>
                  </div>
                  <p className="text-xs text-slate-500">Node allocation active</p>
                </div>

                {isActive ? (
                  <div className="w-full py-3 rounded-xl md:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center justify-center gap-2">
                    Current Capacity
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgradeClick(planName)}
                    className="w-full py-3 rounded-xl md:rounded-2xl bg-slate-800 hover:bg-accent hover:text-white transition-all text-slate-300 text-sm font-bold flex items-center justify-center gap-2 group"
                  >
                    Upgrade for ${plan.price}
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Network Partners Section */}
      <section className="pt-6 md:pt-10 border-t border-slate-800/50">
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-6 text-center">In Collaboration With</p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          {EXCHANGE_LOGOS.map((logo) => (
            <div key={logo.name} className="flex items-center gap-3 group cursor-default">
              <img src={logo.url} alt={logo.name} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
              <span className="text-xs font-black text-slate-400 group-hover:text-white transition-colors tracking-tight">{logo.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Upgrade Deposit Modal */}
      <AnimatePresence>
        {showUpgradeModal && selectedUpgrade && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUpgradeModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2rem] p-6 md:p-10 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
              
              <div className="flex justify-between items-start mb-6 md:mb-8">
                <div>
                  <h4 className="text-xl md:text-2xl font-black tracking-tight">Upgrade to <span className="text-accent">{selectedUpgrade}</span></h4>
                  <p className="text-slate-500 text-xs md:text-sm font-medium">Activate high-yield mining nodes</p>
                </div>
                <button onClick={() => setShowUpgradeModal(false)} className="text-slate-500 hover:text-white p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="bg-slate-950/50 rounded-2xl md:rounded-3xl border border-slate-800/50 p-4 md:p-6 mb-6 md:mb-8 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm font-bold text-slate-400">Required Deposit</span>
                  <span className="text-xl md:text-2xl font-black text-white">${PLANS[selectedUpgrade].price} USDT</span>
                </div>

                <AddressGenerator address={usdtDepositAddress} />

                <div className="flex gap-4 p-4 bg-accent/5 border border-accent/20 rounded-xl md:rounded-2xl">
                  <AlertCircle className="text-accent shrink-0" size={20} />
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    Send exactly <span className="text-white font-bold">${PLANS[selectedUpgrade].price} USDT</span> to the address above. Your plan will activate after network confirmations.
                  </p>
                </div>
              </div>

              <button onClick={() => setShowUpgradeModal(false)} className="w-full py-4 bg-accent hover:bg-blue-600 text-white font-bold rounded-xl md:rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                I have sent the payment
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
