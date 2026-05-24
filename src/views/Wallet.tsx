import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useMining } from '../context/MiningContext';
import { DEPOSIT_ADDRESSES, EXCHANGE_LOGOS } from '../lib/constants';

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
          .map((_char, index) => {
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
    <div className="flex flex-col gap-2 w-full">
      <div className={`flex items-center gap-3 p-4 bg-slate-950/50 border rounded-xl md:rounded-2xl group transition-all ${isGenerating ? 'border-accent/30 animate-pulse' : 'border-slate-800 hover:border-slate-700'}`}>
        <span className={`text-[10px] md:text-xs font-mono break-all flex-1 ${isGenerating ? 'text-accent/70' : 'text-slate-300'}`}>
          {displayAddress}
        </span>
        <button 
          onClick={() => {
            if (!isGenerating) {
              navigator.clipboard.writeText(address);
            }
          }}
          disabled={isGenerating}
          className={`${isGenerating ? 'opacity-20 cursor-not-allowed' : 'text-slate-500 hover:text-accent'} p-1 transition-colors`}
        >
          <Copy size={16} />
        </button>
      </div>
    </div>
  );
};

const Wallet: React.FC = () => {
  const { balance, withdrawableBalance } = useMining();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const usdtDepositAddress = DEPOSIT_ADDRESSES.USDT_TRC20;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
      }, 3000);
    }, 2500);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <header>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight">Financial <span className="text-accent">Assets</span></h2>
        <p className="text-slate-500 text-sm md:text-base font-medium">Manage your active holdings</p>
      </header>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              <WalletIcon size={20} />
            </div>
            <span className="text-slate-400 font-bold text-[10px] md:text-sm uppercase tracking-widest">Total Balance</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-black tabular-nums">{balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
            <span className="text-lg md:text-xl font-bold text-slate-500">XRP</span>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-l-emerald-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-slate-400 font-bold text-[10px] md:text-sm uppercase tracking-widest">Withdrawable</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-black tabular-nums text-emerald-400">{withdrawableBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
            <span className="text-lg md:text-xl font-bold text-slate-500">XRP</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-500 font-medium">Net available after network maintenance reserve</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Deposit Section */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <ArrowDownCircle className="text-accent" size={24} />
            <h3 className="text-xl font-bold">Deposit USDT</h3>
          </div>
          
          <div className="flex flex-col items-center gap-6 py-4">
            {/* Real QR Code */}
            <div className="w-40 h-40 md:w-48 md:h-48 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl relative shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center">
              <QRCodeSVG 
                value={usdtDepositAddress}
                size={160}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/favicon.svg",
                  x: undefined,
                  y: undefined,
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
            </div>
            
            <div className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">USDT Address (TRC20)</label>
                <AddressGenerator address={usdtDepositAddress} />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-800/50">
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4 text-center">Verified Network Partners</p>
             <div className="flex flex-wrap justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                {EXCHANGE_LOGOS.map((logo) => (
                  <div key={logo.name} className="flex items-center gap-2 group cursor-default">
                    <img 
                      src={logo.url} 
                      alt={logo.name} 
                      className="w-5 h-5 md:w-6 md:h-6 object-contain" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://api.iconify.design/material-symbols:account-balance-wallet-outline.svg';
                      }}
                    />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">{logo.name}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl md:rounded-2xl flex gap-3">
             <AlertTriangle className="text-amber-500 shrink-0" size={18} />
             <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">
               Ensure you send USDT only. Sending other assets will result in permanent loss. Funds will be credited after network verification.
             </p>
          </div>
        </section>

        {/* Withdraw Section */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex flex-col">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <ArrowUpCircle className="text-emerald-400" size={24} />
            <h3 className="text-xl font-bold">Request Payout</h3>
          </div>

          <form className="space-y-6 flex-1" onSubmit={(e) => { e.preventDefault(); setShowWithdrawModal(true); }}>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Destination Address</label>
              <input 
                type="text" required placeholder="r..."
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl md:rounded-2xl p-4 text-sm focus:outline-none focus:border-accent transition-colors font-mono"
                value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end px-1">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Amount (XRP)</label>
                <button type="button" onClick={() => setWithdrawAmount(withdrawableBalance.toFixed(6))} className="text-[10px] text-accent font-bold uppercase hover:underline">Max</button>
              </div>
              <div className="relative">
                <input 
                  type="number" required placeholder="0.00"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl md:rounded-2xl p-4 pr-16 text-sm focus:outline-none focus:border-accent transition-colors font-bold"
                  value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">XRP</span>
              </div>
            </div>

            <div className="pt-4 mt-auto">
              <button
                type="submit"
                className="w-full py-4 bg-slate-800 hover:bg-emerald-500 text-white font-bold rounded-xl md:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Execute Payout
                <ArrowUpCircle size={18} className="group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Withdraw Confirmation Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isProcessing && setShowWithdrawModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2rem] p-6 md:p-10 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              {!isSuccess ? (
                <>
                  <div className="flex flex-col items-center text-center mb-6 md:mb-8">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/30">
                      <ArrowUpCircle className="text-emerald-400" size={32} />
                    </div>
                    <h4 className="text-xl md:text-2xl font-black">Confirm <span className="text-emerald-400">Transaction</span></h4>
                  </div>
                  <div className="space-y-4 mb-8 md:mb-10 bg-slate-950/50 p-4 md:p-6 rounded-2xl border border-slate-800/50">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Amount</span>
                      <span className="text-sm font-black">{withdrawAmount} XRP</span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Recipient</span>
                      <span className="text-[10px] font-mono text-slate-300 break-all text-right">{walletAddress}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setShowWithdrawModal(false)} disabled={isProcessing} className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl md:rounded-2xl transition-all">Cancel</button>
                    <button onClick={handleWithdraw} disabled={isProcessing} className="flex-2 px-6 md:px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-2">
                      {isProcessing ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : 'Confirm'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center py-8 md:py-10">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]"><CheckCircle2 className="text-white" size={40} /></motion.div>
                  <h4 className="text-2xl md:text-3xl font-black mb-2">Success!</h4>
                  <p className="text-slate-400 text-sm font-medium px-4">Your transaction has been broadcasted to the network.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;
