import { PlanetState, SimulationResult } from './physicsEvolution';

export function analyzeEvolution(initialState: PlanetState & SimulationResult, currentState: PlanetState & SimulationResult): string {
  // Generates a 3-sentence heuristic explanation of what changed.
  
  let sent1 = '';
  let sent2 = '';
  let sent3 = '';

  // Sentence 1: Start state
  let targetName = 'a celestial body';
  if (initialState.massMearth === 1 && initialState.distanceAU === 1) targetName = 'an Earth-like planet';
  else if (initialState.distanceAU === 1.5) targetName = 'a Mars-like planet';
  else if (initialState.distanceAU < 0.8) targetName = 'a hot, inner-system planet';
  else if (initialState.distanceAU > 2) targetName = 'a distant, outer-system planet';

  sent1 = `You started with ${targetName}. `;

  // Sentence 2: The cause/action
  let actionStr = '';
  const causes = [];
  if (currentState.co2Percent > initialState.co2Percent + 10) causes.push('significantly increasing CO2 levels');
  else if (currentState.co2Percent < initialState.co2Percent - 10) causes.push('depleting the atmosphere');

  if (currentState.coreStatus === 'Inactive' && initialState.coreStatus === 'Active') causes.push('the planetary core cooling down');
  if (initialState.coreStatus === 'Inactive' && currentState.coreStatus === 'Inactive') causes.push('the lack of a magnetic field');

  if (causes.length > 0) {
    actionStr = `Over ${currentState.year.toLocaleString()} years, ${causes.join(' and ')} triggered a shift. `;
  } else if (currentState.year > 0) {
    actionStr = `Over ${currentState.year.toLocaleString()} years of natural evolution, conditions shifted. `;
  } else {
    actionStr = `The current environmental balance is fragile. `;
  }
  sent2 = actionStr;

  // Sentence 3: The effect
  if (currentState.biome === 'Volcanic' && initialState.biome !== 'Volcanic') {
    sent3 = `This created a runaway greenhouse effect, transforming the world into a volatile, volcanic wasteland.`;
  } else if (currentState.biome === 'Icy' && initialState.biome !== 'Icy') {
    sent3 = `The plummeting global temperatures caused profound glaciation, leaving the surface an icy tomb.`;
  } else if (currentState.biome === 'Barren' && initialState.biome !== 'Barren') {
    if (currentState.atmosphereStripped) {
      sent3 = `Solar winds stripped away the unprotected atmosphere, leaving behind a barren, irradiated rock.`;
    } else if (currentState.waterBoiled) {
      sent3 = `The extreme heat boiled away all surface water, reducing the world to a barren desert.`;
    } else {
      sent3 = `Without stable conditions, the planet morphed into a desolate, barren expanse.`;
    }
  } else if (currentState.biome === 'Terran' || currentState.biome === 'Ocean') {
    sent3 = `These stable conditions allowed liquid water to pool, resulting in a highly habitable ${currentState.biome} ecosystem.`;
  } else {
    sent3 = `The planet currently stabilizes as a ${currentState.biome} environment with a mean temperature of ${currentState.meanTempC}°C.`;
  }

  return sent1 + sent2 + sent3;
}
