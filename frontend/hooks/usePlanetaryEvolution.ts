import { useState, useEffect, useCallback } from 'react';
import { PlanetState, SimulationResult, simulatePlanetPhysics } from '../utils/physicsEvolution';
import { analyzeEvolution } from '../utils/aiHeuristics';

export const PRESETS: Record<string, PlanetState> = {
  'Earth': { distanceAU: 1, massMearth: 1, co2Percent: 0.04, waterPercent: 71, coreStatus: 'Active', year: 0 },
  'Mars': { distanceAU: 1.52, massMearth: 0.11, co2Percent: 95, waterPercent: 0, coreStatus: 'Inactive', year: 0 },
  'Venus': { distanceAU: 0.72, massMearth: 0.81, co2Percent: 96, waterPercent: 0, coreStatus: 'Active', year: 0 },
  'Super-Earth': { distanceAU: 1.2, massMearth: 3.5, co2Percent: 10, waterPercent: 40, coreStatus: 'Active', year: 0 },
  'Hot Jupiter': { distanceAU: 0.05, massMearth: 317.8, co2Percent: 0, waterPercent: 0, coreStatus: 'Active', year: 0 },
  'Ice Giant': { distanceAU: 19.2, massMearth: 14.5, co2Percent: 1, waterPercent: 60, coreStatus: 'Active', year: 0 },
};

export function usePlanetaryEvolution() {
  const [initialState, setInitialState] = useState<PlanetState>(PRESETS['Earth']);
  const [currentState, setCurrentState] = useState<PlanetState>(PRESETS['Earth']);
  const [result, setResult] = useState<SimulationResult>({
    meanTempC: 15,
    esi: 1.0,
    biome: 'Terran',
    atmosphereStripped: false,
    waterBoiled: false,
    waterFrozen: false
  });
  
  const [systemType, setSystemType] = useState<'Solar System' | 'Exoplanet'>('Solar System');
  const [targetName, setTargetName] = useState('Earth');
  const [stepSize, setStepSize] = useState<number>(100000);
  
  const [eventLog, setEventLog] = useState<{year: number, message: string}[]>([]);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Re-calculate local physics any time state parameters change manually (sliders)
  useEffect(() => {
    const defaultInitialState = { ...PRESETS[targetName], year: currentState.year };
    // Simulate from state with 0 timestep just to get immediate visual result of sliders
    const out = simulatePlanetPhysics(currentState, 0);
    setResult(out.result);
  }, [currentState]);

  const loadPreset = (name: string) => {
    if (PRESETS[name]) {
      setTargetName(name);
      setInitialState({...PRESETS[name]});
      setCurrentState({...PRESETS[name]});
      setEventLog([{ year: 0, message: `Loaded ${name} preset.` }]);
      setAiReport(null);
    }
  };

  const advanceTime = useCallback((years: number) => {
    const { newState, result: newResult, eventsTriggered } = simulatePlanetPhysics(currentState, years);
    
    newState.year += years;
    setCurrentState(newState);
    setResult(newResult);
    
    if (eventsTriggered.length > 0) {
      const newLogs = eventsTriggered.map(msg => ({ year: newState.year, message: msg }));
      setEventLog(prev => [...newLogs, ...prev].slice(0, 50)); // keep last 50
    }
    setAiReport(null); // Reset AI report as time moved
  }, [currentState]);

  const updateParameter = <K extends keyof PlanetState>(key: K, value: PlanetState[K]) => {
    setCurrentState(prev => ({ ...prev, [key]: value }));
    setAiReport(null);
  };

  const analyzeWithAI = useCallback(() => {
    const startObj = { ...initialState, ...simulatePlanetPhysics(initialState, 0).result };
    const currentObj = { ...currentState, ...result };
    const report = analyzeEvolution(startObj, currentObj);
    setAiReport(report);
  }, [initialState, currentState, result]);

  return {
    systemType, setSystemType,
    targetName, setTargetName, loadPreset,
    currentState, updateParameter,
    result,
    stepSize, setStepSize, advanceTime,
    eventLog, 
    aiReport, analyzeWithAI
  };
}
