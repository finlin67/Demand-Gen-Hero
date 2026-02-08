'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Filter, 
  Target, 
  Zap, 
  TrendingUp, 
  ArrowDown, 
  Activity,
  MousePointer2,
  DollarSign,
  UserPlus,
  PieChart,
  Clock,
  BarChart3,
  X
} from 'lucide-react';

// --- Types ---

interface Particle {
  id: number;
  xStart: number; // -1 to 1 (normalized horizontal start)
  delay: number;
  speed: number;
  type: 'lead' | 'mql' | 'sql' | 'deal';
}

// --- Component ---

export default function DemandGenerationHero() {
  // State for metrics simulation
  const [stats, setStats] = useState({
    impressions: 124500,
    leads: 18420,
    opportunities: 3240,
    revenue: 842,
    cpl: 24.50,
    cac: 1450,
    convAwarenessInterest: 14.8,
    convInterestDecision: 17.6,
    convDecisionAction: 25.9,
    pipeline: 4200000,
    avgCycle: 42,
    winRate: 28.4
  });

  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Particle system state
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdCounter = useRef(0);

  // --- Logic: Particle Spawner ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Limit max particles to prevent DOM overload
      setParticles(prev => {
        const cleanup = prev.filter(p => p.delay + p.speed * 2000 > Date.now() - 3000); 
        
        if (cleanup.length > 20) return cleanup;

        const newId = particleIdCounter.current++;
        // Determine type based on random chance to simulate funnel drop-off
        const rand = Math.random();
        let type: Particle['type'] = 'lead';
        if (rand > 0.4) type = 'mql';
        if (rand > 0.7) type = 'sql';
        if (rand > 0.9) type = 'deal';

        return [
          ...cleanup,
          {
            id: newId,
            xStart: (Math.random() * 2 - 1) * 0.9, // Spread within 90% width
            delay: Date.now(),
            speed: 2 + Math.random() * 1.5, 
            type
          }
        ];
      });
    }, 800); 

    return () => clearInterval(interval);
  }, []);

  // --- Logic: Metrics Simulator ---
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        impressions: prev.impressions + Math.floor(Math.random() * 2), 
        leads: prev.leads + (Math.random() > 0.8 ? 1 : 0),
        opportunities: prev.opportunities + (Math.random() > 0.9 ? 1 : 0),
        revenue: prev.revenue + (Math.random() > 0.98 ? 120 : 0),
        cpl: Math.max(15, prev.cpl + (Math.random() - 0.5) * 0.01),
        cac: Math.max(800, prev.cac + (Math.random() - 0.5) * 0.2),
        convAwarenessInterest: prev.convAwarenessInterest + (Math.random() - 0.5) * 0.005,
        convInterestDecision: prev.convInterestDecision + (Math.random() - 0.5) * 0.005,
        convDecisionAction: prev.convDecisionAction + (Math.random() - 0.5) * 0.005,
        pipeline: prev.pipeline + (Math.random() > 0.7 ? 150 : -50),
        avgCycle: prev.avgCycle, 
        winRate: prev.winRate + (Math.random() - 0.5) * 0.01
      }));
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  // --- Helper: Render Formatter ---
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatCurrency = (num: number, maximumFractionDigits = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits,
    }).format(num);
  };

  const formatCompactCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  };

  const formatPercent = (num: number) => {
      return num.toFixed(1) + '%';
  };

  const handleStageClick = (stage: string) => {
    setSelectedStage(selectedStage === stage ? null : stage);
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white relative overflow-hidden font-sans flex flex-col items-center justify-between select-none p-6">
      
      {/* Background Grid & Accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/20 via-slate-950/0 to-slate-950/80 pointer-events-none" />

      {/* --- Top 15%: Branding & Key Status Indicators --- */}
      <div className={`w-full h-[15%] flex justify-between items-start z-10 transition-opacity duration-300 ${selectedStage ? 'opacity-30' : 'opacity-100'}`}>
          {/* Left Column: Top of Funnel Metrics */}
          <div className="flex flex-col gap-2">
              <GlassMetric 
                  icon={Users}
                  label="Impressions"
                  value={formatNumber(stats.impressions)}
                  trend="+12.4%"
                  color="text-blue-400"
                  delay={0}
              />
               <GlassMetric 
                  icon={DollarSign}
                  label="Cost per Lead"
                  value={formatCurrency(stats.cpl, 2)}
                  trend="-2.1%"
                  color="text-amber-400"
                  delay={0.1}
              />
          </div>

          {/* Right Column: Efficiency Metrics */}
          <div className="flex flex-col gap-2 items-end">
              <GlassMetric 
                  icon={MousePointer2}
                  label="Click Rate"
                  value="4.8%"
                  trend="+0.2%"
                  color="text-emerald-400"
                  delay={0.2}
                  align="right"
              />
              <GlassMetric 
                  icon={UserPlus}
                  label="Acq. Cost (CAC)"
                  value={formatCurrency(stats.cac, 0)}
                  trend="+1.2%"
                  color="text-rose-400"
                  delay={0.3}
                  align="right"
              />
          </div>
      </div>

      {/* --- Middle 70%: Hero Element (Funnel) & Secondary Cards --- */}
      <div className="w-full flex-1 relative flex items-center justify-center min-h-0 z-10">
        
        {/* Central Funnel Stack - Optically Centered */}
        <div className="relative w-[340px] flex flex-col items-center perspective-[1000px] transform-style-3d z-20">
           
           {/* Particles Layer */}
           <div className="absolute inset-0 -mx-10 -my-4 z-0 pointer-events-none">
             <AnimatePresence>
               {particles.map(p => (
                 <FunnelParticle key={p.id} particle={p} />
               ))}
             </AnimatePresence>
           </div>

           {/* Funnel Stages */}
           <div className="relative w-full flex flex-col items-center justify-center space-y-1 z-10">
              
              <FunnelStage 
                id="AWARENESS"
                isSelected={selectedStage === 'AWARENESS'}
                onClick={() => handleStageClick('AWARENESS')}
                width="w-full" 
                color="from-blue-500/30 to-blue-600/10" 
                borderColor="border-blue-500/40"
                label="AWARENESS"
                count={formatNumber(stats.impressions)}
                icon={<Users size={16} className="text-blue-200" />}
              />
              
              <ConversionConnector 
                  color="bg-blue-500/30" 
                  value={formatPercent(stats.convAwarenessInterest)} 
              />

              <FunnelStage 
                id="INTEREST"
                isSelected={selectedStage === 'INTEREST'}
                onClick={() => handleStageClick('INTEREST')}
                