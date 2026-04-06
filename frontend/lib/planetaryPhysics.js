/**
 * Planetary Evolution Physics Utilities
 * Calculates temperature, atmospheric retention, and biome classification
 */

/**
 * Calculate base temperature using the inverse square law
 * @param {number} distanceFromStar - Distance from star in AU
 * @returns {number} Base temperature in Kelvin
 */
export function calculateBaseTemperature(distanceFromStar) {
  // Solar constant at Earth distance (1 AU) ~1361 W/m²
  const solarConstant = 1361;
  // Stefan-Boltzmann constant
  const sigma = 5.67e-8;

  // Inverse square law for radiation intensity
  const intensity = solarConstant / (distanceFromStar * distanceFromStar);

  // Effective temperature formula: T = (L / (16πσr²))^(1/4)
  // Simplified assuming albedo of 0.3 (Earth-like)
  const effectiveTemp = Math.pow(intensity * (1 - 0.3) / (4 * sigma), 0.25);

  return effectiveTemp;
}

/**
 * Calculate greenhouse effect multiplier
 * @param {number} co2Percentage - CO2 percentage in atmosphere
 * @returns {number} Temperature multiplier
 */
export function calculateGreenhouseMultiplier(co2Percentage) {
  // Logarithmic relationship for greenhouse effect
  // Based on climate science models
  const normalizedCo2 = co2Percentage / 100;
  return 1 + (Math.log(normalizedCo2 + 1) * 0.8);
}

/**
 * Check if planet can retain atmosphere based on mass and temperature
 * @param {number} mass - Planetary mass in Earth masses
 * @param {number} temperature - Surface temperature in Kelvin
 * @returns {boolean} Whether atmosphere is retained
 */
export function canRetainAtmosphere(mass, temperature) {
  // Escape velocity calculation (simplified)
  // v_escape = sqrt(2GM/r) - higher mass means higher escape velocity
  const escapeVelocityFactor = Math.sqrt(mass);

  // Jeans escape parameter - higher temperature makes escape easier
  const thermalEnergy = temperature / 1000;

  // Atmospheric retention threshold
  return escapeVelocityFactor > thermalEnergy * 0.8;
}

/**
 * Determine biome based on environmental conditions
 * @param {number} temperature - Surface temperature in Celsius
 * @param {number} waterPercentage - Water percentage
 * @param {number} co2Percentage - CO2 percentage
 * @param {string} coreStatus - Core status (Active/Inactive)
 * @returns {string} Biome classification
 */
export function determineBiome(temperature, waterPercentage, co2Percentage, coreStatus) {
  // Convert temperature to Celsius if needed
  const tempC = temperature;

  // Ice world
  if (tempC < -50) {
    return 'Frozen';
  }

  // Volcanic world
  if (coreStatus === 'Active' && co2Percentage > 50) {
    return 'Volcanic';
  }

  // Desert world
  if (waterPercentage < 10 && tempC > 30) {
    return 'Desert';
  }

  // Ocean world
  if (waterPercentage > 70) {
    if (tempC > 0 && tempC < 30) {
      return 'Oceanic';
    } else if (tempC >= 30) {
      return 'Steam';
    } else {
      return 'Ice Ocean';
    }
  }

  // Terran world
  if (waterPercentage >= 10 && waterPercentage <= 70 &&
      tempC >= -10 && tempC <= 50 &&
      co2Percentage >= 0.03 && co2Percentage <= 5) {
    return 'Terran';
  }

  // Barren world
  if (waterPercentage < 5 &&
      ((tempC > -30 && tempC < 100) || co2Percentage > 90)) {
    return 'Barren';
  }

  // Greenhouse world
  if (co2Percentage > 50 && tempC > 100) {
    return 'Greenhouse';
  }

  // Default fallback
  return 'Unknown';
}

/**
 * Calculate Earth Similarity Index (ESI)
 * @param {number} radius - Planetary radius in Earth radii
 * @param {number} density - Planetary density in g/cm³
 * @param {number} escapeVelocity - Escape velocity in km/s
 * @param {number} surfaceTemp - Surface temperature in K
 * @returns {number} ESI value (0.0 - 1.0)
 */
export function calculateESI(radius, density, escapeVelocity, surfaceTemp) {
  // Earth reference values
  const earthRadius = 1;
  const earthDensity = 5.51;
  const earthEscapeVelocity = 11.186;
  const earthSurfaceTemp = 288;

  // Weight factors for each parameter
  const weights = {
    radius: 0.57,
    density: 1.07,
    escapeVelocity: 0.70,
    surfaceTemp: 5.58
  };

  // Calculate individual similarities (0-1 scale)
  const radiusSimilarity = 1 - Math.abs(radius - earthRadius) / (radius + earthRadius);
  const densitySimilarity = 1 - Math.abs(density - earthDensity) / (density + earthDensity);
  const escapeVelocitySimilarity = 1 - Math.abs(escapeVelocity - earthEscapeVelocity) / (escapeVelocity + earthEscapeVelocity);
  const tempSimilarity = 1 - Math.abs(surfaceTemp - earthSurfaceTemp) / (surfaceTemp + earthSurfaceTemp);

  // Weighted geometric mean
  const weightedSum = (
    weights.radius * Math.log(radiusSimilarity) +
    weights.density * Math.log(densitySimilarity) +
    weights.escapeVelocity * Math.log(escapeVelocitySimilarity) +
    weights.surfaceTemp * Math.log(tempSimilarity)
  );

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  return Math.exp(weightedSum / totalWeight);
}