import React from 'react';
import DemandGenerationHero from './components/DemandGenerationHero';

export default function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-950 p-4">
      {/* Container simulating the 600x600 constraint mentioned in prompt, 
          but responsive to fit screen if smaller */}
      <div className="w-full max-w-[600px] aspect-square relative shadow-2xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <DemandGenerationHero />
      </div>
    </div>
  );
}