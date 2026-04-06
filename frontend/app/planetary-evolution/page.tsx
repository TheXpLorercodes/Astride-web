'use client';

import React from 'react';
import Planet3D from '../../components/PlanetaryEvolution/Planet3D';
import { usePlanetaryEvolution, PRESETS } from '../../hooks/usePlanetaryEvolution';
import Navbar from '../../components/Navbar/Navbar';

export default function PlanetaryEvolutionSimulator() {
  const {
    systemType, setSystemType,
    targetName, setTargetName, loadPreset,
    currentState, updateParameter,
    result,
    stepSize, setStepSize, advanceTime,
    eventLog, 
    aiReport, analyzeWithAI
  } = usePlanetaryEvolution();

  const handleSystemChange = (type: 'Solar System' | 'Exoplanet') => {
    setSystemType(type);
    if (type === 'Solar System') {
      loadPreset('Earth');
    } else {
      loadPreset('Super-Earth');
    }
  };

  const getSystemOptions = () => {
    return systemType === 'Solar System' 
      ? Object.keys(PRESETS).filter(p => ['Earth', 'Mars', 'Venus'].includes(p))
      : Object.keys(PRESETS).filter(p => ['Super-Earth', 'Hot Jupiter', 'Ice Giant'].includes(p));
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500 overflow-x-hidden font-sans">
      <Navbar />

      {/* Main Grid Wrapper */}
      <div className="pt-24 px-4 pb-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-6rem)]">
        
        {/* LEFT PANEL: Controls (Col Span 3) */}
        <section className="lg:col-span-3 flex flex-col space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <h2 className="text-xl font-bold tracking-wider mb-4 border-b border-white/10 pb-2">Target Selection</h2>
            <div className="flex bg-black/50 rounded-lg p-1 mb-4 select-none">
              <button 
                onClick={() => handleSystemChange('Solar System')}
                className={`flex-1 text-sm py-2 rounded-md transition-colors ${systemType === 'Solar System' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Solar System
              </button>
              <button 
                onClick={() => handleSystemChange('Exoplanet')}
                className={`flex-1 text-sm py-2 rounded-md transition-colors ${systemType === 'Exoplanet' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Exoplanet
              </button>
            </div>
            <select 
              value={targetName} 
              onChange={(e) => loadPreset(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-lg p-2.5 text-white outline-none focus:border-cyan-400 appearance-none transition-colors"
            >
              {getSystemOptions().map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <h2 className="text-xl font-bold tracking-wider mb-4 border-b border-white/10 pb-2">Environment</h2>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1 pointer-events-none">
                  <span>Distance (AU)</span>
                  <span>{currentState.distanceAU.toFixed(2)}</span>
                </div>
                <input type="range" min="0.05" max="30" step="0.01" 
                  value={currentState.distanceAU} onChange={e => updateParameter('distanceAU', parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1 pointer-events-none">
                  <span>Mass (M⊕)</span>
                  <span>{currentState.massMearth.toFixed(2)}</span>
                </div>
                <input type="range" min="0.01" max="15" step="0.01" 
                  value={currentState.massMearth} onChange={e => updateParameter('massMearth', parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1 pointer-events-none">
                  <span>CO₂ Atmosphere (%)</span>
                  <span>{currentState.co2Percent.toFixed(2)}%</span>
                </div>
                <input type="range" min="0" max="100" step="0.1" 
                  value={currentState.co2Percent} onChange={e => updateParameter('co2Percent', parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1 pointer-events-none">
                  <span>Surface Water (%)</span>
                  <span>{currentState.waterPercent.toFixed(1)}%</span>
                </div>
                <input type="range" min="0" max="100" step="1" 
                  value={currentState.waterPercent} onChange={e => updateParameter('waterPercent', parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1 pointer-events-none">
                  <span>Geomagnetic Core</span>
                </div>
                <select 
                  value={currentState.coreStatus}
                  onChange={(e) => updateParameter('coreStatus', e.target.value as any)}
                  className="w-full bg-black/50 border border-white/20 rounded-lg p-2 mb-2 text-sm text-white outline-none focus:border-cyan-400 appearance-none"
                >
                  <option value="Active">Active (Protected)</option>
                  <option value="Inactive">Inactive (Decaying)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* CENTER PANEL: 3D Visualization & AI Analyst (Col Span 6) */}
        <section className="lg:col-span-6 flex flex-col items-center justify-center relative rounded-2xl overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black border border-white/5 shadow-inner">
          <div className="absolute inset-0 w-full h-full"> 
             <Planet3D biome={result.biome} mass={currentState.massMearth} />
          </div>

          {/* AI Analyst Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-xl border border-indigo-500/30 rounded-xl p-4 shadow-lg z-10 transition-all">
            <div className="flex justify-between items-center mb-2">
              <h3 className="uppercase text-xs tracking-widest text-indigo-300 font-semibold flex items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                AI Analyst Module
              </h3>
              <button 
                onClick={analyzeWithAI}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-md transition-colors"
              >
                Analyze Changes
              </button>
            </div>
            {aiReport ? (
              <p className="text-sm text-gray-300 leading-relaxed font-light">{aiReport}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">Click 'Analyze Changes' to generate a heuristical report comparing baseline to current simulation state.</p>
            )}
          </div>
        </section>

        {/* RIGHT PANEL: Telemetry & Time (Col Span 3) */}
        <section className="lg:col-span-3 flex flex-col space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <h2 className="text-xl font-bold tracking-wider mb-4 border-b border-cyan-500/30 pb-2 flex justify-between">
              Telemetry 
              <span className="text-cyan-400 text-sm py-1 font-mono">{currentState.year.toLocaleString()} Yrs</span>
            </h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Mean Temp</div>
                <div className={`text-2xl font-black ${result.meanTempC > 50 ? 'text-red-400' : result.meanTempC < 0 ? 'text-blue-300' : 'text-emerald-400'}`}>
                  {result.meanTempC}°C
                </div>
              </div>
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">ESI</div>
                <div className="text-2xl font-black text-white">
                  {result.esi.toFixed(2)}
                </div>
              </div>
              <div className="col-span-2 bg-black/40 rounded-xl p-3 border border-white/5 mt-1">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Dominant Biome</div>
                <div className="text-xl font-medium tracking-wide text-cyan-200">
                  {result.biome}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <h2 className="text-lg font-bold tracking-wider mb-4 pb-2 border-b border-white/10">Time Controls</h2>
            <label className="text-xs text-gray-400 mb-2 block">Years / Step</label>
            <input 
              type="number" 
              value={stepSize}
              onChange={(e) => setStepSize(parseInt(e.target.value) || 0)}
              className="w-full bg-black/50 border border-white/20 rounded-lg p-2 mb-4 text-white font-mono text-center outline-none focus:border-cyan-400"
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button onClick={() => advanceTime(1000)} className="bg-white/10 hover:bg-white/20 text-xs py-2 rounded-lg transition-colors">+1k Yrs</button>
              <button onClick={() => advanceTime(1000000)} className="bg-white/10 hover:bg-white/20 text-xs py-2 rounded-lg transition-colors">+1M Yrs</button>
            </div>
            <button 
              onClick={() => advanceTime(stepSize)}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 text-sm rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] uppercase tracking-widest"
            >
              Advance Time
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex-1 flex flex-col min-h-[200px] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <h2 className="text-lg font-bold tracking-wider mb-4 pb-2 border-b border-white/10">Event Log</h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {eventLog.length === 0 ? (
                <div className="text-xs text-gray-500 italic text-center mt-4">Simulation initialized. Awaiting major ecological events...</div>
              ) : (
                eventLog.map((log, i) => (
                  <div key={i} className="text-xs border-l-2 border-cyan-500/50 pl-3">
                    <span className="text-cyan-400 font-mono text-[10px] block font-semibold mb-0.5">Yr {log.year.toLocaleString()}</span>
                    <span className="text-gray-300">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>
    </main>
  );
}
