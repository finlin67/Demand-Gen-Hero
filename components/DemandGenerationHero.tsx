import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  PieChart
} from 'lucide-react';

// --- Types ---

interface Particle {
  id: number;
  xStart: number; // -1 to 1 (normalized horizontal start)
  delay: number;
  speed: number;
  type: 'lead' | 'mql' | 'sql' | 'deal';
}

interface StatMetric {
  label: string;
  value: number;
  suffix: string;
  prefix: string;
  trend: number;
  color: string;
  icon: React.ElementType;
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
    convDecisionAction: 25.9
  });

  // Particle system state
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdCounter = useRef(0);

  // --- Logic: Particle Spawner ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Limit max particles to prevent DOM overload
      setParticles(prev => {
        const cleanup = prev.filter(p => p.delay + p.speed * 2000 > Date.now() - 3000); // Rough cleanup estimate logic or just limit count
        
        if (cleanup.length > 25) return cleanup;

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
            xStart: (Math.random() * 2 - 1) * 0.8, // Spread within 80% width
            delay: Date.now(), // timestamp for uniqueness/key
            speed: 2 + Math.random() * 2, // variable speed
            type
          }
        ];
      });
    }, 400); // Spawn rate

    return () => clearInterval(interval);
  }, []);

  // --- Logic: Metrics Simulator ---
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        impressions: prev.impressions + Math.floor(Math.random() * 15),
        leads: prev.leads + (Math.random() > 0.5 ? 1 : 0),
        opportunities: prev.opportunities + (Math.random() > 0.8 ? 1 : 0),
        revenue: prev.revenue + (Math.random() > 0.95 ? 120 : 0),
        cpl: Math.max(15, prev.cpl + (Math.random() - 0.5) * 0.1),
        cac: Math.max(800, prev.cac + (Math.random() - 0.5) * 2),
        convAwarenessInterest: Math.min(20, Math.max(10, prev.convAwarenessInterest + (Math.random() - 0.5) * 0.05)),
        convInterestDecision: Math.min(25, Math.max(12, prev.convInterestDecision + (Math.random() - 0.5) * 0.05)),
        convDecisionAction: Math.min(35, Math.max(15, prev.convDecisionAction + (Math.random() - 0.5) * 0.05)),
      }));
    }, 100);
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

  const formatPercent = (num: number) => {
      return num.toFixed(1) + '%';
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white relative overflow-hidden font-sans flex items-center justify-center select-none">
      
      {/* Background Grid & Accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/20 via-slate-950/0 to-slate-950/80 pointer-events-none" />

      {/* Safe Area Container */}
      <div className="w-[520px] h-[520px] relative flex flex-col items-center justify-between z-10">

        {/* --- Header / Top Section --- */}
        <div className="w-full flex justify-between items-start pt-4 px-2">
            {/* Left Column */}
            <div className="flex flex-col gap-5">
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

            {/* Right Column */}
            <div className="flex flex-col gap-5 items-end">
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

        {/* --- Main Funnel Visualization --- */}
        <div className="flex-1 w-full relative flex items-center justify-center my-4">
          
          {/* Funnel Container Isometric Tilt */}
          <div className="relative w-80 h-full max-h-[340px] perspective-[1000px] transform-style-3d">
             
             {/* Particles Layer (Behind glass) */}
             <div className="absolute inset-0 z-0 pointer-events-none">
               <AnimatePresence>
                 {particles.map(p => (
                   <FunnelParticle key={p.id} particle={p} />
                 ))}
               </AnimatePresence>
             </div>

             {/* Funnel SVG Layers */}
             <div className="relative w-full h-full flex flex-col items-center justify-center space-y-1 z-10">
                
                {/* Stage 1: Awareness */}
                <FunnelStage 
                  width="w-full" 
                  color="from-blue-500/20 to-blue-600/10" 
                  borderColor="border-blue-500/30"
                  label="Awareness"
                  count={formatNumber(stats.impressions)}
                  icon={<Users size={14} className="text-blue-300" />}
                />
                
                <ConversionConnector 
                    color="bg-blue-500/20" 
                    value={formatPercent(stats.convAwarenessInterest)} 
                />

                {/* Stage 2: Interest */}
                <FunnelStage 
                  width="w-4/5" 
                  color="from-indigo-500/20 to-indigo-600/10" 
                  borderColor="border-indigo-500/30"
                  label="Interest"
                  count={formatNumber(stats.leads)}
                  icon={<Filter size={14} className="text-indigo-300" />}
                />

                <ConversionConnector 
                    color="bg-indigo-500/20" 
                    value={formatPercent(stats.convInterestDecision)} 
                />

                {/* Stage 3: Decision */}
                <FunnelStage 
                  width="w-3/5" 
                  color="from-violet-500/20 to-violet-600/10" 
                  borderColor="border-violet-500/30"
                  label="Decision"
                  count={formatNumber(stats.opportunities)}
                  icon={<Target size={14} className="text-violet-300" />}
                />

                <ConversionConnector 
                    color="bg-violet-500/20" 
                    value={formatPercent(stats.convDecisionAction)} 
                />

                {/* Stage 4: Action */}
                <FunnelStage 
                  width="w-2/5" 
                  color="from-fuchsia-500/20 to-fuchsia-600/10" 
                  borderColor="border-fuchsia-500/30"
                  label="Action"
                  count={formatCurrency(stats.revenue * 1000)} // Simulating value
                  icon={<Zap size={14} className="text-fuchsia-300" />}
                  isLast
                />

             </div>
          </div>

          {/* Floating Context Cards (Absolute positioned around funnel) */}
          <FloatingCard 
            className="absolute left-[-24px] top-1/4"
            title="Lead Velocity"
            value="+24%"
            icon={<Activity size={16} className="text-sky-400" />}
          />

          <FloatingCard 
            className="absolute right-[-24px] bottom-1/3"
            title="Avg. Deal Size"
            value="$12.5k"
            icon={<PieChart size={16} className="text-purple-400" />}
            delay={1.5}
          />

        </div>

        {/* --- Bottom Section / Chart --- */}
        <div className="w-full h-16 relative mt-1 bg-slate-900/40 rounded-lg border border-slate-800 backdrop-blur-md overflow-hidden flex items-center px-4">
          <div className="flex flex-col z-10">
            <span className="text-xs text-slate-400 font-medium">Pipeline Velocity</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-white">$4.2M</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center">
                <ArrowDown size={10} className="rotate-180 mr-1" /> 8.4%
              </span>
            </div>
          </div>
          
          {/* Decorative Sparkline */}
          <div className="absolute right-0 bottom-0 w-2/3 h-full opacity-30">
             <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
               <motion.path
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 2, ease: "easeOut" }}
                 d="M0 50 C 40 50, 60 20, 100 30 C 140 40, 160 10, 200 5"
                 fill="none"
                 stroke="url(#gradient-spark)"
                 strokeWidth="3"
               />
               <defs>
                 <linearGradient id="gradient-spark" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#38bdf8" />
                   <stop offset="100%" stopColor="#818cf8" />
                 </linearGradient>
               </defs>
             </svg>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Sub-components ---

