/**
 * Planetary Evolution AI Analyst
 * Generates educational explanations for planetary evolution simulations
 */

/**
 * Generate an educational report comparing initial and current planetary states
 * @param {Object} initialState - Initial planetary conditions
 * @param {Object} currentState - Current planetary conditions
 * @param {number} timeElapsed - Time elapsed in years
 * @returns {string} Educational report explaining the changes
 */
export function generateEvolutionReport(initialState, currentState, timeElapsed) {
  // Format large numbers for readability
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Helper to detect significant changes
  const hasChangedSignificantly = (initial, current, threshold = 5) => {
    return Math.abs(current - initial) > threshold;
  };

  // Helper to detect categorical changes
  const hasCategoryChanged = (initial, current) => {
    return initial !== current;
  };

  // Extract key parameters
  const {
    systemType: initialSystem,
    target: initialTarget,
    distance: initialDistance,
    mass: initialMass,
    co2: initialCo2,
    water: initialWater,
    coreStatus: initialCore
  } = initialState;

  const {
    systemType: currentSystem,
    target: currentTarget,
    distance: currentDistance,
    mass: currentMass,
    co2: currentCo2,
    water: currentWater,
    coreStatus: currentCore,
    temperature: currentTemp,
    biome: currentBiome
  } = currentState;

  // Build the report
  const changes = [];

  // System/target change
  if (initialSystem !== currentSystem || initialTarget !== currentTarget) {
    changes.push(`transitioned from ${initialSystem} ${initialTarget} to ${currentSystem} ${currentTarget}`);
  }

  // Environmental changes
  if (hasChangedSignificantly(initialDistance, currentDistance, 0.1)) {
    const direction = currentDistance > initialDistance ? 'increased' : 'decreased';
    changes.push(`${direction} distance from ${initialDistance.toFixed(2)}AU to ${currentDistance.toFixed(2)}AU`);
  }

  if (hasChangedSignificantly(initialMass, currentMass, 0.1)) {
    const direction = currentMass > initialMass ? 'increased' : 'decreased';
    changes.push(`${direction} mass from ${initialMass.toFixed(2)} to ${currentMass.toFixed(2)} Earth masses`);
  }

  if (hasChangedSignificantly(initialCo2, currentCo2, 5)) {
    const direction = currentCo2 > initialCo2 ? 'increased' : 'decreased';
    changes.push(`${direction} CO2 from ${initialCo2}% to ${currentCo2}%`);
  }

  if (hasChangedSignificantly(initialWater, currentWater, 5)) {
    const direction = currentWater > initialWater ? 'increased' : 'decreased';
    changes.push(`${direction} water content from ${initialWater}% to ${currentWater}%`);
  }

  if (initialCore !== currentCore) {
    changes.push(`changed core from ${initialCore} to ${currentCore}`);
  }

  // Result interpretation
  const tempChange = currentTemp - initialState.temperature;
  const biomeChanged = currentBiome !== initialState.biome;

  // Generate the report
  let report = '';

  if (changes.length > 0) {
    report += `You started with ${initialSystem} ${initialTarget}. `;

    if (changes.length === 1) {
      report += `By ${changes[0]}, `;
    } else if (changes.length === 2) {
      report += `By ${changes[0]} and ${changes[1]}, `;
    } else {
      report += `By ${changes.slice(0, -1).join(', ')}, and ${changes[changes.length - 1]}, `;
    }

    report += `over ${formatNumber(timeElapsed)} years, `;

    if (biomeChanged) {
      report += `this transformed the environment from ${initialState.biome} to ${currentBiome}.`;
    } else if (tempChange > 10) {
      report += `this significantly heated the planet.`;
    } else if (tempChange < -10) {
      report += `this significantly cooled the planet.`;
    } else {
      report += `these changes stabilized the planetary environment.`;
    }
  } else if (biomeChanged) {
    report += `Starting with ${initialSystem} ${initialTarget}, the environment naturally evolved to ${currentBiome} over ${formatNumber(timeElapsed)} years.`;
  } else {
    report += `With ${initialSystem} ${initialTarget}, the environment remained stable over ${formatNumber(timeElapsed)} years.`;
  }

  // Add temperature insight if significant change
  if (Math.abs(tempChange) > 20) {
    const tempDirection = tempChange > 0 ? 'warmed' : 'cooled';
    report += ` The surface temperature ${tempDirection} by ${Math.abs(tempChange).toFixed(0)}°C.`;
  }

  return report;
}