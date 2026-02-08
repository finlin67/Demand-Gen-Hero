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
                width="w-[82%]" 
                color="from-indigo-500/30 to-indigo-600/10" 
                borderColor="border-indigo-500/40"
                label="INTEREST"
                count={formatNumber(stats.leads)}
                icon={<Filter size={16} className="text-indigo-200" />}
              />

              <ConversionConnector 
                  color="bg-indigo-500/30" 
                  value={formatPercent(stats.convInterestDecision)} 
              />

              <FunnelStage 
                id="DECISION"
                isSelected={selectedStage === 'DECISION'}
                onClick={() => handleStageClick('DECISION')}
                width="w-[64%]" 
                color="from-violet-500/30 to-violet-600/10" 
                borderColor="border-violet-500/40"
                label="DECISION"
                count={formatNumber(stats.opportunities)}
                icon={<Target size={16} className="text-violet-200" />}
              />

              <ConversionConnector 
                  color="bg-violet-500/30" 
                  value={formatPercent(stats.convDecisionAction)} 
              />

              <FunnelStage 
                id="ACTION"
                isSelected={selectedStage === 'ACTION'}
                onClick={() => handleStageClick('ACTION')}
                width="w-[46%]" 
                color="from-fuchsia-500/30 to-fuchsia-600/10" 
                borderColor="border-fuchsia-500/40"
                label="ACTION"
                count={formatCurrency(stats.revenue * 1000)} // Simulating value
                icon={<Zap size={16} className="text-fuchsia-200" />}
                isLast
              />

           </div>
        </div>

        {/* Floating Context Cards */}
        {/* Lead Velocity moved to prevent overlap */}
        <FloatingCard 
          className={`absolute left-0 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${selectedStage ? 'opacity-0' : 'opacity-100'}`}
          title="Lead Velocity"
          value="+24%"
          icon={<Activity size={16} className="text-sky-400" />}
        />

        <FloatingCard 
          className={`absolute right-0 top-[70%] -translate-y-1/2 transition-opacity duration-300 ${selectedStage ? 'opacity-0' : 'opacity-100'}`}
          title="Avg. Deal"
          value="$12.5k"
          icon={<PieChart size={16} className="text-purple-400" />}
          delay={1.5}
        />

        {/* Interaction Overlay */}
        <AnimatePresence>
          {selectedStage && (
            <StageDetailOverlay 
              stage={selectedStage}
              stats={stats}
              onClose={() => setSelectedStage(null)}
              formatters={{ formatNumber, formatPercent, formatCurrency, formatCompactCurrency }}
            />
          )}
        </AnimatePresence>

      </div>

      {/* --- Bottom 15%: Animated Metrics Grid --- */}
      <div className={`w-full h-[15%] grid grid-cols-3 gap-2 sm:gap-4 mt-2 transition-opacity duration-300 ${selectedStage ? 'opacity-30' : 'opacity-100'}`}>
          <BottomMetricCard 
              label="Pipeline Velocity"
              value={formatCompactCurrency(stats.pipeline)}
              trend="8.4%"
              trendUp={false}
              icon={BarChart3}
              color="text-blue-400"
              delay={0}
          />
          <BottomMetricCard 
              label="Avg. Cycle Time"
              value={`${Math.floor(stats.avgCycle)} days`}
              trend="1.2d"
              trendUp={true} 
              isInverseTrend 
              icon={Clock}
              color="text-amber-400"
              delay={0.1}
          />
          <BottomMetricCard 
              label="Win Rate"
              value={formatPercent(stats.winRate)}
              trend="2.1%"
              trendUp={true}
              icon={TrendingUp}
              color="text-emerald-400"
              delay={0.2}
          />
      </div>

    </div>
  );
}

// --- Sub-components ---