function GlassMetric({ icon: Icon, label, value, trend, color, delay, align = 'left' }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}
    >
      <div className="flex items-center space-x-2 mb-1">
        <div className={`p-1.5 rounded-md bg-slate-800/50 border border-slate-700 ${color}`}>
          <Icon size={14} />
        </div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-xl font-bold text-slate-100 tracking-tight">{value}</span>
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
      className={`flex items-center space-x-3 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 p-2.5 rounded-xl shadow-xl z-20 ${className}`}
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

function FunnelStage({ width, color, borderColor, label, count, icon, isLast = false }: any) {
  return (
    <motion.div 
      className={`relative h-14 ${width} rounded-xl bg-gradient-to-br ${color} border ${borderColor} backdrop-blur-md shadow-lg flex items-center justify-between px-4 z-10 group overflow-hidden`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="flex items-center space-x-3 z-10">
            <div className={`p-1.5 rounded-lg bg-slate-900/40 border border-white/10 text-white shadow-inner`}>
                {icon}
            </div>
            <span className="text-xs font-semibold text-slate-200 tracking-wide">{label}</span>
        </div>
        
        <div className="text-sm font-mono font-bold text-white z-10 tabular-nums">
            {count}
        </div>

        {/* Pseudo-isometric side lighting/depth */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/20 to-transparent opacity-30" />
    </motion.div>
  );
}

function ConversionConnector({ color, value }: { color: string, value: string }) {
    return (
        <div className="relative flex flex-col items-center justify-center h-5 z-0">
             <div className={`w-0.5 h-full ${color}`} />
             <div className="absolute bg-slate-950/90 border border-slate-700/50 rounded-full px-2 py-px text-[9px] font-mono text-slate-400 shadow-md">
                {value}
             </div>
        </div>
    )
}

function StreamConnector({ color }: { color: string }) {
    return (
        <div className={`w-1 h-3 ${color} rounded-full my-[-4px] z-0 blur-[1px]`} />
    )
}

function FunnelParticle({ particle }: { particle: Particle; key?: any }) {
    // We map the particle motion to the funnel shape roughly
    // y goes 0 to 100%
    // x converges from random start to 0
    
    // Duration based on speed
    const duration = 2.5; 
    
    // Color mapping
    const getColor = (type: Particle['type']) => {
        switch(type) {
            case 'lead': return 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]';
            case 'mql': return 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]';
            case 'sql': return 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]';
            case 'deal': return 'bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.6)]';
        }
    };

    return (
        <motion.div
            className={`absolute w-2 h-2 rounded-full ${getColor(particle.type)} z-0`}
            initial={{ 
                top: "0%", 
                left: `calc(50% + ${particle.xStart * 140}px)`, // Start wide
                opacity: 0,
                scale: 0.5
            }}
            animate={{ 
                top: ["0%", "30%", "60%", "95%"], 
                left: [
                    `calc(50% + ${particle.xStart * 140}px)`, // Awareness (Wide)
                    `calc(50% + ${particle.xStart * 100}px)`, // Interest
                    `calc(50% + ${particle.xStart * 60}px)`,  // Decision
                    `calc(50% + ${particle.xStart * 20}px)`   // Action (Narrow)
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