export type CoreStatus = 'Active' | 'Inactive';

export type Biome = 'Icy' | 'Ocean' | 'Terran' | 'Barren' | 'Volcanic' | 'Gas Giant';

export interface PlanetState {
  distanceAU: number; // Astronomical Units
  massMearth: number; // Earth masses
  co2Percent: number; // 0 to 100
  waterPercent: number; // 0 to 100
  coreStatus: CoreStatus;
  year: number;
}

export interface SimulationResult {
  meanTempC: number;
  esi: number; // Earth Similarity Index (0.0 - 1.0)
  biome: Biome;
  atmosphereStripped: boolean;
  waterBoiled: boolean;
  waterFrozen: boolean;
}

export function simulatePlanetPhysics(state: PlanetState, timeStepYears: number): {
  newState: PlanetState;
  result: SimulationResult;
  eventsTriggered: string[];
} {
  const eventsTriggered: string[] = [];
  const newState = { ...state };

  // 1. Core & Atmospheric Retention
  let atmosphereStripped = false;
  if (newState.coreStatus === 'Inactive') {
    // If core is inactive, solar wind strips atmosphere over time.
    const degradationRate = (timeStepYears / 100000) * 5; // 5% lost per 100k years
    const previousCo2 = newState.co2Percent;
    newState.co2Percent = Math.max(0, newState.co2Percent - degradationRate);
    if (previousCo2 > 0 && newState.co2Percent === 0) {
      atmosphereStripped = true;
      eventsTriggered.push(`Atmosphere fully stripped away due to inactive core.`);
    }
  }

  // 2. Base Temperature from Distance (Simplified Inverse Square)
  // Earth is 288K (15C) at 1 AU with ~0.04% CO2. Without greenhouse, it'd be ~255K (-18C).
  // Assuming a Sun-like star.
  const solarConstantMultiplier = 1 / Math.pow(newState.distanceAU, 2);
  const baseTempK = 255 * Math.pow(solarConstantMultiplier, 0.25);
  let tempC = baseTempK - 273.15;

  // 3. Greenhouse Effect
  // Exponential or linear scaling: Venus has ~96% CO2 and +500C runaway greenhouse.
  // 100% CO2 -> roughly +450C.
  const greenhouseBonus = (newState.co2Percent / 100) * 450;
  tempC += greenhouseBonus;

  // 4. ESI Calculation (Simplified)
  // ESI favors ~15C temp, 1 Earth Mass.
  const tempDiff = Math.abs(tempC - 15) / 100;
  const massDiff = Math.abs(newState.massMearth - 1) / 3;
  let esi = 1.0 - (tempDiff + massDiff);
  esi = Math.max(0, Math.min(1, esi)); // Clamp between 0 and 1

  // 5. Water State
  let waterBoiled = false;
  let waterFrozen = false;
  if (tempC > 100 && newState.waterPercent > 0) {
    if (newState.year === 0 || state.year > 0) { // On transition
      // We will assume water percent slowly evaporates into space or stays as vapor
      // For visual biome representation, liquid water is gone.
    }
    waterBoiled = true;
  } else if (tempC <= 0 && newState.waterPercent > 0) {
    waterFrozen = true;
  }

  // 6. Biome Determination
  let biome: Biome = 'Barren';
  
  if (newState.massMearth > 10) {
    biome = 'Gas Giant';
  } else if (tempC > 200 || (tempC > 100 && newState.coreStatus === 'Active' && newState.co2Percent > 50)) {
    biome = 'Volcanic';
  } else if (waterBoiled) {
    biome = 'Barren';
  } else if (waterFrozen) {
    biome = 'Icy';
  } else if (newState.waterPercent > 50 && tempC > 0 && tempC < 100) {
    biome = 'Ocean';
  } else if (newState.waterPercent > 5 && tempC > 0 && tempC < 60) {
    biome = 'Terran';
  } else {
    biome = 'Barren';
  }

  // Check event triggers based on previous vs new
  if (tempC > 100 && tempC - greenhouseBonus < 100) {
    eventsTriggered.push('Runaway greenhouse effect triggered: Oceans boiled.');
  }

  return {
    newState,
    result: {
      meanTempC: parseFloat(tempC.toFixed(1)),
      esi: parseFloat(esi.toFixed(2)),
      biome,
      atmosphereStripped,
      waterBoiled,
      waterFrozen,
    },
    eventsTriggered
  };
}
