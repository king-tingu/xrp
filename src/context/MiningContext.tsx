import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export type PlanType = 'Free' | 'Starter' | 'Pro';

interface Plan {
  name: PlanType;
  price: number;
  dailyYield: number;
  perSecondYield: number;
}

export const PLANS: Record<PlanType, Plan> = {
  Free: {
    name: 'Free',
    price: 0,
    dailyYield: 0.001,
    perSecondYield: 0.001 / 86400,
  },
  Starter: {
    name: 'Starter',
    price: 20,
    dailyYield: 2.0,
    perSecondYield: 2.0 / 86400,
  },
  Pro: {
    name: 'Pro',
    price: 50,
    dailyYield: 5.0,
    perSecondYield: 5.0 / 86400,
  },
};

interface MiningContextType {
  balance: number;
  withdrawableBalance: number;
  currentPlan: Plan;
  upgradePlan: (plan: PlanType) => Promise<void>;
  isSyncing: boolean;
}

const MiningContext = createContext<MiningContextType | undefined>(undefined);

export const MiningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<Plan>(PLANS.Free);
  const [liveBalance, setLiveBalance] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const lastSyncBalanceRef = useRef<number>(0);
  const lastSyncTimeRef = useRef<number>(Date.now());

  // Initialize from user profile
  useEffect(() => {
    if (user) {
      const plan = PLANS[user.currentPlan as PlanType] || PLANS.Free;
      setCurrentPlan(plan);
      
      const lastUpdate = new Date(user.lastUpdate).getTime();
      const now = Date.now();
      const elapsedSeconds = (now - lastUpdate) / 1000;
      const accumulatedSinceLastUpdate = elapsedSeconds * plan.perSecondYield;
      
      const startingBalance = user.balance + accumulatedSinceLastUpdate;
      setLiveBalance(startingBalance);
      
      lastSyncBalanceRef.current = user.balance;
      lastSyncTimeRef.current = lastUpdate;
    }
  }, [user?.id]); // Only re-init on user change

  // Animation frame for smooth UI updates
  useEffect(() => {
    let animationFrame: number;
    
    const tick = () => {
      const now = Date.now();
      const elapsedSinceSync = (now - lastSyncTimeRef.current) / 1000;
      const mined = elapsedSinceSync * currentPlan.perSecondYield;
      setLiveBalance(lastSyncBalanceRef.current + mined);
      animationFrame = requestAnimationFrame(tick);
    };

    if (user) {
      animationFrame = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [user, currentPlan]);

  // Auto-sync to Supabase every 60 seconds
  useEffect(() => {
    if (!user) return;

    const syncInterval = setInterval(async () => {
      await syncBalanceToDb();
    }, 60000);

    return () => clearInterval(syncInterval);
  }, [user, liveBalance, currentPlan]);

  const syncBalanceToDb = async (overrides = {}) => {
    if (!user) return;
    setIsSyncing(true);
    
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('profiles')
      .update({
        balance: liveBalance,
        last_update: now,
        ...overrides
      })
      .eq('id', user.id);

    if (!error) {
      lastSyncBalanceRef.current = liveBalance;
      lastSyncTimeRef.current = new Date(now).getTime();
    }
    setIsSyncing(false);
  };

  const upgradePlan = async (planType: PlanType) => {
    if (!user) return;
    
    // Sync current balance before changing plan
    await syncBalanceToDb({ current_plan: planType });
    setCurrentPlan(PLANS[planType]);
  };

  const value = {
    balance: liveBalance,
    withdrawableBalance: liveBalance * 0.85,
    currentPlan,
    upgradePlan,
    isSyncing
  };

  return <MiningContext.Provider value={value}>{children}</MiningContext.Provider>;
};

export const useMining = () => {
  const context = useContext(MiningContext);
  if (context === undefined) {
    throw new Error('useMining must be used within a MiningProvider');
  }
  return context;
};