function StageDetailOverlay({ stage, stats, onClose, formatters }: any) {
  // Determine content based on stage
  let content = {
    title: stage,
    count: '',
    description: '',
    metrics: [] as any[]
  };

  const { formatNumber, formatPercent, formatCurrency, formatCompactCurrency } = formatters;

  switch(stage) {
    case 'AWARENESS':
      content = {
        title: 'Awareness',
        count: formatNumber(stats.impressions),
        description: 'Total volume of traffic and unique visitors entering the top of the funnel via paid and organic channels.',
        metrics: [
          { label: 'Click Rate', value: '4.8%', icon: MousePointer2, color: 'text-blue-400' },
          { label: 'Growth', value: '+12.4%', icon: TrendingUp, color: 'text-emerald-400' }
        ]
      };
      break;
    case 'INTEREST':
      content = {
        title: 'Interest',
        count: formatNumber(stats.leads),
        description: 'Engaged users who have taken a micro-conversion action (e.g., newsletter signup, whitepaper download).',
        metrics: [
          { label: 'Conversion', value: formatPercent(stats.convAwarenessInterest), icon: Filter, color: 'text-indigo-400' },
          { label: 'Cost / Lead', value: formatCurrency(stats.cpl, 2), icon: DollarSign, color: 'text-amber-400' }
        ]
      };
      break;
    case 'DECISION':
      content = {
        title: 'Decision',
        count: formatNumber(stats.opportunities),
        description: 'Sales Qualified Opportunities (SQOs) currently in active negotiation or proposal stages.',
        metrics: [
          { label: 'Conversion', value: formatPercent(stats.convInterestDecision), icon: Target, color: 'text-violet-400' },
          { label: 'Pipeline Val', value: formatCompactCurrency(stats.pipeline), icon: BarChart3, color: 'text-purple-400' }
        ]
      };
      break;
    case 'ACTION':
      content = {
        title: 'Action',
        count: formatCurrency(stats.revenue * 1000),
        description: 'Closed-won revenue generated from the pipeline. Represents the final successful conversion.',
        metrics: [
          { label: 'Conversion', value: formatPercent(stats.convDecisionAction), icon: Zap, color: 'text-fuchsia-400' },
          { label: 'Win Rate', value: formatPercent(stats.winRate), icon: Activity, color: 'text-emerald-400' }
        ]
      };
      break;
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-[-100%] z-40 bg-slate-950/60 backdrop-blur-[2px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[300px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl p-5 overflow-hidden"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{content.title}</h3>
            <div className="text-3xl font-mono font-bold text-white mt-1">{content.count}</div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-6 border-l-2 border-slate-700 pl-3">
          {content.description}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {content.metrics.map((m, i) => (
            <div key={i} className="bg-slate-950/50 rounded-lg p-2 border border-slate-800">
              <div className="flex items-center gap-1.5 mb-1">
                <m.icon size={12} className={m.color} />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{m.label}</span>
              </div>
              <div className="text-sm font-bold text-white pl-0.5">{m.value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function GlassMetric({ icon: Icon, label, value, trend, color, delay, align = 'left' }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}
    >
      <div className="flex items-center space-x-2 mb-1">
        <div className={`p-1.5 rounded-md bg-slate-800/80 border border-slate-700 shadow-sm ${color}`}>
          <Icon size={14} />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-lg font-bold text-white tracking-tight drop-shadow-sm">{value}</span>
        <span className={`text-[10px] font-medium ${color}`}>{trend}</span>
      </div>
    </motion.div>
  );
}

function FloatingCard({ title, value, icon, className, delay = 0.5 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: className.includes('left') ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay, ease: "backOut" }}
      className={`hidden sm:flex items-center space-x-3 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 p-2 rounded-xl shadow-2xl z-20 ${className}`}
    >
      <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800 shadow-inner">
        {icon}
      </div>
      <div>
        <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{title}</div>
        <div className="text-xs font-bold text-white">{value}</div>
      </div>
    </motion.div>
  );
}

function FunnelStage({ id, isSelected, onClick, width, color, borderColor, label, count, icon, isLast = false }: any) {
  return (
    <motion.div 
      onClick={onClick}
      className={`relative h-16 ${width} rounded-2xl bg-gradient-to-br ${color} border ${isSelected ? 'border-white/50 ring-2 ring-white/10 ring-offset-2 ring-offset-slate-950' : borderColor} bg-slate-900/90 backdrop-blur-xl shadow-xl flex items-center justify-between px-4 sm:px-6 z-10 group overflow-hidden cursor-pointer transition-all duration-300`}
      whileHover={{ scale: 1.03 }}
      animate={{ scale: isSelected ? 1.05 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
        {/* Enhanced Inner glow effect */}
        <div className={`absolute inset-0 bg-white/10 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
        
        {/* Selection Indicator Dot */}
        {isSelected && (
          <motion.div 
            layoutId="active-indicator"
            className="absolute left-2 w-1 h-8 bg-white rounded-full shadow-[0_0_10px_white]" 
          />
        )}

        <div className={`flex items-center space-x-3 z-10 transition-transform duration-300 ${isSelected ? 'translate-x-2' : ''}`}>
            <div className={`p-1.5 sm:p-2 rounded-lg bg-slate-950/60 border border-white/10 text-white shadow-inner ring-1 ring-white/5`}>
                {icon}
            </div>
            <span className={`text-[10px] sm:text-xs font-bold tracking-widest ${isSelected ? 'text-white' : 'text-slate-300'}`}>{label}</span>
        </div>
        
        <div className="text-lg sm:text-xl font-mono font-bold text-white z-10 tabular-nums drop-shadow-lg tracking-tight">
            {count}
        </div>

        {/* Pseudo-isometric side lighting/depth */}
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-l from-white/10 to-transparent opacity-50" />
        {/* Top Highlight for 3D feel */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </motion.div>
  );
}

function ConversionConnector({ color, value }: { color: string, value: string }) {
    return (
        <div className="relative flex flex-col items-center justify-center h-6 z-0">
             <div className={`w-0.5 h-full ${color}`} />
             <div className="absolute bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-0.5 text-[10px] font-bold font-mono text-slate-400 shadow-xl ring-1 ring-slate-800 z-20">
                {value}
             </div>
        </div>
    )
}

function BottomMetricCard({ label, value, trend, trendUp, icon: Icon, color, delay, isInverseTrend }: any) {
    const trendColor = isInverseTrend 
        ? (trendUp ? 'text-rose-400' : 'text-emerald-400')
        : (trendUp ? 'text-emerald-400' : 'text-rose-400');
    
    const TrendIcon = trendUp ? TrendingUp : ArrowDown;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.5 }}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-lg hover:bg-slate-900/80 transition-colors group h-full"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                <Icon size={14} className={`${color} opacity-80 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
                <span className="text-lg font-bold text-white tabular-nums leading-none tracking-tight">{value}</span>
                <div className={`flex items-center text-[9px] w-fit font-bold ${trendColor} bg-slate-950/50 px-1.5 py-0.5 rounded border border-slate-800/50`}>
                    <TrendIcon size={10} className={`mr-1 ${!trendUp && !isInverseTrend ? 'rotate-0' : ''}`} />
                    {trend}
                </div>
            </div>
        </motion.div>
    )
}

function FunnelParticle({ particle }: { particle: Particle; key?: any }) {
    // We map the particle motion to the funnel shape roughly
    // y goes 0 to 100%
    // x converges from random start to 0
    
    // Duration based on speed
    const duration = 2.5; 
    
    // Color mapping - brighten up for visibility against dark bg
    const getColor = (type: Particle['type']) => {
        switch(type) {
            case 'lead': return 'bg-blue-300 shadow-[0_0_12px_rgba(147,197,253,1)]';
            case 'mql': return 'bg-indigo-300 shadow-[0_0_12px_rgba(165,180,252,1)]';
            case 'sql': return 'bg-violet-300 shadow-[0_0_12px_rgba(196,181,253,1)]';
            case 'deal': return 'bg-fuchsia-300 shadow-[0_0_12px_rgba(240,171,252,1)]';
        }
    };

    return (
        <motion.div
            className={`absolute w-1.5 h-1.5 rounded-full ${getColor(particle.type)} z-0`}
            initial={{ 
                top: "0%", 
                left: `calc(50% + ${particle.xStart * 150}px)`, 
                opacity: 0,
                scale: 0.5
            }}
            animate={{ 
                top: ["0%", "30%", "60%", "95%"], 
                left: [
                    `calc(50% + ${particle.xStart * 150}px)`, // Awareness
                    `calc(50% + ${particle.xStart * 120}px)`, // Interest
                    `calc(50% + ${particle.xStart * 90}px)`,  // Decision
                    `calc(50% + ${particle.xStart * 60}px)`   // Action
                ],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 1, 1.5]
            }}
            transition={{ 
                duration: duration, 
                ease: "linear",
                times: [0, 0.33, 0.66, 1]
            }}
        />
    )
}